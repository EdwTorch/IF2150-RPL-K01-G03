-- Riwayat transaksi (C32): pemesan mencatat pembayaran, kedua pihak boleh melihat
drop policy if exists "riwayat_transaksi: baca pihak pesanan" on public.riwayat_transaksi;
create policy "riwayat_transaksi: baca pihak pesanan" on public.riwayat_transaksi
  for select to authenticated using (
    exists (select 1 from public.pesanan p where p.id_pesanan = riwayat_transaksi.id_pesanan
            and auth.uid() in (p.id_pengguna_jasa, p.id_penyedia_jasa))
  );

drop policy if exists "riwayat_transaksi: catat oleh pemesan" on public.riwayat_transaksi;
create policy "riwayat_transaksi: catat oleh pemesan" on public.riwayat_transaksi
  for insert to authenticated with check (
    exists (select 1 from public.pesanan p where p.id_pesanan = riwayat_transaksi.id_pesanan
            and p.id_pengguna_jasa = auth.uid())
  );

-- Daftar metode pembayaran boleh dibaca semua pengguna yang login
drop policy if exists "metode_pembayaran: baca" on public.metode_pembayaran;
create policy "metode_pembayaran: baca" on public.metode_pembayaran
  for select to authenticated using (true);