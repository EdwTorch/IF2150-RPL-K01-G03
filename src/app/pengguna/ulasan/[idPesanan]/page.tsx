
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  Alert,
  Button,
  PageHero,
  RatingInput,
  Textarea,
  UploadBox,
} from "@/components/elemen";

import {
  FORMAT_BERKAS,
  MAX_MB,
  getTransaksi,
  kirimUlasan,
} from "@/lib/layanan";

// C47: kosong | error (bintang wajib) | sukses
export default function HalamanUlasan() {
  const { idPesanan } = useParams<{ idPesanan: string }>();

  const [namaJasa, setNamaJasa] = useState("");
  const [namaPenyedia, setNamaPenyedia] = useState("");

  const [n, setN] = useState(0);
  const [kom, setKom] = useState("");
  const [files, setF] = useState<File[]>([]);

  const [eN, setEN] = useState("");
  const [umum, setU] = useState("");

  const [busy, setB] = useState(false);
  const [memuat, setMemuat] = useState(true);
  const [done, setDone] = useState(false);

  // Mengambil nama jasa dan penyedia berdasarkan ID pesanan.
  useEffect(() => {
    let aktif = true;

    async function muatTransaksi() {
      if (!idPesanan) {
        setU("ID pesanan tidak ditemukan.");
        setMemuat(false);
        return;
      }

      setMemuat(true);

      try {
        const transaksi = await getTransaksi();

        const dataPesanan = transaksi.find(
          (item) => item.id === idPesanan
        );

        if (!dataPesanan) {
          throw new Error("Data pesanan tidak ditemukan.");
        }

        if (aktif) {
          setNamaJasa(dataPesanan.judul);
          setNamaPenyedia(dataPesanan.penyedia);
          setU("");
        }
      } catch (z) {
        if (aktif) {
          setU(
            z instanceof Error
              ? z.message
              : "Gagal memuat informasi pesanan."
          );
        }
      } finally {
        if (aktif) {
          setMemuat(false);
        }
      }
    }

    muatTransaksi();

    return () => {
      aktif = false;
    };
  }, [idPesanan]);

  async function kirim(ev: React.FormEvent) {
    ev.preventDefault();
    setU("");

    if (!n) {
      setEN("Penilaian bintang wajib diisi.");
      return;
    }

    setEN("");
    setB(true);

    try {
      await kirimUlasan(idPesanan, {
        rating: n,
        komentar: kom,
        files,
      });

      setDone(true);
    } catch (z) {
      setU(
        z instanceof Error
          ? z.message
          : "Gagal mengirim ulasan."
      );
    } finally {
      setB(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-6 py-8 md:px-20">
      <PageHero
        judul="Beri Ulasan"
        subjudul="Bagikan pengalamanmu selama menggunakan jasa ini."
      />

      <section className="rounded-xl border border-line bg-surface p-6">
        <form
          noValidate
          onSubmit={kirim}
          className="flex flex-col gap-5"
        >
          {done && (
            <Alert tipe="success">
              Ulasan berhasil dikirim.
            </Alert>
          )}

          {umum && (
            <Alert>{umum}</Alert>
          )}

          {/* Informasi jasa */}
          <div className="flex flex-col gap-1">
            <span className="text-label text-ink">
              Nama Jasa
            </span>

            <span className="text-body text-ink-muted">
              {memuat ? "Memuat nama jasa..." : namaJasa || "-"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-label text-ink">
              Nama Penyedia
            </span>

            <span className="text-body text-ink-muted">
              {memuat
                ? "Memuat nama penyedia..."
                : namaPenyedia || "-"}
            </span>
          </div>

          {/* Penilaian */}
          <div className="flex flex-col gap-2">
            <span className="text-label text-ink">
              Penilaian <span className="text-danger">*</span>
            </span>

            <RatingInput
              nilai={n}
              onUbah={(nilai) => {
                setN(nilai);
                setEN("");
              }}
              disabled={done}
            />

            {eN && (
              <Alert className="w-fit">
                {eN}
              </Alert>
            )}
          </div>

          {/* Komentar */}
          <Textarea
            label="Komentar (opsional)"
            placeholder="Berikan komentar terkait penyedia jasa atau hasil jasa"
            value={kom}
            onChange={(ev) => setKom(ev.target.value)}
            disabled={done}
          />

          {/* Dokumentasi */}
          <UploadBox
            label="Dokumentasi (opsional)"
            format={FORMAT_BERKAS}
            maksMB={MAX_MB}
            maksBerkas={5}
            berkas={files}
            onUbah={setF}
            disabled={done}
          />

          {/* Tombol */}
          {done ? (
            <Button
              href="/pengguna/riwayat-transaksi"
              className="self-end"
            >
              Riwayat Transaksi
            </Button>
          ) : (
            <Button
              type="submit"
              loading={busy}
              disabled={busy || memuat || !namaJasa}
              className="self-end"
            >
              Kirim Ulasan
            </Button>
          )}
        </form>
      </section>
    </div>
  );
}
