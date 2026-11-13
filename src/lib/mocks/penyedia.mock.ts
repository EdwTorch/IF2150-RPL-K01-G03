import type { ProfilPenyedia } from '@/services/penyedia.service';

// Data fiktif untuk mode NEXT_PUBLIC_USE_MOCK=true. ID sama dengan lib/mocks/jasa.mock.ts
export const mockProfilPenyediaList: ProfilPenyedia[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    nama: 'Budi Santoso',
    pengalaman: ['Desainer grafis lepas, 2023–sekarang', 'Staf desain di [Studio Fiktif], 2021–2023'],
    prestasi: ['Juara 2 lomba desain poster [Kampus Fiktif] 2024'],
    rating_rata_rata: 4.7,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    nama: 'Sari Dewi',
    pengalaman: ['Web developer lepas, 2022–sekarang'],
    prestasi: [],
    rating_rata_rata: 4.9,
  },
];