<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
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

> **Petunjuk pengerjaan:** *[Silahkan hapus bagian ini setelah selesai mengerjakan]*
>
> Dokumen ini adalah **spesifikasi sekaligus template laporan singkat** Tugas 9. Bagian **Ketentuan Implementasi** (Bagian A) adalah aturan yang harus kalian ikuti, boleh dihapus dari laporan akhir. Bagian **Laporan Implementasi** (Bagian B) adalah yang **wajib kalian isi**. Gunakan nama, ID, kebutuhan, use case, dan kelas yang konsisten dengan SKPL, APL, dan DPPL.

---

**Deadline:** Rabu, 11 November 2026, 21.50 WIB
**Asistensi akbar:** *[Hari, DD Bulan YYYY, HH.MM WIB, lokasi/link]*

---

# BAGIAN A: Ketentuan Implementasi

## A.1 Deskripsi Tugas

Pada tugas ini, kalian mengimplementasikan perangkat lunak yang telah dirancang pada tugas-tugas sebelumnya (SKPL, APL, DPPL) menjadi aplikasi yang **dapat dijalankan**. Platform bebas (web, desktop, atau mobile) selama aplikasi dapat dijalankan ulang oleh asisten mengikuti petunjuk kalian.

Ketentuan umum:
- Setiap anggota bertanggung jawab atas **minimal satu fitur atau modul** dan harus terlihat jelas di riwayat commit/PR.
- Implementasi harus **mengacu pada DPPL**. Jika ada yang berubah (kelas, layar, basis data, dsb.), catat di Bagian B.1. Perubahan itu wajar, tetapi harus tercatat dan beralasan.
- Implementasi **tidak harus berupa kelas** (misalnya fungsi, komponen, *route/handler*, *stored procedure*, atau skrip). Namun, setiap kelas perancangan pada DPPL **wajib dapat ditelusuri** ke implementasinya, dan penelusuran ini dicatat di Bagian B.5.
- Seluruh use case pada SKPL **diprioritaskan** untuk diimplementasikan. Status tiap use case akan dilaporkan pada HIUPL (Tugas 10).
- Seluruh mahasiswa **wajib** mengikuti asistensi akbar.

## A.2 Platform, Bahasa, dan Teknologi

Kalian **bebas** memilih bahasa, framework, library, dan basis data, dengan syarat:

1. **Dapat dijalankan ulang** oleh asisten pada mesin biasa dengan mengikuti README. Versi bahasa/runtime dan seluruh dependensi harus tertulis jelas.
2. **Dependensi dikelola lewat file standar**, misalnya `package.json` + lockfile, `requirements.txt`/`pyproject.toml`, `pom.xml`/`build.gradle`, `composer.json`, `pubspec.yaml`, dan sejenisnya. Jangan meng-commit folder hasil instalasi (`node_modules/`, `venv/`, `build/`, dll.).
3. **Jika memakai layanan eksternal** (basis data cloud, API pihak ketiga, auth, dll.), sediakan cara menjalankan tanpa akun pribadi kalian, atau sediakan data/akun uji pada README. Basis data **sangat disarankan** dapat dijalankan lokal (SQLite, atau Docker Compose untuk PostgreSQL/MySQL/MongoDB).
4. **Arsitektur sesuai DPPL.** Pola arsitektur yang kalian pilih di APL/DPPL (MVC, layered, client-server, dll.) harus terlihat pada struktur kode.

Ketentuan tambahan per platform:

| Platform | Ketentuan |
| :--- | :--- |
| **Web** | Berjalan lokal lewat satu-dua perintah yang terdokumentasi. Boleh juga di-*deploy*; jika ya, cantumkan URL, tetapi **tetap wajib bisa dijalankan lokal** (URL deploy bisa mati). |
| **Desktop** | Berjalan dari source lewat perintah yang terdokumentasi. Build/installer opsional. |
| **Mobile** | Berjalan di emulator/simulator atau perangkat. Sertakan langkah menjalankan, dan **sangat disarankan** melampirkan APK/build di Release. |

## A.3 Keamanan Repository

Repo fork kelompok bersifat **public**, sehingga:

- **Dilarang** meng-commit password, API key, token, `.env` asli, sertifikat/private key, atau data pribadi. Hal ini dapat mengurangi nilai.
- Sediakan `.env.example` berisi nama variabel tanpa nilai rahasia, dan masukkan `.env` ke `.gitignore`.
- Jika sudah terlanjur ter-commit, **cabut/ganti** kredensial tersebut. Menghapus commit saja tidak cukup.
- Data uji/seed harus berupa data fiktif.

