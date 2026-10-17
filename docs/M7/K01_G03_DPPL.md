<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 5
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## Cari Jasa
### *[Logo Perangkat Lunak]*

### Untuk: Kak Mikhael Andrian Yonatan

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | K01 |
| Kelompok | G03  |
| Nama Kelompok | MAYOOOOOR  |

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
| Method Class | Penambahan Read Method di Class Pengguna |
| C19 dan C46 Class Diagram Method dan Atribut | Mengganti Isinya karena salah saat traceability di SKPL  |
| Add Atribut | Penambahan atribut daftarProduk di class PenyediaJasa  |
| Refactor Method C37 | ganti kirimHasil() menjadi klikKirimHasil()  |
| Add new Class | Class Pengumpulan Controller |  
| Refactor Class Diagram UC11 | Tambahin Class Baru beserta detailnya |

---

<br>

> **Petunjuk pengerjaan:** *[Silahkan hapus bagian ini setelah selesai mengerjakan]*
>
> Dokumen ini melanjutkan **Spesifikasi Kebutuhan Perangkat Lunak (SKPL)** dan **Arsitektur Perangkat Lunak (APL)**. Gunakan nama, ID, kebutuhan, dan use case yang konsisten dengan kedua dokumen tersebut. Contoh pola ID baru di bawah dapat disesuaikan dengan kesepakatan kelompok, ID yang sudah ada tetap dipertahankan.

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

Sebutkan *operating system*, DBMS, *development tools*, *filing system*, dan bahasa pemrograman yang digunakan.

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

Identifikasi komponen, modul, atau subsistem penyusun aplikasi berdasarkan *pattern* yang telah ditetapkan. Jelaskan tanggung jawab masing-masing komponen. Pengelompokan dapat mengikuti lapisan arsitektur atau fungsi/peran komponen dalam sistem.

Ambil dari **Tabel 2.1 dokumen APL**, lalu kelompokkan berdasarkan lapisan (Model/View/Controller). Kolom **Jenis** diisi sesuai pattern, misalnya View, Controller, Model, Service, Repository. Satu komponen merepresentasikan saatu tanggung jawab utama yang jelas,

Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis | Penjelasan |
| :--- | :--- | :--- |
| *[Nama komponen/modul/subsistem]* | *[Jenis]* | *[Tanggung jawab komponen]* |
| *[Nama komponen/modul/subsistem]* | *[Jenis]* | *[Tanggung jawab komponen]* |
| *...* | *...* | *...* |

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

## 3.1 Use Case [Nama Use Case 1]

**ID Use Case:** *[UC01 sesuai SKPL]*  
**Nama Use Case:** *[Nama use case sesuai SKPL]*

### 3.1.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.1. Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| 2 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| ... | *...* | *...* |

### 3.1.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Normal**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-sequence_diagram.png" width="50%">
</p>
<p align="center">
<i>Gambar X. Sequence Diagram [UC01]</i>
</p>

- **Skenario Alternatif [Nomor]: [Nama Skenario]**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-sequence_diagram.png" width="50%">
</p>
<p align="center">
<i>Gambar X. Sequence Diagram [UC01] - [Nama skenario alternatif]</i>
</p>

### 3.1.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh_class-diagram2.jpg" width="35%">
</p>
<p align="center">
<i>Gambar X. Diagram Kelas [Nama Uce Case]</i>
</p>

Pada diagram, pastikan:
- Atribut dituliskan beserta visibilitas dan tipe datanya, misalnya `- email: String`.
- Operasi dituliskan beserta visibilitas, parameter, dan tipe kembaliannya, misalnya `+ login(email: String, password: String): Boolean`.
- Relasi antarkelas (asosiasi, agregasi, komposisi, generalisasi, dan dependensi) digambarkan lengkap dengan multiplisitas.
- Semua operasi yang dipanggil pada sequence diagram 3.1.2 (skenario normal dan alternatif) ada pada kelas yang bersangkutan.
- Kelas yang sama dengan kelas di use case lain memakai nama, atribut, dan metode yang konsisten.

## 3.11 Use Case Menyerahkan Hasil Pekerjaan

**ID Use Case:** UC11  
**Nama Use Case:** Menyerahkan Hasil Pekerjaan

