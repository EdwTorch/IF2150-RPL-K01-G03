<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## CariJasa
<p align="left">
<img alt="logo carijasa" src="../M8/assets/diagram/logo_carijasa.png" width="50%">
</p>

### Untuk: Mikhael Andrian Yonatan

Dipersiapkan oleh:
| Informasi | Keterangan |
| :--- | :--- |
| Kelas | K-01 |
| Kelompok | G-03  |

| NIM | Nama |
|---|---|
| 13525031 | Revandra Zacky Maharta |
| 13525079 | Danesh Rasyad Damotino |
| 13525088 | Theresia Estelina Ratu Udju |
| 13525127 | Edward Terrance Lie |
| 13525130 | Necia Aurely Greva Dedevi |
---


## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen ini disusun untuk menampilkan hasil implementasi dan pengujian dari Website CariJasa. Pembuatan dokumen ini akan menjelaskan ruang lingkup implementasi dari dokumen DPPL, fungsionalitas, dan hasil pengujiannya terhadap rancangan yang sudah dibuat. Dokumen ini digunakan sebagai laporan untuk hasil implementasi, fungsionalitas, dan bagaimana penerapan Website CariJasa dalam memenuhi ketentuan dalam Requiriment Gathering, SKPL, APL, dan DPPL.

## 1.2 Lingkup Masalah
CariJasa adalah platform *marketplace* jasa berbasis web yang dirancang untuk memudahkan pencarian dan penawaran jasa digital bagi masyarakat Indonesia. Aplikasi ini dibuat untuk mengatasi masalah informasi jasa yang saat ini masih tersebar di berbagai media sosial dan kanal lain, sehingga pengguna kesulitan mencari serta membandingkan tarif, keahlian, dan ulasan penyedia jasa secara mudah. Selain itu, platform ini hadir untuk membantu *freelancer* maupun penyedia jasa lokal memperoleh penghasilan tambahan tanpa harus terikat hubungan kerja tetap. Ruang lingkup aplikasi berfokus pada penyediaan daftar pilihan jasa, fitur pembanding jasa (*compare*), ruang kirim pesan langsung (*chat*), pembayaran digital yang aman, pengiriman hasil kerja dan pengajuan revisi, hingga pelaporan kendala serta bantuan penyelesaian masalah oleh admin.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjelaskan rancangan arsitektur, kelas, dan antarmuka P/L.* |
| *HIUPL* | *Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *BCE* | *Singkatan dari Boundary-Controller-Entity*. pola arsitektur yang memisahkan sistem ke dalam tiga peran yaitu antarmuka (*Boundary*), pengendali logika (*Controller*), dan data (*Entity*). |
| *UML* | *Unified Modeling Language*, bahasa visual standar untuk mendokumentasikan artefak sistem perangkat lunak. |
| *TC* | *Singkatan dari Test Case, yaitu satu kasus uji untuk skenario tertentu.* |
| *UT* | *Singkatan dari Unit Test, yaitu test case tingkat kelas/operasi.* |
| *INT* | *Singkatan dari Integration Test, yaitu test case yang menguji interaksi antarkomponen.* |
| *Boundary* | *Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan.* |
| *Coverage* | *Persentase baris/cabang kode yang dieksekusi oleh pengujian.* |
| *Listing Jasa* | Produk jasa digital yang telah dipublikasikan oleh Penyedia Jasa dan tersedia untuk dipesan oleh Pengguna Jasa.|
| *Deliverables* | Berkas, dokumen, atau tautan hasil pekerjaan akhir yang diserahkan oleh Penyedia Jasa kepada Pengguna Jasa untuk dievaluasi. |
| *Bookmark* | Fitur untuk menandai dan menyimpan penawaran jasa ke dalam daftar tersimpan pengguna agar mudah diakses kembali. |
| *Ticketing* | Sistem pencatatan, pelacakan, dan penanganan tiket keluhan serta laporan sengketa transaksi pengguna oleh Admin. |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya (SKPL, APL, DPPL), kecuali untuk ID pengujian yang baru diperkenalkan pada dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Awal* | *RXX* | Nomor identifikasi kebutuhan mentah dari tahap elisitasi kebutuhan dengan format dua digit. |
| *Kebutuhan Fungsional* | *KFXX* | Nomor urut Kebutuhan Non-Fungsional dengan Format dua digit |
| *Kebutuhan Non-Fungsional* | *KNFXX* | Nomor urut kebutuhan non-fungsional dengan format dua digit. | 
| *Use Case* | *UCXX* | Nomor urut kasus penggunaan sistem dengan format dua digit. |
| *Kelas* | *CXX* | Nomor identifikasi unik kelas analisis arsitektur BCE. |
| *Algoritma* | *Algo-XXYY* | Nomor identifikasi unik algoritma dari sebuah kelas dengan XX adalah nomor kelas dan YY adalah nomor algoritma |
| *Query* | *Q-XXYY* | Nomor identifikasi unik query dari sebuah kelas dengan XX adalah nomor kelas dan YY adalah nomor algoritma |
| *Antarmuka* | *I-XX* | Nomor Identifikasi untuk setiap antarmuka yang diterapkan |
| *Test Case Unit* | *CXX-UTYY* | XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut |
| *Test Case Integrasi* | *INT-TCYY* | YY adalah nomor urut test case integrasi |
| *Test Case Use Case* | *UCXX-TCYY* | XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut |
| *Test Case KNF* | *KNFXX-TCYY* | XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut |

## 1.5 Referensi
1. **SKPL:** [Spesifikasi Kebutuhan Perangkat Lunak](../M5/K01_G03_SKPL.md)
2. **APL:** [Arsitektur Perangkat Lunak](../M6/K01_G03_APL.md)
3. Badan Pusat Statistik. (2026). *Keadaan angkatan kerja di Indonesia Februari 2026* (Vol. 48, No. 1). Badan Pusat Statistik.
4. Craigslist. (2026). *Craigslist*. https://www.craigslist.org/
5. Fiverr International Ltd. (2026). *Fiverr*. https://www.fiverr.com/
6. Kementerian Perencanaan Pembangunan Nasional/Badan Perencanaan Pembangunan Nasional. (2025). *Indonesia VNR 2025: Voluntary National Review – Fostering inclusive growth: Advancing sustainable and resilient Indonesia*. Kementerian PPN/Bappenas.
7. United Nations Department of Economic and Social Affairs. (2026). *The Sustainable Development Goals report 2026*. United Nations. https://unstats.un.org/sdgs/report/2026/
8. Program Studi Teknik Informatika ITB. (2026). *Materi perkuliahan IF2150 Rekayasa Perangkat Lunak*. Edunex ITB. https://edunex.itb.ac.id/
9. **DPPL :** [DESKRIPSI PERANCANGAN PERANGKAT LUNAK](../M8/K01_G03_DPPL2.md)
10. **Dokumen Implementasi :** [Dokumen Implementasi](../M9/K01_G03_Implementasi.md)


## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen ini ditulis dengan pembagian 5 bab, yaitu pendahuluan, deskripsi umum perangkat lunak (DPPL), implementasi, hasil pengujian, dan traceability. Bab pendahuluan, mencakup tujuan penulisan dokumen, lingkup masalah, definisi, istilah, dan singkatan yang digunakan, aturan penomoran dalam laporan, referensi, dan ikhtisar. Bab DPPL diisi dengan system overview (gambaran umum aplikasi), batasan dan konteksnya, serta use case diagram yang digunakan. Bab Implementasi digunakan untuk merangkum lingkungan implementasi, modul, dan antarmuka yang digunakan dalam implementasi. Bab 4 (Hasil Pengujian) berisi strategi pengujian, pengujian unit, integrasi, use case, dan KNF, serta buktinya. Bab 5 (Traceability) digunakan untuk merangkum seluruh pengujian yang dilakukan terhadap tercapaian KF maupun KNFnya.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

Bagian ini diisi dengan *System Overview*, dalam bentuk gambar dan narasi yang memberikan gambaran tentang aplikasi dan konteksnya. **Batasan dan keterkaitan** antara sistem yang dibangun dengan sistem lain di luarnya harus jelas. Deskripsi umum sistem perlu dilengkapi dengan pemodelan kasus yang dihadapi, seperti *use case diagram*. Berikan narasi yang jelas untuk setiap gambar yang ditampilkan.

Bagian ini dapat menyalin atau meringkas dari dokumen SKPL atau DPPL.

<p align="center">
<img alt="System Overview / Use Case Diagram" src="./assets/contoh-uc-diagram.webp" width="90%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram [Nama P/L]</i>
</p>

<br>

---

