import { api } from "@/lib/api";

/** Sesuai select di services/chat.service.ts */
export type RoomChat = {
  id_chatroom: string;
  id_pengguna_jasa: string;
  id_penyedia_jasa: string;
  created_at: string;
  pengguna_jasa?: { id: string; nama: string } | null;
  penyedia_jasa?: { id: string; nama: string } | null;
};

export type PesanChat = {
  id_pesan: string;
  id_chatroom: string;
  id_pengirim: string;
  isi_pesan: string;
  lampiran: string | null;
  waktu_dibuat: string;
  created_at: string;
  pengirim?: { id: string; nama: string } | null;
};

type Respons<T> = { success: true; message?: string; data: T };

/** tampilkanMenuChat() → GET /api/chat */
export async function ambilDaftarRoom() {
  return (await api<Respons<RoomChat[]>>("/api/chat")).data;
}

/** buatSesiChat() → POST /api/chat. Dipakai tombol "Chat Penyedia" di detail jasa */
export async function bukaRoomDenganPenyedia(id_penyedia_jasa: string) {
  return (await api<Respons<RoomChat>>("/api/chat", { method: "POST", body: { id_penyedia_jasa } })).data;
}

/** tampilkanRiwayatPesan() → GET /api/chat/[id_chatroom] */
export async function ambilRiwayatPesan(id_chatroom: string) {
  return (await api<Respons<PesanChat[]>>(`/api/chat/${id_chatroom}`)).data;
}

/** kirimPesan() → POST /api/chat/[id_chatroom] */
export async function kirimPesanChat(id_chatroom: string, isi_pesan: string, lampiran: string | null = null) {
  return (
    await api<Respons<PesanChat>>(`/api/chat/${id_chatroom}`, { method: "POST", body: { isi_pesan, lampiran } })
  ).data;
}