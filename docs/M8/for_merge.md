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

## 5.48 Kelas UlasanHandler

**Nama Kelas:** UlasanHandler      
**ID Kelas:** C48

Tabel 5.48.1. Operasi Kelas C48

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| validasiKelengkapanRating(rating : integer) : boolean | public | Memvalidasi bahwa rating telah diberikan dan berada pada skala 1 hingga 5. |
| validasiFormatBerkas(fileDokumentasi : FILE) : boolean | public | Memvalidasi tipe dan ukuran berkas dokumentasi ulasan yang diunggah. |
| validasiPanjangKomentar(teksKomentar : string) : boolean | public | Memvalidasi bahwa isi komentar ulasan memenuhi batas minimal dan maksimal karakter. |
| prosesUlasan(idPesanan : string, rating : integer, teksKomentar : string, fileDokumentasi : FILE) : void | public | Mengoordinasikan alur validasi, penyimpanan ulasan, serta pembaruan rating penyedia jasa. |
| perbaruiRating(idPenyediaJasa : string, ratingBaru : integer) : void | public | Mengalkulasi rata-rata skor bintang penyedia jasa lalu memperbaruinya pada basis data. |

### 5.48.1 Algoritma/Query

**Nama Kelas:** UlasanHandler     
**Nama Operasi:** validasiKelengkapanRating         
**ID Algoritma:** Algo-4801

```pseudocode
INPUT: rating (integer)
OUTPUT: boolean

1. IF rating >= 1 AND rating <= 5 THEN
2.      RETURN true
3. ELSE
4.      RETURN false
```

### 5.48.2 Algoritma/Query

**Nama Kelas:** UlasanHandler     
**Nama Operasi:** validasiFormatBerkas         
**ID Algoritma:** Algo-4802

```pseudocode
INPUT: fileDokumentasi (FILE)
OUTPUT: boolean

1. IF fileDokumentasi IS NULL THEN
2.      RETURN true
3.
4. allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4"]
5. maxSize = 10 * 1024 * 1024
6.
7. IF fileDokumentasi.type IN allowedTypes AND fileDokumentasi.size <= maxSize THEN
8.      RETURN true
9. ELSE
10.      RETURN false
```

### 5.48.3 Algoritma/Query

**Nama Kelas:** UlasanHandler     
**Nama Operasi:** validasiPanjangKomentar         
**ID Algoritma:** Algo-4803

```pseudocode
INPUT: teksKomentar (string)
OUTPUT: boolean

1. IF teksKomentar IS NOT NULL AND LENGTH(teksKomentar) <= 500 THEN
2.      RETURN true
3. ELSE
4.      RETURN false
```

### 5.48.4 Algoritma/Query

**Nama Kelas:** UlasanHandler     
**Nama Operasi:** prosesUlasan         
**ID Algoritma:** Algo-4804

```pseudocode
INPUT: idPesanan (string), rating (integer), teksKomentar (string), fileDokumentasi (FILE)
OUTPUT: void

1. IF NOT validasiKelengkapanRating(rating) THEN
2.      THROW Exception "Rating tidak valid."
3.
4. IF NOT validasiPanjangKomentar(teksKomentar) THEN
5.      THROW Exception "Panjang komentar melebihi batas."
6.
7. IF NOT validasiFormatBerkas(fileDokumentasi) THEN
8.      THROW Exception "Format berkas dokumentasi tidak sesuai."
9.
10. idPenyediaJasa = EXECUTE Q-4804 WITH (idPesanan)
11. Ulasan.simpanUlasan(idPesanan, idPenyediaJasa, rating, teksKomentar, fileDokumentasi)
12. perbaruiRating(idPenyediaJasa, rating)
```

Tabel 5.48.2. Query Operasi prosesUlasan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4804 | SELECT id_penyedia_jasa FROM pesanan WHERE id_pesanan = ?; | Mengambil ID penyedia jasa berdasarkan pesanan. |

### 5.48.5 Algoritma/Query

**Nama Kelas:** UlasanHandler     
**Nama Operasi:** perbaruiRating         
**ID Algoritma:** Algo-4805