## A.4 Struktur Folder

Seluruh kode ditempatkan di `src/app/` pada repo fork. Jangan mengubah folder milestone lama.

```
src/app/                              # SELURUH kode implementasi
	README.md                     # dokumentasi utama aplikasi (lihat A.5)
	.env.example                  # jika memakai environment variable
	<struktur kode kalian>        # bebas, mengikuti pola arsitektur DPPL
	tests/                        # test case (jika ada)
docs/
	M9/
		KXX_GYY_Implementasi.md   # laporan ini (Bagian B)
		KXX_GYY_Form-Asistensi.md
```

Catatan:
- `README.md` aplikasi diletakkan di **`src/app/README.md`**, bukan di root repo.
- Jika kerangka kerja kalian mewajibkan struktur tertentu (misalnya Maven `src/app/main/java`, Flutter `lib/`, monorepo `frontend/` dan `backend/`), letakkan semuanya **di dalam `src/app/`**.
- Nama file dan folder pada `docs/M9/` mengikuti aturan penamaan milestone sebelumnya (`KXX_GYY_...`).

## A.5 Isi Minimal `src/app/README.md`

README harus cukup bagi orang yang belum pernah melihat proyek kalian untuk menjalankan aplikasi dari nol. Minimal berisi:

1. **Deskripsi singkat** aplikasi.
2. **Teknologi yang digunakan** beserta versi (bahasa, framework, basis data).
3. **Prasyarat dan instalasi** (software yang harus ada, perintah instalasi dependensi).
4. **Konfigurasi** (environment variable, setup basis data, migrasi/seed) dan langkah demi langkah menjalankannya.
5. **Cara menjalankan aplikasi** (dan cara menjalankan test, jika ada).
6. **Akun/data uji** untuk mencoba tiap peran pengguna (jika ada login).
7. **Daftar modul/fitur yang diimplementasi** beserta pembagian anggota.
8. **Daftar tabel/koleksi basis data** beserta atributnya (atau tautan ke skema/ERD).

## A.6 Best Practices

Kalian dianjurkan menerapkan praktik berikut. Bukti penerapannya dirangkum pada Bagian B.2.

### 1. Branching
Sesuai aturan umum di README repository, `main` fork kelompok dijaga agar tetap bisa menerima sync dari asisten. Pada tugas ini **sangat disarankan** memakai branch per fitur dengan format `<tipe>/<nama-fitur>` (contoh: `feat/login-page`, `fix/null-cart`), lalu digabungkan ke `main` melalui Pull Request. Skema Gitflow penuh (dengan `develop`) boleh dipakai, tetapi tidak diwajibkan.

### 2. Semantic Commit
Gunakan format `<tipe>(<scope>): <deskripsi>`, misalnya `feat(auth): tambah validasi email`.

| Tipe | Kegunaan |
| :--- | :--- |
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Mengubah dokumentasi |
| `style` | Perubahan format/spasi, tanpa mengubah logika |
| `refactor` | Perubahan kode yang tidak menambah fitur atau memperbaiki bug |
| `test` | Menambah/memperbaiki pengujian |
| `chore` | Tugas rutin (build, dependensi, konfigurasi) |

### 3. Track Tasks
Gunakan **GitHub Issues** (dan opsional GitHub Projects) untuk membagi tugas dan melacak progres.
- Pecah fitur besar menjadi issue yang lebih kecil dan tetapkan penanggung jawabnya.
- Hubungkan PR dengan issue (`Closes #12`) dan tutup issue ketika selesai.

### 4. Pull Request dan Code Review
- Setiap PR berisi penjelasan deskriptif tentang apa yang dikerjakan, beserta bukti (tangkapan layar/rekaman/hasil test).
- Setiap PR di-*review* minimal **1 anggota lain**, dengan komentar konstruktif atau approval.

### 5. Pengujian dan Optimasi Performa
- Tulis pengujian untuk logika inti (unit test dan/atau pengujian alur utama). Cakupan penuh tidak diwajibkan, tetapi pengujian pada logika utama dinilai.
- Lakukan **profiling** pada setidaknya satu fitur yang berat (query besar, proses pengolahan data, render list panjang, dsb.), lalu catat temuan dan perbaikannya. Contoh alat:

