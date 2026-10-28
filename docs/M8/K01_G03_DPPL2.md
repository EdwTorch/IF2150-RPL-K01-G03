<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## CariJasa
### *[Logo Perangkat Lunak]*

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

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| Logo CariJasa | Mengganti Logo CariJasa |
| *B* |  |
| *C* |  |
| ... |  |

---

<br>

> **Petunjuk pengerjaan:** *[Silahkan hapus bagian ini setelah selesai mengerjakan]*
>
> Dokumen ini melanjutkan **Deskripsi Perancangan Perangkat Lunak**. Gunakan nama, ID, kebutuhan, dan use case yang konsisten dengan kedua dokumen tersebut. Contoh pola ID baru di bawah dapat disesuaikan dengan kesepakatan kelompok, ID yang sudah ada tetap dipertahankan.

<br>

---


# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Desain Perangkat Lunak (DPPL) ini disusun untuk merinci rancangan arsitektur, realisasi *use case*, serta pemodelan struktur kelas secara berorientasi objek untuk platform pencarian jasa digital **CariJasa**. Dokumen ini digunakan oleh tim pengembang sebagai pedoman utama untuk menyamakan pemahaman mengenai struktur teknis dan alur implementasi program.

## 1.2 Lingkup Masalah
CariJasa adalah platform *marketplace* jasa berbasis web yang dirancang untuk memudahkan pencarian dan penawaran jasa digital bagi masyarakat Indonesia. Aplikasi ini dibuat untuk mengatasi masalah informasi jasa yang saat ini masih tersebar di berbagai media sosial dan kanal lain, sehingga pengguna kesulitan mencari serta membandingkan tarif, keahlian, dan ulasan penyedia jasa secara mudah. Selain itu, platform ini hadir untuk membantu *freelancer* maupun penyedia jasa lokal memperoleh penghasilan tambahan tanpa harus terikat hubungan kerja tetap. Ruang lingkup aplikasi berfokus pada penyediaan daftar pilihan jasa, fitur pembanding jasa (*compare*), ruang kirim pesan langsung (*chat*), pembayaran digital yang aman, pengiriman hasil kerja dan pengajuan revisi, hingga pelaporan kendala serta bantuan penyelesaian masalah oleh admin.


## 1.3 Definisi, Istilah, dan Singkatan
Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *BCE* | *Singkatan dari Boundary-Controller-Entity*. pola arsitektur yang memisahkan sistem ke dalam tiga peran yaitu antarmuka (*Boundary*), pengendali logika (*Controller*), dan data (*Entity*). |
| *UML* | *Unified Modeling Language*, bahasa visual standar untuk mendokumentasikan artefak sistem perangkat lunak. |
| *Listing Jasa* | Produk jasa digital yang telah dipublikasikan oleh Penyedia Jasa dan tersedia untuk dipesan oleh Pengguna Jasa.|
| *Deliverables* | Berkas, dokumen, atau tautan hasil pekerjaan akhir yang diserahkan oleh Penyedia Jasa kepada Pengguna Jasa untuk dievaluasi. |
| *Bookmark* | Fitur untuk menandai dan menyimpan penawaran jasa ke dalam daftar tersimpan pengguna agar mudah diakses kembali. |
| *Ticketing* | Sistem pencatatan, pelacakan, dan penanganan tiket keluhan serta laporan sengketa transaksi pengguna oleh Admin. |

## 1.4 Aturan Penomoran

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Awal* | *RXX* | Nomor identifikasi kebutuhan mentah dari tahap elisitasi kebutuhan dengan format dua digit. |
| *Kebutuhan Fungsional* | *KFXX* | Nomor urut kebutuhan fungsional dengan format dua digit. |
| *Kebutuhan Non-Fungsional* | *KNFXX* | Nomor urut kebutuhan non-fungsional dengan format dua digit. | 
| *Use Case* | *UCXX* | Nomor urut kasus penggunaan sistem dengan format dua digit. |
| *Kelas* | *CXX* | Nomor identifikasi unik kelas analisis arsitektur BCE. |

## 1.5 Referensi
1. **SKPL:** [Spesifikasi Kebutuhan Perangkat Lunak](../M5/K01_G03_SKPL.md)
2. **APL:** [Arsitektur Perangkat Lunak](../M6/K01_G03_APL.md)
3. Badan Pusat Statistik. (2026). *Keadaan angkatan kerja di Indonesia Februari 2026* (Vol. 48, No. 1). Badan Pusat Statistik.
4. Craigslist. (2026). *Craigslist*. https://www.craigslist.org/
5. Fiverr International Ltd. (2026). *Fiverr*. https://www.fiverr.com/
6. Kementerian Perencanaan Pembangunan Nasional/Badan Perencanaan Pembangunan Nasional. (2025). *Indonesia VNR 2025: Voluntary National Review – Fostering inclusive growth: Advancing sustainable and resilient Indonesia*. Kementerian PPN/Bappenas.
7. United Nations Department of Economic and Social Affairs. (2026). *The Sustainable Development Goals report 2026*. United Nations. https://unstats.un.org/sdgs/report/2026/
8. Program Studi Teknik Informatika ITB. (2026). *Materi perkuliahan IF2150 Rekayasa Perangkat Lunak*. Edunex ITB. https://edunex.itb.ac.id/

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen Desain Perangkat Lunak (DPPL) ini disusun dalam lima bab pembahasan. Bab 1 memaparkan fondasi penyusunan dokumen, meliputi tujuan penulisan, lingkup sistem CariJasa, definisi istilah teknis, konvensi penomoran, daftar referensi dokumen terkait, serta sistematika penulisan. Selanjutnya, Bab 2 menguraikan perancangan arsitektur sistem yang mencakup lingkungan implementasi, pola arsitektur acuan, identifikasi modul, serta model arsitektur perangkat lunak. Pada Bab 3, dijabarkan realisasi *use case* yang meliputi identifikasi kelas, *sequence diagram* untuk skenario normal dan alternatif, serta diagram kelas per *use case*. Pada Bab 4, disajikan diagram kelas keseluruhan beserta daftar lengkap atribut dan metode tiap kelas. Terakhir, Bab 5 menampilkan matriks kerunutan (*traceability*) untuk memetakan hubungan antara kelas dan *use case* terkait.

<br>

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

Tabel 2.1 Rancangan Lingkungan Implementasi Perangkat Lunak

| Komponen | Spesifikasi |
| :--- | :--- |
| Server | Lokal |
| Client | Web Browser Modern Berbasis Chromium |
| DBMS | PostGresSQL |
| OS | Cross-platform (Windows/Linux/MacOS/Android/IOS) melalui perangkat lunak browser modern |
| Development Tools | Visual Studio Code, Git, Github |
| Bahasa Pemrograman | Next.js |
| Filing System | NTFS |

## 2.2 Style/Pattern Arsitektur Acuan

### 2.2.1 Layered Architecture 
Layered Architecture adalah arsitektur yang membagi perangkat lunak menjadi beberapa *layer* (sub-bagian) berdasarkan masing-masing tanggung jawabnya. Setiap *layer* akan menyediakan *service* (layanan) bagi *layer* di atasnya dan menggunakan service dari layer di bawahnya melalui *interface* yang ditetapkan. Namun, layer dibawahnya tidak dapat menggunakan services dari layer di atasnya. Arsitektur ini dgunakan saat UI, business rule, dan akses penyimpanan membutuhkan batas (*boundary*) yang jelas untuk pengembangan implementasi di masa depan (*Scalability*)

Pada *Layered Architecture*
#### 1. Presentation Layer 

*Layer* yang meng-handle tampilan user interface dan interaksi (input dan tampilan informasi) ke pada user. 
Contohnya : 
- Halawan Web.
- Tampilan Mobile App.
- Desktop GUI 

#### 2. Business Layer
*Layer* yang memproses algoritma dan logika utama aplikasi, seperti logika bisnis, workflow, dan pemrosesan request dari user. Umumnya berada pada komponen controller
Contohnya : 
- Logika Validasi 
- Kalkulasi
- Algoritma Pemrosesan Query Pengguna

#### 3. Data Access Layer / Persistence Layer
*Layer* yang menerima data, menyimpan, dan mengatur data yang akan diletakkan di dalam database. Layer ini juga memastikan pemisahan terhadap hal-hal penting dalam data.
Contoh : 
- Query Database
- Caching
- API

#### 4. Database Layer
*Layer* penyimpanan data sesungguhnya tempat informasi disimpan. Biasanya berisikan data untuk masing-masing entitas yang dibuat.

Contoh : 
- Database Relasional (SQL, PostgreSQL)
- NoSQL (MongoDB)

#### Alasan Pemilihan Pattern
Perangkat Lunak CariJasa memiliki karakteristik berupa satu aplikasi web yang memiliki beberapa fitur terpisah yang digunakan untuk menjalankan layanan dengan baik. Perangkat lunak ini memerlukan beberapa karakteristik utama, seperti  Reliability, Security, dan Maintanaibility. Reliability diperlukan agar proses pencarian dapat dieksekusi dengan cepat dan tepat. Selain itu, perangkat lunak juga harus memastikan setiap respons dari server serta transaksi berjalan dengan baik. Kemudian, Security juga diperlukan karena setiap transaksi yang dilakukan berkaitan dengan ekonomi (uang) yang dipercayakan Pengguna Jasa maupun Penyedia Jasa, beserta keamanan kredensialnya. Terakhir, perangkat lunak juga harus dapat dikelola untuk memastikan keberjalana setiap fitur dengan baik. Oleh karena itu, diperlukan berbagai unit testing yang perlu dilakukan untuk setiap fitur yang ada. 

Perangkat Lunak CariJasa juga memiliki alur proses bisnis. Alur dimulai dengan registrasi pengguna, baik Pengguna Jasa, maupun Penyedia Jasa. Lalu Pengguna akan diminta untuk mengisi data diri dan portofolio (untuk Penyedia Jasa). Kemudian Pengguna Jasa dapat langsung mencari jasa yang mereka inginkan melalui search bar yang disediakan, juga menyimpan jasa yang menarik menggunakan *bookmark*. Penyedia Jasa dapat membuat postingan terkait jasa yang mereka tawarkan agar dapat digapai oleh pengguna. Kemudian, Pengguna Jasa dapat berkomunikasi melalui chat instan untuk bertanya sekaligus bernegosiasi kepada Penyedia Jasa. Setelah kedua pihak sepakat, Pengguna Jasa dapat melakukan transaksi serta pemesanan yang kemudian akan diproses dan dikerjakan oleh Penyedia Jasa. Setelah produk akhir dikirim, pengguna jasa dapat mengajukan revisi ataupun mengonfirmasi hasil pekerjaan yang dibuat. Setelah selesai, maka pengguna jasa dapat memberikan ulasan maupun laporan kepada admin lewat fitur ticketing. 

Dengan segala kebutuhan dan alur bisnis tersebut, *layered architecture* dipilih dengan alasan 

#### 1. Pemisahan Tanggung Jawab : 
Arsitektur ini membagi  sistem ke dalam lapisan yang jelas, seperti presentation layer, business layer, data access layer, dan database layer. Komponen ini, akan memastikan logika bisnis setiap fitur saling independen dan tidak tercampur aduk

#### 2. Kemudahan Pengujian :
Dengan perangkat lunak dibagi menjadi berbagai layer, developer dapat lebih mudah untuk melakukan tracing dan unit testing untuk setiap fitur yang dibuat. Hal ini akan memudahkan developer untuk memastikan keberjalanan tiap fitur berjalan secara simultan

#### 3. Keamanan yang lebih terjamin
Karena dilakukan pemisahan akses dan interaksi dari pengguna. Kondisi ini akan memperkecil risiko rusaknya integritas data, dan keamanan dalam transaksi secara ekonomi

<p align="center">
<img alt="Arsitektur Layered Architecture" src="../M6/assets/diagram/Layered Architecture.drawio.png" width="20%">
</p>
<p align="center">
<i>Gambar 2.2.1 Diagram Layered Architecture</i>

