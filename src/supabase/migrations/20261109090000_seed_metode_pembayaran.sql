-- Seed data metode pembayaran dummy (C33 MetodePembayaran)
INSERT INTO public.metode_pembayaran (id_metode, nama_metode, nomor_rekening_va)
VALUES
  ('VA_BCA', 'BCA Virtual Account', '8801081234567890'),
  ('VA_MANDIRI', 'Mandiri Virtual Account', '8902081234567890'),
  ('VA_BNI', 'BNI Virtual Account', '8810081234567890'),
  ('VA_BRI', 'BRI Virtual Account', '8888081234567890'),
  ('EWALLET_GOPAY', 'GoPay / QRIS', '081234567890'),
  ('QRIS', 'QRIS CariJasa', '081234567890')
ON CONFLICT (id_metode) DO NOTHING;
