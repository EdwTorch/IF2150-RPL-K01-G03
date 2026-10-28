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
| Tambah Parameter Method di C17 | Tambah Parameter Keyword String C17   |
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
| C17 | LayananPencarian | - | <br> +cariJasaBerdasarkanKeyword(keyword : string) : list of Jasa <br> + terapkanFilterPencarian(filter : string, keyword : string) : list of Jasa |
| C18 | LayananPembandingJasa | - | <br> + bandingkanSpesifikasiJasa(idJasa1 : string, idJasa2 : string) : string |
| C19 | HalamanDetailJasa | <br> - tampilanDeskripsi : string <br> - tampilanHarga : double <br> - infoProfilPenyedia : string <br> - tampilanRiwayatUlasan : list of string <br> - pesanError : string | <br> + tampilkanDetailJasa() : void <br> +  tampilkanPesanError() : void |
| C20 | Bookmark | <br> - idBookmark : string <br> - idPenggunaJasa : string <br> - idJasa : string <br> - waktuDisimpan : Date <br> - daftarBookmark : list of bookmark | <br> + simpanBookmark(idPenggunaJasa : string, idJasa : string) <br> + hapusBookmark(idBookmark : string, idPenggunaJasa : string) : boolean <br> + lihatBookmark(idPenggunaJasa : string) : list of Bookmark |
| C21 | HalamanBookmark | <br> - daftarJasaTersimpan : list of Jasa <br> - ikonBookmarkAktif : void <br> - ikonBookmarkNonaktif : void <br> - tombolHapusBookmark : void | <br> + tampilkanDaftarTersimpan() : void  <br> + klikIkonBookmark() : void <br> + klikIkonHapus() : void <br> + tampilkanNotifikasi() : void |
| C22 | PengontrolBookmark | - | <br> + tambahDataBookmark() : boolean <br> + hapusDataBookmark() : boolean <br> + ambilDaftarBookmarkPengguna() : list of Bookmark |
| C23 | ChatRoom | <br> - idChatRoom : string <br> - idAnggota : string <br> - riwayatPesan : list of string <br> - waktuDibuat : Date | <br> + getRiwayatPesan(idChatRoom : string) : list of string <br> + simpanPesan(pesan : string) : void <br> + getidChatRoom(idPenggunaJasa : string,idPenyediaJasa : string) : string <br> + getidAnggota(idChatRoom : string) : string |
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

## 5.1 Kelas [Nama Kelas 1]

**Nama Kelas:** *[Nama kelas]*  
**ID Kelas:** *[ID kelas]*

Tabel 5.1.1. Operasi Kelas [Nama Kelas 1]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.1.2. Atribut Kelas [Nama Kelas 1]

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.1.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.1.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| *[Q-001]* | *[Tuliskan query]* | *[Fungsi query]* |
| *...* | *...* | *...* |


### 5.1.2 Algoritma/Query

*[Ulangi pola 5.1.1 untuk operasi penting berikutnya pada kelas yang sama, jika ada.]*

## 5.17 Kelas LayananPencarian (C17)

**Nama Kelas:** LayananPencarian 
**ID Kelas:** C17

Tabel 5.17.1. Operasi Kelas [LayananPencarian]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| cariJasaBerdasarkanKeyword(keyword : string) : list of Jasa | public | mencari jasa berdasarkan keyword yang dimasukkan pengguna |
| terapkanFilterPencarian(filter : string) : list of Jasa | public | menerapkan pencarian sesuai dengan filter yang diterapkan |
 

### 5.17.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** Layanan Pencarian
**Nama Operasi:** cariJasaBerdasarkanKeyword(keyword : string) : list of Jasa  
**ID Algoritma:** Algo-1701