### 2.2.2 Client-Server Achitecture
Client-Server Architecture adalah sebuah pola arsitektur perangkat lunak yang membagi sistem menjadi dua bagian utama, yaitu *client* dan *server*. Kedua belah pihak saling berkomunikasi dan bertukar data melalui sebuah protokol jaringan, misalnya HTTP. Dalam penggunaannya, *client* yang biasanya berupa antarmuka pengguna seperti *web browser* atau aplikasi *mobile*, bertugas untuk mengirimkan *request* sesuai dengan keperluannya. Sementara itu, *server* yang merupakan tempat pemrosesan dan penyimpanan data, bertugas menerima *request*, memprosesnya, lalu mengirimkan kembali *response* kepada *client*.

### Alasan Pemilihan Pattern
1. Pengguna yang bertindak sebagai pihak *client* tidak perlu menanggung beban pemrosesan sistem pada perangkat mereka, *client* cukup menggunakan antarmuka untuk mengirimkan berbagai *request*, seperti pencarian, pemesanan, ataupun pengunggahan data, lalu beban komputasi mayoritas ditanggung oleh pihak *server*.
   
3. Untuk platform yang menangani berbagai data penting seperti informasi akun, transaksi, dan berkas, Client-Server Achitecture menempatkan *server* sebagai pusat penyimpanan dan logika utama. Hal tersebut memastikan setiap *request* yang dikirim oleh *client* dikelola dengan standar keamanan dan aturan yang sama sehingga integritas dan standar data tetap terjaga.
   
5. Dapat menghubungkan banyak pengguna yang tersebar di berbagai lokasi yang berbeda. Dengan memanfaatkan protokol jaringan seperti HTTP, sistem memungkinkan terjadinya komunikasi dan sinkronisasi data antarpengguna melalui perantara *server* sehingga interaksi seperti pertukaran pesan dan pengiriman notifikasi dapat berjalan dengan lancar.

<p align="center">
<img alt="Contoh Arsitektur MVC" src="../M6/assets/diagram/ClientServer.png" width="70%">
</p>
<p align="center">
<i>Gambar 2.2.2 Diagram Client-Server Architecture</i>

## 2.3 Identifikasi Komponen / Modul / Subsistem

Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Kelas yang Dicakup (SKPL) | Jenis | Penjelasan |
| :--- | :--- | :--- | :--- |
| Subsistem Client Web | C04 (HalamanRegistrasi), C06 (HalamanLogin), C08 (HalamanPortofolio), C13 (HalamanUploadJasa), C15 (HalamanPencarian), C16 (HasilPencarian), C19 (HalamanDetailJasa), C21 (HalamanBookmark), C24 (HalamanChat), C28 (HalamanPemesanan), C29 (HalamanPembayaran), C30 (HalamanRiwayatTransaksi), C35 (HalamanKonfirmasi), C37 (HalamanPengumpulan), C38 (HalamanDeliverables), C40 (HalamanRequestRevisi), C44 (HalamanPelaporan), C47 (HalamanUlasan), C50 (HalamanPengajuanMediasi), C53 (HalamanDashboardAdmin) | CLIENT (PRESENTATION LAYER) | Menjalankan seluruh halaman tampilan web dan menerima input aksi pengguna di peramban. |
| Komponen UI Autentikasi dan Akun | C04 (HalamanRegistrasi), C06 (HalamanLogin) | CLIENT (PRESENTATION LAYER) | Menampilkan formulir pendaftaran dan autentikasi masuk akun pengguna. |
| Komponen UI Portofolio dan Penawaran Jasa | C08 (HalamanPortofolio), C13 (HalamanUploadJasa) | CLIENT (PRESENTATION LAYER) | Menampilkan formulir pembuatan jasa baru dan unggah portofolio pekerja. |
| Komponen UI Pencarian, Filter dan Komparasi | C15 (HalamanPencarian), C16 (HasilPencarian), C19 (HalamanDetailJasa), C21 (HalamanBookmark) | CLIENT (PRESENTATION LAYER) | Menampilkan pencarian, saringan hasil, detail, simpanan, dan pembanding jasa. |
| Komponen UI Komunikasi Langsung | C24 (HalamanChat) | CLIENT (PRESENTATION LAYER) | Menampilkan ruang percakapan obrolan langsung antar-pengguna. |
| Komponen UI Pemesanan dan Pembayaran | C28 (HalamanPemesanan), C29 (HalamanPembayaran), C30 (HalamanRiwayatTransaksi), C35 (HalamanKonfirmasi) | CLIENT (PRESENTATION LAYER) | Menampilkan formulir pemesanan, halaman pembayaran, riwayat transaksi, dan persetujuan pesanan. |
| Komponen UI Penyerahan Hasil dan Revisi | C37 (HalamanPengumpulan), C38 (HalamanDeliverables), C40 (HalamanRequestRevisi) | CLIENT (PRESENTATION LAYER) | Menampilkan pengiriman berkas hasil kerja dan formulir permintaan perbaikan pesanan. |
| Komponen UI Evaluasi dan Ulasan Layanan | C47 (HalamanUlasan) | CLIENT (PRESENTATION LAYER) | Menampilkan formulir pemberian nilai bintang serta ulasan pekerjaan. |
| Komponen UI Pengaduan, Mediasi dan Admin | C44 (HalamanPelaporan), C50 (HalamanPengajuanMediasi), C53 (HalamanDashboardAdmin) | CLIENT (PRESENTATION LAYER) | Menampilkan formulir laporan aduan, ruang mediasi sengketa, dan dasbor kerja admin. |
| Subsistem Server Aplikasi | C01 (Pengguna), C02 (PenyediaJasa), C03 (PenggunaJasa), C05 (LayananRegistrasi), C07 (Autentikator), C09 (Portofolio), C10 (PengontrolPortofolio), C11 (LayananUploadFile), C12 (Jasa), C14 (JasaController), C17 (LayananPencarian), C18 (LayananPembandingJasa), C20 (Bookmark), C22 (PengontrolBookmark), C23 (ChatRoom), C25 (LayananPesanInstan), C26 (LayananNotifikasiChat), C27 (Pesanan), C31 (PengontrolPesanan), C32 (PengontrolTransaksi), C33 (MetodePembayaran), C34 (RiwayatTransaksi), C36 (ProdukAkhir), C39 (PengajuanRevisi), C41 (RevisiHandler), C42 (PencairanDana), C43 (TiketLaporan), C45 (LaporanHandler), C46 (Ulasan), C48 (UlasanHandler), C49 (TanggapanLaporan), C51 (MediasiHandler), C52 (Admin) | SERVER (APPLICATION / BUSINESS TIER) | Mengolah logika sistem, aturan bisnis, alur transaksi, dan kendali data di server. |
| Modul Registrasi dan Akun | C01 (Pengguna), C02 (PenyediaJasa), C03 (PenggunaJasa), C05 (LayananRegistrasi), C07 (Autentikator), C52 (Admin) | SERVER (BUSINESS LAYER) | Mengurus pendaftaran akun, cek login kata sandi, dan pembagian hak akses pengguna. |
| Modul Pencarian dan Jasa | C09 (Portofolio), C10 (PengontrolPortofolio), C12 (Jasa), C14 (JasaController), C17 (LayananPencarian), C18 (LayananPembandingJasa), C20 (Bookmark), C22 (PengontrolBookmark) | SERVER (BUSINESS LAYER) | Mengurus penayangan jasa, pencarian kata kunci, perbandingan paket, dan simpanan jasa. |
| Modul Pemesanan dan Transaksi | C27 (Pesanan), C31 (PengontrolPesanan), C32 (PengontrolTransaksi), C33 (MetodePembayaran), C34 (RiwayatTransaksi), C36 (ProdukAkhir), C39 (PengajuanRevisi), C41 (RevisiHandler), C42 (PencairanDana) | SERVER (BUSINESS LAYER) | Mengatur siklus pesanan, keamanan titip uang, alur perbaikan tugas, dan pelepasan dana. |
| Modul Komunikasi | C23 (ChatRoom), C25 (LayananPesanInstan), C26 (LayananNotifikasiChat) | SERVER (BUSINESS LAYER) | Mengatur pengiriman pesan teks langsung dan penyampaian tanda notifikasi obrolan. |
| Modul Laporan dan Mediasi | C43 (TiketLaporan), C45 (LaporanHandler), C46 (Ulasan), C48 (UlasanHandler), C49 (TanggapanLaporan), C51 (MediasiHandler) | SERVER (BUSINESS LAYER) | Mengatur tiket aduan kendala, ruang obrolan penengah, ulasan penilaian, dan sanksi akun. |
| Modul Akses Berkas dan Media | C11 (LayananUploadFile) | SERVER (DATA ACCESS LAYER) | Mengatur validasi ukuran serta proses unggah dan unduh berkas media penyimpanan. |
| Komponen Penghubung Basis Data | Akses Basis Data (PostgreSQL) | SERVER (DATA ACCESS LAYER) | Menyediakan koneksi dan eksekusi perintah data antara logika server dan basis data. |
| Subsistem Database Terpusat | C01, C02, C03, C09, C12, C20, C23, C27, C33, C34, C36, C39, C42, C43, C46, C49 | DATABASE (DATA PERSISTENCE LAYER) | Menyimpan seluruh catatan data sistem secara permanen dalam satu basis data terpusat. |
| Data Pengguna, Data Penyedia Jasa, Data Pengguna Jasa | C01 (Pengguna), C02 (PenyediaJasa), C03 (PenggunaJasa) | DATABASE (DATA PERSISTENCE LAYER) | Menyimpan data profil akun pengguna, akun pekerja, akun pembeli, dan status akun. |
| Data Jasa dan Portofolio | C09 (Portofolio), C12 (Jasa), C20 (Bookmark) | DATABASE (DATA PERSISTENCE LAYER) | Menyimpan data daftar jasa penawaran, karya portofolio, dan daftar jasa yang disimpan. |
| Data Pesanan, Riwayat Transaksi, Produk Akhir | C27 (Pesanan), C33 (MetodePembayaran), C34 (RiwayatTransaksi), C36 (ProdukAkhir), C39 (PengajuanRevisi), C42 (PencairanDana) | DATABASE (DATA PERSISTENCE LAYER) | Menyimpan data pesanan kerja, pembayaran, riwayat transaksi, berkas hasil, dan perbaikan. |
| Data Komunikasi (Chat Room) | C23 (ChatRoom) | DATABASE (DATA PERSISTENCE LAYER) | Menyimpan data ruang percakapan dan seluruh rekaman riwayat pesan teks obrolan. |
| Data Laporan dan Tanggapan Laporan | C43 (TiketLaporan), C49 (TanggapanLaporan) | DATABASE (DATA PERSISTENCE LAYER) | Menyimpan data tiket laporan masalah pengguna, bukti aduan, dan keputusan tindakan admin. |
| Data Ulasan | C46 (Ulasan) | DATABASE (DATA PERSISTENCE LAYER) | Menyimpan data skor bintang penilaian pembeli, komentar evaluasi, dan bukti hasil kerja. |


## 2.4 Model Arsitektur Perangkat Lunak

### 2.4.1 Logical View

Logical View dapat menunjukkan bagian-bagian utama dalam sistem beserta fungsi dan hubungan antarkomponennya. View ini sesuai untuk aplikasi yang dikembangkan karena dapat memperlihatkan pembagian tanggung jawab setiap komponen sehingga alur kerja sistem dapat terlihat dengan lebih jelas.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M6/assets/diagram/LogicalView.png" width="40%">
</p>
<p align="center">
<i>Gambar 2.4.1 Diagram Logical View</i>
</p>

---

### 2.4.2 Development View (Package Diagram)
Development view akan mendeskripsikan organisasi statis kode dalam package modul, subsistem, dan dependensi di dalam penerapannya. 


Package diagram adalah diagram yang menampilkan perencanaan dan pengorganisasikan elemen, modul, *package* dalam sebuah proyek perangkat lunak. Package diagram akan menampilkan structure dan dependensi antar subsistem maupun modul serta menampilkan perbedaan sudut pandang dari sistem.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M6/assets/diagram/Package Diagram.jpg" width="60%">
</p>
<p align="center">
<i>Gambar 2.4.2 Diagram Development View</i>
</p>

