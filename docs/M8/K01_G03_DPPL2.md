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
<img alt="diagram sequence registrasi" src="../M7/assets/diagram/seqregis.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.1.2 Sequence Diagram [UC01]</i>
</p>


### 3.1.3 Diagram Kelas

<p align="center">
<img alt="diagram class uc01" src="../M7/assets/diagram/cdregis.png" width="35%">
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
<img alt="diagram sequence login" src="../M7/assets/diagram/seqlogin.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.2.2 Sequence Diagram [UC02]</i>
</p>


### 3.2.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas Melakukan Login" src="../M7/assets/diagram/cdlogin.png" width="35%">
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
<img alt="diagram sequence portofolio" src="../M7/assets/diagram/seqporto.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.3.2 Sequence Diagram [UC03]</i>
</p>


### 3.3.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas Mengisi Portofolio" src="../M7/assets/diagram/cdporto.png" width="35%">
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
<img alt="Sequence Diagram UC04" src="../M7/assets/diagram/diagram-uc4.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.4.1 Sequence Diagram Mengunggah Penawaran Jasa [UC04]</i>
</p>

### 3.4.3 Diagram Kelas
<p align="center">
<img alt="Diagram Kelas UC04" src="../M7/assets/diagram/kelas-uc4-h.svg" width="90%">
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
<img alt="Sequence Diagram UC05" src="../M7/assets/diagram/diagram-uc5.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.5.1 Sequence Diagram Mencari Penawaran Jasa [UC05]</i>
</p>

### 3.5.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC05" src="../M7/assets/diagram/kelas-uc5-h.svg" width="90%">
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
<img alt="Sequence Diagram UC06" src="../M7/assets/diagram/diagram-uc6.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.6.1 Sequence Diagram Melihat Informasi Jasa [UC06]</i>
</p>

### 3.6.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC06" src="../M7/assets/diagram/kelas-uc6-h.svg" width="90%">
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
<img alt="Sequence Diagram UC07" src="../M7/assets/diagram/diagram-uc7.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.7.1 Sequence Diagram Menggunakan Bookmark [UC07]</i>
</p>

### 3.7.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC07" src="../M7/assets/diagram/kelas-uc7-h.svg" width="90%">
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
<img alt="Sequence Diagram UC08" src="../M7/assets/diagram/SequenceDiagramUC08.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.8.2 Sequence Diagram [UC08]</i>
</p>


### 3.8.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC08" src="../M7/assets/diagram/ClassDiagramUC08.png" width="50%">
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
<img alt="Sequence Diagram UC09" src="../M7/assets/diagram/SequenceDiagramUC09.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.9.2 Sequence Diagram [UC09]</i>
</p>

### 3.9.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC09" src="../M7/assets/diagram/ClassDiagramUC09.png" width="50%">
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
<img alt="Sequence Diagram UC10" src="../M7/assets/diagram/SequenceDiagramUC10.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.10.2 Sequence Diagram [UC10]</i>
</p>


### 3.10.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC10" src="../M7/assets/diagram/ClassDiagramUC10.png" width="50%">
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
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC11_DiagramSekuens.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.11.1 Sequence Diagram [UC11]</i>
</p>



### 3.11.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC11_DiagramKelas.svg" width="70%">
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
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC12_DPPL_Normal.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.12.1 Sequence Diagram UC12 </i>
</p>

- **Skenario Alternatif : Mengajukan Revisi**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC12_DPPL_Alt.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.12.2 Sequence Diagram UC12 - Mengajukan Revisi</i>
</p>

### 3.12.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC12_DPPL-DiagramClass.svg" width="70%">
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
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC13_DPPL.svg" width="70%">
</p>
<p align="center">
<i>Gambar 3.13.1 Sequence Diagram [UC13]</i>
</p>

### 3.13.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC13_DPPL-DiagramKelas.svg" width="70%">
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
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC14_DiagramSekuens.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.14.1 Sequence Diagram [UC014]</i>
</p>


### 3.14.3 Diagram Kelas


<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC14_DiagramKelas.svg" width="80%">
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
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC15_DiagramSekuens.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.15.1 Sequence Diagram [UC015]</i>
</p>


### 3.15.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC15_DiagramKelas.svg" width="80%">
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
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC16_DiagramSekuens.svg" width="80%">
</p>
<p align="center">
<i>Gambar 3.16.1 Sequence Diagram [UC016]</i>
</p>


### 3.16.3 Diagram Kelas

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="../M7/assets/diagram/UC16_DiagramKelas.svg" width="80%">
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
| C23 | ChatRoom | <br> - idChatRoom : string <br> - idAnggota : string <br> - riwayatPesan : list of string <br> - waktuDibuat : Date | <br> + getRiwayatPesan(idChatroom : string) : list of pesan <br> + simpanPesan(pesan : string) : void <br> + getidChatRoom(idPenggunaJasa : string,idPenyediaJasa : string) : string <br> + getidAnggota(idChatRoom : string) : string |
| C24 | HalamanChat | - idSesiChat : string <br> - inputPesan : string <br> - statusKoneksi : string | <br> + tampilkanMenuChat() : void <br> + tampilkanRiwayatPesan() : void <br> + inputPesan() : void <br> + tombolKirimTerklik() : void <br> + tampilkanPesanError() : void <br> + tampilkanStatusBelumTerkirim() : void |
| C25 | LayananPesanInstan | - | <br> + buatSesiChat(idPenggunaJasa : string, idPenyediaJasa) : void <br> + validasiInputPesan(pesan : string) : boolean <br> + kirimPesan(pesan : string) : void <br> + simpanKeDatabase(idChatroom : string, idPengirim : string, pesan : string) : void <br> +  updateStatusBaca(idChatroom : string, idPengguna : string) : boolean |
| C26 | LayananNotifikasiChat | - | <br> + kirimNotifikasiPesan(idPesan : string, idPengirim : string, idPenerima : string) : void <br> + tampilkanPopUpNotifikasi(device : string, pengirim : string, pesan : string) : void  |
| C27 | Pesanan | <br> - idPesanan : string <br> - idPenggunaJasa : string <br> - idPenyediaJasa : string <br> - idJasa : string <br> - brief : string <br> - totalBiaya : double <br> - statusPesanan : boolean |  <br> + setStatusDiproses(idPesanan : string) : void <br> + setStatusSelesai(idPesanan : string) : void  <br> + setStatus(idPesanan : string, status : string) : void |
| C28 | HalamanPemesanan | <br> - idJasaDipilih : string <br> - briefPemesanan : string | <br> + tampilkanFormPemesanan() : void <br> + inputBriefPemesanan() : void <br> + tombolPesanTerklik() : void |
| C29 | HalamanPembayaran | <br> - totalHarga : Double <br> - idMetodePembayaran : string | <br> + tampilkanPilihanPembayaran() : void <br> + tampilkanRincianPembayaran() : void <br> + tombolBayarTerklik() : void <br> + tampilkanNotifikasiBerhasil() : void |
| C30 | HalamanRiwayatTransaksi | <br> - idTransaksi : string | <br> + tampilkanRiwayatTransaksi() : void |
| C31 | PengontrolPesanan | - | <br> + buatPesananBaru(briefPesanan : string, idJasa : string, idPenggunaJasa : string) : Pesanan <br> +   hitungTotalBiaya(idJasa) : double <br> + updateStatusPesanan(idPesanan: string, status: string) : void <br> + getDetailPesanan(idPesanan : string) : string |
| C32 | PengontrolTransaksi | - | <br> + prosesPembayaran(idPesanan : string, idMetode : string) : boolean <br> + validasiPembayaran(idPesanan : string) : boolean <br> +setPencairanDana(idPesanan : string, selesai : boolean) : boolean <br> +  updateStatusPembayaran(idPesanan : string, status : string) : boolean<br> + catatRiwayatTransaksi(idPesanan : string) : void |
| C33 | MetodePembayaran | <br> - idMetode : string <br> - namaMetode : string <br> - nomorRekeningVA : string | <br> + getDetailMetode(idMetode : string)  : MetodePembayaran |
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

Tabel 5.1. Daftar Kelas Perancangan dan Kelas Analisis Terkait

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
| :--- | :--- | :--- |
| 1 | Pengguna  | Pengguna |
| 2 | PenyediaJasa  | PenyediaJasa |
| 3 | PenggunaJasa  | PenggunaJasa |
| 4 | HalamanRegistrasi  | HalamanRegistrasi |
| 5 | LayananRegistrasi | LayananRegistrasi |
| 6 | HalamanLogin  | HalamanLogin |
| 7 | Autentikator  | Autentikator |
| 8 | HalamanPortofolio  | HalamanPortofolio |
| 9 | Portofolio  | Portofolio |
| 10 | PengontrolPortofolio  | PengontrolPortofolio |
| 11 | LayananUploadFile  | LayananUploadFile |
| 12 | Jasa  | Jasa |
| 13 | HalamanUploadJasa  | HalamanUploadJasa |
| 14 | JasaController  | JasaController |
| 15 | HalamanPencarian  | HalamanPencarian |
| 16 | HasilPencarian  | HasilPencarian |
| 17 | LayananPencarian  | LayananPencarian |
| 18 | LayananPembandingJasa  | LayananPembandingJasa |
| 19 | HalamanDetailJasa  | HalamanDetailJasa |
| 20 | Bookmark  | Bookmark |
| 21 | HalamanBookmark  | HalamanBookmark |
| 22 | PengontrolBookmark  | PengontrolBookmark |
| 23 | ChatRoom  | ChatRoom |
| 24 | HalamanChat  | HalamanChat |
| 25 | LayananPesanInstan  | LayananPesanInstan |
| 26 | LayananNotifikasiChat  | LayananNotifikasiChat |
| 27 | Pesanan  | Pesanan |
| 28 | HalamanPemesanan  | HalamanPemesanan |
| 29 | HalamanPembayaran  | HalamanPembayaran |
| 30 | HalamanRiwayatTransaksi  | HalamanRiwayatTransaksi |
| 31 | PengontrolPesanan  | PengontrolPesanan |
| 32 | PengontrolTransaksi  | PengontrolTransaksi |
| 33 | MetodePembayaran  | MetodePembayaran |
| 34 | RiwayatTransaksi  | RiwayatTransaksi |
| 35 | HalamanKonfirmasi  | HalamanKonfirmasi |
| 36 | ProdukAkhir  | ProdukAkhir |
| 37 | HalamanPengumpulan  | HalamanPengumpulan |
| 38 | HalamanDeliverables  | HalamanDeliverables |
| 39 | PengajuanRevisi  | PengajuanRevisi |
| 40 | HalamanRequestRevisi  | HalamanRequestRevisi |
| 41 | RevisiHandler  | RevisiHandler |
| 42 | PencairanDana  | PencairanDana |
| 43 | TiketLaporan  | TiketLaporan |
| 44 | HalamanPelaporan | HalamanPelaporan |
| 45 | LaporanHandler | LaporanHandler |
| 46 | Ulasan | Ulasan |
| 47 | HalamanUlasan  | HalamanUlasan |
| 48 | UlasanHandler  | UlasanHandler |
| 49 | TanggapanLaporan  | TanggapanLaporan |
| 50 | HalamanPengajuanMediasi | HalamanPengajuanMediasi |
| 51 | MediasiHandler | MediasiHandler |
| 52 | Admin  | Admin |
| 53 | HalamanDashboardAdmin | HalamanDashboardAdmin |
| 54 | PengumpulanController | PengumpulanController |

## 5.1 Kelas Pengguna

**Nama Kelas:** Pengguna  
**ID Kelas:** C01

Tabel 5.1.1. Operasi Kelas Pengguna

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| + buatAkun() : void | public | |
| - simpanProfil() : void | private | |
| + login() : void | public | |
| + setStatusAkun() : void | public | |
| + setSanksi() : void | public | |
| + getNama() : string | public | |
| + getEmail() : string | public | |
| + getStatusOnline() : string | public | |
| + getStatusAkun() : boolean | public | |

Tabel 5.1.2. Atribut Kelas Pengguna

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| nama | private | string |
| email | private | string |
| password | protected | string |
| statusOnline | private | boolean |
| statusAkun | private | boolean |
| sanksi | private | string |
| daftarProduk | private | list of string |

### 5.1.1 Algoritma/Query
**Nama Kelas:** Pengguna
**Nama Operasi:** buatAkun(nama : string, email : string, noTelepon : string, password : string) : void
**ID Algoritma:** Algo-0101