### 3.11.1 Identifikasi Kelas

Identifikasi kelas yang terkait dengan use case tersebut. Kelas di tahap perancangan dapat berbeda dengan dengan kelas di tahap analisis. Dapat menggunakan tabel di bawah:

Tabel 3.1. Identifikasi Kelas Use Case [UC01]

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | UploadFileHandler | LayananUploadFile |
| 2 | HalamanPengumpulan | HalamanPengumpulan |
| 3 | FinalProduct | ProdukAkhir |
| 4 | PenyediaJasa | PenyediaJasa|
| 5 | PengumpulanController | PengumpulanController |

### 3.11.2 Sequence Diagram

Buat *sequence diagram* untuk **setiap skenario use case**, mencakup skenario normal dan alternatif pada subbab 4.4 SKPL. Diagram melibatkan kelas-kelas yang telah diidentifikasi pada SKPL. 

- **Skenario Keseluruhan**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC11_DiagramSekuens.svg" width="100%">
</p>
<p align="center">
<i>Gambar 3.11 Sequence Diagram [UC11]</i>
</p>



### 3.11.3 Diagram Kelas

Buatlah diagram kelas untuk use case ini yang terdiri atas kelas-kelas dari 3.1.1. **Setiap kelas pada diagram wajib menampilkan atribut dan metode/operasi langsung di dalam kotak kelasnya**, sehingga tidak perlu membuat tabel daftar atribut dan metode per kelas pada subbab ini. Daftar lengkap atribut dan metode seluruh kelas disajikan pada Tabel 4.1 (Bab 4).

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/UC11_DiagramKelas.svg" width="70%">
</p>
<p align="center">
<i>Gambar 11. Diagram Kelas Menyerahkan Hasil pekerjaan</i>
</p>

---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