<br>

---


# BAB 3: Realisasi Use Case

## 3.1 Use Case Melakukan Registrasi Akun

**ID Use Case:** *UC01*  
**Nama Use Case:** *Melakukan Registrasi Akun*

### 3.1.1 Identifikasi Kelas

Tabel 3.1. Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | Pengguna | Pengguna |
| 2 | PenyediaJasa | PenyediaJasa |
| 3 | PenggunaJasa | PenggunaJasa |
| 4 | HalamanRegistrasi | HalamanRegistrasi |
| 5 | LayananRegistrasi | LayananRegistrasi |

### 3.1.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="diagram sequence registrasi" src="./assets/diagram/seqregis.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.1.2 Sequence Diagram [UC01]</i>
</p>


### 3.1.3 Diagram Kelas

<p align="center">
<img alt="diagram class uc01" src="./assets/diagram/cdregis.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.1.3. Diagram Kelas Melakukan Registrasi Akun</i>
</p>

---

## 3.2 Use Case Melakukan Login

**ID Use Case:** *UC02*  
**Nama Use Case:** *Melakukan Login*

### 3.2.1 Identifikasi Kelas

Tabel 3.2.1 Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | Pengguna | Pengguna |
| 2 | PenyediaJasa | PenyediaJasa |
| 3 | PenggunaJasa | PenggunaJasa |
| 4 | HalamanLogin | HalamanLogin |
| 5 | Autentikator | Autentikator |

### 3.2.2 Sequence Diagram
- **Skenario Normal**

<p align="center">
<img alt="diagram sequence login" src="./assets/diagram/seqlogin.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.2.2 Sequence Diagram [UC02]</i>
</p>


### 3.2.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas Melakukan Login" src="./assets/diagram/cdlogin.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.2.3. Diagram Kelas Melakukan Login</i>
</p>

---

## 3.3 Use Case Mengisi Portofolio

**ID Use Case:** *UC03*  
**Nama Use Case:** *Mengisi Portofolio*

### 3.3.1 Identifikasi Kelas

Tabel 3.3.1 Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | PenyediaJasa | PenyediaJasa |
| 2 | Portofolio | Portofolio |
| 3 | HalamanPortofolio | HalamanPortofolio |
| 4 | PengontrolPortofolio | PengontrolPortofolio |
| 5 | LayananUploadFile | LayananUploadFile |


### 3.3.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="diagram sequence portofolio" src="./assets/diagram/seqporto.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.3.2 Sequence Diagram [UC03]</i>
</p>


### 3.3.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas Mengisi Portofolio" src="./assets/diagram/cdporto.png" width="35%">
</p>
<p align="center">
<i>Gambar 3.3.3. Diagram Kelas Mengisi Portofolio</i>
</p>

---

## 3.4 Use Case Mengunggah Penawaran Jasa

**ID Use Case:** UC04  
**Nama Use Case:** Mengunggah Penawaran Jasa

### 3.4.1 Identifikasi Kelas
Tabel 3.4 Identifikasi Kelas Use Case [UC04]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | HalamanUploadJasa | HalamanUploadJasa |
| 2 | JasaController | JasaController |
| 3 | LayananUploadFile | LayananUploadFile |
| 4 | Jasa | Jasa |
| 5 | PenyediaJasa | PenyediaJasa |

### 3.4.2 Sequence Diagram

- **Skenario Normal dan Alternatif**

<p align="center">
<img alt="Sequence Diagram UC04" src="./assets/diagram/diagram-uc4.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.4.1 Sequence Diagram Mengunggah Penawaran Jasa [UC04]</i>
</p>

### 3.4.3 Diagram Kelas
<p align="center">
<img alt="Diagram Kelas UC04" src="./assets/diagram/kelas-uc4-h.svg" width="90%">
</p>
<p align="center">
<i>Gambar 3.4.2 Diagram Kelas Mengunggah Penawaran Jasa [UC04]</i>
</p>

---

## 3.5 Use Case Mencari Penawaran Jasa

**ID Use Case:** UC05  
**Nama Use Case:** Mencari Penawaran Jasa

### 3.5.1 Identifikasi Kelas
Tabel 3.5 Identifikasi Kelas Use Case [UC05]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | HalamanPencarian | HalamanPencarian |
| 2 | HasilPencarian | HasilPencarian |
| 3 | LayananPencarian | LayananPencarian |
| 4 | LayananPembandingJasa | LayananPembandingJasa |
| 5 | Jasa | Jasa |
| 6 | PenggunaJasa | PenggunaJasa |

### 3.5.2 Sequence Diagram

- **Skenario Normal dan Alternatif**

<p align="center">
<img alt="Sequence Diagram UC05" src="./assets/diagram/diagram-uc5.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.5.1 Sequence Diagram Mencari Penawaran Jasa [UC05]</i>
</p>

### 3.5.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC05" src="./assets/diagram/kelas-uc5-h.svg" width="90%">
</p>
<p align="center">
<i>Gambar 3.5.2 Diagram Kelas Mencari Penawaran Jasa [UC05]</i>
</p>

---

## 3.6 Use Case Melihat Informasi Jasa

**ID Use Case:** UC06
**Nama Use Case:** Melihat Informasi Jasa

### 3.6.1 Identifikasi Kelas
Tabel 3.6 Identifikasi Kelas Use Case [UC06]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | HalamanDetailJasa | HalamanDetailJasa |
| 2 | JasaController | JasaController |
| 3 | Jasa | Jasa |
| 4 | Ulasan | Ulasan |
| 5 | PenggunaJasa | PenggunaJasa |
| 6 | PenyediaJasa | PenyediaJasa |

### 3.6.2 Sequence Diagram

- **Skenario Normal dan Alternatif**

<p align="center">
<img alt="Sequence Diagram UC06" src="./assets/diagram/diagram-uc6.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.6.1 Sequence Diagram Melihat Informasi Jasa [UC06]</i>
</p>

### 3.6.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC06" src="./assets/diagram/kelas-uc6-h.svg" width="90%">
</p>
<p align="center">
<i>Gambar 3.6.2 Diagram Kelas Melihat Informasi Jasa [UC06]</i>
</p>

---

## 3.7 Use Case Menggunakan Bookmark

**ID Use Case:** UC07
**Nama Use Case:** Menggunakan Bookmark

### 3.7.1 Identifikasi Kelas
Tabel 3.7 Identifikasi Kelas Use Case [UC07]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | HalamanBookmark | HalamanBookmark |
| 2 | PengontrolBookmark | PengontrolBookmark |
| 3 | Bookmark | Bookmark |
| 4 | Jasa | Jasa |
| 5 | PenggunaJasa | PenggunaJasa |

### 3.7.2 Sequence Diagram

- **Skenario Normal dan Alternatif**

<p align="center">
<img alt="Sequence Diagram UC07" src="./assets/diagram/diagram-uc7.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.7.1 Sequence Diagram Menggunakan Bookmark [UC07]</i>
</p>

### 3.7.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC07" src="./assets/diagram/kelas-uc7-h.svg" width="90%">
</p>
<p align="center">
<i>Gambar 3.7.2 Diagram Kelas Menggunakan Bookmark [UC07]</i>
</p>

---

## 3.8 Use Case Melakukan Komunikasi

**ID Use Case:** *UC08*  
**Nama Use Case:** *Melakukan Komunikasi*

### 3.8.1 Identifikasi Kelas
Tabel 3.8. Identifikasi Kelas Use Case [UC08]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | ChatRoom | ChatRoom |
| 2 | HalamanChat | HalamanChat |
| 3 | LayananPesanInstan | LayananPesanInstan |
| 4 | LayananNotifikasiChat | LayananNotifikasiChat |

### 3.8.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC08" src="./assets/diagram/SequenceDiagramUC08.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.8.2 Sequence Diagram [UC08]</i>
</p>


### 3.8.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC08" src="./assets/diagram/ClassDiagramUC08.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.8.3 Diagram Kelas Melakukan Komunikasi</i>
</p>

---

## 3.9 Use Case Melakukan Pemesanan Jasa

**ID Use Case:** *UC09*  
**Nama Use Case:** *Melakukan Pemesanan Jasa*

### 3.9.1 Identifikasi Kelas

Tabel 3.9. Identifikasi Kelas Use Case [UC09]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | Pesanan | Pesanan |
| 2 | HalamanPemesanan | HalamanPemesanan |
| 3 | HalamanPembayaran | HalamanPembayaran |
| 4 |HalamanRiwayatTransaksi | HalamanRiwayatTransaksi |
| 5 | PengontrolPesanan | PengontrolPesanan |
| 6 | PengontrolTransaksi | PengontrolTransaksi |
| 7 | MetodePembayaran | MetodePembayaran |
| 8 | RiwayatTransaksi | RiwayatTransaksi |

### 3.9.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC09" src="./assets/diagram/SequenceDiagramUC09.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.9.2 Sequence Diagram [UC09]</i>
</p>

### 3.9.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC09" src="./assets/diagram/ClassDiagramUC09.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.9.3 Diagram Kelas Melakukan Pemesanan Jasa</i>
</p>

---

## 3.10 Use Case Melakukan Konfirmasi Pesanan

**ID Use Case:** *UC10*  
**Nama Use Case:** *Melakukan Konfirmasi Pesanan*

### 3.10.1 Identifikasi Kelas

Tabel 3.10. Identifikasi Kelas Use Case [UC10]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | Pesanan | Pesanan |
| 2 | PengontrolPesanan | PengontrolPesanan |
| 3 | PengontrolTransaksi | PengontrolTransaksi |
| 4 | MetodePembayaran | MetodePembayaran |
| 5 | RiwayatTransaksi | RiwayatTransaksi |
| 6 | HalamanKonfirmasi | HalamanKonfirmasi |

### 3.10.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC10" src="./assets/diagram/SequenceDiagramUC10.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.10.2 Sequence Diagram [UC10]</i>
</p>


### 3.10.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC10" src="./assets/diagram/ClassDiagramUC10.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.10.3 Diagram Kelas Melakukan Konfirmasi Pesanan</i>
</p>

---

## 3.11 Use Case Menyerahkan Hasil Pekerjaan

**ID Use Case:** UC11  
**Nama Use Case:** Menyerahkan Hasil Pekerjaan

### 3.11.1 Identifikasi Kelas

Tabel 3.11. Identifikasi Kelas Use Case [UC11]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | UploadFileHandler | LayananUploadFile |
| 2 | HalamanPengumpulan | HalamanPengumpulan |
| 3 | FinalProduct | ProdukAkhir |
| 4 | PenyediaJasa | PenyediaJasa|
| 5 | PengumpulanController | PengumpulanController |

### 3.11.2 Sequence Diagram

- **Skenario Keseluruhan**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC11_DiagramSekuens.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.11.1 Sequence Diagram [UC11]</i>
</p>



### 3.11.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC11_DiagramKelas.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.11.2 Diagram Kelas Menyerahkan Hasil pekerjaan</i>
</p>

---

## 3.12 Use Case UC12

**ID Use Case:** UC12

**Nama Use Case:** Mengonfirmasi Hasil Pekerjaan   

### 3.12.1 Identifikasi Kelas

Tabel 3.12. Identifikasi Kelas Use Case [UC12]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | HalamanDeliverables | HalamanDeliverables |
| 2 | PengontrolPesanan | PengontrolPesanan |
| 3 | Pesanan | Pesanan |
| 4 | PengontrolTransaksi | PengontrolTransaksi |
| 5 | PencairanDana | PencairanDana | 
| 6 | PenyediaJasa | PenyediaJasa |
| 7 | PenggunaJasa | PenggunaJasa |
| 8 | RevisiHandler| RevisiHandler|
| 9 | HalamanRequestRevisi | HalamanRequestRevisi | 
| 10| PengajuanRevisi | PengajuanRevisi |

### 3.12.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC12_DPPL_Normal.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.12.1 Sequence Diagram UC12 </i>
</p>