```Pseudocode
Input : nama : string, email : string, noTelepon : string, password : string
Output : void

1. IF nama == NULL OR email == NULL OR password == NULL THEN
2.     THROW Exception "Data akun tidak lengkap"
3. hashedPassword = hashPassword(password)
4. Jalankan Query [Q-0101] dengan parameter nama, email, noTelepon, hashedPassword
5. Simpan status eksekusi query ke dalam variabel statusInsert
6. IF statusInsert == false THEN
7.     THROW Exception "Gagal membuat akun pengguna"
8. statusOnline = false
9. statusAkun = true
```
Tabel 5.1.3. Query Operasi buatAkun

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-0101 | INSERT INTO pengguna (nama, email, no_telepon, password, status_online, status_akun, sanksi) <br> VALUES (%nama%, %email%, %noTelepon%, %hashedPassword%, false, true, NULL); | Menambahkan data akun pengguna baru dengan *hashed password* ke database |

### 5.1.2 Algoritma/Query
**Nama Kelas:** Pengguna
**Nama Operasi:** login(email : string, password : string) : boolean
**ID Algoritma:** Algo-0102

```Pseudocode
Input : email : string, password : string
Output : boolean

1. IF email == NULL OR password == NULL THEN
2.     RETURN false
3. Jalankan Query [Q-0102] dengan parameter email
4. Simpan hasil query ke dalam variabel dataPengguna
5. IF dataPengguna == NULL THEN
6.     RETURN false
7. isPasswordValid = verifikasiPassowrd(password, dataPengguna.password)
8. IF isPasswordValid == true AND dataPengguna.statusAkun == true THEN
9.     Jalankan Query [Q-0103] dengan parameter email
10.    Simpan status eksekusi query ke dalam variabel statusUpdate
11.    IF statusUpdate == true THEN
12.        statusOnline = true
13.        RETURN true
14.    ELSE
15.        RETURN false
16. ELSE
17.    RETURN false
```
Tabel 5.1.4. Query Operasi login

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-0102 | SELECT id_pengguna, email, password, status_akun <br> FROM pengguna <br> WHERE email = %email% <br> LIMIT 1; | Mengambil data id pengguna, hash password, dan status akun pengguna berdasarkan email |
| Q-0103 | UPDATE pengguna <br> SET status_online = true <br> WHERE email = %email%; | Memperbarui status *online* pengguna menjadi aktif saat berhasil masuk |

### 5.1.3 Algoritma/Query
**Nama Kelas:** Pengguna
**Nama Operasi:** simpanProfil(email : string, nama : string, noTelepon : string) : void
**ID Algoritma:** Algo-0103

```Pseudocode
Input : nama : string, noTelepon : string
Output : void

1. IF nama == NULL THEN
2.      THROW Exception "Nama tidak boleh kosong"
3. Jalankan Query [Q-0104] dengan parameter nama, noTelepon, email
4. Simpan status eksekusi query ke dalam variabel statusUpdate
5. IF statusUpdate == false THEN
6.      THROW Exception "Gagal memperbarui data profil pengguna"
```
Tabel 5.1.5. Query Operasi simpanProfil

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-0104 | UPDATE pengguna <br> SET nama = %nama%, no_telepon = %noTelepon% <br> WHERE email = %email%; | Memperbarui informasi nama dan nomor telepon pengguna berdasarkan alamat email |

### 5.1.4 Algoritma/Query
**Nama Kelas:** Pengguna  
**Nama Operasi:** setStatusAkun(email : string, statusAkun : boolean) : void  
**ID Algoritma:** Algo-0104

```Pseudocode
Input : email : string, statusAkun : boolean
Output : void

1. IF email == NULL THEN
2.     THROW Exception "Email pengguna tidak valid"
3. Jalankan Query [Q-0105] dengan parameter statusAkun, email
4. Simpan status eksekusi query ke dalam variabel statusUpdate
5. IF statusUpdate == false THEN
6.     THROW Exception "Gagal memperbarui status keaktifan akun"
```
Tabel 5.1.6. Query Operasi setStatusAkun

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-0105 | UPDATE pengguna <br> SET status_akun = %statusAkun% <br> WHERE email = %email%; | Mengubah status keaktifan akun pengguna berdasarkan alamat email |

### 5.1.5 Algoritma/Query
**Nama Kelas:** Pengguna  
**Nama Operasi:** setSanksi(email : string, sanksi : string) : void 
**ID Algoritma:** Algo-0105

```Pseudocode
Input : email : string, sanksi : string
Output : void

1. IF email == NULL THEN
2.     THROW Exception "Email pengguna tidak valid"
3. Jalankan Query [Q-0106] dengan parameter sanksi, email
4. Simpan status eksekusi query ke dalam variabel statusUpdate
5. IF statusUpdate == false THEN
6.     THROW Exception "Gagal memperbarui catatan sanksi akun"
```
Tabel 5.1.7. Query Operasi setSanksi

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-0106 | UPDATE pengguna <br> SET sanksi = %sanksi% <br> WHERE email = %email%; | Menetapkan atau memperbarui status sanksi pelanggaran pengguna berdasarkan alamat email |

### 5.1.6 Algoritma/Query
**Nama Kelas:** Pengguna  
**Nama Operasi:** getNama() : string  
**ID Algoritma:** Algo-0106  

```Pseudocode
Input : void
Output : string

1. RETURN nama
```

### 5.1.7 Algoritma/Query
**Nama Kelas:** Pengguna  
**Nama Operasi:** getEmail() : string  
**ID Algoritma:** Algo-0107  

```Pseudocode
Input : void
Output : string

1. RETURN email
```

### 5.1.8 Algoritma/Query
**Nama Kelas:** Pengguna  
**Nama Operasi:** getStatusOnline() : string  
**ID Algoritma:** Algo-0108  

```Pseudocode
Input : void
Output : string

1. IF statusOnline == true THEN
2.     RETURN "Online"
3. ELSE
4.     RETURN "Offline"
```

### 5.1.9 Algoritma/Query
**Nama Kelas:** Pengguna  
**Nama Operasi:** getStatusAkun() : boolean  
**ID Algoritma:** Algo-0109  

```Pseudocode
Input : void
Output : boolean

1. RETURN statusAkun
```

## 5.2 Kelas PenyediaJasa

**Nama Kelas:** PenyediaJasa  
**ID Kelas:** C02

Tabel 5.2.1. Operasi Kelas PenyediaJasa

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.2.2. Atribut Kelas PenyediaJasa

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.2.1 Algoritma/Query
**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

## 5.3 Kelas PenggunaJasa

**Nama Kelas:** PenggunaJasa
**ID Kelas:** C03

Tabel 5.3.1. Operasi Kelas PenggunaJasa

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.3.2. Atribut Kelas PenggunaJasa

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.3.1 Algoritma/Query
**Nama Kelas:** *[Nama kelas]*  
**Nama Operasi:** *[Signature operasi]*  
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

## 5.5 Kelas LayananRegistrasi
**Nama Kelas:** LayananRegistrasi
**ID Kelas:** C05

Tabel 5.5.1. Operasi Kelas LayananRegistrasi

| Nama Operasi | Visibility (private, public) | Keterangan |
| --- | --- | --- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.5.2. Atribut Kelas LayananRegistrasi

| Nama Atribut | Visibility (private, public) | Tipe |
| --- | --- | --- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.5.1 Algoritma/Query
**Nama Kelas:** LayananRegistrasi
**Nama Operasi:** *[Signature operasi]*
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]

```


## 5.7 Kelas Autentikator
**Nama Kelas:** Autentikator
**ID Kelas:** C07

Tabel 5.7.1. Operasi Kelas Autentikator

| Nama Operasi | Visibility (private, public) | Keterangan |
| --- | --- | --- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.7.2. Atribut Kelas Autentikator

| Nama Atribut | Visibility (private, public) | Tipe |
| --- | --- | --- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.7.1 Algoritma/Query
**Nama Kelas:** Autentikator
**Nama Operasi:** *[Signature operasi]*
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]
```

## 5.9 Kelas Portofolio
**Nama Kelas:** Portofolio
**ID Kelas:** C09

Tabel 5.9.1. Operasi Kelas Portofolio

| Nama Operasi | Visibility (private, public) | Keterangan |
| --- | --- | --- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.9.2. Atribut Kelas Portofolio

| Nama Atribut | Visibility (private, public) | Tipe |
| --- | --- | --- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.9.1 Algoritma/Query
**Nama Kelas:** Portofolio
**Nama Operasi:** *[Signature operasi]*
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]

```

## 5.10 Kelas PengontrolPortofolio
**Nama Kelas:** PengontrolPortofolio
**ID Kelas:** C10

Tabel 5.10.1. Operasi Kelas PengontrolPortofolio

| Nama Operasi | Visibility (private, public) | Keterangan |
| --- | --- | --- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.10.2. Atribut Kelas PengontrolPortofolio

| Nama Atribut | Visibility (private, public) | Tipe |
| --- | --- | --- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.10.1 Algoritma/Query
**Nama Kelas:** PengontrolPortofolio
**Nama Operasi:** *[Signature operasi]*
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]

```


## 5.11 Kelas LayananUploadFile
**Nama Kelas:** LayananUploadFile
**ID Kelas:** C11

Tabel 5.11.1. Operasi Kelas LayananUploadFile

| Nama Operasi | Visibility (private, public) | Keterangan |
| --- | --- | --- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.11.2. Atribut Kelas LayananUploadFile

| Nama Atribut | Visibility (private, public) | Tipe |
| --- | --- | --- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.11.1 Algoritma/Query
**Nama Kelas:** LayananUploadFile
**Nama Operasi:** *[Signature operasi]*
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]

```

## 5.12 Kelas Jasa
**Nama Kelas:** Jasa
**ID Kelas:** C12

Tabel 5.12.1. Operasi Kelas Jasa

| Nama Operasi | Visibility (private, public) | Keterangan |
| --- | --- | --- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.12.2. Atribut Kelas Jasa

| Nama Atribut | Visibility (private, public) | Tipe |
| --- | --- | --- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.12.1 Algoritma/Query
**Nama Kelas:** Jasa
**Nama Operasi:** *[Signature operasi]*
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]

```

## 5.14 Kelas JasaController
**Nama Kelas:** JasaController
**ID Kelas:** C14

Tabel 5.14.1. Operasi Kelas JasaController

| Nama Operasi | Visibility (private, public) | Keterangan |
| --- | --- | --- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.14.2. Atribut Kelas JasaController

| Nama Atribut | Visibility (private, public) | Tipe |
| --- | --- | --- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.14.1 Algoritma/Query
**Nama Kelas:** JasaController
**Nama Operasi:** *[Signature operasi]*
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]

```

## 5.16 Kelas HasilPencarian
**Nama Kelas:** HasilPencarian
**ID Kelas:** C16

Tabel 5.16.1. Operasi Kelas HasilPencarian

| Nama Operasi | Visibility (private, public) | Keterangan |
| --- | --- | --- |
| *[Signature operasi, termasuk parameter dan tipe kembalian]* | *[Visibility]* | *[Tanggung jawab operasi]* |
| *...* | *...* | *...* |

Tabel 5.16.2. Atribut Kelas HasilPencarian

| Nama Atribut | Visibility (private, public) | Tipe |
| --- | --- | --- |
| *[Nama atribut]* | *[Visibility]* | *[Tipe sesuai bahasa pemrograman yang digunakan]* |
| *...* | *...* | *...* |

### 5.16.1 Algoritma/Query
**Nama Kelas:** HasilPencarian
**Nama Operasi:** *[Signature operasi]*
**ID Algoritma:** *[Algo-001]*

```text
[Tuliskan pseudocode algoritma operasi di sini.]

