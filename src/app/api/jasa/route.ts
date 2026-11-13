import { NextResponse } from 'next/server';
import { mockJasaList } from '@/lib/mocks/jasa.mock';
import { JasaController, type DataJasaBaru } from '@/services/jasa.service';
import { getSessionUser } from '@/services/auth.service';
import {
  LayananPembandingJasa,
  LayananPencarian,
  type FilterPencarian,
  type UrutanPencarian,
} from '@/services/pencarian.service';
import { bacaInputJasa, isMock, responsGagal } from './helper';
import { PenyediaJasaService } from '@/services/penyedia.service';

// Query param angka opsional; undefined jika tidak ada, NaN (ditolak validasi) jika bukan angka
const angka = (p: URLSearchParams, k: string) => (p.get(k) ? Number(p.get(k)) : undefined);

// GET /api/jasa - katalog + pencarian multi-kriteria (UC05, C17) + komparasi ?compare=id1,id2 (C18)
export async function GET(request: Request) {
  try {
    const p = new URL(request.url).searchParams;

    const compare = p.get('compare');
    if (compare) {
      const ids = compare.split(',').map((s) => s.trim()).filter(Boolean);
      const data = isMock()
        ? LayananPembandingJasa.susunMatriks(mockJasaList, ids)
        : await LayananPembandingJasa.bandingkanSpesifikasiJasa(ids);
      return NextResponse.json({ success: true, message: 'Perbandingan jasa berhasil disusun', data });
    }

    const filter: FilterPencarian = {
      keyword: p.get('q') ?? p.get('keyword') ?? undefined,
      kategori: p.get('kategori') ?? undefined,
      harga_min: angka(p, 'harga_min'),
      harga_max: angka(p, 'harga_max'),
      rating_min: angka(p, 'rating_min'),
      rating_max: angka(p, 'rating_max'),
      urutkan: (p.get('sort') ?? p.get('urutkan') ?? undefined) as UrutanPencarian | undefined,
      limit: angka(p, 'limit'),
    };

    let data;
    if (isMock()) {
      LayananPencarian.validasiFilter(filter);
      data = LayananPencarian.saringDanUrutkan(mockJasaList, filter);
    } else {
            const hasil = await LayananPencarian.terapkanFilterPencarian(filter);
      const nama = await PenyediaJasaService.ambilNamaPenyedia(hasil.map((j) => j.id_penyedia_jasa));
      data = hasil.map((j) => ({ ...j, nama_penyedia: nama[j.id_penyedia_jasa] ?? null }));
    }
    const message = data.length ? 'Data penawaran jasa berhasil diambil' : 'Data jasa tidak ditemukan';
    return NextResponse.json({ success: true, message, data });
  } catch (err) {
    return responsGagal(err);
  }
}

// POST /api/jasa - unggah penawaran jasa baru (UC04). JSON atau multipart (field "berkas")
export async function POST(request: Request) {
  try {
    const { data, berkas } = await bacaInputJasa(request);
    const input = data as unknown as DataJasaBaru;

    if (isMock()) {
      if (!JasaController.validasiDataJasa(input)) {
        throw new Error('Data penawaran jasa tidak valid atau tidak lengkap');
      }
      if (!input.id_penyedia_jasa) {
        throw new Error('id_penyedia_jasa tidak valid');
      }

      const id_jasa = crypto.randomUUID();
      const mockJasa = {
        ...input,
        nama_jasa: input.nama_jasa.trim(),
        deskripsi: input.deskripsi.trim(),
        kategori: input.kategori.trim(),
        id_jasa,
        rating_rata_rata: 0,
        status_aktif: true,
        berkas_pendukung: input.berkas_pendukung ?? [],
        created_at: new Date().toISOString(),
      };
      mockJasaList.unshift(mockJasa);

      return NextResponse.json(
        { success: true, message: 'Penawaran jasa berhasil diunggah', data: mockJasa },
        { status: 201 }
      );
    }

    // Mode non-mock: autentikasi & otorisasi
    const user = await getSessionUser();
    if (!user) {
      throw new Error('Autentikasi diperlukan: silakan login terlebih dahulu');
    }
    if (!user.isPenyediaJasa) {
      throw new Error('Akses ditolak: Hanya penyedia jasa yang dapat menambahkan penawaran jasa');
    }

    // Jika body mengirim id_penyedia_jasa yang berbeda dari user.id, tolak
    if (input.id_penyedia_jasa && input.id_penyedia_jasa !== user.id) {
      throw new Error('Akses ditolak: Anda tidak dapat membuat jasa atas nama penyedia lain');
    }

    input.id_penyedia_jasa = user.id;

    if (!JasaController.validasiDataJasa(input)) {
      throw new Error('Data penawaran jasa tidak valid atau tidak lengkap');
    }

    const jasa = await JasaController.simpanPenawaranJasa(input, berkas);

    return NextResponse.json(
      { success: true, message: 'Penawaran jasa berhasil diunggah', data: jasa },
      { status: 201 }
    );
  } catch (err) {
    return responsGagal(err);
  }
}