| Platform | Contoh alat |
| :--- | :--- |
| Web (frontend) | Chrome DevTools (Performance/Network), Lighthouse |
| Web (backend) | Profiler bawaan bahasa, `EXPLAIN` pada query basis data, logging waktu respons |
| Python | `cProfile`, `PyInstrument` |
| Java | VisualVM, JProfiler |
| Mobile | Android Studio Profiler, Flutter DevTools, Xcode Instruments |

### 6. Penggunaan AI
Penggunaan AI **tetap harus dicatat** pada `docs/KXX_GYY_AI-Usage.md` sesuai ketentuan yang sudah berlaku.

## A.7 Pengumpulan

Pengumpulan dinilai dari **tag release**, bukan commit terakhir.

1. Pastikan seluruh pekerjaan sudah di-*commit* dan di-*push* ke `main` fork kelompok.
2. Buat release dengan tag **`v9.0`** (revisi berikutnya `v9.1`, `v9.2`, dst.) dengan target branch `main`.
3. Yang dinilai adalah **tag terakhir yang dibuat sebelum deadline**.

## A.8 Aturan Tanya Jawab

Agar semua kelompok mendapat jawaban yang sama, pertanyaan dibagi menjadi dua jalur:

| Jenis Pertanyaan | Jalur |
| :--- | :--- |
| **Ketentuan tugas**, misalnya teknologi yang diperbolehkan, struktur folder, format pengumpulan, dan penilaian | **Sheets QnA:** *[tautan sheets QnA]* |
| **Kendala teknis kelompok sendiri**, misalnya error, setup, dan penggunaan git | Grup kelompok bersama asisten masing-masing |

Ketentuan:
1. Pertanyaan tentang ketentuan tugas **wajib** diajukan melalui Sheets QnA. Periksa terlebih dahulu apakah pertanyaan serupa sudah dijawab.
2. Jika pertanyaan tentang ketentuan tugas tetap diajukan langsung kepada asisten kelompok, asisten **berhak menolak menjawab** dan meminta kelompok memasukkan pertanyaannya ke Sheets QnA.
3. Jika pertanyaan di Sheets QnA **belum dijawab dalam 24 jam**, kelompok boleh menghubungi asisten kelompok masing-masing. Cantumkan pertanyaan yang sudah diajukan di sheets tersebut.
4. Jawaban pada Sheets QnA berlaku untuk **seluruh kelompok** dan menjadi acuan jika terjadi perbedaan pemahaman.

---

# BAGIAN B: Laporan Implementasi

## B.1 Perubahan dari DPPL

Catat semua perbedaan antara perancangan (DPPL) dan implementasi akhir. Jika tidak ada perubahan, tuliskan "Tidak ada perubahan".

Tabel B.1. Perubahan dari DPPL

| No | Bagian DPPL | Rancangan Awal | Implementasi Akhir | Alasan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[mis. Kelas C05, layar I-03, tabel `orders`]* | *[Yang direncanakan]* | *[Yang dibuat]* | *[Alasan perubahan]* |
| *...* | *...* | *...* | *...* | *...* |

## B.2 Bukti Penerapan Best Practices

