import type { Bookmark } from '@/models/types';
import { mockJasaList } from './jasa.mock';

export const PENGGUNA_JASA_1 = '33333333-3333-4333-8333-333333333333';
export const PENGGUNA_JASA_2 = '44444444-4444-4444-8444-444444444444';

export const mockBookmarkList: Bookmark[] = [
  {
    id_bookmark: 'b0000000-0000-4000-8000-000000000001',
    id_pengguna_jasa: PENGGUNA_JASA_1,
    id_jasa: mockJasaList[0].id_jasa,
    waktu_disimpan: '2026-11-05T10:00:00+07:00',
    created_at: '2026-11-05T10:00:00+07:00',
    jasa: mockJasaList[0],
  },
  {
    id_bookmark: 'b0000000-0000-4000-8000-000000000002',
    id_pengguna_jasa: PENGGUNA_JASA_1,
    id_jasa: mockJasaList[2].id_jasa,
    waktu_disimpan: '2026-11-06T14:30:00+07:00',
    created_at: '2026-11-06T14:30:00+07:00',
    jasa: mockJasaList[2],
  },
];
