"use client";
import {useEffect,useState} from "react";
import {Alert,Button,PageHero,RatingInput,TabFilter} from "@/components/elemen";
import {cn} from "@/lib/cn";
import {formatRupiah} from "@/lib/format";
import {Transaksi,getTransaksi} from "@/services/layanan";
const TAB=["Semua","Berjalan","Selesai","Dikembalikan"] as const;
type Tab=typeof TAB[number];
const S={berjalan:["Sedang dikerjakan penyedia","text-brand-text","Lihat pesanan","secondary"],cek:["Hasil sudah dikirim, cek & konfirmasi","text-ink","Cek hasil","accent"],selesai:["Pesanan selesai","text-success","Pesan lagi","primary"],dikembalikan:["Ditolak penyedia · dana dikembalikan","text-danger","Lihat pesanan","secondary"]} as const;
export default function HalamanRiwayatTransaksi(){
 const [d,setD]=useState<Transaksi[]|null>(null),[err,setErr]=useState(""),[tab,setTab]=useState<Tab>("Semua"),[ok,setOk]=useState(false);
 useEffect(()=>{setOk(location.search.includes("bayar=sukses"));getTransaksi().then(setD).catch(()=>setErr("Gagal memuat riwayat transaksi."))},[]);
 const all=d??[],jalan=(t:Transaksi)=>t.status==="berjalan"||t.status==="cek";
 const list=all.filter(t=>tab==="Semua"||(tab==="Berjalan"?jalan(t):tab==="Selesai"?t.status==="selesai":t.status==="dikembalikan"));
 const stat=[["Total transaksi",String(all.length)],["Sedang berjalan",String(all.filter(jalan).length)],["Total pengeluaran",formatRupiah(all.filter(t=>t.status!=="dikembalikan").reduce((s,t)=>s+t.harga,0))]];
 return <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-8 md:px-20">
  {ok&&<Alert tipe="success">Pembayaran berhasil! Pesananmu sudah diteruskan ke penyedia jasa.</Alert>}
  {err&&<Alert>{err}</Alert>}
  <PageHero judul="Riwayat Transaksi"/>
  <div className="grid gap-4 md:grid-cols-3">{stat.map(([k,v])=><section key={k} className="flex flex-col gap-1 rounded-xl border border-line bg-surface px-6 py-5"><span className="text-body-sm text-ink-muted">{k}</span><span className="text-h3 text-ink">{v}</span></section>)}</div>
  <TabFilter opsi={TAB} nilai={tab} onUbah={setTab}/>
  {!d&&!err&&<p className="text-body text-ink-muted">Memuat…</p>}
  {d&&!list.length&&<section className={cn("rounded-xl border border-line bg-surface p-6","py-12 text-center text-body text-ink-muted")}>Belum ada transaksi{tab!=="Semua"&&" pada kategori ini"}.</section>}
  {list.map(t=>{const [l,c,a,v]=S[t.status];return <div key={t.id} className="overflow-hidden rounded-xl border border-line bg-surface">
   <div className={cn("flex items-center justify-between gap-4 p-6",t.status==="berjalan"&&"bg-accent-subtle")}>
    <div className="flex flex-col gap-1"><span className="text-caption text-ink-muted">[TANGGAL], [JAM]</span><h3 className="text-h4 text-ink">{t.judul}</h3><span className={cn("text-label",c)}>{l}</span><span className="text-caption text-ink-muted">#TRX-{t.id} · {t.penyedia}</span></div>
    <div className="flex flex-col items-end gap-3"><span className="text-label text-ink">{formatRupiah(t.harga)}</span><Button variant={v} href={t.status==="selesai"?"/jasa":`/hasil/${t.id}`}>{a}</Button></div></div>
   {t.status==="selesai"&&<div className="flex items-center gap-3 bg-brand-subtle px-6 py-3"><span className="text-label text-ink">{t.rating?"Rating kamu":"Ditunggu ratingnya!"}</span>{t.rating?<RatingInput nilai={t.rating} onUbah={()=>{}} disabled ukuran={20}/>:<Button variant="accent" href={`/ulasan/${t.id}`} className="h-9 px-4">Beri ulasan</Button>}</div>}
  </div>})}</div>}
