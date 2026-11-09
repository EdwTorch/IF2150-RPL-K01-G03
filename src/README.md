# Tugas Besar IF2150 Rekayasa Perangkat Lunak
## Kelompok 3 MAYOOOOOR
## Daftar Isi 

1. [Anggota Kelompok](#anggota-kelompok)
2. [Deskripsi Singkat Aplikasi](#deskripsi-singkat-aplikasi)
3. [Teknologi yang digunakan](#teknologi-yang-digunakan)
4. [Prasyarat dan Instalasi](#prasyarat-dan-instalasi)
5. [Cara Menjalankan Aplikasi](#cara-menjalankan-aplikasi)
6. [Akun/data uji](#akundata-uji)
7. [Daftar Pembagian Modul yang diimplementasikan](#daftar-pembagian-modul-yang-diimplementasikan)
8. [Daftar Tabel Basis Data](#daftar-tabel-basis-data)

## Anggota Kelompok
| NIM | Nama |
|---|---|
| 13525031 | Revandra Zacky Maharta |
| 13525079 | Danesh Rasyad Damotino |
| 13525088 | Theresia Estelina Ratu Udju |
| 13525127 | Edward Terrance Lie |
| 13525130 | Necia Aurely Greva Dedevi |

## Deskripsi Singkat Aplikasi
CariJasa adalah platform *marketplace* jasa berbasis web yang dirancang untuk memudahkan pencarian dan penawaran jasa digital bagi masyarakat Indonesia. Aplikasi ini dibuat untuk mengatasi masalah informasi jasa yang saat ini masih tersebar di berbagai media sosial dan kanal lain, sehingga pengguna kesulitan mencari serta membandingkan tarif, keahlian, dan ulasan penyedia jasa secara mudah. Selain itu, platform ini hadir untuk membantu *freelancer* maupun penyedia jasa lokal memperoleh penghasilan tambahan tanpa harus terikat hubungan kerja tetap. Ruang lingkup aplikasi berfokus pada penyediaan daftar pilihan jasa, fitur pembanding jasa (*compare*), ruang kirim pesan langsung (*chat*), pembayaran digital yang aman, pengiriman hasil kerja dan pengajuan revisi, hingga pelaporan kendala serta bantuan penyelesaian masalah oleh admin.

## Teknologi yang digunakan
1. Bahasa Pemrograman : TypeScript
2. Framework : Next.js 15 
3. Styling UI : Tailwind CSS
4. DBMS : PostgreSQL (via Supabase)
5. Storage : Local Storage Service / Supabase Storage 
6. Server : Lokal
7. Tools Pengembangan : Github
8. Client : Web Browser berbasis chromium
9. OS yang dapat dilayani : Windows/Linux/MacOS/Android/IOS


## Prasyarat dan instalasi
### Prasyarat (Prerequisites)

Sebelum menjalankan proyek ini secara lokal, pastikan perangkat Anda telah terinstal:

- **Node.js** versi **18.18** atau lebih baru (disarankan versi **20 LTS**).
- **Package Manager**: `npm`, `yarn`, `pnpm`, atau `bun`.
- **Git** untuk melakukan *cloning* repositori.
- **Akun & Proyek Supabase** (untuk database PostgreSQL, autentikasi, dan fitur *realtime*).

### Instalasi & Menjalankan Proyek

#### 1. Clone Repositori
```bash
git clone [https://github.com/EdwTorch/IF2150-RPL-K01-G03.git](https://github.com/EdwTorch/IF2150-RPL-K01-G03.git)
cd nama-repo-kamu
```

#### 2. Instal Dependensi
```bash
npm install
```

#### 3. Konfigurasi Environment Variables
Buat file baru bernama `.env.local` di direktori utama (*root*) proyek yaitu root/src, lalu isi dengan kredensial proyek Supabase Anda (gunakan contoh format di bawah ini):

```env
NEXT_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 4. Konfigurasi Database (Supabase)
1. Buka dashboard proyek Anda di [Supabase](https://supabase.com/).
2. Masuk ke menu **SQL Editor** dan jalankan skrip skema tabel proyek.
3. Aktifkan **Realtime** pada tabel `notifikasi` dan `pesan_chat` melalui menu **Database > Replication** (atau jalankan perintah SQL berikut):
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.notifikasi, public.pesan_chat;
   ```
4. Pastikan folder `public/uploads` tersedia dan memiliki izin tulis (*write permission*) jika menggunakan penyimpanan lokal.


## Cara Menjalankan Aplikasi
```bash
npm run dev
```

Buka browser dan akses `http://localhost:3000`.


## Akun/data uji
Untuk mempermudah pengujian fitur berdasarkan masing-masing peran (*role*), gunakan akun simulasi berikut pada lingkungan pengembangan (*development*):

| Role | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@contoh.com` | `Admin123` | Mengelola laporan/tiket bantuan dan moderasi. |
| **Penyedia Jasa** | `penyedia.uji@contoh.com` | `Bujank123` | Memiliki daftar layanan aktif & menerima pesanan. |
| **Pemesan (Klien)** | `klien.uji@contoh.com` | `Another123!` | Dapat mencari jasa, membuat pesanan, & mengirim ulasan. |


## Id Jasa yang dapat diuji belom ada

## Daftar Pembagian Modul yang diimplementasikan
| Nama  | Tanggung Jawab Modul dan Routingnya |
| :--- | :--- | 

| Revandra Zacky Maharta | | 
| Danesh Rasyad Damotino | | 
| Theresia Estelina Ratu Udju | | 
| Edward Terrance Lie | BACKEND : <br> 1. Modul Deliverables (Terima/Tolak Pesanan, Konfirmasi Pesanan, Kirim Pesanan, Ajukan Revisi, Pengumpulan Revisi, Konfirmasi Hasil, Pencairan Dana) <br> 2. Modul Ulasan <br> 3. Modul Pelaporan <br> 4. Notifikasi <br> 5. Chat Realtime <br> 6. Chat Mediasi <br> 7. All about admin |
| Necia Aurely Greva Dedevi | |


## Daftar Tabel Basis Data
| Nama Tabel | Deskripsi |
| :--- | :--- | 
`pengguna` | Menyimpan data akun utama dan informasi autentikasi seluruh pengguna. |
| `penyedia_jasa` | Menyimpan data profil dan informasi khusus pengguna yang berperan sebagai penyedia jasa. |
| `pengguna_jasa` | Menyimpan data profil pengguna yang berperan sebagai pemesan atau klien. |
| `admin` | Menyimpan data profil dan hak akses administrator sistem. |
| `portofolio` | Menyimpan daftar karya atau hasil proyek terdahulu milik penyedia jasa. |
| `jasa` | Menyimpan katalog layanan atau jasa yang ditawarkan oleh penyedia jasa. |
| `bookmark` | Menyimpan daftar jasa yang ditandai atau disimpan oleh pemesan. |
| `metode_pembayaran` | Menyimpan pilihan kanal atau metode pembayaran yang tersedia di sistem. |
| `pesanan` | Menyimpan data transaksi pemesanan jasa beserta status pengerjaannya. |
| `riwayat_transaksi` | Menyimpan catatan mutasi dan status pembayaran dari setiap pesanan. |
| `chatroom` | Menyimpan data ruang percakapan antara pemesan dan penyedia jasa. |
| `pesan_chat` | Menyimpan riwayat pesan di dalam setiap ruang percakapan. |
| `produk_akhir` | Menyimpan file atau tautan hasil akhir pekerjaan (*deliverables*) yang dikirim penyedia jasa. |
| `pengajuan_revisi` | Menyimpan permintaan dan catatan revisi hasil pekerjaan dari pemesan. |
| `pencairan_dana` | Menyimpan pengajuan dan status penarikan saldo pendapatan oleh penyedia jasa. |
| `tiket_laporan` | Menyimpan tiket pengaduan atau sengketa transaksi yang diajukan pengguna. |
| `sesi_mediasi` | Menyimpan data sesi penyelesaian sengketa yang ditengahi oleh admin. |
| `pesan_mediasi` | Menyimpan riwayat percakapan antara pihak bersengketa dan admin di dalam sesi mediasi. |
| `ulasan` | Menyimpan rating dan ulasan dari pemesan setelah pesanan selesai. |
| `notifikasi` | Menyimpan pemberitahuan aktivitas transaksi dan sistem secara *realtime* bagi pengguna. |
| `tanggapan_laporan`| menyimpan tanggapan laporan dari admin untuk disampaikan ke pengguna jasa |
