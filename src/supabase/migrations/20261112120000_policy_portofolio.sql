-- Portofolio (C09): penyedia hanya bisa membaca, menambah, dan menghapus karyanya sendiri
drop policy if exists "portofolio: baca milik sendiri" on public.portofolio;
create policy "portofolio: baca milik sendiri" on public.portofolio
  for select to authenticated using (auth.uid() = id_penyedia_jasa);

drop policy if exists "portofolio: tambah milik sendiri" on public.portofolio;
create policy "portofolio: tambah milik sendiri" on public.portofolio
  for insert to authenticated with check (auth.uid() = id_penyedia_jasa);

drop policy if exists "portofolio: hapus milik sendiri" on public.portofolio;
create policy "portofolio: hapus milik sendiri" on public.portofolio
  for delete to authenticated using (auth.uid() = id_penyedia_jasa);

-- Penyedia jasa (C02): boleh membaca & memperbarui baris miliknya (pengalaman, prestasi)
drop policy if exists "baca data penyedia sendiri" on public.penyedia_jasa;
create policy "baca data penyedia sendiri" on public.penyedia_jasa
  for select to authenticated using (auth.uid() = id);

drop policy if exists "penyedia_jasa: ubah milik sendiri" on public.penyedia_jasa;
create policy "penyedia_jasa: ubah milik sendiri" on public.penyedia_jasa
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);