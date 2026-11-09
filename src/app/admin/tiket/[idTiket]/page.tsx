"use client";

import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import {Alert,Button,LampiranBukti,PageHero,Select,Textarea} from "@/components/elemen";
import {cn} from "@/lib/cn";
import {Tiket,ajukanMediasi,getTiket,kirimTanggapan} from "@/lib/layanan";

const SANKSI=["Peringatan","Suspend sementara","Blokir akun","Tanpa sanksi"].map(s=>({value:s,label:s}));

// C50: detail | validasi (tanggapan & sanksi wajib) | mediasi diajukan | selesai | tiket tidak ditemukan

export default function HalamanPengajuanMediasi(){
 const {idTiket}=useParams<{idTiket:string}>();
 const [t,setT]=useState<Tiket|null|undefined>(undefined),[tg,setTg]=useState(""),[sk,setSk]=useState(""),[eT,setET]=useState(""),[eS,setES]=useState(""),[err,setErr]=useState(""),[info,setInfo]=useState(""),[busy,setB]=useState<""|"kirim"|"mediasi">("");

 useEffect(()=>{getTiket(idTiket).then(setT).catch(()=>{setT(null);setErr("Gagal memuat tiket.")})},[idTiket]);

 if(t===undefined)return <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20"><p className="text-body text-ink-muted">Memuat…</p></div>;

 if(t===null)return <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20"><Alert>{err||"Tiket tidak ditemukan."}</Alert></div>;

 const tutup=t.status==="Selesai";

 async function kirim(){
  setErr("");
  setInfo("");
  setET(tg.trim()?"":"Tanggapan wajib diisi.");
  setES(sk?"":"Pilih jenis sanksi.");
  if(!tg.trim()||!sk)return;

  setB("kirim");
  try{
   await kirimTanggapan(idTiket,{tanggapan:tg,sanksi:sk});
   setT({...t!,status:"Selesai"});
   setInfo("Tanggapan terkirim. Tiket ditandai selesai.")
  }catch{
   setErr("Gagal mengirim tanggapan.")
  }
  setB("")
 }

 async function mediasi(){
  setErr("");
  setInfo("");
  setB("mediasi");
  try{
   await ajukanMediasi(idTiket);
   setT({...t!,status:"Mediasi"});
   setInfo("Mediasi diajukan. Lanjutkan di Ruang Mediasi.")
  }catch{
   setErr("Gagal mengajukan mediasi.")
  }
  setB("")
 }

 return <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
  <PageHero judul={t.id} penuh/>
  {err&&<Alert>{err}</Alert>}
  {info&&<Alert tipe="success">{info}</Alert>}

  <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
   <section className={cn("rounded-xl border border-line bg-surface p-6","flex flex-col gap-5")}>
    <h2 className="text-h4 text-ink">Detail Laporan</h2>

    <div className="grid gap-4 sm:grid-cols-3">
     {[["Pelapor",t.pelapor],["Terlapor",t.terlapor],["Kategori",t.kategori]].map(([k,v])=><div key={k}>
      <p className="text-body-sm text-ink-muted">{k}</p>
      <p className="text-body text-ink">{v}</p>
     </div>)}
    </div>

    <div>
     <p className="text-body-sm text-ink-muted">Deskripsi Masalah</p>
     <p className="text-body text-ink">{t.deskripsi}</p>
    </div>

    <div className="flex flex-col gap-2">
     <p className="text-body-sm text-ink-muted">Bukti</p>
     <LampiranBukti tipe="berkas" nama="bukti-transaksi.pdf" keterangan="Dokumen PDF" hrefLihat="#"/>
    </div>
   </section>

   <section className={cn("rounded-xl border border-line bg-surface p-6","flex flex-col gap-4")}>
    <h2 className="text-h4 text-ink">Tanggapan Admin</h2>

    <Textarea
     placeholder="Berikan tanggapan terhadap laporan pengguna"
     value={tg}
     onChange={ev=>setTg(ev.target.value)}
     error={eT}
     disabled={tutup}
     aria-label="Tanggapan admin"
    />

    <Select
     label="Jenis Sanksi"
     placeholder="Pilih Sanksi"
     opsi={SANKSI}
     value={sk}
     onChange={ev=>setSk(ev.target.value)}
     error={eS}
     disabled={tutup}
    />

    <Button
     variant="secondary"
     fullWidth
     loading={busy==="mediasi"}
     disabled={tutup||t.status==="Mediasi"||!!busy}
     onClick={mediasi}
    >
     {t.status==="Mediasi"?"Mediasi berjalan":"Mediasi"}
    </Button>
   </section>
  </div>

  <Button
   variant="accent"
   className="self-start"
   loading={busy==="kirim"}
   disabled={tutup||!!busy}
   onClick={kirim}
  >
   {tutup?"Terkirim":"Kirim"}
  </Button>
 </div>
}