```Pseudocode
Input : keyword (string)
Ouput : list of Jasa || pesanError
1. If keyword = null or len(keyword)< 3 then
    Throw Exception “Keyword Pencarian Minimal 3 karakter”
2. Jalankan Query Q-1701 dengan parameter keyword 
3. simpan hasil pencarian ke dalam daftarJasa {variabel sementara}
4. If len(daftarJasa) != 0 then
5.    Jasa.dapatkanDetailJasa(daftarJasa)
6.    HasilPencarian.tampilkanDaftarHasil(daftarJasa)
7.    return daftarJasa
8. Else then 
9.    HalamanPencarian.tampilkanPesanError()
10.    return "dataKosong" {Pesan Error Data Tidak Ditemukan}
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.17.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-1701 | `SELECT * FROM jasa`<br>`WHERE nama_jasa LIKE '%keyword%'`<br>`.. OR deskripsi LIKE '%keyword%'`<br>`ORDER BY`<br>`.. CASE WHEN nama_jasa LIKE '%keyword%' THEN 1`<br>`.. ELSE 2 END ASC`<br>`LIMIT 20` | Mencari 20 data jasa teratas berdasarkan relevansi nama jasa yang dicari |



### 5.17.2 Algoritma/Query

**Nama Kelas:** LayananPencarian

**Nama Operasi:** terapkanFilterPencarian(filter : string,keyword : string) : list of Jasa

**ID Algoritma:** Algo-1702

```Pseudocode
Input : filter (string)
Ouput : list of Jasa || pesanError
1. Parse parameter filter menjadi kriteria pencarian
2. Jalankan Query Q-1702 dengan parameter keyword dan filter 
3. simpan hasil pencarian ke dalam daftarJasaTerfilter {variabel sementara}
4. If len(daftarJasaTerfilter) != 0 then
5.    Jasa.dapatkanDetailJasa(daftarJasa)
6.    HasilPencarian.tampilkanDaftarHasil(daftarJasa)
7.    return daftarJasa
8. Else then 
9.    HalamanPencarian.tampilkanPesanError()
10.    return "dataKosong" {Pesan Error Data Tidak Ditemukan}
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.17.2. Query Operasi terapkanFilterPencarian(filter : string, keyword : string) : list of Jasa

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-1701 | SELECT * FROM jasa WHERE status_aktif = true AND (nama_jasa ILIKE %keyword% OR deskripsi ILIKE %keyword%) AND (%kategori% IS NULL OR kategori = %kategori%) AND (%hargaMin% IS NULL OR harga >= %hargaMin%) AND (%hargaMax% IS NULL OR harga <= %hargaMax%) AND (%rating% IS NULL OR rating >= %ratingMin%) AND (%ratingMax% IS NULL OR rating <= %ratingMax%) ORDER BY waktuDibuat DESC LIMIT 20 | Mencari 20 data jasa teratas berdasarkan relevansi filter yang diberikan |

## 5.18 Kelas LayananPembandingJasa (C18)

**Nama Kelas:** LayananPembandingJasa
**ID Kelas:** C18

Tabel 5.18.1. Operasi Kelas LayananPembandingJasa

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| + bandingkanSpesifikasiJasa(idJasa1 : string, idJasa2 : string) : string | public | Membandingkan dua jasa yang diminati pengguna  |




### 5.18.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** LayananPembandingJasa
**Nama Operasi:** + bandingkanSpesifikasiJasa(idJasa1 : string, idJasa2 : string) : string  
**ID Algoritma:** Algo-1801

```text
Input : idJasa1 : string dan idJasa2 : string
Output : string
1. Jalankan Query Q-1801 dengan parameter idJasa1 
2. Jalankan Query Q-1801 dengan parameter idJasa2
3. simpan Detail Jasa ke-1 pada Variabel detailJasa1 dan Jasa ke-2 pada detailJasa2
4. Bandingkan Statistik pada kedua Jasa, seperti rating, harga, keypoints yang ditawarkan, dll.
5. Format hasil perbandingan menjadi matriksPerbandingan (teks ringkasan / JSON)
6. HasilPencarian.TampilkanHasilPerbandingan()
7. return hasilperbandingan
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.18.1. Query Operasi [Nama Operasi]

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-1801 | SELECT * FROM jasa WHERE id_jasa = %idJasa% AND status_aktif = true | Mengambil detail spesifikasi data jasa aktif berdasarkan ID Jasa yang dipilih untuk dibandingkan. |



## 5.20 Kelas Bookmark (C20)

**Nama Kelas:** Bookmark
**ID Kelas:** C20

Tabel 5.20.1. Operasi Kelas Bookmark

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| simpanBookmark(idPenggunaJasa : string, idJasa : string) : boolean | public | menyimpan bookmark  |
| hapusBookmark(idBookmark : string, idPenggunaJasa : string) : boolean | public | menghapus bookmark |
| lihatBookmark(idPenggunaJasa : string) : list of Bookmark | public | melihat daftar bookmark yang dimiliki |

Tabel 5.20.2. Atribut Kelas Bookmark

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idBookmark | private | string |
| idPenggunaJasa  | private | string |
| idJasa  | private | string |
| waktuDisimpan  Date | private | Date |
| daftarBookmark | private | list of Bookmark  |


### 5.20.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** Bookmark
**Nama Operasi:** simpanBookmark(idPenggunaJasa : string, idJasa : string)
**ID Algoritma:** Algo-2001

```text
Input : idPenggunaJasa : string dan idJasa : string
Output : boolean
1. Simpan Waktu bookmark dibuat dalam variabel sementara date
2. Jalankan Query Q-2001 dengan parameter idJasa, idPenggunaJasa, dan date
3. simpan hasil kembalian dari Query Q-2001 ke variabel idBookmarkBaru
4. if idBookmarkBaru != kosong then
5.   return true
6. else then
7.   return false
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.20.1. Query Operasi Bookmark

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2001 | INSERT INTO bookmark (idPenggunaJasa, idJasa, waktuDibuat) VALUES (%idPenggunaJasa%, %idJasa%,%date%) RETURN idBookmark | Membentuk bookmark dan menghasilkan idBookmark |

