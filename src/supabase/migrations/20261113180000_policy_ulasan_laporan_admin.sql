-- Ulasan (C46–C48), pelaporan (C43–C45), tanggapan & keputusan admin (C49–C53)

-- Helper: apakah user yang login adalah admin. SECURITY DEFINER supaya tidak terkena RLS tabel pengguna.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.pengguna where id = auth.uid() and role = 'ADMIN');
$$;

-- ===================== ULASAN =====================
drop policy if exists "ulasan: baca semua" on public.ulasan;
create policy "ulasan: baca semua" on public.ulasan
  for select using (true);

drop policy if exists "ulasan: tulis oleh pemesan" on public.ulasan;
create policy "ulasan: tulis oleh pemesan" on public.ulasan
  for insert to authenticated with check (
    id_pengguna_jasa = auth.uid()
    and exists (select 1 from public.pesanan p where p.id_pesanan = ulasan.id_pesanan
                and p.id_pengguna_jasa = auth.uid())
  );

-- ===================== TIKET LAPORAN =====================
drop policy if exists "tiket_laporan: baca pihak terkait" on public.tiket_laporan;
create policy "tiket_laporan: baca pihak terkait" on public.tiket_laporan
  for select to authenticated using (auth.uid() in (id_pelapor, id_terlapor) or public.is_admin());

drop policy if exists "tiket_laporan: buat oleh pihak pesanan" on public.tiket_laporan;
create policy "tiket_laporan: buat oleh pihak pesanan" on public.tiket_laporan
  for insert to authenticated with check (
    id_pelapor = auth.uid()
    and exists (select 1 from public.pesanan p where p.id_pesanan = tiket_laporan.id_pesanan
                and auth.uid() in (p.id_pengguna_jasa, p.id_penyedia_jasa))
  );

drop policy if exists "tiket_laporan: ubah oleh admin" on public.tiket_laporan;
create policy "tiket_laporan: ubah oleh admin" on public.tiket_laporan
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ===================== TANGGAPAN LAPORAN =====================
drop policy if exists "tanggapan_laporan: baca" on public.tanggapan_laporan;
create policy "tanggapan_laporan: baca" on public.tanggapan_laporan
  for select to authenticated using (
    public.is_admin()
    or exists (select 1 from public.tiket_laporan t where t.id_tiket = tanggapan_laporan.id_tiket
               and auth.uid() in (t.id_pelapor, t.id_terlapor))
  );

drop policy if exists "tanggapan_laporan: tulis oleh admin" on public.tanggapan_laporan;
create policy "tanggapan_laporan: tulis oleh admin" on public.tanggapan_laporan
  for insert to authenticated with check (public.is_admin());

-- ===================== AKSES ADMIN =====================
drop policy if exists "pengguna: baca oleh admin" on public.pengguna;
create policy "pengguna: baca oleh admin" on public.pengguna
  for select to authenticated using (public.is_admin());

drop policy if exists "pengguna: sanksi oleh admin" on public.pengguna;
create policy "pengguna: sanksi oleh admin" on public.pengguna
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "pesanan: baca oleh admin" on public.pesanan;
create policy "pesanan: baca oleh admin" on public.pesanan
  for select to authenticated using (public.is_admin());

-- Nama pihak lawan di tiket
drop policy if exists "pengguna: baca pihak tiket" on public.pengguna;
create policy "pengguna: baca pihak tiket" on public.pengguna
  for select to authenticated using (
    exists (select 1 from public.tiket_laporan t
            where (t.id_pelapor = auth.uid() and t.id_terlapor = pengguna.id)
               or (t.id_terlapor = auth.uid() and t.id_pelapor = pengguna.id))
  );