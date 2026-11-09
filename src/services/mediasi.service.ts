import { createClient } from '@supabase/supabase-js';
import { NotifikasiService } from './notifikasi.service'; // Sesuaikan path import

// Gunakan Service Role Key di backend agar operasi lintas user (admin/pelapor/terlapor) tidak terblokir RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class MediasiService {
  /**
   * 1. Dipanggil saat Admin menekan tombol "Mulai Mediasi" pada tiket laporan
   */
  static async mulaiMediasi(id_tiket: string, id_admin: string) {
    // A. Validasi & ambil data tiket laporan
    const { data: tiket, error: tiketError } = await supabaseAdmin
      .from('tiket_laporan')
      .select('id_tiket, id_pesanan, id_pelapor, id_terlapor, status_tiket')
      .eq('id_tiket', id_tiket)
      .single();

    if (tiketError || !tiket) {
      throw new Error('Tiket laporan tidak ditemukan.');
    }

    if (!tiket.id_terlapor) {
      throw new Error('Tiket laporan ini tidak memiliki pihak terlapor untuk dimediasi.');
    }

    // B. Validasi bahwa id_admin benar-benar terdaftar di tabel admin
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('admin')
      .select('id')
      .eq('id', id_admin)
      .single();

    if (adminError || !admin) {
      throw new Error('Akses ditolak: User bukan admin yang valid.');
    }

    // C. Cek apakah sudah ada sesi mediasi yang masih BERLANGSUNG untuk tiket ini
    const { data: existingSesi } = await supabaseAdmin
      .from('sesi_mediasi')
      .select('*')
      .eq('id_tiket', id_tiket)
      .eq('status_sesi', 'BERLANGSUNG')
      .maybeSingle();

    if (existingSesi) {
      return {
        is_new: false,
        sesi: existingSesi,
      };
    }

    // D. Buat sesi mediasi baru
    const { data: sesiBaru, error: insertSesiError } = await supabaseAdmin
      .from('sesi_mediasi')
      .insert({
        id_tiket,
        id_admin,
        status_sesi: 'BERLANGSUNG',
      })
      .select()
      .single();

    if (insertSesiError || !sesiBaru) {
      throw new Error(`Gagal membuat sesi mediasi: ${insertSesiError?.message}`);
    }

    // E. Kirim pesan pembuka otomatis dari Admin
    const pesanPembuka = `Halo, sesi mediasi untuk tiket laporan #${id_tiket.slice(0, 8)} telah dibuka oleh Admin. Silakan sampaikan kronologi dan bukti masing-masing secara jelas.`;

    const { data: pesanAwal, error: insertPesanError } = await supabaseAdmin
      .from('pesan_mediasi')
      .insert({
        id_sesi_mediasi: sesiBaru.id_sesi_mediasi,
        id_pengirim: id_admin, // Valid karena admin.id REFERENCES pengguna(id)
        isi_pesan: pesanPembuka,
      })
      .select()
      .single();

    if (insertPesanError) {
      // Rollback manual jika pesan pembuka gagal dibuat
      await supabaseAdmin
        .from('sesi_mediasi')
        .delete()
        .eq('id_sesi_mediasi', sesiBaru.id_sesi_mediasi);
      throw new Error(`Gagal membuat pesan awal mediasi: ${insertPesanError.message}`);
    }

    // F. Kirim notifikasi ke Pelapor dan Terlapor menggunakan NotifikasiService existing
    const daftarPenerima = [tiket.id_pelapor, tiket.id_terlapor];

    await Promise.all(
      daftarPenerima.map((id_pengguna) =>
        NotifikasiService.kirimNotifikasi({
          id_pengguna,
          judul: 'Sesi Mediasi Dimulai',
          pesan_notifikasi:
            'Admin telah membuka ruang obrolan mediasi bertiga untuk menyelesaikan laporan pesanan Anda.',
          id_pesanan: tiket.id_pesanan,
          id_referensi: sesiBaru.id_sesi_mediasi,
        })
      )
    );

    return {
      is_new: true,
      sesi: sesiBaru,
      pesan_awal: pesanAwal,
    };
  }

  /**
   * 2. Dipanggil saat Admin, Pelapor, atau Terlapor mengirim pesan di ruang mediasi
   */
  static async kirimPesanMediasi(
    id_sesi_mediasi: string,
    id_pengirim: string,
    isi_pesan: string
  ) {
    if (!isi_pesan || !isi_pesan.trim()) {
      throw new Error('Isi pesan tidak boleh kosong.');
    }

    // A. Ambil data sesi + relasi tiket_laporan untuk mengetahui ke-3 peserta
    const { data: sesi, error: sesiError } = await supabaseAdmin
      .from('sesi_mediasi')
      .select(`
        id_sesi_mediasi,
        id_admin,
        status_sesi,
        tiket_laporan (
          id_tiket,
          id_pesanan,
          id_pelapor,
          id_terlapor
        )
      `)
      .eq('id_sesi_mediasi', id_sesi_mediasi)
      .single();

    if (sesiError || !sesi) {
      throw new Error('Sesi mediasi tidak ditemukan.');
    }

    if (sesi.status_sesi !== 'BERLANGSUNG') {
      throw new Error('Sesi mediasi telah selesai. Tidak dapat mengirim pesan lagi.');
    }

    const tiket = Array.isArray(sesi.tiket_laporan)
      ? sesi.tiket_laporan[0]
      : sesi.tiket_laporan;

    // B. Validasi bahwa id_pengirim adalah salah satu dari 3 peserta sah
    const semuaPeserta = [sesi.id_admin, tiket.id_pelapor, tiket.id_terlapor].filter(
      Boolean
    ) as string[];

    if (!semuaPeserta.includes(id_pengirim)) {
      throw new Error('Akses ditolak: Anda bukan peserta dalam sesi mediasi ini.');
    }

    // C. Simpan pesan ke tabel pesan_mediasi (otomatis ter-broadcast via Supabase Realtime)
    const { data: pesanBaru, error: insertError } = await supabaseAdmin
      .from('pesan_mediasi')
      .insert({
        id_sesi_mediasi,
        id_pengirim,
        isi_pesan: isi_pesan.trim(),
      })
      .select(`
        id_pesan,
        id_sesi_mediasi,
        id_pengirim,
        isi_pesan,
        waktu_kirim,
        pengguna:id_pengirim (
          id,
          nama,
          role
        )
      `)
      .single();

    if (insertError || !pesanBaru) {
      throw new Error(`Gagal mengirim pesan: ${insertError?.message}`);
    }

    // D. Kirim notifikasi ke 2 peserta lainnya (selain pengirim)
    const pengirimInfo = Array.isArray(pesanBaru.pengguna)
      ? pesanBaru.pengguna[0]
      : pesanBaru.pengguna;
    const namaPengirim = pengirimInfo?.nama || 'Peserta';

    const penerimaNotifikasi = semuaPeserta.filter((id) => id !== id_pengirim);

    await Promise.all(
      penerimaNotifikasi.map((id_pengguna) =>
        NotifikasiService.kirimNotifikasi({
          id_pengguna,
          judul: `Pesan Mediasi dari ${namaPengirim}`,
          pesan_notifikasi:
            isi_pesan.length > 80 ? `${isi_pesan.substring(0, 80)}...` : isi_pesan,
          id_pesanan: tiket.id_pesanan,
          id_referensi: id_sesi_mediasi,
        })
      )
    );

    return pesanBaru;
  }

  /**
   * 3. Mengambil daftar sesi mediasi yang diikuti user (untuk ditampilkan di list chat)
   */
  static async getDaftarMediasiUser(id_pengguna: string) {
    const { data, error } = await supabaseAdmin
      .from('sesi_mediasi')
      .select(`
        id_sesi_mediasi,
        id_tiket,
        id_admin,
        status_sesi,
        waktu_mulai,
        waktu_selesai,
        tiket_laporan!inner (
          id_tiket,
          id_pesanan,
          id_pelapor,
          id_terlapor,
          deskripsi_laporan,
          pelapor:id_pelapor ( id, nama ),
          terlapor:id_terlapor ( id, nama )
        ),
        pesan_mediasi (
          isi_pesan,
          waktu_kirim
        )
      `)
      .order('waktu_mulai', { ascending: false });

    if (error) {
      throw new Error(`Gagal mengambil daftar sesi mediasi: ${error.message}`);
    }

    // Filter sesi di mana user menjadi salah satu dari 3 peserta
    return (data || [])
      .filter((sesi: any) => {
        const tiket = Array.isArray(sesi.tiket_laporan)
          ? sesi.tiket_laporan[0]
          : sesi.tiket_laporan;

        return (
          sesi.id_admin === id_pengguna ||
          tiket?.id_pelapor === id_pengguna ||
          tiket?.id_terlapor === id_pengguna
        );
      })
      .map((sesi: any) => {
        const sortedPesan = (sesi.pesan_mediasi || []).sort(
          (a: any, b: any) =>
            new Date(b.waktu_kirim).getTime() - new Date(a.waktu_kirim).getTime()
        );
        const pesanTerakhir = sortedPesan[0] || null;

        return {
          ...sesi,
          pesan_terakhir: pesanTerakhir?.isi_pesan || null,
          waktu_pesan_terakhir: pesanTerakhir?.waktu_kirim || sesi.waktu_mulai,
          pesan_mediasi: undefined,
        };
      });
  }

  /**
   * 4. Mengambil detail sesi & riwayat pesan lengkap dengan label peran (ADMIN / PELAPOR / TERLAPOR)
   */
  static async getDetailDanPesanMediasi(
    id_sesi_mediasi: string,
    id_pengguna_request: string
  ) {
    const { data: sesi, error: sesiError } = await supabaseAdmin
      .from('sesi_mediasi')
      .select(`
        *,
        tiket_laporan (
          id_tiket,
          id_pesanan,
          id_pelapor,
          id_terlapor,
          deskripsi_laporan,
          status_tiket,
          pelapor:id_pelapor ( id, nama ),
          terlapor:id_terlapor ( id, nama )
        ),
        admin:id_admin (
          id,
          pengguna ( id, nama )
        )
      `)
      .eq('id_sesi_mediasi', id_sesi_mediasi)
      .single();

    if (sesiError || !sesi) {
      throw new Error('Sesi mediasi tidak ditemukan.');
    }

    const tiket = Array.isArray(sesi.tiket_laporan)
      ? sesi.tiket_laporan[0]
      : sesi.tiket_laporan;

    // Validasi hak akses
    const pesertaSah = [sesi.id_admin, tiket.id_pelapor, tiket.id_terlapor];
    if (!pesertaSah.includes(id_pengguna_request)) {
      throw new Error('Akses ditolak: Anda tidak memiliki akses ke ruang mediasi ini.');
    }

    // Ambil seluruh pesan mediasi
    const { data: pesanList, error: pesanError } = await supabaseAdmin
      .from('pesan_mediasi')
      .select(`
        id_pesan,
        id_sesi_mediasi,
        id_pengirim,
        isi_pesan,
        waktu_kirim,
        pengguna:id_pengirim (
          id,
          nama
        )
      `)
      .eq('id_sesi_mediasi', id_sesi_mediasi)
      .order('waktu_kirim', { ascending: true });

    if (pesanError) {
      throw new Error(`Gagal memuat pesan mediasi: ${pesanError.message}`);
    }

    // Tambahkan tag peran_di_mediasi agar UI mudah membedakan balon chat Admin, Pelapor, & Terlapor
    const formattedPesan = (pesanList || []).map((msg: any) => {
      const userObj = Array.isArray(msg.pengguna) ? msg.pengguna[0] : msg.pengguna;
      let peran_di_mediasi: 'ADMIN' | 'PELAPOR' | 'TERLAPOR' = 'PELAPOR';

      if (msg.id_pengirim === sesi.id_admin) {
        peran_di_mediasi = 'ADMIN';
      } else if (msg.id_pengirim === tiket.id_terlapor) {
        peran_di_mediasi = 'TERLAPOR';
      }

      return {
        id_pesan: msg.id_pesan,
        id_sesi_mediasi: msg.id_sesi_mediasi,
        id_pengirim: msg.id_pengirim,
        nama_pengirim: userObj?.nama || 'Pengguna',
        peran_di_mediasi,
        isi_pesan: msg.isi_pesan,
        waktu_kirim: msg.waktu_kirim,
      };
    });

    return {
      sesi,
      pesan: formattedPesan,
    };
  }

  /**
   * 5. Admin menutup sesi mediasi
   */
  static async selesaikanMediasi(id_sesi_mediasi: string, id_admin: string) {
    const { data: sesi, error } = await supabaseAdmin
      .from('sesi_mediasi')
      .update({
        status_sesi: 'SELESAI',
        waktu_selesai: new Date().toISOString(),
      })
      .eq('id_sesi_mediasi', id_sesi_mediasi)
      .eq('id_admin', id_admin)
      .eq('status_sesi', 'BERLANGSUNG')
      .select(`
        *,
        tiket_laporan ( id_pesanan, id_pelapor, id_terlapor )
      `)
      .single();

    if (error || !sesi) {
      throw new Error('Gagal menutup sesi mediasi atau sesi sudah selesai.');
    }

    // Kirim pesan penutup sistem dari Admin
    await supabaseAdmin.from('pesan_mediasi').insert({
      id_sesi_mediasi,
      id_pengirim: id_admin,
      isi_pesan: 'Sesi mediasi telah diakhiri oleh Admin.',
    });

    return sesi;
  }
}