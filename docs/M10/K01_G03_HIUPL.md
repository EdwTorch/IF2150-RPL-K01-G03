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
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

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

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[C01]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[C02]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[I-01]* | *[Nama layar]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[I-02]* | *[Nama layar]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | *[Nama file]* | *[Fungsi file]* |
| ... | *...* | *...* |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| *C02* | *Pesanan* | *Mendalam* | *Memuat `hitungTotal()` dan transisi status pembayaran* | *C02-UT01 s.d. C02-UT08* |
| *C03* | *Keranjang* | *Sedang* | *Delegasi sederhana ke Produk dan Pesanan* | *C03-UT01 s.d. C03-UT03, INT-TC02* |
| *C01* | *Pelanggan* | *Tidak perlu* | *Hanya menyimpan data akun, tanpa logika* | *-* |
| *[CXX]* | *[Nama kelas]* | *[Mendalam/Sedang/Tidak perlu]* | *[Alasan penentuan tingkat pengujian]* | *[ID test case atau -]* |
| *[CXX]* | *[Nama kelas]* | *[Mendalam/Sedang/Tidak perlu]* | *[Alasan penentuan tingkat pengujian]* | *[ID test case atau -]* |
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
| *...* | *...* | *...* | *...* | *...* |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: *[tuliskan perintah, mis. `pytest src/tests/`]*.

Lokasi file test: *[path, mis. `src/tests/`]*.

### 4.2.1 Kelas [Nama Kelas 1]

**ID Kelas:** *[C02]*  
**Nama Kelas:** *[Pesanan]*  
**Tingkat:** *[Mendalam]*

Tabel 4.2.1. Hasil Pengujian Unit Kelas [C02]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C02-UT01* | *`hitungTotal(): Decimal`* | *Normal* | *Pesanan berisi 2 item: 10.000 x 2 dan 5.000 x 1* | *Total = 25.000* | *[Hasil aktual]* | *Pass/Fail* |
| *C02-UT02* | *`hitungTotal(): Decimal`* | *Batas* | *Pesanan berisi tepat 1 item dengan jumlah 1* | *Total = harga item tersebut* | *[...]* | *Pass/Fail* |
| *C02-UT03* | *`hitungTotal(): Decimal`* | *Negatif* | *Pesanan tanpa item* | *Total = 0 atau melempar kesalahan sesuai rancangan* | *[...]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.1b. Ringkasan Cakupan Kelas [C02]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.2 Kelas [Nama Kelas 2]

*[Ulangi pola 4.2.1 untuk setiap kelas bertingkat Mendalam atau Sedang.]*

### 4.2.13 Kelas RevisiHandler (Bagian dari Deliverables Service)

**ID Kelas:**   C41
**Nama Kelas:** RevisiHandler
**Tingkat:** Mendalam

