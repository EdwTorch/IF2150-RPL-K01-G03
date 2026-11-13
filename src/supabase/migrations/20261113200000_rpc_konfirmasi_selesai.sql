drop function if exists public.konfirmasi_pesanan_selesai(uuid);

create function public.konfirmasi_pesanan_selesai(p_id_pesanan uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pesanan public.pesanan%rowtype;
  v_status  text;
  v_jumlah  int;
begin
  select * into v_pesanan
  from public.pesanan
  where id_pesanan = p_id_pesanan
  for update;

  if not found then
    raise exception 'Pesanan tidak ditemukan.';
  end if;

  if v_pesanan.id_pengguna_jasa <> auth.uid() then
    raise exception 'Akses ditolak. Pesanan ini bukan milik Anda.';
  end if;

  v_status := upper(replace(trim(v_pesanan.status_pesanan), ' ', '_'));

  if v_status = 'SELESAI' then
    raise exception 'Pesanan sudah diselesaikan sebelumnya.';
  end if;

  if v_status not in ('DIPROSES', 'MENUNGGU_KONFIRMASI', 'MENUNGGU_KONFIRMASI_SELESAI') then
    raise exception 'Pesanan belum dapat dikonfirmasi selesai (status: %).', v_pesanan.status_pesanan;
  end if;

  -- Yang menentukan: hasil sudah dikirim dan tidak ada revisi yang masih dikerjakan
  if not exists (select 1 from public.produk_akhir where id_pesanan = p_id_pesanan) then
    raise exception 'Hasil pekerjaan belum dikumpulkan.';
  end if;

  if exists (
    select 1 from public.pengajuan_revisi
    where id_pesanan = p_id_pesanan and status_pengerjaan = 'Sedang Direvisi'
  ) then
    raise exception 'Revisi masih dikerjakan penyedia.';
  end if;

  v_jumlah := round(v_pesanan.total_biaya)::int;

  update public.pesanan
  set status_pesanan   = 'SELESAI',
      status_pencairan = true,
      waktu_pencairan  = now(),
      updated_at       = now()
  where id_pesanan = p_id_pesanan;

  insert into public.pencairan_dana (id_pesanan, id_penyedia_jasa, jumlah_pencairan, state_pencairan_dana)
  values (p_id_pesanan, v_pesanan.id_penyedia_jasa, v_jumlah, true);

  update public.penyedia_jasa
  set saldo = coalesce(saldo, 0) + v_jumlah
  where id = v_pesanan.id_penyedia_jasa;
end;
$$;

revoke all on function public.konfirmasi_pesanan_selesai(uuid) from public;
grant execute on function public.konfirmasi_pesanan_selesai(uuid) to authenticated;