```

## 5.4 Kelas HalamanRegistrasi

**Nama Kelas:** HalamanRegistrasi  
**ID Kelas:** C04

Tabel 5.4.1. Operasi Kelas HalamanRegistrasi

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanForm() : void | public | Menampilkan halaman registrasi: nama, email, nomor telepon, dan kata sandi. |
| kirimRegistrasi() : void | public | Menangani aksi tombol "Daftar" dan mengirim data registrasi untuk divalidasi. |
| tampilkanError() : void | public | Menampilkan pesan kesalahan validasi atau data yang sudah terdaftar. |

Tabel 5.4.2. Atribut Kelas HalamanRegistrasi

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| formRegistrasi | private | Form |
| pesanError | private | String |

### 5.4.1 Algoritma/Query

**Nama Kelas:** HalamanRegistrasi  
**Nama Operasi:** kirimRegistrasi() : void  
**ID Algoritma:** Algo-0401

```text
PROSEDUR kirimRegistrasi()
    JIKA tidak LayananRegistrasi.validasiData() MAKA
        tampilkanError()                  
        KELUAR
    LayananRegistrasi.cekEmail()
    LayananRegistrasi.cekNoTelepon()
    JIKA email atau nomor telepon sudah terdaftar MAKA
        tampilkanError()                 
        KELUAR
    LayananRegistrasi.registrasiPengguna()
    tampilkan notifikasi registrasi berhasil, lalu arahkan ke halaman login
```

## 5.6 Kelas HalamanLogin

**Nama Kelas:** HalamanLogin  
**ID Kelas:** C06

Tabel 5.6.1. Operasi Kelas HalamanLogin

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanForm() : void | public | Menampilkan halaman login: email dan kata sandi. |
| kirimLogin(email : String) : void | public | Menangani aksi tombol "Login" dan mengirim kredensial untuk divalidasi. |
| tampilkanError() : void | public | Menampilkan pesan kesalahan kredensial atau data login tidak lengkap. |

Tabel 5.6.2. Atribut Kelas HalamanLogin

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| pesanError | private | string |
| formLogin | private | string |

### 5.6.1 Algoritma/Query

**Nama Kelas:** HalamanLogin  
**Nama Operasi:** kirimLogin(email : String) : void  
**ID Algoritma:** Algo-0601

```text
PROSEDUR kirimLogin(email)
    JIKA email atau kata sandi kosong MAKA
        tampilkanError()                  // data login tidak lengkap
        KELUAR
    Autentikator.validasiKredensial(email, password)
    JIKA email atau kata sandi tidak sesuai dengan akun terdaftar MAKA
        tampilkanError()                  // email atau kata sandi salah
        KELUAR
    Autentikator.sesiLogin()
    arahkan pengguna ke halaman utama CariJasa
```

## 5.8 Kelas HalamanPortofolio

**Nama Kelas:** HalamanPortofolio  
**ID Kelas:** C08

Tabel 5.8.1. Operasi Kelas HalamanPortofolio

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanPortofolio() : void | public | Menampilkan portofolio Penyedia Jasa pada halaman profil. |
| kirimPortofolio(data : Portofolio) : void | public | Menangani aksi tombol "Simpan" dan mengirim data portofolio untuk divalidasi dan disimpan. |
| tampilkanError() : void | public | Menampilkan pesan kesalahan (data atau berkas tidak lengkap atau tidak sesuai). |

Tabel 5.8.2. Atribut Kelas HalamanPortofolio

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| formPortofolio | private | string |
| pesanError | private | string |

### 5.8.1 Algoritma/Query

**Nama Kelas:** HalamanPortofolio  
**Nama Operasi:** kirimPortofolio(data : Portofolio) : void  
**ID Algoritma:** Algo-0801

```text
PROSEDUR kirimPortofolio(data)
    JIKA tidak PengontrolPortofolio.validasiInputBerkas(data) MAKA
        tampilkanError()                   
        sesuai
        KELUAR
    JIKA data memiliki berkas pendukung MAKA
        LayananUploadFile.validasiFormatUkuran(file)
        LayananUploadFile.uploadFile(file)
    PengontrolPortofolio.simpanPortofolio()
    tampilkanPortofolio()               
```

## 5.13 Kelas HalamanUploadJasa

**Nama Kelas:** HalamanUploadJasa  
**ID Kelas:** C13

Tabel 5.13.1. Operasi Kelas HalamanUploadJasa

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| klikUnggah() : void | public | Menangani aksi tombol "Unggah" dan memproses penyimpanan penawaran jasa. |
| tampilkanPesanError() : void | public | Menampilkan peringatan data tidak lengkap atau format berkas tidak didukung. |
| tampilkanNotifikasiBerhasil() : void | public | Menampilkan notifikasi bahwa penawaran jasa berhasil diunggah. |

Tabel 5.13.2. Atribut Kelas HalamanUploadJasa

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| formNamaJasa | private | void |
| formKategori | private | void |
| formDeskripsi | private | void |
| formHarga | private | void |
| inputUploadBerkas | private | void |
| tombolUnggah | private | void |
| pesanError | private | string |

### 5.13.1 Algoritma/Query

**Nama Kelas:** HalamanUploadJasa  
**Nama Operasi:** klikUnggah() : void  
**ID Algoritma:** Algo-1301

```text
PROSEDUR klikUnggah()
    statusValidasiData   <- JasaController.validasiDataJasa(dataJasa)
    statusValidasiBerkas <- LayananUploadFile.validasiFormatUkuran(berkas)
    JIKA data dan berkas valid MAKA
        JasaController.simpanPenawaranJasa(dataJasa)
        LayananUploadFile.uploadFile(berkas)
        LayananUploadFile.getStatusUpload()
        Jasa.simpanJasa()
        PenyediaJasa.tambahPenawaranJasa()
        tampilkanNotifikasiBerhasil()     
    JIKA TIDAK MAKA                     
        tampilkanPesanError()
```

## 5.15 Kelas HalamanPencarian

**Nama Kelas:** HalamanPencarian  
**ID Kelas:** C15

Tabel 5.15.1. Operasi Kelas HalamanPencarian

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| inputKataKunci() : void | public | Menerima kata kunci pencarian jasa. |
| klikCari() : void | public | Menangani aksi tombol "Cari", termasuk penerapan filter harga, durasi, dan rating. |
| tampilkanPesanError(pesan : string) : void | public | Menampilkan pesan saat jasa tidak ditemukan. |

Tabel 5.15.2. Atribut Kelas HalamanPencarian

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| searchBar | private | void |
| filterHarga | private | void |
| filterDurasi | private | void |
| filterRating | private | void |
| tombolCari | private | void |
| pesanError | private | string |

### 5.15.1 Algoritma/Query

**Nama Kelas:** HalamanPencarian  
**Nama Operasi:** klikCari() : void  
**ID Algoritma:** Algo-1501

```text
PROSEDUR klikCari()
    dataJasa <- LayananPencarian.cariJasaBerdasarkanKeyword(keyword)   // memanggil Jasa.dapatkanDetailJasa()
    JIKA data jasa ditemukan MAKA
        HasilPencarian.tampilkanDaftarHasil()
        JIKA filter kriteria tambahan digunakan MAKA
        LayananPencarian.terapkanFilterPencarian(filter)
        HasilPencarian.tampilkanDaftarHasil()                         
    JIKA TIDAK MAKA
        tampilkanPesanError(pesan)                                     
```

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

## 5.19 Kelas HalamanDetailJasa

**Nama Kelas:** HalamanDetailJasa  
**ID Kelas:** C19

Tabel 5.19.1. Operasi Kelas HalamanDetailJasa

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanDetailJasa() : void | public | Menampilkan deskripsi, harga, profil penyedia, dan riwayat ulasan jasa. |
| tampilkanPesanError() : void | public | Menampilkan pesan saat data jasa tidak ditemukan atau nonaktif. |

Tabel 5.19.2. Atribut Kelas HalamanDetailJasa

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| tampilanDeskripsi | private | string |
| tampilanHarga | private | double |
| infoProfilPenyedia | private | string |
| tampilanRiwayatUlasan | private | list of string |
| pesanError | private | string |

### 5.19.1 Algoritma/Query

**Nama Kelas:** HalamanDetailJasa  
**Nama Operasi:** tampilkanDetailJasa() : void  
**ID Algoritma:** Algo-1901

```text
PROSEDUR tampilkanDetailJasa()
    infoJasa <- JasaController.ambilDetailJasa(idJasa)       
    JIKA data jasa ditemukan dan aktif MAKA
        dataProfilPenyedia <- PenyediaJasa.getPengalamandanPrestasi()
        riwayatUlasan      <- Ulasan.getDetailUlasan()
        tampilkan informasi detail jasa (deskripsi, harga, profil penyedia, riwayat ulasan)
    JIKA TIDAK MAKA                                           
        tampilkanPesanError()
```


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

## 5.21 Kelas HalamanBookmark

**Nama Kelas:** HalamanBookmark  
**ID Kelas:** C21

Tabel 5.21.1. Operasi Kelas HalamanBookmark

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanDaftarTersimpan() : void | public | Menampilkan daftar jasa yang disimpan pengguna ("Jasa Tersimpan"). |
| klikIkonBookmark() : void | public | Menangani aksi menyimpan jasa melalui ikon bookmark. |
| klikIkonHapus() : void | public | Menangani aksi menghapus jasa dari daftar tersimpan. |
| tampilkanNotifikasi() : void | public | Menampilkan notifikasi berhasil disimpan, berhasil dihapus, atau permintaan login. |

Tabel 5.21.2. Atribut Kelas HalamanBookmark

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| daftarJasaTersimpan | private | list of Jasa |
| ikonBookmarkAktif | private | void |
| ikonBookmarkNonaktif | private | void |
| tombolHapusBookmark | private | void |

### 5.21.1 Algoritma/Query

**Nama Kelas:** HalamanBookmark  
**Nama Operasi:** klikIkonBookmark() : void  
**ID Algoritma:** Algo-2101

```text
PROSEDUR klikIkonBookmark()
    PengontrolBookmark.tambahDataBookmark()
    Bookmark.simpanBookmark()
    tampilkanNotifikasi()               
```

### 5.21.2 Algoritma/Query

**Nama Kelas:** HalamanBookmark  
**Nama Operasi:** tampilkanDaftarTersimpan() : void  
**ID Algoritma:** Algo-2102

```text
PROSEDUR tampilkanDaftarTersimpan()
    PengontrolBookmark.ambilDaftarBookmarkPengguna()
        daftarIdJasa <- Bookmark.lihatBookmark()
        UNTUK SETIAP idJasa DALAM daftarIdJasa
        detailJasaTersimpan <- Jasa.dapatkanDetailJasa(idJasa)
    daftarJasaTersimpan <- daftar lengkap jasa
    tampilkan daftarJasaTersimpan
```

### 5.21.3 Algoritma/Query

**Nama Kelas:** HalamanBookmark  
**Nama Operasi:** klikIkonHapus() : void  
**ID Algoritma:** Algo-2103

```text
PROSEDUR klikIkonHapus()
    PengontrolBookmark.hapusDataBookmark()
        Bookmark.hapusBookmark()
    tampilkanNotifikasi()               
```

## 5.22 Kelas PengontrolBookmark (C22)

**Nama Kelas:** PengontrolBookmark
**ID Kelas:** C22

Tabel 5.22.1. Operasi Kelas [PengontrolBookmark]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tambahDataBookmark(idPeggunaJasa : string, idJasa : string) : boolean | public | menambahkan data bookmark |
| hapusDataBookmark(idBookmark : string, idPenggunaJasa : string) : boolean | public | menghapus bookmark |
| ambilDaftarBookmarkPengguna(idPenggunaJasa : string) : list of Bookmark  | public | mengambil daftar bookmark |
 

### 5.22.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** PengontrolBookmark
**Nama Operasi:** tambahDataBookmark(idPeggunaJasa : string, idJasa : string) : boolean  
**ID Algoritma:** Algo-2201

```Pseudocode
INPUT: idPenggunaJasa (string), idJasa (string)
OUTPUT: boolean

1. if idPenggunaJasa ==NULL OR idJasa == NULL THEN
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
| getRiwayatPesan(idChatroom : string) : list of pesan | public | mendapatkan riwayat pesan |
| simpanPesan(pesan : string) : void | public | menyimpan pesan |
| getidChatRoom(idPenggunaJasa : string, idPenyediaJasa : string) : string | public | mendapatkan idChatroom |
| getidAnggota(idChatRoom : string) : string | public | mendapatkan idAnggota |

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

## 5.24 Kelas HalamanChat

**Nama Kelas:** HalamanChat  
**ID Kelas:** C24

Tabel 5.24.1. Operasi Kelas HalamanChat

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanMenuChat() : void | public | Menampilkan menu chat beserta riwayat pesan jika ada. |
| tampilkanRiwayatPesan() : void | public | Menampilkan riwayat pesan pada ruang obrolan. |
| inputPesan() : void | public | Menerima pesan yang diketik pengguna. |
| tombolKirimTerklik() : void | public | Menangani aksi tombol kirim pesan. |
| tampilkanPesanError() : void | public | Menampilkan pesan kesalahan saat input pesan tidak valid. |
| tampilkanStatusBelumTerkirim() : void | public | Menampilkan ikon atau notifikasi bahwa pesan belum terkirim. |