Tabel 4.2.13. Hasil Pengujian Unit Kelas [C41]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C41-UT01 | requestRevision() | Batas | deskripsi_revisi = '' atau ' ' | Sistem melempar error "Deskripsi revisi wajib diisi." | Sesuai Ekspektasi (Error dilempar) | Pass |
| C41-UT02 | requestRevision() | Negatif | user_id tidak sesuai dengan id_pengguna_jasa pemilik pesanan (klien-lain) | Sistem melempar error otorisasi / penolakan akses |  Muncul Error Akses ditolak | Pass |
| C41-UT03 | requestRevision() | Batas | jumlah revisi habis(jml_revisi_tersedia=0) | Sistem melempar error "Kuota revisi untuk pesanan ini sudah habis." | Sesuai Ekspektasi (sistem melempar pesan error) | Pass |
| C41-UT04 | requestRevision() | Negatif | Simulasi koneksi DB terputus saat proses update status pesanan | Sistem menangkap error DB & melempar pesan gagal memperbarui status pesanan | error DB tertangkap | Pass |
| C41-UT05 | requestRevision() | Batas | data revisi sebelumnya = null (pengajuan revisi pertama kali) | Pengajuan revisi berhasil diproses tanpa error | revisi pertama berhasil diproses | Pass |
| C41-UT06 | requestRevision() | Positif | Input valid, kuota revisi > 0, DB normal | Berhasil insert revisi (mengembalikan id_revisi) dan NotifikasiService.kirimNotifikasi berhasil dipanggil untuk seller | revisi dibuat & notifikasi terkirim | Pass |
| C41-UT07 | submitRevisionFix() | Negatif | permintaan insert produk akhir ke database gagal  | Menangkap Eror Database dan melempar pesan error insert produk perbaikan  | Error Ditangkap | Pass |
| C41-UT08 | submitRevisionFix() | Negatif | gagal mengupdate status pesanan setelah insert produk akhir berhasil ke dalam database | Melempar pesan error update ("status pesanan gagal diperbarui") | error update tertangkap | Pass |
| C41-UT09 | submitRevisionFix() | Positif | id_pesanan, deskripsi_produk, file_urls, dan user_id penyedia jasa valid | Berhasil insert produk perbaikan, mengubah status_pengerjaan menjadi "Revisi Dikumpulkan", dan memicu NotifikasiService.kirimNotifikasi ke klien | Revisi terkirim, status diperbarui, notifikasi terkirim | Pass |
| C41-UT10 | submitRevisionFix() | Positif | id_pesanan, deskripsi_produk, file_urls, dan user_id penyedia jasa valid | Berhasil insert produk perbaikan, mengubah status_pengerjaan menjadi "Revisi Dikumpulkan", dan memicu NotifikasiService.kirimNotifikasi ke klien | Revisi terkirim, status diperbarui, notifikasi terkirim | Pass |
| C41-UT11 | submitRevisionFix() | Positif | id_pesanan, deskripsi_produk, file_urls, dan user_id penyedia jasa valid | Berhasil insert produk perbaikan, mengubah status_pengerjaan menjadi "Revisi Dikumpulkan", dan memicu NotifikasiService.kirimNotifikasi ke klien | Revisi terkirim, status diperbarui, notifikasi terkirim | Pass |
| C41-UT12 | submitRevisionFix() | Positif | id_pesanan, deskripsi_produk, file_urls, dan user_id penyedia jasa valid | Berhasil insert produk perbaikan, mengubah status_pengerjaan menjadi "Revisi Dikumpulkan", dan memicu NotifikasiService.kirimNotifikasi ke klien | Revisi terkirim, status diperbarui, notifikasi terkirim | Pass |
| C41-UT13 | getRevisionHistory() | Batas | id_pesanan valid, namun belum pernah ada riwayat revisi | Fungsi mengembalikan array kosong [] tanpa melempar error | array kosong dikembalikan | Pass |
| C41-UT14 | getRevisionHistory() | Negatif  | kegagalan query database saat mengambil riwayat revisi | Sistem menangkap error DataBase & melempar pesan "Gagal mengambil riwayat revisi" | Error DataBase tertangkap | Pass |
| C41-UT15 | getRevisionHistory() | Positif | id_pesanan dan user_id owner valid, terdapat data riwayat revisi di DB | Fungsi mengembalikan daftar/array data riwayat revisi yang sesuai| daftar riwayat berhasil diambil | Pass |



Khusus kelas **Mendalam**:

Tabel 4.2.1b. Ringkasan Cakupan Kelas [C41]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | kirimRevisi() --> submitRevisionFix(), isRevisiRequestValid() --> X, sendNotifikasiRevisi() --> X, updateStatusPengerjaan() --> X |
| Operasi yang diuji | requestRevision(),submitRevision(), getRevisionHistory() <br> Note : fungsi yang tidak diimplementasikan sudah dimasukkan ke dalam tubuh fungsi lain yang diuji baik dalam bentuk query maupun routing|
| ID Algoritma yang tercakup | Algo-4101, Algo-4102, Algo-4103, Algo-4104, Algo-4105, dan tambahan yang tidak tercata |
| Coverage (wajib ≥ 70%) | [Lihat Hasil Pengujian](#bukti-c41) |

### 4.2.14 Kelas LaporanHandler

**ID Kelas:**   C45
**Nama Kelas:** LaporanHandler
**Tingkat:** Mendalam

Tabel 4.2.14. Hasil Pengujian Unit Kelas [C45]

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

Tabel 4.2.14b. Ringkasan Cakupan Kelas [C45]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | validasiFormatLaporan() --> Menjadi bagian dari fungsi submitLaporan() <br> kirimNotifAdmin() --> Menjadi bagian dari fungsi submitLaporan() <br> simpanData() --> Menjadi bagian dari fungsi submitLaporan() <br> banPengguna() --> Menjadi bagian dari fungsi catatKeputusanTindakan() <br> skorsPengguna() -->  Menjadi bagian dari fungsi catatKeputusanTindakan() <br> kirimTanggapan() -->  Menjadi bagian dari routing catatKeputusanTindakan() <br> saveTanggapan() -->  Menjadi bagian dari fungsi catatKeputusanTindakan() <br> saveLaporan() --> Menjadi bagian dari fungsi catatKeputusanTindakan() <br> updateStatusTiket() --> Menjadi bagian dari fungsi catatKeputusanTindakan() <br getDetailTiket() --> dipecah menjadi getDetailTiket() untuk pengguna dan getDetailTiketAdmin() untuk admin  |
| Operasi yang diuji | <br>  submitLaporan(), validasiOwnerPesanan(), getTicketsByUser(), getDetailTiket(), getAllTicketsForAdmin(), getDetailTiketAdmin(), catatKeputusanTindakan() <br> Note : fungsi yang tidak diimplementasikan sudah dimasukkan ke dalam tubuh fungsi lain yang diuji baik dalam bentuk query maupun routing |
| ID Algoritma yang tercakup | Algo-4501 - Algo-4510, dan tambahan yang tidak tercatat dalam DPPL |
| Coverage (wajib ≥ 70%) | [Lihat Hasil Pengujian](#bukti-c45) |
<br>

### 4.2.15 Kelas UlasanHandler

**ID Kelas:**   C48
**Nama Kelas:** UlasanHandler
**Tingkat:** Mendalam

Tabel 4.2.15. Hasil Pengujian Unit Kelas [C48]

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

Tabel 4.2.15b. Ringkasan Cakupan Kelas [C48]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | (validasiKelengkapanRating(), validasiFormatBerkas(), validasiPanjangKomentar()) --> Bagian dari simpanUlasan() <br> prosesUlasan() --> simpanUlasan(), perbaruiRating() --> Bagian dari updateUlasan() dan simpanUlasan() |
| Operasi yang diuji | <br>  validasiRating() <br> validasiDokumentasi()  <br> hitungRatingAgregat() <br>  formatRatingTampilan() <br> perbaruiRatingPenyedia() <br> perbaruiRatingJasa() <br> getRatingDanUlasanPenyedia() <br> getStatistikUlasanJasa()  <br> getUlasanJasaById() <br> getUlasanbyJasa() <br> simpanUlasan() <br> validasiOwnerUlasan() <br> updateUlasan() <br> deleteUlasan() <br> Note : fungsi yang tidak diimplementasikan sudah dimasukkan ke dalam tubuh fungsi lain yang diuji baik dalam bentuk query maupun routing |
| ID Algoritma yang tercakup | Algo-4801 - Algo-4805, dan tambahan yang tidak tercatat dalam DPPL |
| Coverage (wajib ≥ 70%) | [Lihat Hasil Pengujian](#bukti-c48) |

### 4.2.16 Kelas MediasiHandler

**ID Kelas:**   C51
**Nama Kelas:** MediasiHandler
**Tingkat:** Mendalam

Tabel 4.2.16. Hasil Pengujian Unit Kelas [C51]
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


Tabel 4.2.16b. Ringkasan Cakupan Kelas [C51]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL |  |
| Operasi yang diuji | <br> Note : fungsi yang tidak diimplementasikan sudah dimasukkan ke dalam tubuh fungsi lain yang diuji baik dalam bentuk query maupun routing |
| ID Algoritma yang tercakup | Algo-4801 - Algo-4805, dan tambahan yang tidak tercatat dalam DPPL |
| Coverage (wajib ≥ 70%) | [Lihat Hasil Pengujian](#bukti-c51) |

### 4.2.17 Kelas PengumpulanController

**ID Kelas:**   C54
**Nama Kelas:** MediasiHandler
**Tingkat:** Mendalam

Tabel 4.2.16. Hasil Pengujian Unit Kelas [C54]


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

### 4.4.1 Use Case [Nama Use Case 1]

**ID Use Case:** *[UC01 sesuai SKPL]*  
**Nama Use Case:** *[Nama use case sesuai SKPL]*

Tabel 4.4.1. Hasil Pengujian Use Case [UC01]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC01-TC01* | *KF01* | *Normal* | *1. Buka halaman login.<br>2. Masukkan kredensial.<br>3. Klik tombol "Login".* | *User: rpl@gmail.com<br>Pass: 123456* | *Pengguna diarahkan ke Halaman Dashboard.* | *Pengguna diarahkan ke Halaman Dashboard sesuai hasil yang diharapkan.* | *Pass* |
| *UC01-TC02* | *KF01* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.2 Use Case [Nama Use Case 2]

*[Lanjutkan untuk seluruh use case dengan pola yang sama, hingga 4.4.N.]*

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF01-TC01* | *KNF01* | *Reliability* | *Tidak ada data hilang/ganda saat jaringan putus di tengah transaksi* | *Simulasi putus koneksi saat bayar, lalu cek status di DB* | *[Hasil aktual]* | *Pass/Fail* |
| *KNF02-TC01* | *KNF02* | *Security* | *Password tersimpan sebagai hash, bukan plain-text* | *Inspeksi tabel pengguna di DB* | *[...]* | *Pass/Fail* |
| *KNFXX-TC01* | *KNFXX* | *Response time* | *Halaman tampil ≤ 4 detik* | *Chrome DevTools, 5 kali ukur, ambil rata-rata* | *[Rata-rata ... detik, maks ... detik]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

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
| C41-UT01 - C41-UT06 |  <img alt="Pengujian" src="../M10/assets/C41-T1_1.png" width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/C41-T1_2.png" width="70%"> |
| C41-UT07 - C41-UT12 | <img alt="Pengujian" src="../M10/assets/C41-T2_1.png" width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/C41-T2_2.png" width="70%">|
| C41-UT13 - C41-UT15 | <img alt="Pengujian" src="../M10/assets/C41-T3_1.png" width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/C41-T3_2.png" width="70%"> |
| <a id="bukti-c41"></a>C41 Coverage | <img alt="Pengujian" src="../M10/assets/C41-Coverage1.png" width="70%"> <br> <br> <img alt="Pengujian" src="../M10/assets/C41-Coverage2.png" width="70%"> |
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