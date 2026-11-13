-- Bookmark (C20): pengguna jasa hanya boleh melihat, menambah, dan menghapus bookmark miliknya sendiri
drop policy if exists "bookmark: baca milik sendiri" on public.bookmark;
create policy "bookmark: baca milik sendiri" on public.bookmark
  for select to authenticated using (auth.uid() = id_pengguna_jasa);

drop policy if exists "bookmark: tambah milik sendiri" on public.bookmark;
create policy "bookmark: tambah milik sendiri" on public.bookmark
  for insert to authenticated with check (auth.uid() = id_pengguna_jasa);

drop policy if exists "bookmark: hapus milik sendiri" on public.bookmark;
create policy "bookmark: hapus milik sendiri" on public.bookmark
  for delete to authenticated using (auth.uid() = id_pengguna_jasa);