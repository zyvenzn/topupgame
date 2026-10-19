# NEXORA — Situs Top Up Game (versi tampilan)

Front-end statis untuk toko top up game. Murni HTML + CSS + JavaScript, tanpa framework dan tanpa build.

> **Status: DEMO.** Pembayaran dan pengiriman item belum aktif. Data transaksi hanya disimpan di `localStorage` browser.

## Fitur
- Beranda dengan pencarian game dan filter kategori (Mobile / PC)
- Halaman order: ID akun, pilih nominal, **kode promo (demo)**, metode bayar, nomor WhatsApp, ringkasan harga
- Invoice dan Cek Transaksi (berdasarkan nomor invoice, di perangkat yang sama)
- FAQ
- Tampilan mobile-first, font nyaman dibaca di HP, animasi halus (mati otomatis jika perangkat meminta kurangi gerak)

### Kode promo demo
`NEXORA10` (10%) dan `HEMAT5` (5%). Daftarnya ada di objek `PROMOS` di `app.js`. Ini hanya simulasi di browser, bukan sistem promo sungguhan.

## Cara jalankan
Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
python3 -m http.server 8080
# buka http://localhost:8080
```

Bisa juga di-deploy gratis lewat GitHub Pages atau Vercel (situs statis, tidak perlu pengaturan khusus).

## Struktur
| File | Isi |
|------|-----|
| `index.html` | Kerangka halaman |
| `style.css` | Gaya dasar |
| `polish.css` | Lapisan poles (font, animasi, fokus). Hapus `<link>`-nya untuk balik ke tampilan lama |
| `app.js` | Data game, router, halaman, alur order |
| `assets/` | Gambar logo game (satu file per game: `mlbb.jpg`, `mcgg.jpg`, `ffmax.jpg`, `ff.jpg`, `arena.jpg`, `pubgm.jpg`, `hok.jpg`, `genshin.jpg`, `valo.jpg`) |

## Ganti nama toko dan data
- Nama toko: cari `NEXORA` di `index.html` dan `app.js`
- Game, nominal, dan harga: array `GAMES` di `app.js` (harga masih contoh). Field `cat` (`mobile` / `pc`) menentukan kategori filter
- Metode bayar dan biaya admin: array `PAY` di `app.js`
- Logo: taruh gambar di `assets/` lalu isi field `logo` di `GAMES`. Jika gambar gagal dimuat, otomatis tampil emoji

## Agar jadi toko sungguhan
Yang masih perlu dibuat:
1. **Backend dan database** untuk menyimpan order, user, dan saldo
2. **Supplier produk via API** (misalnya Digiflazz atau VIP Reseller) untuk proses top up otomatis
3. **Payment gateway** (Tripay, Midtrans, atau Xendit) untuk QRIS, e-wallet, dan VA, lengkap dengan webhook konfirmasi
4. **Validasi ID game** lewat API supplier
5. **Halaman legal**: syarat dan ketentuan, kebijakan privasi
6. Login/daftar dan panel admin (opsional)

Kunci API supplier dan payment **jangan** ditaruh di front-end. Simpan di server (environment variable).

## Catatan hak cipta
Logo dan nama game adalah milik masing-masing penerbit dan dipakai di sini hanya sebagai contoh tampilan. Sebelum situs ini dipakai untuk berjualan sungguhan, pastikan izin penggunaan logo/merek, atau ganti dengan ikon sendiri.