# BAB 3: Implementasi

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Tuliskan *hardware* dan *software* yang digunakan untuk implementasi, mencakup *operating system*, bahasa pemrograman beserta versinya, *framework*/*library*, DBMS, *development tools*, dan *version control*. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga *framework* dan alat pengujian yang dipakai.

Tabel 3.1. Lingkungan Implementasi

### Revandra 
| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

### Danesh 
| Aspek | Keterangan |
| :--- | :--- |
| Hardware | Laptop Lenovo ThinkPad P14s Gen 5, Intel Core Ultra 7 165H, RAM 32 GB |
| Operating System | Windows 11 Pro 26H2 |
| Bahasa Pemrograman | TypeScript 5, Node.js 24.19.0 |
| Framework/Library | Next.js 16.4.3, React 19.3.0, Tailwind CSS 4, Supabase JS 2.118.0, Supabase SSR 0.12.7 |
| DBMS | PostgreSQL 15 (via Supabase) |
| Development Tools | Visual Studio Code, Git 2.55.0, GitHub |
| Testing Tools | Vitest 5.1.0, Node.js performance.now() |

### Theresia 
| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

### Edward 
| Aspek | Keterangan |
| :--- | :--- |
| Hardware | Laptop ASUS ROG G614JU, Intel Core I5 - 13450HX (4.8 GHz), GeForce RTX 4050 TDP 140 Watt, 16GB DDR5-4800 MHz  |
| Operating System | Windows 11 26H2 |
| Bahasa Pemrograman | Typescript with NodeJS 11.19.1 |
| Framework/Library | NextJS |
| DBMS | PostGreSQL 15 dengan Supabase |
| Development Tools | VSCode, Git, Github |
| Testing Tools | Vitest |

### Necia
| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |



## 3.2 Implementasi Modul

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C01 | Pengguna | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `pengguna`)* | - |
| 2 | C02 | PenyediaJasa | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` (`public.penyedia_jasa`), `src/models/types.ts` (`PenyediaJasa`, `RatingAgregat`), `src/services/ulasan.service.ts` (`perbaruiRatingPenyedia`, `getRatingDanUlasanPenyedia`, `hitungRatingAgregat`, `formatRatingTampilan`, `validasiRating`), `src/app/api/ulasan/route.ts` (`GET`), `src/test/ulasan.test.ts` | - |
| 3 | C03 | PenggunaJasa | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `pengguna_jasa`)* | - |
| 4 | C04 | HalamanRegistrasi | `src/app/(auth)/register/page.tsx` (`HalamanRegistrasi`) | - |
| 5 | C05 | LayananRegistrasi | `src/services/auth.service.ts` (`validasiInputRegistrasi`, `registrasi`, `InputRegistrasi`), `src/app/api/auth/route.ts` (`POST action: register`), `src/test/auth.test.ts` | - |
| 6 | C06 | HalamanLogin | `src/app/(auth)/login/page.tsx` (`HalamanLogin`), `src/app/admin/page.tsx` (`HalamanLoginAdmin`) | - |
| 7 | C07 | Autentikator | `src/services/auth.service.ts` (`login`, `logout`, `getSessionUser`, `loginAdmin`), `src/app/api/auth/route.ts` (`POST action: login, logout, me`, `GET`), `src/lib/supabase/middleware.ts` (`updateSession`, diintegrasikan di `src/middleware.ts`), `src/models/types.ts` (`SessionUser`) | - |
| 8 | C08 | HalamanPortofolio | `src/app/penyedia/portofolio/page.tsx` | - |
| 9 | C09 | Portofolio | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `portofolio`)* | - |
| 10 | C10 | PengontrolPortofolio | `src/services/portofolio.service.ts` (`ambilPortofolio`, `simpanPortofolio`), `src/app/api/portofolio/route.ts` (`POST`, `GET`) | - |
| 11 | C11 | LayananUploadFile | `src/lib/upload.config.ts` (`validasiBerkasUpload`, `validasiFolder`, `MAKS_UKURAN_UPLOAD`), `src/app/api/upload/route.ts` (`POST`), `src/services/storage/` (`StorageService`, `LocalStorageService`, `SupabaseStorageService`), `src/test/upload.test.ts` | - |
| 12 | C12 | Jasa | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` (`public.jasa`), `src/supabase/migrations/20261108085000_add_berkas_pendukung_jasa.sql`, `src/models/types.ts` (`Jasa`) | - |
| 13 | C13 | HalamanUploadJasa | `src/app/penyedia/upload-jasa/page.tsx`, `src/app/jasa/tambah/page.tsx` | - |
| 14 | C14 | JasaController | `src/services/jasa.service.ts` (`JasaController`), `src/app/api/jasa/route.ts` (`GET`, `POST`), `src/app/api/jasa/[id]/route.ts` (`GET`, `PATCH`, `DELETE`), `src/app/api/jasa/helper.ts` (`bacaInputJasa`), `src/test/jasa.test.ts` | - |
| 15 | C15 | HalamanPencarian | `src/app/pengguna/pencarian/page.tsx`, `src/app/jasa/page.tsx` | - |
| 16 | C16 | HasilPencarian | - (digabungkan dengan jasa yang didapat melalui query pada HalamanPencarian) | - |
| 17 | C17 | LayananPencarian | `src/services/pencarian.service.ts` (`LayananPencarian`, `normalisasiKeyword`), `src/app/api/jasa/route.ts` (`GET`), `src/test/search.test.ts` | - |
| 18 | C18 | LayananPembandingJasa | `src/services/pencarian.service.ts` (`LayananPembandingJasa`), `src/app/api/jasa/route.ts` (`GET query compare`), `src/test/search.test.ts` | - |
| 19 | C19 | HalamanDetailJasa | `src/app/jasa/[id]/page.tsx` | - |
| 20 | C20 | Bookmark | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` (`public.bookmark`), `src/models/types.ts` (`Bookmark`) | - |
| 21 | C21 | HalamanBookmark | `src/app/pengguna/bookmark/page.tsx`, `src/app/bookmark/page.tsx` | - |
| 22 | C22 | PengontrolBookmark | `src/services/bookmark.service.ts` (`PengontrolBookmark`), `src/app/api/bookmark/route.ts` (`GET`, `POST`, `DELETE`), `src/test/bookmark.test.ts` | - |
| 23 | C23 | ChatRoom | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `chatroom`)* | - |
| 24 | C24 | HalamanChat | `src/app/chat/page.tsx` | - |
| 25 | C25 | LayananPesanInstan | `src/services/chat.service.ts` (`ChatService`), `src/app/api/chat/[id_chatroom]/route.ts`, `src/app/api/chat/route.ts` | - |
| 26 | C26 | LayananNotifikasiChat | `src/services/notifikasi.service.ts` (`NotifikasiService`), `src/app/api/notifikasi/route.ts` | - |
| 27 | C27 | Pesanan | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` (`public.pesanan`), `src/models/types.ts` (`Pesanan`) | - |
| 28 | C28 | HalamanPemesanan | `src/app/pesanan/[id]/page.tsx` | - |
| 29 | C29 | HalamanPembayaran | `src/app/pesanan/checkout/[id]/page.tsx` | - |
| 30 | C30 | HalamanRiwayatTransaksi | `src/app/pengguna/riwayat-transaksi/page.tsx` (`HalamanRiwayatTransaksi`) | - |
| 31 | C31 | PengontrolPesanan | `src/services/pesanan.service.ts` (`PesananService`), `src/app/api/pesanan/route.ts` (`GET`, `POST`), `src/app/api/pesanan/[id_pesanan]/route.ts` (`GET`, `PATCH`), `src/test/pesanan.test.ts` | - |
| 32 | C32 | PengontrolTransaksi | `src/services/transaksi.service.ts` (`PengontrolTransaksi`), `src/app/api/transaksi/route.ts` (`GET`), `src/app/api/transaksi/dummy/route.ts` (`POST`), `src/test/transaksi.test.ts` | - |
| 33 | C33 | MetodePembayaran | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` (`public.metode_pembayaran`), `src/supabase/migrations/20261109090000_seed_metode_pembayaran.sql`, `src/models/types.ts` (`MetodePembayaran`) | - |
| 34 | C34 | RiwayatTransaksi | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` (`public.riwayat_transaksi`), `src/models/types.ts` (`RiwayatTransaksi`) | - |
| 35 | C35 | HalamanKonfirmasi | `src/app/penyedia/konfirmasi/[idPesanan]/page.tsx` (`HalamanKonfirmasi`) | - |
| 36 | C36 | ProdukAkhir | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `produk_akhir`)* | - |
| 37 | C37 | HalamanPengumpulan | `src/app/penyedia/pengumpulan/[idPesanan]/page.tsx` (`HalamanPengumpulan`) | - |
| 38 | C38 | HalamanDeliverables | `src/components/ui/HalamanDeliverables.tsx` (`HalamanDeliverables`), `src/app/pengguna/hasil/[idPesanan]/page.tsx`, `src/app/penyedia/pengumpulan/[idPesanan]/hasil/page.tsx` | - |
| 39 | C39 | PengajuanRevisi | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `pengajuan_revisi`)* | - |
| 40 | C40 | HalamanRequestRevisi | `src/app/pengguna/revisi/[idPesanan]/page.tsx` (`HalamanRequestRevisi`) | - |
| 41 | C41 | RevisiHandler | `src/services/deliverables.service.ts` (`DeliverablesService`), `src/app/api/pesanan/[id_pesanan]/deliverables/revisi/route.ts` | - |
| 42 | C42 | PencairanDana | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `pencairan_dana`)* | - |
| 43 | C43 | TiketLaporan | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `tiket_laporan`)* | - |
| 44 | C44 | HalamanPelaporan | `src/app/pengguna/pelaporan/page.tsx` (`HalamanPelaporan`) | - |
| 45 | C45 | LaporanHandler | `src/services/pelaporan.service.ts` (`PelaporanService`, `TanggapanLaporanService`), `src/app/api/pesanan/[id_pesanan]/laporan/route.ts`, `src/app/api/admin/laporan/[id_tiket]/route.ts`, `src/app/api/admin/laporan/[id_tiket]/tanggapan/route.ts` | - |
| 46 | C46 | Ulasan | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `ulasan`)* | - |
| 47 | C47 | HalamanUlasan | `src/app/pengguna/ulasan/[idPesanan]/page.tsx` (`HalamanUlasan`) | - |
| 48 | C48 | UlasanHandler | `src/services/ulasan.service.ts` (`UlasanService`), `src/app/api/ulasan/route.ts` | - |
| 49 | C49 | TanggapanLaporan | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `tanggapan_laporan`)* | - |
| 50 | C50 | HalamanPengajuanMediasi | `src/app/admin/tiket/[idTiket]/page.tsx` (`HalamanPengajuanMediasi`), `src/app/mediasi/[id]/page.tsx` | - |
| 51 | C51 | MediasiHandler | `src/services/mediasi.service.ts` (`MediasiService`), `src/app/api/admin/mediasi/[id_sesi_mediasi]/selesai/route.ts`, `src/app/api/admin/mediasi/route.ts`, `src/app/api/mediasi/route.ts`, `src/app/api/mediasi/[id_sesi_mediasi]/route.ts` | - |
| 52 | C52 | Admin | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `pengguna` dengan `role = 'ADMIN'`)* | - |
| 53 | C53 | HalamanDashboardAdmin | `src/app/admin/tiket/page.tsx` (`HalamanDashboardAdmin`) | - |
| 54 | C54 | PengumpulanController | `src/services/deliverables.service.ts` (`DeliverablesService`), `src/app/api/pesanan/route.ts`, `src/app/api/pesanan/[id_pesanan]/route.ts` | - |
| 55 | C55 | pesan_chat *(Tambahan M9)* | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `pesan_chat`)* | - |
| 56 | C56 | notifikasi *(Tambahan M9)* | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `notifikasi`)* | - |
| 57 | C57 | sesi_mediasi *(Tambahan M9)* | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `sesi_mediasi`)* | - |
| 58 | C58 | pesan_mediasi *(Tambahan M9)* | `src/supabase/migrations/20261103060624_create_carijasa_schema.sql` *(tabel `pesan_mediasi`)* | - |

## 3.3 Implementasi Antarmuka

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | I-01 | Layar Registrasi | `src/app/(auth)/register/page.tsx` | - |
| 2 | I-02 | Layar Login | `src/app/(auth)/login/page.tsx`, `src/app/admin/page.tsx` (`HalamanLoginAdmin`) | - |
| 3 | I-03 | Layar Portofolio | `src/app/penyedia/portofolio/page.tsx` | - |
| 4 | I-04 | Layar Upload Jasa | `src/app/penyedia/upload-jasa/page.tsx`, `src/app/jasa/tambah/page.tsx` | - |
| 5 | I-05 | Layar Pencarian | `src/app/pengguna/pencarian/page.tsx`, `src/app/jasa/page.tsx` | - |
| 6 | I-06 | Layar Detail Jasa | `src/app/jasa/[id]/page.tsx` | - |
| 7 | I-07 | Layar Bookmark | `src/app/pengguna/bookmark/page.tsx`, `src/app/bookmark/page.tsx` | - |
| 8 | I-08 | Layar Chat | `src/app/chat/page.tsx` | - |
| 9 | I-09 | Layar Pemesanan | `src/app/pesanan/[id]/page.tsx` | - |
| 10 | I-10 | Layar Pembayaran | `src/app/pesanan/checkout/[id]/page.tsx` | - |
| 11 | I-11 | Layar Riwayat Transaksi | `src/app/pengguna/riwayat-transaksi/page.tsx` | - |
| 12 | I-12 | Layar Konfirmasi | `src/app/penyedia/konfirmasi/[idPesanan]/page.tsx` | - |
| 13 | I-13 | Layar Pengumpulan | `src/app/penyedia/pengumpulan/[idPesanan]/page.tsx` | - |
| 14 | I-14 | Layar Deliverables | `src/components/ui/HalamanDeliverables.tsx`, `src/app/pengguna/hasil/[idPesanan]/page.tsx`, `src/app/penyedia/pengumpulan/[idPesanan]/hasil/page.tsx` | - |
| 15 | I-15 | Layar Request Revisi | `src/app/pengguna/revisi/[idPesanan]/page.tsx` | - |
| 16 | I-16 | Layar Pelaporan | `src/app/pengguna/pelaporan/page.tsx` | - |
| 17 | I-17 | Layar Ulasan | `src/app/pengguna/ulasan/[idPesanan]/page.tsx` | - |
| 18 | I-18 | Layar Pengajuan Mediasi | `src/app/admin/tiket/[idTiket]/page.tsx`, `src/app/mediasi/[id]/page.tsx` | - |
| 19 | I-19 | Layar Dashboard Admin | `src/app/admin/tiket/page.tsx` | - |

## 3.4 File Lain
  
Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | `src/package.json`, `src/package-lock.json`, `src/tsconfig.json`, `src/next.config.ts`, `src/vite.config.js`, `src/eslint.config.mjs` | Konfigurasi proyek Next.js, TypeScript, ESLint, dependensi aplikasi, dan konfigurasi *test runner* Vitest. |
| 2 | `src/README.md`, `src/READMENodeJS.md`, `src/AGENTS.md` | Dokumentasi instalasi, panduan menjalankan aplikasi dan pengujian, akun uji, serta standar pengembangan tim. |
| 3 | `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/favicon.ico` | *Root layout*, halaman utama (*landing page*), dan token desain Tailwind CSS global. |
| 4 | `src/app/admin/layout.tsx`, `src/app/admin/mediasi/layout.tsx`, `src/app/admin/tiket/layout.tsx`, `src/app/pengguna/layout.tsx`, `src/app/penyedia/layout.tsx` | Layout pembungkus berbasis peran (*role layout*) untuk area Admin, Pengguna Jasa, dan Penyedia Jasa. |
| 5 | `src/app/(auth)/profil/page.tsx`, `src/app/pesanan/page.tsx`, `src/app/penyedia/pesanan/page.tsx`, `src/app/penyedia/pesanan/[idPesanan]/page.tsx`, `src/app/admin/mediasi/page.tsx` | Rute halaman pendukung/pengalih untuk profil, daftar pesanan penyedia, detail pesanan penyedia, dan daftar mediasi admin. |
| 6 | `src/app/api/admin/auth/login/route.ts`, `src/app/api/admin/laporan/route.ts`, `src/app/api/admin/laporan/[id_tiket]/mediasi/route.ts`, `src/app/api/laporan/route.ts`, `src/app/api/laporan/[id_tiket]/route.ts`, `src/app/api/mediasi/helper.ts`, `src/app/api/penyedia/[id]/route.ts`, `src/app/api/pesanan/[id_pesanan]/deliverables/route.ts`, `src/app/api/pesanan/[id_pesanan]/deliverables/upload/route.ts`, `src/app/api/pesanan/[id_pesanan]/deliverables/helper.ts`, `src/app/api/pesanan/[id_pesanan]/produk-akhir/route.ts` | Route handler dan helper API tambahan untuk login admin, laporan, mediasi, profil penyedia, dan deliverables. |
| 7 | `src/components/elemen/*` (`Alert.tsx`, `Badge.tsx`, `Button.tsx`, `CardJasa.tsx`, `Chip.tsx`, `Field.tsx`, `Input.tsx`, `LampiranBukti.tsx`, `OptionCard.tsx`, `PageContainer.tsx`, `PageHero.tsx`, `Rating.tsx`, `Select.tsx`, `StatusPill.tsx`, `TabFilter.tsx`, `Textarea.tsx`, `Toggle.tsx`, `UploadBox.tsx`, `index.ts`) | Pustaka komponen antarmuka *reusable* sesuai sistem desain aplikasi. |
| 8 | `src/components/ui/navbar.tsx`, `src/components/ui/footer.tsx`, `src/components/ui/notifikasi.tsx` | Komponen navigasi berbasis peran, *footer* global, dan panel notifikasi. |
| 9 | `src/lib/api.ts`, `src/lib/cn.ts`, `src/lib/format.ts`, `src/lib/layanan.ts`, `src/lib/auth-admin.ts` | Utilitas pemanggilan API (`fetch` + *timeout* 10 detik), pemformatan Rupiah/ukuran berkas, penggabung kelas CSS, dan autentikasi admin. |
| 10 | `src/lib/client/*` (`admin.ts`, `auth.ts`, `bookmark.ts`, `chat.ts`, `deliverables.ts`, `jasa.ts`, `laporan.ts`, `mediasi.ts`, `notifikasi.ts`, `penyedia.ts`, `pesanan.ts`, `portofolio.ts`, `produk-akhir.ts`, `transaksi.ts`, `ulasan.ts`, `upload.ts`) | Modul *client-side API wrapper* penghubung komponen antarmuka ke endpoint `/api/...`. |
| 11 | `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `src/middleware.ts` | Konfigurasi koneksi Supabase browser, server SSR (*cookie-based*), dan *middleware* penyegaran sesi. |
| 12 | `src/lib/mock/jasa.ts`, `src/lib/mocks/*` (`bookmark.mock.ts`, `jasa.mock.ts`, `penyedia.mock.ts`, `pesanan.mock.ts`, `portofolio.mock.ts`, `transaksi.mock.ts`) | Data tiruan (*mock data*) untuk mode simulasi `NEXT_PUBLIC_USE_MOCK=true` dan pengujian unit. |
| 13 | `src/services/storage/portofolio.service.ts`, `src/services/penyedia.service.ts` | Layanan pendukung penyimpanan portofolio dan pengambilan profil/nama penyedia jasa. |
| 14 | `src/supabase/config.toml`, `src/supabase/seed.sql`, `src/supabase/migrations/20261108085000_add_berkas_pendukung_jasa.sql` s.d. `20261113200000_rpc_konfirmasi_selesai.sql` | Konfigurasi Supabase lokal, skema tambahan, kebijakan RLS (*Row Level Security*), fungsi/RPC database, dan data awal (*seed*). |
| 15 | `src/public/icons/*.svg`, `src/Fonts/*.ttf` | Aset ikon antarmuka SVG dan berkas tipografi Plus Jakarta Sans. |
| 16 | `src/test/*` (20 file: `App.test.jsx`, `autentikator.test.ts`, `auth.test.ts`, `bookmark.test.ts`, `chat.test.ts`, `deliverable.test.ts`, `deliverables.test.ts`, `dual-storage.test.ts`, `jasa.test.ts`, `mediasi.test.ts`, `notifikasi.test.ts`, `pelaporan.test.ts`, `pesanan.test.ts`, `portofolio.test.ts`, `search.test.ts`, `storage-interface.test.ts`, `test_integration.test.ts`, `transaksi.test.ts`, `ulasan.test.ts`, `upload.test.ts`) | Suite pengujian unit dan pengujian integrasi API/alur utama menggunakan Vitest. |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| C19 | HalamanDetailJasa | Tidak perlu | Halaman UI (Boundary) untuk detail jasa tanpa logika bisnis; teruji lewat C14 dan UC06. | - |
| C20 | Bookmark | Tidak perlu | Entity model data (`src/models/types.ts`) dan tabel `public.bookmark` tanpa logika mandiri; teruji lewat C22. | - |
| C21 | HalamanBookmark | Tidak perlu | Halaman UI (Boundary) daftar bookmark tanpa logika bisnis; teruji lewat C22 dan UC07. | - |
| C22 | PengontrolBookmark | Mendalam | Berisi validasi input, cegah duplikat bookmark, toggle idempotent + handle race condition `23505`, filter jasa nonaktif, serta cek auth dan anti-IDOR di `/api/bookmark`. | C22-UT01 s.d. C22-UT12 |
| C23 | ChatRoom | Tidak perlu | Entity model data (`ChatroomRow`, `ChatroomDetail`) dan tabel `public.chatroom` tanpa logika mandiri; teruji lewat C25 dan UC08. | - |
| C24 | HalamanChat | Tidak perlu | Halaman UI (Boundary) chat; teruji lewat C25 dan UC08. | - |
| C25 | LayananPesanInstan | Mendalam | Berisi validasi peserta room (`validasiAksesChatroom`), larangan room dengan diri sendiri, cek pesan/lampiran kosong, `getOrCreateChatroom`, dan trigger notifikasi ke `NotifikasiService`. | C25-UT01 s.d. C25-UT12 |
| C26 | LayananNotifikasiChat | Mendalam | Berisi guard `id_pengguna`/`user_id`, query paralel 20 notifikasi terbaru + `unread_count`, error handling non-blocking saat insert, dan `tandaiSudahDibaca`. | C26-UT01 s.d. C26-UT09 |
| C27 | Pesanan | Tidak perlu | Entity model data (`Pesanan`) dan tabel `public.pesanan`; aturan state dan bisnisnya teruji lewat C31. | - |
| C28 | HalamanPemesanan | Tidak perlu | Halaman UI (Boundary) form pemesanan jasa; teruji lewat C31 dan UC09. | - |
| C29 | HalamanPembayaran | Tidak perlu | Halaman UI (Boundary) pilih metode dan tombol bayar; teruji lewat C32 dan UC09. | - |
| C30 | HalamanRiwayatTransaksi | Tidak perlu | Halaman UI (Boundary) daftar pesanan dan riwayat transaksi; teruji lewat C31, C32, UC09, UC10, dan UC14. | - |
| C31 | PengontrolPesanan | Mendalam | Mengatur state transition pesanan (`validasiTransisiStatus`), batas maksimal 2 pesanan aktif (`MAKS_PESANAN_AKTIF`), larangan pesan jasa sendiri, snapshot harga, cek role penyedia, dan logika refund. | C31-UT01 s.d. C31-UT12 |
| C32 | PengontrolTransaksi | Mendalam | Berisi validasi metode bayar, guard double payment (`neq('status_pembayaran', 'LUNAS')`), cek nominal `total_biaya`, rollback saat insert `riwayat_transaksi` gagal, filter riwayat per role, dan `setPencairanDana`. | C32-UT01 s.d. C32-UT12, KNF04-TC01 |
| C33 | MetodePembayaran | Tidak perlu | Entity model data (`MetodePembayaran`) dan tabel `public.metode_pembayaran` tanpa logika mandiri; teruji lewat C32. | - |
| C34 | RiwayatTransaksi | Tidak perlu | Entity model data (`RiwayatTransaksi`) dan tabel `public.riwayat_transaksi` tanpa logika mandiri; teruji lewat C32. | - |
| C35 | HalamanKonfirmasi | Tidak perlu | Halaman UI (Boundary) konfirmasi pesanan penyedia; teruji lewat C31 dan UC10. | - |
| C36 | ProdukAkhir | Tidak perlu | Entity model data (`ProdukAkhir`) dan tabel `public.produk_akhir` tanpa logika mandiri; teruji lewat C54 (`DeliverablesService`), UC11, dan UC12. | - |
| C37 | HalamanPengumpulan | Tidak perlu | Halaman UI (Boundary) upload hasil kerja penyedia; teruji lewat C54 dan UC11. | - |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: `cd src && npx vitest run` (atau `cd src && npx vitest run --coverage`).

Lokasi file test: `src/test/`.

### 4.2.1 Kelas PengontrolBookmark (C22)

**ID Kelas:** C22  
**Nama Kelas:** PengontrolBookmark (`src/services/bookmark.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.1. Hasil Pengujian Unit Kelas C22 (PengontrolBookmark)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C22-UT01 | `tambahDataBookmark(id_pengguna_jasa, id_jasa)` | Normal | Tambahkan jasa aktif `'j2'` (memori) dan `'j1'` (mock DB) untuk pengguna `'u1'` | Menghasilkan objek `Bookmark` baru dengan `id_bookmark` | Objek `Bookmark` berhasil dibuat dan dikembalikan | Pass |
| C22-UT02 | `tambahDataBookmark()` via `toggleBookmark()` | Batas | Simulasikan *race condition* double-click: cek awal belum ada, lalu insert melempar kode unik `23505` | Sistem otomatis memanggil `hapusDataBookmark` dan mengembalikan `{ action: 'removed', data: null }` | Mengembalikan `{ action: 'removed', data: null }` tanpa gagal | Pass |
| C22-UT03 | `tambahDataBookmark(id_pengguna_jasa, id_jasa)` | Negatif | Tambahkan jasa yang sudah dibookmark (duplikat / `23505`), parameter kosong (`'   '`), atau jasa nonaktif/tidak ditemukan | Melempar `'Jasa sudah ada di dalam bookmark'`, `'Parameter input tidak valid'`, atau `'Data jasa tidak ditemukan'` | Error duplikasi, validasi input, dan jasa tidak ditemukan dilempar sesuai kasus | Pass |
| C22-UT04 | `hapusDataBookmark(id_pengguna_jasa, id_jasa)` | Normal | Hapus bookmark milik `'u1'` berdasarkan `id_jasa` (`'j1'`) | Item terhapus dari daftar dan fungsi mengembalikan `true` | Item terhapus dan mengembalikan `true` | Pass |
| C22-UT05 | `hapusDataBookmark(id_pengguna_jasa, undefined, id_bookmark)` | Batas | Hapus bookmark spesifik menggunakan parameter opsional `id_bookmark` (`'b2'`) saat `id_jasa` tidak dikirim | Hanya bookmark `'b2'` yang terhapus dan mengembalikan `true` | Hanya `'b2'` yang terhapus; bookmark lain tetap ada | Pass |
| C22-UT06 | `hapusDataBookmark(id_pengguna_jasa, id_jasa)` | Negatif | Hapus bookmark yang tidak ada milik `'u1'` (`'j2'` di memori atau hasil delete DB `[]`) | Melempar `'Data bookmark tidak ditemukan'` | Error `'Data bookmark tidak ditemukan'` dilempar | Pass |
| C22-UT07 | `ambilDaftarBookmarkPengguna(id_pengguna_jasa)` | Normal | Ambil daftar bookmark milik `'u1'` dengan 2 jasa aktif | Mengembalikan 2 bookmark aktif milik `'u1'` terurut terbaru (`['j3', 'j1']`) dengan detail jasa terpasang | Mengembalikan `['j3', 'j1']` dengan detail jasa | Pass |
| C22-UT08 | `ambilDaftarBookmarkPengguna(id_pengguna_jasa)` | Batas | Panggil untuk pengguna baru `'u-baru'` (0 bookmark) serta pengguna dengan 1 jasa aktif dan 1 jasa nonaktif (`status_aktif: false`) | Pengguna baru mengembalikan `[]`; jasa nonaktif otomatis disaring sehingga hanya tersisa 1 jasa aktif | Mengembalikan `[]` untuk user baru dan menyaring jasa nonaktif | Pass |
| C22-UT09 | `ambilDaftarBookmarkPengguna(id_pengguna_jasa)` | Negatif | Panggil dengan `id_pengguna_jasa` kosong/spasi (`''`, `'   '`) | Melempar `'Parameter input tidak valid'` | Error `'Parameter input tidak valid'` dilempar | Pass |
| C22-UT10 | `toggleBookmark(id_pengguna_jasa, id_jasa)` & `/api/bookmark` | Normal | Panggil `toggleBookmark` saat belum ada lalu panggil lagi saat sudah ada | Panggilan pertama `{ action: 'added' }`, panggilan kedua `{ action: 'removed', data: null }` | Kedua panggilan mengembalikan aksi dan status sesuai harapan | Pass |
| C22-UT11 | `GET /api/bookmark` | Batas | Akses `GET /api/bookmark` dengan sesi valid namun pengguna belum memiliki bookmark | Mengembalikan status `200 OK` dengan `data: []` | Status `200` dengan `data: []` dikembalikan | Pass |
| C22-UT12 | `GET / POST / DELETE /api/bookmark` | Negatif | Akses non-mock tanpa sesi (`GET`), atau kirim `id_pengguna_jasa` milik pengguna lain (IDOR), atau JSON body rusak | Status `401 UNAUTHORIZED`, `403 FORBIDDEN`, dan `400 VALIDATION_ERROR` | Seluruh status kode dan `error_code` sesuai kontrak | Pass |

Tabel 4.2.1b. Ringkasan Cakupan Kelas C22 (PengontrolBookmark)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `tambahDataBookmark()`, `hapusDataBookmark()`, `ambilDaftarBookmarkPengguna()` |
| Operasi yang diuji | `tambahDataBookmark()`, `hapusDataBookmark()`, `ambilDaftarBookmarkPengguna()`, `toggleBookmark()`, `validasiInput()` (3 dari 3 operasi public pada DPPL) |
| ID Algoritma yang tercakup | Algo-2201 (simpan bookmark), Algo-2202 (hapus bookmark), Algo-2203 (ambil daftar bookmark), Algo-2001–Algo-2003 (operasi data bookmark) |
| Coverage (wajib ≥ 70%) | 100% line / 83,56% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

---

### 4.2.2 Kelas LayananPesanInstan (C25)

**ID Kelas:** C25  
**Nama Kelas:** LayananPesanInstan (`ChatService` pada `src/services/chat.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.2. Hasil Pengujian Unit Kelas C25 (LayananPesanInstan)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C25-UT01 | `getDaftarChatroom(user_id)` | Normal | Panggil `ChatService.getDaftarChatroom('user-1')` dengan mock data 1 room | Mengembalikan daftar chatroom milik `'user-1'` beserta relasi `pengguna_jasa` dan `penyedia_jasa` | Daftar chatroom dikembalikan dengan properti relasi lengkap | Pass |
| C25-UT02 | `getDaftarChatroom(user_id)` | Batas | Panggil untuk pengguna yang belum memiliki ruang obrolan sama sekali (`data: []`) | Mengembalikan array kosong `[]` | Mengembalikan `[]` | Pass |
| C25-UT03 | `getDaftarChatroom(user_id)` | Negatif | Mock query Supabase mengembalikan error `'Database failure'` | Melempar error `'Gagal memuat daftar obrolan: Database failure'` | Error dilempar sesuai pesan yang diharapkan | Pass |
| C25-UT04 | `getOrCreateChatroom(id_pengguna_jasa, id_penyedia_jasa)` | Normal | Panggil untuk pasangan `'u1'` dan `'p1'` yang belum memiliki room sebelumnya | Membuat room baru di tabel `chatroom` dan mengembalikan data room | Room baru berhasil dibuat via `insert` dan dikembalikan | Pass |
| C25-UT05 | `getOrCreateChatroom(id_pengguna_jasa, id_penyedia_jasa)` | Batas | Panggil berulang untuk pasangan `'u1'` dan `'p1'` yang room-nya sudah ada | Mengembalikan room yang sudah ada tanpa melakukan `insert` ulang (*idempotent*) | Mengembalikan room lama tanpa `insert` duplikat | Pass |
| C25-UT06 | `getOrCreateChatroom(id_pengguna_jasa, id_penyedia_jasa)` | Negatif | Panggil dengan `id_pengguna_jasa === id_penyedia_jasa` (`'user-1'`, `'user-1'`) atau gagal insert DB | Melempar `'Tidak dapat membuat ruang obrolan dengan diri sendiri.'` atau `'Gagal membuat ruang obrolan: ...'` | Error validasi dan gagal insert dilempar sesuai harapan | Pass |
| C25-UT07 | `getRiwayatPesan(id_chatroom, user_id)` | Normal | Panggil `getRiwayatPesan('room-1', 'u1')` saat `'u1'` merupakan anggota room berisi pesan | Memvalidasi akses dan mengembalikan array riwayat pesan dari tabel `pesan_chat` | Riwayat pesan berhasil dikembalikan | Pass |
| C25-UT08 | `getRiwayatPesan(id_chatroom, user_id)` | Batas | Panggil untuk room valid yang belum memiliki pesan sama sekali (`data: []`) | Memvalidasi akses dan mengembalikan array kosong `[]` | Mengembalikan `[]` | Pass |
| C25-UT09 | `getRiwayatPesan(id_chatroom, user_id)` | Negatif | Panggil dengan room tidak ditemukan (`'room-invalid'`), pengguna bukan anggota (`'stranger-user'`), atau error query DB | Melempar `'Ruang obrolan tidak ditemukan.'`, `'Akses ditolak. Anda bukan peserta ruang obrolan ini.'`, atau `'Gagal memuat pesan: DB Error'` | Seluruh skenario penolakan akses dan galat DB melempar pesan tepat | Pass |
| C25-UT10 | `kirimPesan(id_chatroom, user_id, isi_pesan, lampiran)` | Normal | Kirim pesan teks normal (`'Halo, apakah jasa ini tersedia?'`) oleh peserta room `'u1'` | Pesan tersimpan ke `pesan_chat` dan memicu `NotifikasiService.kirimNotifikasi` ke lawan bicara | Pesan tersimpan dan notifikasi dipicu sesuai target | Pass |
| C25-UT11 | `kirimPesan(id_chatroom, user_id, isi_pesan, lampiran)` | Batas | Kirim pesan berupa lampiran saja tanpa teks (`isi_pesan = ''`, `lampiran = 'https://.../file.pdf'`) atau pesan teks `> 50` karakter | Lampiran memicu notifikasi `'Mengirimkan lampiran'`; teks `> 50` karakter dipotong menjadi 50 karakter + `'...'` | Kedua kondisi batas menghasilkan pesan dan preview notifikasi sesuai | Pass |
| C25-UT12 | `kirimPesan(id_chatroom, user_id, isi_pesan, lampiran)` | Negatif | Kirim pesan spasi saja (`'   '`) tanpa lampiran (`null`), atau query `insert` ke `pesan_chat` gagal | Melempar `'Isi pesan tidak boleh kosong.'` atau `'Gagal mengirim pesan: Insert message failed'` tanpa memicu notifikasi | Error dilempar sesuai kasus dan notifikasi tidak dipicu | Pass |

Tabel 4.2.2b. Ringkasan Cakupan Kelas C25 (LayananPesanInstan)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `buatSesiChat()`, `validasiInputPesan()`, `kirimPesan()`, `simpanKeDatabase()`, `updateStatusBaca()` |
| Operasi yang diuji | `getDaftarChatroom()`, `getOrCreateChatroom()`, `getRiwayatPesan()`, `kirimPesan()`, `validasiAksesChatroom()` (4 dari 4 operasi public yang diimplementasikan; `updateStatusBaca` tidak diimplementasikan sesuai Tabel B.1 M9) |
| ID Algoritma yang tercakup | Algo-2501 (buat/ambil sesi chatroom), Algo-2502 (validasi input & akses pesan), Algo-2503 (kirim pesan & trigger notifikasi), Algo-2504 (simpan pesan ke database) |
| Coverage (wajib ≥ 70%) | 100% line / 90,19% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

---

### 4.2.3 Kelas LayananNotifikasiChat (C26)

**ID Kelas:** C26  
**Nama Kelas:** LayananNotifikasiChat (`NotifikasiService` pada `src/services/notifikasi.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.3. Hasil Pengujian Unit Kelas C26 (LayananNotifikasiChat)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C26-UT01 | `kirimNotifikasi(payload)` | Normal | Kirim payload lengkap dengan `id_pengguna`, `judul`, `pesan_notifikasi`, `id_pesanan`, dan `id_referensi` | Insert ke tabel `notifikasi` dengan `is_read: false` dan mengembalikan `true` | Insert dipanggil dengan payload tepat dan mengembalikan `true` | Pass |
| C26-UT02 | `kirimNotifikasi(payload)` | Batas | Kirim payload minimum tanpa field opsional `id_pesanan` dan `id_referensi` | Field opsional otomatis diisi `null` saat insert | `id_pesanan: null` dan `id_referensi: null` tercatat pada insert | Pass |
| C26-UT03 | `kirimNotifikasi(payload)` | Negatif | Kirim `id_pengguna` kosong/spasi (`''`, `'   '`) atau insert DB gagal (`'Database insert failure'`) | `id_pengguna` kosong mengembalikan `false` tanpa memanggil DB; gagal insert dicatat ke `console.error` secara non-blocking (`true`) | Guard mengembalikan `false` dan error DB ditangani non-blocking | Pass |
| C26-UT04 | `getNotifikasiUser(user_id)` | Normal | Panggil `getNotifikasiUser('user-123')` | Menjalankan 2 query paralel (`limit(20)` + `unread_count`) dan mengembalikan `{ notifikasi, unread_count: 3 }` | Mengembalikan daftar notifikasi dan `unread_count: 3` | Pass |
| C26-UT05 | `getNotifikasiUser(user_id)` | Batas | Panggil dengan `user_id` kosong/spasi (`''`, `'   '`) | Mengembalikan `{ notifikasi: [], unread_count: 0 }` tanpa memanggil DB | Mengembalikan struktur kosong tanpa memanggil `createClient` | Pass |
| C26-UT06 | `getNotifikasiUser(user_id)` | Negatif | Query daftar notifikasi gagal atau query hitung `unread_count` gagal | Melempar error `'Gagal memuat notifikasi: ...'` atau `'Gagal menghitung notifikasi belum dibaca: ...'` | Kedua kondisi galat melempar pesan error sesuai | Pass |
| C26-UT07 | `tandaiSudahDibaca(user_id, id_notifikasi)` | Normal | Panggil dengan `id_notifikasi` spesifik (`'notif-99'`) | Memperbarui `is_read: true` khusus untuk `'notif-99'` dan mengembalikan `true` | Update berhasil pada target spesifik dan mengembalikan `true` | Pass |
| C26-UT08 | `tandaiSudahDibaca(user_id)` | Batas | Panggil tanpa `id_notifikasi` untuk menandai seluruh notifikasi pengguna yang belum dibaca sekaligus | Memperbarui seluruh record `is_read = false` milik pengguna menjadi `true` dan mengembalikan `true` | Update massal berhasil dan mengembalikan `true` | Pass |
| C26-UT09 | `tandaiSudahDibaca(user_id)` | Negatif | Update Supabase mengembalikan error `'Update error'` | Melempar `'Gagal memperbarui status notifikasi: Update error'` | Error dilempar sesuai rancangan | Pass |

Tabel 4.2.3b. Ringkasan Cakupan Kelas C26 (LayananNotifikasiChat)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `kirimNotifikasiPesan()`, `tampilkanPopUpNotifikasi()` |
| Operasi yang diuji | `kirimNotifikasi()`, `getNotifikasiUser()`, `tandaiSudahDibaca()` (3 dari 3 operasi public pada `NotifikasiService`) |
| ID Algoritma yang tercakup | Algo-2601 (kirim & simpan notifikasi), Algo-2602 (ambil daftar & perbarui status baca notifikasi) |
| Coverage (wajib ≥ 70%) | 100% line / 92,30% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

---

### 4.2.4 Kelas PengontrolPesanan (C31)

**ID Kelas:** C31  
**Nama Kelas:** PengontrolPesanan (`PesananService` pada `src/services/pesanan.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.4. Hasil Pengujian Unit Kelas C31 (PengontrolPesanan)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C31-UT01 | `buatPesananBaru(id_pengguna_jasa, id_jasa, brief)` | Normal | Buat pesanan untuk jasa aktif `'j2'` (harga `150000`) oleh `'u1'` dengan brief `'  Tolong edit video durasi 45 detik  '` | Pesanan dibuat dengan status `MENUNGGU_PEMBAYARAN`, brief ter-*trim*, dan `total_biaya` terkunci (*snapshot* harga `150000`) | Pesanan dibuat dengan `total_biaya = 150000` (tetap meski harga jasa diubah setelahnya) | Pass |
| C31-UT02 | `buatPesananBaru(id_pengguna_jasa, id_jasa, brief)` | Batas | Pengguna sudah memiliki tepat 2 pesanan aktif (`MAKS_PESANAN_AKTIF = 2`), mencoba membuat pesanan ke-3; lalu mencoba lagi setelah 1 pesanan berstatus terminal (`DITOLAK`) | Pesanan ke-3 ditolak (`'Batas maksimal 2 pesanan aktif telah tercapai'`), lalu diizinkan kembali setelah 1 pesanan selesai/ditolak | Batas maksimal 2 pesanan aktif ditegakkan di memori dan di mock DB | Pass |
| C31-UT03 | `buatPesananBaru(id_pengguna_jasa, id_jasa, brief)` | Negatif | Brief kosong/spasi (`'   '`), parameter kosong, jasa tidak ditemukan/nonaktif (`'j4'`), atau memesan jasa milik sendiri (`'p1'` memesan `'j1'`) | Melempar `'Brief pemesanan wajib diisi'`, `'Parameter pemesanan tidak valid'`, `'Data jasa tidak ditemukan'`, atau `'Tidak dapat memesan jasa milik sendiri'` | Seluruh kondisi penolakan melempar pesan error sesuai rancangan | Pass |
| C31-UT04 | `validasiTransisiStatus(status_awal, status_baru)` | Normal | Uji transisi maju standar: `MENUNGGU_PEMBAYARAN -> DIPROSES`, `DIPROSES -> MENUNGGU_KONFIRMASI_SELESAI`, `MENUNGGU_KONFIRMASI_SELESAI -> SELESAI` | Mengembalikan status tujuan ternormalisasi | Seluruh transisi maju mengembalikan status tujuan | Pass |
| C31-UT05 | `validasiTransisiStatus(status_awal, status_baru)` | Batas | Uji transisi siklus revisi (`MENUNGGU_KONFIRMASI_SELESAI -> DIPROSES`) dan eskalasi komplain (`DIPROSES -> KOMPLAIN`) | Mengembalikan status tujuan ternormalisasi untuk siklus revisi dan komplain | Transisi revisi dan komplain diterima sesuai state machine | Pass |
| C31-UT06 | `validasiTransisiStatus(status_awal, status_baru)` | Negatif | Uji transisi lompat atau dari status terminal: `MENUNGGU_PEMBAYARAN -> SELESAI`, `SELESAI -> DIPROSES`, `DITOLAK -> DIPROSES` | Melempar error `'Transisi status pesanan ... tidak valid'` | Seluruh transisi terlarang ditolak dengan error | Pass |
| C31-UT07 | `konfirmasiPesanan(...)` & `respondOrder(...)` | Normal | Penyedia pemilik (`'p1'`) menerima (`'terima'` / `'Diterima'`) pesanan `'ord-1'` | Status pesanan berubah menjadi `'DIPROSES'` | `status_pesanan` menjadi `'DIPROSES'` | Pass |
| C31-UT08 | `konfirmasiPesanan(...)` & `respondOrder(...)` | Batas | Penyedia pemilik (`'p1'`) menolak (`'tolak'`) pesanan `'ord-1'` yang berstatus pembayaran `'LUNAS'` | Status pesanan menjadi `'DITOLAK'` dan `status_pembayaran` otomatis menjadi `'DIKEMBALIKAN'` (*refund*) | `status_pesanan = 'DITOLAK'` dan `status_pembayaran = 'DIKEMBALIKAN'` | Pass |
| C31-UT09 | `konfirmasiPesanan(...)` & `respondOrder(...)` | Negatif | Konfirmasi oleh penyedia lain (`'p2'`), pesanan sudah `'DIPROSES'`/`'SELESAI'`, atau tindakan tidak valid (`'pending'`/`'invalid'`) | Melempar `'Akses ditolak...'`, `'Pesanan ini sudah diproses sebelumnya'`, atau `'Tindakan konfirmasi tidak valid'` | Seluruh penolakan otorisasi, status, dan tindakan dilempar tepat | Pass |
| C31-UT10 | `ambilDaftarPesanan(...)` & `ambilDetailPesanan(...)` | Normal | Ambil daftar pesanan untuk role `'pengguna_jasa'` & `'penyedia_jasa'` serta detail pesanan `'ord-1'` | Mengembalikan daftar pesanan milik masing-masing role terurut terbaru dan detail `'ord-1'` | Urutan daftar dan detail `'ord-1'` akurat | Pass |
| C31-UT11 | `ambilDaftarPesanan(...)` | Batas | Filter daftar pesanan berdasarkan tab `'berjalan'` vs `'selesai'`, serta pengguna yang belum memiliki pesanan (`[]`) | Hanya mengembalikan pesanan sesuai tab aktif/selesai, dan `[]` jika belum ada pesanan | Filter tab dan empty list berjalan akurat | Pass |
| C31-UT12 | `ambilDaftarPesanan(...)` & `ambilDetailPesanan(...)` | Negatif | `id_pengguna` / `id_pesanan` kosong (`''`), role tidak valid (`'admin'`), atau ID pesanan tidak ditemukan (`'ord-404'`) | Melempar `'ID pengguna tidak valid'`, `'ID pesanan tidak valid'`, `'Peran pengguna tidak valid'`, atau `'Pesanan tidak ditemukan'` | Seluruh error validasi dan not found dilempar sesuai | Pass |

Tabel 4.2.4b. Ringkasan Cakupan Kelas C31 (PengontrolPesanan)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `buatPesananBaru()`, `hitungTotalBiaya()`, `updateStatusPesanan()`, `getDetailPesanan()` |
| Operasi yang diuji | `buatPesananBaru()`, `validasiTransisiStatus()`, `konfirmasiPesanan()`, `respondOrder()`, `ambilDaftarPesanan()`, `ambilDetailPesanan()` (4 dari 4 operasi public pada DPPL; `hitungTotalBiaya` terintegrasi sebagai *snapshot* harga pada `buatPesananBaru`) |
| ID Algoritma yang tercakup | Algo-3101 (buat pesanan & snapshot biaya), Algo-3102 (validasi batas pesanan aktif), Algo-3103 (validasi transisi status pesanan), Algo-3104 (ambil detail & daftar pesanan), Algo-0205–Algo-0206 (konfirmasi terima/tolak pesanan penyedia) |
| Coverage (wajib ≥ 70%) | 94,73% line / 84,09% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

---

### 4.2.5 Kelas PengontrolTransaksi (C32)

**ID Kelas:** C32  
**Nama Kelas:** PengontrolTransaksi (`src/services/transaksi.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.5. Hasil Pengujian Unit Kelas C32 (PengontrolTransaksi)

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C32-UT01 | `ambilDaftarMetode()` & `dapatkanDetailMetode()` | Normal | Ambil daftar seluruh metode pembayaran dari mock DB dan detail metode `'VA_BCA'` | Mengembalikan daftar metode dan detail `'BCA Virtual Account'` (`8801081234567890`) | Daftar dan detail metode dikembalikan akurat | Pass |
| C32-UT02 | `dapatkanDetailMetodeDiMemori(id_metode)` | Batas | Panggil pencarian kode metode dengan huruf kecil dan spasi berlebih (`'  va_bca  '`) | Kode metode dinormalisasi menjadi `'VA_BCA'` dan mengembalikan detail metode | Normalisasi berhasil dan detail `'VA_BCA'` dikembalikan | Pass |
| C32-UT03 | `ambilDaftarMetode()` & `dapatkanDetailMetode()` | Negatif | ID metode spasi (`'   '`), metode tidak terdaftar (`'METODE_TIDAK_ADA'`), atau error DB pada `ambilDaftarMetode()` | Melempar `'ID metode pembayaran tidak valid'`, `'Metode pembayaran tidak ditemukan'`, atau pesan error DB | Seluruh kondisi error ditangani tepat | Pass |
| C32-UT04 | `prosesPembayaranDummy(id_pesanan, id_metode, jumlah_bayar)` | Normal | Bayar `'ord-unpaid'` (`total_biaya = 250000`) dengan `'VA_BCA'` dan `jumlah_bayar = 250000` | `pesanan.status_pembayaran = 'LUNAS'`, `pesanan.status_pesanan = 'DIPROSES'`, dan `transaksi.status_transaksi = 'BERHASIL'` | Status pesanan dan catatan transaksi terbentuk sesuai rancangan | Pass |
| C32-UT05 | `prosesPembayaranDummy(id_pesanan, id_metode, jumlah_bayar)` | Batas | Update status `pesanan` berhasil, namun insert ke `riwayat_transaksi` gagal (`error`) | Sistem melakukan *rollback* kompensasi tabel `pesanan` ke `MENUNGGU_PEMBAYARAN` & `id_metode_pembayaran: null`, lalu melempar error | `updateCalls` tercatat 2 kali; pemanggilan ke-2 mengembalikan status awal | Pass |
| C32-UT06 | `prosesPembayaranDummy(...)` | Negatif | Pembayaran ganda (`'LUNAS'`), nominal tidak sama (`100000` vs `250000`) atau negatif (`-5000`), metode palsu, atau pesanan tidak ada | Melempar `'Pesanan tidak dalam status menunggu pembayaran'`, `'Nominal pembayaran tidak sesuai...'`, `'Nominal pembayaran tidak valid'`, atau `'Pesanan tidak ditemukan'` | Seluruh penolakan pembayaran ganda, nominal, dan data tidak valid berjalan tepat | Pass |
| C32-UT07 | `ambilRiwayatTransaksi(id_pengguna, peran)` | Normal | Ambil riwayat transaksi untuk `'u1'` (`pengguna_jasa`) dan `'p1'` (`penyedia_jasa`) | Mengembalikan riwayat transaksi milik masing-masing role terurut terbaru dengan relasi `pesanan` & `metode_pembayaran` | Mengembalikan `'trx-1'` untuk `'u1'` dan `'trx-2'` untuk `'p1'` | Pass |
| C32-UT08 | `ambilRiwayatTransaksi(id_pengguna, peran)` | Batas | Ambil riwayat untuk pengguna yang belum memiliki transaksi sama sekali (`data: []`) | Mengembalikan array kosong `[]` | Mengembalikan `[]` | Pass |
| C32-UT09 | `ambilRiwayatTransaksi(id_pengguna, peran)` | Negatif | `id_pengguna` kosong (`''`), role tidak valid (`'admin'`), atau query Supabase gagal | Melempar `'ID pengguna tidak valid'`, `'Peran pengguna tidak valid'`, atau error query | Error validasi dan query dilempar sesuai | Pass |
| C32-UT10 | `setPencairanDana(id_pesanan, selesai)` | Normal | Cairkan dana untuk pesanan `'LUNAS'` yang `status_pencairan = false` (`selesai = true`) | Mengubah `status_pencairan = true`, mengisi `waktu_pencairan`, dan mengembalikan `true` | Status pencairan menjadi `true` dan `waktu_pencairan` terisi | Pass |
| C32-UT11 | `setPencairanDana(id_pesanan, selesai)` | Batas | Percobaan pencairan ulang pada pesanan yang sudah dicairkan (`status_pencairan = true` / update guard `.eq('status_pencairan', false)` mengembalikan `null`) | Guard menolak pencairan ganda dan melempar `'Dana untuk pesanan ini sudah dicairkan sebelumnya'` | Guard pencairan ganda berjalan tepat | Pass |
| C32-UT12 | `setPencairanDana(id_pesanan, selesai)` | Negatif | `selesai = false`, pesanan belum `'LUNAS'` (`'ord-unpaid'`), atau `id_pesanan` kosong/tidak ditemukan | Melempar `'Pencairan dana hanya dapat dilakukan untuk pesanan selesai'`, `'...untuk pesanan yang sudah lunas'`, atau error not found | Seluruh guard pencairan dana berjalan tepat | Pass |

Tabel 4.2.5b. Ringkasan Cakupan Kelas C32 (PengontrolTransaksi)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `prosesPembayaran()`, `validasiPembayaran()`, `setPencairanDana()`, `updateStatusPembayaran()`, `catatRiwayatTransaksi()` |
| Operasi yang diuji | `ambilDaftarMetode()`, `dapatkanDetailMetode()`, `prosesPembayaranDummy()`, `ambilRiwayatTransaksi()`, `setPencairanDana()` (5 dari 5 operasi public pada DPPL) |
| ID Algoritma yang tercakup | Algo-3201 (validasi metode & nominal), Algo-3202 (proses pembayaran dummy & rollback), Algo-3203 (update status pembayaran), Algo-3204 (catat riwayat transaksi), Algo-3205 (pencairan dana), Algo-3301 (daftar metode pembayaran), Algo-3401 (riwayat transaksi) |
| Coverage (wajib ≥ 70%) | 97,82% line / 80,90% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| *I-01* | *KeranjangController* | *Keranjang (Model)* | *Controller - Model* | *INT-TC01, INT-TC02* |
| *I-02* | *Pesanan (Model)* | *Database* | *Aplikasi - Basis data* | *INT-TC03* |
| *I-03* | *PaymentGatewayAdapter* | *Payment Gateway (dummy)* | *Aplikasi - Sistem eksternal* | *INT-TC04, INT-TC05* |
| *[I-XX]* | *[Komponen asal]* | *[Komponen tujuan]* | *[Jenis batas]* | *[ID test case]* |
| *...* | *...* | *...* | *...* | *...* |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *INT-TC01* | *I-01* | *Normal: tambah item ke keranjang* | *Panggil `tambahItem()` melalui KeranjangController dengan produk valid* | *Item tersimpan pada Keranjang dan tampil pada daftar item* | *[Hasil aktual]* | *Pass/Fail* |
| *INT-TC03* | *I-02* | *Normal: simpan pesanan* | *Buat pesanan, lalu baca ulang langsung dari basis data* | *Baris pesanan ada dengan nilai total dan status yang sama* | *[...]* | *Pass/Fail* |
| *INT-TC05* | *I-03* | *Gagal: gateway mengembalikan status gagal* | *Kirim otorisasi dengan saldo dummy tidak cukup* | *Status pesanan tidak berubah menjadi "Lunas", pesan gagal diteruskan ke pengguna* | *[...]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.4 Use Case Mengunggah Penawaran Jasa (UC04)

**ID Use Case:** UC04  
**Nama Use Case:** Mengunggah Penawaran Jasa

Tabel 4.4.4. Hasil Pengujian Use Case UC04

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC04-TC01 | KF05 | Normal | 1. Buka halaman `/penyedia/upload-jasa` (I-04) sebagai Penyedia Jasa.<br>2. Isi nama jasa, pilih kategori, masukkan harga, isi deskripsi, dan unggah berkas contoh valid.<br>3. Klik tombol "Unggah Jasa". | Nama: "Desain Logo"<br>Kategori: "Desain Grafis"<br>Harga: 150000<br>Deskripsi: "Logo profesional"<br>Berkas: contoh.png (`image/png`, `< 10 MB`) | Data penawaran jasa dan tautan berkas tersimpan, form direset, dan muncul notifikasi "Penawaran jasa berhasil diunggah dan sudah tampil di pencarian.". | Penawaran jasa beserta tautan berkas tersimpan, notifikasi "Penawaran jasa berhasil diunggah dan sudah tampil di pencarian." tampil di atas form, dan isian form otomatis direset. | Pass |
| UC04-TC02 | KF05 | Alternatif: Data atau Format Berkas Tidak Valid | 1. Buka `/penyedia/upload-jasa` (I-04).<br>2. Kosongkan kolom wajib, masukkan harga `0`, atau pilih berkas tidak didukung (mis. `.exe` atau ukuran `> 10 MB`).<br>3. Klik "Unggah Jasa". | Kasus A: nama jasa kosong, harga `0`<br>Kasus B: `malware.exe` atau berkas `11 MB` | Proses unggah ditolak dan muncul pesan peringatan validasi pada field/form tanpa menyimpan data. | Penyimpanan ditolak dan muncul pesan error umum "Data belum lengkap atau format berkas tidak didukung. Periksa kembali isian yang ditandai." beserta pesan error di tiap field wajib yang kosong. | Pass |

### 4.4.5 Use Case Mencari Penawaran Jasa (UC05)

**ID Use Case:** UC05  
**Nama Use Case:** Mencari Penawaran Jasa

Tabel 4.4.5. Hasil Pengujian Use Case UC05

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC05-TC01 | KF06 | Normal: Pencarian Kata Kunci | 1. Buka `/pengguna/pencarian` (I-05).<br>2. Masukkan kata kunci pada search bar dan klik tombol "Cari". | keyword: "Logo" | Sistem menampilkan daftar kartu jasa aktif yang relevan dengan kata kunci (prioritas kecocokan nama jasa sebelum deskripsi). | Daftar kartu jasa aktif yang cocok tampil terurut dengan kecocokan nama jasa di urutan teratas. | Pass |
| UC05-TC02 | KF07 | Normal: Penerapan Filter Harga & Rating | 1. Pada `/pengguna/pencarian` (I-05), isi kolom "Rp minimum" dan "Rp maksimum" lalu tekan Enter atau klik di luar input.<br>2. Pilih chip rating (`★ 4+`). | `harga_min`: 100000, `harga_max`: 200000, `rating_min`: 4 | Daftar hasil diperbarui hanya menampilkan jasa aktif yang memenuhi rentang harga dan rating minimum tersebut. | Daftar kartu jasa tersaring sesuai rentang harga (`100000`–`200000`) dan rating (`>= 4`). | Pass |
| UC05-TC03 | KF16 | Normal: Komparasi Spesifikasi Jasa | 1. Kirim permintaan perbandingan 2–4 jasa melalui endpoint `GET /api/jasa?compare=j1,j2`. | `compare`: `j1,j2` | Sistem mengembalikan matriks perbandingan berisi daftar jasa beserta ringkasan `id_termurah`, `id_termahal`, `selisih_harga`, dan `id_rating_tertinggi`. | Endpoint `GET /api/jasa?compare=j1,j2` mengembalikan respons JSON matriks perbandingan dan ringkasan harga/rating dengan akurat. *(Catatan: tombol UI komparasi terpisah pada `/pengguna/pencarian` belum ada).* | Pass *(Level API)* |
| UC05-TC04 | KF06 | Alternatif: Hasil Pencarian Tidak Ditemukan | 1. Masukkan kata kunci yang tidak cocok dengan jasa aktif mana pun pada search bar, lalu klik "Cari". | keyword: "tidakada" | Sistem menampilkan pesan status kosong "Jasa tidak ditemukan" beserta saran mengubah kata kunci/filter. | UI menampilkan alert "Jasa tidak ditemukan." dan kotak status kosong bertuliskan "Jasa tidak ditemukan" dengan teks "Coba kata kunci lain atau ubah filter.". | Pass |
| UC05-TC05 | KF06 | Alternatif: Kata Kunci Kurang dari 3 Karakter | 1. Masukkan kata kunci `< 3` karakter pada search bar lalu klik "Cari". | keyword: "ab" | Sistem menolak pencarian dan menampilkan pesan "Kata kunci minimal 3 karakter.". | Pencarian tidak dijalankan dan UI menampilkan pesan peringatan "Kata kunci minimal 3 karakter.". | Pass |

### 4.4.6 Use Case Melihat Informasi Jasa (UC06)

**ID Use Case:** UC06  
**Nama Use Case:** Melihat Informasi Jasa

Tabel 4.4.6. Hasil Pengujian Use Case UC06

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC06-TC01 | KF08 | Normal | 1. Klik salah satu kartu jasa pada halaman pencarian menuju `/jasa/[id]` (I-06). | `id_jasa` aktif yang valid | Halaman detail menampilkan galeri gambar, kategori, judul, rating, deskripsi lengkap, profil penyedia, harga, ulasan, dan tombol aksi ("Pesan Jasa", "Chat Penyedia", "Bookmark"). | Seluruh informasi jasa, profil penyedia, riwayat ulasan, dan tombol aksi tampil lengkap pada layar `/jasa/[id]`. | Pass |
| UC06-TC02 | KF08 | Alternatif: Jasa Tidak Ditemukan | 1. Akses rute `/jasa/[id]` dengan ID yang tidak terdaftar atau sudah dihapus. | `id_jasa`: "unknown-id" | Sistem menampilkan halaman status "Jasa tidak ditemukan" dengan tombol "Kembali ke pencarian". | Layar menampilkan pesan "Jasa tidak ditemukan" beserta tombol kembali ke halaman pencarian. | Pass |

### 4.4.7 Use Case Menggunakan Bookmark (UC07)

**ID Use Case:** UC07  
**Nama Use Case:** Menggunakan Bookmark

Tabel 4.4.7. Hasil Pengujian Use Case UC07

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC07-TC01 | KF09, KF10 | Normal: Menyimpan Jasa ke Bookmark | 1. Login sebagai Pengguna Jasa.<br>2. Klik ikon bookmark pada kartu jasa di I-05 atau panel aksi di I-06. | Pengguna login + `id_jasa` aktif | Bookmark tersimpan ke database, ikon bookmark berubah menjadi aktif, dan muncul notifikasi "Bookmark berhasil disimpan". | Ikon bookmark berubah menjadi aktif dan notifikasi "Bookmark berhasil disimpan" tampil di layar. | Pass |
| UC07-TC02 | KF11 | Normal: Melihat Daftar Jasa Tersimpan | 1. Buka halaman `/pengguna/bookmark` (I-07) sebagai Pengguna Jasa yang sudah login. | Pengguna login | Menampilkan seluruh kartu jasa aktif yang telah disimpan pengguna beserta jumlahnya (atau empty state "Belum ada jasa tersimpan" jika kosong). | Halaman `/pengguna/bookmark` menampilkan daftar kartu jasa aktif yang sudah di-bookmark pengguna. | Pass |
| UC07-TC03 | KF12 | Normal: Menghapus Jasa dari Bookmark | 1. Pada `/pengguna/bookmark` (I-07), klik tombol "Hapus dari bookmark" atau ikon bookmark aktif pada kartu jasa. | Pengguna login + `id_jasa` tersimpan | Bookmark terhapus dari database, kartu jasa hilang dari daftar pada layar, dan muncul notifikasi penghapusan. | Kartu jasa langsung hilang dari daftar pada `/pengguna/bookmark` dan muncul notifikasi `"<nama jasa>" dihapus dari bookmark.`. | Pass |
| UC07-TC04 | KF09, KF10 | Eksepsi: Pengguna Belum Login (Guest) | 1. Buka `/jasa/[id]` (I-06) tanpa login (guest).<br>2. Klik tombol ikon bookmark. | Sesi null (guest) | Aksi dibatalkan dan UI menampilkan pesan "Masuk atau daftar dulu untuk menyimpan jasa ke bookmark.". | Aksi tidak menyimpan data dan layar menampilkan pesan "Masuk atau daftar dulu untuk menyimpan jasa ke bookmark.". | Pass |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KNF02-TC01 | KNF02 | *Response time* | Response time pencarian dan filter pada 1.000 listing jasa <= 3 detik (3.000 ms) untuk minimal 95% percobaan | Pengukuran `performance.now()` di Node.js v24.19.0 (20 kali pengulangan pada 1.000 listing dengan filter keyword, kategori, rentang harga, rating minimum, dan limit 20) pada logika filter dan sort pencarian (ekuivalen `LayananPencarian.saringDanUrutkan`) | Rata-rata waktu proses 0,259 ms (min 0,093 ms, maks 1,052 ms); 20 dari 20 percobaan (100%) selesai jauh di bawah 3.000 ms | Pass |
| KNF04-TC01 | KNF04 | *Reliability* | 100% transaksi yang mengalami kegagalan di tengah proses di-rollback ke state awal (`MENUNGGU_PEMBAYARAN`) dengan 0 data integrity loss dan 0 duplicate transaction | Simulasi gagal insert `riwayat_transaksi` di tengah `PengontrolTransaksi.prosesPembayaranDummy()`, pengecekan guard `.neq('status_pembayaran', 'LUNAS')`, serta mekanisme `AbortController` timeout di `src/lib/api.ts` lewat Vitest (`src/test/transaksi.test.ts`) | Saat insert `riwayat_transaksi` gagal setelah `pesanan` sempat ter-update, compensating rollback mengembalikan `pesanan` ke `MENUNGGU_PEMBAYARAN` (`id_metode_pembayaran: null`); guard menolak 100% duplicate payment request | Pass |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C02-UT01 – C02-UT08* | *[Sisipkan hasil keluaran unit test]* |
| *C02 (coverage)* | *[Sisipkan laporan coverage kelas C02]* |
| *INT-TC01* | *[Sisipkan bukti pengujian integrasi]* |
| *UC01-TC01* | *[Sisipkan tangkapan layar UC01-TC01 sesuai prosedur pengujian]* |
| *UC01-TC02* | *[Sisipkan tangkapan layar UC01-TC02 sesuai prosedur pengujian]* |
| *KNF01-TC01* | *[Sisipkan bukti pengukuran parameter KNF01-TC01]* |
| *...* | *...* |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KF05* | *KNF01* | *UC03* | *C02 - Pesanan* | *`src/...`* | *UC03-TC01* | *C02-UT05, INT-TC04, KNF01-TC01* |
| *KF01* | *-* | *UC01<br>UC02* | *[C01 - Nama kelas]<br>[C02 - Nama kelas]* | *[path/ke/file1]<br>[path/ke/file2]* | *UC01-TC01, UC01-TC02<br>UC02-TC01* | *-* |
| *KF02* | *[KNFXX atau -]* | *[UCXX]* | *[CXX - Nama kelas]* | *[path/ke/file]* | *[UCXX-TCYY]* | *[CXX-UTYY, INT-TCYY, KNFXX-TCYY atau -]* |
| *KFXX* | *-* | *[UCXX atau -]* | *[CXX - Nama kelas atau -]* | *Tidak diimplementasikan: [alasan]* | *-* | *-* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Reliability* | *KF05 / UC03* | *KNF01-TC01* |
| *KNFXX* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
| *...* | *...* | *...* | *...* |
