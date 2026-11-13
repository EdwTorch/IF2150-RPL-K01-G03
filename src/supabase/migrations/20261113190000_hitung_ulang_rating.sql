update public.jasa j set rating_rata_rata = coalesce((
  select round(avg(u.rating)::numeric, 1)
  from public.ulasan u join public.pesanan p on p.id_pesanan = u.id_pesanan
  where p.id_jasa = j.id_jasa), 0);

update public.penyedia_jasa pj set rating_rata_rata = coalesce((
  select round(avg(u.rating)::numeric, 1)
  from public.ulasan u join public.pesanan p on p.id_pesanan = u.id_pesanan
  where p.id_penyedia_jasa = pj.id), 0);