Tabel 5.24.2. Atribut Kelas HalamanChat

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idSesiChat | private | string |
| inputPesan | private | string |
| statusKoneksi | private | string |

### 5.24.1 Algoritma/Query

**Nama Kelas:** HalamanChat  
**Nama Operasi:** tombolKirimTerklik() : void  
**ID Algoritma:** Algo-2401

```text
PROSEDUR tombolKirimTerklik()
    inputPesanValid <- LayananPesanInstan.validasiInputPesan()
    JIKA inputPesanValid MAKA
        LayananPesanInstan.kirimPesan()
        ChatRoom.getRiwayatPesan()
        LayananPesanInstan.simpanKeDatabase()
        LayananNotifikasiChat.kirimNotifikasiPesan()
        LayananNotifikasiChat.tampilkanPopUpNotifikasi()
        tampilkanRiwayatPesan()
    JIKA TIDAK MAKA
        tampilkanPesanError()
    JIKA koneksi internet terputus saat mengirim MAKA          
        tampilkanStatusBelumTerkirim()
```

## 5.25 Kelas LayananPesanInstan (C25)

**Nama Kelas:** LayananPesanInstan
**ID Kelas:** C25

Tabel 5.25.1. Operasi Kelas [LayananPesanInstan]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| buatSesiChat(idPenggunaJasa : string, idPenyediaJasa) : void   | public | membuat sesiChat |
| validasiInputPesan(pesan : string) : boolean | public | memvalidasi input pesan yang diberikan pengguna |
| kirimPesan(pesan : string) : void  | public | mengirim pesan (menyimpan ke riwayat pesan) |
| simpanKeDatabase(idChatroom : string, idPengirim : string, pesan : string) : void | public | menyimpan chat ke database |
| updateStatusBaca(idChatroom : string, idPengguna : string) : boolean | public | mengupdate statusBaca pengguna |
 

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
| kirimNotifikasiPesan(idPesan : string, idPengirim : string, idPenerima : string) : void | public  | mengirim notifikasi pesan |
| tampilkanPopUpNotifikasi(device : string, pengirim : string, pesan : string) : void| public  | mengirimkan Pop Up Notifikasinya | 
 

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
| setStatusDiproses(idPesanan : string) : void | public | mengupdate status pengerjaan menjadi diproses|
| setStatusSelesai(idPesanan: string) : void | public | mengupdate status pengerjaan menjadi selesai |
| setStatus(idPesanan: string, status : string) : void | public | mengupdate status pengerjaan menjadi sesuai parameter |

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
**ID Algoritma:** Algo-2703

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

## 5.28 Kelas HalamanPemesanan

**Nama Kelas:** HalamanPemesanan  
**ID Kelas:** C28

Tabel 5.28.1. Operasi Kelas HalamanPemesanan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanFormPemesanan() : void | public | Menampilkan formulir pemesanan jasa. |
| inputBriefPemesanan() : void | public | Menerima brief pemesanan dari Pengguna Jasa. |
| tombolPesanTerklik() : void | public | Menangani aksi tombol pesan dan membuat pesanan baru. |

Tabel 5.28.2. Atribut Kelas HalamanPemesanan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idJasaDipilih | private | string |
| briefPemesanan | private | string |

### 5.28.1 Algoritma/Query

**Nama Kelas:** HalamanPemesanan  
**Nama Operasi:** tombolPesanTerklik() : void  
**ID Algoritma:** Algo-2801

```text
PROSEDUR tombolPesanTerklik()
    PengontrolPesanan.buatPesananBaru()
    JIKA briefPemesanan kosong MAKA
        tampilkanFormPemesanan()          
        KELUAR
    PengontrolPesanan.hitungTotalBiaya()
    buat Pesanan
    HalamanPembayaran.tampilkanPilihanPembayaran()
```

---

## 5.29 Kelas HalamanPembayaran

**Nama Kelas:** HalamanPembayaran  
**ID Kelas:** C29

Tabel 5.29.1. Operasi Kelas HalamanPembayaran

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanPilihanPembayaran() : void | public | Menampilkan metode pembayaran yang tersedia. |
| tampilkanRincianPembayaran() : void | public | Menampilkan rincian pembayaran dan total harga. |
| tombolBayarTerklik() : void | public | Menangani aksi tombol bayar. |
| tampilkanNotifikasiBerhasil() : void | public | Menampilkan notifikasi bahwa pembayaran berhasil. |

Tabel 5.29.2. Atribut Kelas HalamanPembayaran

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| totalHarga | private | Double |
| idMetodePembayaran | private | string |

### 5.29.1 Algoritma/Query

**Nama Kelas:** HalamanPembayaran  
**Nama Operasi:** tampilkanPilihanPembayaran() : void  
**ID Algoritma:** Algo-2901

```text
PROSEDUR tampilkanPilihanPembayaran()
    PengontrolTransaksi.prosesPembayaran()
        MetodePembayaran.getDetailMetode()
    tampilkanRincianPembayaran()
```

### 5.29.2 Algoritma/Query

**Nama Kelas:** HalamanPembayaran  
**Nama Operasi:** tombolBayarTerklik() : void  
**ID Algoritma:** Algo-2902

```text
PROSEDUR tombolBayarTerklik()
    statusTransaksi <- PengontrolTransaksi.validasiPembayaran()
    JIKA statusTransaksi berhasil MAKA
        PengontrolTransaksi.updateStatusPembayaran()
        PengontrolPesanan.updateStatusPesanan()
        Pesanan.setStatusDiproses()
        buat RiwayatTransaksi
        tampilkanNotifikasiBerhasil()
        HalamanRiwayatTransaksi.tampilkanRiwayatTransaksi()
    JIKA gagal MAKA
        tampilkanRincianPembayaran()      
```

## 5.30 Kelas HalamanRiwayatTransaksi

**Nama Kelas:** HalamanRiwayatTransaksi  
**ID Kelas:** C30

Tabel 5.30.1. Operasi Kelas HalamanRiwayatTransaksi

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanRiwayatTransaksi() : void | public | Menampilkan daftar transaksi yang telah dilakukan beserta harga dan status transaksi (UC09, UC14). |

Tabel 5.30.2. Atribut Kelas HalamanRiwayatTransaksi

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idTransaksi | private | string |
| daftarPesananSelesai | private | list of Pesanan |

### 5.30.1 Algoritma/Query

**Nama Kelas:** HalamanRiwayatTransaksi  
**Nama Operasi:** tampilkanRiwayatTransaksi() : void  
**ID Algoritma:** Algo-3001

```text
PROSEDUR tampilkanRiwayatTransaksi()
    tampilkan daftar transaksi beserta harga dan status transaksi
    SAAT PenggunaJasa memilih "Beri Ulasan" pada pesanan dalam daftarPesananSelesai
        PenggunaJasa.beriUlasan(idPesanan)           
        HalamanUlasan.tampilkanFormUlasan()
```

## 5.31 Kelas PengontrolPesanan (C31)

**Nama Kelas:** PengontrolPesanan
**ID Kelas:** C31

Tabel 5.31.1. Operasi Kelas [PengontrolPesanan]

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| buatPesananBaru(briefPesanan : string, idJasa : string, idPenggunaJasa : string) : Pesanan | public | Membuat Pesanan Baru |
| hitungTotalBiaya(idJasa) : double | public | menghitung biaya pesanan |
| updateStatusPesanan(idPesanan: integer, status: string) : void | public | mengubah status pesanan |
| getDetailPesanan(idPesanan : string) : string | public | mendapatkan detail pesanan |
 

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
| getDetailMetode(idMetode : string) : MetodePembayaran | public | Mendapatkan Detail Metode Pembayaran |

 
Tabel 5.33.2. Atribut Kelas MetodePembayaran

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idMetode | private | string |
| namaMetode | private | string |
| nomorRekeningVA | private | string |


### 5.33.1 Algoritma/Query

Bagian ini diisi untuk kerangka algoritma proses yang dianggap cukup penting. Algoritma dapat dituliskan sebagai *pseudocode*. Implementasi *skeleton code* juga dapat digunakan untuk kelas yang sudah terdefinisi pada bahasa pemrograman tertentu.

**Nama Kelas:** MetodePembayaran
**Nama Operasi:** getDetailMetode(idMetode : string)
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
**Nama Operasi:** simpanTransaksi(idPesanan : string, statusTransaksi : boolean) : boolean
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

## 5.35 Kelas HalamanKonfirmasi

**Nama Kelas:** HalamanKonfirmasi  
**ID Kelas:** C35

Tabel 5.35.1. Operasi Kelas HalamanKonfirmasi

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanDetailPesanan() : void | public | Menampilkan detail pesanan (brief) saat Penyedia Jasa membuka notifikasi pesanan. |
| tombolTerimaTerklik() : void | public | Menangani aksi Penyedia Jasa menerima pesanan. |
| tombolTolakTerklik() : void | public | Menangani aksi Penyedia Jasa menolak pesanan. |
| tampilkanStatusPesanan() : void | public | Menampilkan status pesanan (diterima dan diproses, atau ditolak). |

Tabel 5.35.2. Atribut Kelas HalamanKonfirmasi

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idPesanan | private | string |
| detailBrief | private | string |

### 5.35.1 Algoritma/Query

**Nama Kelas:** HalamanKonfirmasi  
**Nama Operasi:** tampilkanDetailPesanan() : void  
**ID Algoritma:** Algo-3501

```text
PROSEDUR tampilkanDetailPesanan()
    detailBrief <- PengontrolPesanan.getDetailPesanan()     
    getDetailPesanan()
    tampilkanDetailPesanan()
```


### 5.35.2 Algoritma/Query

**Nama Kelas:** HalamanKonfirmasi  
**Nama Operasi:** tombolTerimaTerklik() : void  
**ID Algoritma:** Algo-3502

```text
PROSEDUR tombolTerimaTerklik()
    PenyediaJasa.terimaPesanan()
    PengontrolPesanan.updateStatusPesanan()
        Pesanan.setStatusDiproses()
        PengontrolTransaksi.updateStatusPembayaran()
        MetodePembayaran.getDetailMetode()
        buat RiwayatTransaksi
    tampilkanStatusPesanan()                                
```


### 5.35.3 Algoritma/Query

**Nama Kelas:** HalamanKonfirmasi  
**Nama Operasi:** tombolTolakTerklik() : void  
**ID Algoritma:** Algo-3503

```text
PROSEDUR tombolTolakTerklik()
    PenyediaJasa.tolakPesanan()
    PengontrolPesanan.updateStatusPesanan()
        PengontrolTransaksi.updateStatusPembayaran()           
        buat RiwayatTransaksi
    tampilkanStatusPesanan()                                 
```

## 5.37 Kelas HalamanPengumpulan

**Nama Kelas:** HalamanPengumpulan  
**ID Kelas:** C37

Tabel 5.37.1. Operasi Kelas HalamanPengumpulan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanFormPengumpulan() : void | public | Menampilkan halaman detail pekerjaan dan tempat pengumpulan hasil kerja. |
| inputDeskripsiHasil() : string | public | Menerima deskripsi singkat hasil pekerjaan. |
| unggahDeliverables() : FILE | public | Menerima berkas hasil pekerjaan yang diunggah. |
| inputLink() : string | public | Menerima tautan hasil pekerjaan sebagai alternatif berkas. |
| klikKirimHasil() : boolean | public | Menangani aksi "Kirim Hasil Pekerjaan" dan mengembalikan keberhasilan pengiriman. |
| tampilkanStatusPengiriman(terkirim : boolean) : void | public | Menampilkan notifikasi status pengiriman hasil pekerjaan. |
| tampilkanPesanError(pesanError : string) : void | public | Menampilkan pesan kesalahan (data tidak lengkap, ukuran berkas, koneksi). |

Tabel 5.37.2. Atribut Kelas HalamanPengumpulan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| deskripsiHasil | private | string |
| fileURL | private | string |
| tombolKirim | private | void |
| pesanError | private | string |

### 5.37.1 Algoritma/Query

**Nama Kelas:** HalamanPengumpulan  
**Nama Operasi:** inputDeskripsiHasil() : string  
**ID Algoritma:** Algo-3701

