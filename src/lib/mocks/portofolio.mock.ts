import type { DataPortofolio } from '@/services/portofolio.service';

// Data fiktif untuk mode NEXT_PUBLIC_USE_MOCK=true. PENYEDIA_1 sama dengan lib/mocks/jasa.mock.ts
const PENYEDIA_1 = '11111111-1111-4111-8111-111111111111';

export const mockPortofolio: DataPortofolio & { id_penyedia_jasa: string } = {
  id_penyedia_jasa: PENYEDIA_1,
  pengalaman: ['Desainer grafis lepas, 2023–sekarang', 'Staf desain di [Studio Fiktif], 2021–2023'],
  prestasi: ['Juara 2 lomba desain poster [Kampus Fiktif] 2024'],
  daftar_karya: [
    {
      id_portofolio: 'b0000000-0000-4000-8000-000000000001',
      id_penyedia_jasa: PENYEDIA_1,
      judul: 'Logo kedai kopi [Fiktif]',
      deskripsi: 'Logo dan panduan warna untuk kedai kopi lokal.',
      berkas_pendukung: '/uploads/portofolio/logo-kedai.png',
      created_at: '2026-11-01T08:00:00+07:00',
    },
  ],
};