
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

import { ambilDetailPesanan } from "@/lib/client/pesanan";
import { kirimUlasan } from "@/lib/client/ulasan";

// Format dan batas dokumentasi ulasan
const FORMAT_BERKAS = ["jpg", "jpeg", "png", "pdf"];
const MAX_MB = 10;
const MAKS_BERKAS = 3;

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

        async function muatPesanan() {
            if (!idPesanan) {
                setU("ID pesanan tidak ditemukan.");
                setMemuat(false);
                return;
            }

            setMemuat(true);

            try {
                const pesanan = await ambilDetailPesanan(idPesanan);

                if (!pesanan.jasa) {
                    throw new Error(
                        "Informasi jasa pada pesanan tidak ditemukan."
                    );
                }

                if (aktif) {
                    setNamaJasa(pesanan.jasa.nama_jasa);
                    setNamaPenyedia(
                        pesanan.penyedia_jasa?.pengguna?.nama || "-"
                    );
                    setU("");
                }
            } catch (err) {
                if (aktif) {
                    setU(
                        err instanceof Error
                            ? err.message
                            : "Gagal memuat informasi pesanan."
                    );
                }
            } finally {
                if (aktif) {
                    setMemuat(false);
                }
            }
        }

        muatPesanan();

        return () => {
            aktif = false;
        };
    }, [idPesanan]);

    async function kirim(ev: React.FormEvent) {
        ev.preventDefault();

        // Mencegah submit berulang.
        if (busy || done) return;

        setU("");

        if (!n) {
            setEN("Penilaian bintang wajib diisi.");
            return;
        }

        if (files.length > MAKS_BERKAS) {
            setU(
                `Dokumentasi ulasan maksimal ${MAKS_BERKAS} berkas.`
            );
            return;
        }

        // Validasi tambahan sebelum mengirim ke API.
        const formatTidakValid = files.find((file) => {
            const ekstensi = file.name.split(".").pop()?.toLowerCase();
            return !ekstensi || !FORMAT_BERKAS.includes(ekstensi);
        });

        if (formatTidakValid) {
            setU(
                `Format "${formatTidakValid.name}" tidak didukung. Gunakan JPG, JPEG, PNG, atau PDF.`
            );
            return;
        }

        const berkasTerlaluBesar = files.find(
            (file) => file.size > MAX_MB * 1024 * 1024
        );

        if (berkasTerlaluBesar) {
            setU(
                `"${berkasTerlaluBesar.name}" terlalu besar. Maksimal ${MAX_MB} MB per berkas.`
            );
            return;
        }

        setEN("");
        setB(true);

        try {
            await kirimUlasan(idPesanan, {
                rating: n,
                komentar: kom,
                berkas: files,
            });

            setDone(true);
        } catch (err) {
            setU(
                err instanceof Error
                    ? err.message
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

                    {umum && <Alert>{umum}</Alert>}

                    {/* Informasi jasa */}
                    <div className="flex flex-col gap-1">
                        <span className="text-label text-ink">
                            Nama Jasa
                        </span>

                        <span className="text-body text-ink-muted">
                            {memuat
                                ? "Memuat nama jasa..."
                                : namaJasa || "-"}
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
                            Penilaian{" "}
                            <span className="text-danger">*</span>
                        </span>

                        <RatingInput
                            nilai={n}
                            onUbah={(nilai) => {
                                setN(nilai);
                                setEN("");
                            }}
                            disabled={done || busy}
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
                        disabled={done || busy}
                    />

                    {/* Dokumentasi */}
                    <UploadBox
                        label="Dokumentasi (opsional)"
                        format={FORMAT_BERKAS}
                        maksMB={MAX_MB}
                        maksBerkas={MAKS_BERKAS}
                        berkas={files}
                        onUbah={setF}
                        disabled={done || busy}
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
                            disabled={
                                busy ||
                                memuat ||
                                !namaJasa ||
                                !!umum
                            }
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
