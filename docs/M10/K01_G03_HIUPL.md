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
    - [Revandra](#revandra)
    - [Danesh](#danesh)
    - [Theresia](#theresia)
    - [Edward](#edward)
    - [Necia](#necia)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
    - [4.2.1 Kelas PenyediaJasa](#421-kelas-penyediajasa)
    - [4.2.2 Kelas LayananRegistrasi](#422-kelas-layananregistrasi)
    - [4.2.3 Kelas Autentikator](#423-kelas-autentikator)
    - [4.2.4 Kelas PengontrolPortofolio](#424-kelas-pengontrolportofolio)
    - [4.2.5 Kelas LayananUploadFile](#425-kelas-layananuploadfile)
    - [4.2.6 Kelas JasaController](#426-kelas-jasacontroller)
    - [4.2.7 Kelas LayananPencarian](#427-kelas-layananpencarian)
    - [4.2.8 Kelas LayananPembandingJasa](#428-kelas-layananpembandingjasa)
    - [4.2.9 Kelas PengontrolBookmark (C22)](#429-kelas-pengontrolbookmark-c22)
    - [4.2.10 Kelas LayananPesanInstan (C25)](#4210-kelas-layananpesaninstan-c25)
    - [4.2.11 Kelas LayananNotifikasiChat (C26)](#4211-kelas-layanannotifikasichat-c26)
    - [4.2.12 Kelas PengontrolPesanan (C31)](#4212-kelas-pengontrolpesanan-c31)
    - [4.2.13 Kelas PengontrolTransaksi (C32)](#4213-kelas-pengontroltransaksi-c32)
    - [4.2.14 Kelas RevisiHandler (Bagian dari Deliverables Service)](#4214-kelas-revisihandler-bagian-dari-deliverables-service)
    - [4.2.15 Kelas LaporanHandler](#4215-kelas-laporanhandler)
    - [4.2.16 Kelas UlasanHandler](#4216-kelas-ulasanhandler)
    - [4.2.17 Kelas MediasiHandler](#4217-kelas-mediasihandler)
    - [4.2.18 Kelas PengumpulanController](#4218-kelas-pengumpulancontroller)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
    - [4.4.4 Use Case Mengunggah Penawaran Jasa (UC04)](#444-use-case-mengunggah-penawaran-jasa-uc04)
    - [4.4.5 Use Case Mencari Penawaran Jasa (UC05)](#445-use-case-mencari-penawaran-jasa-uc05)
    - [4.4.6 Use Case Melihat Informasi Jasa (UC06)](#446-use-case-melihat-informasi-jasa-uc06)
    - [4.4.7 Use Case Menggunakan Bookmark (UC07)](#447-use-case-menggunakan-bookmark-uc07)
    - [4.4.8 Use Case Melakukan Komunikasi (UC08)](#448-use-case-melakukan-komunikasi-uc08)
    - [4.4.9 Use Case Melakukan Pemesanan Jasa (UC09)](#449-use-case-melakukan-pemesanan-jasa-uc09)
    - [4.4.10 Use Case Melakukan Konfirmasi Pesanan (UC10)](#4410-use-case-melakukan-pemesanan-jasa-uc010)    
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| Penambahan Test Case | Menambah Test Case Ulasan karena Kurang dari 70% coverage |
| Penambahan Test Case | Menambah Test Case Deliverables dan Revisi karena Kurang dari 70% coverage |
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
CariJasa adalah perangkat lunak berbasis web responsif yang dirancang untuk memfasilitasi transaksi jasa digital di Indonesia, seperti pemrograman, penyuntingan video, desain grafis, copywriting, dll. Platform ini melibatkan tiga aktor utama, yaitu Pengguna Jasa, Penyedia Jasa, dan Admin Sistem. Alur sistem dimulai dari pendaftaran akun dan pemilihan peran oleh pengguna. Pengguna Jasa dapat mencari jasa berdasarkan kategori serta berdiskusi dengan Penyedia Jasa melalui fitur live chat sebelum membuat pesanan. Setelah pemesanan dilakukan, Penyedia Jasa menerima notifikasi dan mengonfirmasi ketersediaan untuk memproses pekerjaan. Selanjutnya, hasil pekerjaan diserahkan melalui platform untuk ditinjau oleh Pengguna Jasa, baik untuk pengajuan revisi maupun konfirmasi penyelesaian proyek. Alur diakhiri dengan penerusan dana pembayaran kepada Penyedia Jasa oleh sistem. Dalam hal ini, Admin bertindak sebagai pihak yang menangani kendala layanan yang dialami oleh pengguna dan menindaklanjuti laporan yang diberikan. CariJasa difokuskan untuk membantu ekosistem dan pasar lokal sehingga lebih ramah dan relevan terhadap pengguna jasa di Indonesia.

<p align="center">
<img alt="System Overview / Use Case Diagram" src="./assets/diagram/diagram use case.png" width="90%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram CariJasa</i>
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
| *Hardware* | Laptop Pongo 750 V2, 13th Gen Intel(R) Core(TM) i7-13620H, 16 GB RAM |
| *Operating System* | Windows 11 Pro 25H2 |
| *Bahasa Pemrograman* | Typescript, NodeJs v24.21.0 |
| *Framework/Library* | Next.js v16.4.3, React 19.3.0, Supabase JS 2.118.0, Supabase SSR 0.12.7 |
| *DBMS* | PostgreSQL dengan Supabase |
| *Development Tools* | VSCode, Git 2.52.0, GitHub |
| *Testing Tools* | Vitest |

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
| Hardware | Laptop MSI Modern 14 B11SB, prosesor 11th Gen Intel(R) Core(TM) i5-1155G7 @ 2.50 GHz, 4 Core  |
| Operating System | Microsoft Windows 11 Home Single Language |
| Bahasa Pemrograman | TypeScript 5.9.3, Node.js 24.19.0 |
| Framework/Library | Next.js 16.4.3, React 19.3.0, Tailwind CSS 4.3.4, Supabase JS 2.119.0, Supabase SSR 0.12.7 |
| DBMS | PostgreSQL melalui Supabase |
| Development Tools | VsCode, Git 2.36.1, GitHub |
| Testing Tools | Vitest 5.1.0, React Testing Library 16.3.3, Jest DOM 7.0.1 |

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
| *Hardware* | Laptop MSI Sword 16 HX B14VFKG, Intel Core i7-14700HX, NVIDIA GeForce RTX 4060 Laptop GPU 8GB, 16GB DDR5, SSD NVMe 1TB |
| *Operating System* | Windows 11 Home Single Language 26H2 (build 26300.9818), 64-bit |
| *Bahasa Pemrograman* | TypeScript 5.9.3 dengan Node.js |
| *Framework/Library* | Next.js 16.4.3, React 19.3.0, Tailwind CSS 4.3.4, Supabase JS 2.119.0, @supabase/ssr 0.12.7 |
| *DBMS* | PostgreSQL (Supabase) |
| *Development Tools* | Visual Studio Code, Git, GitHub, GitHub Desktop, Supabase Dashboard (SQL Editor) |
| *Testing Tools* | Vitest 5.1.0  |



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

| C38 | HalamanDeliverables  | Komponen Halaman (page) | src/components/ui/HalamanDeliverables.tsx - HalamanDeliverables <br> src/app/pengguna/hasil/[idPesanan]/page.tsx (sisi Pengguna Jasa) <br> src/app/penyedia/pengumpulan/[idPesanan]/hasil/page.tsx (sisi Penyedia Jasa) | Satu komponen dipakai dua sisi lewat prop peran. State hasil, error, sedangMemproses, konfirmasiBerhasil, pesananDitolak. Operasi konfirmasi memanggil konfirmasiSelesai (PATCH .../deliverables/route.ts); data dimuat lewat getHasil dari .../deliverables/route.ts dan .../deliverables/revisi/route.ts |
| C39 | PengajuanRevisi  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | menambahkan atribut id_revisi dan id_pesanan |
| C40 | HalamanRequestRevisi  | Komponen Halaman (page) | src/app/pengguna/revisi/[idPesanan]/page.tsx - HalamanRequestRevisi | State detail, pesan, files, kuota, errorDetail, errorUmum. Operasi kirimRevisi memanggil ajukanRevisi (src/lib/layanan.ts) ke POST src/app/api/pesanan/[id_pesanan]/deliverables/revisi/route.ts. Kuota dimuat lewat muatKuota |
| C41 | RevisiHandler  | Fungsi, Kelas, dan Routing | src\services\deliverables.service.ts - DeliverablesService <br> src\test\deliverable.test.ts <br> src\app\api\pesanan\[id_pesanan]\deliverables\revisi\route.ts  | Class ini Digabung dengan RevisiHandler dan Sebagian PesananHandler. Fungsi yang relevan antara lain : getRevisionHistory, requestRevision, submitRevisionFix, confirmOrderComplete |
| C42 | PencairanDana  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | - |
| C43 | TiketLaporan  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | - |
| C44 | HalamanPelaporan | Komponen Halaman (page) | src/app/pengguna/pelaporan/page.tsx - HalamanPelaporan | idPesanan diambil dari query URL. State nama, kat, desk, files, tiket, e. Operasi kirim memanggil kirimLaporan (src/lib/layanan.ts) ke POST src/app/api/pesanan/[id_pesanan]/laporan/route.ts; tiket yang dikembalikan ditampilkan sebagai nomor tiket, status, dan tanggapan admin |
| C45 | LaporanHandler | Fungsi, Kelas dan Routing | src\services\pelaporan.service.ts <br> src\app\api\pesanan\[id_pesanan]\laporan\route.ts <br> src\app\api\admin\laporan\[id_tiket]\route.ts <br> src\app\api\admin\laporan\[id_tiket]\tanggapan\route.ts - PelaporanService dan TanggapanLaporanService | fungsi yang terkait PelaporanService : submitLaporan, validasiOwnerPesanan, validateUrlBukti, getTicketsByUser. fungsi yang terkait TanggapanLaporanService : getAllTicketsForAdmin, getDetailTiketAdmin, catatKeputusanTindakan |
| C46 | Ulasan | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | |
| C47 | HalamanUlasan  | Komponen Halaman (page) | src/app/pengguna/ulasan/[idPesanan]/page.tsx - HalamanUlasan | State n (rating), kom (komentar), files (dokumentasi), done. Operasi kirim memanggil kirimUlasan (src/lib/layanan.ts) ke POST src/app/api/ulasan/route.ts. Rating wajib diisi sebelum dikirim |
| C48 | UlasanHandler  | Fungsi, Kelas, dan Routing | src\services\ulasan.service.ts <br> src\app\api\ulasan\route.ts| Class UlasanService, validasiRating, hitungRatingAgregat, perbaruiRatingPenyedia, getRatingDanUlasanPenyedia, geStatistikUlasanJasa, getUlasanJasaById, simpanUlasan, getUlasanbyJasa,updateUlasan, deleteUlasan |
| C49 | TanggapanLaporan  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | - |
| C50 | HalamanPengajuanMediasi | Komponen Halaman (page) | src/app/admin/tiket/[idTiket]/page.tsx - HalamanPengajuanMediasi <br> src/app/mediasi/[id]/page.tsx (ruang mediasi) | Detail tiket untuk admin, dengan operasi kirim (tanggapan dan jenis sanksi) ke src/app/api/admin/laporan/[id_tiket]/tanggapan/route.ts, dan mediasi (mulai mediasi) ke src/app/api/mediasi/[id_sesi_mediasi]/route.ts (POST) |
| C51 | MediasiHandler | Fungsi, Kelas, dan Routing | src/app/deliverables/mediasi.service.ts - MediasiService <br> src/app/api/admin/mediasi/[id_sesi_mediasi]/selesai <br> src/app/api/admin/mediasi/route.ts <br> src/app/api/mediasi/route.ts <br> src/app/api/mediasi/[id_sesi_mediasi]/route.ts <br> src/app/api/mediasi/[id_sesi_mediasi]/pesan/route.ts | fungsi yang disediakan : mulaiMediasi, kirimPesanMediasi, getDaftarMediasiUser, getDetalDanPesanMediasi, selesaikanMediasi. |
| C52 | Admin  | Tabel Basis Data | src/app/supabase/20261103060624_create_carijasa_schema.sql  | Penggunaan id_admin pada rancangan berasal atribut id pengguna (inheritance), tetapi dengan role pengguna berupa 'ADMIN'|
| C53 | HalamanDashboardAdmin | Komponen Halaman (page) | src/app/admin/tiket/page.tsx - HalamanDashboardAdmin | Daftar tiket laporan (state d, err) dari getTiketList (src/lib/layanan.ts) ke src/app/api/admin/laporan/route.ts. Ada keadaan memuat, error, dan kosong. Tombol Detail menuju src/app/admin/tiket/[idTiket]/page.tsx |
| C54 | PengumpulanController | Fungsi, Kelas, dan Routing | src/app/service/deliverable.service.ts - DeliverablesService <br> src/app/api/pesanan/route.ts src/app/api/pesanan/[id_pesanan]/route.ts <br> | Class ini Digabung dengan RevisiHandler dan Sebagian PesananHandler. Fungsi yang relevan antara lain : submitDeliverable, getDeliverablebyPesanan, getDeliverableByProdukAkhir, confirmOrderComplete |
| C55 | pesan_chat | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | Menambah Class Baru untuk pesan dalam chat |
| C56 | notifikasi | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | menambah tabel data notifikasi |
| C57 | sesi_mediasi | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | menambah tabel data sesi_mediasi (mirip roomchat tapi bertiga) |
| C58 | pesan_mediasi | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | menambah tabel data pesan dalam sesi_mediasi |


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
| C01 | Pengguna | Tidak Perlu | Kelas ini berfungsi sebagai entity (database/tabel) untuk data akun pengguna tanpa logika bisnis mandiri | - |
| C02 | PenyediaJasa | Mendalam | Menguji logika perhitungan rating agregat, validasi nilai rating (1–5), pembulatan 1 desimal, pembaruan kolom rating_rata_rata ke tabel basis data, dan pemformatan tampilan profil penyedia | C02-UT01 s.d. C02-UT16 |
| C03 | PenggunaJasa | Tidak Perlu | Kelas ini berfungsi sebagai entity (database/tabel turunan) pengguna jasa | - |
| C04 | HalamanRegistrasi | Tidak Perlu | Pengujian kelas antarmuka/halaman dilakukan pada level integrasi dan use case | - |
| C05 | LayananRegistrasi | Mendalam | Menguji logika bisnis registrasi, validasi format data & password, penanganan duplikasi email, aturan role, dan mekanisme rollback DB (Algo-0501 s.d. Algo-0504) | C05-UT01 s.d. C05-UT12 |
| C06 | HalamanLogin | Tidak Perlu | Pengujian kelas antarmuka/halaman dilakukan pada level integrasi dan use case | - |
| C07 | Autentikator | Mendalam | Menguji validasi kredensial login, verifikasi akun suspended/sanksi, manajemen sesi aktif/status online, otorisasi role admin, dan proses logout (Algo-0701, Algo-0702) | C07-UT01 s.d. C07-UT14 |
| C08 | HalamanPortofolio | Tidak Perlu | Pengujian kelas antarmuka/halaman dilakukan pada level integrasi dan use case | - |
| C09 | Portofolio | Tidak Perlu | Kelas ini berfungsi sebagai entity (database/tabel) portofolio tanpa logika bisnis mandiri | - |
| C10 | PengontrolPortofolio | Mendalam | Menguji validasi input berkas portofolio (Algo-1001), pencegahan URL tidak aman/XSS, normalisasi data karya, dan koordinasi penyimpanan (Algo-1002) | C10-UT01 s.d. C10-UT06 |
| C11 | LayananUploadFile | Mendalam | Menguji validasi batasan ukuran berkas (10 MB), whitelist MIME type dan ekstensi (Algo-1102), proteksi keamanan path traversal (Algo-1101), integrasi dual-storage adapter, dan penyimpanan berkas (Algo-1103, Algo-1104) | C11-UT01 s.d. C11-UT14 |
| C12 | Jasa | Tidak Perlu | Kelas ini berfungsi sebagai entity (database/tabel) penawaran jasa | - |
| C13 | HalamanUploadJasa | Tidak Perlu | Pengujian kelas antarmuka/halaman dilakukan pada level integrasi dan use case | - |
| C14 | JasaController | Mendalam | Menguji logika bisnis CRUD penawaran jasa, validasi data jasa dan batasan harga (Algo-1402), validasi kelayakan berkas fisik pendukung, serta query detail jasa (Algo-1401, Algo-1403) | C14-UT01 s.d. C14-UT14 |
| C15 | HalamanPencarian | Tidak Perlu | Pengujian kelas antarmuka/halaman dilakukan pada level integrasi dan use case | - |
| C16 | HasilPencarian | Tidak Perlu | Komponen tampilan hasil pencarian, pengujian dilakukan pada level integrasi dan use case | - |
| C17 | LayananPencarian | Mendalam | Menguji algoritma pencarian multi-kolom (Algo-1701), normalisasi token kata kunci, validasi parameter filter (panjang kata kunci, rentang harga, batas rating), penyaringan data, dan logika pengurutan (Algo-1702) | C17-UT01 s.d. C17-UT09 |
| C18 | LayananPembandingJasa | Mendalam | Menguji algoritma komparasi spesifikasi antar-jasa (Algo-1801), validasi kuota batas pembanding (2 s.d. 4 jasa), penyusunan matriks perbandingan, dan kalkulasi ringkasan indikator terbaik | C18-UT01 s.d. C18-UT06 |
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
| C38 | HalamanDeliverables | Tidak Perlu | Pengujian Kelas Halaman dilakukan pada test integrasi | - |
| C39 | PengajuanRevisi | Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |
| C40 | HalamanRequestRevisi |  Tidak Perlu | Pengujian Kelas Halaman dilakukan pada test integrasi | - |
| C41 | RevisiHandler | Mendalam | Menguji Logika Bisnis, Validasi Revisi,  Aturan sesuai status, dan Algoritma | *[ID test case atau -]* |
| C42 | PencairanDana | Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |
| C43 | TiketLaporan |  Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |
| C44 | HalamanPelaporan |  Tidak Perlu | Pengujian Kelas Halaman dilakukan pada test integrasi | - |
| C45 | LaporanHandler | Mendalam | Menguji Logika Bisnis, Validasi input laporan,  Aturan sesuai status pengguna, dan Algoritma sesuai dengan role pengguna  |*[ID test case atau -]* |
| C46 | Ulasan | Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |
| C47 | HalamanUlasan |  Tidak Perlu | Pengujian Kelas Halaman dilakukan pada test integrasi | - |
| C48 | UlasanHandler | Mendalam | Menguji pembuatan Ulasan,  validasi input rating, formatting, CRUD terhadap data rating jasa dan rating penyediajasa | *[ID test case atau -]* |
| C49 | TanggapanLaporan | Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |
| C50 | HalamanPengajuanMediasi |  Tidak Perlu | Pengujian Kelas Halaman dilakukan pada test integrasi | - |
| C51 | MediasiHandler | *[Mendalam/Sedang/Tidak perlu]* | *[Alasan penentuan tingkat pengujian]* | *[ID test case atau -]* |
| C52 | Admin | Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |
| C53 | HalamanDashboardAdmin |  Tidak Perlu | Pengujian Kelas Halaman dilakukan pada test integrasi | - |
| C54 | PengumpulanController | Mendalam | Berisi Logika Utama bisnis untuk pengumpulan deliverables | *[ID test case atau -]* |
| C55 | pesan_chat | Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |
| C56 | notifikasi | Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |
| C57 | sesi_mediasi | Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |
| C58 | pesan_mediasi | Tidak Perlu | Kelas ini berfungsi sebagai entity (database) | - |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: `cd src && npx vitest run` (atau `cd src && npx vitest run --coverage`).

Lokasi file test: `src/test/`.

### 4.2.1 Kelas PenyediaJasa

**ID Kelas:** C02  
**Nama Kelas:** PenyediaJasa  
**Tingkat:** Mendalam  

Tabel 4.2.1. Hasil Pengujian Unit Kelas [C02]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C02-UT01 | validasiRating() | Normal | Input nilai rating valid antara 1 sampai 5 (mis. 1, 3, 5) | Fungsi lolos validasi tanpa melempar exception | Sesuai Ekspektasi (Lolos validasi) | Pass |
| C02-UT02 | validasiRating() | Batas | Input rating bernilai kurang dari 1 (mis. 0 atau -1) | Sistem melempar error "Rating harus bernilai antara 1 sampai 5" | Sesuai Ekspektasi (Error dilempar) | Pass |
| C02-UT03 | validasiRating() | Batas | Input rating bernilai lebih dari 5 (mis. 6 atau 10) | Sistem melempar error "Rating harus bernilai antara 1 sampai 5" | Sesuai Ekspektasi (Error dilempar) | Pass |
| C02-UT04 | validasiRating() | Negatif | Input rating bukan angka riil atau berupa NaN / string non-numerik | Sistem melempar error "Rating harus bernilai antara 1 sampai 5" | Sesuai Ekspektasi (Error dilempar) | Pass |
| C02-UT05 | hitungRatingAgregat() | Batas | Parameter daftar rating berupa array kosong `[]` atau bernilai `null` | Mengembalikan nilai default: `{ rating_rata_rata: 0, total_ulasan: 0 }` | Sesuai Ekspektasi (Default 0 dikembalikan) | Pass |
| C02-UT06 | hitungRatingAgregat() | Normal | Input daftar angka rating valid: `[5, 4, 5, 4]` | Mengembalikan rata-rata 4.5 dengan total 4 ulasan | Sesuai Ekspektasi (Rata-rata 4.5 akurat) | Pass |
| C02-UT07 | hitungRatingAgregat() | Normal | Input daftar objek ulasan: `[{ rating: 5 }, { rating: 3 }]` | Mengembalikan rata-rata 4.0 dengan total 2 ulasan | Sesuai Ekspektasi (Rata-rata 4.0 akurat) | Pass |
| C02-UT08 | hitungRatingAgregat() | Batas | Perhitungan rata-rata yang menghasilkan desimal berulang (mis. 14/3 = 4.666... dan 13/3 = 4.333...) | Menerapkan pembulatan konsisten ke satu angka desimal (4.7 dan 4.3) | Sesuai Ekspektasi (Pembulatan 1 desimal benar) | Pass |
| C02-UT09 | hitungRatingAgregat() | Negatif | Salah satu elemen dalam daftar rating berada di luar rentang 1 s.d. 5 | Menolak kalkulasi dan melempar error validasi rating | Sesuai Ekspektasi (Error dilempar) | Pass |
| C02-UT10 | formatRatingTampilan() | Batas | Penyedia jasa belum memiliki ulasan (`rating = 0` atau `null`, `total_ulasan = 0`) | Mengembalikan format label "Belum ada ulasan" dan teks "0.0" | Sesuai Ekspektasi (Format default sesuai) | Pass |
| C02-UT11 | formatRatingTampilan() | Normal | Penyedia jasa dengan rating 4.8 dari 15 ulasan | Mengembalikan teks "4.8", total "15 ulasan", dan label "★ 4.8 (15 ulasan)" | Sesuai Ekspektasi (Format tampilan rapi) | Pass |
| C02-UT12 | perbaruiRatingPenyedia() | Batas | Parameter `id_penyedia_jasa` berupa string kosong atau hanya spasi | Sistem melempar error "ID penyedia jasa tidak valid" | Sesuai Ekspektasi (Error ID invalid) | Pass |
| C02-UT13 | perbaruiRatingPenyedia() | Positif | ID penyedia jasa valid dan memiliki data pesanan serta ulasan di database | Menghitung ulang rata-rata dan berhasil mengupdate kolom `rating_rata_rata` pada tabel `penyedia_jasa` | Sesuai Ekspektasi (Rating database diperbarui) | Pass |
| C02-UT14 | perbaruiRatingPenyedia() | Negatif | Simulasi kegagalan koneksi/query basis data saat mengeksekusi update rating penyedia | Menangkap error DB dan melempar pesan gagal memperbarui rating penyedia jasa | Sesuai Ekspektasi (Error DB tertangkap) | Pass |
| C02-UT15 | getRatingDanUlasanPenyedia() | Batas | Parameter `id_penyedia_jasa` kosong | Sistem melempar error "ID penyedia jasa tidak valid" | Sesuai Ekspektasi (Error ID invalid) | Pass |
| C02-UT16 | getRatingDanUlasanPenyedia() | Positif | ID penyedia jasa valid terdaftar di basis data | Mengembalikan objek profil rating penyedia jasa lengkap beserta agregat ulasannya | Sesuai Ekspektasi (Profil rating berhasil diambil) | Pass |

Khusus kelas **Mendalam**:

Tabel 4.2.1b. Ringkasan Cakupan Kelas [C02]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | isiPortofolio(), unggahPortofolio(), tambahPenawaranJasa(), bukaNotifikasiPesanan(), terimaPesanan(), tolakPesanan(), saveProdukAkhir(), getStatusPengerjaan(), kumpulkanRevisi(), cekPengirimanDana(), getRevisi(), getIdPenyediaJasa(), getdaftarPenawaranJasa(), getPengalamandanPrestasi() |
| Operasi yang diuji | validasiRating(), hitungRatingAgregat(), formatRatingTampilan(), perbaruiRatingPenyedia(), getRatingDanUlasanPenyedia() <br> *Catatan: Atribut rating_rata_rata ditambahkan pada C02 di Tugas 9 (Implementasi). Logika perhitungan agregasi rating, pembaruan ke tabel penyedia_jasa, serta pemformatan profil rating diuji pada unit test ini. Operasi lain seperti portofolio, penawaran jasa, dan pesanan telah didelegasikan ke pengontrol terkait (C10, C14, C31).* |
| ID Algoritma yang tercakup | Logika Agregasi Rating Penyedia (Tabel B.1 & B.5 Implementasi) dan verifikasi data relasi penyedia |
| Coverage (wajib ≥ 70%) | ≥ 70% (Laporan unit test Vitest pada `src/test/ulasan.test.ts`) |

### 4.2.2 Kelas LayananRegistrasi

**ID Kelas:** C05  
**Nama Kelas:** LayananRegistrasi  
**Tingkat:** Mendalam  

Tabel 4.2.2. Hasil Pengujian Unit Kelas [C05]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C05-UT01 | validasiInputRegistrasi() | Normal | Input valid: nama = "Budi Santoso", email = "budi@example.com", password = "password123", role = "pengguna_jasa" / "penyedia_jasa" | Fungsi lolos validasi tanpa melempar kesalahan | Sesuai Ekspektasi (Lolos validasi) | Pass |
| C05-UT02 | validasiInputRegistrasi() | Batas | Input nama berupa string kosong `""` atau hanya spasi `"   "` | Sistem melempar pesan error validasi nama ("Nama tidak boleh kosong") | Sesuai Ekspektasi (Error dilempar) | Pass |
| C05-UT03 | validasiInputRegistrasi() | Batas | Input email berupa string kosong `""` | Sistem melempar pesan error validasi email ("Email tidak boleh kosong") | Sesuai Ekspektasi (Error dilempar) | Pass |
| C05-UT04 | validasiInputRegistrasi() | Negatif | Input format email tidak valid (`"bukan-email"`, `"a@b"`, `"@domain.com"`) | Sistem melempar pesan error "Format email tidak valid" | Sesuai Ekspektasi (Error dilempar) | Pass |
| C05-UT05 | validasiInputRegistrasi() | Batas | Input password dengan panjang 7 karakter (kurang dari batas minimum 8 karakter) | Sistem melempar error password minimal 8 karakter | Sesuai Ekspektasi (Error dilempar) | Pass |
| C05-UT06 | validasiInputRegistrasi() | Batas | Input password dengan panjang tepat 8 karakter (nilai batas ambang) | Fungsi lolos validasi tanpa melempar error | Sesuai Ekspektasi (Lolos validasi) | Pass |
| C05-UT07 | validasiInputRegistrasi() | Negatif | Input role dengan nilai tidak dikenal (`"admin"` / role di luar whitelist) | Sistem melempar pesan error validasi role | Sesuai Ekspektasi (Error dilempar) | Pass |
| C05-UT08 | registrasi() | Positif | Input registrasi valid dengan role `"pengguna_jasa"`, mock Supabase auth dan insert DB sukses | Akun berhasil dibuat, entitas pengguna dan tabel pengguna_jasa terisi, mengembalikan ID dan profil pengguna | Sesuai Ekspektasi (Registrasi pengguna jasa berhasil) | Pass |
| C05-UT09 | registrasi() | Positif | Input registrasi valid dengan role `"penyedia_jasa"`, mock Supabase auth dan insert DB sukses | Akun berhasil dibuat, entitas pengguna dan tabel penyedia_jasa terisi, mengembalikan role PENYEDIA_JASA | Sesuai Ekspektasi (Registrasi penyedia jasa berhasil) | Pass |
| C05-UT10 | registrasi() | Negatif | Mendaftarkan akun baru menggunakan email yang sudah terdaftar di database | Sistem menangkap pesan error Supabase dan melempar error dengan kode `EMAIL_TAKEN` | Sesuai Ekspektasi (Error EMAIL_TAKEN) | Pass |
| C05-UT11 | registrasi() | Negatif | Simulasi kegagalan penyimpanan profil pengguna ke database setelah akun auth dibuat | Sistem melempar error `INTERNAL_ERROR` dan memanggil `deleteUser` untuk rollback akun auth | Sesuai Ekspektasi (Rollback deleteUser dipanggil) | Pass |
| C05-UT12 | registrasi() | Negatif | Simulasi kegagalan penyimpanan ke tabel turunan peran setelah profil utama tersimpan | Sistem melempar `INTERNAL_ERROR` dan melakukan rollback bertingkat (hapus data profil & auth user) | Sesuai Ekspektasi (Rollback bertingkat dipanggil) | Pass |

Khusus kelas **Mendalam**:

Tabel 4.2.2b. Ringkasan Cakupan Kelas [C05]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | validasiData() : boolean, cekEmail() : boolean, cekNoTelepon() : boolean, registrasiPengguna() : void |
| Operasi yang diuji | validasiInputRegistrasi(), registrasi() <br> *Catatan: Operasi cekEmail, cekNoTelepon, dan enkripsi telah diintegrasikan di dalam alur fungsi registrasi dan divalidasi melalui skenario error handling serta mock basis data.* |
| ID Algoritma yang tercakup | Algo-0501, Algo-0502, Algo-0503, Algo-0504 |
| Coverage (wajib ≥ 70%) | ≥ 70% (Laporan unit test Vitest pada `src/test/auth.test.ts`) |

<br>

### 4.2.3 Kelas Autentikator

**ID Kelas:** C07  
**Nama Kelas:** Autentikator  
**Tingkat:** Mendalam  

Tabel 4.2.3. Hasil Pengujian Unit Kelas [C07]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C07-UT01 | login() | Batas | Input email atau password berupa string kosong atau hanya spasi (`""`, `"   "`) | Sistem menolak proses dan melempar error kode `EMPTY_INPUT` | Sesuai Ekspektasi (Error EMPTY_INPUT) | Pass |
| C07-UT02 | login() | Negatif | Kredensial password salah atau email tidak terdaftar pada sistem auth | Sistem melempar error `INVALID_CREDENTIALS` ("Kredensial tidak valid") | Sesuai Ekspektasi (Error INVALID_CREDENTIALS) | Pass |
| C07-UT03 | login() | Negatif | Login menggunakan akun dengan `status_akun = false` dan sanksi `"SUSPENDED"` | Sistem melempar error `ACCOUNT_SUSPENDED` ("Akun Anda ditangguhkan") dan memicu `signOut` | Sesuai Ekspektasi (Akses ditolak & signOut dieksekusi) | Pass |
| C07-UT04 | login() | Positif | Kredensial email dan password valid untuk akun dengan status aktif | Login berhasil, status_online diperbarui menjadi true, dan mengembalikan data profil pengguna | Sesuai Ekspektasi (Login berhasil & status online aktif) | Pass |
| C07-UT05 | loginAdmin() | Negatif | Kredensial valid milik akun dengan role `"PENGGUNA_JASA"` mencoba login via fungsi `loginAdmin()` | Sistem menolak akses, melempar error `FORBIDDEN`, dan melakukan `signOut` otomatis | Sesuai Ekspektasi (Error FORBIDDEN) | Pass |
| C07-UT06 | loginAdmin() | Positif | Kredensial valid milik akun dengan role `"ADMIN"` | Login berhasil dan mengembalikan objek sesi pengguna dengan peran ADMIN | Sesuai Ekspektasi (Login admin berhasil) | Pass |
| C07-UT07 | logout() | Positif | Pengguna dengan sesi aktif memanggil fungsi logout | Sistem memperbarui status_online menjadi false di database dan memanggil signOut Supabase | Sesuai Ekspektasi (Status online nonaktif & signOut) | Pass |
| C07-UT08 | logout() | Negatif | Simulasi kegagalan jaringan saat signOut pada layanan autentikasi | Sistem menangkap kesalahan dan melempar error `LOGOUT_FAILED` | Sesuai Ekspektasi (Error LOGOUT_FAILED tertangkap) | Pass |
| C07-UT09 | getSessionUser() | Batas | Pemanggilan `getSessionUser()` saat tidak ada sesi login aktif (token kosong) | Fungsi mengembalikan nilai `null` tanpa menimbulkan exception | Sesuai Ekspektasi (Mengembalikan null) | Pass |
| C07-UT10 | getSessionUser() | Positif | Pemanggilan saat sesi valid dan profil pengguna ditemukan di database | Mengembalikan objek sesi terautentikasi lengkap beserta penanda role (`isPenggunaJasa`, `isPenyediaJasa`) | Sesuai Ekspektasi (Data sesi berhasil diambil) | Pass |
| C07-UT11 | POST /api/auth | Negatif | Permintaan POST dengan payload JSON rusak atau bukan objek JSON | Handler mengembalikan HTTP 400 Bad Request dengan pesan format body tidak valid | Sesuai Ekspektasi (HTTP 400 Bad Request) | Pass |
| C07-UT12 | POST /api/auth | Negatif | Permintaan POST dengan nilai `action` yang tidak dikenali sistem | Handler mengembalikan HTTP 400 Bad Request dengan pesan "Action tidak dikenal" | Sesuai Ekspektasi (HTTP 400 Action tidak dikenal) | Pass |
| C07-UT13 | POST /api/auth | Positif | Request login dengan body `action = "login"`, email, dan password valid | Mengembalikan status HTTP 200 OK beserta data sesi pengguna | Sesuai Ekspektasi (HTTP 200 OK login berhasil) | Pass |
| C07-UT14 | GET /api/auth | Batas | Permintaan GET ke `/api/auth` saat pengguna belum terautentikasi | Mengembalikan HTTP 401 Unauthorized dengan pesan "Tidak terautentikasi" | Sesuai Ekspektasi (HTTP 401 Unauthorized) | Pass |

Khusus kelas **Mendalam**:

Tabel 4.2.3b. Ringkasan Cakupan Kelas [C07]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | validasiKredensial(email : string, password : string), sesiLogin() : void |
| Operasi yang diuji | login(), logout(), loginAdmin(), getSessionUser(), POST /api/auth, GET /api/auth |
| ID Algoritma yang tercakup | Algo-0701, Algo-0702 |
| Coverage (wajib ≥ 70%) | ≥ 70% (Laporan unit test Vitest pada `src/test/autentikator.test.ts` dan `src/test/auth.test.ts`) |

<br>

### 4.2.4 Kelas PengontrolPortofolio

**ID Kelas:** C10  
**Nama Kelas:** PengontrolPortofolio  
**Tingkat:** Mendalam  

Tabel 4.2.4. Hasil Pengujian Unit Kelas [C10]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C10-UT01 | validasiInputBerkas() | Negatif | Input data bernilai `null` atau properti `judul` berupa string kosong `""` | Mengembalikan nilai boolean `false` | Sesuai Ekspektasi (Mengembalikan false) | Pass |
| C10-UT02 | validasiInputBerkas() | Negatif | URL berkas pendukung bernilai kosong `""` atau berisi URI berbahaya (`"javascript:alert(1)"`) | Mengembalikan nilai boolean `false` (pencegahan kerentanan XSS) | Sesuai Ekspektasi (Mengembalikan false) | Pass |
| C10-UT03 | validasiInputBerkas() | Positif | Objek data portofolio dengan judul valid dan URL berkas yang sah (`"/uploads/portofolio/a.png"`) | Mengembalikan nilai boolean `true` | Sesuai Ekspektasi (Mengembalikan true) | Pass |
| C10-UT04 | rapikanDaftar() | Batas | Input daftar pengalaman/prestasi berisi entri kosong, spasi ganda, dan nilai duplikat | Mengembalikan array bersih tanpa elemen kosong dan tanpa duplikasi | Sesuai Ekspektasi (Daftar bersih dan unik) | Pass |
| C10-UT05 | normalisasiInput() | Batas | Input judul karya memiliki panjang melebihi batas DDL (256 karakter, batas maksimal 255) | Sistem melempar error "Judul karya maksimal 255 karakter" | Sesuai Ekspektasi (Error batas judul dilempar) | Pass |
| C10-UT06 | simpanDiMemori() | Positif | Simpan entri portofolio baru dengan judul dan berkas valid pada state penyedia jasa | Entri baru tersimpan di indeks teratas daftar karya, dan riwayat pengalaman diperbarui | Sesuai Ekspektasi (Karya tersimpan terurut & state terbarui) | Pass |

Khusus kelas **Mendalam**:

Tabel 4.2.4b. Ringkasan Cakupan Kelas [C10]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | validasiInputBerkas(data : Portofolio) : boolean, simpanPortofolio(data : Portofolio) : void |
| Operasi yang diuji | validasiInputBerkas(), rapikanDaftar(), normalisasiInput(), simpanDiMemori() <br> *Catatan: Operasi simpanPortofolio diuji melalui simulasi in-memory state dan validasi berkas pendukung sesuai aturan DDL.* |
| ID Algoritma yang tercakup | Algo-1001, Algo-1002 |
| Coverage (wajib ≥ 70%) | ≥ 70% (Laporan unit test Vitest pada `src/test/portofolio.test.ts`) |

<br>

### 4.2.5 Kelas LayananUploadFile

**ID Kelas:** C11  
**Nama Kelas:** LayananUploadFile  
**Tingkat:** Mendalam  

Tabel 4.2.5. Hasil Pengujian Unit Kelas [C11]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C11-UT01 | validasiFolder() | Positif | Folder tujuan terdaftar pada whitelist `FOLDER_DIIZINKAN` ('jasa', 'chat', 'revisi', 'portofolio') | Fungsi mengembalikan nilai `true` | Sesuai Ekspektasi (Folder valid) | Pass |
| C11-UT02 | validasiFolder() | Negatif | Folder berupa string yang mengindikasikan path traversal (`"../admin"`, `"root"`, `"etc/passwd"`) | Fungsi mengembalikan nilai `false` (pencegahan celah path traversal) | Sesuai Ekspektasi (Folder traversal ditolak) | Pass |
| C11-UT03 | validasiBerkasUpload() | Batas | Berkas dengan ukuran melebihi batas `MAKS_UKURAN_UPLOAD` (10 MB + 1 byte) | Mengembalikan string error "Ukuran berkas melebihi 10 MB." | Sesuai Ekspektasi (Ditolak melebihi 10 MB) | Pass |
| C11-UT04 | validasiBerkasUpload() | Negatif | Berkas dengan ekstensi executable berbahaya (`malware.exe`) pada folder jasa | Mengembalikan string error format ekstensi berkas tidak diizinkan | Sesuai Ekspektasi (Ekstensi berbahaya ditolak) | Pass |
| C11-UT05 | validasiBerkasUpload() | Negatif | Berkas video (`.mp4`) diunggah pada folder yang membatasi hanya gambar/dokumen (folder `chat` atau `revisi`) | Mengembalikan string error bahwa format ekstensi .mp4 tidak diizinkan | Sesuai Ekspektasi (Format ditolak untuk folder terkait) | Pass |
| C11-UT06 | validasiBerkasUpload() | Positif | Berkas video (`.mp4`) diunggah pada folder yang mengizinkan multimedia (`jasa` atau `portofolio`) | Mengembalikan `null` (validasi format dan ukuran berhasil) | Sesuai Ekspektasi (Video diizinkan) | Pass |
| C11-UT07 | validasiBerkasUpload() | Negatif | Tipe MIME berkas kosong (`""`) atau tidak sesuai ekstensi yang terdeteksi | Mengembalikan string pesan error tipe berkas tidak diizinkan | Sesuai Ekspektasi (Tipe MIME tidak dikenal ditolak) | Pass |
| C11-UT08 | validasiBerkasUpload() | Positif | Berkas lampiran gambar dan dokumen umum yang valid (`.jpg`, `.png`, `.pdf`, `.webp`) | Mengembalikan `null` menandakan berkas lolos seluruh aturan validasi | Sesuai Ekspektasi (Berkas valid lolos) | Pass |
| C11-UT09 | POST /api/upload | Negatif | Request upload berkas tanpa menyertakan sesi login pengguna aktif | Mengembalikan HTTP 401 Unauthorized dengan pesan "Tidak terautentikasi" | Sesuai Ekspektasi (HTTP 401 Unauthorized) | Pass |
| C11-UT10 | POST /api/upload | Negatif | Request upload dikirim menggunakan header selain `multipart/form-data` | Mengembalikan HTTP 400 Bad Request | Sesuai Ekspektasi (HTTP 400 Bad Request) | Pass |
| C11-UT11 | POST /api/upload | Batas | Request upload dengan form-data yang tidak melampirkan berkas fisik atau file 0 byte | Mengembalikan HTTP 400 dengan pesan "Berkas tidak ditemukan atau kosong" | Sesuai Ekspektasi (HTTP 400 Berkas kosong) | Pass |
| C11-UT12 | POST /api/upload | Negatif | Simulasi kegagalan internal driver penyimpanan (kegagalan autentikasi bucket storage) | Mengembalikan HTTP 500 dengan pesan aman generik tanpa membocorkan kredensial internal | Sesuai Ekspektasi (HTTP 500 pesan aman) | Pass |
| C11-UT13 | POST /api/upload | Positif | Pengguna terautentikasi mengunggah gambar valid pada folder yang diizinkan | Mengembalikan HTTP 201 Created beserta payload URL publik berkas tersimpan | Sesuai Ekspektasi (HTTP 201 Created & URL didapat) | Pass |
| C11-UT14 | StorageService | Positif | Inisialisasi adapter penyimpanan dan pemanggilan operasi upload serta delete berkas | Berkas fisik berhasil disimpan ke storage target dan URL akses publik dihasilkan | Sesuai Ekspektasi (Driver storage berhasil menyimpan) | Pass |

Khusus kelas **Mendalam**:

Tabel 4.2.5b. Ringkasan Cakupan Kelas [C11]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | getStatusUpload() : string, validasiFormatUkuran(file : FILE) : boolean, saveDeliverables(file : FILE) : string, uploadFile(berkas : FILE) : void |
| Operasi yang diuji | validasiFolder(), validasiBerkasUpload(), POST /api/upload, StorageService.upload(), StorageService.delete() <br> *Catatan: Operasi getStatusUpload dan saveDeliverables telah diintegrasikan pada arsitektur upload gateway dan interface StorageService (Local dan Supabase).* |
| ID Algoritma yang tercakup | Algo-1101, Algo-1102, Algo-1103, Algo-1104 |
| Coverage (wajib ≥ 70%) | ≥ 70% (Laporan unit test Vitest pada `src/test/upload.test.ts`, `src/test/dual-storage.test.ts`, dan `src/test/storage-interface.test.ts`) |

<br>

### 4.2.6 Kelas JasaController

**ID Kelas:** C14  
**Nama Kelas:** JasaController  
**Tingkat:** Mendalam  

Tabel 4.2.6. Hasil Pengujian Unit Kelas [C14]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C14-UT01 | validasiDataJasa() | Positif | Input data jasa lengkap: `nama_jasa = "Desain Banner"`, `kategori = "Desain Grafis"`, `harga = 50000`, deskripsi terisi | Mengembalikan nilai boolean `true` | Sesuai Ekspektasi (Data jasa valid) | Pass |
| C14-UT02 | validasiDataJasa() | Batas | Input data jasa bernilai `undefined` atau `null` | Mengembalikan nilai boolean `false` | Sesuai Ekspektasi (Data kosong ditolak) | Pass |
| C14-UT03 | validasiDataJasa() | Negatif | Field `nama_jasa`, `deskripsi`, atau `kategori` hanya berisi spasi kosong (`"   "`) | Mengembalikan nilai boolean `false` | Sesuai Ekspektasi (String spasi kosong ditolak) | Pass |
| C14-UT04 | validasiDataJasa() | Batas | Nilai harga bernilai 0 atau berupa angka negatif (`harga = 0` atau `harga = -1000`) | Mengembalikan nilai boolean `false` | Sesuai Ekspektasi (Harga non-positif ditolak) | Pass |
| C14-UT05 | validasiDataJasa() | Negatif | Nilai harga bukan angka riil (`NaN`, `Infinity`, atau `undefined`) | Mengembalikan nilai boolean `false` | Sesuai Ekspektasi (Harga invalid ditolak) | Pass |
| C14-UT06 | validasiBerkas() | Positif | Daftar berkas fisik pendukung terdiri dari gambar PNG, dokumen PDF, dan video MP4 valid | Mengembalikan nilai `null` (seluruh berkas valid) | Sesuai Ekspektasi (Berkas lolos validasi) | Pass |
| C14-UT07 | validasiBerkas() | Negatif | Melampirkan berkas executable (`malware.exe`) pada penawaran jasa | Mengembalikan string pesan error format berkas tidak didukung | Sesuai Ekspektasi (Format berkas ditolak) | Pass |
| C14-UT08 | simpanPenawaranJasa() | Negatif | Pemanggilan penyimpanan dengan parameter data penawaran yang tidak valid | Sistem melempar exception "Data penawaran jasa tidak valid atau tidak lengkap" | Sesuai Ekspektasi (Error validasi dilempar) | Pass |
| C14-UT09 | simpanPenawaranJasa() | Positif | Pemanggilan dengan data penawaran valid dan berkas pendukung terunggah | Data jasa baru tersimpan ke basis data dan relasi penawaran penyedia jasa terhubung | Sesuai Ekspektasi (Jasa berhasil disimpan) | Pass |
| C14-UT10 | ambilDetailJasa() | Batas | Parameter `idJasa` bernilai `null` atau string kosong `""` | Sistem melempar exception "ID Jasa tidak valid" | Sesuai Ekspektasi (ID invalid dilempar) | Pass |
| C14-UT11 | ambilDetailJasa() | Negatif | Parameter `idJasa` tidak ditemukan dalam basis data | Sistem melempar exception "Data jasa tidak ditemukan" | Sesuai Ekspektasi (Jasa not found dilempar) | Pass |
| C14-UT12 | ambilDetailJasa() | Positif | Parameter `idJasa` valid dan data tersedia di database | Mengembalikan objek entitas Jasa lengkap beserta detail penyedianya | Sesuai Ekspektasi (Detail jasa berhasil diambil) | Pass |
| C14-UT13 | perbaruiJasa() | Negatif | Memperbarui penawaran jasa dengan ID yang tidak terdaftar | Sistem melempar error bahwa data jasa tidak ditemukan | Sesuai Ekspektasi (Error pembaruan dilempar) | Pass |
| C14-UT14 | hapusJasa() | Positif | Menghapus penawaran jasa berdasarkan ID yang valid | Sistem menonaktifkan/menghapus data jasa dari database secara sukses | Sesuai Ekspektasi (Jasa berhasil dihapus) | Pass |

Khusus kelas **Mendalam**:

Tabel 4.2.6b. Ringkasan Cakupan Kelas [C14]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | ambilDetailJasa(idJasa: string) : Jasa, validasiDataJasa(dataJasa : object) : boolean, simpanPenawaranJasa(dataJasa : object) : void |
| Operasi yang diuji | validasiDataJasa(), validasiBerkas(), simpanPenawaranJasa(), ambilDetailJasa(), perbaruiJasa(), hapusJasa() |
| ID Algoritma yang tercakup | Algo-1401, Algo-1402, Algo-1403 |
| Coverage (wajib ≥ 70%) | ≥ 70% (Laporan unit test Vitest pada `src/test/jasa.test.ts`) |

<br>

### 4.2.7 Kelas LayananPencarian

**ID Kelas:** C17  
**Nama Kelas:** LayananPencarian  
**Tingkat:** Mendalam  

Tabel 4.2.7. Hasil Pengujian Unit Kelas [C17]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C17-UT01 | normalisasiKeyword() | Batas | Input keyword memiliki spasi berlebih di awal/akhir dan campuran huruf kapital | Menghasilkan string huruf kecil (lowercase) bersih tanpa spasi redundan | Sesuai Ekspektasi (Keyword dinormalisasi) | Pass |
| C17-UT02 | validasiFilter() | Batas | Parameter kata kunci yang diisi memiliki panjang kurang dari 3 karakter (mis. `"ab"`) | Sistem melempar exception "Keyword Pencarian Minimal 3 karakter" | Sesuai Ekspektasi (Error panjang minimal dilempar) | Pass |
| C17-UT03 | validasiFilter() | Negatif | Parameter `harga_min` memiliki nilai lebih besar dibandingkan `harga_max` (mis. min: 100.000, max: 50.000) | Sistem melempar exception rentang harga tidak valid | Sesuai Ekspektasi (Error rentang harga dilempar) | Pass |
| C17-UT04 | validasiFilter() | Batas | Nilai parameter filter rating berada di luar batas ambang rentang 1 s.d. 5 (mis. rating = 0 atau 6) | Sistem melempar exception batasan nilai rating | Sesuai Ekspektasi (Error rating dilempar) | Pass |
| C17-UT05 | validasiFilter() | Positif | Kriteria filter lengkap dengan rentang harga, kategori, dan opsi pengurutan yang valid | Mengembalikan objek filter yang terverifikasi dan siap dieksekusi | Sesuai Ekspektasi (Filter valid diparsing) | Pass |
| C17-UT06 | cariJasaBerdasarkanKeyword() | Positif | Kata kunci cocok dengan kata pada nama jasa atau deskripsi layanan | Mengembalikan daftar penawaran jasa relevan yang cocok dengan kata kunci | Sesuai Ekspektasi (Daftar jasa relevan dikembalikan) | Pass |
| C17-UT07 | cariJasaBerdasarkanKeyword() | Batas | Kata kunci valid (≥ 3 karakter) namun tidak ada layanan yang cocok di basis data | Mengembalikan array kosong `[]` tanpa menimbulkan error | Sesuai Ekspektasi (Array kosong dikembalikan) | Pass |
| C17-UT08 | terapkanFilterPencarian() | Positif | Pencarian dengan kombinasi filter kategori spesifik dan batas harga maksimum | Mengembalikan hanya jasa yang memenuhi seluruh kriteria filter secara bersamaan | Sesuai Ekspektasi (Daftar jasa terfilter akurat) | Pass |
| C17-UT09 | saringDanUrutkan() | Positif | Eksekusi pengurutan dengan opsi `harga_rendah`, `harga_tinggi`, atau `rating_tinggi` | Data jasa terurut secara konsisten dan akurat sesuai parameter pengurutan | Sesuai Ekspektasi (Data terurut sesuai opsi) | Pass |

Khusus kelas **Mendalam**:

Tabel 4.2.7b. Ringkasan Cakupan Kelas [C17]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | cariJasaBerdasarkanKeyword(keyword : string) : list of Jasa, terapkanFilterPencarian(filter : string, keyword : string) : list of Jasa |
| Operasi yang diuji | normalisasiKeyword(), validasiFilter(), cariJasaBerdasarkanKeyword(), terapkanFilterPencarian(), saringDanUrutkan() |
| ID Algoritma yang tercakup | Algo-1701, Algo-1702 |
| Coverage (wajib ≥ 70%) | ≥ 70% (Laporan unit test Vitest pada `src/test/search.test.ts`) |

<br>

### 4.2.8 Kelas LayananPembandingJasa

**ID Kelas:** C18  
**Nama Kelas:** LayananPembandingJasa  
**Tingkat:** Mendalam  

Tabel 4.2.8. Hasil Pengujian Unit Kelas [C18]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C18-UT01 | susunMatriks() | Batas | Jumlah jasa yang dipilih untuk dibandingkan kurang dari 2 (mis. hanya 1 jasa) | Sistem melempar exception "Minimal 2 jasa untuk dibandingkan" | Sesuai Ekspektasi (Error minimal 2 jasa) | Pass |
| C18-UT02 | susunMatriks() | Batas | Jumlah jasa yang dipilih untuk dibandingkan lebih dari 4 (mis. 5 jasa) | Sistem melempar exception "Maksimal 4 jasa untuk dibandingkan" | Sesuai Ekspektasi (Error maksimal 4 jasa) | Pass |
| C18-UT03 | susunMatriks() | Positif | Input berupa 2 hingga 4 objek jasa yang sah dan aktif | Mengembalikan matriks komparasi lengkap berisi nama, kategori, harga, rating, dan ringkasan | Sesuai Ekspektasi (Matriks komparasi terbentuk) | Pass |
| C18-UT04 | susunMatriks() | Positif | Komparasi jasa dengan nilai tarif dan rating berbeda | Sistem secara akurat menetapkan penanda jasa dengan harga terendah dan rating tertinggi | Sesuai Ekspektasi (Penetapan nilai optimal akurat) | Pass |
| C18-UT05 | bandingkanSpesifikasiJasa() | Negatif | Salah satu ID jasa yang akan dibandingkan tidak ditemukan di basis data | Sistem menangani error dan melempar exception data jasa tidak ditemukan | Sesuai Ekspektasi (Error data tidak ditemukan) | Pass |
| C18-UT06 | GET /api/jasa?compare | Positif | Request GET dengan parameter `compare=id1,id2` pada route handler API | Mengembalikan HTTP 200 OK dengan payload JSON berisi matriks komparasi hasil perbandingan | Sesuai Ekspektasi (HTTP 200 OK matriks JSON) | Pass |

Khusus kelas **Mendalam**:

Tabel 4.2.8b. Ringkasan Cakupan Kelas [C18]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | bandingkanSpesifikasiJasa(idJasa1 : string, idJasa2 : string) : string |
| Operasi yang diuji | susunMatriks(), bandingkanSpesifikasiJasa(), GET /api/jasa?compare |
| ID Algoritma yang tercakup | Algo-1801 |
| Coverage (wajib ≥ 70%) | ≥ 70% (Laporan unit test Vitest pada `src/test/search.test.ts`) |

### 4.2.9 Kelas PengontrolBookmark (C22)

**ID Kelas:** C22  
**Nama Kelas:** PengontrolBookmark (`src/services/bookmark.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.9. Hasil Pengujian Unit Kelas C22 (PengontrolBookmark)

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

Tabel 4.2.9b. Ringkasan Cakupan Kelas C22 (PengontrolBookmark)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `tambahDataBookmark()`, `hapusDataBookmark()`, `ambilDaftarBookmarkPengguna()` |
| Operasi yang diuji | `tambahDataBookmark()`, `hapusDataBookmark()`, `ambilDaftarBookmarkPengguna()`, `toggleBookmark()`, `validasiInput()` (3 dari 3 operasi public pada DPPL) |
| ID Algoritma yang tercakup | Algo-2201 (simpan bookmark), Algo-2202 (hapus bookmark), Algo-2203 (ambil daftar bookmark), Algo-2001–Algo-2003 (operasi data bookmark) |
| Coverage (wajib ≥ 70%) | 100% line / 83,56% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

---

### 4.2.10 Kelas LayananPesanInstan (C25)

**ID Kelas:** C25  
**Nama Kelas:** LayananPesanInstan (`ChatService` pada `src/services/chat.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.10. Hasil Pengujian Unit Kelas C25 (LayananPesanInstan)

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

Tabel 4.2.10b. Ringkasan Cakupan Kelas C25 (LayananPesanInstan)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `buatSesiChat()`, `validasiInputPesan()`, `kirimPesan()`, `simpanKeDatabase()`, `updateStatusBaca()` |
| Operasi yang diuji | `getDaftarChatroom()`, `getOrCreateChatroom()`, `getRiwayatPesan()`, `kirimPesan()`, `validasiAksesChatroom()` (4 dari 4 operasi public yang diimplementasikan; `updateStatusBaca` tidak diimplementasikan sesuai Tabel B.1 M9) |
| ID Algoritma yang tercakup | Algo-2501 (buat/ambil sesi chatroom), Algo-2502 (validasi input & akses pesan), Algo-2503 (kirim pesan & trigger notifikasi), Algo-2504 (simpan pesan ke database) |
| Coverage (wajib ≥ 70%) | 100% line / 90,19% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

---

### 4.2.11 Kelas LayananNotifikasiChat (C26)

**ID Kelas:** C26  
**Nama Kelas:** LayananNotifikasiChat (`NotifikasiService` pada `src/services/notifikasi.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.11. Hasil Pengujian Unit Kelas C26 (LayananNotifikasiChat)

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

Tabel 4.2.11b. Ringkasan Cakupan Kelas C26 (LayananNotifikasiChat)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `kirimNotifikasiPesan()`, `tampilkanPopUpNotifikasi()` |
| Operasi yang diuji | `kirimNotifikasi()`, `getNotifikasiUser()`, `tandaiSudahDibaca()` (3 dari 3 operasi public pada `NotifikasiService`) |
| ID Algoritma yang tercakup | Algo-2601 (kirim & simpan notifikasi), Algo-2602 (ambil daftar & perbarui status baca notifikasi) |
| Coverage (wajib ≥ 70%) | 100% line / 92,30% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

---

### 4.2.12 Kelas PengontrolPesanan (C31)

**ID Kelas:** C31  
**Nama Kelas:** PengontrolPesanan (`PesananService` pada `src/services/pesanan.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.12. Hasil Pengujian Unit Kelas C31 (PengontrolPesanan)

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

Tabel 4.2.12b. Ringkasan Cakupan Kelas C31 (PengontrolPesanan)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `buatPesananBaru()`, `hitungTotalBiaya()`, `updateStatusPesanan()`, `getDetailPesanan()` |
| Operasi yang diuji | `buatPesananBaru()`, `validasiTransisiStatus()`, `konfirmasiPesanan()`, `respondOrder()`, `ambilDaftarPesanan()`, `ambilDetailPesanan()` (4 dari 4 operasi public pada DPPL; `hitungTotalBiaya` terintegrasi sebagai *snapshot* harga pada `buatPesananBaru`) |
| ID Algoritma yang tercakup | Algo-3101 (buat pesanan & snapshot biaya), Algo-3102 (validasi batas pesanan aktif), Algo-3103 (validasi transisi status pesanan), Algo-3104 (ambil detail & daftar pesanan), Algo-0205–Algo-0206 (konfirmasi terima/tolak pesanan penyedia) |
| Coverage (wajib ≥ 70%) | 94,73% line / 84,09% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

---

### 4.2.13 Kelas PengontrolTransaksi (C32)

**ID Kelas:** C32  
**Nama Kelas:** PengontrolTransaksi (`src/services/transaksi.service.ts`)  
**Tingkat:** Mendalam

Tabel 4.2.13. Hasil Pengujian Unit Kelas C32 (PengontrolTransaksi)

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

Tabel 4.2.13b. Ringkasan Cakupan Kelas C32 (PengontrolTransaksi)

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `prosesPembayaran()`, `validasiPembayaran()`, `setPencairanDana()`, `updateStatusPembayaran()`, `catatRiwayatTransaksi()` |
| Operasi yang diuji | `ambilDaftarMetode()`, `dapatkanDetailMetode()`, `prosesPembayaranDummy()`, `ambilRiwayatTransaksi()`, `setPencairanDana()` (5 dari 5 operasi public pada DPPL) |
| ID Algoritma yang tercakup | Algo-3201 (validasi metode & nominal), Algo-3202 (proses pembayaran dummy & rollback), Algo-3203 (update status pembayaran), Algo-3204 (catat riwayat transaksi), Algo-3205 (pencairan dana), Algo-3301 (daftar metode pembayaran), Algo-3401 (riwayat transaksi) |
| Coverage (wajib ≥ 70%) | 97,82% line / 80,90% branch, tool: Vitest (v8), bukti pada Subbab 4.6 |

### 4.2.14 Kelas RevisiHandler (Bagian dari Deliverables Service)

**ID Kelas:**   C41
**Nama Kelas:** RevisiHandler
**Tingkat:** Mendalam

Tabel 4.2.14. Hasil Pengujian Unit Kelas [C41]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C41-UT01 | getRevisionHistory() | Negatif | Query riwayat revisi ke database Supabase gagal | Sistem melempar error *"Gagal mengambil riwayat revisi: DB Error History"* | error dilempar | Pass |
| C41-UT02 | getRevisionHistory() | Batas | Pesanan belum pernah memiliki riwayat revisi | Fungsi mengembalikan array kosong  tanpa melempar error | array kosong dikembalikan | Pass |
| C41-UT03 | getRevisionHistory() | Positif | Pesanan memiliki histori riwayat revisi di DB | Mengembalikan array daftar riwayat revisi pesanan | data riwayat dikembalikan | Pass |
| C41-UT04 | getRevisionAttachments() | Negatif | Query lampiran revisi dari database mengalami error | Sistem melempar error *"Gagal mengambil hasil revisi: Query Lampiran Error"* | error dilempar | Pass |
| C41-UT05 | getRevisionAttachments() | Positif | Berkas revisi berupa link HTTP/HTTPS langsung | Mengembalikan daftar berkas revisi dengan file_download_url direct link | data lampiran dikembalikan | Pass |
| C41-UT06 | getRevisionAttachments() | Positif | Berkas revisi berupa path Storage Supabase | Mengembalikan daftar berkas revisi yang telah diubah menjadi signed URL | signed URL dikembalikan | Pass |
| C41-UT07 | getRevisionAttachments() | Negatif | Pembuatan signed URL dari Storage Service gagal  | Sistem melempar error *"Gagal membuat URL hasil revisi: p-err"* | error dilempar | Pass |
| C41-UT08 | getRevisionRequestAttachments() | Negatif | Query data pengajuan revisi ke database gagal | Sistem melempar error *"Gagal mengambil lampiran pengajuan revisi: Gagal fetch pengajuan"* | error dilempar | Pass |
| C41-UT09 | getRevisionRequestAttachments() | Batas | Data pengajuan revisi bernilai null | Fungsi mengembalikan array kosong | array kosong dikembalikan | Pass |
| C41-UT10 | getRevisionRequestAttachments() | Positif | Data lampiran berupa campuran array/string & link HTTP/storage path | Memilah nama file, mengonversi storage path ke signed URL, dan menyusun array lampiran | lampiran terurai & signed URL dibuat | Pass |
| C41-UT11 | getRevisionRequestAttachments() | Negatif | Pembuatan signed URL lampiran pengajuan gagal | Sistem melempar error *"Gagal membuat URL lampiran revisi: fail.png"* | error dilempar | Pass |
| C41-UT12 | requestRevision() | Batas / Negatif | deskripsi_revisi kosong atau berisi spasi saja | Sistem melempar error *"Deskripsi revisi wajib diisi."* | error dilempar | Pass |
| C41-UT13 | requestRevision() | Negatif | validasiPenggunaJasa gagal (bukan pemilik pesanan) | Sistem melempar error *"Akses ditolak. Hanya pengguna jasa pemilik pesanan..."* | akses ditolak | Pass |
| C41-UT14 | requestRevision() | Negatif | Query data produk akhir di database mengalami error | Sistem melempar error *"Gagal memvalidasi hasil pekerjaan: Query error produk"* | error dilempar | Pass |
| C41-UT15 | requestRevision() | Negatif | id_produk_akhir tidak cocok / tidak ada pada pesanan tersebut | Sistem melempar error *"Hasil pekerjaan tidak ditemukan pada pesanan ini."* | error dilempar | Pass |
| C41-UT16 | requestRevision() | Negatif | Query pemeriksaan riwayat revisi mengalami error DB | Sistem melempar error *"Gagal memeriksa riwayat revisi: DB error revisi"* | error dilempar | Pass |
| C41-UT17 | requestRevision() | Negatif | Revisi sebelumnya masih dalam status "Sedang Direvisi" | Sistem melempar error *"Revisi sebelumnya masih dikerjakan penyedia jasa."* | error dilempar | Pass |
| C41-UT18 | requestRevision() | Negatif | Revisi sebelumnya belum berstatus "Revisi Dikumpulkan"  | Sistem melempar error *"Pengajuan revisi baru belum dapat dilakukan karena status..."* | error dilempar | Pass |
| C41-UT19 | requestRevision() | Batas / Negatif | Kuota revisi pesanan sudah habis  | Sistem melempar error *"Kuota revisi untuk pesanan ini sudah habis."* | error dilempar | Pass |
| C41-UT20 | requestRevision() | Negatif | insert pengajuan revisi ke database gagal | Sistem melempar error *"Gagal mengajukan revisi: Insert revisi fail"* | error dilempar | Pass |
| C41-UT21 | requestRevision() | Negatif | insert pengajuan revisi berhasil tetapi mengembalikan data null | Sistem melempar error *"Data pengajuan revisi tidak berhasil disimpan."* | error dilempar | Pass |
| C41-UT22 | requestRevision() | Negatif | insert revisi sukses, namun update status pesanan gagal | Sistem melempar error *"Revisi berhasil disimpan, tetapi gagal memperbarui status pesanan..."* | error update dilempar | Pass |
| C41-UT23 | requestRevision() | Positif | Input valid, kuota revisi > 0, DB normal | Berhasil menyimpan pengajuan revisi, mengurangi kuota, & mengirim notifikasi ke seller | revisi diajukan & notifikasi terkirim | Pass |
| C41-UT24 | submitRevisionFix() | Batas / Negatif | deskripsi_produk kosong atau hanya spasi  | Sistem melempar error *"Deskripsi hasil revisi wajib diisi."* | error dilempar | Pass |
| C41-UT25 | submitRevisionFix() | Batas / Negatif | file_urls berbentuk array kosong  | Sistem melempar error *"Unggah berkas atau sertakan tautan hasil revisi."* | error dilempar | Pass |
| C41-UT26 | submitRevisionFix() | Negatif | Query pemeriksaan pengajuan revisi terbaru mengalami error | Sistem melempar error *"Gagal memeriksa pengajuan revisi: DB Error Revision"* | error dilempar | Pass |
| C41-UT27 | submitRevisionFix() | Negatif | Tidak ada pengajuan revisi aktif yang sedang dikerjakan  | Sistem melempar error *"Tidak ada pengajuan revisi yang sedang dikerjakan."* | error dilempar | Pass |
| C41-UT28 | submitRevisionFix() | Negatif | insert produk akhir hasil perbaikan ke database gagal | Sistem melempar error *"Gagal menyimpan hasil revisi: Insert produk error"* | error dilempar | Pass |
| C41-UT29 | submitRevisionFix() | Negatif | insert produk sukses, tetapi update status pengajuan revisi gagal | Sistem melempar error *"Gagal memperbarui status revisi: Update revisi fail"* | error dilempar | Pass |
| C41-UT30 | submitRevisionFix() | Negatif | insert produk & update revisi sukses, namun update status pesanan gagal | Sistem melempar error *"Revisi berhasil disimpan, tetapi status pesanan gagal..."* | error update dilempar | Pass |
| C41-UT31 | submitRevisionFix() | Positif | file_urls berisi beberapa file hasil perbaikan valid | Berhasil insert produk perbaikan, merubah status revisi & pesanan, serta memicu notifikasi | perbaikan dikirim & notifikasi terkirim | Pass |



Khusus kelas **Mendalam**:

Tabel 4.2.14b. Ringkasan Cakupan Kelas [C41]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | kirimRevisi() --> submitRevisionFix(), isRevisiRequestValid() --> bagian dari submitRevisionFix(), sendNotifikasiRevisi() --> bagian dari submitRevisionFix() dan requestRevision(), updateStatusPengerjaan() --> bagian dari submitRevisionFix() |
| Operasi yang diuji | requestRevision(),submitRevision(), getRevisionHistory(), getRevisionAttachments(), getRevisionRequestAttachments()  <br> Note : fungsi yang tidak diimplementasikan sudah dimasukkan ke dalam tubuh fungsi lain yang diuji baik dalam bentuk query maupun routing|
| ID Algoritma yang tercakup | Algo-4101, Algo-4102, Algo-4103, Algo-4104, Algo-4105, dan tambahan yang tidak tercata |
| Coverage (wajib ≥ 70%) | [Lihat Hasil Pengujian](#bukti-c41) |

### 4.2.15 Kelas LaporanHandler

**ID Kelas:**   C45
**Nama Kelas:** LaporanHandler
**Tingkat:** Mendalam

Tabel 4.2.15. Hasil Pengujian Unit Kelas [C45]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C45-UT01 | submitLaporan() | Batas | Deskripsi laporan tidak diisi (kosong)  atau kategori kosong | Sistem melempar error validasi deskripsi / minimal 1 kategori | error dilempar | Pass |
| C45-UT02 | submitLaporan() | Batas | Batas lampiran bukti kosong atau lewat dari batas maksimal > 3 | Sistem melempar error batas minimal 1 dan maksimal 3 bukti lampiran | error dilempar | Pass |
| C45-UT03 | submitLaporan() | Negatif | Format URL bukti mengandung `javascript:` atau path file | Sistem melempar error validasi format URL bukti tidak valid | URL ditolak | Pass |
| C45-UT04 | submitLaporan() | Negatif | id_pesanan tidak ditemukan dalam database atau user_id bukan pelapor/terlapor pada pesanan tersebut | Sistem melempar error "Pesanan tidak ditemukan" / "Akses ditolak" | Akses ditolak | Pass |
| C45-UT05 | submitLaporan() | Negatif | User masih memiliki tiket laporan berstatus `"Diproses"` untuk pesanan yang sama | Sistem melempar error tiket laporan masih sedang diproses |  duplikasi laporan ditolak | Pass |
| C45-UT06 | submitLaporan() | Positif | Data laporan valid, pelapor adalah pemesan, dan terlapor adalah penyedia | Laporan berhasil disimpan ke Database dengan status "Diproses" dan mengembalikan id_tiket | tiket laporan berhasil dibuat | Pass |
| C45-UT07 | validasiOwnerPesanan() | Positif | `user_id` merupakan penyedia jasa dari pesanan | Fungsi mengembalikan `true` |  validasi mengembalikan true | Pass |
| C45-UT08 | validasiOwnerPesanan() | Negatif | id_pesanan tidak ada di database | melempar error *"Pesanan tidak ditemukan"* | error dilempar | Pass |
| C45-UT09 | getTicketsByUser() | Positif  | user_id valid serta memiliki beberapa daftar tiket | Mengembalikan daftar tiket pelaporan pemilik tiket | daftar tiket dapat direturn | Pass |
| C45-UT10 | getDetailTiket() | Negatif | user_id yang tidak terdaftar sebagai pelapor maupun terlapor | melempar error "Akses ditolak. Anda tidak memiliki izin melihat tiket ini." | Akses ditolak | Pass |
| C45-UT11 | getDetailTiket() | Positif | user_id merupakan pelapor asli tiket | Mengembalikan objek detail data tiket laporan |  detail tiket dikembalikan | Pass |
| C45-UT12 | getAllTicketsForAdmin() | Positif | Dipanggil oleh Admin | Mengembalikan seluruh daftar tiket laporan dari seluruh pengguna | seluruh tiket dikembalikan | Pass |
| C45-UT13 | getDetailTiketAdmin() | Positif | id_tiket valid | Mengembalikan detail tiket laporan secara langsung tanpa batasan otorisasi pelapor |  detail tiket dikembalikan | Pass |
| C45-UT14 | catatKeputusanTindakan() | Batas | jenis_tindakan kosong atau catatan_tanggapan kosong maupun hanya spasi| Sistem melempar error validasi pilihan tindakan / catatan wajib diisi | Error dilempar | Pass |
| C45-UT15 | catatKeputusanTindakan() | Negatif | Tiket yang diproses sudah berstatus "Selesai" di database | Sistem melempar error "Tiket laporan ini sudah selesai ditangani sebelumnya." | Error penolakan | Pass |
| C45-UT16 | catatKeputusanTindakan() | Positif | Admin memilih tindakan PERINGATAN / SUSPEND_AKUN dengan catatan valid | Berhasil menyimpan tanggapan, memanggil RPC admin_beri_sanksi, dan mengubah status tiket menjadi "Selesai" |  sanksi diproses & status tiket selesai | Pass |
| C45-UT17 | catatKeputusanTindakan() | Positif | Admin memilih tindakan LAPORAN_DITOLAK dengan catatan valid | Berhasil menyimpan tanggapan dan mengubah status tiket menjadi "Selesai" tanpa memicu sanksi akun |  penolakan dicatat & status tiket selesai | Pass |

Tabel 4.2.15b. Ringkasan Cakupan Kelas [C45]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | validasiFormatLaporan() --> Menjadi bagian dari fungsi submitLaporan() <br> kirimNotifAdmin() --> Menjadi bagian dari fungsi submitLaporan() <br> simpanData() --> Menjadi bagian dari fungsi submitLaporan() <br> banPengguna() --> Menjadi bagian dari fungsi catatKeputusanTindakan() <br> skorsPengguna() -->  Menjadi bagian dari fungsi catatKeputusanTindakan() <br> kirimTanggapan() -->  Menjadi bagian dari routing catatKeputusanTindakan() <br> saveTanggapan() -->  Menjadi bagian dari fungsi catatKeputusanTindakan() <br> saveLaporan() --> Menjadi bagian dari fungsi catatKeputusanTindakan() <br> updateStatusTiket() --> Menjadi bagian dari fungsi catatKeputusanTindakan() <br getDetailTiket() --> dipecah menjadi getDetailTiket() untuk pengguna dan getDetailTiketAdmin() untuk admin  |
| Operasi yang diuji | <br>  submitLaporan(), validasiOwnerPesanan(), getTicketsByUser(), getDetailTiket(), getAllTicketsForAdmin(), getDetailTiketAdmin(), catatKeputusanTindakan() <br> Note : fungsi yang tidak diimplementasikan sudah dimasukkan ke dalam tubuh fungsi lain yang diuji baik dalam bentuk query maupun routing |
| ID Algoritma yang tercakup | Algo-4501 - Algo-4510, dan tambahan yang tidak tercatat dalam DPPL |
| Coverage (wajib ≥ 70%) | [Lihat Hasil Pengujian](#bukti-c45) |
<br>

### 4.2.16 Kelas UlasanHandler

**ID Kelas:**   C48
**Nama Kelas:** UlasanHandler
**Tingkat:** Mendalam

Tabel 4.2.16. Hasil Pengujian Unit Kelas [C48]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **C48-UT01** | validasiRating() | Batas dan Positif | rating bernilai 1, 3, dan 5 | Fungsi berhasil memvalidasi tanpa melempar error | validasi sukses | Pass |
| **C48-UT02** | validasiRating() | Batas / Negatif | rating bernilai kurang dari 1 (`0` dan `-1`) | Sistem melempar error *"Rating harus bernilai antara 1 sampai 5"* | error dilempar | Pass |
| **C48-UT03** | validasiRating() | Batas / Negatif | rating bernilai lebih dari 5 (`6` dan `10`) | Sistem melempar error *"Rating harus bernilai antara 1 sampai 5"* | error dilempar | Pass |
| **C48-UT04** | validasiRating() | Negatif | rating bernilai non-angka atau `NaN` (misal: `"5"` string) | Sistem melempar error *"Rating harus bernilai antara 1 sampai 5"* | error dilempar | Pass |
| **C48-UT05** | validasiDokumentasi() | Batas / Positif | Berkas valid (`1024` byte, tipe `image/jpeg`) | Fungsi berhasil memvalidasi tanpa melempar error | validasi sukses | Pass |
| **C48-UT06** | validasiDokumentasi() | Batas | Jumlah berkas melebihi batas maksimal (`4` berkas) | Sistem melempar error *"Dokumentasi ulasan maksimal 3 berkas."* | error dilempar | Pass |
| **C48-UT07** | validasiDokumentasi() | Negatif | Format/MIME type berkas tidak didukung (`skrip.exe` atau mismatch MIME) | Sistem melempar error format berkas tidak didukung | error dilempar | Pass |
| **C48-UT08** | validasiDokumentasi() | Batas / Negatif | Berkas kosong (`ukuran <= 0` byte) | Sistem melempar error *"Berkas [nama] kosong atau tidak valid."* | error dilempar | Pass |
| **C48-UT09** | validasiDokumentasi() | Batas / Negatif | Ukuran berkas melebihi batas maksimal (`11 MB`) | Sistem melempar error *"Ukuran berkas [nama] maksimal 10 MB."* | error dilempar | Pass |
| **C48-UT10** | hitungRatingAgregat() | Batas | Daftar ulasan kosong (`[]`) atau `null` | Mengembalikan nilai default `{ rating_rata_rata: 0, total_ulasan: 0 }` | default 0 dikembalikan | Pass |
| **C48-UT11** | hitungRatingAgregat() | Positif | Daftar rating berupa array angka (`[5, 4, 5, 4]`) atau objek (`[{ rating: 5 }, { rating: 3 }]`) | Menghitung rata-rata dengan benar beserta total ulasannya | kalkulasi rata-rata akurat | Pass |
| **C48-UT12** | hitungRatingAgregat() | Batas | Menghitung rata-rata dengan hasil desimal berulang (misal: `14/3` dan `13/3`) | Menerapkan pembulatan konsisten 1 angka desimal (`4.7` untuk bulat atas, `4.3` untuk bulat bawah, `4.0` untuk pas) | pembulatan konsisten | Pass |
| **C48-UT13** | hitungRatingAgregat() | Negatif | Salah satu elemen rating dalam daftar di luar rentang 1-5 (`[5, 6]` atau `[5, 0]`) | Sistem melempar error *"Rating harus bernilai antara 1 sampai 5"* | error dilempar | Pass |
| **C48-UT14** | formatRatingTampilan() | Batas | Penyedia tanpa ulasan (`rating` = `0` atau `null`, `total_ulasan` = `0`) | Mengembalikan format teks default (`"0.0"`, `"0 ulasan"`, dan label `"Belum ada ulasan"`) | label default dikembalikan | Pass |
| **C48-UT15** | formatRatingTampilan() | Positif | `rating` = `4.8`, `total_ulasan` = `15` | Mengembalikan teks formatted rapi (`"4.8"`, `"15 ulasan"`, dan label `"★ 4.8 (15 ulasan)"`) | teks formatted sesuai | Pass |
| **C48-UT16** | perbaruiRatingPenyedia() & perbaruiRatingJasa() | Negatif | `id_penyedia_jasa` atau `id_jasa` kosong (`""` atau `"   "`) | Sistem melempar error *"ID penyedia jasa tidak valid"* / *"ID jasa tidak valid"* | error dilempar | Pass |
| **C48-UT17** | perbaruiRatingPenyedia() | Positif | `id_penyedia_jasa` valid yang memiliki pesanan & ulasan | Menghitung ulang ulasan, memperbarui tabel `penyedia_jasa`, dan mengembalikan rata-rata (`5`, `total: 1`) | database diperbarui | Pass |
| **C48-UT18** | perbaruiRatingJasa() | Positif | `id_jasa` valid yang memiliki pesanan & ulasan | Menghitung ulang ulasan, memperbarui tabel `jasa`, dan mengembalikan rata-rata (`4`, `total: 1`) | database diperbarui | Pass |
| **C48-UT19** | perbaruiRatingPenyedia() & perbaruiRatingJasa() | Negatif | Simulasi kegagalan database saat melakukan `update` rating | Sistem melempar error *"Gagal memperbarui rata-rata rating penyedia jasa / jasa."* | error DB tertangkap | Pass |
| **C48-UT20** | getRatingDanUlasanPenyedia() | Negatif | `id_penyedia_jasa` kosong | Sistem melempar error *"ID penyedia jasa tidak valid"* | error dilempar | Pass |
| **C48-UT21** | getRatingDanUlasanPenyedia() | Positif | `id_penyedia_jasa` valid | Mengembalikan objek rating rata-rata (`4.8`) dan total ulasan | profil rating dikembalikan | Pass |
| **C48-UT22** | getRatingDanUlasanPenyedia() | Negatif | Simulasi error query database penyedia jasa | Sistem melempar error DB yang sesuai | error dilempar | Pass |
| **C48-UT23** | getUlasanbyJasa() | Batas | `id_jasa` tanpa histori pesanan | Mengembalikan array ulasan kosong dan total 0 (`{ ulasan: [], total: 0 }`) | array kosong dikembalikan | Pass |
| **C48-UT24** | getUlasanbyJasa() | Negatif | Simulasi query pesanan atau ulasan gagal di DB | Sistem melempar error query dari DB | error dilempar | Pass |
| **C48-UT25** | getUlasanJasaById() | Negatif | Simulasi error umum saat pengadaan data ulasan | Sistem melempar error *"Terjadi kesalahan saat mengambil data ulasan."* | error dilempar | Pass |
| **C48-UT26** | simpanUlasan() | Negatif | `id_pesanan` kosong (`""`) | Sistem melempar error *"ID pesanan tidak valid."* | error dilempar | Pass |
| **C48-UT27** | simpanUlasan() | Negatif | `id_pengguna_jasa` tidak sesuai dengan pemilik pesanan (`user-lain`) | Sistem melempar error *"Kamu tidak memiliki akses untuk mengulas pesanan ini."* | akses ditolak | Pass |
| **C48-UT28** | simpanUlasan() | Negatif | Status pesanan belum selesai (`status_pesanan` = `"PROSES"`) | Sistem melempar error *"Pesanan harus selesai sebelum dapat diberi ulasan."* | error dilempar | Pass |
| **C48-UT29** | simpanUlasan() | Negatif | Pesanan sudah pernah diulas sebelumnya | Sistem melempar error *"Pesanan ini sudah memiliki ulasan."* | duplikasi ulasan ditolak | Pass |
| **C48-UT30** | simpanUlasan() | Positif | Data ulasan valid dengan berkas dokumentasi (`foto.jpg`) | Mengunggah berkas ke storage, menyimpan ulasan ke DB, dan memicu `perbaruiRatingPenyedia` | ulasan disimpan & storage terisi | Pass |
| **C48-UT31** | simpanUlasan() | Negatif / Rollback | Berkas berhasil diunggah ke storage, tetapi transaksi `insert` DB gagal | Sistem melempar error DB dan melakukan *rollback* (menghapus berkas yang terunggah di storage) | rollback storage berhasil | Pass |
| **C48-UT32** | updateUlasan() | Batas / Negatif | `dokumentasi_path` baru melebihi limit (`4` URL) | Sistem melempar error *"Dokumentasi ulasan maksimal 3 berkas."* | error dilempar | Pass |
| **C48-UT33** | updateUlasan() | Negatif | `dokumentasi_path` berisi URL asing yang tidak ada pada ulasan lama | Sistem melempar error *"Dokumentasi yang diperbarui tidak valid."* | URL asing ditolak | Pass |
| **C48-UT34** | updateUlasan() | Positif | Menghapus salah satu foto lama dari ulasan saat update | Mengubah data di DB dan menghapus foto yang dibuang dari storage | ulasan diperbarui & foto dibuang | Pass |
| **C48-UT35** | updateUlasan() | Negatif | Simulasi error saat query `update` ke DB | Sistem melempar error *"Terjadi kesalahan saat memperbarui ulasan."* | error dilempar | Pass |
| **C48-UT36** | deleteUlasan() | Positif | `id_ulasan` dan `user_id` pemilik valid | Menghapus data ulasan dari DB dan membersihkan berkas dokumentasi di storage | ulasan & foto terhapus | Pass |
| **C48-UT37** | deleteUlasan() | Negatif | Simulasi error saat query `delete` ke DB | Sistem melempar error *"Terjadi kesalahan saat menghapus ulasan."* | error dilempar | Pass |

Tabel 4.2.16b. Ringkasan Cakupan Kelas [C48]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | (validasiKelengkapanRating(), validasiFormatBerkas(), validasiPanjangKomentar()) --> Bagian dari simpanUlasan() <br> prosesUlasan() --> simpanUlasan(), perbaruiRating() --> Bagian dari updateUlasan() dan simpanUlasan() |
| Operasi yang diuji | <br>  validasiRating() <br> validasiDokumentasi()  <br> hitungRatingAgregat() <br>  formatRatingTampilan() <br> perbaruiRatingPenyedia() <br> perbaruiRatingJasa() <br> getRatingDanUlasanPenyedia() <br> getStatistikUlasanJasa()  <br> getUlasanJasaById() <br> getUlasanbyJasa() <br> simpanUlasan() <br> validasiOwnerUlasan() <br> updateUlasan() <br> deleteUlasan() <br> Note : fungsi yang tidak diimplementasikan sudah dimasukkan ke dalam tubuh fungsi lain yang diuji baik dalam bentuk query maupun routing |
| ID Algoritma yang tercakup | Algo-4801 - Algo-4805, dan tambahan yang tidak tercatat dalam DPPL |
| Coverage (wajib ≥ 70%) | [Lihat Hasil Pengujian](#bukti-c48) |

### 4.2.17 Kelas MediasiHandler

**ID Kelas:**   C51
**Nama Kelas:** MediasiHandler
**Tingkat:** Mendalam

Tabel 4.2.17. Hasil Pengujian Unit Kelas [C51]
| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **C51-UT01** | mulaiMediasi() | Negatif | id_tiket tidak ditemukan di database  | Sistem melempar error *"Tiket laporan tidak ditemukan."* | error dilempar | Pass |
| **C51-UT02** | mulaiMediasi() | Batas / Negatif | Tiket laporan tidak memiliki id_terlapor  | Sistem melempar error *"Tiket laporan ini tidak memiliki pihak terlapor untuk dimediasi."* | error dilempar | Pass |
| **C51-UT03** | mulaiMediasi() | Negatif | id_admin tidak valid atau bukan admin yang terdaftar | Sistem melempar error *"Akses ditolak: User bukan admin yang valid."* | error dilempar | Pass |
| **C51-UT04** | mulaiMediasi() | Batas | Sesi mediasi untuk tiket sudah ada dan berstatus `BERLANGSUNG` | Mengembalikan sesi yang sudah ada tanpa membuat data baru di DB | mengembalikan sesi lama | Pass |
| **C51-UT05** | mulaiMediasi() | Negatif  | Pembuatan sesi mediasi berhasil, namun pembuatan pesan awal mediasi gagal | Sistem melempar error dan memanggil delete (rollback) untuk menghapus sesi mediasi yang sempat dibuat | rollback sesi berhasil | Pass |
| **C51-UT06** | mulaiMediasi() | Positif | id_tiket dan id_admin valid, belum ada sesi mediasi aktif | Berhasil membuat sesi mediasi baru, membuat pesan awal, dan memicu 2 kali pengiriman notifikasi | sesi mediasi baru dibuat & notifikasi terkirim | Pass |
| **C51-UT07** | kirimPesanMediasi() | Batas / Negatif | isi_pesan kosong atau hanya spasi (`'   '`) | Sistem melempar error *"Isi pesan tidak boleh kosong."* | error dilempar | Pass |
| **C51-UT08** | kirimPesanMediasi() | Negatif | id_sesi_mediasi tidak ditemukan di database | Sistem melempar error *"Sesi mediasi tidak ditemukan."* | error dilempar | Pass |
| **C51-UT09** | kirimPesanMediasi() | Batas / Negatif | Sesi mediasi sudah berstatus `SELESAI` | Sistem melempar error *"Sesi mediasi telah selesai. Tidak dapat mengirim pesan lagi."* | error dilempar | Pass |
| **C51-UT10** | kirimPesanMediasi() | Negatif | Pengirim bukan salah satu peserta sah (bukan admin, pelapor, atau terlapor) | Sistem melempar error *"Akses ditolak: Anda bukan peserta dalam sesi mediasi ini."* | akses ditolak | Pass |
| **C51-UT11** | kirimPesanMediasi() | Positif / Batas | Mengirim pesan dengan panjang lebih dari 80 karakter  | Berhasil menyimpan pesan dan memotong preview notifikasi menjadi 80 karakter diikuti `"..."` | pesan terkirim & preview notifikasi dipotong | Pass |
| **C51-UT12** | getDaftarMediasiUser() | Positif | user_id valid yang terdaftar sebagai peserta pada beberapa sesi mediasi | Memfilter sesi mediasi sesuai peserta dan mengurutkan pesan terakhir secara rinci | daftar sesi terfilter & terurut | Pass |
| **C51-UT13** | getDaftarMediasiUser() | Negatif | Simulasi kegagalan query database saat mengambil daftar mediasi | Sistem melempar error *"Gagal mengambil daftar sesi mediasi: Fetch error"* | error DB tertangkap | Pass |
| **C51-UT14** | getDetailDanPesanMediasi() | Negatif | user_id yang mengakses bukan peserta dalam sesi mediasi  | Sistem melempar error *"Akses ditolak: Anda tidak memiliki akses ke ruang mediasi ini."* | akses ditolak | Pass |
| **C51-UT15** | getDetailDanPesanMediasi() | Positif | id_sesi_mediasi dan user_id peserta valid | Mengembalikan detail sesi dan memformat peran_di_mediasi untuk setiap pesan (`ADMIN`, `PELAPOR`, `TERLAPOR`) | detail & peran pesan diformat sesuai | Pass |
| **C51-UT16** | selesaikanMediasi() | Negatif | Simulasi kegagalan update status sesi DB atau sesi sudah berstatus selesai | Sistem melempar error *"Gagal menutup sesi mediasi atau sesi sudah selesai."* | error dilempar | Pass |
| **C51-UT17** | selesaikanMediasi() | Positif | id_sesi_mediasi dan id_admin valid | Mengubah status sesi menjadi `SELESAI` dan otomatis menyisipkan pesan penutup dari admin | sesi ditutup & pesan penutup dibuat | Pass |


Tabel 4.2.17b. Ringkasan Cakupan Kelas [C51]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | inputTindakan() --> bagian dari LaporanHandler bukan mediasi, akhiriMediasi() --> selesaikanMediasi(), tampilkanPesanError() --> bagian error handling di setiap fungsi, tampilkanNotifikasiSelesai() --> bagian dari setiap tindakan di mediasi,  UpdateStatusTiket() --> bagian dari LaporanHandler() |
| Operasi yang diuji | mulaiMediasi(), kirimPesanMediasi(), getDaftarMediasiUser(),  getDetailDanPesanMediasi(), selesaikanMediasi()<br> Note : fungsi yang tidak diimplementasikan sudah dimasukkan ke dalam tubuh fungsi lain yang diuji baik dalam bentuk query maupun routing |
| ID Algoritma yang tercakup | Algo-5101 - Algo-5105, dan tambahan yang tidak tercatat dalam DPPL |
| Coverage (wajib ≥ 70%) | [Lihat Hasil Pengujian](#bukti-c51) |

### 4.2.18 Kelas PengumpulanController bagian dari DeliverablesService

**ID Kelas:**   C54
**Nama Kelas:** PengumpulanController
**Tingkat:** Mendalam

Tabel 4.2.16. Hasil Pengujian Unit Kelas [C54]
| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C54-UT01 | validasiOwnerPesanan() | Positif | user_id adalah id_pengguna_jasa pemilik pesanan | Fungsi mengembalikan nilai true | validasi sukses | Pass |
| C54-UT02 | validasiOwnerPesanan() | Positif | user_id adalah id_penyedia_jasa pemilik pesanan | Fungsi mengembalikan nilai true | validasi sukses | Pass |
| C54-UT03 | validasiOwnerPesanan() | Negatif | Simulasi error query pada Supabase | Sistem melempar error *"Gagal memvalidasi pesanan: DB Error Validasi"* | error dilempar | Pass |
| C54-UT04 | validasiOwnerPesanan() | Negatif | id_pesanan tidak ditemukan di database  | Sistem melempar error *"Pesanan tidak ditemukan."* | error dilempar | Pass |
| C54-UT05 | validasiOwnerPesanan() | Negatif | user_id bukan pemesan maupun penyedia  | Sistem melempar error *"Akses ditolak. Pesanan ini bukan milik Anda."* | akses ditolak | Pass |
| C54-UT06 | validasiPenggunaJasa() | Positif | user_id adalah pengguna jasa pemilik pesanan | Fungsi mengembalikan nilai true | validasi sukses | Pass |
| C54-UT07 | validasiPenggunaJasa() | Negatif | Simulasi koneksi database terputus | Sistem melempar error *"Gagal memvalidasi pesanan: Koneksi terputus"* | error dilempar | Pass |
| C54-UT08 | validasiPenggunaJasa() | Negatif | id_pesanan tidak ditemukan di database  | Sistem melempar error *"Pesanan tidak ditemukan."* | error dilempar | Pass |
| C54-UT09 | validasiPenggunaJasa() | Negatif | user_id bukan pemilik pesanan  | Sistem melempar error *"Akses ditolak. Hanya pengguna jasa pemilik pesanan..."* | akses ditolak | Pass |
| C54-UT10 | validasiPenyediaJasa() | Positif | user_id adalah penyedia jasa pemilik pesanan | Fungsi mengembalikan nilai true | validasi sukses | Pass |
| C54-UT11 | validasiPenyediaJasa() | Negatif | Simulasi query database mengalami timeout | Sistem melempar error *"Gagal memvalidasi pesanan: Timeout"* | error dilempar | Pass |
| C54-UT12 | validasiPenyediaJasa() | Negatif | id_pesanan tidak ditemukan di database  | Sistem melempar error *"Pesanan tidak ditemukan."* | error dilempar | Pass |
| C54-UT13 | validasiPenyediaJasa() | Negatif | user_id bukan penyedia jasa pesanan  | Sistem melempar error *"Akses ditolak. Hanya penyedia jasa pemilik pesanan..."* | akses ditolak | Pass |
| C54-UT14 | submitDeliverable() | Batas / Negatif | deskripsi_produk kosong | Sistem melempar error *"Deskripsi hasil pekerjaan tidak boleh kosong."* | error dilempar | Pass |
| C54-UT15 | submitDeliverable() | Batas / Negatif | file_url dan output_path keduanya tidak diisi  | Sistem melempar error *"Unggah berkas atau sertakan tautan hasil pekerjaan."* | error dilempar | Pass |
| C54-UT16 | submitDeliverable() | Negatif | Simulasi insert data produk_akhir ke database gagal | Sistem melempar error *"Gagal menyimpan hasil pekerjaan: Insert error"* | error dilempar | Pass |
| C54-UT17 | submitDeliverable() | Negatif | Simulasi update status pesanan di database gagal | Sistem melempar error *"Gagal memperbarui status pesanan: DB Error Pesanan"* | error dilempar | Pass |
| C54-UT18 | submitDeliverable() | Positif | Data pekerjaan valid dan data pengguna jasa tersedia | Berhasil menyimpan produk akhir, mengubah status pesanan, & memicu notifikasi | ulasan disimpan & notifikasi terkirim | Pass |
| C54-UT19 | submitDeliverable() | Positif / Batas | Data pekerjaan valid, namun data pengguna jasa  | Berhasil menyimpan produk akhir tanpa memicu pengiriman notifikasi | produk disimpan tanpa notifikasi | Pass |
| C54-UT20 | getDeliverableByPesanan() | Negatif | Simulasi query produk_akhir di database gagal | Sistem melempar error query dari DB | error dilempar | Pass |
| C54-UT21 | getDeliverableByPesanan() | Batas | Produk akhir belum dikumpulkan oleh penyedia jasa | Fungsi mengembalikan nilai null | nilai null dikembalikan | Pass |
| C54-UT22 | getDeliverableByPesanan() | Positif | file_url berupa link HTTP/HTTPS langsung | Mengembalikan data produk akhir beserta file_download_url direct link | data deliverable dikembalikan | Pass |
| C54-UT23 | getDeliverableByPesanan() | Positif | file_url berupa path Storage Supabase | Mengembalikan data produk akhir dengan file_url & file_download_url bertipe signed URL | signed URL dikembalikan | Pass |
| C54-UT24 | getDeliverableByPesanan() | Negatif | Pembuatan signed URL dari Storage Service gagal | Sistem melempar error *"Gagal membuat URL hasil pekerjaan."* | error dilempar | Pass |
| C54-UT25 | getDeliverableByProdukAkhir() | Negatif | id_produk_akhir tidak ditemukan di DB  | Sistem melempar error *"Hasil pekerjaan tidak ditemukan."* | error dilempar | Pass |
| C54-UT26 | getDeliverableByProdukAkhir() | Positif | id_produk_akhir valid dan user_id merupakan owner pesanan | Mengembalikan detail data produk akhir dan memverifikasi otorisasi owner | data produk akhir dikembalikan | Pass |
| C54-UT27 | confirmOrderComplete() | Negatif | user_id bukan pengguna jasa pemilik pesanan  | Sistem melempar error *"Akses ditolak. Hanya pengguna jasa pemilik pesanan..."* | akses ditolak | Pass |
| C54-UT28 | confirmOrderComplete() | Negatif | Query data pesanan gagal atau pesanan tidak ditemukan | Sistem melempar error *"Pesanan tidak ditemukan: Pesanan fail"* | error dilempar | Pass |
| C54-UT29 | confirmOrderComplete() | Negatif | Eksekusi RPC DB konfirmasi_pesanan_selesai mengalami kegagalan | Sistem melempar error *"Gagal mengonfirmasi pesanan dan mencairkan dana: RPC DB Fail"* | error RPC dilempar | Pass |
| C54-UT30 | confirmOrderComplete() | Positif | id_pesanan dan user_id pengguna jasa valid | Berhasil mengeksekusi RPC konfirmasi_pesanan_selesai & mengirim notifikasi ke seller | RPC dipanggil & notifikasi terkirim | Pass |
| C54-UT31 | unggahBerkasDeliverable() | Batas / Negatif | Ukuran berkas melebihi batas 50 MB  | Sistem melempar error *"Ukuran berkas melebihi batas maksimum 50 MB"* | error dilempar | Pass |
| C54-UT32 | unggahBerkasDeliverable() | Negatif | Berkas dengan ekstensi yang dilarang  | Sistem melempar error *"Tipe berkas application/x-msdownload tidak diizinkan..."* | error dilempar | Pass |
| C54-UT33 | unggahBerkasDeliverable() | Negatif | Storage Service mengembalikan pesan galat (*Storage driver full*) | Sistem melempar error driver storage | error dilempar | Pass |
| C54-UT34 | unggahBerkasDeliverable() | Negatif | Storage Service mengembalikan URL kosong tanpa pesan galat | Sistem melempar error *"Gagal mengunggah berkas deliverable."* | error dilempar | Pass |
| C54-UT35 | unggahBerkasDeliverable() | Positif | Berkas valid (test.png, image/png) | Berhasil mengunggah berkas ke folder deliverable dan mengembalikan URL storage | unggah sukses & URL dikembalikan | Pass |

Tabel 4.2.18b. Ringkasan Cakupan Kelas [C54]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | validasiPengumpulan(), validasiDeskripsi() |
| Operasi yang diuji | validasiOwnerPesanan(), validasiPenggunaJasa(), validasiPenyediaJasa(), submitDeliverable(), getDeliverableByPesanan(), getDeliverableByProdukAkhir(), confirmOrderComplete(), unggahBerkasDeliverable() <br> Note : fungsi yang tidak diimplementasikan sudah dimasukkan ke dalam tubuh fungsi lain yang diuji baik dalam bentuk query maupun routing |
| ID Algoritma yang tercakup | Algo-5101 - Algo-5105, dan tambahan yang tidak tercatat dalam DPPL |
| Coverage (wajib ≥ 70%) | [Lihat Hasil Pengujian](#bukti-c54) |


## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| I-01 | C04 HalamanRegistrasi | AuthService → Supabase Auth, tabel `pengguna`, `penyedia_jasa`/`pengguna_jasa` | Controller - Model, Aplikasi - Basis data, Aplikasi - Sistem eksternal | INT-TC01, INT-TC02, INT-TC03 |
| I-02 | C06 HalamanLogin  | AuthService → Supabase Auth, tabel `pengguna` | Controller - Model, Aplikasi - Sistem eksternal | INT-TC04, INT-TC05, INT-TC06 |
| I-03 | C08 HalamanPortofolio melalui API `POST /api/upload`, `GET/POST /api/portofolio` | PengontrolPortofolio → Supabase Storage, tabel `portofolio`, `penyedia_jasa` | Controller - Model, Aplikasi - Basis data, Aplikasi - Sistem eksternal | INT-TC07, INT-TC08 |
| I-04 | C13 HalamanUploadJasa  | JasaController → Supabase Storage, tabel `jasa` | Controller - Model, Aplikasi - Basis data, Aplikasi - Sistem eksternal | INT-TC09, INT-TC10, INT-TC11 |
| I-05 | C15 HalamanPencarian , C16 HasilPencarian  | LayananPencarian, PengontrolBookmark → tabel `jasa`, `bookmark` | Controller - Model, Aplikasi - Basis data | INT-TC12, INT-TC13, INT-TC14 |
| I-06 | C19 HalamanDetailJasa  | JasaController, PenyediaJasaService, UlasanService, ChatService → tabel `jasa`, `penyedia_jasa`, `ulasan`, `chatroom` | Controller - Model, Aplikasi - Basis data | INT-TC15, INT-TC16, INT-TC17 |
| I-07 | C21 HalamanBookmark  PengontrolBookmark → tabel `bookmark` | Controller - Model, Aplikasi - Basis data | INT-TC18, INT-TC19 |
| I-08 | C24 HalamanChat  | ChatService → tabel `pesan_chat`, `chatroom`, Supabase Storage | Controller - Model, Aplikasi - Basis data, Aplikasi - Sistem eksternal | INT-TC20, INT-TC21, INT-TC22 |
| I-09 | C28 HalamanPemesanan | PesananService → tabel `pesanan`, `jasa` | Controller - Model, Aplikasi - Basis data | INT-TC23, INT-TC24, INT-TC25 |
| I-10 | C29 HalamanPembayaran  | PengontrolTransaksi → tabel `metode_pembayaran`, `riwayat_transaksi`, `pesanan` (gateway pembayaran *dummy*) | Controller - Model, Aplikasi - Basis data, Aplikasi - Sistem eksternal (*dummy*) | INT-TC26, INT-TC27, INT-TC28 |
| I-11 | PesananService.ambilDaftarPesanan | Tabel pesanan | Aplikasi - Basis data | INT-TC29, INT-TC30 |
| I-12 | PesananService.respondOrder | Tabel pesanan | Aplikasi - Basis data | INT-TC31, INT-TC32 |
| I-13 | DeliverablesService.submitDeliverable | Tabel produk_akhir, pesanan | Aplikasi - Basis data | INT-TC33, INT-TC34 |
| I-14 | DeliverablesService.confirmOrderComplete, getDeliverableByPesanan | Tabel produk_akhir, pesanan | Aplikasi - Basis data | INT-TC35, INT-TC36 |
| I-15 | DeliverablesService.requestRevision | Tabel pengajuan_revisi, pesanan | Aplikasi - Basis data | INT-TC37, INT-TC38 |
| I-16 | PelaporanService.submitLaporan | Tabel tiket_laporan | Aplikasi - Basis data | INT-TC39, INT-TC40 |
| I-17 | UlasanService.simpanUlasan | Tabel ulasan, penyedia_jasa, jasa | Aplikasi - Basis data | INT-TC41, INT-TC42 |
| I-18 | TanggapanLaporanService.catatKeputusanTindakan, MediasiService.mulaiMediasi | Tabel tanggapan_laporan, tiket_laporan, sesi_mediasi, pesan_mediasi | Aplikasi - Basis data | INT-TC43, INT-TC44, INT-TC45 |
| I-19 | TanggapanLaporanService.getAllTicketsForAdmin, getDetailTiketAdmin | Tabel tiket_laporan | Aplikasi - Basis data | INT-TC46, INT-TC47 |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INT-TC01 | I-01 | Normal: registrasi penyedia | `POST /api/auth` `{action:'register', nama, email baru, password 'RahasiaUji123', role:'penyedia_jasa'}`, lalu baca tabel `pengguna`, `penyedia_jasa`, dan Supabase Auth | Status 201; akun ada di Supabase Auth; baris `pengguna` (role PENYEDIA_JASA) dan `penyedia_jasa` dengan id yang sama tersimpan | Status 201; akun ada di Supabase Auth, baris `pengguna` (role PENYEDIA_JASA) dan `penyedia_jasa` tersimpan dengan id yang sama | Pass |
| INT-TC02 | I-01 | Gagal: email sudah terdaftar | Kirim ulang registrasi dengan email INT-TC01, lalu hitung baris `pengguna` dengan email tersebut | Status 409, pesan "Email sudah terdaftar"; jumlah baris tetap 1 | Status 409 "Email sudah terdaftar"; baris `pengguna` dengan email tersebut tetap 1 | Pass |
| INT-TC03 | I-01 | Batas: password 7 karakter | Registrasi dengan password `1234567` | Status 400, pesan "Password minimal 8 karakter"; tidak ada baris baru di `pengguna` | Status 400 "Password minimal 8 karakter"; tidak ada baris `pengguna` baru | Pass |
| INT-TC04 | I-02 | Normal: login berhasil | `POST /api/auth` `{action:'login'}` dengan akun INT-TC01, lalu `GET /api/auth` memakai cookie dari respons login | Status 200 dan cookie sesi Supabase terpasang; `GET /api/auth` mengembalikan id, email, dan `isPenyediaJasa = true` sesuai tabel `pengguna` | Status 200, cookie sesi terpasang; `GET /api/auth` mengembalikan id, email, dan `isPenyediaJasa = true` sesuai tabel `pengguna` | Pass |
| INT-TC05 | I-02 | Gagal: password salah | Login dengan password salah, lalu `GET /api/auth` | Status 401, pesan "Kredensial tidak valid"; `GET /api/auth` tetap 401 (tidak ada sesi) | Status 401 "Kredensial tidak valid"; `GET /api/auth` berstatus 401 | Pass |
| INT-TC06 | I-02 | Gagal: akun ditangguhkan | Ubah `pengguna.status_akun` akun uji menjadi `false`, login, lalu kembalikan menjadi `true` | Status 403, pesan "Akun Anda ditangguhkan" | Status 403 "Akun Anda ditangguhkan" | Pass |
| INT-TC07 | I-03 | Normal: simpan portofolio | `POST /api/upload` (PNG, folder `portofolio`), lalu `POST /api/portofolio` dengan URL hasil unggah, pengalaman, dan prestasi; baca tabel `portofolio`, `penyedia_jasa`, dan `GET /api/portofolio` | Upload mengembalikan URL Storage; baris `portofolio` tersimpan dengan URL yang sama; `penyedia_jasa.pengalaman/prestasi` berisi data baru; `GET /api/portofolio` memuat karya tersebut | Berkas terunggah ke Storage; baris `portofolio` tersimpan dengan URL yang sama; pengalaman dan prestasi `penyedia_jasa` diperbarui; karya tampil pada `GET /api/portofolio` | Pass |
| INT-TC08 | I-03 | Batas: judul 256 karakter | `POST /api/portofolio` dengan judul 256 karakter | Ditolak dengan pesan "Judul karya maksimal 255 karakter"; tidak ada baris baru di `portofolio` | Ditolak dengan pesan "Judul karya maksimal 255 karakter"; tidak ada baris `portofolio` baru | Pass |
| INT-TC09 | I-04 | Normal: unggah jasa | Login penyedia, `POST /api/jasa` multipart (nama, kategori Desain Grafis, harga 100000, deskripsi, 1 berkas PNG); baca tabel `jasa` | Status 201; baris `jasa` milik penyedia login dengan `status_aktif = true`, harga 100000, dan 1 URL di `berkas_pendukung` | Pengujian awal Fail: (1) HTTP 500 karena kolom `jasa.berkas_pendukung` belum dimigrasikan ke basis data; (2) HTTP 500 "new row violates row-level security policy for table jasa" karena tabel `jasa` belum memiliki policy INSERT untuk penyedia. Setelah migrasi kolom dijalankan dan policy ditambahkan (`20261120100000_policy_jasa.sql`), pengujian ulang: status 201, baris `jasa` aktif milik penyedia dengan harga 100000 dan 1 URL berkas | Pass |
| INT-TC10 | I-04 | Batas: harga 0 | `POST /api/jasa` dengan harga 0 | Status 400 (data penawaran tidak valid); tidak ada baris `jasa` baru | Status 400; tidak ada baris `jasa` baru | Pass |
| INT-TC11 | I-04 | Gagal: bukan penyedia | Login pengguna jasa, `POST /api/jasa` | Status 403, pesan "Akses ditolak: Hanya penyedia jasa ..."; tidak ada baris `jasa` baru | Status 403 "Akses ditolak: Hanya penyedia jasa yang dapat menambahkan penawaran jasa"; tidak ada baris `jasa` baru | Pass |
| INT-TC12 | I-05 | Normal: cari + filter | `GET /api/jasa?q=<kata kunci>&kategori=Desain Grafis&harga_min=50000`, lalu bandingkan dengan query langsung ke tabel `jasa` | Status 200; jasa INT-TC09 ada di hasil; semua hasil berkategori Desain Grafis dan harga ≥ 50000; jumlah hasil sama dengan data aktif di DB | Status 200; jasa INT-TC09 muncul, seluruh hasil berkategori Desain Grafis dengan harga ≥ 50000, jumlah hasil sama dengan data di DB | Pass |
| INT-TC13 | I-05 | Batas: kata kunci 2 karakter | `GET /api/jasa?q=ab` | Status 400, pesan "Keyword Pencarian Minimal 3 karakter" | Status 400 "Keyword Pencarian Minimal 3 karakter" | Pass |
| INT-TC14 | I-05 | Normal: toggle bookmark | `POST /api/bookmark` `{id_jasa, toggle:true}` dua kali, hitung baris `bookmark` setelah tiap panggilan | Setelah klik pertama ada 1 baris; setelah klik kedua 0 baris | Panggilan pertama membuat 1 baris `bookmark`; panggilan kedua menghapusnya (0 baris) | Pass |
| INT-TC15 | I-06 | Normal: detail jasa | `GET /api/jasa/[id]`, `GET /api/penyedia/[id]`, `GET /api/ulasan?id_jasa=` | Semua status 200; nama dan harga jasa sama dengan tabel `jasa`; nama penyedia sama dengan `pengguna.nama`; total ulasan sama dengan isi tabel `ulasan` (0) | Ketiga endpoint berstatus 200; nama dan harga jasa, nama penyedia, serta total ulasan (0) sama dengan isi DB | Pass |
| INT-TC16 | I-06 | Gagal: id jasa tidak ada | `GET /api/jasa/00000000-0000-0000-0000-000000000000` | Status 404, pesan "Data jasa tidak ditemukan" | Status 404 "Data jasa tidak ditemukan" | Pass |
| INT-TC17 | I-06 | Normal: Chat Penyedia | `POST /api/chat` `{id_penyedia_jasa}` dua kali sebagai pengguna jasa; hitung baris `chatroom` | Kedua panggilan mengembalikan `id_chatroom` yang sama; hanya ada 1 baris `chatroom` untuk pasangan tersebut | Kedua panggilan mengembalikan `id_chatroom` yang sama; hanya 1 baris `chatroom` untuk pasangan tersebut | Pass |
| INT-TC18 | I-07 | Normal: daftar bookmark | Tambah bookmark, lalu `GET /api/bookmark` dan bandingkan dengan tabel `bookmark` | Status 200; daftar `id_jasa` dari API sama persis dengan baris `bookmark` milik pengguna | Status 200; daftar `id_jasa` dari API sama persis dengan baris `bookmark` milik pengguna | Pass |
| INT-TC19 | I-07 | Normal: hapus bookmark | `DELETE /api/bookmark?id_jasa=` | Status 200; baris `bookmark` terhapus | Status 200; baris `bookmark` terhapus dari DB | Pass |
| INT-TC20 | I-08 | Normal: kirim pesan | Pengguna jasa `POST /api/chat/[id_chatroom]` `{isi_pesan}`, lalu penyedia `GET /api/chat/[id_chatroom]` | Baris `pesan_chat` tersimpan dengan `id_pengirim` pengguna jasa; pesan terbaca oleh penyedia | Baris `pesan_chat` tersimpan dengan `id_pengirim` pengguna jasa; pesan terbaca saat penyedia memanggil `GET /api/chat/[id_chatroom]` | Pass |
| INT-TC21 | I-08 | Normal: kirim lampiran | `POST /api/upload` (PNG, folder `chat`), lalu kirim pesan dengan `lampiran` = URL tersebut | Baris `pesan_chat` berisi `lampiran` = URL Storage hasil unggah | URL Storage dari `/api/upload` tersimpan pada kolom `lampiran` baris `pesan_chat` | Pass |
| INT-TC22 | I-08 | Gagal: bukan peserta room | Akun ketiga `GET /api/chat/[id_chatroom]` | Permintaan ditolak ("Ruang obrolan tidak ditemukan." karena RLS menyembunyikan room milik orang lain); isi pesan room tidak ikut terkirim | Permintaan ditolak dengan pesan "Ruang obrolan tidak ditemukan." karena RLS menyembunyikan room milik pengguna lain; isi pesan tidak bocor | Pass |
| INT-TC23 | I-09 | Normal: buat pesanan | `POST /api/pesanan` `{id_pengguna_jasa, id_jasa, brief}`; baca tabel `pesanan` | Status 201; baris `pesanan` dengan status MENUNGGU_PEMBAYARAN, `total_biaya` = harga jasa, `id_penyedia_jasa` = pemilik jasa | Status 201; baris `pesanan` berstatus MENUNGGU_PEMBAYARAN dengan `total_biaya` 100000 dan `id_penyedia_jasa` pemilik jasa | Pass |
| INT-TC24 | I-09 | Gagal: memesan jasa sendiri | Penyedia `POST /api/pesanan` untuk jasanya sendiri | Ditolak dengan pesan "Tidak dapat memesan jasa milik sendiri"; tidak ada baris `pesanan` baru | Ditolak dengan pesan "Tidak dapat memesan jasa milik sendiri"; tidak ada baris `pesanan` baru | Pass |
| INT-TC25 | I-09 | Batas: brief kosong | `POST /api/pesanan` dengan brief `'   '` | Ditolak dengan pesan "Brief pemesanan wajib diisi"; jumlah baris `pesanan` tidak berubah | Ditolak dengan pesan "Brief pemesanan wajib diisi"; jumlah baris `pesanan` tidak berubah | Pass |
| INT-TC26 | I-10 | Normal: daftar metode | `GET /api/transaksi?type=metode`, bandingkan dengan tabel `metode_pembayaran` | Status 200; daftar `id_metode` sama dengan isi tabel | Status 200; daftar `id_metode` sama dengan isi tabel `metode_pembayaran` | Pass |
| INT-TC27 | I-10 | Normal: bayar pesanan | `POST /api/transaksi/dummy` `{id_pesanan INT-TC23, id_metode, jumlah_bayar 100000}`; baca `riwayat_transaksi` dan `pesanan` | Status 201; 1 baris `riwayat_transaksi` dengan metode dan nominal yang sama; `pesanan.status_pembayaran` = LUNAS dan status tidak lagi MENUNGGU_PEMBAYARAN | Status 201; 1 baris `riwayat_transaksi` dengan metode dan nominal yang sama; `pesanan.status_pembayaran` = LUNAS dan status tidak lagi MENUNGGU_PEMBAYARAN | Pass |
| INT-TC28 | I-10 | Gagal: bayar ulang | Kirim ulang `POST /api/transaksi/dummy` untuk pesanan yang sama | Status 400, pesan "Pesanan tidak dalam status menunggu pembayaran"; baris `riwayat_transaksi` tetap 1 | Status 400 "Pesanan tidak dalam status menunggu pembayaran"; baris `riwayat_transaksi` tetap 1 | Pass |
| INT-TC29 | I-11 | Normal: mengambil daftar pesanan pengguna | Memanggil `ambilDaftarPesanan()` dengan ID pengguna dan peran `pengguna_jasa` yang valid | Menghasilkan seluruh pesanan milik pengguna beserta status dan informasi ulasan | Menghasilkan 2 pesanan dengan status DIPROSES dan SELESAI serta informasi ulasan yang sesuai | Pass |
| INT-TC30 | I-11 | Normal: pengguna belum memiliki pesanan | Memanggil `ambilDaftarPesanan()` untuk pengguna yang belum memiliki pesanan | Menghasilkan daftar pesanan kosong | Menghasilkan array kosong | Pass |
| INT-TC31 | I-12 | Normal: menerima pesanan | Memanggil `respondOrder()` dengan ID pesanan, ID penyedia, dan tindakan `Diterima` yang valid | Status pesanan diperbarui menjadi DIPROSES | Menghasilkan pesanan dengan status DIPROSES dan menjalankan operasi update satu kali | Pass |
| INT-TC32 | I-12 | Gagal: menerima pesanan yang sudah diproses | Memanggil `respondOrder()` untuk pesanan dengan status DIPROSES | Sistem menolak tindakan dan tidak memperbarui data pesanan | Sistem menghasilkan error "Pesanan ini sudah diproses sebelumnya" dan tidak menjalankan update | Pass |
| INT-TC33 | I-13 | Normal: mengumpulkan hasil pekerjaan | Memanggil `submitDeliverable()` dengan ID pesanan, deskripsi, dan URL berkas valid | Data produk akhir tersimpan dan status pesanan diperbarui | Data produk akhir tersimpan dengan deskripsi yang telah di-trim dan status pemeriksaan false; status pesanan diperbarui | Pass |
| INT-TC34 | I-13 | Gagal: berkas dan tautan hasil pekerjaan kosong | Memanggil `submitDeliverable()` tanpa berkas dan tanpa tautan | Sistem menolak pengumpulan dan tidak menyimpan data | Sistem menghasilkan error "Unggah berkas atau sertakan tautan hasil pekerjaan." dan tidak menjalankan insert maupun update | Pass |
| INT-TC35 | I-14 | Normal: mengonfirmasi pesanan selesai | Memanggil `confirmOrderComplete()` dengan ID pesanan dan ID pengguna valid | Pesanan dikonfirmasi selesai dan RPC pencairan dana dipanggil | Proses berhasil dan RPC `konfirmasi_pesanan_selesai` dipanggil dengan ID pesanan yang sesuai | Pass |
| INT-TC36 | I-14 | Normal: deliverable belum tersedia | Memanggil `getDeliverableByPesanan()` untuk pesanan yang belum memiliki hasil pekerjaan | Sistem mengembalikan nilai null | Menghasilkan null | Pass |
| INT-TC37 | I-15 | Normal: mengajukan revisi | Memanggil `requestRevision()` dengan data pesanan, produk akhir, deskripsi revisi, dan pengguna valid | Pengajuan revisi tersimpan dan kuota revisi berkurang menjadi 2 | Data revisi berhasil disimpan dengan kuota tersisa 2 dan status Sedang Direvisi | Pass |
| INT-TC38 | I-15 | Gagal: kuota revisi habis | Memanggil `requestRevision()` pada pesanan dengan kuota revisi 0 | Sistem menolak pengajuan revisi dan tidak menyimpan pengajuan baru | Sistem menghasilkan error "Kuota revisi untuk pesanan ini sudah habis." dan tidak menjalankan insert | Pass |
| INT-TC39 | I-16 | Normal: mengirim laporan | Memanggil `submitLaporan()` dengan ID pesanan, ID pelapor, kategori, deskripsi, dan bukti valid | Tiket laporan tersimpan dengan identitas terlapor berdasarkan data pesanan | Tiket laporan berhasil disimpan dengan ID terlapor sesuai penyedia jasa pada pesanan | Pass |
| INT-TC40 | I-16 | Gagal: bukti laporan kosong | Memanggil `submitLaporan()` dengan daftar URL bukti kosong | Sistem menolak laporan dan tidak melakukan koneksi ke database | Sistem menghasilkan error "Minimal sertakan 1 tautan atau lampiran bukti." dan tidak memanggil `createClient()` | Pass |
| INT-TC41 | I-17 | Normal: menyimpan ulasan | Memanggil `simpanUlasan()` dengan pesanan selesai dan rating 5 | Ulasan tersimpan dan rating penyedia serta jasa diperbarui | Ulasan tersimpan; mock memverifikasi operasi pembaruan rating penyedia dan jasa dengan nilai 5 | Pass |
| INT-TC42 | I-17 | Gagal: rating tidak valid | Memanggil `simpanUlasan()` dengan rating 0 | Sistem menolak ulasan dan tidak melakukan operasi database | Sistem menghasilkan error "Rating harus bernilai antara 1 sampai 5." dan tidak memanggil client Supabase | Pass |
| INT-TC43 | I-18 | Normal: mencatat keputusan tindakan admin | Memanggil `catatKeputusanTindakan()` dengan ID tiket, ID admin, jenis tindakan PERINGATAN, dan catatan valid | Tanggapan tersimpan, status tiket diperbarui menjadi Selesai, dan RPC pemberian sanksi dipanggil | Tanggapan tersimpan, operasi update tiket dan RPC `admin_beri_sanksi` terverifikasi | Pass |
| INT-TC44 | I-18 | Normal: memulai sesi mediasi baru | Memanggil `mulaiMediasi()` pada tiket yang belum memiliki sesi aktif | Sesi mediasi dan pesan pembuka dibuat serta notifikasi dikirim kepada kedua pihak | Sesi dan pesan pembuka berhasil dibuat; dua notifikasi dikirim kepada pelapor dan terlapor | Pass |
| INT-TC45 | I-18 | Normal: menggunakan sesi mediasi aktif | Memanggil `mulaiMediasi()` pada tiket yang sudah memiliki sesi mediasi aktif | Sistem menggunakan sesi yang tersedia tanpa membuat sesi baru | Sesi aktif dikembalikan tanpa insert pesan baru maupun pengiriman notifikasi | Pass |
| INT-TC46 | I-19 | Normal: mengambil seluruh tiket laporan | Memanggil `getAllTicketsForAdmin()` | Menghasilkan daftar tiket laporan yang diurutkan berdasarkan waktu pembuatan terbaru | Menghasilkan daftar tiket dan memverifikasi pengurutan `created_at` secara descending | Pass |
| INT-TC47 | I-19 | Normal: mengambil detail tiket laporan | Memanggil `getDetailTiketAdmin()` dengan ID tiket valid | Menghasilkan detail tiket beserta tanggapan dan informasi pesanan | Detail tiket, tanggapan, dan informasi pesanan berhasil diperoleh | Pass |

<br>

## 4.4 Pengujian Use Case

### 4.4.1 Use Case UC01
 
**ID Use Case:** UC01  
**Nama Use Case:** Melakukan Registrasi Akun
 
Catatan: pada implementasi, form registrasi berisi pilihan peran (Pengguna Jasa / Penyedia Jasa), nama, email, dan kata sandi. Field nomor telepon pada skenario SKPL tidak diimplementasikan; pengecekan duplikasi dilakukan berdasarkan email (lihat Tabel B.1 Dokumen Implementasi).
 
Tabel 4.4.1. Hasil Pengujian Use Case UC01
 
| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC01-TC01 | KF01 | Normal | 1. Buka halaman `/register`.<br>2. Pilih "Daftar sebagai" Penyedia Jasa.<br>3. Isi nama, email, dan kata sandi.<br>4. Klik tombol "Daftar". | Peran: Penyedia Jasa<br>Nama: Uji Penyedia UC01<br>Email: uc01.penyedia@contoh.com<br>Kata sandi: RahasiaUji123 | Akun berhasil dibuat; pengguna diarahkan ke halaman login yang menampilkan pesan "Registrasi berhasil. Silakan masuk dengan akun Anda." | Akun penyedia jasa berhasil dibuat; pengguna diarahkan ke halaman login yang menampilkan pesan "Registrasi berhasil. Silakan masuk dengan akun Anda." | Pass |
| UC01-TC02 | KF01 | Normal (peran Pengguna Jasa) | 1. Buka halaman `/register`.<br>2. Pilih "Daftar sebagai" Pengguna Jasa.<br>3. Isi nama, email, dan kata sandi.<br>4. Klik tombol "Daftar". | Peran: Pengguna Jasa<br>Nama: Uji Pengguna UC01<br>Email: uc01.pengguna@contoh.com<br>Kata sandi: RahasiaUji123 | Akun berhasil dibuat; pengguna diarahkan ke halaman login dengan pesan registrasi berhasil | Akun pengguna jasa berhasil dibuat; pengguna diarahkan ke halaman login dengan pesan registrasi berhasil | Pass |
| UC01-TC03 | KF01 | Alternatif 1: Data Registrasi Tidak Valid | 1. Buka halaman `/register`.<br>2. Isi email dengan format salah dan kata sandi kurang dari 8 karakter, kosongkan nama.<br>3. Klik "Daftar".<br>4. Perbaiki seluruh data, lalu klik "Daftar" kembali. | Nama: (kosong)<br>Email: uc01-salah<br>Kata sandi: 1234567<br>Perbaikan: Nama "Uji Valid UC01", email uc01.valid@contoh.com, kata sandi RahasiaUji123 | Percobaan pertama: muncul pesan "Nama wajib diisi", "Format email tidak valid", dan "Kata sandi minimal 8 karakter"; akun tidak dibuat. Setelah diperbaiki, registrasi berhasil dan diarahkan ke halaman login | Percobaan pertama menampilkan pesan "Nama wajib diisi", "Format email tidak valid", dan "Kata sandi minimal 8 karakter" serta akun tidak dibuat; setelah data diperbaiki, registrasi berhasil dan pengguna diarahkan ke halaman login | Pass |
| UC01-TC04 | KF01 | Alternatif 2: Email Sudah Terdaftar | 1. Buka halaman `/register`.<br>2. Isi data dengan email akun uji yang sudah terdaftar.<br>3. Klik "Daftar".<br>4. Ganti email dengan email baru, lalu klik "Daftar" kembali. | Email: penyedia.uji@contoh.com (akun uji yang sudah terdaftar)<br>Perbaikan email: uc01.penyedia2@contoh.com | Percobaan pertama: muncul pesan "Email telah terdaftar. Silakan menggunakan email lain atau melakukan login." dan keterangan "Email sudah terdaftar" pada field email. Setelah email diganti, registrasi berhasil | Percobaan pertama menampilkan pesan "Email telah terdaftar. Silakan menggunakan email lain atau melakukan login." dan keterangan "Email sudah terdaftar" pada field email; setelah email diganti, registrasi berhasil | Pass |
 
### 4.4.2 Use Case UC02
 
**ID Use Case:** UC02  
**Nama Use Case:** Melakukan *Login*
 
Pengujian memakai akun uji pada README repositori: Penyedia Jasa `penyedia.uji@contoh.com` / `Bujank123` dan Pemesan `klien.uji@contoh.com` / `Another123!`.
 
Tabel 4.4.2. Hasil Pengujian Use Case UC02
 
| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC02-TC01 | KF02 | Normal (Penyedia Jasa) | 1. Buka halaman `/login`.<br>2. Masukkan email dan kata sandi akun penyedia.<br>3. Klik tombol "Masuk". | Email: penyedia.uji@contoh.com<br>Kata sandi: Bujank123 | Sesi login dibuat; pengguna diarahkan ke halaman awal penyedia (Portofolio Saya) dan nama akun tampil di navbar | Login berhasil; pengguna diarahkan ke halaman Portofolio Saya dan nama akun penyedia tampil di navbar | Pass |
| UC02-TC02 | KF02 | Normal (Pengguna Jasa) | 1. Buka halaman `/login`.<br>2. Masukkan email dan kata sandi akun pengguna jasa.<br>3. Klik "Masuk". | Email: klien.uji@contoh.com<br>Kata sandi: Another123! | Sesi login dibuat; pengguna diarahkan ke halaman Cari Jasa dan nama akun tampil di navbar | Login berhasil; pengguna diarahkan ke halaman Cari Jasa dan nama akun pemesan tampil di navbar | Pass |
| UC02-TC03 | KF02 | Alternatif 1: Email atau Password Salah | 1. Buka halaman `/login`.<br>2. Masukkan email benar dengan kata sandi salah.<br>3. Klik "Masuk".<br>4. Perbaiki kata sandi, lalu klik "Masuk" kembali. | Email: penyedia.uji@contoh.com<br>Kata sandi: SalahSekali1<br>Perbaikan: Bujank123 | Percobaan pertama: muncul pesan "Email atau kata sandi salah" dan pengguna tetap di halaman login. Setelah diperbaiki, login berhasil dan diarahkan ke halaman awal | Percobaan pertama menampilkan pesan "Email atau kata sandi salah" dan pengguna tetap di halaman login; setelah kata sandi diperbaiki, login berhasil dan diarahkan ke halaman awal penyedia | Pass |
| UC02-TC04 | KF02 | Alternatif 2: Data Login Tidak Lengkap | 1. Buka halaman `/login`.<br>2. Kosongkan email dan kata sandi.<br>3. Klik "Masuk".<br>4. Lengkapi kedua field, lalu klik "Masuk" kembali. | Email: (kosong)<br>Kata sandi: (kosong)<br>Perbaikan: klien.uji@contoh.com / Another123! | Percobaan pertama: muncul pesan "Email wajib diisi" dan "Kata sandi wajib diisi"; permintaan login tidak dikirim. Setelah dilengkapi, login berhasil | Percobaan pertama menampilkan pesan "Email wajib diisi" dan "Kata sandi wajib diisi" tanpa mengirim permintaan login; setelah dilengkapi, login berhasil | Pass |
 
### 4.4.3 Use Case UC03
 
**ID Use Case:** UC03  
**Nama Use Case:** Mengisi Portofolio
 
Tabel 4.4.3. Hasil Pengujian Use Case UC03
 
| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC03-TC01 | KF03, KF04 | Normal | 1. Login sebagai penyedia jasa (penyedia.uji@contoh.com / Bujank123).<br>2. Pilih menu "Portofolio" pada navbar.<br>3. Isi judul karya, deskripsi, pengalaman, dan prestasi, lalu unggah 1 berkas gambar.<br>4. Klik "Simpan Portofolio". | Judul: Logo Kedai Kopi<br>Deskripsi: Desain logo untuk kedai kopi lokal<br>Pengalaman: Desainer grafis 2 tahun<br>Prestasi: Juara 1 Lomba Logo 2025<br>Berkas: logo-kopi.png (< 10 MB) | Muncul pesan "Portofolio berhasil disimpan."; karya baru tampil pada bagian "Karya yang sudah diunggah" beserta pengalaman dan prestasi, dan tetap tampil setelah halaman dimuat ulang | Muncul pesan "Portofolio berhasil disimpan."; karya beserta pengalaman dan prestasi tampil pada bagian "Karya yang sudah diunggah" dan tetap tampil setelah halaman dimuat ulang | Pass |
| UC03-TC02 | KF03 | Alternatif 1: Data Portofolio Tidak Lengkap | 1. Login sebagai penyedia.uji@contoh.com, buka halaman Portofolio.<br>2. Kosongkan judul karya dan jangan unggah berkas.<br>3. Klik "Simpan Portofolio".<br>4. Lengkapi judul dan berkas, lalu klik "Simpan Portofolio" kembali. | Judul: (kosong)<br>Berkas: (tidak ada)<br>Perbaikan: judul "Poster Acara Kampus", berkas poster.png | Percobaan pertama: muncul pesan "Judul karya wajib diisi" dan "Berkas pendukung wajib diunggah"; data tidak disimpan. Setelah dilengkapi, muncul "Portofolio berhasil disimpan." dan karya tampil di daftar | Percobaan pertama menampilkan pesan "Judul karya wajib diisi" dan "Berkas pendukung wajib diunggah" serta data tidak disimpan; setelah dilengkapi, muncul "Portofolio berhasil disimpan." dan karya tampil di daftar | Pass |
| UC03-TC03 | KF03 | Alternatif 1: Berkas tidak sesuai ketentuan | 1. Login sebagai penyedia.uji@contoh.com, buka halaman Portofolio.<br>2. Isi judul, lalu pilih berkas dengan format yang tidak diizinkan.<br>3. Ganti dengan berkas yang sesuai, lalu klik "Simpan Portofolio". | Judul: Desain Kemasan<br>Berkas: dokumen.docx<br>Perbaikan berkas: kemasan.pdf | Berkas .docx ditolak oleh kotak unggah dengan keterangan format yang diizinkan (JPG, JPEG, PNG, PDF; maks. 10 MB). Setelah diganti dengan PDF, portofolio berhasil disimpan | Berkas .docx ditolak oleh kotak unggah dengan keterangan format yang diizinkan; setelah diganti dengan berkas PDF, portofolio berhasil disimpan | Pass |
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
| UC05-TC03 | KF16 | Normal: Komparasi Spesifikasi Jasa | 1. Kirim permintaan perbandingan 2–4 jasa melalui endpoint `GET /api/jasa?compare=j1,j2`. | `compare`: `j1,j2` | Sistem mengembalikan matriks perbandingan berisi daftar jasa beserta ringkasan `id_termurah`, `id_termahal`, `selisih_harga`, dan `id_rating_tertinggi`. | Endpoint `GET /api/jasa?compare=j1,j2` mengembalikan respons JSON matriks perbandingan dan ringkasan harga/rating dengan akurat. (Catatan: belum ada tombol UI komparasi terpisah pada `/pengguna/pencarian`). | Pass *(Level API)* |
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

### 4.4.8 Use Case Melakukan Komunikasi (UC08)

**ID Use Case:** UC08  
**Nama Use Case:** Melakukan Komunikasi

Tabel 4.4.8. Hasil Pengujian Use Case [UC08]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC08-TC01 | KF13, KF14, KF15 | Normal – Pengguna Jasa mengirim pesan kepada Penyedia Jasa | 1. Pengguna Jasa membuka halaman chat dengan Penyedia Jasa. 2. Pengguna Jasa mengirim pesan. 3. Penyedia Jasa membuka percakapan dan melihat pesan yang diterima. | Pesan teks dari Pengguna Jasa. | Pesan berhasil dikirim dan ditampilkan pada riwayat percakapan. Penerima memperoleh notifikasi pesan baru. | Halaman chat menampilkan percakapan antara Pengguna Jasa dan Penyedia Jasa. | Berhasil |
| UC08-TC02 | KF13, KF14, KF15 | Normal – Penyedia Jasa mengirim pesan kepada Pengguna Jasa | 1. Penyedia Jasa membuka halaman chat dengan Pengguna Jasa. 2. Penyedia Jasa mengirim pesan. 3. Pengguna Jasa membuka percakapan dan melihat pesan yang diterima. | Pesan teks dari Penyedia Jasa. | Pesan berhasil dikirim dan ditampilkan pada riwayat percakapan. Penerima memperoleh notifikasi pesan baru. | Halaman chat menampilkan percakapan antara Pengguna Jasa dan Penyedia Jasa. | Berhasil |
| UC08-TC03 | KF13, KF15, KF37 | Normal – Pengguna Jasa berkomunikasi dengan Admin | 1. Pengguna Jasa membuka ruang mediasi. 2. Pengguna Jasa mengirim pesan kepada Admin. 3. Admin membuka ruang mediasi dan melihat pesan. | Pesan teks dari Pengguna Jasa/Pelapor. | Pesan berhasil dikirim dan ditampilkan dalam ruang mediasi sehingga dapat dibaca oleh Admin. | Percakapan antara Pelapor dan Admin ditampilkan dalam ruang mediasi. | Berhasil |
| UC08-TC04 | KF13, KF15, KF37 | Normal – Penyedia Jasa berkomunikasi dengan Admin | 1. Penyedia Jasa membuka ruang mediasi. 2. Penyedia Jasa mengirim pesan kepada Admin. 3. Admin membuka ruang mediasi dan melihat pesan. | Pesan teks dari Penyedia Jasa/Terlapor. | Pesan berhasil dikirim dan ditampilkan dalam ruang mediasi sehingga dapat dibaca oleh Admin. | Percakapan antara Terlapor dan Admin ditampilkan dalam ruang mediasi. | Berhasil |
| UC08-TC05 | KF13, KF15, KF37 | Normal – Admin mengirim pesan kepada peserta mediasi | 1. Admin membuka ruang mediasi. 2. Admin mengirim pesan kepada peserta mediasi. 3. Peserta membuka ruang mediasi dan melihat pesan dari Admin. | Pesan teks dari Admin. | Pesan berhasil dikirim dan ditampilkan kepada peserta mediasi. | Pesan dari Admin ditampilkan dalam ruang mediasi. | Berhasil |
| UC08-TC06 | KF13 | Alternatif 1 – Pengguna mengirim pesan kosong | 1. Pengguna membuka halaman chat. 2. Pengguna membiarkan kolom pesan kosong. 3. Pengguna mencoba menekan tombol kirim. | Kolom pesan kosong. | Sistem mencegah pengiriman pesan kosong. | Muncul pesan: "Pesan tidak boleh kosong." | Berhasil |
| UC08-TC07 | KF13 | Alternatif 1 – Admin mengirim pesan kosong | 1. Admin membuka halaman chat. 2. Admin membiarkan kolom pesan kosong. 3. Admin mencoba menekan tombol kirim. | Kolom pesan kosong. | Sistem mencegah pengiriman pesan kosong. | Tombol kirim tidak dapat ditekan ketika kolom pesan kosong. | Berhasil |
| UC08-TC08 | KF13, KF14 | Alternatif 2 – Pengiriman pesan gagal oleh Pengguna | 1. Pengguna membuka halaman chat. 2. Pengguna memutus koneksi internet. 3. Pengguna mencoba mengirim pesan kepada Penyedia Jasa. | Pesan teks ketika koneksi internet terputus. | Sistem gagal mengirim pesan dan menampilkan indikator bahwa pesan tidak terkirim. | Sistem menampilkan indikator pesan belum terkirim. | Berhasil |

### 4.4.9 Use Case Melakukan Pemesanan Jasa (UC09)

**ID Use Case:** UC09  
**Nama Use Case:** Melakukan Pemesanan Jasa

Tabel 4.4.9. Hasil Pengujian Use Case [UC09]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC09-TC01 | KF17, KF18 | Normal – Memilih jasa dan mengisi formulir pemesanan | 1. Pengguna Jasa memilih salah satu jasa. 2. Pengguna Jasa menekan tombol pesan. 3. Sistem menampilkan formulir pemesanan. 4. Pengguna Jasa mengisi formulir dengan data valid dan mengirimkannya. | Jasa yang dipilih dan data formulir pemesanan yang valid. | Sistem menerima data pemesanan dan membuat pesanan baru. | Formulir pemesanan berhasil dikirim dan sistem melanjutkan proses pemesanan. | Berhasil |
| UC09-TC02 | KF18, KF19 | Normal – Memilih metode pembayaran | 1. Pengguna Jasa diarahkan ke halaman pembayaran. 2. Pengguna Jasa melihat detail pesanan dan metode pembayaran yang tersedia. 3. Pengguna Jasa memilih salah satu metode pembayaran. | Metode pembayaran yang dipilih. | Sistem menampilkan detail pembayaran dan menyediakan pilihan metode pembayaran digital. | Halaman pembayaran menampilkan detail pesanan dan pilihan metode pembayaran. | Berhasil |
| UC09-TC03 | KF20 | Normal – Pembayaran berhasil | 1. Pengguna Jasa melakukan pembayaran menggunakan metode yang dipilih. 2. Sistem memvalidasi status transaksi pembayaran. | Konfirmasi pembayaran berhasil. | Sistem memvalidasi pembayaran dan menampilkan notifikasi bahwa pembayaran berhasil. | Sistem menampilkan informasi bahwa pembayaran berhasil. | Berhasil |
| UC09-TC04 | KF17, KF18 | Alternatif 1 – Formulir pemesanan tidak lengkap | 1. Pengguna Jasa memilih jasa dan membuka formulir pemesanan. 2. Pengguna Jasa mengosongkan salah satu atau beberapa kolom wajib. 3. Pengguna Jasa mencoba mengirim formulir. | Formulir pemesanan dengan data wajib yang belum lengkap. | Sistem menolak pengiriman formulir dan menampilkan pesan validasi pada kolom yang wajib diisi. | Sistem menampilkan pesan validasi ketika formulir dikirim dengan data yang tidak lengkap. | Berhasil |
| UC09-TC05 | KF20 | Alternatif 2 – Pembayaran gagal | 1. Pengguna Jasa membuka halaman pembayaran. 2. Pengguna Jasa memilih metode pembayaran. 3. Pengguna Jasa melakukan pembayaran dengan kondisi transaksi gagal. | Transaksi pembayaran dengan status gagal. | Sistem mendeteksi kegagalan transaksi dan menampilkan pesan bahwa pembayaran gagal. | Sistem menampilkan informasi kegagalan pembayaran. | Berhasil |

### 4.4.10 Use Case Melakukan Konfirmasi Pesanan (UC10)

**ID Use Case:** UC10
**Nama Use Case:** Melakukan Konfirmasi Pesanan

Tabel 4.4.10. Hasil Pengujian Use Case [UC10]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC10-TC01 | KF21 | Normal – Penyedia Jasa menerima notifikasi pesanan baru | 1. Pengguna Jasa membuat pesanan. 2. Penyedia Jasa membuka notifikasi pesanan baru. | Pesanan baru dari Pengguna Jasa. | Sistem mengirimkan notifikasi pesanan baru kepada Penyedia Jasa. | Notifikasi pesanan baru diterima dan ditampilkan pada akun Penyedia Jasa tapi pesan notifikasi tidak sesuai. | Belum sepenuhnya sesuai |
| UC10-TC02 | KF21, KF22 | Normal – Penyedia Jasa melihat pesanan masuk | 1. Penyedia Jasa membuka halaman daftar pesanan masuk. 2. Penyedia Jasa memilih salah satu pesanan. | Data pesanan baru. | Sistem menampilkan daftar pesanan masuk beserta detail pesanan yang perlu dikonfirmasi. | Pesanan ditampilkan pada daftar pesanan masuk, tetapi statusnya langsung menjadi Diproses. | Tidak Sesuai |
| UC10-TC03 | KF22 | Normal – Penyedia Jasa melakukan konfirmasi pesanan | 1. Penyedia Jasa membuka detail pesanan. 2. Penyedia Jasa mencari opsi untuk menerima atau menolak pesanan. | Pesanan dengan status Diproses. | Sistem menyediakan tombol Terima dan Tolak agar Penyedia Jasa dapat menentukan keputusan. | Tidak tersedia tombol Terima maupun Tolak pada halaman detail pesanan. | Tidak Berhasil |
| UC10-TC04 | KF23 | Alternatif 1 – Penyedia Jasa menolak pesanan | 1. Penyedia Jasa membuka detail pesanan. 2. Penyedia Jasa mencoba melakukan penolakan pesanan. | Pesanan baru yang ingin ditolak. | Sistem memperbarui status pesanan menjadi ditolak dan memproses pengembalian dana kepada pembeli. | Penolakan pesanan tidak dapat dilakukan karena tidak tersedia fitur Tolak. | Tidak Dapat Diuji |


### 4.4.11 Use Case Menyerahkan Hasil Pekerjaan

**ID Use Case:** UC11
**Nama Use Case:** Menyerahkan Hasil Pekerjaan

Tabel 4.4.11. Hasil Pengujian Use Case [UC11]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC11-TC01 | KF25 | Normal | Asumsikan Sudah Login <br> 1. Buka Halaman Pengumpulan <br> 2. Tekan Tombol Kumpulkan Hasil <br> 3. Memunculkan Form Pengumpulan <br> 4. Tuliskan Deskripsi Hasil, Unggah Berkas dan/atau Lampiran <br> 5. Tekan Tombol Kumpulkan <br> 6. Deliverables Berhasil dikumpulkan <br> Note : Ini juga berlaku untuk revisi | Deskripsi dan Link serta gambar |1. Halaman Pengumpulan Terbuka dengan Nama Jasa, dan brief yang ada <br> 2. Tombol berhasil membuka form pengumpulan <br> 3. Penyedia Jasa Dapat Mengunggah Jasa Melalui link atau gambar <br> 4. Tombol Kirim Mentrigger penguploadan dan upload dan memberi notif selesai ke penyedia jasa | Alur pengerjaan sudah sesuai, namun brief hilang dari tampilan halaman pengumpulan awal, notif tidak terkirim | Pass dengan masalah UI kurang lengkap, fail pengiriman notif (untuk pertama kali kirim) |
| UC11-TC02 | KF25 | Alternatif (File dan Link Kosong) | *Asumsikan Sudah Login <br> 1. Buka Halaman Pengumpulan <br> 2. Tekan Tombol Kumpulkan Hasil <br> 3. Memunculkan Form Pengumpulan <br> 4. Tuliskan Deskripsi Hasil, Tanpa Unggah Berkas dan/atau Lampiran <br> 5. Tekan Tombol Kumpulkan <br> 6. Menampilkan Pesan Error | Deskripsi Deliverables saja | Menampilkan Pesan Error | Berhasil Menampilkan Pesan Error | Pass |
| UC11-TC03 | KF25 | Alternatif (File Terlalu Besar)  | *Asumsikan Sudah Login <br> 1. Buka Halaman Pengumpulan <br> 2. Tekan Tombol Kumpulkan Hasil <br> 3. Memunculkan Form Pengumpulan <br> 4. Tuliskan Deskripsi Hasil, Tanpa Unggah Berkas dan/atau Lampiran <br> 5. Tekan Tombol Kumpulkan <br> 6. Menampilkan Pesan Error | Deskripsi Deliverables dan File > 10MB | Menampilkan Pesan Error | Berhasil Menampilkan Pesan Error | Pass |

### 4.4.12 Use Case Mengonfirmasi Hasil Pekerjaan

**ID Use Case:** UC12
**Nama Use Case:** Mengonfirmasi Hasil Pekerjaan

Tabel 4.4.12. Hasil Pengujian Use Case [UC12]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC12-TC01 | KF26, KF27, KF28 | Normal | Asumsikan Sudah Login dan Memiliki Pesanan <br> 1. Buka Halaman Pesanan Saya <br> 2. Tekan Konfirmasi Selesai <br> 3. Pembayaran Diproses dan Dikirim Ke Penyedia Jasa <br> 4. Muncul Riwayat Transaksi <br> 5. Kembali Ke Daftar Pesanan Saya | Prasyarat : sudah login, dan sudah ada pesanan yang ingin diselesaikan | Pesanan ditandai selesai dan bisa dibuka lagi, pembayaran dilaksanakan, dan notif selesai ke penyedia jasa | Pesan ditandai selesai, notif terkirim, tapi pesanan tidak dapat dibuka lagi | Pass untuk penyelesaiannya, namun fail untuk membuka pesanan nya lagi karena lupa meletakkan lihat pesanan untuk bisa ditrigger di daftar pesanan saya |
| UC12-TC02 | KF26, KF27, KF28 | Normal | Asumsikan Sudah Login dan Memiliki Pesanan <br> 1. Buka Halaman Pesanan Saya <br> 2. Tekan Ajukan Revisi <br> 3. Mengisi Form Pengajuan Revisi (Kuota Revisi Masih Tersedia) <br> Mengisi Deskripsi, Lampiran, Maupun Pesan <br> 4. Status Pesanan Diedit menjadi menunggu revisi dan kuota revisi berkurang |  Prasyarat : Login, dan sudah memiliki jasa yang sudah memiliki deliverables/pengumpulan <br> Mengisi Form Revisi dan Memiliki Kuota Revisi Terseda | Status Pesanan berubah, dan Penyedia Jasa diminta untuk mengumpulkan revisi dan memberi notif selesai ke penyedia jasa | Berhasil seesuai hasil yang diharapkan | Pass |
| UC12-TC03 | KF26, KF27, KF28 | Alternatif (Kuota Revisi Habis) | Asumsikan Sudah Login dan Memiliki Pesanan <br> 1. Buka Halaman Pesanan Saya <br> 2. Tekan Ajukan Revisi <br> 3. Muncul Pesan Penolakan <br> 4. Meminta Untuk konfirmasi sebagai selesai | sudah login, dan sudah ada pesanan yang dianggap selesai | Mengeluarkan Pesan Error atau  tidak bisa mengajukan revisi | Hanya tidak bisa mengajukan revisi (tidak ada pesan error) | Pass |
| UC12-TC03 | KF26, KF27, KF28 | Alternatif (Revisi Sudah Lewat) | Asumsikan Sudah Login dan Memiliki Pesanan <br> 1. Buka Halaman Pesanan Saya <br> 2. Tekan Ajukan Revisi <br> 3. Muncul Pesan Penolakan Karena <br> 4. Meminta Untuk konfirmasi sebagai selesai | sudah login, dan sudah ada pesanan yang ingin direvisi | Mengeluarkan Pesan Error atau  tidak bisa mengajukan revisi | Tidak diimplementasikan | Fail : Kelewatan Untuk Diimplementasikan |


### 4.4.13 Use Case Melaporkan Pengguna Lain

**ID Use Case:** UC13
**Nama Use Case:** Melaporkan Pengguna Lain

Tabel 4.4.13. Hasil Pengujian Use Case [UC13]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC13-TC01 | KF29 | Normal | Asumsikan Pengguna Jasa Sudah Login <br> 1. Masuk ke dalam Halaman Pengumpulan <br> 2. Menekan Tombol Laporkan Penyedia Jasa <br> 3. Masuk ke dalam formulir pengisian Laporan <br> 4. Pengguna Mengisi Field Laporan dengan Lengkap <br> 5. Pengguna Menekan Tombol Kirim Laporan <br> 6. Menampilkan Halaman Tiket Laporan | Prasyarat : Login, dan sudah memiliki jasa yang sudah memiliki deliverables/pengumpulan. Mengisi Form Laporan, mulai dari bukti hingga deskripsi | Tiket Berhasil dibuat dan menampilkan tiket | Tiket Berhasil dibuat  | Pass |
| UC13-TC02 | KF29 | Alternatif 1: Field Laporan (Deskripsi/Kategori/Bukti Tak Lengkap) | Asumsikan Pengguna Jasa Sudah Login <br> 1. Masuk ke dalam Halaman Pengumpulan <br> 2. Menekan Tombol Laporkan Penyedia Jasa <br> 3. Masuk ke dalam formulir pengisian Laporan <br> 4. Pengguna Tidak Mengisi Field Laporan  <br> 5. Pengguna Menekan Tombol Kirim Laporan <br> 6. Muncul Error  |  Prasyarat : Login, dan sudah memiliki jasa yang sudah memiliki deliverables/pengumpulan. Tidak mengisi field laporan namun mengirim | Muncul Pesan Error | Berhasil memunculkan pesan error | Pass |

### 4.4.14 Use Case Memberikan Ulasan terhadap Jasa yang Dipesan

**ID Use Case:** UC14
**Nama Use Case:** Memberikan Ulasan terhadap Jasa yang Dipesan

Tabel 4.4.13. Hasil Pengujian Use Case [UC14]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC14-TC01 | KF30, KF31 | Normal | 1. Menekan Tombol Buat Ulasan dari Halaman Pengumpulan <br> 2. Muncul Form pengisian Ulasan <br> 3. Mengisi Ulasan Sesuai Field yang disediakan (Minimal mengirimkan rating), komentar opsional <br> 4. tekan kirim ulasan <br> 5. Hasil rating muncul  | Prasyarat : sudah login, dan sudah ada pesanan yang dianggap selesai <br> menekan tombol ulasan dan mengisi form ulasan | Ulasan Pengguna terupdate  | Pass |
| UC14-TC02 | KF30, KF31 | Alternatif 1: Ulasan Gagal Dibuat karena field tidak lengkap | 1. Menekan Tombol Buat Ulasan dari Halaman Pengumpulan <br> 2. Muncul Form pengisian Ulasan <br> 3. Mengosongkan Form Pengisian <br> 4. tekan kirim ulasan <br> 5. Muncul Error | Prasyarat : sudah login, dan sudah ada pesanan yang dianggap selesai <br> menekan tombol ulasan dan tidak mengisi form ulasan | Muncul error | Muncul error | Pass |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KNF01-TC01 | KNF01 | Portability | Tampilan adaptif pada viewport 320 px, 768 px, dan 1280 px tanpa horizontal scrollbar | Pengujian menggunakan Chrome DevTools pada viewport 320 px, 768 px, dan 1280 px | 320 px: terdapat elemen yang saling bertumpuk; 768 px: beberapa elemen masih mengalami tumpang tindih; 1280 px: tampilan berjalan dengan baik | Belum sepenuhnya sesuai |
| KNF02-TC01 | KNF02 | *Response time* | Response time pencarian dan filter pada 1.000 listing jasa <= 3 detik (3.000 ms) untuk minimal 95% percobaan | Pengukuran `performance.now()` di Node.js v24.19.0 (20 kali pengulangan pada 1.000 listing dengan filter keyword, kategori, rentang harga, rating minimum, dan limit 20) pada logika filter dan sort pencarian (ekuivalen `LayananPencarian.saringDanUrutkan`) | Rata-rata waktu proses 0,259 ms (min 0,093 ms, maks 1,052 ms); 20 dari 20 percobaan (100%) selesai jauh di bawah 3.000 ms | Pass |
| KNF04-TC01 | KNF04 | *Reliability* | 100% transaksi yang mengalami kegagalan di tengah proses di-rollback ke state awal (`MENUNGGU_PEMBAYARAN`) dengan 0 data integrity loss dan 0 duplicate transaction | Simulasi gagal insert `riwayat_transaksi` di tengah `PengontrolTransaksi.prosesPembayaranDummy()`, pengecekan guard `.neq('status_pembayaran', 'LUNAS')`, serta mekanisme `AbortController` timeout di `src/lib/api.ts` lewat Vitest (`src/test/transaksi.test.ts`) | Saat insert `riwayat_transaksi` gagal setelah `pesanan` sempat ter-update, compensating rollback mengembalikan `pesanan` ke `MENUNGGU_PEMBAYARAN` (`id_metode_pembayaran: null`); guard menolak 100% duplicate payment request | Pass |
| KNF06-TC01 | KNF06 | Security | Password tersimpan sebagai hash, bukan plain-text | Inspeksi melalui tabel auth.user dengan query sql di table editor supabase | Password tersimpan sebagai hash | Pass |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| C22-UT01 – C22-UT12,<br>C25-UT01 – C25-UT12,<br>C26-UT01 – C26-UT09,<br>C31-UT01 – C31-UT12,<br>C32-UT01 – C32-UT12,<br>serta C22, C25, C26, C31, C32 (coverage) | Keluaran Vitest v5.1.0 (`20 passed (20)`, `678 passed (678)`) dan laporan `@vitest/coverage-v8` (`bookmark.service.ts` 100% line / 83,56% branch; `chat.service.ts` 100% line / 90,19% branch; `notifikasi.service.ts` 100% line / 92,30% branch; `pesanan.service.ts` 94,73% line / 84,09% branch; `transaksi.service.ts` 97,82% line / 80,90% branch):<br>![Output Vitest dan Coverage](./assets/danesh/vitest-coverage.png) |
| C41-UT01 - C41-UT03 |  <br> <img alt="Pengujian" src="../M10/assets/C41-T1.png" width="70%"> |
| C41-UT04 - C41-UT07 | <br> <img alt="Pengujian" src="../M10/assets/C41-T2.png" width="70%">|
| C41-UT09 - C41-UT11 | <br> <img alt="Pengujian" src="../M10/assets/C41-T3.png" width="70%"> |
| C41-UT12 - C41-UT23 |  <br> <img alt="Pengujian" src="../M10/assets/C41-T4.png" width="70%"> |
| C41-UT24 - C41-UT31 |   <br> <img alt="Pengujian" src="../M10/assets/C41-T5.png" width="70%"> |
| <a id="bukti-c41"></a>C41 Coverage |  <br> <img alt="Pengujian" src="../M10/assets/C41-Coverage.png" width="70%"> |
| C45-UT01 - C45-UT06 |  <br> <img alt="Pengujian" src="../M10/assets/C45-T1.png" width="70%"> |
| C45-UT07 - C45-U08 |  <br> <img alt="Pengujian" src="../M10/assets/C45-T2.png" width="70%">|
| C45-UT09 - C45-UT11 |  <br> <img alt="Pengujian" src="../M10/assets/C45-T3.png" width="70%"> |
| C45-UT12 - C45-UT13 |  <br> <img alt="Pengujian" src="../M10/assets/C45-T4.png" width="70%"> |
| C45-UT14 - C45-UT15 |  <br> <img alt="Pengujian" src="../M10/assets/C45-T5.png" width="70%"> |
| <a id="bukti-c45"></a>C45 Coverage | <br> <img alt="Pengujian" src="../M10/assets/C45-Coverage.png" width="70%"> |
| C48-UT01 - C48-UT04 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T1.png" width="70%"> |
| C48-UT05 - C48-U09 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T2.png" width="70%">|
| C48-UT10 - C48-UT13 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T3.png" width="70%"> |
| C48-UT14 - C48-UT15 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T4.png" width="70%"> |
| C48-UT16 - C48-UT19 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T5.png" width="70%"> |
| C48-UT20 - C48-UT22 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T6.png" width="70%"> |
| C48-UT23 - C48-U25 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T7.png" width="70%">|
| C48-UT26 - C48-UT31 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T8.png" width="70%"> |
| C48-UT33 - C48-UT35 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T9.png" width="70%"> |
| C48-UT36 - C48-UT37 |  <br> <img alt="Pengujian" src="../M10/assets/C48-T10.png" width="70%"> |
| <a id="bukti-c48"></a>C48 Coverage | <br> <img alt="Pengujian" src="../M10/assets/C48-Coverage.png" width="70%"> |
| C51-UT01 - C51-UT06 |  <br> <img alt="Pengujian" src="../M10/assets/C51-T1.png" width="70%"> |
| C51-UT07 - C51-U011 |  <br> <img alt="Pengujian" src="../M10/assets/C51-T2.png" width="70%">|
| C51-UT12 - C51-UT13 |  <br> <img alt="Pengujian" src="../M10/assets/C51-T3.png" width="70%"> |
| C51-UT14 - C51-UT15 |  <br> <img alt="Pengujian" src="../M10/assets/C51-T4.png" width="70%"> |
| C51-UT16 - C51-UT17 |  <br> <img alt="Pengujian" src="../M10/assets/C51-T5.png" width="70%"> |
| <a id="bukti-c51"></a>C51 Coverage | <br> <img alt="Pengujian" src="../M10/assets/C51-Coverage.png" width="70%"> |
| C54-UT01 - C54-UT05 |  <br> <img alt="Pengujian" src="../M10/assets/C54-T1.png" width="70%"> |
| C54-UT06 - C54-U09 |  <br> <img alt="Pengujian" src="../M10/assets/C54-T2.png" width="70%">|
| C54-UT10 - C54-UT13 |  <br> <img alt="Pengujian" src="../M10/assets/C54-T3.png" width="70%"> |
| C54-UT14 - C54-UT19 |  <br> <img alt="Pengujian" src="../M10/assets/C54-T4.png" width="70%"> |
| C54-UT20 - C54-UT24 |  <br> <img alt="Pengujian" src="../M10/assets/C54-T5.png" width="70%"> |
| C54-UT25 - C54-UT26 |  <br> <img alt="Pengujian" src="../M10/assets/C54-T6.png" width="70%"> |
| C54-UT27 - C54-UT30 |  <br> <img alt="Pengujian" src="../M10/assets/C54-T7.png" width="70%"> |
| C54-UT31 - C54-UT35 |  <br> <img alt="Pengujian" src="../M10/assets/C54-T8.png" width="70%"> |
| <a id="bukti-c54"></a>C54 Coverage | <br> <img alt="Pengujian" src="../M10/assets/C41-Coverage.png" width="70%"> |
| UC11-T01 | <br> <img alt="Pengujian" src="../M10/assets/UC11-T1.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC11-T3.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC11-T4.png" width="70%"> <br> Sisi Pengguna : <br> <img alt="Pengujian" src="../M10/assets/UC11-Hasil.png" width="70%"> <br> Pengumpulan Revisi <br> <img alt="Pengujian" src="../M10/assets/UC11-T4.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC11-T3.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC12_2_3.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC11-HasilRevisi.png" width="70%">|
| UC11-T02 | <br> <img alt="Pengujian" src="../M10/assets/UC11-T1.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC11-T3-1.png" width="70%">  |
| UC11-T03 | <br> <img alt="Pengujian" src="../M10/assets/UC11-T1.png" width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/UC11-Kebesaran.png" width="70%"> |
| UC12-T01 | <br> <img alt="Pengujian" src="../M10/assets/UC12-T1.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC14-Init.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC12-Cair.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC12-Selesai1.png" <br>  |
| UC12-T02 | <br> <img alt="Pengujian" src="../M10/assets/UC12-T1.png" width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/UC12-FormRevisi.png" width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/UC12-2_2.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC12_2_3.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC12-.png"  width="70%"> <br> Penangan Error <br> <br> <img alt="Pengujian" src="../M10/assets/UC12-T2.png"  width="70%"> |
| UC12-T03 | <br> <img alt="Pengujian" src="../M10/assets/UC12-RevisiAbis.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC14-Init.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC12-Cair.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC12-Selesai1.png"  width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/UC12-.png"  width="70%"> |
| UC13-T01 | <br> <img alt="Pengujian" src="../M10/assets/UC12-T1.png" width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/UC13-4.png" width="70%">  |
| UC13-T02 | <br> <img alt="Pengujian" src="../M10/assets/UC12-T1.png" width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/UC13-2.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC13-3.png" width="70%">  |
| UC14-T01 | <br> <img alt="Pengujian" src="../M10/assets/UC14-Init.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC14-Awal.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC14-T1-2.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC14-T1-3.png" width="70%">   |
| UC14-T02 | <br> <img alt="Pengujian" src="../M10/assets/UC14-Init.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC14-Awal.png" width="70%"> <br> <img alt="Pengujian" src="../M10/assets/UC14-UC14-GagalTanpaBIntang.png" width="70%"> |
| KNF06-TC01 | <img alt="Pengujian" src="../M10/assets/KNF06-T1.png" width="70%"> |
| INT-TC29 – INT-TC30 | <img alt="Bukti Pengujian Integrasi I-11" src="../M10/assets/I11.png" width="70%"> |
| INT-TC31 – INT-TC32 | <img alt="Bukti Pengujian Integrasi I-12" src="../M10/assets/I12.png" width="70%"> |
| INT-TC33 – INT-TC34 | <img alt="Bukti Pengujian Integrasi I-13" src="../M10/assets/I13.png" width="70%"> |
| INT-TC35 – INT-TC36 | <img alt="Bukti Pengujian Integrasi I-14" src="../M10/assets/I14.png" width="70%"> |
| INT-TC37 – INT-TC38 | <img alt="Bukti Pengujian Integrasi I-15" src="../M10/assets/I15.png" width="70%"> |
| INT-TC39 – INT-TC40 | <img alt="Bukti Pengujian Integrasi I-16" src="../M10/assets/I16.png" width="70%"> |
| INT-TC41 – INT-TC42 | <img alt="Bukti Pengujian Integrasi I-17" src="../M10/assets/I17.png" width="70%"> |
| INT-TC43 – INT-TC45 | <img alt="Bukti Pengujian Integrasi I-18" src="../M10/assets/I18.png" width="70%"> |
| INT-TC46 – INT-TC47 | <img alt="Bukti Pengujian Integrasi I-19" src="../M10/assets/I19.png" width="70%"> |
| UC01-TC01 | <br> <img alt="Pengujian UC01-TC01" src="../M10/assets/UC01-TC01.png" width="100%"> <br> <img alt="Pengujian UC01-TC01" src="../M10/assets/zRegisBerhasil.png" width="100%">|
| UC01-TC02 | <br> <img alt="Pengujian UC01-TC02" src="../M10/assets/UC01-TC02.png" width="100%"> <br> <img alt="Pengujian UC01-TC01" src="../M10/assets/zRegisBerhasil.png" width="100%">|
| UC01-TC03 | <br> <img alt="Pengujian UC01-TC03" src="../M10/assets/UC01-TC03.png" width="100%"> |
| UC02-TC01 | <br> <img alt="Pengujian UC02-TC01" src="../M10/assets/UC02-TC01.png" width="100%"> <br> <img alt="Pengujian UC02-TC01" src="../M10/assets/UC02-TC01-1.png" width="100%">|
| UC02-TC02 | <br> <img alt="Pengujian UC02-TC02" src="../M10/assets/UC02-TC02.png" width="100%"> <br> <img alt="Pengujian UC02-TC01" src="../M10/assets/UC02-TC02-1.png" width="100%">|
| UC02-TC03 | <br> <img alt="Pengujian UC02-TC03" src="../M10/assets/UC02-TC03.png" width="100%"> |
| UC02-TC04 | <br> <img alt="Pengujian UC02-TC04" src="../M10/assets/UC02-TC04.png" width="100%"> |
| UC03-TC01| <br> <img alt="Pengujian UC03-TC01" src="../M10/assets/UC03-TC01.png" width="100%"> |
| UC03-TC02| <br> <img alt="Pengujian UC03-TC02" src="../M10/assets/UC03-TC02.png" width="100%"> |
| UC03-TC03| <br> <img alt="Pengujian UC03-TC03" src="../M10/assets/UC03-TC03.png" width="100%"> |
| UC04-TC01 | Notifikasi sukses unggah jasa pada `/penyedia/upload-jasa`:<br>![UC04-TC01 Sukses Unggah Jasa](./assets/danesh/uc04-tc01.png) |
| UC04-TC02 | Validasi error pada field wajib dan form `/penyedia/upload-jasa`:<br>![UC04-TC02 Validasi Bagian Atas](./assets/danesh/uc04-tc02-1.png)<br>![UC04-TC02 Validasi Berkas](./assets/danesh/uc04-tc02-2.png) |
| UC05-TC01 | Pencarian berdasarkan keyword pada `/pengguna/pencarian`:<br>![UC05-TC01 Pencarian Logo](./assets/danesh/uc05-tc01-1.png)<br>![UC05-TC01 Pencarian Banner](./assets/danesh/uc05-tc01-2.png) |
| UC05-TC02 | Penerapan filter harga dan rating pada `/pengguna/pencarian`:<br>![UC05-TC02 Filter Harga](./assets/danesh/uc05-tc02-1.png)<br>![UC05-TC02 Filter Rating](./assets/danesh/uc05-tc02-2.png) |
| UC05-TC03 | Respons JSON endpoint komparasi `GET /api/jasa?compare=...`:<br>![UC05-TC03 Komparasi Jasa](./assets/danesh/uc05-tc03.png) |
| UC05-TC04 | Tampilan empty state saat jasa tidak ditemukan:<br>![UC05-TC04 Jasa Tidak Ditemukan](./assets/danesh/uc05-tc04.png) |
| UC05-TC05 | Pesan validasi saat keyword kurang dari 3 karakter:<br>![UC05-TC05 Keyword Kurang dari 3 Karakter](./assets/danesh/uc05-tc05.png) |
| UC06-TC01 | Halaman detail jasa pada `/jasa/[id]` beserta informasi penyedia dan ulasan:<br>![UC06-TC01 Detail Jasa Atas](./assets/danesh/uc06-tc01-1.png)<br>![UC06-TC01 Detail Jasa Bawah](./assets/danesh/uc06-tc01-2.png) |
| UC06-TC02 | Tampilan status tidak ditemukan pada `/jasa/00000000-0000-0000-0000-000000000000`:<br>![UC06-TC02 Jasa Tidak Ditemukan](./assets/danesh/uc06-tc02.png) |
| UC07-TC01 | Ikon bookmark aktif dan notifikasi "Bookmark berhasil disimpan":<br>![UC07-TC01 Simpan Bookmark](./assets/danesh/uc07-tc01.png) |
| UC07-TC02 | Daftar jasa tersimpan pada `/pengguna/bookmark`:<br>![UC07-TC02 Daftar Bookmark](./assets/danesh/uc07-tc02.png) |
| UC07-TC03 | Penghapusan bookmark pada `/pengguna/bookmark`:<br>![UC07-TC03 Hapus Bookmark](./assets/danesh/uc07-tc03.png) |
| UC07-TC04 | Pesan error saat guest mengklik ikon bookmark:<br>![UC07-TC04 Bookmark Tanpa Login](./assets/danesh/uc07-tc04.png) |
| KNF02-TC01 | Output terminal pengukuran `performance.now()` pada 1.000 listing (20 percobaan, rata-rata 0,259 ms, maks 1,052 ms):<br>![KNF02-TC01 Pengukuran Response Time](./assets/danesh/knf02-tc01.png) |
| KNF04-TC01 | Keluaran `npx vitest run test/transaksi.test.ts` (20/20 test passed, termasuk simulasi compensating rollback dan penolakan duplicate payment):<br>![KNF04-TC01 Pengujian Reliability Transaksi](./assets/danesh/knf04-tc01.png) |
| UC08-TC01 | <br> <img alt="Pengujian UC08-TC01" src="../M10/assets/UC08-TC01.png" width="100%"> |
| UC08-TC02 | <br> <img alt="Pengujian UC08-TC02" src="../M10/assets/UC08-TC02.png" width="100%"> |
| UC08-TC03 | <br> <img alt="Pengujian UC08-TC03" src="../M10/assets/UC08-TC03.png" width="1000%"> |
| UC08-TC04 | <br> <img alt="Pengujian UC08-TC04" src="../M10/assets/UC08-TC04.png" width="100%"> |
| UC08-TC05 | <br> <img alt="Pengujian UC08-TC05" src="../M10/assets/UC08-TC05.png" width="100%"> |
| UC08-TC06 | <br> <img alt="Pengujian UC08-TC06" src="../M10/assets/UC08-TC06.png" width="100%"> |
| UC08-TC07 | <br> <img alt="Pengujian UC08-TC07" src="../M10/assets/UC08-TC07.png" width="100%"> |
| UC08-TC08 | <br> <img alt="Pengujian UC08-TC08" src="../M10/assets/UC08-TC08.png" width="100%"> |
| UC09-TC01 | <br> <img alt="Pengujian UC09-TC01" src="../M10/assets/UC09-TC01-1.png" width="100%"> <br> <img alt="Pengujian UC09-TC01" src="../M10/assets/UC09-TC01-2.png" width="100%"> |
| UC09-TC02 | <br> <img alt="Pengujian UC09-TC02" src="../M10/assets/UC09-TC02-1.png" width="100%"> <br> <img alt="Pengujian UC09-TC02" src="../M10/assets/UC09-TC02-2.png" width="100%"> |
| UC09-TC03 | <br> <img alt="Pengujian UC09-TC03" src="../M10/assets/UC09-TC03.png" width="100%"> |
| UC09-TC04 | <br> <img alt="Pengujian UC09-TC04" src="../M10/assets/UC09-TC04.png" width="100%"> |
| UC09-TC05 | <br> <img alt="Pengujian UC09-TC05" src="../M10/assets/UC09-TC05.png" width="100%"> |
| UC10-TC01 | <br> <img alt="Pengujian UC10-TC01" src="../M10/assets/UC10-TC01-1.png" width="100%"> <br> <img alt="Pengujian UC10-TC01" src="../M10/assets/UC10-TC01-2.png" width="100%"> |
| UC10-TC02 | <br> <img alt="Pengujian UC10-TC02" src="../M10/assets/UC10-TC02.png" width="100%"> |
| UC10-TC03 | <br> <img alt="Pengujian UC10-TC03" src="../M10/assets/UC10-TC03-TC04.png" width="100%"> |
| UC10-TC04 | <br> <img alt="Pengujian UC10-TC04" src="../M10/assets/UC10-TC03-TC04.png" width="100%"> |
| KNF01-TC01 | Viewport 320 px (Smartphone) <br> <img alt="Pengujian viewport 320 px" src="../M10/assets/KNF01-320.png" width="100%"> <br><br> Viewport 768 px (Tablet) <br> <img alt="Pengujian viewport 768 px" src="../M10/assets/KNF01-768.png" width="100%"> <br><br> Viewport 1280 px (Laptop) <br> <img alt="Pengujian viewport 1280 px" src="../M10/assets/KNF01-1280.png" width="100%"> |
<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KF05 | KNF01 | UC04 | C02 - PenyediaJasa<br>C11 - LayananUploadFile<br>C12 - Jasa<br>C13 - HalamanUploadJasa<br>C14 - JasaController | `src/app/penyedia/upload-jasa/page.tsx`<br>`src/app/jasa/tambah/page.tsx`<br>`src/services/jasa.service.ts`<br>`src/app/api/jasa/route.ts`<br>`src/app/api/jasa/helper.ts`<br>`src/services/storage/*` | UC04-TC01, UC04-TC02 | - |
| KF06 | KNF01, KNF02 | UC05 | C03 - PenggunaJasa<br>C12 - Jasa<br>C15 - HalamanPencarian<br>C16 - HasilPencarian<br>C17 - LayananPencarian | `src/app/pengguna/pencarian/page.tsx`<br>`src/app/jasa/page.tsx`<br>`src/components/elemen/CardJasa.tsx`<br>`src/services/pencarian.service.ts`<br>`src/app/api/jasa/route.ts` | UC05-TC01, UC05-TC04, UC05-TC05 | KNF02-TC01 |
| KF07 | KNF01, KNF02 | UC05 | C03 - PenggunaJasa<br>C12 - Jasa<br>C15 - HalamanPencarian<br>C16 - HasilPencarian<br>C17 - LayananPencarian | `src/app/pengguna/pencarian/page.tsx`<br>`src/services/pencarian.service.ts`<br>`src/app/api/jasa/route.ts` | UC05-TC02 | KNF02-TC01 |
| KF08 | KNF01 | UC06 | C02 - PenyediaJasa<br>C03 - PenggunaJasa<br>C12 - Jasa<br>C14 - JasaController<br>C19 - HalamanDetailJasa<br>C46 - Ulasan | `src/app/jasa/[id]/page.tsx`<br>`src/services/jasa.service.ts`<br>`src/app/api/jasa/[id]/route.ts`<br>`src/services/penyedia.service.ts`<br>`src/services/ulasan.service.ts` | UC06-TC01, UC06-TC02 | - |
| KF09 | KNF01 | UC07 | C03 - PenggunaJasa<br>C12 - Jasa<br>C20 - Bookmark<br>C21 - HalamanBookmark<br>C22 - PengontrolBookmark | `src/app/pengguna/pencarian/page.tsx`<br>`src/app/jasa/[id]/page.tsx`<br>`src/app/pengguna/bookmark/page.tsx`<br>`src/services/bookmark.service.ts`<br>`src/app/api/bookmark/route.ts` | UC07-TC01, UC07-TC04 | C22-UT01–C22-UT03, C22-UT10–C22-UT12 |
| KF10 | KNF01 | UC07 | C03 - PenggunaJasa<br>C20 - Bookmark<br>C21 - HalamanBookmark<br>C22 - PengontrolBookmark | `src/services/bookmark.service.ts`<br>`src/app/api/bookmark/route.ts`<br>`src/lib/client/bookmark.ts` | UC07-TC01, UC07-TC04 | C22-UT01–C22-UT03, C22-UT10–C22-UT12 |
| KF11 | KNF01 | UC07 | C03 - PenggunaJasa<br>C20 - Bookmark<br>C21 - HalamanBookmark<br>C22 - PengontrolBookmark | `src/app/pengguna/bookmark/page.tsx`<br>`src/app/bookmark/page.tsx`<br>`src/services/bookmark.service.ts`<br>`src/app/api/bookmark/route.ts` | UC07-TC02 | C22-UT07–C22-UT09, C22-UT11 |
| KF12 | KNF01 | UC07 | C03 - PenggunaJasa<br>C20 - Bookmark<br>C21 - HalamanBookmark<br>C22 - PengontrolBookmark | `src/app/pengguna/bookmark/page.tsx`<br>`src/services/bookmark.service.ts`<br>`src/app/api/bookmark/route.ts` | UC07-TC03 | C22-UT04–C22-UT06, C22-UT10 |
| KF13 | KNF01 | UC08 | C23 - ChatRoom<br>C24 - HalamanChat<br>C25 - LayananPesanInstan | `src/app/chat/page.tsx`<br>`src/services/chat.service.ts`<br>`src/app/api/chat/route.ts`<br>`src/app/api/chat/[id_chatroom]/route.ts` | - | C25-UT04–C25-UT06, C25-UT10–C25-UT12 |
| KF14 | KNF01 | UC08 | C25 - LayananPesanInstan<br>C26 - LayananNotifikasiChat<br>C56 - notifikasi | `src/services/chat.service.ts`<br>`src/services/notifikasi.service.ts`<br>`src/app/api/notifikasi/route.ts`<br>`src/components/ui/notifikasi.tsx` | - | C25-UT10, C25-UT11, C26-UT01–C26-UT09 |
| KF15 | KNF01 | UC08 | C23 - ChatRoom<br>C24 - HalamanChat<br>C25 - LayananPesanInstan<br>C55 - pesan_chat | `src/app/chat/page.tsx`<br>`src/services/chat.service.ts`<br>`src/app/api/chat/route.ts`<br>`src/app/api/chat/[id_chatroom]/route.ts` | - | C25-UT01–C25-UT03, C25-UT07–C25-UT09 |
| KF16 | KNF01, KNF02 | UC05 | C03 - PenggunaJasa<br>C12 - Jasa<br>C15 - HalamanPencarian<br>C16 - HasilPencarian<br>C18 - LayananPembandingJasa | `src/services/pencarian.service.ts`<br>`src/app/api/jasa/route.ts` | UC05-TC03 | - |
| KF17 | KNF01, KNF03 | UC09 | C27 - Pesanan<br>C28 - HalamanPemesanan<br>C31 - PengontrolPesanan | `src/app/pesanan/[id]/page.tsx`<br>`src/services/pesanan.service.ts`<br>`src/app/api/pesanan/route.ts` | - | C31-UT01–C31-UT03 |
| KF18 | KNF01, KNF03 | UC09 | C27 - Pesanan<br>C28 - HalamanPemesanan<br>C31 - PengontrolPesanan | `src/app/pesanan/[id]/page.tsx`<br>`src/services/pesanan.service.ts`<br>`src/app/api/pesanan/route.ts` | - | C31-UT04–C31-UT06 |
| KF19 | KNF01, KNF03, KNF04, KNF05 | UC09 | C29 - HalamanPembayaran<br>C32 - PengontrolTransaksi<br>C33 - MetodePembayaran | `src/app/pesanan/checkout/[id]/page.tsx`<br>`src/services/transaksi.service.ts`<br>`src/app/api/transaksi/route.ts` | - | C32-UT01–C32-UT03 |
| KF20 | KNF01, KNF03, KNF04, KNF05 | UC09 | C27 - Pesanan<br>C29 - HalamanPembayaran<br>C31 - PengontrolPesanan<br>C32 - PengontrolTransaksi<br>C34 - RiwayatTransaksi | `src/app/pesanan/checkout/[id]/page.tsx`<br>`src/services/transaksi.service.ts`<br>`src/app/api/transaksi/dummy/route.ts` | - | C32-UT04–C32-UT06, KNF04-TC01 |
| KF21 | KNF01 | UC10 | C26 - LayananNotifikasiChat<br>C27 - Pesanan<br>C35 - HalamanKonfirmasi<br>C56 - notifikasi | `src/app/penyedia/konfirmasi/[idPesanan]/page.tsx`<br>`src/services/notifikasi.service.ts` | - | C26-UT01, C26-UT04, C31-UT10 |
| KF22 | KNF01 | UC10 | C27 - Pesanan<br>C31 - PengontrolPesanan<br>C35 - HalamanKonfirmasi | `src/app/penyedia/konfirmasi/[idPesanan]/page.tsx`<br>`src/services/pesanan.service.ts`<br>`src/app/api/pesanan/[id_pesanan]/route.ts` | - | C31-UT07, C31-UT09 |
| KF23 | KNF01 | UC10 | C27 - Pesanan<br>C31 - PengontrolPesanan<br>C32 - PengontrolTransaksi<br>C35 - HalamanKonfirmasi | `src/services/pesanan.service.ts`<br>`src/app/api/pesanan/[id_pesanan]/route.ts` | - | C31-UT08, C31-UT09 |
| KF24 | KNF01 | UC09, UC10 | C27 - Pesanan<br>C30 - HalamanRiwayatTransaksi<br>C31 - PengontrolPesanan<br>C32 - PengontrolTransaksi<br>C34 - RiwayatTransaksi | `src/app/pengguna/riwayat-transaksi/page.tsx`<br>`src/app/penyedia/pesanan/page.tsx`<br>`src/services/pesanan.service.ts`<br>`src/services/transaksi.service.ts`<br>`src/app/api/pesanan/route.ts`<br>`src/app/api/transaksi/route.ts` | - | C31-UT10–C31-UT12, C32-UT07–C32-UT09 |
| KF13 | KNF01 | UC08 | C23 - ChatRoom<br>C24 - HalamanChat<br>C25 - LayananPesanInstan | `src/app/chat/page.tsx`<br>`src/services/chat.service.ts`<br>`src/app/api/chat/route.ts`<br>`src/app/api/chat/[id_chatroom]/route.ts` | UC08-TC01 – UC08-TC07, UC08-TC09 | C25-UT04–C25-UT06, C25-UT10–C25-UT12, KNF01-TC01 |
| KF14 | KNF01 | UC08 | C25 - LayananPesanInstan<br>C26 - LayananNotifikasiChat<br>C56 - notifikasi | `src/services/chat.service.ts`<br>`src/services/notifikasi.service.ts`<br>`src/app/api/notifikasi/route.ts`<br>`src/components/ui/notifikasi.tsx` | UC08-TC01, UC08-TC02, UC08-TC09 | C25-UT10, C25-UT11, C26-UT01–C26-UT09, KNF01-TC01 |
| KF15 | KNF01 | UC08 | C23 - ChatRoom<br>C24 - HalamanChat<br>C25 - LayananPesanInstan<br>C55 - pesan_chat | `src/app/chat/page.tsx`<br>`src/services/chat.service.ts`<br>`src/app/api/chat/route.ts`<br>`src/app/api/chat/[id_chatroom]/route.ts` | UC08-TC01 – UC08-TC05 | C25-UT01–C25-UT03, C25-UT07–C25-UT09, KNF01-TC01 |
| KF37 | KNF01 | UC08 | C23 - ChatRoom<br>C24 - HalamanChat<br>C51 - MediasiHandler<br>C57 - sesi_mediasi<br>C58 - pesan_mediasi | `src/app/mediasi/[id]/page.tsx`<br>`src/services/mediasi.service.ts`<br>`src/app/api/mediasi/route.ts`<br>`src/app/api/mediasi/[id_sesi_mediasi]/route.ts`<br>`src/app/api/mediasi/[id_sesi_mediasi]/pesan/route.ts` | UC08-TC03, UC08-TC04, UC08-TC05 | C51-UT07–C51-UT15, KNF01-TC01 |
| KF17 | KNF01, KNF03 | UC09 | C27 - Pesanan<br>C28 - HalamanPemesanan<br>C31 - PengontrolPesanan | `src/app/pesanan/[id]/page.tsx`<br>`src/services/pesanan.service.ts`<br>`src/app/api/pesanan/route.ts` | UC09-TC01, UC09-TC04 | C31-UT01–C31-UT03, INT-TC23–INT-TC25, KNF01-TC01 |
| KF18 | KNF01, KNF03 | UC09 | C27 - Pesanan<br>C28 - HalamanPemesanan<br>C31 - PengontrolPesanan | `src/app/pesanan/[id]/page.tsx`<br>`src/services/pesanan.service.ts`<br>`src/app/api/pesanan/route.ts` | UC09-TC01, UC09-TC02, UC09-TC04 | C31-UT04–C31-UT06, INT-TC23–INT-TC25, KNF01-TC01 |
| KF19 | KNF01, KNF03, KNF04, KNF05 | UC09 | C29 - HalamanPembayaran<br>C32 - PengontrolTransaksi<br>C33 - MetodePembayaran | `src/app/pesanan/checkout/[id]/page.tsx`<br>`src/services/transaksi.service.ts`<br>`src/app/api/transaksi/route.ts` | UC09-TC02 | C32-UT01–C32-UT03, INT-TC26, KNF01-TC01 |
| KF20 | KNF01, KNF03, KNF04, KNF05 | UC09 | C27 - Pesanan<br>C29 - HalamanPembayaran<br>C31 - PengontrolPesanan<br>C32 - PengontrolTransaksi<br>C34 - RiwayatTransaksi | `src/app/pesanan/checkout/[id]/page.tsx`<br>`src/services/transaksi.service.ts`<br>`src/app/api/transaksi/dummy/route.ts` | UC09-TC03, UC09-TC05 | C32-UT04–C32-UT06, INT-TC27, INT-TC28, KNF04-TC01, KNF01-TC01 |
| KF21 | KNF01 | UC10 | C26 - LayananNotifikasiChat<br>C27 - Pesanan<br>C35 - HalamanKonfirmasi<br>C56 - notifikasi | `src/app/penyedia/konfirmasi/[idPesanan]/page.tsx`<br>`src/services/notifikasi.service.ts` | UC10-TC01, UC10-TC02 | C26-UT01, C26-UT04, C31-UT10, KNF01-TC01 |
| KF22 | KNF01 | UC10 | C27 - Pesanan<br>C31 - PengontrolPesanan<br>C35 - HalamanKonfirmasi | `src/app/penyedia/konfirmasi/[idPesanan]/page.tsx`<br>`src/services/pesanan.service.ts`<br>`src/app/api/pesanan/[id_pesanan]/route.ts` | UC10-TC02, UC10-TC03 | C31-UT07, C31-UT09, INT-TC31, INT-TC32, KNF01-TC01 |
| KF23 | KNF01 | UC10 | C27 - Pesanan<br>C31 - PengontrolPesanan<br>C32 - PengontrolTransaksi<br>C35 - HalamanKonfirmasi | `src/app/penyedia/konfirmasi/[idPesanan]/page.tsx`<br>`src/services/pesanan.service.ts`<br>`src/app/api/pesanan/[id_pesanan]/route.ts` | UC10-TC04 | C31-UT08, C31-UT09, KNF01-TC01 |
| KF24 | KNF01 | UC09, UC10 | C27 - Pesanan<br>C30 - HalamanRiwayatTransaksi<br>C31 - PengontrolPesanan<br>C32 - PengontrolTransaksi<br>C34 - RiwayatTransaksi | `src/app/pengguna/riwayat-transaksi/page.tsx`<br>`src/app/penyedia/pesanan/page.tsx`<br>`src/services/pesanan.service.ts`<br>`src/services/transaksi.service.ts`<br>`src/app/api/pesanan/route.ts`<br>`src/app/api/transaksi/route.ts` | - | C31-UT10–C31-UT12, C32-UT07–C32-UT09, INT-TC29, INT-TC30, KNF01-TC01 |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| KNF01 | Portability | KF13–KF15, KF17–KF24, KF37 / UC08, UC09, UC10 (dan seluruh KF yang mencantumkan KNF01) | KNF01-TC01 |
