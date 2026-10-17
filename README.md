# TOPUPKU — Situs Top Up Game (versi tampilan)

Front-end statis untuk toko top up game. Murni HTML + CSS + JavaScript, tanpa framework dan tanpa build.

> **Status: DEMO.** Pembayaran dan pengiriman item belum aktif. Data transaksi hanya disimpan di `localStorage` browser.

## Fitur
- Beranda dengan pencarian game dan daftar game populer
- Halaman order: ID akun, pilih nominal, metode bayar, nomor WhatsApp, ringkasan harga
- Invoice dan Cek Transaksi (berdasarkan nomor invoice, di perangkat yang sama)
- FAQ
- Tampilan mobile-first, tema gelap

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
| `style.css` | Seluruh gaya |
| `app.js` | Data game, router, halaman, alur order |

## Ganti nama toko dan data
- Nama toko: cari `TOPUPKU` di `index.html` dan `app.js`
- Game, nominal, dan harga: array `GAMES` di `app.js` (harga masih contoh)
- Metode bayar dan biaya admin: array `PAY` di `app.js`

## Agar jadi toko sungguhan
Yang masih perlu dibuat:
1. **Backend dan database** untuk menyimpan order, user, dan saldo
2. **Supplier produk via API** (misalnya Digiflazz atau VIP Reseller) untuk proses top up otomatis
3. **Payment gateway** (Tripay, Midtrans, atau Xendit) untuk QRIS, e-wallet, dan VA, lengkap dengan webhook konfirmasi
4. **Validasi ID game** lewat API supplier
5. **Halaman legal**: syarat dan ketentuan, kebijakan privasi
6. Login/daftar dan panel admin (opsional)

Kunci API supplier dan payment **jangan** ditaruh di front-end. Simpan di server (environment variable).

## Catatan
Logo dan nama game milik masing-masing penerbit. Ikon di situs ini hanya emoji, bukan logo resmi.