- **Skenario Alternatif : Mengajukan Revisi**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC12_DPPL_Alt.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.12.2 Sequence Diagram UC12 - Mengajukan Revisi</i>
</p>

### 3.12.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC13_DiagramKelas.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.12.3 Diagram Kelas Mengonfirmasi Hasil Pekerjaan</i>
</p>

## 3.13 Use Case Melaporkan Pengguna Lain

**ID Use Case:** UC13

**Nama Use Case:** Melaporkan Pengguna Lain

### 3.13.1 Identifikasi Kelas

Tabel 3.1. Identifikasi Kelas Use Case [UC13]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | HalamanPelaporan | HalamanPelaporan |
| 2 | LaporanHandler | LaporanHandler |
| 3 | TiketLaporan | PenggunaJasa |
| 4 | Pengguna | Pengguna (Inheritance with PenggunaJasa dan PenyediaJasa) |

### 3.13.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC13_DPPL.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.13.1 Sequence Diagram [UC13]</i>
</p>

### 3.13.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC13_DPPL-DiagramKelas.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.13.2 Diagram Kelas [Nama Uce Case]</i>
</p>

## 3.14 Use Case Memberikan Ulasan terhadap Jasa yang Dipesan

**ID Use Case:** *UC14*  
**Nama Use Case:** *Memberikan Ulasan terhadap Jasa yang Dipesan*

### 3.14.1 Identifikasi Kelas

Tabel 3.14. Identifikasi Kelas Use Case [UC014]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | PenggunaJasa | PenggunaJasa |
| 2 | HalamanRiwayatTransaksi | HalamanRiwayatTransaksi |
| 3 | HalamanUlasan | HalamanUlasan |
| 4 | UlasanHandler | UlasanHandler |
| 5 | PengontrolPesanan | PengontrolPesanan |
| 6 | Pesanan | Pesanan |
| 7 | PengontrolTransaksi | PengontrolTransaksi |
| 8 | Ulasan | Ulasan |
| 9 | RiwayatTransaksi | RiwayatTransaksi |

### 3.14.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC14_DiagramSekuens.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.14.1 Sequence Diagram [UC014]</i>
</p>


### 3.14.3 Diagram Kelas


<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC14_DiagramKelas.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.14.2 Diagram Kelas [UC14]</i>
</p>

---

## 3.15 Use Case Memproses Laporan

**ID Use Case:** *UC15*  
**Nama Use Case:** *Memproses Laporan*

### 3.15.1 Identifikasi Kelas

Tabel 3.15. Identifikasi Kelas Use Case [UC015]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | Admin | Admin |
| 2 | HalamanDashboardAdmin | HalamanDashboardAdmin |
| 3 | LaporanHandler | LaporanHandler |
| 4 | TiketLaporan | TiketLaporan |
| 5 | TanggapanLaporan | TanggapanLaporan |

### 3.15.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC15_DiagramSekuens.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.15.1 Sequence Diagram [UC015]</i>
</p>


### 3.15.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC15_DiagramKelas.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.15.2 Diagram Kelas [UC15]</i>
</p>

---

## 3.16 Use Case Memproses Laporan

**ID Use Case:** *UC16*  
**Nama Use Case:** *Melakukan Proses Mediasi*

### 3.16.1 Identifikasi Kelas

Tabel 3.16. Identifikasi Kelas Use Case [UC016]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | Admin | Admin |
| 2 | HalamanDashboardAdmin | HalamanDashboardAdmin |
| 3 | LaporanHandler | LaporanHandler |
| 4 | TiketLaporan | TiketLaporan |
| 5 | HalamanPengajuanMediasi | HalamanPengajuanMediasi |
| 6 | MediasiHandler | MediasiHandler |

### 3.16.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC16_DiagramSekuens.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.16.1 Sequence Diagram [UC016]</i>
</p>


### 3.16.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC16_DiagramKelas.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.16.2 Diagram Kelas [UC16]</i>
</p>
---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