### 5.20.2 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** Bookmark
**Nama Operasi:** hapusBookmark(idBookmark : string, idPenggunaJasa : string) : boolean
**ID Algoritma:** Algo-2002

```text
Input : idPenggunaJasa : string dan idBookmark : string
Output : boolean
1. Jalankan Query Q-2002 dengan parameter idBookmark, idPenggunaJasa
2. Simpan hasil kembalian query ke variabel idBookmarkDihapus
3. if idBookmarkDihapus != kosong then
4.   return false
5. else then
6.   return true
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.20.2. Query Operasi Bookmark

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2002 | DELETE From Bookmark WHERE idBookmark = %idBookmark% AND idPenggunaJasa = %idPenggunaJasa% RETURN idBookmarkTerhapus | Menghapus Bookmark |


### 5.20.3 Algoritma/Query

**Nama Kelas:** Bookmark
**Nama Operasi:** lihatBookmark(idPenggunaJasa : string) : list of Bookmark
**ID Algoritma:** Algo-2003

```text
Input : idPenggunaJasa : string 
Output : list of Bookmark
1. Jalankan Query Q-2003 dengan parameter idPenggunaJasa
2. Simpan hasil kembalian query ke variabel daftarBookmarkJasa
3. if daftarBookmarkJasa == kosong then
4.   return null
5. else then
6.   return daftarBookmarkJasa
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.20.3. Query Operasi Bookmark

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2003 | SELECT * FROM Bookmark WHERE idPenggunaJasa = %idPenggunaJasa% ORDER BY waktuDibuat DESC; | Menampilkan Hasil Bookmark yang telah disimpan |

<br>

## 5.22 Kelas PengontrolBookmark (C22)

**Nama Kelas:** PengontrolBookmark
**ID Kelas:** C22

Tabel 5.22.1. Operasi Kelas [PengontrolBookmark]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tambahDataBookmark() : boolean | public | menambahkan data bookmark |
| hapusDataBookmark() : boolean | public | menghapus bookmark |
|ambilDaftarBookmarkPengguna() : list of Bookmark | public | mengambil daftar bookmark |
 

### 5.22.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolBookmark
**Nama Operasi:** tambahDataBookmark  
**ID Algoritma:** Algo-2201

```Pseudocode
INPUT: idPenggunaJasa (string), idJasa (string)
OUTPUT: boolean

1. if idPenggunaJasa KOSONG ATAU idJasa KOSONG THEN
2.     THROW Exception "Parameter input tidak valid"
3. statusSimpan = Bookmark.simpanBookmark(idPenggunaJasa, idJasa)
4.
5. if statusSimpan == true THEN
6.     HalamanBookmark.tampilkanNotifikasi("Bookmark berhasil disimpan")
7.    RETURN true
8. ELSE
9.    HalamanBookmark.tampilkanNotifikasi("Gagal menyimpan bookmark")
10.    RETURN false
```

### 5.22.2 Algoritma/Query

**Nama Kelas:** PengontrolBookmark
**Nama Operasi:** hapusDataBookmark(idBookmark : string, idPenggunaJasa : string) : boolean
**ID Algoritma:** Algo-2202

```Pseudocode 
Input : idBookmark : string, idPenggunaJasa : string
Ouput : boolean
1. IF idBookmark KOSONG ATAU idPenggunaJasa KOSONG THEN
2.     THROW Exception "Parameter input tidak valid"
3. statusDelete = Bookmark.hapusBookmark(idBookmark,idPenggunaJasa)
4.
5. IF statusSimpan == true THEN
6.     HalamanBookmark.tampilkanNotifikasi("Bookmark berhasil dihapus")
7.    RETURN true
8. ELSE
9.    HalamanBookmark.tampilkanNotifikasi("Gagal menghapus bookmark silahkan coba lagi")
10.    RETURN false
```



### 5.22.3 Algoritma/Query

**Nama Kelas:** PengontrolBookmark 
**Nama Operasi:** ambilDaftarBookmarkPengguna(idPenggunaJasa : string) : list of Bookmark 
**ID Algoritma:** Algo-2203

```Pseudocode Belom
Input : idPenggunaJasa(string)
Ouput : list of Bookmark || pesanError
1. IF idPenggunaJasa KOSONG THEN 
2.    THROW Exception "Parameter input tidak valid"
3. daftarBookmark = Bookmark.lihatBookmark(idPenggunaJasa)
4. IF daftarBookmark == NULL THEN
5.   HalamanBookmark.tampilkanNotifikasi("Bookmark Kosong")
6.   return NULL
7. ELSE THEN 
8.   HalamanBookmark.tampilkanDaftarTersimpan()
9.   return daftarBookmark 
```

## 5.23 Kelas Chatroom (C23)

**Nama Kelas:** Chatroom
**ID Kelas:** C23

Tabel 5.23.1. Operasi Kelas Bookmark

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| getRiwayatPesan() : list of string | public | mendapatkan riwayat pesan |
| simpanPesan() : void | public | menyimpan pesan |
| getidChatRoom() : string| public | mendapatkan idChatroom |
| getidAnggota() : string | public | mendapatkan idAnggota |