```text
FUNGSI inputDeskripsiHasil() : string
    PengumpulanController.validasiDeskripsi()
    JIKA deskripsi tidak sesuai batasan MAKA
        tampilkanPesanError("Deskripsi Melewati Batasan")
```


### 5.37.2 Algoritma/Query

**Nama Kelas:** HalamanPengumpulan  
**Nama Operasi:** klikKirimHasil() : boolean  
**ID Algoritma:** Algo-3702

```text
FUNGSI klikKirimHasil() : boolean
    PengumpulanController.validasiPengumpulan()
    JIKA file kosong DAN link kosong MAKA
        tampilkanPesanError("Unggah Berkas atau Isi Tautan")
        KEMBALIKAN false
    JIKA file tidak kosong MAKA
        LayananUploadFile.validasiFormatUkuran(file)
        JIKA file terlalu besar MAKA                         
        tampilkanStatusPengiriman(false)
        tampilkanPesanError("Size File Terlalu Besar")
        KEMBALIKAN false
        pathFile <- LayananUploadFile.saveDeliverables(file)
    ProdukAkhir.simpanProdukAkhir(deskripsi, pathFile, link)   
    PenyediaJasa.saveProdukAkhir(idProduk, idPenyediaJasa)
    ProdukAkhir.updateStatusPengerjaan(true)
    tampilkanStatusPengiriman(true)                        
    KEMBALIKAN true
```

## 5.38 Kelas HalamanDeliverables

**Nama Kelas:** HalamanDeliverables  
**ID Kelas:** C38

Tabel 5.38.1. Operasi Kelas HalamanDeliverables

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanDeliverables() : void | public | Menampilkan hasil pekerjaan, lampiran, status pekerjaan, dan jumlah revisi. |
| ajukanRevisi() : void | public | Menangani aksi Pengguna Jasa mengajukan revisi, dengan batas kuota revisi. |
| konfirmasiPesanan() : void | public | Menangani aksi Pengguna Jasa mengonfirmasi hasil dan menandai pesanan "Selesai". |
| tampilkanError(msg : string) : void | public | Menampilkan pesan kesalahan (kuota revisi habis, koneksi gagal). |

Tabel 5.38.2. Atribut Kelas HalamanDeliverables

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| deskripsiHasil | private | void |
| fileURL | private | string |
| tombolKonfirmasi | private | void |
| tombolRevisi | private | void |
| jumlahRevisi | private | int |
| pesanError | private | string |
| tombolBantuan | private | void |
| lampiranDeliverables | private | FILE |

### 5.38.1 Algoritma/Query

**Nama Kelas:** HalamanDeliverables  
**Nama Operasi:** konfirmasiPesanan() : void  
**ID Algoritma:** Algo-3801

```text
PROSEDUR konfirmasiPesanan()
    idPesanan <- PengontrolPesanan, melalui Pesanan.getIdPesanan()
    PengontrolTransaksi.prosesPembayaran(idPesanan)
        PengontrolPesanan.hitungTotalBiaya()
        PengontrolTransaksi.validasiPembayaran()
        PengontrolTransaksi.setPencairanDana(true)            
        kirim notifikasi pencairan ke PenyediaJasa
        PengontrolTransaksi.updateStatusPembayaran(true)
        PengontrolPesanan.updateStatusPesanan(true)           
    JIKA server tidak merespons > 10 detik MAKA             
        tampilkanError("Proses Konfirmasi Gagal. Periksa koneksi internet Anda dan coba lagi.")
```


### 5.38.2 Algoritma/Query

**Nama Kelas:** HalamanDeliverables  
**Nama Operasi:** ajukanRevisi() : void  
**ID Algoritma:** Algo-3802

```text
PROSEDUR ajukanRevisi()
    PenggunaJasa.ajukanRevisi()
    HalamanRequestRevisi.tampilkanformRevisi()
```

## 5.40 Kelas HalamanRequestRevisi

**Nama Kelas:** HalamanRequestRevisi  
**ID Kelas:** C40

Tabel 5.40.1. Operasi Kelas HalamanRequestRevisi

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanformRevisi() : void | public | Menampilkan form revisi beserta detail pekerjaan. |
| tampilkanFieldPengisianRevisi() : void | public | Menampilkan kolom pengisian permintaan revisi. |
| tampilkanKuotaRevisi() : void | public | Menampilkan informasi sisa kuota revisi. |
| kirimRevisi() : void | public | Menangani aksi "Ajukan Revisi" dan meneruskannya ke Penyedia Jasa. |
| tampilkanPesan() : void | public | Menampilkan pesan error atau pesan untuk Penyedia Jasa. |

Tabel 5.40.2. Atribut Kelas HalamanRequestRevisi

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| formRevisi | private | void |
| detailRevisi | private | void |
| kuotaRevisi | private | int |
| tombolRevisi | private | element |
| pesanUntukPenyedia | private | string |

### 5.40.1 Algoritma/Query

**Nama Kelas:** HalamanRequestRevisi  
**Nama Operasi:** tampilkanformRevisi() : void  
**ID Algoritma:** Algo-4001

```text
PROSEDUR tampilkanformRevisi()
    detail <- PengontrolPesanan.getDetailPesanan()          
    getDetailPesanan()
    JIKA batas waktu pengajuan revisi terlewati MAKA
        tampilkanPesan("maaf waktu pengajuan revisi sudah habis")
        KELUAR
    tampilkanKuotaRevisi()
```


### 5.40.2 Algoritma/Query

**Nama Kelas:** HalamanRequestRevisi  
**Nama Operasi:** kirimRevisi() : void  
**ID Algoritma:** Algo-4002

```text
PROSEDUR kirimRevisi()
    RevisiHandler.isRevisiRequestValid()
    JIKA kuota revisi habis MAKA
        tampilkanPesan("Kuota Revisi yang diajukan sudah habis. Jika dirasa kualitas masih jauh dari kata sesuai dengan kesepakatan awal, silakan ajukan tiket laporan")
        KELUAR
    buat PengajuanRevisi
    RevisiHandler.updateStatusPengerjaan()
    RevisiHandler.sendRevisi(deskripsi, lampiran)
    RevisiHandler.sendNotifikasiRevisi()
    JIKA revisi terkirim MAKA tampilkanPesan()              
    JIKA server bermasalah MAKA
        tampilkanPesan("Revisi Gagal Terkirim Silahkan Coba Beberapa Menit lagi")
```

## 5.44 Kelas HalamanPelaporan

**Nama Kelas:** HalamanPelaporan  
**ID Kelas:** C44

Tabel 5.44.1. Operasi Kelas HalamanPelaporan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanFormLaporan() : void | public | Menampilkan form laporan: kategori pelanggaran, deskripsi masalah, dan lampiran bukti. |
| tampilkanTiketdanTanggapan() : void | public | Menampilkan nomor tiket, status laporan, dan tanggapan admin. |
| tampilkanPesanError() : void | public | Menampilkan pesan kesalahan validasi atau pengiriman laporan. |

Tabel 5.44.2. Atribut Kelas HalamanPelaporan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| formLaporan | private | void |
| kategoriPelanggaran | private | void |
| deskripsiPelanggaran | private | void |
| kolomBukti | private | void |
| statusLaporan | private | boolean |
| noTiket | private | string |
| pesanError | private | string |
| tanggapanAdmin | private | string |

### 5.44.1 Algoritma/Query

**Nama Kelas:** HalamanPelaporan  
**Nama Operasi:** tampilkanFormLaporan() : void  
**ID Algoritma:** Algo-4401

```text
PROSEDUR tampilkanFormLaporan()
    tampilkan form laporan
    SAAT pengguna mengumpulkan tiket
        LaporanHandler.validasiFormatLaporan()
        JIKA bukti/deskripsi/kategori tidak lengkap MAKA
            tampilkanPesanError("Bukti/Deskripsi/Kategori Tidak Lengkap")
            KELUAR
        idPenggunaJasa <- PenggunaJasa.getIdPenggunaJasa()
        idPenyediaJasa <- PenyediaJasa.getIdPenyediaJasa()
        TiketLaporan.createTiket(idPenggunaJasa, idPenyediaJasa, URLbukti, Kategori, Deskripsi)
        JIKA tiket berhasil dibuat MAKA tampilkan "Ticket Berhasil Dibuat"
        JIKA tidak (server bermasalah) MAKA tampilkanPesanError("Ticket Gagal dibuat")
```

## 5.47 Kelas HalamanUlasan

**Nama Kelas:** HalamanUlasan  
**ID Kelas:** C47

Tabel 5.47.1. Operasi Kelas HalamanUlasan

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanFormUlasan() : void | public | Menampilkan form ulasan: penilaian bintang, unggah dokumentasi, dan komentar. |
| inputRatingBintang(rating: integer) : void | public | Menerima penilaian bintang (wajib diisi). |
| inputKomentar(teksKomentar: string) : void | public | Menerima komentar (opsional, maksimal 300 kata). |
| unggahDokumentasi(fileDokumentasi: FILE) : void | public | Menerima berkas dokumentasi (opsional). |
| submitUlasan() : void | public | Menangani aksi "Kirim Ulasan". |
| tampilkanPesanError() : void | public | Menampilkan pesan kesalahan validasi atau pengiriman. |
| tampilkanNotifikasiBerhasil() : void | public | Menampilkan notifikasi bahwa ulasan berhasil dikirim. |

Tabel 5.47.2. Atribut Kelas HalamanUlasan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| rating | private | integer |
| teksKomentar | private | string |
| fileDokumentasi | private | FILE |
| pesanError | private | string |

### 5.47.1 Algoritma/Query

**Nama Kelas:** HalamanUlasan  
**Nama Operasi:** submitUlasan() : void  
**ID Algoritma:** Algo-4701

```text
PROSEDUR submitUlasan()
    UlasanHandler.prosesUlasan(idPesanan, rating, teksKomentar, fileDokumentasi)
        UlasanHandler.validasiKelengkapanRating(rating)
        UlasanHandler.validasiPanjangKomentar(teksKomentar)
        UlasanHandler.validasiFormatBerkas(fileDokumentasi)
    JIKA validasi berhasil MAKA
        Ulasan.simpanUlasan()
        UlasanHandler.perbaruiRating(idPenyediaJasa, rating)
        PengontrolPesanan.updateStatusPesanan(idPesanan, "Selesai")   
        PengontrolTransaksi.catatRiwayatTransaksi(idPesanan)          
        simpanTransaksi()
        tampilkanNotifikasiBerhasil()
    JIKA tidak MAKA
        tampilkanPesanError(pesanError)
```

## 5.50 Kelas HalamanPengajuanMediasi

**Nama Kelas:** HalamanPengajuanMediasi  
**ID Kelas:** C50

Tabel 5.50.1. Operasi Kelas HalamanPengajuanMediasi

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanDetailPelaporan() : void | public | Menampilkan detail pelaporan (kategori pelanggaran, deskripsi masalah, dan bukti) pada ruang mediasi. |
| tampilkanRiwayatPesan() : void | public | Menampilkan riwayat pesan ruang mediasi antara Admin, Pengguna Jasa, dan Penyedia Jasa. |
| inputTindakan() : void | public | Menerima jenis tindakan yang dipilih Admin (tidak ada sanksi, teguran, pembekuan sementara, atau pemblokiran akun) dan meneruskannya ke MediasiHandler. |
| akhiriMediasi() : void | public | Menangani aksi "Akhiri Mediasi" dan meneruskannya ke MediasiHandler. |
| tampilkanNotifikasiSelesai() : void | public | Menampilkan notifikasi bahwa proses mediasi telah selesai. |
| tampilkanPesanError(pesanError : string) : void | public | Menampilkan pesan kesalahan saat mediasi gagal dibuka atau diakhiri. |


Tabel 5.50.2. Atribut Kelas HalamanPengajuanMediasi

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| detailPelaporan | public | TiketLaporan |
| riwayatPesan | public | list of string |
| opsiTindakan | public | - |
| pesanError | public | string |


### 5.50.1 Algoritma/Query

**Nama Kelas:** HalamanPengajuanMediasi  
**Nama Operasi:** - (kelas belum memiliki operasi; alur interaksi pada UC16)  
**ID Algoritma:** Algo-5001