**Bagian ini diisi dengan diagram kelas keseluruhan.**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/Keseluruhan diagram.svg" width="35%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan [Nama P/L]</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C01 | Pengguna | - nama : string <br> - email : string <br>   # password : string <br> - statusOnline : boolean <br> - statusAkun : boolean <br> - sanksi : string <br> - daftarProduk : list of string | <br> + buatAkun() : void <br> - simpanProfil() : void <br> + login() : void <br> + setStatusAkun() : void <br> + setSanksi() : void <br> + getNama() : string  <br> + getEmail() : string <br> + getStatusOnline() : string <br> + getStatusAkun() : boolean <br> | 
| C02 | PenyediaJasa | - idPenyediaJasa : string <br> - daftarPenawaranJasa : list of string <br> - pengalaman : list of string <br> - prestasi : list of string <br> - daftarProduk : list of string | <br> + isiPortofolio() : void <br> + unggahPortofolio() : void <br> + tambahPenawaranJasa() : void <br> + bukaNotifikasiPesanan() : void <br> + terimaPesanan() : void <br> + tolakPesanan() : void <br> + saveProdukAkhir(idProduk : string, idPenyediaJasa : string) : void <br> + getStatusPengerjaan() : boolean <br> + kumpulkanRevisi() : void <br> + cekPengirimanDana() : void <br> + getRevisi() : void <br> + getIdPenyediaJasa() : string <br> + getdaftarPenawaranJasa : list of string <br> + getPengalamandanPrestasi() : list of string <br> |
| C03 | PenggunaJasa | - idPenggunaJasa : string <br> - daftarJasa : list of string <br> - minatkategoriJasa : list of string <br> - statusKonfirmasi : boolean | <br> + cariJasa() : void <br> + gunakanFilter() : void <br> + bukaDetailJasa() : void <br> + bukaDaftarBoomark() : void <br> + pilihJasa() :void <br> + isiFormPemesanan() : void <br> + getStatusPengerjaan() : string <br> + getDeliverables() : list ofstring <br> + selesaikanPesanan() : void <br> + ajukanRevisi() : void <br> + beriUlasan(idPesanan: integer) : void <br> + beriPenilaian() : void <br> + pilihMetodePembayaran() : void <br> + getIdPenyediaJasa() : string <br> + getMinatKategoriJasa() : list of string <br> + getStatusKonfirmasi() : boolean <br>  |
| C04      | HalamanRegistrasi       |<br>  - formRegistrasi : Form <br> - pesanError : String  | <br> + tampilkanForm() : void <br> + kirimRegistrasi() : void <br> + tampilkanError() : void |
| C05      | LayananRegistrasi       | -                                                                       | <br> + validasiData() : boolean <br> + cekEmail() : boolean <br> + cekNoTelepon() : boolean <br> + registrasiPengguna() : void |
| C06      | HalamanLogin             | <br> - pesanError : string <br> - formLogin : string | <br> + tampilkanForm() : void <br> + kirimLogin(email : String) : void <br> +  tampilkanError() : void  |
| C07      | Autentikator             | -                                     | <br> + validasiKredensial(email : String, password : String) <br> + sesiLogin() : void           <br> |
| C08      | HalamanPortofolio        | <br> - formPortofolio : string <br> - pesanError : string        | <br> + tampilkanPortofolio() : void  <br> +  kirimPortofolio(data : Portofolio) : void <br> + tampilkanError() : void <br> |
| C09      | Portofolio               | <br> - judul : string <br> - deskripsi : string <br> - berkasPendukung : FILE  | <br> + simpanPortofolio() : void <br> |
| C10      | PengontrolPortofolio     | -                                 | <br> + validasiInputBerkas(data : Portofolio) : boolean <br> + simpanPortofolio() : void <br>|
| C11      | LayananUploadFile        | -                                 | <br> + getStatusUpload() : String <br> + validasiFormatUkuran(file : FILE) : boolean <br> + saveDeliverables(file :FILE) : string  <br> + uploadFile(berkas: FILE) : void |
| C12 | Jasa | - idJasa : string <br> - idPenyediaJasa : string <br> -  namaJasa : string <br> -  deskripsi : string <br> -  kategori : string <br> - harga : double <br> - statusAktif : boolean | <br> + simpanJasa() : void <br> + dapatkanDetailJasa(dataJasa : string) : Jasa <br> + perbaruiJasa(dataJasa : string) : void <br> + hapusJasa(dataJasa : string) : void <br> |
| C13 | HalamanUploadJasa | - formNamaJasa : void <br> - formKategori : void <br> - formDeskripsi : void <br> - formHarga : void <br> - inputUploadBerkas : void <br> - tombolUnggah : void <br> - pesanError : string |  <br> + klikUnggah() : void <br> +  tampilkanPesanError() : void <br> + tampilkanNotifikasiBerhasil() : void <br> |
| C14 | JasaController | - | <br> + ambilDetailJasa(idJasa: string) : Jasa <br> + validasiDataJasa(dataJasa : string) : boolean <br> + simpanPenawaranJasa(dataJasa : string) : void |
| C15 | HalamanPencarian | <br> - searchBar : void <br> - filterHarga : void <br> - filterDurasi : void <br> - filterRating : void <br> - tombolCari : void <br> - pesanError : string | <br> + inputKataKunci() : void <br> + klikCari() : void <br> + tampilkanPesanError(pesan : string) : void |
| C16 | HasilPencarian | <br> - daftarListingJasa : list of jasa <br> - tombolBandingkan : void | <br> + tampilkanDaftarHasil() : void <br> + pilihJasaUntukDibandingkan() : void <br> + klikBandingkan() : void |
| C17 | LayananPencarian | - | <br> + cariJasaBerdasarkanKeyword(keyword : string) : list of Jasa <br> + terapkanFilterPencarian(filter : string) : list of Jasa |
| C18 | LayananPembandingJasa | - | <br> + bandingkanSpesifikasiJasa(idJasa1 : string, idJasa2 : string) : string |
| C19 | HalamanDetailJasa | <br> - tampilanDeskripsi : string <br> - tampilanHarga : double <br> - infoProfilPenyedia : string <br> - tampilanRiwayatUlasan : list of string <br> - pesanError : string | <br> + tampilkanDetailJasa() : void <br> +  tampilkanPesanError() : void |
| C20 | Bookmark | <br> - idBookmark : string <br> - idPenggunaJasa : string <br> - idJasa : string <br> - waktuDisimpan : Date <br> - daftarBookmark : list of bookmark | <br> + simpanBookmark() : boolean <br> + hapusBookmark() : boolean <br> + lihatBookmark() : list of String |
| C21 | HalamanBookmark | <br> - daftarJasaTersimpan : list of Jasa <br> - ikonBookmarkAktif : void <br> - ikonBookmarkNonaktif : void <br> - tombolHapusBookmark : void | <br> + tampilkanDaftarTersimpan() : void  <br> + klikIkonBookmark() : void <br> + klikIkonHapus() : void <br> + tampilkanNotifikasi() : void |
| C22 | PengontrolBookmark | - | <br> + tambahDataBookmark() : boolean <br> + hapusDataBookmark() : boolean <br> + ambilDaftarBookmarkPengguna() : list of Bookmark |
| C23 | ChatRoom | <br> - idChatRoom : string <br> - idAnggota : string <br> - riwayatPesan : list of string <br> - waktuDibuat : Date | <br> + getRiwayatPesan() : list of string <br> - simpanPesan() : void <br> + getidChatRoom() : string <br> + getidAnggota() : string |
| C24 | HalamanChat | - idSesiChat : string <br> - inputPesan : string <br> - statusKoneksi : string | <br> + tampilkanMenuChat() : void <br> + tampilkanRiwayatPesan() : void <br> + inputPesan() : void <br> + tombolKirimTerklik() : void <br> + tampilkanPesanError() : void <br> + tampilkanStatusBelumTerkirim() : void |
| C25 | LayananPesanInstan | - | <br> + buatSesiChat() : void <br> + validasiInputPesan() : boolean <br> + kirimPesan() : void <br> + simpanKeDatabase() : void <br> + updateStatusBaca() : void |
| C26 | LayananNotifikasiChat | - | <br> + kirimNotifikasiPesan() : void <br> + tampilkanPopUpNotifikasi() : void |
| C27 | Pesanan | <br> - idPesanan : string <br> - idPenggunaJasa : string <br> - idPenyediaJasa : string <br> - idJasa : string <br> - brief : string <br> - totalBiaya : double <br> - statusPesanan : boolean |  <br> + setStatusDiproses()  : void <br> + setStatusSelesai(): void |
| C28 | HalamanPemesanan | <br> - idJasaDipilih : string <br> - briefPemesanan : string | <br> + tampilkanFormPemesanan() : void <br> + inputBriefPemesanan() : void <br> + tombolPesanTerklik() : void |
| C29 | HalamanPembayaran | <br> - totalHarga : Double <br> - idMetodePembayaran : string | <br> + tampilkanPilihanPembayaran() : void <br> + tampilkanRincianPembayaran() : void <br> + tombolBayarTerklik() : void <br> + tampilkanNotifikasiBerhasil() : void |
| C30 | HalamanRiwayatTransaksi | <br> - idTransaksi : string | <br> + tampilkanRiwayatTransaksi() : void |
| C31 | PengontrolPesanan | - | <br> + buatPesananBaru() : void <br> +  hitungTotalBiaya() : double <br> + updateStatusPesanan(idPesanan: integer, status: STATUS) : void <br> + getDetailPesanan() : string |
| C32 | PengontrolTransaksi | - | <br> + prosesPembayaran() : void <br> + validasiPembayaran() : boolean <br> +  updateStatusPembayaran() : void <br> + setPencairanDana(selesai : boolean) : void <br> + catatRiwayatTransaksi(idPesanan : string) : void |
| C33 | MetodePembayaran | <br> - idMetode : string <br> - namaMetode : string <br> - nomorRekeningVA : string | <br> + getDetailMetode() : MetodePembayaran |
| C34 | RiwayatTransaksi | <br> - idRiwayat : string <br> - idPesanan : string <br> - tanggalTransaksi : DATE <br> - statusTransaksi : boolean | <br> + simpanTransaksi() : void |
| C35 | HalamanKonfirmasi | <br> - idPesanan : string <br> - detailBrief : string | <br> + tampilkanDetailPesanan() : void <br> + tombolTerimaTerklik() : void <br> + tombolTolakTerklik() : void <br> + tampilkanStatusPesanan() : void |
| C36 | ProdukAkhir | <br> -idProdukAkhir : string <br> - idPesanan : string <br> - outputpath : string <br> - deskripsiProdukAkhir : string  <br>- tanggalPengumpulan : Date <br> - statusPemeriksaan : boolean <br> - fileURL : string | <br> + simpanProdukAkhir(deskripsi : string, filepath : string, link : string) : void  <br> + updateStatusPengerjaan() <br> + getDetailProduk()  | 
| C37 | HalamanPengumpulan | <br> - deskripsiHasil : string <br> - fileURL : string <br> - tombolKirim : void <br> - pesanError : string  | <br> + tampilkanFormPengumpulan() : void <br> + inputDeskripsiHasil() : string <br> + unggahDeliverables() : FILE <br> + tampilkanPesanError(pesanError : string) : void <br> + klikKirimHasil() : boolean <br> + inputLink() : string <br> + tampilkanStatusPengiriman(terkirim : boolean) : void |
| C38 | HalamanDeliverables | <br> - deskripsiHasil : void <br> - fileURL : string <br> - tombolKonfirmasi : void <br> - tombolRevisi : void <br> - jumlahRevisi : int <br> - pesanError : string <br> - tombolBantuan : void <br> - lampiranDeliverables : FILE | <br> + tampilkanDeliverables() : void <br> + ajukanRevisi() : void <br> + konfirmasiPesanan() : void <br> + tampilkanError(msg : string) : void  |
| C39 | PengajuanRevisi | <br> - deskripsiRevisi : string <br> - jmlRevisiTersedia : int <br> - lampiranRevisi : FILE <br> - idRevisi : string <br> - idPesanan : string <br> - statusPengerjaan : string| <br> + getDetailRevisi() : string  |
| C40 | HalamanRequestRevisi | <br> - formRevisi : void <br> - detailRevisi : void <br> - kuotaRevisi : int <br> - tombolRevisi : elemt <br> - pesanUntukPenyedia : string | <br> + tampilkanformRevisi() : void <br> + tampilkanFieldPengisianRevisi() : void <br> + tampilkanKuotaRevisi() : void <br> + kirimRevisi() : void <br> + tampilkanPesan() : void  |
| C41 | RevisiHandler | - | <br> + isRevisiRequestValid() : void <br> +  sendRevisi() : void <br> + sendNotifikasiRevisi() : void <br> + updateStatusPengerjaan() : void  |
| C42 | PencairanDana | <br> - stateTransaksi : boolean <br> - statePencairanDana : boolean | - |
| C43 | TiketLaporan | - idTiket : string <br> - deskripsiLaporan : string <br> - urlBukti : string <br> - lampiranBukti : FILE <br> - statusTiket : boolean <br> - TanggapanAdmin : string | + getDetailTiket() : void <br> + createTiket() : void <br> +  UpdateStatusTiket() : void <br> +  saveTanggapan() : void <br> + saveStatusTindakan() : void  |
| C44 | HalamanPelaporan | <br> - formLaporan : void <br> - kategoriPelanggaran : void <br> - deskripsiPelanggaran : void <br> - kolomBukti : void <br> - statusLaporan : boolean <br> - noTiket : string <br> - pesanError : string <br> - tanggapanAdmin : string | <br> + tampilkanFormLaporan() : void <br> +  tampilkanTiketdanTanggapan() : void <br>  + tampilkanPesanError() : void  | 
| C45 | LaporanHandler  | - | + validasiFormatLaporan() : boolean <br> + kirimNotifAdmin() : void <br> + simpanData() : void <br> + banPengguna() : void <br> + skorsPengguna() : void <br> + kirimTanggapan() : void <br> + saveTanggapan() : void <br> + saveLaporan() : void <br> + updateStatusTiket() : void <br> + getDetailTiket() : void |
| C46 | Ulasan | <br> - idUlasan : string <br> - idPesanan : string <br> - idPenyediaJasa : string <br> - rating : integer <br> - komentar : string <br> - dokumentasi : FILE | <br> + simpanUlasan() : void <br> + getDetailUlasan() |
| C47 | HalamanUlasan | <br> - rating : integer <br> - teksKomentar : string <br> - fileDokumentasi : FILE <br> - pesanError : string | <br> + tampilkanFormUlasan() : void <br> + inputRatingBintang(rating: integer) : void <br> + inputKomentar(teksKomentar: string) : void <br> + unggahDokumentasi(fileDokumentasi: FILE) : void <br> + submitUlasan() : void <br> + tampilkanPesanError() : void <br> + tampilkanNotifikasiBerhasil() : void |
| C48 | UlasanHandler | - | <br> + validasiKelengkapanRating(rating: integer) : boolean <br> + validasiFormatBerkas(fileDokumentasi: FILE) : boolean <br> + validasiPanjangKomentar(teksKomentar: string) : boolean <br> + prosesUlasan(idPesanan: integer, rating: integer, teksKomentar: string, fileDokumentasi: FILE) : void <br> + perbaruiRating(idPenyediaJasa: integer, rating: integer) : void |
| C49 | TanggapanLaporan | - idTanggapan : string <br> - idTiket : string <br> - jenisTindakan : TINDAKAN <br> - catatanTanggapan : string | <br> - catatKeputusanTindakan() : void <br> - getDetailTanggapan() : void |
| C50 | HalamanPengajuanMediasi | + detailPelaporan <br> + riwayatPesan <br> + opsiTindakan <br> + pesanError | - |
| C51 | MediasiHandler | - idSesiMediasi : string | - inputTindakan() : void <br> - akhiriMediasi() : void <br> - tampilkanPesanError(pesanError: string) : void <br> - tampilkanNotifikasiSelesai() : void <br> + UpdateStatusTiket() : void |
| C52 | Admin | - idAdmin : string | + mulaiMediasi() : void <br> + bukaTiketLaporan() : void <br> + selesaikanLaporan() : void <br> + kirimPesanMediasi() : void <br> + pilihJenisTindakan() : void <br> + akhiriMediasi() : void |
| C53 | HalamanDashboardAdmin | - daftarTiket : list of TiketLaporan <br> - detailTiket : TiketLaporan <br> - opsiTindakan : TINDAKAN <br> - pesanError : string | + tampilkanDetailTiket() : void <br> + inputTindakan() : void <br> + selesaikanTiket() : void <br> + mulaiMediasi() : void <br> + tampilkanPesanError() : void <br> + tampilkanHalamanMediasi() : void |
| C54 | PengumpulanController | - | <br> + validasiDeskripsi() : boolean <br> + validasiPengumpulan() : boolean |

---

# BAB 5: Perancangan Rinci Kelas

Bagian ini diisi dengan daftar seluruh kelas dalam tabel berikut:

Tabel 5.1. Daftar Kelas Perancangan dan Kelas Analisis Terkait

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL atau -]* |
| 2 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL atau -]* |
| ... | *...* | *...* |

Untuk **setiap kelas**, identifikasi operasi berdasarkan tanggung jawab kelas beserta *visibility*-nya, serta atribut beserta *visibility* dan tipenya. Buat subbab tersendiri untuk setiap kelas.

## 5.36 Kelas ProdukAkhir

**Nama Kelas:** ProdukAkhir  
**ID Kelas:** C36

Tabel 5.36.1. Operasi Kelas C36

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| simpanProdukAkhir(deskripsi : string, filepath : string, link : string) : void | public | Menyimpan rincian hasil pekerjaan (produk akhir) beserta URL atau path file ke dalam basis data. |
| updateStatusPengerjaan() : void | public | Memperbarui status pemeriksaan produk akhir. |
| getDetailProduk() : string | public | Mengembalikan data dan informasi lengkap dari produk akhir yang dikumpulkan. |

Tabel 5.36.2. Atribut Kelas ProdukAkhir

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idProdukAkhir | private | string |
| idPesanan | private | string |
| outputpath | private | string |
| deskripsiProdukAkhir | private | string |
| tanggalPengumpulan | private | DATE |
| statusPemeriksaan | private | boolean |
| fileURL | private | string |

### 5.36.1 Algoritma/Query

**Nama Kelas:** ProdukAkhir     
**Nama Operasi:** simpanProdukAkhir     
**ID Algoritma:** Algo-3601

```pseudocode
INPUT: deskripsi (string), filepath (string), link (string)
OUTPUT: void

1. IF deskripsi EMPTY OR filepath EMPTY OR link EMPTY THEN
2.      THROW Exception "Parameter input tidak valid."
3.
4. idProdukAkhir = GENERATE_UUID()
5. idPesanan = Session.getCurrentPesananId()
6. tanggalPengumpulan = GET_CURRENT_DATE()
7. statusPemeriksaan = false
8.
9. hasilQuery = EXECUTE Query Q-3601 WITH (idProdukAkhirBaru, idPesananAktif, filepath, deskripsi, tanggalSekarang, statusAwal, link)
10.
11. IF hasilQuery == true THEN
12.      RETURN
13.  ELSE
14.      THROW Exception "Gagal menyimpan data produk akhir."
```

Tabel 5.36.3. Query Operasi simpanProdukAkhir

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3601 | INSERT INTO produk_akhir (id_produk_akhir, id_pesanan, outputpath, deskripsi_produk, tanggal_pengumpulan, status_pemeriksaan, file_url) VALUES (?, ?, ?, ?, ?, ?, ?); | Menyimpan produk akhir ke dalam *database* terpusat. |

### 5.36.2 Algoritma/Query

**Nama Kelas:** ProdukAkhir     
**Nama Operasi:** updateStatusPengerjaan    
**ID Algoritma:** Algo-3602

```pseudocode
INPUT: void
OUTPUT: void

1. idProdukAkhir = Session.getCurrentProdukAkhirId()
2. 
3. hasilQuery = EXECUTE Q-3602 WITH (idProdukAkhir)
4. 
5. IF hasilQuery == true THEN
6.      RETURN
7. ELSE
8.      THROW Exception "Gagal memperbarui status pengerjaan."
```