**Bagian ini diisi dengan diagram kelas keseluruhan.**

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/Keseluruhan diagram.svg" width="35%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan [Nama P/L]</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C01 | Pengguna | - nama <br> - email <br>   # password <br> - statusOnline <br> - statusAkun <br> - sanksi <br> - daftarProduk | <br> + buatAkun(), <br> - simpanProfil() <br> + login() <br> + setStatusAkun() <br> + setSanksi() <br> + getNama() <br> + getEmail() <br> + getStatusOnline <br> + getStatusAkun <br> | 
| C02 | PenyediaJasa | - idPenyediaJasa <br> - daftarPenawaranJasa <br> - pengalaman <br> - prestasi <br> - daftarProduk | <br> + isiPortofolio() <br> + unggahPortofolio() <br> + tambahPenawaranJasa() <br> + bukaNotifikasiPesanan() <br> + terimaPesanan() <br> + tolakPesanan(), <br> + saveProdukAkhir() <br> + getStatusPengerjaan() <br> + kumpulkanRevisi() <br> + cekPengirimanDana() <br> + getRevisi() <br> + getIdPenyediaJasa() <br> + getdaftarPenawaranJasa <br> + getPengalamandanPrestasi() <br> |
| C03 | PenggunaJasa | - idPenggunaJasa <br> - daftarJasa <br> - minatkategoriJasa <br> - statusKonfirmasi | <br> + cariJasa() <br> + gunakanFilter() <br> + bukaDetailJasa() <br> + bukaDaftarBoomark() <br> + pilihJasa() <br> + isiFormPemesanan() <br> + getStatusPengerjaan() <br> + getDeliverables() <br> + selesaikanPesanan() <br> + ajukanRevisi() <br> + beriUlasan() <br> + beriPenilaian() <br> + pilihMetodePembayaran() <br> + getIdPenyediaJasa() <br> + getMinatKategoriJasa <br> + getStatusKonfirmasi <br>  |
| C04      | HalamanRegistrasi       |<br>  - formRegistrasi <br> - pesanError  <br> | <br> + tampilkanForm() <br> + kirimRegistrasi() <br> + tampilkanError() <br>|
| C05      | LayananRegistrasi       | -                                                                       | <br> + validasiData() <br> + cekEmail() <br> + cekNoTelepon() <br> + registrasiPengguna() <br> |
| C06      | HalamanLogin             | - inputEmail <br> - inputPassword <br> - pesanError | <br> + tampilkanForm() <br> + kirimLogin() <br> +  pesanError() <br> |
| C07      | Autentikator             | -                                     | <br> + validasiKredensial() <br> + sesiLogin()           <br> |
| C08      | HalamanPortofolio        | <br> - formPortofolio <br> - pesanError        | <br> + tampilkanPortofolio() <br> + tampilkanForm() <br> +  kirimPortofolio() <br> + tampilkanError() <br> |
| C09      | Portofolio               | <br> - judul <br> - deskripsi <br> - berkasPendukung <br> | <br> + simpanPortofolio() <br> |
| C10      | PengontrolPortofolio     | -                                 | <br> + validasiInputBerkas() <br> + SimpanPortofolio() <br>|
| C11      | LayananUploadFile        | -                                 | <br> + getStatusUpload() <br> + validasiFormatUkuran() <br> + saveDeliverables() <br> |
| C12 | Jasa | - idJasa <br> - idPenyediaJasa <br> -  namaJasa <br> -  deskripsi <br> -  kategori <br> - harga <br> - statusAktif | <br> + simpanJasa() <br> + dapatkanDetailJasa() <br> + perbaruiJasa() <br> + hapusJasa() <br> |
| C13 | HalamanUploadJasa | - formNamaJasa <br> - formKategori <br> - formDeskripsi <br> - formHarga <br> - inputUploadBerkas <br> - tombolUnggah <br> - pesanError | <br> + tampilkanForm() <br> + klikUnggah() <br> +  tampilkanPesanError() <br> + tampilkanNotifikasiBerhasil() <br> |
| C14 | JasaController | - | <br> + ambilDetailJasa() <br> + validasiDataJasa() <br> + simpanPenawaranJasa() |
| C15 | HalamanPencarian | <br> - searchBar <br> - filterHarga <br> - filterDurasi <br> - filterRating <br> - tombolCari <br> - pesanError | <br> + tampilkanHalaman() <br> + inputKataKunci() <br> + klikCari() <br> + tampilkanPesanError() |
| C16 | HasilPencarian | <br> - daftarListingJasa <br> - tombolBandingkan | <br> + tampilkanDaftarHasil() <br> + pilihJasaUntukDibandingkan() <br> + klikBandingkan() |
| C17 | LayananPencarian | - | <br> + cariJasaBerdasarkanKeyword() <br> + terapkanFilterPencarian() |
| C18 | LayananPembandingJasa | - | <br> + bandingkanSpesifikasiJasa() |
| C19 | HalamanDetailJasa | <br> - tampilanDeskripsi <br> - tampilanHarga <br> - infoProfilPenyedia <br> - tampilanRiwayatUlasan, <br> -pesanError | <br> + tampilkanDetailJasa() <br> +  tampilkanPesanError() |
| C20 | Bookmark | <br> - idBookmark <br> - idPenggunaJasa <br> - idJasa <br> - waktuDisimpan <br> - daftarBookmark | <br> + simpanBookmark() <br> + hapusBookmark() <br> + lihatBookmark() |
| C21 | HalamanBookmark | <br> - daftarJasaTersimpan <br> - ikonBookmarkAktif <br> - ikonBookmarkNonaktif <br> - tombolHapusBookmark | <br> + tampilkanDaftarTersimpan() <br> + klikIkonBookmark() <br> + klikIkonHapus() <br> + tampilkanNotifikasi() |
| C22 | PengontrolBookmark | - | <br> + tambahDataBookmark() <br> + hapusDataBookmark() <br> + ambilDaftarBookmarkPengguna() |
| C23 | ChatRoom | <br> - idChatRoom <br> - idAnggota <br> - riwayatPesan <br> - waktuDibuat | <br> + getRiwayatPesan() <br> - simpanPesan() <br> + getidChatRoom() <br> + getidAnggota() |
| C24 | HalamanChat | - idSesiChat <br> - inputPesan <br> - statusKoneksi | <br> + tampilkanMenuChat() <br> + tampilkanRiwayatPesan() <br> + inputPesan() <br> + tombolKirimTerklik() <br> + tampilkanPesanError() <br> + tampilkanStatusBelumTerkirim() |
| C25 | LayananPesanInstan | - | <br> + buatSesiChat() <br> + validasiInputPesan() <br> + kirimPesan() <br> + simpanKeDatabase() <br> + updateStatusBaca() |
| C26 | LayananNotifikasiChat | - | <br> + kirimNotifikasiPesan() <br> + tampilkanPopUpNotifikasi() |
| C27 | Pesanan | <br> - idPesanan <br> - idPenggunaJasa <br> - idPenyediaJasa <br> - idJasa <br> - brief <br> - totalBiaya <br> - statusPesanan | <br> + getDetailPesanan() <br> + setStatusDiproses() <br> + setStatusSelesai() |
| C28 | HalamanPemesanan | <br> - idJasaDipilih <br> - briefPemesanan | <br> + tampilkanFormPemesanan() <br> + inputBriefPemesanan() <br> + tombolPesanTerklik() |
| C29 | HalamanPembayaran | <br> - totalHarga <br> - idMetodePembayaran | <br> + tampilkanPilihanPembayaran() <br> + tampilkanRincianPembayaran() <br> + tombolBayarTerklik() <br> + tampilkanNotifikasiBerhasil() |
| C30 | HalamanRiwayatTransaksi | <br> - idTransaksi | <br> + tampilkanRiwayatTransaksi() |
| C31 | PengontrolPesanan | - | <br> + buatPesananBaru() <br> +  hitungTotalBiaya() <br> + updateStatusPesanan() |
| C32 | PengontrolTransaksi | - | <br> + prosesPembayaran() <br> + validasiPembayaran() <br> +  updateStatusPembayaran() |
| C33 | MetodePembayaran | <br> - idMetode <br> - namaMetode <br> - nomorRekeningVA | <br> + getDetailMetode() |
| C34 | RiwayatTransaksi | <br> - idRiwayat <br> - idPesanan <br> - tanggalTransaksi <br> - statusTransaksi | <br> + simpanTransaksi() |
| C35 | HalamanKonfirmasi | <br> - idPesanan <br> - detailBrief | <br> + tampilkanDetailPesanan() <br> + tombolTerimaTerklik() <br> + tombolTolakTerklik() <br> + tampilkanStatusPesanan() |
| C36 | ProdukAkhir | <br> -idProdukAkhir <br> - idPesanan <br> - outputpath <br> - deskripsiProdukAkhir <br> - <br>- tanggalPengumpulan <br> - statusPemeriksaan <br> - fileURL | <br> + simpanProdukAkhir() <br> + updateStatusPengerjaan() <br> + getDetailJasa() | 
| C37 | HalamanPengumpulan | <br> - deskripsiHasil <br> - fileURL <br> - tombolKirim <br> - pesanError  | <br> + tampilkanFormPengumpulan() <br> + inputDeskripsiHasil() <br> + unggahDeliverables() <br> + tampilkanPesanError() <br> + klikKirimHasil() <br> + inputLink() <br> + tampilkanStatusPengiriman() |
| C38 | HalamanDeliverables | <br> - deskripsiHasil <br> - fileURL <br> - tombolKonfirmasi <br> - tombolRevisi <br> - jumlahRevisi <br> - pesanError <br> - tombolBantuan <br> - lampiranDeliverables | <br> + tampilkanDeliverables() <br> + ajukanRevisi() <br> + konfirmasiPesanan() <br> + tampilkanError() <br> + panggilBantuan() |
| C39 | PengajuanRevisi | <br> - deskripsiRevisi <br> - jmlRevisiTersedia <br> - lampiranRevisi <br> - idRevisi <br> - idPesanan <br> - statusPengerjaan | <br> + setStatusPengerjaan() <br> + getStatusPengerjaan() <br> + setDeskripsiRevisi() <br> + getDeskripsiRevisi() <br> + setjmlRevisi() <br> + getjmlRevisi() <br> + setIdRevisi() <br> + getIdPesanan() <br> + getIdRevisi() |
| C40 | HalamanRequestRevisi | <br> - formRevisi <br> - detailRevisi <br> - kuotaRevisi <br> - tombolRevisi <br> - pesanUntukPenyedia  | <br> + tampilkanformRevisi() <br> + tampilkanFieldPengisianRevisi() <br> + tampilkanKuotaRevisi() <br> + +isTombolRevisiPressed() <br> + tampilkanPesan()  |
| C41 | RevisiHandler | - | <br> + isJumlahRevisiValid() <br> + isDeskripsiComplete() <br> +  sendRevisi() <br> + setNotifikasiRevisi() <br> + updateStatusPengerjaan() <br> + updateIdRevisi()  |
| C42 | PencairanDana | <br> - stateTransaksi <br> - statePencairanDana | <br> + setKondisiTransaksi() <br> + setPencairanDana() |
| C43 | TiketLaporan | <br> - idTiket <br> - deskripsiLaporan <br> - urlbukti <br> - lampiranBukti <br> - statusTiket <br> - TanggapanAdmin | <br> + setIdTiket() <br> + getIdTiket() <br> + setURLBukti() <br> + getURLBukti() <br> + setStatusTiket <br> + UpdateStatusTiket() <br> + getStatusTicket() <br> + setTanggapan() <br> + getTanggapan() <br> + setStatusLaporan()  |
| C44 | HalamanPelaporan | <br> - formLaporan <br> - kategoriPelanggaran <br> - deskripsiPelanggaran <br> - kolomBukti <br> - statusLaporan <br> - noTiket <br> - pesanError <br> - tanggapanAdmin | <br> + tampilkanFormLaporan() <br> +  tampilkanOpsiKategoriPelanggaran() <br> +  tampilkanDeskripsiPelanggaran <br> + tampilkanNomorTiket() <br> + tampilkanPesanError() <br> + tampilkanTanggapanAdmin() <br> +  tampilkanPesanError() | 
| C45 | LaporanHandler  | - | <br> + validasiFormatLaporan() <br> + createTiket() <br> + getStatusTiket() <br> + kirimNotifAdmin() <br> + simpanData() <br> + banPengguna() <br> + skorsPengguna() <br> + kirimTanggapan() <br> + saveTanggapan() <br> + saveLaporan() <br> + updateStatusTiket() |
| C46 | Ulasan | <br> - idUlasan <br> - idPesanan <br> - idPenyediaJasa <br> - rating <br> - komentar <br> - dokumentasi | <br> + simpanUlasan() <br> + getDetailUlasan() |
| C47 | HalamanUlasan | <br> - rating <br> - teksKomentar <br> - fileDokumentasi <br> - pesanError | <br> + tampilkanFormUlasan() <br> + inputRatingBintang() <br> + inputKomentar() <br> + unggahDokumentasi() <br> + tampilkanPesanError() <br> + tampilkanNotifikasiBerhasil() |
| C48 | UlasanHandler | - | <br> + validasiKelengkapanRating() <br> + validasiFormatBerkas() <br> + validasiPanjangKomentar() <br> + prosesUlasan() <br> + perbaruiRating() |
| C49 | TanggapanLaporan | <br> - idTanggapan <br> - idTiket <br> - jenisTindakan <br> - catatanTanggapan | <br> - catatKeputusanTindakan() <br> - getDetailTanggapan() |
| C50 | HalamanPengajuanMediasi | <br> + detailPelaporan <br> + riwayatPesan <br> + opsiTindakan <br> + pesanError | - |
| C51 | MediasiHandler | <br> - idSesiMediasi | <br> - inputTindakan() <br> - akhiriMediasi() <br> - tampilkanPesanError() <br> - tampilkanNotifikasiSelesai() |
| C52 | Admin | <br> - idAdmin <br> - nama | <br> + mulaiMediasi() <br> + bukaTiketLaporan() <br> + selesaikanLaporan() <br> + kirimPesanMediasi() <br> + pilihJenisTindakan() <br> + akhiriMediasi() |
| C53 | HalamanDashboardAdmin | <br> - daftarTiket <br> - detailTiket <br> - opsiTindakan <br> - pesanError | <br> + tampilkanDetailTiket() <br> + inputTindakan() <br> + selesaikanTiket() <br> + mulaiMediasi() <br> + tampilkanPesanError() |
| C54 | PengumpulanController | - | <br> + validasiDeskripsi() <br> + validasiPengumpulan()  |

<br>

---

# BAB 5: Matriks Kerunutan

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