```pseudocode
INPUT: idPenyediaJasa (string), ratingBaru (integer)
OUTPUT: void

1. rerataRating = EXECUTE Q-4805 WITH (idPenyediaJasa)
2. hasilQuery = EXECUTE Q-4806 WITH (rerataRating, idPenyediaJasa)
4.
5. IF hasilQuery == true THEN
6.      RETURN
7. ELSE
8.      THROW Exception "Gagal memperbarui rata-rata rating penyedia jasa."
```

Tabel 5.48.3. Query Operasi perbaruiRating

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4805 | SELECT AVG(rating) FROM ulasan WHERE id_penyedia_jasa = ?; | Menghitung rata-rata nilai rating penyedia jasa dari seluruh ulasan. |
| Q-4806 | UPDATE penyedia_jasa SET rating_rata_rata = ? WHERE id_penyedia_jasa = ?; | Memperbarui atribut rating rata-rata pada profil penyedia jasa. |

## 5.49 Kelas TanggapanLaporan

**Nama Kelas:** TanggapanLaporan      
**ID Kelas:** C49

Tabel 5.49.1. Operasi Kelas C49

| Nama Operasi | Visibility (private, public) | Keterangan |
| :--- | :--- | :--- |
| catatKeputusanTindakan(idTiket : string, jenisTindakan : string, catatan : string) : void | private | Menyimpan catatan keputusan tindakan sanksi Admin atas laporan pengguna. |
| getDetailTanggapan(idTanggapan : string) : string | private | Mengembalikan data tanggapan laporan dalam bentuk string. |

Tabel 5.49.2. Atribut Kelas TanggapanLaporan

| Nama Atribut | Visibility (private, public) | Tipe |
| :--- | :--- | :--- |
| idTanggapan | private | string |
| idTiket | private | string |
| jenisTindakan | private | string |
| catatanTanggapan | private | string |

### 5.49.1 Algoritma/Query

**Nama Kelas:** TanggapanLaporan     
**Nama Operasi:** catatKeputusanTindakan         
**ID Algoritma:** Algo-4901

```pseudocode
INPUT: idTiket (string), jenisTindakan (string), catatan (string)
OUTPUT: void

1. IF idTiket IS EMPTY OR jenisTindakan IS EMPTY THEN
2.      THROW Exception "Input keputusan tindakan tidak valid."
3. 
4. idTanggapan = GENERATE_UUID()
5. hasilQuery = EXECUTE Q-4901 WITH (idTanggapan, idTiket, jenisTindakan, catatan)
6.
7. IF hasilQuery == true THEN
8.      RETURN
9. ELSE
10.     THROW Exception "Gagal mencatat keputusan tindakan laporan."
```

Tabel 5.49.3. Query Operasi catatKeputusanTindakan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4901 | INSERT INTO tanggapan_laporan (id_tanggapan, id_tiket, jenis_tindakan, catatan_tanggapan) VALUES (?, ?, ?, ?); | Mencatat bentuk sanksi yang diputuskan oleh Admin ke dalam tabel tanggapan_laporan. |

### 5.49.2 Algoritma/Query

**Nama Kelas:** TanggapanLaporan     
**Nama Operasi:** getDetailTanggapan         
**ID Algoritma:** Algo-4902

```pseudocode
INPUT: idTanggapan (string)
OUTPUT: string

1. hasilQuery = EXECUTE Q-4902 WITH (idTanggapan)
2. IF hasilQuery IS NOT EMPTY THEN
3.      data = FORMAT_TO_JSON(hasilQuery.id_tanggapan, hasilQuery.id_tiket, hasilQuery.jenis_tindakan, hasilQuery.catatan_tanggapan)
4.      RETURN data
5. ELSE
6.      RETURN ""
```

Tabel 5.49.4. Query Operasi getDetailTanggapan

| No Query | Query | Keterangan |
| :--- | :--- | :--- |
| Q-4902 | SELECT id_tanggapan, id_tiket, jenis_tindakan, catatan_tanggapan FROM tanggapan_laporan WHERE id_tanggapan = ?; | Mengambil rincian tanggapan keputusan laporan berdasarkan ID tanggapan. |