Tabel 5.36.4. Query Operasi simpanProdukAkhir

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3602 | UPDATE produk_akhir SET status_pemeriksaan = true WHERE id_produk_akhir = ?; | Memperbarui status produk akhir menjadi sudah diperiksa/selesai. |

### 5.36.3 Algoritma/Query

**Nama Kelas:** ProdukAkhir     
**Nama Operasi:** getDetailProduk    
**ID Algoritma:** Algo-3603

```pseudocode
INPUT: void
OUTPUT: string

1. idProdukAkhir = Session.getCurrentProdukAkhirId()
2. 
3. hasilQuery = EXECUTE Q-3603 WITH (idProdukAkhir)
4.
5. IF hasilQuery IS NOT EMPTY THEN
6.      data = FORMAT_TO_JSON(hasilQuery.outputpath, hasilQuery.deskripsi_produk, hasilQuery.tanggal_pengumpulan, hasilQuery.status_pemeriksaan, hasilQuery.file_url)
7.      RETURN data
8. ELSE
9.      RETURN ""
```

Tabel 5.36.5. Query Operasi simpanProdukAkhir

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3603 | SELECT outputpath, deskripsi_produk, tanggal_pengumpulan, status_pemeriksaan, file_url FROM produk_akhir WHERE id_produk_akhir = ?; | Mengambil seluruh informasi mengenai produk akhir untuk dikembalikan dalam bentuk string. |

## 5.39 Kelas PengajuanRevisi

**Nama Kelas:** PengajuanRevisi     
**ID Kelas:** C39

Tabel 5.39.1. Operasi Kelas C39

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| getDetailRevisi() : string | public | Mengambil detail informasi pengajuan revisi (deskripsi masalah, sisa kuota revisi, dan lampiran). |

Tabel 5.39.2. Atribut Kelas PengajuanRevisi

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| deskripsiRevisi | private | string |
| jmlRevisiTersedia | private | int |
| lampiranRevisi | private | FILE |
| idRevisi | private | string |
| idPesanan | private | string |
| statusPengerjaan | private | string |

### 5.39.1 Algoritma/Query

**Nama Kelas:** PengajuanRevisi     
**Nama Operasi:** getDetailRevisi        
**ID Algoritma:** Algo-3901

```pseudocode
INPUT: void
OUTPUT: string

1. idRevisi = Session.getCurrentRevisiId()
2. 
3. hasilQuery = EXECUTE Q-3901 WITH (idRevisi)
4.
5. IF hasilQuery IS NOT EMPTY THEN
6.      data = FORMAT_TO_JSON(hasilQuery.deskripsi_revisi, hasilQuery.jml_revisi_tersedia, hasilQuery.lampiran_revisi, hasilQuery.status_pengerjaan)
7.      RETURN data
8. ELSE
9.      RETURN ""
```

Tabel 5.39.1.1. Query Operasi getDetailRevisi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-C3901 | SELECT deskripsi_revisi, jml_revisi_tersedia, lampiran_revisi, status_pengerjaan FROM pengajuan_revisi WHERE id_revisi = ?; | Mengambil detail informasi revisi berdasarkan ID revisi yang dipanggil. |

## 5.41 Kelas RevisiHandler

**Nama Kelas:** RevisiHandler      
**ID Kelas:** C41

Tabel 5.41.1. Operasi Kelas C41

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| isRevisiRequestValid() : boolean | public | Memvalidasi apakah pengajuan revisi masih diperbolehkan. |
| sendRevisi(deskripsiRevisi : string, lampiranRevisi : FILE) : void | public | Menyimpan data pengajuan revisi ke dalam *database*. |
| sendNotifikasiRevisi() : void | public | Mengirim notifikasi kepada penyedia jasa bahwa terdapat permintaan revisi dari pengguna jasa. |
| updateStatusPengerjaan(statusBaru : string) : void | public | Memperbarui status pengerjaan pesanan menjadi sedang direvisi. |

### 5.41.1 Algoritma/Query

**Nama Kelas:** RevisiHandler     
**Nama Operasi:** isRevisiRequestValid         
**ID Algoritma:** Algo-4101

```pseudocode
INPUT: void
OUTPUT: boolean

1. idPesanan = Session.getCurrentPesananId()
2. hasilQuery = EXECUTE Q-4101 WITH (idPesanan)
3. IF hasilQuery IS NOT EMPTY AND hasilQuery.jml_revisi_tersedia > 0 THEN
4.      RETURN true
5. ELSE
6.      RETURN false
```

Tabel 5.41.2. Query Operasi isRevisiRequestValid

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4101 | SELECT jml_revisi_tersedia FROM pengajuan_revisi WHERE id_pesanan = ?; | Mengambil jumlah sisa kuota revisi yang tersedia untuk pesanan terkait. |

### 5.41.2 Algoritma/Query

**Nama Kelas:** RevisiHandler     
**Nama Operasi:** sendRevisi         
**ID Algoritma:** Algo-4102

```pseudocode
INPUT: deskripsiRevisi (string), lampiranRevisi (FILE)
OUTPUT: void

1. IF deskripsiRevisi EMPTY THEN
2.      THROW Exception "Deskripsi revisi tidak boleh kosong."
3. 
4. idRevisi = GENERATE_UUID()
5. idPesanan = Session.getCurrentPesananId()
6. statusPengerjaan = "Sedang Direvisi"
7.
8. hasilQuery = EXECUTE Q-4102 WITH (idRevisi, idPesanan, deskripsiRevisi, lampiranRevisi, statusPengerjaan)
9. IF hasilQuery == true THEN
10.      RETURN
11. ELSE
12.     THROW Exception "Gagal mengirimkan pengajuan revisi."
```

Tabel 5.41.3. Query Operasi sendRevisi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4102 | INSERT INTO pengajuan_revisi (id_revisi, id_pesanan, deskripsi_revisi, lampiran_revisi, status_pengerjaan) VALUES (?, ?, ?, ?, ?); | Menyimpan rincian permintaan revisi baru ke dalam tabel pengajuan_revisi pada *database*. |

### 5.41.3 Algoritma/Query

**Nama Kelas:** RevisiHandler     
**Nama Operasi:** sendNotifikasiRevisi         
**ID Algoritma:** Algo-4103

```pseudocode
INPUT: void
OUTPUT: void

1. idNotifikasi = GENERATE_UUID()
2. idPesanan = Session.getCurrentPesananId()
3. pesan = "Anda mendapatkan permintaan revisi baru."
4.
5. hasilQuery = EXECUTE Q-4103 WITH (idNotifikasi, idPesanan, pesan)
6. IF hasilQuery == true THEN
7.      RETURN
8. ELSE
9.      THROW Exception "Gagal mengirimkan notifikasi revisi."
```

Tabel 5.41.4. Query Operasi sendNotifikasiRevisi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4103 | INSERT INTO notifikasi (id_notifikasi, id_pesanan, pesan_notifikasi) VALUES (?, ?, ?); | Mencatat data notifikasi ke database agar dimunculkan pada antarmuka penyedia jasa. |

### 5.41.4 Algoritma/Query

**Nama Kelas:** RevisiHandler     
**Nama Operasi:** updateStatusPengerjaan         
**ID Algoritma:** Algo-4104

```pseudocode
INPUT: statusBaru (string)
OUTPUT: void

1. idRevisi = Session.getCurrentRevisiId()
2.
3. hasilQuery = EXECUTE Q-4104 WITH (statusBaru, idRevisi)
4. IF hasilQuery == true THEN
5.      RETURN
6. ELSE
7.      THROW Exception "Gagal memperbarui status pengerjaan revisi."
```

Tabel 5.41.5. Query Operasi updateStatusPengerjaan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4104 | UPDATE pengajuan_revisi SET status_pengerjaan = ? WHERE id_revisi = ?; | Memperbarui atribut status pengerjaan revisi setelah penyedia jasa merespons atau mengumpulkan ulang berkas. |

## 5.42 Kelas PencairanDana

**Nama Kelas:** PencairanDana      
**ID Kelas:** C42

Tabel 5.42.2. Atribut Kelas PencairanDana

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| stateTransaksi | private | boolean |
| statePencairanDana | private | boolean |

## 5.43 Kelas TiketLaporan

**Nama Kelas:** TiketLaporan      
**ID Kelas:** C43

Tabel 5.43.1. Operasi Kelas C43

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| getDetailTiket(idTiket : string) : string | public | Mengembalikan rincian data keluhan atau laporan pengguna berdasarkan ID tiket. |
| createTiket(deskripsi : string, urlBukti : string, lampiran : FILE) : void | public | Menyimpan data tiket pelaporan baru dari pengguna. |
| UpdateStatusTiket(statusBaru : boolean) : void | public | Memperbarui status tiket. |
| saveTanggapan(tanggapanAdmin : string) : void | public | Menyimpan tanggapan atau respons teks dari Admin terkait laporan. |
| saveStatusTindakan(jenisTindakan : string, catatan : string) : void | public | Mencatat keputusan akhir/sanksi yang diambil Admin terhadap pihak terlapor. |

Tabel 5.43.2. Atribut Kelas TiketLaporan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idTiket | private | string |
| deskripsiLaporan | private | string |
| urlBukti | private | string |
| lampiranBukti | private | FILE |
| statusTiket | private | boolean |
| TanggapanAdmin | private | string |

### 5.43.1 Algoritma/Query

**Nama Kelas:** TiketLaporan     
**Nama Operasi:** getDetailTiket         
**ID Algoritma:** Algo-4301

```pseudocode
INPUT: idTiket (string)
OUTPUT: string

1. hasilQuery = EXECUTE Q-4301 WITH (idTiket)
2. IF hasilQuery IS NOT EMPTY THEN
3.      data = FORMAT_TO_JSON(hasilQuery.deskripsi_laporan, hasilQuery.url_bukti, hasilQuery.lampiran_bukti, hasilQuery.status_tiket, hasilQuery.tanggapan_admin)
4.      RETURN data
5. ELSE
6.      RETURN ""
```

Tabel 5.43.3. Query Operasi getDetailTiket

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4301 | SELECT deskripsi_laporan, url_bukti, lampiran_bukti, status_tiket, tanggapan_admin FROM tiket_laporan WHERE id_tiket = ?; | Mengambil isi keluhan dan status penyelesaian tiket berdasarkan ID tiket. |

### 5.43.2 Algoritma/Query

**Nama Kelas:** TiketLaporan     
**Nama Operasi:** createTiket         
**ID Algoritma:** Algo-4302

```pseudocode
INPUT: deskripsiLaporan (string), urlBukti (string), lampiranBukti (FILE)
OUTPUT: void

1. IF deskripsiLaporan EMPTY THEN
2.      THROW Exception "Deskripsi laporan tidak boleh kosong."
3.
4. idTiket = GENERATE_UUID()
5. statusAwal = false
6.
7. hasilQuery = EXECUTE Query Q-4302 WITH (idTiket, deskripsiLaporan, urlBukti, lampiranBukti, statusAwal)
8. IF hasilQuery == true THEN
9.      RETURN
10. ELSE
11.     THROW Exception "Gagal membuat tiket laporan."
```

Tabel 5.43.4. Query Operasi createTiket

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4302 | INSERT INTO tiket_laporan (id_tiket, deskripsi_laporan, url_bukti, lampiran_bukti, status_tiket) VALUES (?, ?, ?, ?, ?); | Menginput aduan baru ke dalam *database*. |

### 5.43.3 Algoritma/Query

**Nama Kelas:** TiketLaporan     
**Nama Operasi:** UpdateStatusTiket         
**ID Algoritma:** Algo-4303

```pseudocode
INPUT: statusBaru (boolean)
OUTPUT: void

1. idTiket = Session.getCurrentTiketId()
2. hasilQuery = EXECUTE Q-4303 WITH (statusBaru, idTiket)
3.
4. IF hasilQuery == true THEN
5.      RETURN
6. ELSE
7.      THROW Exception "Gagal memperbarui status tiket."
```

