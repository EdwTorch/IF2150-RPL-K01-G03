import { createClient as createAdminClient } from '@supabase/supabase-js';

// Profil publik penyedia jasa (C02): hanya kolom yang aman ditampilkan ke pengguna lain
export interface ProfilPenyedia {
  id: string;
  nama: string;
  pengalaman: string[];
  prestasi: string[];
  rating_rata_rata: number;
}

const POLA_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Admin client (SECRET KEY, hanya di server).
 * Dipakai karena tabel penyedia_jasa juga berisi `saldo`: daripada membuka RLS untuk semua orang,
 * server membaca dengan admin client lalu HANYA mengembalikan kolom publik.
 */
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Konfigurasi Supabase tidak lengkap');
  return createAdminClient<any>(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// C02 PenyediaJasa — getPengalamandanPrestasi() versi publik
export class PenyediaJasaService {
  static validasiId(id_penyedia_jasa?: string): string {
    const id = id_penyedia_jasa?.trim() ?? '';
    if (!POLA_UUID.test(id)) throw new Error('ID penyedia jasa tidak valid');
    return id;
  }

  // Inti murni untuk mode mock & unit test
  static cariDiMemori(daftar: ProfilPenyedia[], id_penyedia_jasa: string): ProfilPenyedia {
    const id = this.validasiId(id_penyedia_jasa);
    const profil = daftar.find((p) => p.id === id);
    if (!profil) throw new Error('Data penyedia jasa tidak ditemukan');
    return profil;
  }

  static async getProfilPublik(id_penyedia_jasa: string): Promise<ProfilPenyedia> {
    const id = this.validasiId(id_penyedia_jasa);
    const supabase = adminClient();

    // penyedia_jasa.id → pengguna.id (FK), jadi nama bisa di-join langsung
    const { data, error } = await supabase
      .from('penyedia_jasa')
      .select('id, pengalaman, prestasi, rating_rata_rata, pengguna ( nama, status_akun )')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Data penyedia jasa tidak ditemukan');

    const pengguna = (Array.isArray(data.pengguna) ? data.pengguna[0] : data.pengguna) as
      | { nama: string; status_akun: boolean | null }
      | null;
    if (!pengguna || pengguna.status_akun === false) throw new Error('Data penyedia jasa tidak ditemukan');

    return {
      id: data.id,
      nama: pengguna.nama,
      pengalaman: data.pengalaman ?? [],
      prestasi: data.prestasi ?? [],
      rating_rata_rata: Number(data.rating_rata_rata ?? 0),
    };
  }
}