Tabel 5.23.2. Atribut Kelas Bookmark

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idChatRoom | private | string |
| idAnggota  | private | string |
| riwayatPesan  | private | list of string |
| waktuDibuat | private | Date |


### 5.23.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** Chatroom
**Nama Operasi:** getRiwayatPesan(idChatroom : string) : list of pesan
**ID Algoritma:** Algo-2301

```text
Input : idChatroom (string)
Output : list of pesan
1. Jalankan Query Q-2301 dengan parameter idChatroom
2. simpan hasil kembalian dari Query Q-2301 ke variabel RiwayatPesan
3. IF riwayatPesan TIDAK KOSONG THEN
4.     RETURN riwayatPesan
5. ELSE
6.     RETURN null
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.23.1. Query Operasi Chatroom

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2301 | SELECT * FROM Pesan WHERE idChatroom = %idChatroom% ORDER BY waktuDibuat ASC | Mengambil seluruh baris riwayat pesan berdasarkan ID Chatroom yang diurutkan kronologis dari pesan tertua ke terbaru. |


### 5.23.2 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** Chatroom
**Nama Operasi:** simpanPesan(pesan : string) : void
**ID Algoritma:** Algo-2302

```text
Input : Pesan (string)
Output : boolean
1. Jalankan Query Q-2302 dengan parameter Pesan
2. Simpan hasil kembalian query ke variabel Pesan
3. IF PESAN == null THEN
4.   HalamanChat.tampilkanPesanError("Pesan Tidak Berhasil Tersimpan")
5.  return false
6. else then
7.   return true
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.23.2. Query Operasi Chatroom

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2302 | INSERT INTO RiwayatPesan (idPesan, idPengguna, waktuDibuat, Pesan) VALUES (%idPesan%, %idPenggunaJasa%,%date%, %pesan%) RETURN Pesan  | Menyimpan Pesan yang baru dikirim |


### 5.23.3 Algoritma/Query

**Nama Kelas:** Chatroom
**Nama Operasi:** getidChatRoom(idPenggunaJasa : string, idPenyediaJasa : string) : string
**ID Algoritma:** Algo-2303

```text
Input : idPenggunaJasa : string dan idPenyediaJasa : string
Output : list of Bookmark
1. Jalankan Query Q-2303 dengan parameter idPenggunaJasa dan idPenyediaJasa
2. Simpan hasil kembalian query ke variabel idChatRoom
3. IF idChatRoom == kosong THEN
4.   Jalankan Query [Q-2303] dengan parameter idPenggunaJasa dan idPenyediaJasa
5.     Simpan ID yang baru terbentuk ke variabel idChatroomBaru
6.    RETURN idChatroomBaru
7. else THEN
8.   return idChatRoom
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.23.3. Query Operasi Chatroom

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2303 | SELECT id_chatroom FROM chatroom WHERE id_pengguna_jasa = %idPenggunaJasa% AND id_penyedia_jasa = %idPenyediaJasa% LIMIT 1; | Mengambil idChatRoom |
| Q-2304 | INSERT INTO chatroom (id_pengguna_jasa, id_penyedia_jasa, created_at) VALUES (%idPenggunaJasa%, %idPenyediaJasa%, NOW()) RETURNING id_chatroom; | Membuat Entitas Chatroom yang baru |


### 5.23.4 Algoritma/Query

**Nama Kelas:** Chatroom
**Nama Operasi:** getidAnggota(idChatRoom : string) : string
**ID Algoritma:** Algo-2304

```text
Input : idChatRoom : string
Output : list of Bookmark
1. Jalankan Query Q-2305 dengan parameter idChatRoom
2. Simpan hasil kembalian query ke variabel idAnggota
3. if idAnggota == kosong then
4.   return null
5. else then
6.   return idChatRoom
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.23.3. Query Operasi Bookmark

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2305 | SELECT idAnggota FROM ChatRoom WHERE idChatRoom = %idChatRoom% LIMIT 1; | Mengambil idAnggota yang ada di dalam ChatRoom |

## 5.25 Kelas LayananPesanInstan (C25)

**Nama Kelas:** LayananPesanInstan
**ID Kelas:** C25

Tabel 5.25.1. Operasi Kelas [LayananPesanInstan]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| buatSesiChat() : void | public | membuat sesiChat |
| validasiInputPesan() : boolean | public | memvalidasi input pesan yang diberikan pengguna |
| kirimPesan() : void | public | mengirim pesan (menyimpan ke riwayat pesan) |
| simpanKeDatabase() : void | public | menyimpan chat ke database |
| updateStatusBaca() : void | public | mengupdate statusBaca pengguna |
 

### 5.25.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** LayananPesanInstan
**Nama Operasi:** buatSesiChat(idPenggunaJasa : string, idPenyediaJasa) : void  
**ID Algoritma:** Algo-2501

