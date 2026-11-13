-- Chatroom (C23): hanya dua peserta room yang boleh melihat & membuat room
drop policy if exists "chatroom: baca peserta" on public.chatroom;
create policy "chatroom: baca peserta" on public.chatroom
  for select to authenticated using (auth.uid() in (id_pengguna_jasa, id_penyedia_jasa));

drop policy if exists "chatroom: buat peserta" on public.chatroom;
create policy "chatroom: buat peserta" on public.chatroom
  for insert to authenticated with check (auth.uid() in (id_pengguna_jasa, id_penyedia_jasa));

-- Pesan chat: peserta room boleh membaca; pengirim harus diri sendiri dan peserta room
drop policy if exists "pesan_chat: baca peserta" on public.pesan_chat;
create policy "pesan_chat: baca peserta" on public.pesan_chat
  for select to authenticated using (
    exists (
      select 1 from public.chatroom c
      where c.id_chatroom = pesan_chat.id_chatroom
        and auth.uid() in (c.id_pengguna_jasa, c.id_penyedia_jasa)
    )
  );

drop policy if exists "pesan_chat: kirim peserta" on public.pesan_chat;
create policy "pesan_chat: kirim peserta" on public.pesan_chat
  for insert to authenticated with check (
    id_pengirim = auth.uid()
    and exists (
      select 1 from public.chatroom c
      where c.id_chatroom = pesan_chat.id_chatroom
        and auth.uid() in (c.id_pengguna_jasa, c.id_penyedia_jasa)
    )
  );

-- Nama lawan bicara: boleh membaca profil orang yang satu chatroom dengan kita
drop policy if exists "pengguna: baca lawan chat" on public.pengguna;
create policy "pengguna: baca lawan chat" on public.pengguna
  for select to authenticated using (
    exists (
      select 1 from public.chatroom c
      where (c.id_pengguna_jasa = auth.uid() and c.id_penyedia_jasa = pengguna.id)
         or (c.id_penyedia_jasa = auth.uid() and c.id_pengguna_jasa = pengguna.id)
    )
  );

-- Join chatroom → pengguna_jasa / penyedia_jasa butuh izin baca baris lawan chat
drop policy if exists "pengguna_jasa: baca lawan chat" on public.pengguna_jasa;
create policy "pengguna_jasa: baca lawan chat" on public.pengguna_jasa
  for select to authenticated using (
    exists (select 1 from public.chatroom c where c.id_pengguna_jasa = pengguna_jasa.id and c.id_penyedia_jasa = auth.uid())
  );

drop policy if exists "penyedia_jasa: baca lawan chat" on public.penyedia_jasa;
create policy "penyedia_jasa: baca lawan chat" on public.penyedia_jasa
  for select to authenticated using (
    exists (select 1 from public.chatroom c where c.id_penyedia_jasa = penyedia_jasa.id and c.id_pengguna_jasa = auth.uid())
  );

-- Notifikasi: pemilik boleh membaca & menandai dibaca; pengguna login boleh membuat notifikasi untuk orang lain
drop policy if exists "notifikasi: baca milik sendiri" on public.notifikasi;
create policy "notifikasi: baca milik sendiri" on public.notifikasi
  for select to authenticated using (auth.uid() = id_pengguna);

drop policy if exists "notifikasi: tandai dibaca" on public.notifikasi;
create policy "notifikasi: tandai dibaca" on public.notifikasi
  for update to authenticated using (auth.uid() = id_pengguna) with check (auth.uid() = id_pengguna);

drop policy if exists "notifikasi: buat" on public.notifikasi;
create policy "notifikasi: buat" on public.notifikasi
  for insert to authenticated with check (auth.uid() is not null);