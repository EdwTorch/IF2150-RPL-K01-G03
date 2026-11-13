-- Deliverables (C36–C41): kolom yang dipakai DeliverablesService tapi belum ada di skema awal
alter table public.produk_akhir
  add column if not exists output_path varchar(500),
  add column if not exists berkas_hasil text[] not null default '{}'::text[];

alter table public.pengajuan_revisi
  add column if not exists id_produk_akhir uuid references public.produk_akhir(id_produk_akhir) on delete set null,
  add column if not exists pesan_revisi text;

-- Rapikan status lama yang sempat ditulis dengan format salah oleh DeliverablesService
update public.pesanan set status_pesanan = 'MENUNGGU_KONFIRMASI_SELESAI'
  where status_pesanan = 'Menunggu Konfirmasi'
    and exists (select 1 from public.produk_akhir pa where pa.id_pesanan = pesanan.id_pesanan);
update public.pesanan set status_pesanan = 'DIPROSES' where status_pesanan = 'Diproses';
update public.pesanan set status_pesanan = 'SELESAI' where status_pesanan = 'Selesai';

-- ===================== RLS =====================

-- Pesanan (C27): pemesan & penyedia yang terlibat
drop policy if exists "pesanan: baca pihak terkait" on public.pesanan;
create policy "pesanan: baca pihak terkait" on public.pesanan
  for select to authenticated using (auth.uid() in (id_pengguna_jasa, id_penyedia_jasa));

drop policy if exists "pesanan: buat oleh pemesan" on public.pesanan;
create policy "pesanan: buat oleh pemesan" on public.pesanan
  for insert to authenticated with check (auth.uid() = id_pengguna_jasa);

drop policy if exists "pesanan: ubah pihak terkait" on public.pesanan;
create policy "pesanan: ubah pihak terkait" on public.pesanan
  for update to authenticated
  using (auth.uid() in (id_pengguna_jasa, id_penyedia_jasa))
  with check (auth.uid() in (id_pengguna_jasa, id_penyedia_jasa));

-- Produk akhir: dua pihak boleh membaca, hanya penyedia yang mengirim, pemesan menandai sudah diperiksa
drop policy if exists "produk_akhir: baca pihak pesanan" on public.produk_akhir;
create policy "produk_akhir: baca pihak pesanan" on public.produk_akhir
  for select to authenticated using (
    exists (select 1 from public.pesanan p where p.id_pesanan = produk_akhir.id_pesanan
            and auth.uid() in (p.id_pengguna_jasa, p.id_penyedia_jasa))
  );

drop policy if exists "produk_akhir: kirim oleh penyedia" on public.produk_akhir;
create policy "produk_akhir: kirim oleh penyedia" on public.produk_akhir
  for insert to authenticated with check (
    exists (select 1 from public.pesanan p where p.id_pesanan = produk_akhir.id_pesanan
            and p.id_penyedia_jasa = auth.uid())
  );

drop policy if exists "produk_akhir: ubah pihak pesanan" on public.produk_akhir;
create policy "produk_akhir: ubah pihak pesanan" on public.produk_akhir
  for update to authenticated using (
    exists (select 1 from public.pesanan p where p.id_pesanan = produk_akhir.id_pesanan
            and auth.uid() in (p.id_pengguna_jasa, p.id_penyedia_jasa))
  );

-- Pengajuan revisi: dua pihak boleh membaca, pemesan mengajukan, penyedia menandai revisi dikumpulkan
drop policy if exists "pengajuan_revisi: baca pihak pesanan" on public.pengajuan_revisi;
create policy "pengajuan_revisi: baca pihak pesanan" on public.pengajuan_revisi
  for select to authenticated using (
    exists (select 1 from public.pesanan p where p.id_pesanan = pengajuan_revisi.id_pesanan
            and auth.uid() in (p.id_pengguna_jasa, p.id_penyedia_jasa))
  );

drop policy if exists "pengajuan_revisi: ajukan oleh pemesan" on public.pengajuan_revisi;
create policy "pengajuan_revisi: ajukan oleh pemesan" on public.pengajuan_revisi
  for insert to authenticated with check (
    exists (select 1 from public.pesanan p where p.id_pesanan = pengajuan_revisi.id_pesanan
            and p.id_pengguna_jasa = auth.uid())
  );

drop policy if exists "pengajuan_revisi: ubah pihak pesanan" on public.pengajuan_revisi;
create policy "pengajuan_revisi: ubah pihak pesanan" on public.pengajuan_revisi
  for update to authenticated using (
    exists (select 1 from public.pesanan p where p.id_pesanan = pengajuan_revisi.id_pesanan
            and auth.uid() in (p.id_pengguna_jasa, p.id_penyedia_jasa))
  );

-- Pencairan dana: hanya dibaca dua pihak. Penulisan (dan saldo) lewat server dengan secret key.
drop policy if exists "pencairan_dana: baca pihak pesanan" on public.pencairan_dana;
create policy "pencairan_dana: baca pihak pesanan" on public.pencairan_dana
  for select to authenticated using (
    exists (select 1 from public.pesanan p where p.id_pesanan = pencairan_dana.id_pesanan
            and auth.uid() in (p.id_pengguna_jasa, p.id_penyedia_jasa))
  );

-- Nama pihak lawan pada pesanan (nama pemesan di Pesanan Masuk, nama penyedia di riwayat)
drop policy if exists "pengguna: baca pihak pesanan" on public.pengguna;
create policy "pengguna: baca pihak pesanan" on public.pengguna
  for select to authenticated using (
    exists (
      select 1 from public.pesanan p
      where (p.id_pengguna_jasa = auth.uid() and p.id_penyedia_jasa = pengguna.id)
         or (p.id_penyedia_jasa = auth.uid() and p.id_pengguna_jasa = pengguna.id)
    )
  );

drop policy if exists "pengguna_jasa: baca pemesan" on public.pengguna_jasa;
create policy "pengguna_jasa: baca pemesan" on public.pengguna_jasa
  for select to authenticated using (
    exists (select 1 from public.pesanan p where p.id_pengguna_jasa = pengguna_jasa.id and p.id_penyedia_jasa = auth.uid())
  );
