import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChatService } from '@/services/chat.service';
import { createClient } from '@/lib/supabase/server';
import { NotifikasiService } from '@/services/notifikasi.service';

// Mock Supabase client & NotifikasiService
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/services/notifikasi.service', () => ({
  NotifikasiService: {
    kirimNotifikasi: vi.fn().mockResolvedValue(true),
  },
}));

describe('ChatService', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
      maybeSingle: vi.fn(),
    };

    (createClient as any).mockResolvedValue(mockSupabase);
  });

  // ==========================================
  // 1. Test getDaftarChatroom
  // ==========================================
  describe('getDaftarChatroom', () => {
    it('harus mengembalikan daftar chatroom milik user', async () => {
      const mockChatrooms = [
        { id_chatroom: 'room-1', id_pengguna_jasa: 'user-1', id_penyedia_jasa: 'seller-1' },
      ];
      mockSupabase.order.mockResolvedValueOnce({ data: mockChatrooms, error: null });

      const res = await ChatService.getDaftarChatroom('user-1');

      expect(res).toEqual(mockChatrooms);
      expect(mockSupabase.from).toHaveBeenCalledWith('chatroom');
      expect(mockSupabase.or).toHaveBeenCalledWith('id_pengguna_jasa.eq.user-1,id_penyedia_jasa.eq.user-1');
    });

    it('harus melempar error jika query memuat obrolan gagal', async () => {
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: { message: 'Database failure' } });

      await expect(ChatService.getDaftarChatroom('user-1')).rejects.toThrow(
        'Gagal memuat daftar obrolan: Database failure'
      );
    });
  });

  // ==========================================
  // 2. Test getOrCreateChatroom
  // ==========================================
  describe('getOrCreateChatroom', () => {
    it('harus throw error jika id_pengguna_jasa sama dengan id_penyedia_jasa', async () => {
      await expect(
        ChatService.getOrCreateChatroom('user-1', 'user-1')
      ).rejects.toThrow('Tidak dapat membuat ruang obrolan dengan diri sendiri.');
    });

    it('harus mengembalikan chatroom yang sudah ada jika ditemukan', async () => {
      const mockExisting = { id_chatroom: 'room-exist', id_pengguna_jasa: 'u1', id_penyedia_jasa: 'p1' };
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: mockExisting, error: null });

      const res = await ChatService.getOrCreateChatroom('u1', 'p1');

      expect(res).toEqual(mockExisting);
      expect(mockSupabase.insert).not.toHaveBeenCalled();
    });

    it('harus membuat chatroom baru jika belum ada', async () => {
      const mockCreated = { id_chatroom: 'room-new', id_pengguna_jasa: 'u1', id_penyedia_jasa: 'p1' };

      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
      mockSupabase.single.mockResolvedValueOnce({ data: mockCreated, error: null });

      const res = await ChatService.getOrCreateChatroom('u1', 'p1');

      expect(res).toEqual(mockCreated);
      expect(mockSupabase.insert).toHaveBeenCalledWith([{ id_pengguna_jasa: 'u1', id_penyedia_jasa: 'p1' }]);
    });

    it('harus throw error jika gagal membuat chatroom baru saat insert', async () => {
      mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'Insert failed' } });

      await expect(ChatService.getOrCreateChatroom('u1', 'p1')).rejects.toThrow(
        'Gagal membuat ruang obrolan: Insert failed'
      );
    });
  });

  // ==========================================
  // 3. Test getRiwayatPesan & validasiAksesChatroom
  // ==========================================
  describe('getRiwayatPesan', () => {
    it('harus throw error jika chatroom tidak ditemukan', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

      await expect(ChatService.getRiwayatPesan('room-invalid', 'user-1')).rejects.toThrow(
        'Ruang obrolan tidak ditemukan.'
      );
    });

    it('harus throw error jika user bukan peserta chatroom', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id_chatroom: 'room-1', id_pengguna_jasa: 'u1', id_penyedia_jasa: 'p1' },
      });

      await expect(ChatService.getRiwayatPesan('room-1', 'stranger-user')).rejects.toThrow(
        'Akses ditolak. Anda bukan peserta ruang obrolan ini.'
      );
    });

    it('harus mengembalikan riwayat pesan jika user adalah peserta chatroom', async () => {
      const mockChatRoom = { id_chatroom: 'room-1', id_pengguna_jasa: 'u1', id_penyedia_jasa: 'p1' };
      const mockMessages = [{ id_pesan: 'm1', isi_pesan: 'Halo' }];

      mockSupabase.single.mockResolvedValueOnce({ data: mockChatRoom, error: null });
      mockSupabase.order.mockResolvedValueOnce({ data: mockMessages, error: null });

      const res = await ChatService.getRiwayatPesan('room-1', 'u1');

      expect(res).toEqual(mockMessages);
      expect(mockSupabase.from).toHaveBeenCalledWith('pesan_chat');
    });

    it('harus throw error jika query memuat riwayat pesan gagal', async () => {
      mockSupabase.single.mockResolvedValueOnce({
        data: { id_chatroom: 'room-1', id_pengguna_jasa: 'u1', id_penyedia_jasa: 'p1' },
      });
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });

      await expect(ChatService.getRiwayatPesan('room-1', 'u1')).rejects.toThrow(
        'Gagal memuat pesan: DB Error'
      );
    });
  });

  // ==========================================
  // 4. Test kirimPesan
  // ==========================================
  describe('kirimPesan', () => {
    it('harus throw error jika isi_pesan dan lampiran keduanya kosong', async () => {
      await expect(
        ChatService.kirimPesan('room-1', 'user-1', '   ', null)
      ).rejects.toThrow('Isi pesan tidak boleh kosong.');
    });

    it('harus berhasil mengirim pesan berupa lampiran saja tanpa teks', async () => {
      const mockChatRoom = { id_chatroom: 'room-1', id_pengguna_jasa: 'u1', id_penyedia_jasa: 'p1' };
      const mockPesanBaru = {
        id_pesan: 'm1',
        isi_pesan: '',
        lampiran: 'https://storage.com/file.pdf',
        pengirim: { nama: 'Budi' },
      };

      mockSupabase.single
        .mockResolvedValueOnce({ data: mockChatRoom, error: null }) // validasiAksesChatroom
        .mockResolvedValueOnce({ data: mockPesanBaru, error: null }); // insert pesan

      const res = await ChatService.kirimPesan('room-1', 'u1', '', 'https://storage.com/file.pdf');

      expect(res).toEqual(mockPesanBaru);
      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith({
        id_pengguna: 'p1',
        judul: 'Budi: Pesan Baru',
        pesan_notifikasi: 'Mengirimkan lampiran',
        id_referensi: 'room-1',
      });
    });

    it('harus memotong preview notifikasi jika pesan lebih dari 50 karakter', async () => {
      const mockChatRoom = { id_chatroom: 'room-1', id_pengguna_jasa: 'u1', id_penyedia_jasa: 'p1' };
      const longMessage = 'Ini adalah pesan yang sangat panjang melebihi batas lima puluh karakter untuk notifikasi';
      const mockPesanBaru = {
        id_pesan: 'm2',
        isi_pesan: longMessage,
        lampiran: null,
        pengirim: { nama: 'Siti' },
      };

      mockSupabase.single
        .mockResolvedValueOnce({ data: mockChatRoom, error: null })
        .mockResolvedValueOnce({ data: mockPesanBaru, error: null });

      await ChatService.kirimPesan('room-1', 'u1', longMessage);

      expect(NotifikasiService.kirimNotifikasi).toHaveBeenCalledWith(
        expect.objectContaining({
          pesan_notifikasi: `${longMessage.slice(0, 50)}...`,
        })
      );
    });

    it('harus throw error jika gagal menyimpan pesan ke database', async () => {
      const mockChatRoom = { id_chatroom: 'room-1', id_pengguna_jasa: 'u1', id_penyedia_jasa: 'p1' };

      mockSupabase.single
        .mockResolvedValueOnce({ data: mockChatRoom, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Insert message failed' } });

      await expect(
        ChatService.kirimPesan('room-1', 'u1', 'Test pesan')
      ).rejects.toThrow('Gagal mengirim pesan: Insert message failed');
    });
  });
});