```Pseudocode
INPUT: idPenggunaJasa (string), idPenyediaJasa (string)
OUTPUT: void
1. idPenggunaJasa = PenggunaJasa.getIdPenggunaJasa()
2. idPenyediaJasa = PenyediaJasa.getIdPenyediaJasa()
3. idChatRoom = ChatRoom.getIdChatRoom(idPenggunaJasa, idPenyediaJasa)
4. HalamanChat.tampilkanMenuChat()
```

### 5.25.2 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** LayananPesanInstan
**Nama Operasi:** validasiInputPesan(pesan : string) : boolean
**ID Algoritma:** Algo-2502

```Pseudocode
INPUT: pesan (string)
OUTPUT: boolean

1. pesanBersih = trim(pesan)
2. IF len(pesanBersih) == 0 THEN
3.     tampilkanPesanError("tidak dapat mengirim pesan kosong")
4.     return false
5. ELSE IF len(pesanBersih) > 1000 THEN
6.     tampilkanPesanError("tidak dapat mengirim pesan lebih dari 1000 karakter")
7.     return false
8. ELSE 
9.    return true
```

### 5.25.3 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** LayananPesanInstan
**Nama Operasi:** kirimPesan(pesan : string) : void  
**ID Algoritma:** Algo-2503

```Pseudocode
INPUT: pesan (string)
OUTPUT: void
1. idPengguna = Pengguna.getIdPengguna()
2. idChatRoom = ChatRoom.getIdChatroom()
3. riwayatPesan = ChatRoom.getRiwayatPesan(idChatRoom)
4. IF validasiInput(pesan) THEN
5.   simpanKeDatabase(pesan)
6.   newRiwayatPesan = ChatRoom.getRiwayatPesan(idChatRoom)
7.   IF len(newRiwayatPesan)<= len(riwayatPesan) THEN
8.       HalamanChat.tampilkanPesanError("Pesan Belum Terkirim Silahkan coba lagi")
9. ELSE THEN
10.   HalamanChat.tampilkanPesanError("Pesan Belum Terkirim Silahkan coba lagi")
```

### 5.25.4 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** LayananPesanInstan
**Nama Operasi:** simpanKeDatabase(idChatroom : string, idPengirim : string, pesan : string) : void
**ID Algoritma:** Algo-2504

```Pseudocode
INPUT: idChatroom (string), idPengirim (string), isiPesan (string)
OUTPUT: boolean


1. idPesan = Pesan.simpanPesan(idChatroom, idPengirim, isiPesan)
2.
3. JIKA idPesan != NULL THEN
4.    RETURN true
5. ELSE
6.    RETURN false
END ALGORITHM
```

### 5.25.5 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** LayananPesanInstan
**Nama Operasi:** updateStatusBaca(idChatroom : string, idPengguna : string) : boolean
**ID Algoritma:** Algo-2505

```Pseudocode
INPUT: idChatroom (string), idPengguna (string)
OUTPUT: boolean

1. JIKA idChatroom == NULL ATAU idPengguna == NULL THEN
2.     THROW Exception "Parameter tidak valid"
3. ENDIF
4.
5. statusUpdate = Pesan.perbaruiStatusDibaca(idChatroom, idPengguna)
6.
7. JIKA statusUpdate == true THEN
8.    HalamanChat.tampilkanStatusDibaca()
9.    RETURN true
10. ELSE
11.    RETURN false
12. ENDIF

```

## 5.26 Kelas LayananPesanInstan (C25)

**Nama Kelas:** LayananNotiifikasiChat
**ID Kelas:** C26

Tabel 5.26.1. Operasi Kelas [LayananNotiifikasiChat]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| kirimNotifikasiPesan() : void | public  | mengirim notifikasi pesan |
| tampilkanPopUpNotifikasi() : void| public  | mengirimkan Pop Up Notifikasinya | 
 

### 5.26.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** LayananNotifikasiChat
**Nama Operasi:** kirimNotifikasiPesan(idPesan : string, idPengirim : string, idPenerima : string) : void
**ID Algoritma:** Algo-2601

```Pseudocode
INPUT: void
OUTPUT: void
1. IF idPesan == NULL OR idPengirim == NULL or idPenerima == NULL THEN
2.    Throw Exception "Parameter tidak valid" 
3. detailPesan = Pesan.getDetailPesan(idPesan)
4. namaPengirim = Pesan.getNama(idPengirim)
5. deviceToken = Pengguna.getDeviceToken(idPenerima)
6. tampilkanPopUpNotifikasi(deviceToken, namaPengirim, detailPesan.isiPesan)
```

### 5.26.2 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** LayananNotiifikasiChat
**Nama Operasi:** tampilkanPopUpNotifikasi(device : string, pengirim : string, pesan : string) : void
**ID Algoritma:** Algo-2602

```Pseudocode
1. PushNotificationService.send(deviceToken, namaPengirim, detailPesan.isiPesan)
```

## 5.27 Kelas Pesanan (C27)

**Nama Kelas:** Chatroom
**ID Kelas:** C27

