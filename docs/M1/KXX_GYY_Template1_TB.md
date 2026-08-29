<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 1
<br>
TOPIC BRAINSTORMING
</h1>
<br>

## *Nama Perangkat Lunak*

### Untuk: *[Nama Asisten]*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *\[Kelas\]* |
| Kelompok | *\[Nomor Kelompok\]*  |

| NIM | Nama |
|---|---|
| *[NIM 1]* | *[Nama Anggota 1]* |
| *[NIM 2]* | *[Nama Anggota 2]* |
| *[NIM 3]* | *[Nama Anggota 3]* |
| *[NIM 4]* | *[Nama Anggota 4]* |
| *[NIM 5]* | *[Nama Anggota 5]* |
---

<br>
<br>

# BAB 1: Analisis Permasalahan

## 1.1 Latar Belakang Masalah
<p> Perkembangan teknologi dan aktivitas masyarakat saat ini mendorong munculnya berbagai kebutuhan akan layanan jasa, baik untuk keperluan pribadi maupun pekerjaan. Kondisi tersebut dapat menjadi peluang bagi masyarakat untuk memperoleh penghasilan dengan memanfaatkan keterampilan yang dimiliki melalui penyediaan jasa kepada pihak yang membutuhkan, tanpa harus terikat pada hubungan kerja formal. Hal ini semakin relevan karena berdasarkan data dari Badan Pusat Statistik pada Februari 2026, masih terdapat 7,24 juta pengangguran di Indonesia dengan Tingkat Pengangguran Terbuka (TPT) sebesar 4,68%. Dengan tersedianya akses terhadap peluang kerja berbasis jasa, masyarakat yang belum memperoleh pekerjaan dapat memanfaatkan keterampilan yang dimilikinya untuk mendapatkan penghasilan yang layak. </p>
<p> Meskipun kebutuhan akan layanan jasa terus meningkat, masyarakat masih menemukan kendala dalam menemukan penyedia jasa yang sesuai dengan kebutuhan, biaya, lokasi, dan waktu yang dimiliki. Informasi mengenai jasa yang tersedia juga tersebar di berbagai platform, sehingga menghambat proses pencarian dan mengakibatkan penawaran jasa jadi tidak terstruktur. Oleh karena itu, platform digital dapat dimanfaatkan untuk mempertemukan pencari dan penyedia jasa dengan lebih efisien. </p>
<p>CariJasa dikembangkan sebagai platform digital yang dapat membantu masyarakat dalam mencari dan menawarkan jasa dengan lebih terstruktur. Platform ini menyediakan informasi mengenai jasa, keterampilan, harga, lokasi, serta penilaian dari konsumen. Dengan adanya platform yang terintegrasi, penyedia jasa dapat menawarkan jasa yang dimilikinya sedangkan pencari jasa dapat menemukan layanan jasa apa yang dibutuhkan dengan lebih cepat. Pengembangan platform ini sejalan dengan Sustainable Development Goal (SDG) ke-8, yaitu Decent Work and Economic Growth. CariJasa diharapkan dapat mempermudah akses terhadap peluang pekerjaan berbasis keterampilan sekaligus mendukung terciptanya pekerjaan yang produktif dan pertumbuhan ekonomi inklusif.</p>


## 1.2 Analisis Kondisi Saat Ini
### 1. Kondisi Pencari Jasa
Masyarakat yang membutuhkan jasa saat ini dapat mencari penyedia melalui berbagai media, seperti medsos, komunitas, rekomendasi orang lain, atau platform tertentu. Namun, informasi mengenai penyedia jasa tidak berada pada satu tempat yang sama. Pengguna harus mencari dan membandingkan informasi seperti harga, keterampilan, serta pengalaman penyedia secara manual.

### 2. Kondisi Penyedia Jasa
Para penyedia jasa dapat memanfaatkan media sosial atau platform tertentu untuk mempromosikan layanannya secara mandiri, tetapi jangkauan calon konsumen dapat bergantung pada visibilitas atau algoritma di platform tersebut. Para penyedia jasa juga merasa kesulitan untuk  menjangkau calon konsumen yang benar-benar membutuhkan jasanya.

### 3. Kondisi Platform yang Sudah Ada
Berdasarkan perbandingan dengan platform sejenis, Fiverr dan Upwork telah menyediakan fitur utama dalam marketplace jasa, seperti pencarian jasa, penawaran jasa, profil penyedia, portofolio, booking, rating dan review, filter berdasarkan kebutuhan dan harga, chat, request jasa, hingga pembayaran melalui platform. Kedua platform juga memungkinkan pengguna untuk mempertimbangkan berbagai penyedia jasa sebelum melakukan pemesanan. Namun, Fiverr dan Upwork memiliki cakupan pasar yang luas dan bersifat global. Sementara itu, CariJasa memiliki fokus pada pasar lokal Indonesia dan memiliki fitur *compare*, sehingga pengguna dapat membandingkan dua atau lebih jasa secara detil dan mudah.



---

# BAB 2: Analisis Solusi