```text
    HalamanDashboardAdmin.tampilkanHalamanMediasi()          
    tampilkan halaman mediasi dan riwayat pesan              
    Admin.pilihJenisTindakan()
    MediasiHandler.inputTindakan()                           
    SAAT Admin mengakhiri mediasi
        MediasiHandler.akhiriMediasi()
        TiketLaporan.UpdateStatusTiket()
        JIKA status berhasil diperbarui MAKA MediasiHandler.tampilkanNotifikasiSelesai()
        JIKA gagal MAKA MediasiHandler.tampilkanPesanError()
```

## 5.53 Kelas HalamanDashboardAdmin

**Nama Kelas:** HalamanDashboardAdmin  
**ID Kelas:** C53

Tabel 5.53.1. Operasi Kelas HalamanDashboardAdmin

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| tampilkanDetailTiket() : void | public | Menampilkan detail tiket: kategori pelanggaran, deskripsi masalah, dan lampiran bukti. |
| inputTindakan() : void | public | Menerima pilihan tindakan Admin (tidak ada sanksi, teguran, pembekuan sementara, pemblokiran akun). |
| selesaikanTiket() : void | public | Menangani aksi "Selesaikan Laporan". |
| mulaiMediasi() : void | public | Menangani aksi "Mulai Mediasi". |
| tampilkanPesanError() : void | public | Menampilkan pesan kesalahan proses. |
| tampilkanHalamanMediasi() : void | public | Menampilkan antarmuka ruang mediasi. |

Tabel 5.53.2. Atribut Kelas HalamanDashboardAdmin

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| daftarTiket | private | list of TiketLaporan |
| detailTiket | private | TiketLaporan |
| opsiTindakan | private | TINDAKAN |
| pesanError | private | string |

### 5.53.1 Algoritma/Query

**Nama Kelas:** HalamanDashboardAdmin  
**Nama Operasi:** tampilkanDetailTiket() : void  
**ID Algoritma:** Algo-5301

```text
PROSEDUR tampilkanDetailTiket()
    detailTiket <- LaporanHandler.getDetailTiket()
    tampilkanDetailTiket()
```


### 5.53.2 Algoritma/Query

**Nama Kelas:** HalamanDashboardAdmin  
**Nama Operasi:** selesaikanTiket() : void  
**ID Algoritma:** Algo-5302

```text
PROSEDUR selesaikanTiket()
    LaporanHandler.saveTanggapan()
        TanggapanLaporan.catatKeputusanTindakan()
    TiketLaporan.UpdateStatusTiket()
    SESUAI opsiTindakan
        ban pengguna   : LaporanHandler.banPengguna()
        skors pengguna : LaporanHandler.skorsPengguna()
    LaporanHandler.kirimTanggapan()
    tampilkan notifikasi penyelesaian berhasil
    JIKA server tidak merespons MAKA                         
    tampilkanPesanError()   
```


### 5.53.3 Algoritma/Query

**Nama Kelas:** HalamanDashboardAdmin  
**Nama Operasi:** mulaiMediasi() : void  
**ID Algoritma:** Algo-5303

```text
PROSEDUR mulaiMediasi()
    LaporanHandler.getDetailTiket()                          
    getDetailTiket()
    tampilkanHalamanMediasi()                                
```

---

# BAB 6: Perancangan Antarmuka

# BAB 6: Perancangan Antarmuka

## 6.1 Rancangan Antarmuka I-01
**Antarmuka:** I-01  
**Nama Layar:** Layar Registrasi

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C04 - HalamanRegistrasi.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.1. Rancangan Antarmuka I-01 - Layar Registrasi</i>
</p>

Tabel 6.1. Spesifikasi Objek Antarmuka I-01

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Button (Navbar) | "Masuk" | Mengarahkan pengguna ke layar I-02 (Halaman Login). |
| O-02 | Option Card | "Pengguna Jasa – Saya ingin mencari jasa", "Penyedia Jasa – Saya ingin menawarkan jasa" | Memilih peran akun yang akan dibuat. Pilihan ini menentukan objek yang dibuat oleh `registrasiPengguna()`, yaitu `PenggunaJasa` atau `PenyediaJasa`|
| O-03 | Text Field, Password Field | "Nama", "Email", "Nomor telepon", "Kata sandi" | Menerima data diri pengguna sebagai bagian dari `formRegistrasi`. Isian kata sandi disamarkan dan memiliki teks bantuan "Gunakan minimal 8 karakter". |
| O-04 | Button | "Daftar" | Menjalankan `kirimRegistrasi()`, yang memanggil `LayananRegistrasi.validasiData()`, `cekEmail()`, dan `cekNoTelepon()`. Jika data valid, sistem menjalankan `registrasiPengguna()` (membuat akun lewat `Pengguna.buatAkun()` dan `simpanProfil()`) lalu mengarahkan pengguna ke I-02. Jika data tidak valid atau email sudah terdaftar, sistem menjalankan `tampilkanError()` dan menampilkan `pesanError` pada form. |
| O-05 | RTF | "Sudah punya akun? Masuk" | Mengarahkan pengguna ke layar I-02 (Halaman Login). |

## 6.2 Rancangan Antarmuka I-02
**Antarmuka:** I-02 
**Nama Layar:** Layar Login

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C06 - HalamanLogin.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.2qqq. Rancangan Antarmuka I-02 - Layar Login</i>
</p>

Tabel 6.2. Spesifikasi Objek Antarmuka I-02

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Button (Navbar) | "Daftar" | Mengarahkan pengguna ke layar I-01 (Halaman Registrasi). |
| O-02 | Text Field, Password Field | "Email", "Kata sandi" | Menerima kredensial pengguna sebagai bagian dari `formLogin`. Isian kata sandi disamarkan. |
| O-03 | Button | "Masuk" | Menjalankan `kirimLogin(email, password)`, yang memanggil `Autentikator.validasiKredensial(email, password)`. Jika kredensial valid, sistem menjalankan `sesiLogin()` lalu mengarahkan Pengguna Jasa ke layar Pencarian (I-05) dan Penyedia Jasa ke layar Portofolio (I-03). Jika tidak valid, sistem menjalankan `tampilkanError()` dan menampilkan `pesanError` "Email atau kata sandi salah". |
| O-04 | RTF | "Belum punya akun? Daftar" | Mengarahkan pengguna ke layar I-01 (Halaman Registrasi). |ar, sistem menjalankan `tampilkanError()` dan menampilkan `pesanError` pada form. |

## 6.3 Rancangan Antarmuka I-03
**Antarmuka:** I-03
**Nama Layar:** Layar Portofolio

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C08 - HalamanPortofolio.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.3. Rancangan Antarmuka I-03 - Layar Portofolio </i>
</p>

Tabel 6.3. Spesifikasi Objek Antarmuka I-03

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-05 | Text Field | "Judul karya" | Menerima judul karya portofolio (atribut `judul` pada `Portofolio`) sebagai bagian dari `formPortofolio`. |
| O-06 | RTF Box | "Deskripsi" | Menerima deskripsi karya portofolio (atribut `deskripsi` pada `Portofolio`). |
| O-07 | RTF Box | "Pengalaman" | Menerima pengalaman kerja Penyedia Jasa (atribut `pengalaman` pada `PenyediaJasa`, diisi melalui `isiPortofolio()`). |
| O-08 | RTF Box | "Prestasi" | Menerima prestasi Penyedia Jasa (atribut `prestasi` pada `PenyediaJasa`, diisi melalui `isiPortofolio()`). |
| O-09 | Upload Box | "Tarik berkas ke sini atau pilih berkas" (JPG, PNG, atau PDF) | Membuka pemilih berkas untuk mengunggah berkas pendukung (atribut `berkasPendukung` pada `Portofolio`). Format dan ukuran berkas divalidasi oleh `LayananUploadFile.validasiFormatUkuran()`. |
| O-10 | Button | "Simpan Portofolio" | Menjalankan `kirimPortofolio(data)`, yang memanggil `PengontrolPortofolio.validasiInputBerkas(data)`. Jika data valid, sistem mengunggah berkas lewat `LayananUploadFile.uploadFile(berkas)`, menyimpan data lewat `Portofolio.simpanPortofolio()`, lalu memperbarui daftar pengalaman, prestasi, dan karya lewat `tampilkanPortofolio()`. Jika data tidak valid, sistem menjalankan `tampilkanError()` dan menampilkan `pesanError` pada form. |

## 6.4 Rancangan Antarmuka I-04
**Antarmuka:** I-04
**Nama Layar:** Layar Upload Jasa

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C13 - HalamanUploadJasa.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.4. Rancangan Antarmuka I-04 - Layar Upload Jasa</i>
</p>

Tabel 6.4. Spesifikasi Objek Antarmuka I-04

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-02 | Text Field | "Nama jasa", "Harga (Rp)" | Menerima nama dan harga jasa sebagai isian `formNamaJasa` dan `formHarga`. |
| O-03 | Dropdown | "Kategori" (placeholder "Pilih kategori") | Menampilkan daftar kategori jasa yang tersedia, lalu menyimpan pilihan sebagai isian `formKategori`. |
| O-04 | RTF Box | "Deskripsi" | Menerima deskripsi layanan sebagai isian `formDeskripsi`. |
| O-05 | Upload Box | "Tarik berkas ke sini atau pilih berkas" (JPG, PNG, atau PDF) | Membuka pemilih berkas untuk foto atau contoh hasil jasa (`inputUploadBerkas`). Format dan ukuran berkas divalidasi oleh `LayananUploadFile.validasiFormatUkuran()`. |
| O-06 | Button | "Unggah Jasa" | Menjalankan `klikUnggah()`, yang memanggil `JasaController.validasiDataJasa()` dan `LayananUploadFile.validasiFormatUkuran()`. Jika data dan berkas valid, sistem menjalankan `simpanPenawaranJasa()` (`uploadFile()`, `Jasa.simpanJasa()`, `PenyediaJasa.tambahPenawaranJasa()`) lalu `tampilkanNotifikasiBerhasil()`. Jika data tidak lengkap atau format berkas tidak didukung, sistem menjalankan `tampilkanPesanError()`. |

## 6.5 Rancangan Antarmuka I-05
**Antarmuka:** I-05
**Nama Layar:** Layar Pencarian

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C15 - HalamanPencarian.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.5. Rancangan Antarmuka I-05 - Layar Pencarian</i>
</p>

Tabel 6.5. Spesifikasi Objek Antarmuka I-05

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Search Field | Kata kunci pencarian | Menerima kata kunci melalui `inputKataKunci()` (`searchBar`). |
| O-02 | Button | "Cari" | Menjalankan `klikCari()`, yang memanggil `LayananPencarian.cariJasaBerdasarkanKeyword(keyword)` lalu `Jasa.dapatkanDetailJasa()`. Jika filter terisi, sistem juga menjalankan `terapkanFilterPencarian(filter)`. Jika jasa ditemukan, hasilnya ditampilkan lewat `HasilPencarian.tampilkanDaftarHasil()`. Jika tidak ditemukan, sistem menjalankan `tampilkanPesanError(pesan)`. |
| O-03 | Text Field | "Rp minimum", "Rp maksimum" | Menerima rentang harga sebagai isian `filterHarga`. |
| O-04 | Chip | "≤ 1 hari", "≤ 3 hari", "≤ 7 hari", "Lebih lama" | Memilih rentang durasi pengerjaan sebagai isian `filterDurasi`. Chip yang dipilih ditandai dengan warna ungu. |
| O-05 | Chip | "★ 3+", "★ 4+", "★ 4.5+" | Memilih rating minimum sebagai isian `filterRating`. |
| O-06 | RTF | "Reset" | Mengosongkan seluruh filter, lalu menampilkan kembali hasil pencarian tanpa filter. |
| O-07| Card | Kategori, nama jasa, nama penyedia, rating, harga | Menampilkan satu listing jasa dari `daftarListingJasa`. Mengeklik kartu mengarahkan pengguna ke layar I-06 (Halaman Detail Jasa) untuk jasa tersebut. |
| O-08 | Icon Button | Ikon bookmark pada kartu | Menjalankan `klikIkonBookmark()`, yang memanggil `PengontrolBookmark.tambahDataBookmark()` lalu `tampilkanNotifikasi()`. |

## 6.6 Rancangan Antarmuka I-06
**Antarmuka:** I-06
**Nama Layar:** Layar Detail Jasa

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C19 - HalamanDetailJasa.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.6. Rancangan Antarmuka I-06 - Layar Detail Jasa</i>
</p>