Tabel 5.27.1. Operasi Kelas Pesanan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| setStatusDiproses() : void | public | mengupdate status pengerjaan menjadi diproses|
| setStatusSelesai() : void | public | mengupdate status pengerjaan menjadi selesai |

Tabel 5.27.2. Atribut Kelas Pesanan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idPesanan | private | string |
| idPenggunaJasa  | private | string |
| idPenyediaJasa | private | string |
| idJasa | private | string |
| brief | private | string|
| totalBiaya | private | double |
| statusPesanan | private | string |



### 5.27.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** Pesanan
**Nama Operasi:** setStatusDiproses(idPesanan : string) : void
**ID Algoritma:** Algo-2701

```text
Input : idPesanan (string)
Output : void
1. Jalankan Query Q-2701 dengan parameter idPesanan
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.27.1. Query Operasi Pesanan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2701 | UPDATE Pesanan <br> SET statusPengerjaan = "Diproses" WHERE idPesanan = %idPesanan%| Mengupdate Status Pengerjaan |


### 5.27.2 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** Pesanan
**Nama Operasi:** setStatusSelesai(idPesanan : string) : void
**ID Algoritma:** Algo-2702

```text
Input : idPesanan
Output : void
1. Jalankan Query Q-2702 dengan parameter idPesanan
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.27.2. Query Operasi Pesanan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2702 | UPDATE Pesanan <br> SET statusPengerjaan = "Selesai" WHERE idPesanan = %idPesanan%| Mengupdate Status Pengerjaan |

### 5.27.3 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** Pesanan
**Nama Operasi:** setStatus(idPesanan : string, status : string) : void
**ID Algoritma:** Algo-2702

```text
Input : idPesanan (string), status (string)
Output : void
1. Jalankan Query Q-2703 dengan parameter idPesanan dan status
```

Jika operasi mengacu pada query tertentu, lengkapi tabel berikut. 

Tabel 5.27.3. Query Operasi Pesanan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-2703 | UPDATE Pesanan <br> SET statusPengerjaan = %status% WHERE idPesanan = %idPesanan%| Mengupdate Status Pengerjaan |

## 5.31 Kelas PengontrolPesanan (C31)

**Nama Kelas:** PengontrolPesanan
**ID Kelas:** C31

Tabel 5.31.1. Operasi Kelas [PengontrolPesanan]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| buatPesananBaru() : void | public | Membuat Pesanan Baru |
| hitungTotalBiaya() : double | public | menghitung biaya pesanan |
| updateStatusPesanan(idPesanan: integer, status: STATUS) : void | public | mengubah status pesanan |
|getDetailPesanan() : string | public | mendapatkan detail pesanan |
 

### 5.31.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolPesanan
**Nama Operasi:** buatPesananBaru(briefPesanan : string, idJasa : string, idPenggunaJasa : string) : Pesanan
**ID Algoritma:** Algo-3101

```Pseudocode
INPUT: briefPesanan : string, idJasa : string, idPenggunaJasa : string
OUTPUT: Pesanan
1. IF briefPesanan == NULL  THEN
2.   Throw Exception "Pesanan tidak Valid"
3. idPesanan = Pesanan.getIdPesanan()
4. totalBiaya = hitungTotalBiaya(idJasa)
5. idPenyediaJasa = Jasa.dapatkanDetailJasa(idJasa).idPenyediaJasa
6. Jalankan Query Q-3101 dengan parameter briefPesanan,idJasa, idPesanan, idPenyediaJasa dan totalBiaya
7. RETURN Pesanan

```
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3101 | INSERT INTO Pesanan (idPenggunaJasa, idJasa, totalBiaya, idPenyediaJasa, statusPesanan, waktuDibuat) VALUES (%idPenggunaJasa%, %idJasa%,totalBiaya%, %idPenyediaJasa%, "Menunggu Pembayaran", %NOW()) RETURN Pesanan | Mengupdate Status Pengerjaan |


### 5.31.2 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolPesanan
**Nama Operasi:** hitungTotalBiaya(idJasa) : double
**ID Algoritma:** Algo-3102

```Pseudocode
INPUT: idJasa (string)
OUTPUT : double
1. IF (idJasa == NULL) THEN
2.   Throw Exception "idJasa tidak valid"
3. detailJasa = Jasa.dapatkanDetailJasa(idJasa)
4. totalBiaya = detailJasa.harga
5. return totalBiaya
```

### 5.31.3 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolPesanan
**Nama Operasi:** updateStatusPesanan(idPesanan: string, status: string) : void 
**ID Algoritma:** Algo-3103

```Pseudocode
INPUT: idPesanan : string, status : string
OUTPUT: void
1. IF status == "Selesai" THEN
2.   Pesanan.setStatusSelesai(idPesanan)
3. ELSE IF status == "Diproses"
4.   Pesanan.setStatusDiproses(idPesanan)
5. ELSE
6.   Pesanan.setStatus(idPesanan, status)
```

