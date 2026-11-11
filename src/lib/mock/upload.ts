/**
 * MOCK SEMENTARA — tidak benar-benar mengunggah.
 * URL hanya bisa dibuka di tab browser ini; lawan bicara tidak bisa membukanya.
 */
const tunggu = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockUnggahBerkas(berkas: File) {
  await tunggu(500);
  return { url: URL.createObjectURL(berkas), nama: berkas.name };
}