Tabel 6.6. Spesifikasi Objek Antarmuka I-06

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Image Button | Thumbnail gambar 1–4 | Mengganti gambar utama galeri dengan gambar yang dipilih. |
| O-02 | RTF | "Lihat semua" | Menampilkan seluruh riwayat ulasan jasa (`tampilanRiwayatUlasan`) yang diambil melalui `Ulasan.getDetailUlasan()`. |
| O-03 | Button | "Pesan Jasa" | Mengarahkan Pengguna Jasa ke layar I-09 (Halaman Pemesanan) dengan jasa ini sebagai `idJasaDipilih`. |
| O-04 | Button | "Chat Penyedia" | Membuka ruang chat dengan penyedia jasa di layar I-08 (Halaman Chat). |
| O-05 | Icon Button | Ikon bookmark | Menjalankan `klikIkonBookmark()`, yang memanggil `PengontrolBookmark.tambahDataBookmark()` lalu `tampilkanNotifikasi()`. Jika pengguna belum login, sistem menampilkan notifikasi agar pengguna masuk atau mendaftar terlebih dahulu. |

## 6.7 Rancangan Antarmuka I-07
**Antarmuka:** I-07
**Nama Layar:** Layar Bookmark

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C21 - HalamanBookmark.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.7. Rancangan Antarmuka I-07 - Layar Bookmark</i>
</p>

Tabel 6.7. Spesifikasi Objek Antarmuka I-07

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Card | Kategori, nama jasa, nama penyedia, rating, harga | Menampilkan satu jasa dari `daftarJasaTersimpan` (diambil melalui `tampilkanDaftarTersimpan()` dan `PengontrolBookmark.ambilDaftarBookmarkPengguna()`). Mengeklik kartu mengarahkan pengguna ke layar I-06 (Halaman Detail Jasa). |
| O-02 | Icon Button | Ikon bookmark terisi (`ikonBookmarkAktif`) | Menjalankan `klikIkonBookmark()` untuk membatalkan simpanan jasa tersebut, lalu menampilkan notifikasi lewat `tampilkanNotifikasi()`. |
| O-03 | Button | "Hapus dari bookmark" (`tombolHapusBookmark`) | Menjalankan `klikIkonHapus()`, yang memanggil `PengontrolBookmark.hapusDataBookmark()` dan `Bookmark.hapusBookmark()`. Jasa dihapus dari daftar, lalu sistem menampilkan notifikasi berhasil lewat `tampilkanNotifikasi()`. |


## 6.8 Rancangan Antarmuka I-08
**Antarmuka:** I-08
**Nama Layar:** Layar Chat

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C24 - HalamanChat.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.8. Rancangan Antarmuka I-08 - Layar Chat</i>
</p>

Tabel 6.8. Spesifikasi Objek Antarmuka I-08

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Search Field | "Cari percakapan" | Menyaring daftar ruang chat yang ditampilkan oleh `tampilkanMenuChat()` berdasarkan nama. |
| O-02 | List Item | Nama ruang chat, pesan terakhir, waktu, badge pesan belum dibaca | Membuka ruang chat yang dipilih (`idSesiChat`). Sistem menampilkan pesan lewat `tampilkanRiwayatPesan()` dari `ChatRoom.getRiwayatPesan()`, lalu memperbarui status baca lewat `LayananPesanInstan.updateStatusBaca()`. |
| O-03 | Icon Button | Ikon lampirkan dokumen | Membuka pemilih berkas untuk mengirim dokumen di dalam chat. |
| O-04 | Icon Button | Ikon lampirkan foto | Membuka pemilih berkas untuk mengirim foto di dalam chat. |
| O-05 | Text Field | "Tulis pesan…" | Menerima isi pesan melalui `inputPesan()`. |
| O-06 | Icon Button | Ikon kirim (`tombolKirim`) | Menjalankan `tombolKirimTerklik()`, yang memanggil `LayananPesanInstan.validasiInputPesan()`. Jika valid, sistem menjalankan `kirimPesan()`, `simpanKeDatabase()`, dan `LayananNotifikasiChat.kirimNotifikasiPesan()`, lalu menampilkan pesan baru lewat `tampilkanRiwayatPesan()`. Jika pesan kosong, sistem menjalankan `tampilkanPesanError()`. Jika koneksi terputus, sistem menjalankan `tampilkanStatusBelumTerkirim()`. |

## 6.9 Rancangan Antarmuka I-09
**Antarmuka:** I-09
**Nama Layar:** Layar Pemesanan

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C28 - HalamanPemesanan.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.9. Rancangan Antarmuka I-09 - Layar Pemesanan</i>
</p>

Tabel 6.9. Spesifikasi Objek Antarmuka I-09

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | RTF Box | "Brief pemesanan" | Menerima kebutuhan pemesanan melalui `inputBriefPemesanan()` (`briefPemesanan`). |
| O-02 | Button | "Pesan & lanjut bayar" | Menjalankan `tombolPesanTerklik()`, yang memanggil `PengontrolPesanan.buatPesananBaru()`. Jika brief kosong, sistem menampilkan kembali form lewat `tampilkanFormPemesanan()` beserta pesan bahwa brief wajib diisi. Jika brief terisi, sistem menjalankan `hitungTotalBiaya()`, membuat objek `Pesanan`, lalu mengarahkan Pengguna Jasa ke layar I-10 (Halaman Pembayaran). |

## 6.10 Rancangan Antarmuka I-10
**Antarmuka:** I-10
**Nama Layar:** Layar Pembayaran

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C29 - HalamanPembayaran - pilih%20metode.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.10. Rancangan Antarmuka I-10 - Layar Pembayaran</i>
</p>

Tabel 6.10. Spesifikasi Objek Antarmuka I-10

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Option Card | "Virtual Account [Bank A]", "Virtual Account [Bank B]", "[Dompet digital]" | Memilih metode pembayaran melalui `PenggunaJasa.pilihMetodePembayaran()` (`idMetodePembayaran`). Sistem mengambil detail metode lewat `MetodePembayaran.getDetailMetode()`, lalu menampilkan rincian pembayaran lewat `tampilkanRincianPembayaran()`. |
| O-02 | Button | "Salin" | Menyalin nomor virtual account (`nomorRekeningVA`) ke clipboard. |
| O-03 | Button | "Bayar sekarang" | Menjalankan `tombolBayarTerklik()`, yang memanggil `PengontrolTransaksi.validasiPembayaran()`. Jika berhasil, sistem menjalankan `updateStatusPembayaran()`, `PengontrolPesanan.updateStatusPesanan()` (`Pesanan.setStatusDiproses()`), dan membuat `RiwayatTransaksi`, lalu menampilkan `tampilkanNotifikasiBerhasil()` dan mengarahkan ke layar Riwayat Transaksi (C30). Jika gagal, sistem menampilkan kembali rincian pembayaran lewat `tampilkanRincianPembayaran()` beserta pesan bahwa pembayaran tidak berhasil. |


## 6.11 Rancangan Antarmuka I-11
**Antarmuka:** I-11
**Nama Layar:** Layar Riwayat Transaksi

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C30 - HalamanRiwayatTransaksi.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.11. Rancangan Antarmuka I-11 - Layar Riwayat Transaksi</i>
</p>

Tabel 6.11. Spesifikasi Objek Antarmuka I-11

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Status | "Semua", "Berjalan", "Selesai", "Dikembalikan" | Menyaring daftar transaksi yang ditampilkan oleh `tampilkanRiwayatTransaksi()` berdasarkan `statusTransaksi`. |
| O-02 | Button | "Cek hasil" (pada pesanan berstatus menunggu konfirmasi) | Mengarahkan Pengguna Jasa ke layar I-14 (Halaman Deliverables) untuk pesanan tersebut. |
| O-03 | Button | "Lihat pesanan" (pada pesanan berstatus diproses atau dikembalikan) | Menampilkan detail transaksi berdasarkan `idTransaksi`, beserta status pesanan terbaru. |
| O-04 | Button | "Pesan lagi" (pada pesanan berstatus selesai) | Mengarahkan Pengguna Jasa ke layar I-09 (Halaman Pemesanan) dengan jasa yang sama sebagai `idJasaDipilih`. |
| O-05 | Rating Bintang | "Ditunggu ratingnya!" dengan 5 bintang (pada pesanan selesai yang belum dinilai) | Menjalankan `beriUlasan(idPesanan)` lalu mengarahkan Pengguna Jasa ke layar I-17 (Halaman Ulasan) untuk pesanan tersebut. |
| O-06 | RTF | "Lihat ulasan" (pada pesanan yang sudah dinilai) | Menampilkan ulasan yang sudah diberikan Pengguna Jasa untuk pesanan tersebut. |

## 6.12 Rancangan Antarmuka I-12
**Antarmuka:** I-12
**Nama Layar:** Layar Konfirmasi

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C35 - HalamanKonfirmasi.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.12. Rancangan Antarmuka I-12 - Layar Konfirmasi</i>
</p>

Tabel 6.12. Spesifikasi Objek Antarmuka I-12

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Button | "Chat pemesan" | Membuka ruang chat dengan Pengguna Jasa pemesan di layar I-08 (Halaman Chat). |
| O-02 | Button | "Tolak" | Menjalankan `tombolTolakTerklik()` (`PenyediaJasa.tolakPesanan()`), yang memanggil `PengontrolPesanan.updateStatusPesanan()` dan `PengontrolTransaksi.updateStatusPembayaran()`, lalu membuat catatan `RiwayatTransaksi`. Status "Ditolak" ditampilkan lewat `tampilkanStatusPesanan()`. |
| O-03 | Button | "Terima Pesanan" | Menjalankan `tombolTerimaTerklik()` (`PenyediaJasa.terimaPesanan()`), yang memanggil `PengontrolPesanan.updateStatusPesanan()` (`Pesanan.setStatusDiproses()`) dan `PengontrolTransaksi.updateStatusPembayaran()` (`MetodePembayaran.getDetailMetode()`), lalu membuat catatan `RiwayatTransaksi`. Status "Diproses" ditampilkan lewat `tampilkanStatusPesanan()`. |

## 6.13 Rancangan Antarmuka I-13
**Antarmuka:** I-13
**Nama Layar:** Layar Pengumpulan

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C37 - HalamanPengumpulan.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.13. Rancangan Antarmuka I-13 - Layar pengumpulan</i>
</p>

Tabel 6.13. Spesifikasi Objek Antarmuka I-13

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | RTF Box | "Deskripsi Hasil" | Menerima deskripsi hasil pekerjaan melalui `inputDeskripsiHasil()` (`deskripsiHasil`), lalu divalidasi oleh `PengumpulanController.validasiDeskripsi()`. Jika melewati batasan, sistem menjalankan `tampilkanPesanError("Deskripsi Melewati Batasan")`. |
| O-02| Upload Box | "Tarik berkas ke sini atau pilih berkas" | Membuka pemilih berkas untuk mengunggah hasil pekerjaan melalui `unggahDeliverables()`. Format dan ukuran berkas divalidasi oleh `LayananUploadFile.validasiFormatUkuran(file)`. |
| O-03 | Text Field | "Atau Lampirkan Tautan" (placeholder "https://") | Menerima tautan hasil pekerjaan melalui `inputLink()` (`fileURL`). |
| O-04 | Button | "Kirim Hasil Pekerjaan" | Menjalankan `klikKirimHasil()`, yang memanggil `PengumpulanController.validasiPengumpulan()`. Jika file dan tautan sama-sama kosong, sistem menjalankan `tampilkanPesanError("Wajib Mengunggah File/Link")`. Jika file terlalu besar, sistem menjalankan `tampilkanPesanError("Size File Terlalu Besar")`. Jika valid, berkas disimpan lewat `LayananUploadFile.saveDeliverables(file)` dan data disimpan lewat `ProdukAkhir.simpanProdukAkhir(deskripsi, pathFile, link)`, `updateStatusPengerjaan(true)`, serta `PenyediaJasa.saveProdukAkhir()`. Setelah itu sistem menjalankan `tampilkanStatusPengiriman(true)`. |


## 6.14 Rancangan Antarmuka I-14
**Antarmuka:** I-14
**Nama Layar:** Layar Deliverables

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C38 - HalamanDeliverables.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.14. Rancangan Antarmuka I-14 - Layar Deliverables</i>
</p>