### 5.31.4 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolPesanan
**Nama Operasi:** getDetailPesanan(idPesanan : string) : string
**ID Algoritma:** Algo-3104

```Pseudocode
INPUT: idPesanan (string)
OUTPUT: string
1. IF idPesanan == NULL THEN
2.   Throw Exception "idPesanan tidak valid"
3. Jalankan Query Q-3102 dengan parameter idPesanan
4. simpan hasil query pada variabel detailPesanan
5. return detailPesanan

```
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3102 | SELECT * FROM Pesanan WHERE idPesanan = %idPesanan% | Mengupdate Status Pengerjaan |

## 5.31 Kelas PengontrolPesanan (C31)

**Nama Kelas:** PengontrolPesanan
**ID Kelas:** C31

Tabel 5.31.1. Operasi Kelas [PengontrolPesanan]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| buatPesananBaru() : void | public | Membuat Pesanan Baru |
| hitungTotalBiaya() : double | public | menghitung biaya pesanan |
| updateStatusPesanan(idPesanan: integer, status: STATUS) : void | public | mengubah status pesanan |
|getDetailPesanan() : string | public | mendapatkan detail pesanan |
 

### 5.31.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolPesanan
**Nama Operasi:** buatPesananBaru(briefPesanan : string, idJasa : string, idPenggunaJasa : string) : Pesanan
**ID Algoritma:** Algo-3101

```Pseudocode
INPUT: briefPesanan : string, idJasa : string, idPenggunaJasa : string
OUTPUT: Pesanan
1. IF briefPesanan == NULL  THEN
2.   Throw Exception "Pesanan tidak Valid"
3. idPesanan = Pesanan.getIdPesanan()
4. totalBiaya = hitungTotalBiaya(idJasa)
5. idPenyediaJasa = Jasa.dapatkanDetailJasa(idJasa).idPenyediaJasa
6. Jalankan Query Q-3101 dengan parameter briefPesanan,idJasa, idPesanan, idPenyediaJasa dan totalBiaya
7. RETURN Pesanan

```
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3101 | INSERT INTO Pesanan (idPenggunaJasa, idJasa, totalBiaya, idPenyediaJasa, statusPesanan, waktuDibuat) VALUES (%idPenggunaJasa%, %idJasa%,totalBiaya%, %idPenyediaJasa%, "Menunggu Pembayaran", %NOW()) RETURN Pesanan | Mengupdate Status Pengerjaan |


## 5.32 Kelas PengontrolTransaksi (C32)

**Nama Kelas:** PengontrolTransaksi
**ID Kelas:** C32

Tabel 5.32.1. Operasi Kelas [PengontrolTransaksi]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| prosesPembayaran(idPesanan : string, idMetode : string) : boolean | public | Memproses Pembayaran |
| validasiPembayaran(idPesanan : string) : boolean | public | memvalidasi apakah pembayaran berhasil dilakukan  |
|  setPencairanDana(idPesanan : string, selesai : boolean) : boolean | public | melakukan pencairan dana |
|updateStatusPembayaran(idPesanan : string, status : string) : boolean | public |mengupdate status pembayaran |
|catatRiwayatTransaksi(idPesanan : string) : void | public | mencatat riwayat transaksi|
 

### 5.32.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolTransaksi
**Nama Operasi:** prosesPembayaran(idPesanan : string, idMetode : string) : boolean
**ID Algoritma:** Algo-3201

```Pseudocode
INPUT: idPesanan (string), idMetode (string)
OUTPUT: boolean

1. IF idPesanan == NULL ATAU idMetode == NULL THEN
2.     THROW Exception "Parameter pembayaran tidak valid"
3. detailMetode = MetodePembayaran.getDetailMetode(idMetode)
4.
5. IF detailMetode != NULL THEN
6.    isUpdated = updateStatusPembayaran(idPesanan, "MENUNGGU_PEMBAYARAN")
7.    RETURN isUpdated
8. ELSE
9.    RETURN false

```

### 5.32.2 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolTransaksi
**Nama Operasi:** validasiPembayaran(idPesanan : string) : boolean
**ID Algoritma:** Algo-3202

```Pseudocode

INPUT: idPesanan (string)
OUTPUT: boolean

1. Jalankan Query [Q-3201] dengan parameter idPesanan
2. Simpan hasil query ke dalam variabel statusBayar
4.
5. IF statusBayar == "LUNAS" ATAU statusBayar == "SUCCESS" THEN
6.    catatRiwayatTransaksi(idPesanan)
8.     RETURN true
9. ELSE
10.    RETURN false
```

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3201 |SELECT status_pembayaran FROM pesanan WHERE idPesanan = %idPesanan% LIMIT 1; | Mengambil status pembayaran pesanan saat ini untuk proses validasi. |

### 5.32.3 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolTransaksi
**Nama Operasi:** setPencairanDana(idPesanan : string, selesai : boolean) : boolean
**ID Algoritma:** Algo-3203

