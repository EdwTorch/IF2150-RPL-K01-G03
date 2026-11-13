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
| 2 | Kelas C01 | Atribut yang direncanakan : <br> - nama : string <br> - email : string <br>   # password : string <br> - statusOnline : boolean <br> - statusAkun : boolean <br> - sanksi : string <br> - daftarProduk : list of string  | Atribut yang diimplementasikan : <br> - id : string (dari auth), nama : string, email :string, no_telepon : string, status_online : boolean, status_akun : string, role : string, created_at dan updated_at : timestampz | menambahkan status akun, kapan dibuat, dan id utama untuk identifier, role ditambahkan untuk membantu inheritance |
| 3 | Kelas C02 Penyedia Jasa | Atribut direncanakan <br> - idPenyediaJasa : string <br> - daftarPenawaranJasa : list of string <br> - pengalaman : list of string <br> - prestasi : list of string <br> - daftarProduk : list of string  | Atribut yang diimplementasikan : <br> - id : string, pengalaman : list of string, saldo : int, prestasi : list of string, daftar_produk : list of string, rating_rata_rata : number | id diturunkan dari id pengguna, penambahan rating rata_rata untuk memudahkan melihat rating keseluruhan, saldo untuk memproses pencairan |
| 4 | Kelas C03 Pengguna Jasa | Atribut yang direncanakan : <br> - idPenggunaJasa : string <br> - daftarJasa : list of string <br> - minatkategoriJasa : list of string <br> - statusKonfirmasi : boolean | Atribut yang diimplementasikan : <br> - id : string <br> - minat_kategori_jasa : list of string, status_konfirmasi : boolean | daftar jasa dihapus karena ada tabel relasi dengan jasa, id pengguna jasa didapat dari inheritance id pengguna |
| 5 | Kelas C52 Admin | idAdmin : string | id : string  | id admin didapat dari inheritance dari id pengguna |
| 6 | Kelas C09 Portofolio | Atribut yang direncanakan : <br> - judul : string <br> - deskripsi : string <br> - berkasPendukung : FILE | Atribut yang diimplementasikan : <br> - id_portofolio : string <br> - id_penyedia_jasa : string <br> - judul : string <br> - deskripsi : string <br> - berkas_pendukung : string | id_portofolio untuk id pengenal, id_pengguna_jasa digunakan sebagai identifier, berkas_pendukung diubah menjadi string untuk filepath (blob) bukan file mentah |
| 7 | Kelas C12 Jasa | atribut yang direncanakan : <br> - idJasa : string <br> - idPenyediaJasa : string <br> -  namaJasa : string <br> -  deskripsi : string <br> -  kategori : string <br> - harga : double <br> - statusAktif : boolean | Atribut yang diimplementasikan : <br> id_jasa : string <br> id_penyedia_jasa : string <br> nama_jasa : string <br> deskripsi : string <br> kategori : list of string <br> harga : numeric <br> rating_rata_rata : numeric <br> status_aktif : boolean | id_jasa untuk identifier, id_penyedia_jasa untuk relasi ke penyedia_jasa, rating_rata_rata untuk mempermudah tampilan, kategori dijadikan list karena lebih dari 1 |
| 8 | Kelas C20 Bookmark | Atribut yang direncankan : <br> - idBookmark : string <br> - idPenggunaJasa : string <br> - idJasa : string <br> - waktuDisimpan : Date <br> - daftarBookmark : list of bookmark  | id_bookmark : string <br> id_pengguna_jasa : string, <br> id_jasa : string, waktu_disimpan : date  | id_bookmark : identifier, id_pengguna_jasa untuk membantu referensi ke pengguna_jasa, id_jasa untuk menyimpan jasa apa yang disimpan |
| 9 | Kelas C27 Pesanan | Atribut yang direncanakan : <br> - idPesanan : string <br> - idPenggunaJasa : string <br> - idPenyediaJasa : string <br> - idJasa : string <br> - brief : string <br> - totalBiaya : double <br> - statusPesanan : boolean  | <br> - id_pesanan : string <br> - id_pengguna_jasa : string <br> - id_penyedia_jasa : string <br> - id_jasa : string <br> - brief : string <br> - total_biaya : number <br> - status_pesanan : string <br> id_metode_pembayaran : string (reference) <br> status_pesanan : string <br> status_pencairan : boolean <br> waktu_pencairan : date | id_metode_pembayaran untuk referensi pembayaran, status_pesanan, status pencairan, dan status_pesanan untuk menyimpan status saat ini. |
| 10 | Kelas 34 RiwayatTransaksi | Atribut yang direncanakan : <br> - idRiwayat : string <br> - idPesanan : string <br> - tanggalTransaksi : DATE <br> - statusTransaksi : boolean  | Atribut yang diimplementasikan : <br> - id_riwayat : string <br> - id_pesanan : string <br> - tanggal_Transaksi : DATE <br> - status_transaksi : boolean <br> - total_biaya : number <br> - id_metode : string | id_metode dan total_biaya ditambahkan untuk memudahkan mengakses riwayat transaksi yang dapat direferensikan pada tabel metode_pembayaran |
| 11 | Kelas C23 Chatroom | Atribut yang direncanakan :  <br> - idChatRoom : string <br> - idAnggota : string <br> - riwayatPesan : list of string <br> - waktuDibuat : Date | Atribut yang diimplementasikan : id_chatroom : string <br> id_penyedia_jasa : string <br>  id_pengguna_jasa : string <br> created_at : timestamp / datetime | riwayatPesan digeser ke tabel pesan_chat, dan idAnggota dibagi dua jadi pengguna_jasa dan penyedia_jasa untuk memudahkan identifiernya |
| 12 | Kelas Baru pesan_chat | Tidak direncanakan | Atribut yang diimplementasikan : <br> id_pesan : string <br> id_chatroom : string <br> id_pengirim : string <br> isi_pesan : string <br> lampiran : string <br> created_at : timestamp | ditambahkan untuk membantu mengisi riwayat pesan yang tadi dihapus, agar bisa lebih detail dan jelas |
| 13 | Kelas C39 Pengajuan Revisi | Atribut yang direncanakan : <br> - deskripsiRevisi : string <br> - jmlRevisiTersedia : int <br> - lampiranRevisi : FILE <br> - idRevisi : string <br> - idPesanan : string <br> - statusPengerjaan : string | Atribut yang diimplementasikan : <br> - deskripsi_revisi : string <br> - jml_revisi_tersedia : int <br> - lampiran_revisi : string <br> - id_revisi : string <br> - id_pesanan : string <br> - status_pengerjaan : string  | lampiran revisi berubah menjadi link / path file bukan file secara utuh (literal) |
| 14 | Kelas C42 pencairan_dana | Atribut yang direncanakan : <br> - stateTransaksi : boolean <br> - statePencairanDana : boolean  | Atribut yang diimplementasikan : <br> - id_pencairan : string <br> id_pesanan : string <br> jumlah_pencairan : int <br> id_penyedia_jasa <br> - statePencairanDana : boolean   | stateTransaksi disimpan di table pesanan, sisanya diadakan untuk menjadi identifier dan merefer ke table lain |
| 15 | Kelas C43 TiketLaporan | Atribut yang direncanakan : - idTiket : string <br> - deskripsiLaporan : string <br> - urlBukti : string <br> - lampiranBukti : FILE <br> - statusTiket : boolean <br> - TanggapanAdmin : string | Atribut yang diimplementasikan : - id_tiket : string <br> - id_pesanan : string <br> - id_pelapor : string <br> - id_terlapor : string <br> - deskripsi_laporan : string <br> - url_bukti : list of string <br> - lampiran_bukti : list of string <br> - status_tiket : string <br> - tanggapan_admin : string   | penambahan id_pesanan, id_pelapor dan terlapor digunakan untuk membantu mengidentifikasi siapa aktor yang dilapokan, status_tiket diubah menjadi string agar lebih mudah dikustom statusnya |
| 16 | Kelas data baru sesi_mediasi  | - | id_sesi_mediasi : string, id_ticket : string, id_admin : string, status_sesi : string, status_sesi : string | tabel baru mirip chatroom namun untuk mediasi (ber 3) |
| 17 | Kelas data baru pesan_mediasi | - | id_pesan : string, id_sesi_mediasi : string, id_pengirim : string, isi_pesan : string   |instance untuk pengiriman pesna pada sesi_mediasi |
| 18 | Kelas data baru notifikasi | - |  id_notifikasi :string, <br> id_pengguna : string <br> id_pesanan : string <br> id_referensi : string <br> judul : string,<br> pesan_notifikasi : string <br> is_read : boolean | membantu mencatat semua notifikasi yang masuk |
| 19 | Kelas C05 LayananRegistrasi | Method yang dirancang : <br> + validasiData() : boolean <br> + cekEmail() : boolean <br> + cekNoTelepon() : boolean <br> + registrasiPengguna() : void | Method yang diimplementasikan : <br> + validasiInputRegistrasi(input : InputRegistrasi) : void <br> + registrasi (input : InputRegistrasi) | Layanan registrasi bergabung dengan Autentikator pada penerapannya di dalam file auth.service.ts. Penggabungan digunakan untuk memudahkan menyatukan fitur yang masih berkaitan secara dekat. cekEmail dan cekNoTelepon tidak diterapkan karena sudah disatukan dalam state internal dalam registrasi |
| 20 | Kelas C07 Autentikator | method yang dirancang : validasiKredensial(email : String, password : string) : boolean <br> + sesiLogin() : void | method yang diterapkan : <br> + hasRelation() : boolean <br> + getAdminClint() <br> + getValidProfil(supabase, userId) : RawProfilPengguna <br> + login(email : string, password : string) : return class pengguna <br> + logout() : void <br> getSessionUser() : return class pengguna <br> + loginAdmin(email : string, password : string) : return class pengguna untuk admin | vaidasiKredensial digeser ke fungsi login agar lebih intuitif <br> sesiLogin() diganti menjadi getSessionUser() agar lebih mudah dibaca tujuan dari fungsinya <br> fungsi sisanya berupa logout, loginAdmin(), getValidProfil(), dan getValidProfil()  baru ditambahkan karena baru terpikirkan untuk dibutuhkan saat proses development |
| 21 | Kelas C11 LayananUploadFile | Method yang dirancang :  <br> + getStatusUpload() : String <br> + validasiFormatUkuran(file : FILE) : boolean <br> + saveDeliverables(file :FILE) : string  <br> + uploadFile(berkas: FILE) : void  | Method yang diimplementasikan : <br> upload(file : FILE, folder : string) : return string <br> delete(file_path :string) : boolean | getStatusUpload() tidak diimplementasikan disini untuk mempermudah implementasi, validasi dilakukan sebelum upload dilakukan dan tidak ditangani di layanan ini, kemudia savedeliverables dimasukkan kedalam class service lain yaitu deliverables  |
| 22 | Kelas C14 JasaController | Method yang dirancang : <br> + ambilDetailJasa(idJasa: string) : Jasa <br> + validasiDataJasa(dataJasa : string) : boolean <br> + simpanPenawaranJasa(dataJasa : string) : void | Method yang diimplementasikan : <br> ambilSemuaJasa(): return Jasa[] <br>  ambilDetailJasa(id_jasa: string): Jasa <br> validasiDataJasa(data?: Partial): boolean <br>  validasiBerkas(berkas: File[]): string <br> unggahBerkas(berkas: File[]): string[] <br> bersihkanBerkas(urls: string[]): void <br> simpanPenawaranJasa(data: DataJasaBaru, berkas: File[]): void <br> perbaruiJasa(id_jasa: string <br> data: DataJasaUpdate, berkas: File[]): void <br> hapusJasa(id_jasa: string): void | Terdapat penambahan beberapa method baru seperti ambilSemuaJasa() untuk membantu frontend membuka semua jasa, validasiBerkas digunakan untuk membantu logika penahan berkas, unggahberkas digunakan untuk memanggil layananupload dengan mengembalikan link file nya, bersihkanfile digunakan jika ada upload yang gagal, perbaruiJasa digunakan mengupdate dan delete digunakan untuk menghapus jasanya  |
| 23 | Kelas C17,18 LayananPencarian dan LayananPembandingJasa | LayananPencarian : <br> + cariJasaBerdasarkanKeyword(keyword : string) : list of Jasa <br> + terapkanFilterPencarian(filter : string) : list of Jasa <br> LayananPembandingJasa : + bandingkanSpesifikasiJasa(idJasa1 : string, idJasa2 : string) : string | Class digabung di satu file, pencarian.service.ts, terdapat penambahan validasiFilter, saringdanUrutkan, sedangkan pembandingjasa ditambahkan susunmatriks  | Penambahan digunakan untuk membantu fungsi lain agar tidak redundan dan terlalu panjang |
| 24 | Kelas C25 LayananPesanInstan | Method yang direncanakan : <br> + buatSesiChat() : void <br> + validasiInputPesan() : boolean <br> + kirimPesan() : void <br> + simpanKeDatabase() : void <br> + updateStatusBaca() : void | Method yang diimplementasikan : <br> getDaftarChatroom(user:id_string) <br> getOrCreateChatroom(id_pengguna_jasa: string, id_penyedia_jasa: string) <br> getRiwayatPesan() <br> kirimPesan(id_chatroom: string, user_id: string, isi_pesan: string, lampiran?: string) <br> validasiAksesChatroom(id_chatroom: string, user_id: string) | Terdapat banyak perubahan, seperti validasi input pesan yang sudah diimplementasikan pada kirimPesan, simpanKeDatabase diubah menjadi query yang diperlukan, buatSesiChat diubah menjadi getOrCreate untuk mempersingkat method yang dibutuhkn untk membuat sesichat, updateStatusBaca, tandaisudahdibaca tidak jadi dibuat untuk mengurangi kompleksitas chat, getDaftarChatroom dibuat untuk membantu frontend mendapatkan seluruh daftar chat pengguna, getRiwayatPesan digunakan untuk meload ulang data chat yang sudah dikirimkan |
| 25 | Kelas C26 LayananNotifikasiChat | Method yang direncanakan : <br> + kirimNotifikasiPesan() : void <br> + tampilkanPopUpNotifikasi() : void | id : string | Method yang diimplementasikan : kirimNotifikasi(payload: CreateNotifikasiPayload), getNotifikasiUser(user_id: string), tandaiSudahDibaca(user_id: string, id_notifikasi?: string) | Terdapat penambahan fungsi untuk layanannotifikasi dengan menambahkan notifikasi untuk setiap kegiatan kunci yang terjadi dari pesanan maupun chat, getNotifikasiUser digunakan untuk sirkulasi notifikasi utama |
| 26 | Kelas C31 PengontrolPesanan | Method yang direncanakan : <br> + buatPesananBaru() : void <br> +  hitungTotalBiaya() : double <br> + updateStatusPesanan(idPesanan: integer, status: STATUS) : void <br> + getDetailPesanan() : string | Method yang diimplementasikan : <br> respondOrder(data: { id_pesanan: string; user_id: string; action: "Diterima" | "Ditolak" | string }) : Pesanan <br> normalisasiStatus(status?: string): string <br> apakahPesananAktif(status?: string): boolean <br> validasiTransisiStatus(status_awal: string, status_baru: string): string <br> buatPesananBaru(id_pengguna_jasa: string, id_jasa: string, brief_kebutuhan: string): Pesanan <br> konfirmasiPesanan(id_pesanan: string, id_penyedia_jasa: string, tindakan: "terima" | "tolak" | string): Pesanan ambilDaftarPesanan(id_pengguna: string, peran: "pengguna_jasa" | "penyedia_jasa", filter_status?: string): list of pesanan | Terdapat bayak penambahan untuk membantu pengubahan dan pembuatan pesanan, update pesanan dilakukan sebagai query di fungsi-fungsi lain |
| 29 | Kelas C54 PengumpulanController | Method yang direncanakan : <br> + validasiDeskripsi() : boolean <br> + validasiPengumpulan() : boolean | Method yang diimplementasikan: <br> submitDeliverable(data: {id_pesanan: string; deskripsi_produk: string; file_url?: string; output_path?: string;}): object produkAkhir <br> getDeliverableByPesanan(id_pesanan: string, user_id : string): object ProdukAkhir <br> getDeliverableByProdukAkhir(id_produk_akhir : string, user_id : string) : object ProdukAkhir, confirmOrderComplete(id_pesanan: string,user_id : string): void | Menambahkan fungsi-fungsi untuk mengerjakan deliverable dan getter serta setternya untuk memudahkan frontend |
| 30 | Kelas C41 RevisiHandler | Method yang diimplementasikan : <br> + isRevisiRequestValid() : void <br> +  sendRevisi() : void <br> + sendNotifikasiRevisi() : void <br> + updateStatusPengerjaan() : void | getRevisionHistory(id_pesanan: string, user_id: string) <br> requestRevision(id_pesanan: string; deskripsi_revisi: string; lampiran_revisi?: string; id_produk_akhir : string; user_id : string) : object pengajuanrevisi <br> submitRevisionFix(id_pesanan: string deskripsi_produk: string; file_url?: string; output_path?: string; user_id: string;) : object ProdukAkhir | controller revisi berubah cukup masif karena validasi dilakukan dalam fungsi, sendRevisi ganti nama menjadi requestRevision, dan updateStatusPengerjaan dikerjakan sebagai query sql, dan getter digunakan untuk menampilkan data revisinya |
| 31 | Kelas C52 LaporanHandler | Method yang direncanakan : <br>+ validasiFormatLaporan() : boolean <br> + kirimNotifAdmin() : void <br> + simpanData() : void <br> + banPengguna() : void <br> + skorsPengguna() : void <br> + kirimTanggapan() : void <br> + saveTanggapan() : void <br> + saveLaporan() : void <br> + updateStatusTiket() : void <br> + getDetailTiket() : void | Method yang diimplementasikan : <br> submitLaporan(id_pesanan: string, user_id: string, data: {deskripsi_laporan: string; kategori : string[]; url_bukti: string[];}) : objek tiketlaporan <br> getTicketsByUser(user_id: string): List of TiketLaporan <br> getDetailTiket(id_tiket: string, user_id: string) : object tiketlaporan | banyak fungsi yang tidak digunakan karena sudah diimplementasikan dalam fungsi yang lebih besar, ataupun query sql sepert i  banpengguna, skorspengguna. Namun, ada juga yang tumpang tindih dengan controler lain yaitu taggapanlaporan, seperti banpengguna kirimtanggapan, savetanggapan sehingga dihapus dari sana  |
| 32 | Kelas C49 TanggapanLaporan| Method yang direncanakan : <br> - catatKeputusanTindakan() : void <br> - getDetailTanggapan() : void | Method yang diimplementasikan : <br> <br> - catatKeputusanTindakan() : void <br> - getDetailTanggapan() : void <br> getDetailTiketAdmin() | Menambahkan fungsi untuk admin |
| 33 | Kelas C51 MediasiHandler | - inputTindakan() : void <br> - akhiriMediasi() : void <br> - tampilkanPesanError(pesanError: string) : void <br> - tampilkanNotifikasiSelesai() : void <br> + UpdateStatusTiket() : void | mulaimediasi(id_tiket: string, id_admin: string) <br> kirimPesanMediasi(id_sesi_mediasi: string,id_pengirim: string, isi_pesan: string) <br> getDaftarMediasiUser(id_pengguna: string) <br> getDetailDanPesanMediasi (id_sesi_mediasi: string, id_pengguna_request: string) <br> selesaikanMediasi(id_sesi_mediasi: string, id_admin: string) | Perubahan dilakukan untuk menyesuaikan fitur chat yang akan dikerjakan di dalam mediasi |


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