Tabel B.2. Bukti Best Practices

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Branching | Graph Commit : [https://github.com/EdwTorch/IF2150-RPL-K01-G03/network](https://github.com/EdwTorch/IF2150-RPL-K01-G03/network) <br> All Branches : [https://github.com/EdwTorch/IF2150-RPL-K01-G03/branches/all](https://github.com/EdwTorch/IF2150-RPL-K01-G03/branches/all) | Menggunakan skema Git Flow : dengan development sebagai branch utama untuk merge setelah suatu fitur telah selesai dalam suatu branch, untuk fitur akan dipisah dalam branch, misal feat/backend-chat, feat/fe-layar-konfirmasi |
| Semantic commit | [https://github.com/EdwTorch/IF2150-RPL-K01-G03/commits/development/](https://github.com/EdwTorch/IF2150-RPL-K01-G03/commits/development/) | Menggunakan Konvensi Semantic Commit, dengan menggunakan feat, fix, docs, style, refactor, test, dan chore |
| Track tasks | [https://github.com/EdwTorch/IF2150-RPL-K01-G03/issues?q=is%3Aissue](https://github.com/EdwTorch/IF2150-RPL-K01-G03/issues?q=is%3Aissue) | 40 Issue, <br> Pembagian : Danesh : 5 Issue Backend <br> Revandra : 7 Issue Backend <br> Theresia : 15 Issue Frontend <br> Edward : 5 Issue Backend <br> Necia : 8 Issue Frontend  |
| Pull request dan review | 1. [https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/49](https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/49) <br> 2. [https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/38](https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/38) <br> 3. [https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/57](https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/57) 4. [https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/68](https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/68) 5. [https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/69](https://github.com/EdwTorch/IF2150-RPL-K01-G03/pull/69)  | 1. Danesh Review Edward <br> 2. Edward Review Revandra <br> 3. Revandra Review Danesh <br> 4. Theresia Review Necia <br> 5. Necia Review Theresia |
| Pengujian | *[Tautan ke `src/app/tests/` dan hasil test]* | *[Apa yang diuji, cara menjalankan]* |

### B.2.1 Profiling dan Optimasi

Pilih minimal satu fitur yang diprofil.

| Informasi | Keterangan |
| :--- | :--- |
| Fitur / proses yang diprofil | *[Nama fitur]* |
| Alat | *[mis. Chrome DevTools, cProfile, EXPLAIN]* |
| Temuan (sebelum) | *[Bottleneck yang ditemukan, sertakan angka/tangkapan layar]* |
| Perbaikan | *[Yang diubah]* |
| Hasil (sesudah) | *[Perbandingan dengan sebelumnya]* |

Jika tidak ada perbaikan yang perlu dilakukan, jelaskan hasil profiling dan alasan kenapa fitur tersebut sudah memadai.

## B.3 Kendala dan Catatan Penting

Tuliskan kendala yang ditemui, fitur yang belum sempurna (*known issues*), serta hal yang perlu diketahui asisten saat menjalankan atau menilai aplikasi (misalnya akun uji khusus, urutan menjalankan, atau batasan).

## B.4 Kontribusi Anggota

Tabel B.4. Kontribusi Anggota

| NIM | Nama | Modul / Fitur yang Dikerjakan | Persentase Kontribusi |
| :--- | :--- | :--- | :--- |
| 13525031 | Revandra Zacky Maharta | 1. Pembuatan _database_ setiap kelas yang membutuhkannya <br> 2. Service autentikasi login dan logout <br> 3. Route handler autentikasi <br> 4. Dual storage adapter (local dan supabase) <br> 5. Upload gateway <br> 6. Validasi berkas yang di-upload <br> 7. Integrasi storage untuk berkas deliverable <br> 8. Pembaruan rating agregat | 20% |
| 13525079 | Danesh Rasyad Damotino | | 20% |
| 13525088 | Theresia Estelina Ratu Udju | Frontend: <br> 1. Halaman Pengumpulan Jasa <br> 2. Halaman Deliverables <br> 3. Halaman Ulasan <br> 4. Halaman Dashboard Admin <br> 5. Halaman Pengajuan Mediasi <br> 6. Halaman Riwayat Pesanan <br> 7. Halaman Request Revisi <br> 8. Halaman Pelaporan <br> 9. Halaman Konfirmasi| 20%|
| 13525127 | Edward Terrance Lie | 1. Setup ENV dan npm install awal <br> 2. Modul deliverables dan Pengumpulan Revisi <br> 3. Modul Chat <br> 4. Modul Notifikasi <br> 5. Modul Pelaporan <br> 6. Modul Mediasi <br> 7. Modul Ulasan <br> 8. Bikin testing | 20% |
| 13525130 | Necia Aurely Greva Dedevi | | 20% |

## B.5 Traceability Kelas Perancangan ke Implementasi

Pemetaan dari **setiap kelas perancangan** pada DPPL (Tabel 4.1) ke wujud implementasinya. Bentuk implementasi bebas (kelas, fungsi, komponen, *route/handler*, *stored procedure*, skrip, dsb.), tetapi tiap kelas perancangan harus muncul pada tabel ini. Jika implementasi berupa kelas dengan nama yang sama, tetap dicantumkan.

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| *[C01]* | *[Nama kelas pada DPPL]* | *[mis. Kelas / Fungsi / Komponen / Route / Tabel]* | *[mis. `src/app/models/user.py` - `User`]* | *[Cara atribut dan operasi kelas diwujudkan; "-" jika tidak ada penjelasan tambahan]* |
| *[C02]* | *[Nama kelas pada DPPL]* | *[Bentuk implementasi]* | *[mis. `src/app/components/LoginForm.tsx` - `LoginForm`]* | *[mis. atribut menjadi *state*, operasi menjadi *handler*]* |
| *[C03]* | *[Nama kelas pada DPPL]* | *[Bentuk implementasi]* | *[mis. `src/app/routes/auth.js` - `POST /login`]* | *[Keterangan]* |
| C01 | Pengguna  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql  | - |
| C02 | PenyediaJasa | Tabel Basis Data <br> Interface (Tipe Data) <br> Fungsi (Service) <br> Route Handler <br> Pengujian (Unit Test) | src/supabase/migrations/20261103060624_create_carijasa_schema.sql - public.penyedia_jasa <br> src/models/types.ts - PenyediaJasa, RatingAgregat <br> src/services/ulasan.service.ts - perbaruiRatingPenyedia, getRatingDanUlasanPenyedia, hitungRatingAgregat, formatRatingTampilan, validasiRating <br> src/app/api/ulasan/route.ts - GET (query id_penyedia / id_penyedia_jasa) <br> src/test/ulasan.test.ts - Unit test rating agregat penyedia | - |
| C03 | PenggunaJasa  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql  | Penggunaan id_pengguna_jasa berasal atribut id pengguna (inheritance) |
| C04 | HalamanRegistrasi  | | | |
| C05 | LayananRegistrasi | Fungsi (Service) <br> Route Handler <br> Pengujian (Unit Test) | src/services/auth.service.ts - validasiInputRegistrasi, registrasi, InputRegistrasi <br> src/app/api/auth/route.ts - POST (action: register) <br> src/test/auth.test.ts - Pengujian unit validasi input registrasi | - |
| C06 | HalamanLogin  | | | |
| C07 | Autentikator | Fungsi (Service) <br> Route Handler <br> Middleware <br> Interface (Tipe Data) | src/services/auth.service.ts - login, logout, getSessionUser, loginAdmin <br> src/app/api/auth/route.ts - POST (action: login, logout, me), GET <br> src/lib/supabase/middleware.ts - updateSession (diintegrasikan di src/middleware.ts) <br> src/models/types.ts - SessionUser | - |
| C08 | HalamanPortofolio  | | | |
| C09 | Portofolio  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql  | Tambahan atribut id_portofolio, id_penyedia_jasa |
| C10 | PengontrolPortofolio | | | |
| C11 | LayananUploadFile  | | | |
| C12 | Jasa  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql  | tambahan atribut rating_rata_rata |
| C13 | HalamanUploadJasa  | | | |
| C14 | JasaController  | | | |
| C15 | HalamanPencarian  | | | |
| C16 | HasilPencarian  | | | |
| C17 | LayananPencarian  | | | |
| C18 | LayananPembandingJasa  | | | |
| C19 | HalamanDetailJasa  | | | |
| C20 | Bookmark  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | - |
| C21 | HalamanBookmark  | | | |
| C22 | PengontrolBookmark  | | | |
| C23 | ChatRoom  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | - |
| C24 | HalamanChat  | | | |
| C25 | LayananPesanInstan  | Fungsi, Kelas, dan Routing | src\services\chat.service.ts - ChatService <br> src\app\api\chat\[id_chatroom]\route.ts <br> src\app\api\chat\route.ts | - |
| C26 | LayananNotifikasiChat  | Fungsi, Kelas, dan Routing | src\services\notifikasi.service.ts - NotifikasiService <br> src\app\api\notifikasi\route.ts | Menampilkan Notifikasi Untuk setiap aksi yang dilakukan terkait pesanan atau chat |
| C27 | Pesanan  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | Penambahan Atribut, id_metode_pembayaran, status_pembayaran, status_pencairan, waktu_pencairan |
| C28 | HalamanPemesanan  |  | | |
| C29 | HalamanPembayaran  | | | |
| C30 | HalamanRiwayatTransaksi  | | | |
| C31 | PengontrolPesanan  | | | |
| C32 | PengontrolTransaksi  | | | |
| C33 | MetodePembayaran  |  Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | - |
| C34 | RiwayatTransaksi  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | Menambahkan atribut id_metode dan total_biaya |
| C35 | HalamanKonfirmasi  | | | |
| C36 | ProdukAkhir  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | |
| C37 | HalamanPengumpulan  | | | |
| C38 | HalamanDeliverables  | | | |
| C39 | PengajuanRevisi  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | menambahkan atribut id_revisi dan id_pesanan |
| C40 | HalamanRequestRevisi  | | | |
| C41 | RevisiHandler  | Fungsi, Kelas, dan Routing | src\services\deliverables.service.ts - DeliverablesService <br> src\app\api\pesanan\[id_pesanan]\deliverables\revisi\route.ts  | Class ini Digabung dengan RevisiHandler dan Sebagian PesananHandler. Fungsi yang relevan antara lain : getRevisionHistory, requestRevision, submitRevisionFix, confirmOrderComplete |
| C42 | PencairanDana  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | - |
| C43 | TiketLaporan  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | - |
| C44 | HalamanPelaporan | | | |
| C45 | LaporanHandler | Fungsi, Kelas dan Routing | src\services\pelaporan.service.ts <br> src\app\api\pesanan\[id_pesanan]\laporan\route.ts <br> src\app\api\admin\laporan\[id_tiket]\route.ts <br> src\app\api\admin\laporan\[id_tiket]\tanggapan\route.ts - PelaporanService dan TanggapanLaporanService | fungsi yang terkait PelaporanService : submitLaporan, validasiOwnerPesanan, validateUrlBukti, getTicketsByUser. fungsi yang terkait TanggapanLaporanService : getAllTicketsForAdmin, getDetailTiketAdmin, catatKeputusanTindakan |
| C46 | Ulasan | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | |
| C47 | HalamanUlasan  | | | |
| C48 | UlasanHandler  | Fungsi, Kelas, dan Routing | src\services\ulasan.service.ts <br> src\app\api\ulasan\route.ts| Class UlasanService, validasiRating, hitungRatingAgregat, perbaruiRatingPenyedia, getRatingDanUlasanPenyedia, geStatistikUlasanJasa, getUlasanJasaById, simpanUlasan, getUlasanbyJasa,updateUlasan, deleteUlasan |
| C49 | TanggapanLaporan  | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | - |
| C50 | HalamanPengajuanMediasi | | | |
| C51 | MediasiHandler | Fungsi, Kelas, dan Routing | src/app/deliverables/mediasi.service.ts - MediasiService <br> src/app/api/admin/mediasi/[id_sesi_mediasi]/selesai <br> src/app/api/admin/mediasi/route.ts <br> src/app/api/mediasi/route.ts <br> src/app/api/mediasi/[id_sesi_mediasi]/route.ts <br> src/app/api/mediasi/[id_sesi_mediasi]/pesan/route.ts | fungsi yang disediakan : mulaiMediasi, kirimPesanMediasi, getDaftarMediasiUser, getDetalDanPesanMediasi, selesaikanMediasi. |
| C52 | Admin  | Tabel Basis Data | src/app/supabase/20261103060624_create_carijasa_schema.sql  | Penggunaan id_admin pada rancangan berasal atribut id pengguna (inheritance), tetapi dengan role pengguna berupa 'ADMIN'|
| C53 | HalamanDashboardAdmin | | | |
| C54 | PengumpulanController | Fungsi, Kelas, dan Routing | src/app/service/deliverarble.service.ts - DeliverablesService <br> src/app/api/pesanan/route.ts src/app/api/pesanan/[id_pesanan]/route.ts <br> | Class ini Digabung dengan RevisiHandler dan Sebagian PesananHandler. Fungsi yang relevan antara lain : submitDeliverable, getDeliverablebyPesanan, getDeliverableByProdukAkhir, confirmOrderComplete |
| C55 | pesan_chat | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | Menambah Class Baru untuk pesan dalam chat |
| C56 | notifikasi | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | menambah tabel data notifikasi |
| C57 | sesi_mediasi | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | menambah tabel data sesi_mediasi (mirip roomchat tapi bertiga) |
| C58 | pesan_mediasi | Tabel Basis Data | src/app/supabase/migrations/20261103060624_create_carijasa_schema.sql | menambah tabel data pesan dalam sesi_mediasi |
Catatan:
- Satu kelas perancangan boleh diwujudkan oleh beberapa file/unit, dan satu file/unit boleh mewujudkan beberapa kelas perancangan. Tuliskan semuanya.
- Kelas perancangan yang **tidak diimplementasikan** atau **digabung/dipecah** tetap dicantumkan, dan alasannya dicatat di Bagian B.1.