```Pseudocode
INPUT: idPesanan (string), selesai (boolean)
OUTPUT: boolean

1. IF selesai == true THEN
2.     Jalankan Query [Q-3202] dengan parameter idPesanan
3.     Simpan hasil kembalian query ke variabel idPencairan
4.     
5.     IF idPencairan !=NULL THEN
6.         RETURN true
7.     ELSE
8.         RETURN false
9. RETURN false

```
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3202 | UPDATE pesanan SET statusPencairan = true, waktuPencairan = NOW() WHERE idPesanan = %idPesanan% RETURN idPesanan | Mengubah status pencairan dana ke penyedia jasa menjadi selesai |

### 5.32.4 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolTransaksi
**Nama Operasi:** updateStatusPembayaran(idPesanan : string, status : string) : boolean
**ID Algoritma:** Algo-3204

```Pseudocode
INPUT: idPesanan (string), status (string)
OUTPUT: boolean

1. Jalankan Query [Q-3203] dengan parameter idPesanan dan status
2. Simpan hasil query ke dalam variabel idUpdated
3.
4. JIKA idUpdated TIDAK KOSONG THEN
5.     RETURN true
6. ELSE
7.     RETURN false

```
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3202 | UPDATE pesanan SET statusPesanan = %status% WHERE idPesanan = %idPesanan% RETURN idPesanan | Memperbarui status pembayaran pada data pesanan di database |

### 5.32.5 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolTransaksi
**Nama Operasi:** catatRiwayatTransaksi(idPesanan : string) : boolean
**ID Algoritma:** Algo-3205

```Pseudocode
INPUT: idPesanan (string)
OUTPUT: boolean

1. // Memanggil method simpanTransaksi milik Entity RiwayatTransaksi (Algo-3401)
2. VAR isSukses = RiwayatTransaksi.simpanTransaksi(idPesanan, true)
3. RETURN isSukses
```


## 5.33 Kelas MetodePembayaran (C33)

**Nama Kelas:** MetodePembayaran
**ID Kelas:** C33

Tabel 5.33.1. Operasi Kelas [MetodePembayaran]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| getDetailMetode(idMetode) : MetodePembayaran | public | Mendapatkan Detail Metode Pembayaran |

 
Tabel 5.33.2. Atribut Kelas MetodePembayaran

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idMetode | private | string |
| namaMetode | private | string |
| nomorRekeningVA | private | string |


### 5.33.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** MetodePembayaran
**Nama Operasi:** getDetailMetode(idMetode)
**ID Algoritma:** Algo-3301

```Pseudocode
INPUT: idMetode : string
OUTPUT: detailMetode (MetodePembayaran) ATAU null

1. JIKA idMetode == NULL THEN
2.     THROW Exception "ID Metode Pembayaran tidak valid"
3. Jalankan Query [Q-3301] dengan parameter idMetode
4. Simpan hasil query ke dalam variabel detailMetode
7.
8. JIKA detailMetode != NULL THEN
9.     RETURN detailMetode
10. ELSE
11.    RETURN null

```
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3301 | SELECT id_metode, nama_metode, nomor_rekening_va FROM metode_pembayaran WHERE id_metode = %idMetode% LIMIT 1; | Mendapatkan DetailMetode sesuai dengan id yang diberikan |


## 5.34 Kelas RiwayatTransaksi (C34)

**Nama Kelas:** RiwayatTransaksi
**ID Kelas:** C34

Tabel 5.34.1. Operasi Kelas [RiwayatTransaksi]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| simpanTransaksi(idPesanan : string, statusTransaksi : boolean) : boolean | public | Menyimpan data hasil transaksi baru ke dalam riwayat |

 
Tabel 5.34.2. Atribut Kelas MetodePembayaran

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idRiwayat | private | string |
| idPesanan | private | string |
| tanggalTransaksi | private | DATE |
| statusTransaksi | private | boolean |


### 5.34.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** RiwayatTransaksi
**Nama Operasi:** simpanTransaksi() : void
**ID Algoritma:** Algo-3401

```Pseudocode
INPUT: idPesanan (string), statusTransaksi (boolean)
OUTPUT: boolean 

1. IF idPesanan KOSONG THEN
2.     THROW Exception "ID Pesanan tidak valid"
3. 
4.
5. tanggalTransaksi = Waktu_Sekarang()
6.
7. Jalankan Query [Q-3401] dengan parameter idPesanan, tanggalTransaksi, dan statusTransaksi
8. Simpan hasil query ke dalam variabel idRiwayatBaru
9.
10. JIKA idRiwayatBaru != NULL THEN
11.     RETURN true
12. ELSE
13.     RETURN false
14. 

```
| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-3401 | INSERT INTO riwayat_transaksi (id_pesanan, tanggal_transaksi, status_transaksi) VALUES (%idPesanan%, NOW(), %statusTransaksi%) RETURNING id_riwayat; | Memasukkan baris data riwayat transaksi baru ke dalam database dan mengembalikan ID riwayat yang baru saja terbentuk. |
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