Tabel 6.14. Spesifikasi Objek Antarmuka I-14

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Icon Button | Ikon lihat (tombol lime) pada setiap berkas atau tautan hasil | Membuka berkas (`lampiranDeliverables`) atau tautan (`fileURL`) hasil pekerjaan untuk diperiksa. |
| O-02 | Icon Button | Ikon unduh pada setiap berkas hasil | Mengunduh berkas hasil pekerjaan ke perangkat pengguna. |
| O-03 | Button | "Konfirmasi selesai" (`tombolKonfirmasi`) | Menjalankan `konfirmasiPesanan()`, yang memanggil `PengontrolTransaksi.prosesPembayaran(idPesanan)` dan `validasiPembayaran()`, `PengontrolPesanan.updateStatusPesanan(true)`, `setPencairanDana(true)`, serta `updateStatusPembayaran(true)`. Pesanan menjadi selesai dan dana diteruskan ke Penyedia Jasa. Jika server tidak merespons, sistem menjalankan `tampilkanError(msg)`. |
| O-04 | Button | "Ajukan revisi" (`tombolRevisi`) | Menjalankan `ajukanRevisi()` lalu mengarahkan Pengguna Jasa ke layar I-15 (Halaman Request Revisi). Sisa kuota revisi (`jumlahRevisi`) ditampilkan di atas tombol. Jika batas waktu pengajuan revisi sudah habis, tombol dinonaktifkan dan sistem menampilkan pesan. |
| O-05 | Link | "Ada masalah? Laporkan ke admin" (`tombolBantuan`) | Mengarahkan Pengguna Jasa ke layar I-16 (Halaman Pelaporan). |

## 6.15 Rancangan Antarmuka I-15
**Antarmuka:** I-15
**Nama Layar:** Layar Request Revisi

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C40 - HalamanRequestRevisi.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.15. Rancangan Antarmuka I-15 - Layar Request Revisi</i>
</p>

Tabel 6.15. Spesifikasi Objek Antarmuka I-15

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | RTF Box | "Detail revisi" | Menerima rincian bagian yang perlu diperbaiki melalui `tampilkanFieldPengisianRevisi()` (`detailRevisi`), yang disimpan sebagai `deskripsiRevisi` pada `PengajuanRevisi`. |
| O-02 | RTF Box | "Pesan untuk penyedia (opsional)" | Menerima pesan tambahan untuk Penyedia Jasa (`pesanUntukPenyedia`). |
| O-03| Upload Box | "Tambahkan referensi atau tangkapan layar" | Membuka pemilih berkas untuk lampiran revisi (`lampiranRevisi`). |
| O-04 | Button | "Batal" | Membatalkan pengajuan revisi dan mengarahkan Pengguna Jasa kembali ke layar I-14. |
| O-05 | Button | "Kirim revisi" (`tombolRevisi`) | Menjalankan `kirimRevisi()`, yang memanggil `RevisiHandler.isRevisiRequestValid()`. Jika kuota revisi habis, sistem menjalankan `tampilkanPesan("Kuota revisi yang diajukan sudah habis…")`. Jika valid, sistem membuat `PengajuanRevisi`, lalu menjalankan `updateStatusPengerjaan()`, `sendRevisi(deskripsi, lampiran)`, dan `sendNotifikasiRevisi()`, kemudian `tampilkanPesan()` bahwa revisi terkirim. Jika server tidak merespons, sistem menampilkan pesan "Revisi gagal terkirim". |

## 6.16 Rancangan Antarmuka I-16
**Antarmuka:** I-16
**Nama Layar:** Layar Pelaporan

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C44 - HalamanPelaporan.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.16. Rancangan Antarmuka I-16 - Layar Pelaporan</i>
</p>

Tabel 6.16. Spesifikasi Objek Antarmuka I-16

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Text Field | "Penyedia Jasa" (placeholder "Nama Penyedia Jasa") | Menerima nama Penyedia Jasa yang dilaporkan. Sistem mengambil `idPenyediaJasa` lewat `PenyediaJasa.getIdPenyediaJasa()`. |
| O-02 | Dropdown | "Kategori Pelanggaran" (placeholder "Pilih Kategori Pelanggaran") | Memilih kategori pelanggaran sebagai isian `kategoriPelanggaran`. |
| O-03 | RTF Box | "Deskripsi Masalah" | Menerima uraian masalah sebagai isian `deskripsiPelanggaran`. |
| O-04 | Upload Box | "Bukti" – "Tarik berkas ke sini atau pilih berkas" | Membuka pemilih berkas untuk bukti laporan (`kolomBukti`). |
| O-05 | Button | "Kirim Laporan" | Memanggil `LaporanHandler.validasiFormatLaporan()`. Jika bukti, deskripsi, atau kategori tidak lengkap, sistem menjalankan `tampilkanPesanError("Bukti/Deskripsi/Kategori Tidak Lengkap")`. Jika valid, sistem mengambil `idPenggunaJasa` dan `idPenyediaJasa`, lalu menjalankan `TiketLaporan.createTiket(idPenggunaJasa, idPenyediaJasa, URLbukti, kategori, deskripsi)` dan `kirimNotifAdmin()`. Jika berhasil, nomor tiket dan status laporan ditampilkan lewat `tampilkanTiketdanTanggapan()`. Jika server gagal, sistem menjalankan `tampilkanPesanError("Tiket gagal dibuat")`. |

## 6.17 Rancangan Antarmuka I-17
**Antarmuka:** I-17
**Nama Layar:** Layar Ulasan

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C47 - HalamanUlasan.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.17. Rancangan Antarmuka I-17 - Layar Ulasan</i>
</p>

Tabel 6.17. Spesifikasi Objek Antarmuka I-17

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Rating | 5 ikon bintang pada "Penilaian" | Memberi nilai 1–5 melalui `inputRatingBintang(rating)`. Bintang terisi sesuai nilai yang dipilih. |
| O-02| RTF Box | "Komentar (opsional)" | Menerima komentar ulasan melalui `inputKomentar(teksKomentar)`. |
| O-03 | Upload Box | "Dokumentasi (opsional)" – "Tarik berkas ke sini atau pilih berkas" | Membuka pemilih berkas untuk dokumentasi hasil jasa melalui `unggahDokumentasi(fileDokumentasi)`. |
| O-04 | Button | "Kirim Ulasan" | Menjalankan `submitUlasan()`, yang memanggil `UlasanHandler.prosesUlasan(idPesanan, rating, teksKomentar, fileDokumentasi)` beserta `validasiKelengkapanRating()`, `validasiPanjangKomentar()`, dan `validasiFormatBerkas()`. Jika valid, sistem menjalankan `Ulasan.simpanUlasan()`, `perbaruiRating(idPenyediaJasa, rating)`, `PengontrolPesanan.updateStatusPesanan(idPesanan, "Selesai")`, dan `catatRiwayatTransaksi(idPesanan)`, lalu `tampilkanNotifikasiBerhasil()`. Jika validasi gagal, sistem menjalankan `tampilkanPesanError()`. |

## 6.18 Rancangan Antarmuka I-18
**Antarmuka:** I-18
**Nama Layar:** Layar Pengajuan Mediasi

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C50 - HalamanPengajuanMediasi.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.18. Rancangan Antarmuka I-18 - Layar Pengajuan Mediasi</i>
</p>

Tabel 6.18. Spesifikasi Objek Antarmuka I-18

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-01 | Icon Button | Ikon lihat bukti (tombol lime) pada lampiran bukti | Membuka berkas bukti laporan (`lampiranBukti` atau `urlBukti` pada `TiketLaporan`) yang ditampilkan sebagai bagian dari `detailPelaporan`. |
| O-02 | Icon Button | Ikon unduh pada lampiran bukti | Mengunduh berkas bukti laporan ke perangkat Admin. |
| O-03 | RTF Box | "Tanggapan Admin" | Menerima tanggapan Admin terhadap laporan, yang disimpan lewat `LaporanHandler.saveTanggapan()`. |
| O-04 | Dropdown | "Jenis Sanksi" (placeholder "Pilih Sanksi") | Menampilkan pilihan tindakan (`opsiTindakan`) melalui `pilihJenisTindakan()`. |
| O-05 | Button | "Mediasi" | Menjalankan `mulaiMediasi()`. Sistem mengambil detail tiket lewat `LaporanHandler.getDetailTiket()`, lalu membuka ruang mediasi beserta riwayat pesan (`riwayatPesan`) melalui `tampilkanHalamanMediasi()`. Komunikasi di ruang mediasi mengikuti alur Halaman Chat (I-08). |
| O-06 | Button | "Kirim" | Menjalankan `inputTindakan()` dan `selesaikanLaporan()`. Sistem menyimpan keputusan lewat `TanggapanLaporan.catatKeputusanTindakan()` dan memperbarui status lewat `UpdateStatusTiket()`. Jika tindakan berupa ban atau skors, sistem menjalankan `banPengguna()` atau `skorsPengguna()`, lalu mengirim tanggapan ke pelapor lewat `kirimTanggapan()`. Jika gagal, sistem menjalankan `tampilkanPesanError()`. |

## 6.19 Rancangan Antarmuka I-19
**Antarmuka:** I-19
**Nama Layar:** Layar Dashboard Admin

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/UI/C53 - HalamanDashboardAdmin.png" width="50%">
</p>
<p align="center">
<i>Gambar 6.19. Rancangan Antarmuka I-19 - Layar Dashboard Admin</i>
</p>

Tabel 6.19. Spesifikasi Objek Antarmuka I-19

| Id_Objek | Jenis | Konten | Keterangan |
| :--- | :--- | :--- | :--- |
| O-19-01 | Button | "Detail" (pada setiap baris tiket laporan) | Menjalankan `Admin.bukaTiketLaporan()`, yang memanggil `LaporanHandler.getDetailTiket()` untuk tiket tersebut (`detailTiket`). Detail tiket ditampilkan lewat `tampilkanDetailTiket()` dan Admin diarahkan ke layar I-18. Jika data tiket gagal dimuat, sistem menjalankan `tampilkanPesanError()`. |

## 6.Y Rancangan Antarmuka Keseluruhan

Tuliskan daftar gambar seluruh antarmuka. Berikan ID unik untuk setiap tampilan dan gunakan ID yang sama pada subbab perancangan antarmuka masing-masing.

Tabel 6.Y. Rancangan Antarmuka Keseluruhan

| No | Tampilan Antarmuka |
| :--- | :--- |
| I-01 | <img src="./assets/UI/C04 - HalamanRegistrasi.png" alt="UI C04" width="400"> |
| I-02 | <img src="./assets/UI/C06 - HalamanLogin.png" alt="UI C06" width="400"> |
| I-03 | <img src="./assets/UI/C08 - HalamanPortofolio.png" alt="UI C08" width="400"> |
| I-04 | <img src="./assets/UI/C13 - HalamanUploadJasa.png" alt="UI C13" width="400"> |
| I-05 | <img src="./assets/UI/C15 - HalamanPencarian.png" alt="UI C15" width="400"> |
| I-06 | <img src="./assets/UI/C19 - HalamanDetailJasa.png" alt="UI C19" width="400"> |
| I-07 | <img src="./assets/UI/C21 - HalamanBookmark.png" alt="UI C21" width="400"> |
| I-08 | <img src="./assets/UI/C24 - HalamanChat.png" alt="UI C24" width="400"> |
| I-09 | <img src="./assets/UI/C28 - HalamanPemesanan.png" alt="UI C28" width="400"> |
| I-10 | <img src="./assets/UI/C29 - HalamanPembayaran - pilih%20metode.png" alt="UI C29" width="400"> |
| I-11 | <img src="./assets/UI/C30 - HalamanRiwayatTransaksi.png" alt="UI C28" width="400"> |
| I-12 | <img src="./assets/UI/C35 - HalamanKonfirmasi.png" alt="UI C28" width="400"> |
| I-13 | <img src="./assets/UI/C37 - HalamanPengumpulan.png" alt="UI C28" width="400"> |
| I-14 | <img src="./assets/UI/C38 - HalamanDeliverables.png" alt="UI C28" width="400"> |
| I-15 | <img src="./assets/UI/C40 - HalamanRequestRevisi.png" alt="UI C28" width="400"> |
| I-16 | <img src="./assets/UI/C44 - HalamanPelaporan.png" alt="UI C28" width="400"> |
| I-17 | <img src="./assets/UI/C47 - HalamanUlasan.png" alt="UI C28" width="400"> |
| I-18 | <img src="./assets/UI/C50 - HalamanPengajuanMediasi.png" alt="UI C28" width="400"> |
| I-19 | <img src="./assets/UI/C53 - HalamanDashboardAdmin.png" alt="UI C28" width="400"> |

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