## 2.1 Deskripsi Perangkat Lunak
Solusi perangkat lunak yang kami usulkan adalah sebuah platform pencarian jasa, CariJasa. CariJasa merupakan sebuah situs web responsif (*responsive website*), sehingga dapat menyesuaikan tampilan pada perangkat pengguna. Alasan utama pemilihan situs web responsif adalah untuk mempermudah pengguna mengakses situs web menggunakan berbagai perangkat tanpa perlu mengunduh aplikasi terlebih dahulu. Situs web ini dirancang untuk menghubungkan pencari jasa dan penyedia jasa khususnya di bidang layanan digital (*digital service*). Dari sudut pandang pencari jasa, situs web ini menyediakan akses untuk mencari kebutuhan jasa di bidang digital dengan mudah, seperti jasa pemrograman, penyuntingan video, desain grafis, dan sebagainya. Sementara itu, bagi penyedia jasa, situs web ini dapat digunakan sebagai wadah untuk menampilkan portofolio karya, membangun reputasi, mendapatkan pengakuan (*recognition*), serta memperoleh penghasilan. Pada situs web ini, pencari jasa dan penyedia jasa dapat melakukan seluruh proses transaksi pada satu platform yang sama. Pengguna dapat melakukan pemesanan, mendiskusikan rincian jasa, hingga menyelesaikan pembayaran tanpa perlu beralih ke platform lain. Pencari jasa juga dapat menemukan penyedia jasa yang sesuai melalui fitur penyaringan (*filtering*) berdasarkan anggaran (*budget*) yang dimiliki dan keahlian yang dibutuhkan. Selain itu, mereka juga dapat memberikan ulasan maupun membaca ulasan dari pengguna lain. Nilai unik yang membedakan CariJasa dengan solusi yang sudah ada adalah fokus dan model interaksi platformnya. Berbeda dengan platform yang mencampurkan jasa fisik dan digital, CariJasa secara spesifik berfokus pada layanan digital. Oleh karena itu, alur, tampilan, dan interaksi pada situs web ini dirancang khusus untuk memenuhi kebutuhan industri kreatif dan teknologi.

## 2.2 Asumsi dan Batasan
Definisikan secara tegas asumsi (baik teknis maupun dari sisi pengguna) yang menjadi dasar pengembangan. Tuliskan batasan seperti regulasi/hukum, keterbatasan sumber daya, dan ruang lingkup solusi.

---

# BAB 3: Spesifikasi Kebutuhan dan Proses Bisnis

## 3.1 Identifikasi Aktor
| Aktor | Deskripsi |
| :--: | :-- |
| Penyedia Jasa | Memanfaatkan keterampilan yang dimilikinya untuk menawarkan layanan digital tanpa adanya hubungan kerja formal. Penyedia jasa menampilkan portofolio, menentukan harga, serta mendiskusikan dan menyelesaikan pesanan secara mandi. |
| Pengguna Jasa | Membutuhkan layanan digital untuk kebutuhan pribadi maupun pekerjaan. Pengguna jasa menggunakan platform untuk mencari penyedia jasa (berdasarkan kriteria spesifiknya), melakukan pemesanan serta pembayaran digital, mengajukan revisi, dan memberikan ulasan. |
| *Developer* | Pengelola situs web, bertanggung jawab menjaga keamanan data dan transaksi, menyediakan layanan aduan, serta bertindak sebagai penengah dalam proses penahanan hingga pencairan dana. |


## 3.2 Kebutuhan Pengguna Awal
| ID | Aktor | Kebutuhan / Aktivitas | Tujuan / Nilai |
| :--- | :--- | :--- | :--- |
| US-01 | Penyedia Jasa | Menampilkan portofolio dan menentukan harga layanan. | Mempromosikan keahlian dan memperoleh penghasilan. |
| US-02 | Penyedia Jasa | Berinteraksi dengan pencari jasa dan mengirimkan hasil jasa. | Menyelesaikan pesanan dan membangun reputasi. |
| US-03 | Pengguna Jasa | Mencari dan menyaring jasa berdasarkan keahlian serta *budget*. | Menemukan layanan yang sesuai dengan kriteria kebutuhan. |
| US-04 | Pengguna Jasa | Melakukan pemesanan dan pembayaran digital langsung di platform. | Bertransaksi tanpa harus berpindah ke aplikasi lain. |
| US-05 | Pengguna Jasa | Berkomunikasi mengenai *detail* jasa dan mengajukan revisi pekerjaan. | Memastikan hasil akhir sesuai dengan pesanan. |
| US-06 | Pengguna Jasa | Membaca dan memberikan ulasan serta penilaian. | Menilai kualitas penyedia jasa dan membantu pengguna lain. |
| US-07 | *Developer* | Mengurus enkripsi data serta sistem penahanan dan pencairan dana. | Menjamin keamanan transaksi dan kerahasiaan data pengguna. |
| US-08 | *Developer* | Menyediakan *form* pengaduan dan pusat umpan balik. | Menangani kendala operasional dan memediasi permasalahan transaksi. |

## 3.3 Model Proses Bisnis
Buatlah *Activity Diagram* atau *Swimlane Diagram* yang menunjukkan alur kerja proses bisnis dari sistem solusi. Diagram ini harus memvisualisasikan bagaimana alur operasional di dunia nyata berjalan lebih efisien dengan adanya interaksi antara aktor (yang didefinisikan pada poin 3.1) dan sistem perangkat lunak. Perhatikan notasi yang digunakan dalam pembuatannya.
<br>

<p align="center">
<img alt="Contoh Activity Diagram" src="./assets/diagram/diagram-act-1.avif" width="70%">
</p>
<p align="center">
<i>Gambar 1. Contoh Activity Diagram</i>
</p>

<br>

# Referensi
- Diagram UML: https://www.drawio.com/, https://staruml.io/