Tabel 5.43.5. Query Operasi UpdateStatusTiket

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4303 | UPDATE tiket_laporan SET status_tiket = ? WHERE id_tiket = ?; | Mengubah atribut status_tiket ketika mediasi atau pelaporan selesai ditangani. |

### 5.43.4 Algoritma/Query

**Nama Kelas:** TiketLaporan     
**Nama Operasi:** saveTanggapan         
**ID Algoritma:** Algo-4304

```pseudocode
INPUT: tanggapanAdmin (string)
OUTPUT: void

1. idTiket = Session.getCurrentTiketId()
2. hasilQuery = EXECUTE Q-4304 WITH (tanggapanAdmin, idTiket)
3.
4. IF hasilQuery == true THEN
5.      RETURN
6. ELSE
7.      THROW Exception "Gagal menyimpan tanggapan admin."
```

Tabel 5.43.6. Query Operasi saveTanggapan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4304 | UPDATE tiket_laporan SET tanggapan_admin = ? WHERE id_tiket = ?; | Menyimpan pesan tanggapan dari Admin. |

### 5.43.5 Algoritma/Query

**Nama Kelas:** TiketLaporan     
**Nama Operasi:** saveStatusTindakan         
**ID Algoritma:** Algo-4305

```pseudocode
INPUT: jenisTindakan (string), catatanTanggapan (string)
OUTPUT: void

1. idTanggapan = GENERATE_UUID()
2. idTiket = Session.getCurrentTiketId()
3. hasilQuery = EXECUTE Q-4305 WITH (idTanggapan, idTiket, jenisTindakan, catatanTanggapan)
4.
5. IF hasilQuery == true THEN
6.      RETURN
7. ELSE
8.      THROW Exception "Gagal menyimpan status tindakan laporan."
```

Tabel 5.43.7. Query Operasi saveStatusTindakan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4305 | INSERT INTO tanggapan_laporan (id_tanggapan, id_tiket, jenis_tindakan, catatan_tanggapan) VALUES (?, ?, ?, ?); | Mencatat bentuk sanksi yang diputuskan oleh Admin. |

## 5.45 Kelas LaporanHandler

**Nama Kelas:** LaporanHandler      
**ID Kelas:** C45

Tabel 5.45.1. Operasi Kelas C45

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| validasiFormatLaporan(deskripsi : string, urlBukti : string) : boolean |	public | Memvalidasi kelengkapan format deskripsi laporan dan tautan bukti dari pengguna. |
| kirimNotifAdmin(idTiket : string) : void | public | Mengirimkan notifikasi tiket laporan baru kepada pihak Admin. |
| simpanData(idTiket : string, deskripsi : string, urlBukti : string) : void | public | Menyimpan data tiket laporan baru ke dalam *database*. |
| banPengguna(idPengguna : string) : void | public | Memblokir secara permanen akun pengguna yang terbukti melanggar aturan. |
| skorsPengguna(idPengguna : string) : void | public | Memberikan sanksi pembekuan sementara akun pengguna. |
| kirimTanggapan(idTiket : string, tanggapan : string) : void | public | Mengirimkan notifikasi dan teks tanggapan laporan kepada pelapor. |
| saveTanggapan(idTiket : string, tanggapan : string) : void | public | Menyimpan teks tanggapan Admin terkait laporan ke *database*. |
| saveLaporan(idTiket : string, deskripsi : string, urlBukti : string) : void | public | Memproses penambahan tiket laporan ke *database* terpusat. |
| updateStatusTiket(idTiket : string, status : boolean) : void | public | Memperbarui status penanganan tiket laporan pada *database*. |
| getDetailTiket(idTiket : string) : string | public | Mengambil detail informasi laporan dari tiket terkait. |

### 5.45.1 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** validasiFormatLaporan         
**ID Algoritma:** Algo-4501

```pseudocode
INPUT: deskripsi (string), urlBukti (string)
OUTPUT: boolean

1. IF deskripsi IS EMPTY OR LENGTH(deskripsi) < 10 THEN
2.      RETURN false
3.
4. IF urlBukti IS NOT EMPTY AND IS_VALID_URL(urlBukti) THEN
5.      RETURN false
6. ELSE
7.      RETURN true
```

### 5.45.2 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** kirimNotifAdmin         
**ID Algoritma:** Algo-4502

```pseudocode
INPUT: idTiket (string)
OUTPUT: void

1. idNotifikasi = GENERATE_UUID()
2. pesan = "Tiket laporan baru membutuhkan penanganan: " + idTiket
3.
4. hasilQuery = EXECUTE Q-4502 WITH (idNotifikasi, idTiket, pesan)
5.
6. IF hasilQuery == true THEN
7.      RETURN
8. ELSE
9.      THROW Exception "Gagal mengirimkan notifikasi kepada admin."
```

Tabel 5.45.2. Query Operasi kirimNotifAdmin

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4502 | INSERT INTO notifikasi (id_notifikasi, id_referensi, pesan_notifikasi) VALUES (?, ?, ?); | Menyimpan notifikasi laporan baru untuk diproses oleh admin. |

### 5.45.3 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** simpanData            
**ID Algoritma:** Algo-4503

```pseudocode
INPUT: idTiket (string), deskripsi (string), urlBukti (string)
OUTPUT: void

1. statusAwal = false
2. hasilQuery = EXECUTE Q-4503 WITH (idTiket, deskripsi, urlBukti, statusAwal)
3.
4. IF hasilQuery == true THEN
5.      RETURN
6. ELSE
7.      THROW Exception "Gagal menyimpan data laporan."
```

Tabel 5.45.3. Query Operasi simpanData

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4503 | INSERT INTO tiket_laporan (id_tiket, deskripsi_laporan, url_bukti, status_tiket) VALUES (?, ?, ?, ?); | Menginput data aduan baru ke *database* terpusat. |

### 5.45.4 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** banPengguna            
**ID Algoritma:** Algo-4504

```pseudocode
INPUT: idPengguna (string)
OUTPUT: void

1. statusAkunBaru = false
2. sanksiBaru = "Banned"
3.
4. hasilQuery = EXECUTE Q-4504 WITH (statusAkunBaru, sanksiBaru, idPengguna)
5
6. IF hasilQuery == true THEN
7.      RETURN
8. ELSE
9.      THROW Exception "Gagal memblokir akun pengguna."
```

Tabel 5.45.4. Query Operasi banPengguna

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4504 | UPDATE pengguna SET status_akun = ?, sanksi = ? WHERE id_pengguna = ?; | Menonaktifkan akun pengguna dan mencatat status sanksi pemblokiran permanen. |

### 5.45.5 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** skorsPengguna            
**ID Algoritma:** Algo-4505

```pseudocode
INPUT: idPengguna (string)
OUTPUT: void

1. statusAkunBaru = false
2. sanksiBaru = "Suspended Temporary"
3. hasilQuery = EXECUTE Q-4505 WITH (statusAkunBaru, sanksiBaru, idPengguna)
4.
5. IF hasilQuery == true THEN
6.      RETURN
7. ELSE
8.      THROW Exception "Gagal memberikan skorsing pengguna."
```

Tabel 5.45.5. Query Operasi skorsPengguna

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4505 | UPDATE pengguna SET status_akun = ?, sanksi = ? WHERE id_pengguna = ?; | Mengubah status akun menjadi dibekukan sementara. |

### 5.45.6 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** kirimTanggapan            
**ID Algoritma:** Algo-4506

```pseudocode
INPUT: idTiket (string), tanggapan (string)
OUTPUT: void

1. idNotifikasi = GENERATE_UUID()
2. pesan = "Tanggapan laporan tiket " + idTiket + ": " + tanggapan
3.
4. hasilQuery = EXECUTE Q-4506 WITH (idNotifikasi, idTiket, pesan)
5.
6. IF hasilQuery == true THEN
7.      RETURN
8. ELSE
9.      THROW Exception "Gagal mengirim notifikasi tanggapan laporan."
```

Tabel 5.45.6. Query Operasi kirimTanggapan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4506 | INSERT INTO notifikasi (id_notifikasi, id_referensi, pesan_notifikasi) VALUES (?, ?, ?); | Mengirim notifikasi pesan tanggapan Admin ke pelapor. |

### 5.45.7 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** saveTanggapan             
**ID Algoritma:** Algo-4507

```pseudocode
INPUT: idTiket (string), tanggapan (string)
OUTPUT: void

1. hasilQuery = EXECUTE Q-4507 WITH (tanggapan, idTiket)
2.
3. IF hasilQuery == true THEN
4.      RETURN
5. ELSE
6.      THROW Exception "Gagal menyimpan tanggapan laporan."
```

Tabel 5.45.7. Query Operasi saveTanggapan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4507 | UPDATE tiket_laporan SET tanggapan_admin = ? WHERE id_tiket = ?; | Menyimpan pesan tanggapan Admin pada tiket terkait. |

### 5.45.8 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** saveLaporan             
**ID Algoritma:** Algo-4508

```pseudocode
INPUT: idTiket (string), deskripsi (string), urlBukti (string)
OUTPUT: void

1. statusAwal = false
2. hasilQuery = EXECUTE Q-4508 WITH (idTiket, deskripsi, urlBukti, statusAwal)
3.
4. IF hasilQuery == true THEN
5.      RETURN
6. ELSE
7.      THROW Exception "Gagal menyimpan tiket laporan."
```

Tabel 5.45.8. Query Operasi saveLaporan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4508 | INSERT INTO tiket_laporan (id_tiket, deskripsi_laporan, url_bukti, status_tiket) VALUES (?, ?, ?, ?); | Menambahkan laporan baru ke dalam tabel tiket_laporan. |

### 5.45.9 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** updateStatusTiket             
**ID Algoritma:** Algo-4509

```pseudocode
INPUT: idTiket (string), status (boolean)
OUTPUT: void

1. hasilQuery = EXECUTE Q-4509 WITH (status, idTiket)
2.
3. IF hasilQuery == true THEN
4.      RETURN
5. ELSE
6.      THROW Exception "Gagal memperbarui status tiket."
```

Tabel 5.45.9. Query Operasi updateStatusTiket

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4509 | UPDATE tiket_laporan SET status_tiket = ? WHERE id_tiket = ?; | Memperbarui status penyelesaian tiket laporan. |

### 5.45.10 Algoritma/Query

**Nama Kelas:** LaporanHandler     
**Nama Operasi:** getDetailTiket             
**ID Algoritma:** Algo-4510

```pseudocode
INPUT: idTiket (string)
OUTPUT: string

1. hasilQuery = EXECUTE Q-4510 WITH (idTiket)
2.
3. IF hasilQuery IS NOT EMPTY THEN
4.      data = FORMAT_TO_JSON(hasilQuery.id_tiket, hasilQuery.deskripsi_laporan, hasilQuery.url_bukti, hasilQuery.status_tiket, hasilQuery.tanggapan_admin)
5.      RETURN data
6. ELSE
7.      RETURN ""
```

Tabel 5.45.10. Query Operasi getDetailTiket

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4510 | SELECT id_tiket, deskripsi_laporan, url_bukti, status_tiket, tanggapan_admin FROM tiket_laporan WHERE id_tiket = ?; | Mengambil informasi tiket laporan berdasarkan ID tiket. |

## 5.46 Kelas Ulasan

**Nama Kelas:** Ulasan      
**ID Kelas:** C46

Tabel 5.46.1. Operasi Kelas C46

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| simpanUlasan(idPesanan : string, idPenyediaJasa : string, rating : integer, komentar : string, fileDokumentasi : FILE) : void | public | Menyimpan data ulasan pesanan baru ke dalam *databse*. |
| getDetailUlasan() : string | public | Mengembalikan informasi detail ulasan dalam format string. |

Tabel 5.46.2. Atribut Kelas Ulasan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idUlasan | private | string |
| idPesanan | private | string |
| idPenyediaJasa | private | string |
| rating | private | integer |
| komentar | private | string |
| dokumentasi | private | FILE |

### 5.46.1 Algoritma/Query

**Nama Kelas:** Ulasan     
**Nama Operasi:** simpanUlasan         
**ID Algoritma:** Algo-4601

```pseudocode
INPUT: idPesanan (string), idPenyediaJasa (string), rating (integer), komentar (string), fileDokumentasi (FILE)
OUTPUT: void

1. IF idPesanan EMPTY OR idPenyediaJasa EMPTY OR rating < 1 OR rating > 5 THEN
2.      THROW Exception "Parameter input ulasan tidak valid."
3. 
4. idUlasan = GENERATE_UUID()
5. filePath = SAVE_FILE_TO_STORAGE(fileDokumentasi)
6. hasilQuery = EXECUTE Q-4601 WITH (idUlasan, idPesanan, idPenyediaJasa, rating, komentar, filePath)
7.
8. IF hasilQuery == true THEN
9.      RETURN
10. ELSE
11.     THROW Exception "Gagal menyimpan ulasan ke basis data."
```

Tabel 5.46.3. Query Operasi simpanUlasan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4601 | INSERT INTO ulasan (id_ulasan, id_pesanan, id_penyedia_jasa, rating, komentar, dokumentasi_path) VALUES (?, ?, ?, ?, ?, ?); | Menginput baris data ulasan baru ke tabel ulasan. |

### 5.46.1 Algoritma/Query

**Nama Kelas:** Ulasan     
**Nama Operasi:** getDetailUlasan         
**ID Algoritma:** Algo-4602

```pseudocode
INPUT: void
OUTPUT: string

1. idUlasan = Session.getCurrentUlasanId()
2. hasilQuery = EXECUTE Q-4602 WITH (idUlasan)
3.
4. IF hasilQuery IS NOT EMPTY THEN
5.      data = FORMAT_TO_JSON(hasilQuery.id_ulasan, hasilQuery.id_pesanan, hasilQuery.id_penyedia_jasa, hasilQuery.rating, hasilQuery.komentar, hasilQuery.dokumentasi_path)
6.      RETURN data
7. ELSE
8.      RETURN ""
```

Tabel 5.46.4. Query Operasi getDetailUlasan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4602 | SELECT id_ulasan, id_pesanan, id_penyedia_jasa, rating, komentar, dokumentasi_path FROM ulasan WHERE id_ulasan = ?; | Mengambil detail ulasan berdasarkan ID ulasan. |

<br>

---

# BAB 6: Perancangan Antarmuka

## 6.1 Rancangan Antarmuka [ID Layar 1]

Masukkan versi awal prototipe antarmuka, dimana untuk setiap antarmuka/layar, tuliskan spesifikasi rinci objek yang ditampilkan dan reaksi sistem terhadap interaksi pengguna.

**Antarmuka:** *[ID layar]*  
**Nama Layar:** *[Nama layar]*

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-design.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.1. Rancangan Antarmuka [ID Layar] - [Nama Layar]</i>
</p>

Tabel 6.1. Spesifikasi Objek Antarmuka [ID Layar]

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| *[ID objek]* | *[Jenis objek, misalnya Button, RTF Box, dll]* | *[String yang tampil pada layar]* | *[Reaksi sistem, layar tujuan, tautan, atau ID algoritma yang dijalankan]* |
| *[ID objek]* | *[Jenis objek]* | *[Konten yang ditampilkan]* | *[Reaksi sistem atau nama file terkait beserta deskripsi ringkasnya]* |
| *...* | *...* | *...* | *...* |


## 6.X Rancangan Antarmuka [ID Layar X]

*[Ulangi pola 6.1 untuk layar berikutnya sampai semua layar teridentifikasi]*

## 6.Y Rancangan Antarmuka Keseluruhan

Tuliskan daftar gambar seluruh antarmuka. Berikan ID unik untuk setiap tampilan dan gunakan ID yang sama pada subbab perancangan antarmuka masing-masing.

Tabel 6.Y. Rancangan Antarmuka Keseluruhan

| No | Tampilan Antarmuka |
| :--- | :--- |
| *[I-01]* | <img src="./assets/diagram/contoh-design.png" alt="Contoh Desain" width="400"> |
| *[I-02]* | *[Sisipkan gambar antarmuka I-02]* |
| *[I-XX]* | *[Sisipkan gambar antarmuka berikutnya]* |

<br>

---

# BAB 7: Matriks Kerunutan

Petakan kelas perancangan dengan use case yang terkait. Gunakan **BAB 6 Traceability pada dokumen SKPL** sebagai acuan keterkaitan kelas analisis dan use case, lalu sesuaikan dengan realisasi use case dan kelas perancangan pada BAB 3–BAB 5 DPPL.
Tabel 5.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| C01 - Pengguna | UC01 - Melakukan Registrasi Akun <br> UC02 - Melakukan Login <br> UC08 - Melakukan Komunikasi <br> UC13 - Melaporkan Pengguna Lain | 
| C02 - PenyediaJasa | UC01 - Melakukan Registrasi Akun <br> UC02 - Melakukan Login <br> UC03 - Mengisi Portofolio <br> UC04 - Mengunggah Penawaran Jasa <br> UC06 - Melihat Informasi Jasa <br> UC08 - Melakukan Komunikasi <br> UC10 - Melakukan Konfirmasi Pesanan <br> UC11 - Menyerahkan hasil Pekerjaan <br> UC12 - Mengonfirmasi Hasil Pekerjaan <br> UC13 - Melaporkan Pengguna Lain |
| C03 - PenggunaJasa | UC01 - Melakukan Registrasi Akun <br> UC02 - Melakukan Login <br> UC05 - Mencari Penawaran Jasa <br> UC06 - Melihat Informasi Jasa <br> UC07 - Menggunakan Bookmark	 <br> UC08 - Melakukan Komunikasi <br> UC09 - Melakukan Pemesanan Jasa <br> UC12 - Mengonfirmasi Hasil Pekerjaan <br> UC13 - Melaporkan Pengguna Lain <br> UC14 - Memberikan Ulasan terhadap Jasa yang Dipesan |
| C04 - HalamanRegistrasi | UC01 - Melakukan Registrasi Akun |
| C05 - LayananRegistrasi | UC01 - Melakukan Registrasi Akun |
| C06 - HalamanLogin | UC02 - Melakukan Login |
| C07 - Autentikator | UC02 - Melakukan Login |
| C08 - HalamanPortofolio | UC03 - Mengisi Portofolio |
| C09 - Portofolio | UC03 - Mengisi Portofolio |
| C10 - PengontrolPortofolio | UC03 - Mengisi Portofolio |
| C11 - LayananUploadFile | UC03 - Mengisi Portofolio <br> UC04 - Mengunggah Penawaran Jasa <br> UC11 - Menyerahkan hasil Pekerjaan |
| C12 - Jasa | UC04 - Mengunggah Penawaran Jasa <br> UC05 - Mencari Penawaran Jasa <br> UC06 - Melihat Informasi Jasa <br> UC07 - Menggunakan Bookmark	 |
| C13 - HalamanUploadJasa | UC04 - Mengunggah Penawaran Jasa |
| C14 - JasaController | UC04 - Mengunggah Penawaran Jasa <br> UC06 - Melihat Informasi Jasa |
| C15 - HalamanPencarian | UC05 - Mencari Penawaran Jasa |
| C16 - HasilPencarian | UC05 - Mencari Penawaran Jasa |
| C17 - LayananPencarian | UC05 - Mencari Penawaran Jasa |
| C18 - LayananPembandingJasa | UC05 - Mencari Penawaran Jasa |
| C19 - HalamanDetailJasa | UC06 - Melihat Informasi Jasa |
| C20 - Bookmark | UC07 - Menggunakan Bookmark	 |
| C21 - HalamanBookmark | UC07 - Menggunakan Bookmark	 |
| C22 - PengontrolBookmark | UC07 - Menggunakan Bookmark	 |
| C23 - ChatRoom | UC08 - Melakukan Komunikasi <br> UC16 - Melakukan Proses Mediasi |
| C24 - HalamanChat | UC08 - Melakukan Komunikasi <br> UC16 - Melakukan Proses Mediasi |
| C25 - LayananPesanInstan | UC08 - Melakukan Komunikasi <br> UC16 - Melakukan Proses Mediasi |
| C26 - LayananNotifikasiChat | UC08 - Melakukan Komunikasi <br> UC16 - Melakukan Proses Mediasi |
| C27 - Pesanan | UC09 - Melakukan Pemesanan Jasa <br> UC10 - Melakukan Konfirmasi Pesanan <br> UC12 - Mengonfirmasi Hasil Pekerjaan <br> UC14 - Memberikan Ulasan terhadap Jasa yang Dipesan |
| C28 - HalamanPemesanan | UC09 - Melakukan Pemesanan Jasa |
| C29 - HalamanPembayaran | UC09 - Melakukan Pemesanan Jasa |
| C30 - HalamanRiwayatTransaksi | UC09 - Melakukan Pemesanan Jasa <br> UC14 - Memberikan Ulasan terhadap Jasa yang Dipesan |
| C31 - PengontrolPesanan | UC09 - Melakukan Pemesanan Jasa <br> UC10 - Melakukan Konfirmasi Pesanan <br> UC12 - Mengonfirmasi Hasil Pekerjaan <br> UC14 - Memberikan Ulasan terhadap Jasa yang Dipesan |
| C32 - PengontrolTransaksi | UC09 - Melakukan Pemesanan Jasa <br> UC10 - Melakukan Konfirmasi Pesanan <br> UC12 - Mengonfirmasi Hasil Pekerjaan <br> UC14 - Memberikan Ulasan terhadap Jasa yang Dipesan |
| C33 - MetodePembayaran | UC09 - Melakukan Pemesanan Jasa <br> UC10 - Melakukan Konfirmasi Pesanan |
| C34 - RiwayatTransaksi | UC09 - Melakukan Pemesanan Jasa <br> UC10 - Melakukan Konfirmasi Pesanan <br> UC14 - Memberikan Ulasan terhadap Jasa yang Dipesan |
| C35 - HalamanKonfirmasi | UC10 - Melakukan Konfirmasi Pesanan |
| C36 - ProdukAkhir | UC11 - Menyerahkan hasil Pekerjaan | 
| C37 - HalamanPengumpulan | UC11 - Menyerahkan hasil Pekerjaan |
| C38 - HalamanDeliverables | UC12 - Mengonfirmasi Hasil Pekerjaan |
| C39 - PengajuanRevisi | UC12 - Mengonfirmasi Hasil Pekerjaan |
| C40 - HalamanRequestRevisi | UC12 - Mengonfirmasi Hasil Pekerjaan |
| C41 - RevisiHandler | UC12 - Mengonfirmasi Hasil Pekerjaan |
| C42 - PencairanDana | UC12 - Mengonfirmasi Hasil Pekerjaan |
| C43 - TiketLaporan | UC13 - Melaporkan Pengguna Lain <br> UC15 - 	Memproses Laporan <br> UC16 - Melakukan Proses Mediasi |
| C44 - HalamanPelaporan | UC13 - Melaporkan Pengguna Lain |
| C45 - LaporanHandler | UC13 - Melaporkan Pengguna Lain <br> UC15 - 	Memproses Laporan <br> UC16 - Melakukan Proses Mediasi |
| C46 - Ulasan | UC06 - Melihat Informasi Jasa <br> UC14 - Memberikan Ulasan terhadap Jasa yang Dipesan |
| C47 - HalamanUlasan | UC14 - Memberikan Ulasan terhadap Jasa yang Dipesan |
| C48 - UlasanHandler | UC14 - Memberikan Ulasan terhadap Jasa yang Dipesan |
| C49 - TanggapanLaporan | UC15 - 	Memproses Laporan <br> UC16 - Melakukan Proses Mediasi |
| C50 - HalamanPengajuanMediasi | UC16 - Melakukan Proses Mediasi |
| C51 - MediasiHandler | UC16 - Melakukan Proses Mediasi |
| C52 - Admin | UC15 - 	Memproses Laporan <br> UC16 - Melakukan Proses Mediasi |
| C53 - HalamanDashboardAdmin | UC15 - 	Memproses Laporan <br> UC16 - Melakukan Proses Mediasi |

