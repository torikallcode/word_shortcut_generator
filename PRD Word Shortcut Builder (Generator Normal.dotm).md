# PRD: Word Shortcut Builder (Generator Normal.dotm)

Nov 3, 2026 · @Albar

## 1. Ringkasan

Word Shortcut Builder adalah situs web yang membuat file Normal.dotm berisi shortcut keyboard kustom. Pengguna cukup mengatur shortcut di browser, mengunduh file, lalu menaruhnya di folder Templates Word; shortcut langsung aktif tanpa mengatur satu per satu lewat menu Customize Keyboard.

**Masalah.** Mengatur shortcut di Word (File > Options > Customize Ribbon > Keyboard shortcuts) dilakukan satu perintah demi satu perintah. Prosesnya lambat, sulit dipindahkan ke komputer lain, dan sulit diseragamkan untuk satu tim atau kantor.

**Proposisi nilai.** Editor shortcut visual dengan katalog perintah, deteksi konflik, dan preset, yang menghasilkan file Normal.dotm siap pakai. Seluruh proses berjalan di browser, sehingga tidak ada dokumen atau template pengguna yang dikirim ke server.

## 2. Tujuan dan Metrik Keberhasilan

**Tujuan**

- Pengguna dapat membuat dan mengunduh Normal.dotm berisi shortcut kustom dalam hitungan menit, tanpa keahlian teknis.
- File hasil unduh dapat dipakai langsung di Word desktop tanpa pesan error atau perbaikan.
- Pengguna dapat menyimpan dan memuat ulang konfigurasi shortcut untuk komputer lain.

**Bukan tujuan (MVP)**

- Mengubah definisi style, tampilan ribbon, atau isi dokumen di Normal.dotm selain shortcut.
- Mendukung Word untuk web atau aplikasi mobile.
- Membuat atau menyisipkan macro VBA.

| Metrik | Target |
| --- | --- |
| File terbuka di Word 2016, 2019, 2021, dan 365 (Windows dan Mac) tanpa error | 100% pada uji rilis |
| Shortcut yang diatur benar-benar aktif setelah pemasangan | ≥ 95% perintah di katalog MVP |
| Waktu dari membuka situs sampai file terunduh (10 shortcut) | ≤ 3 menit |
| File pengguna yang dikirim ke server | 0 |

## 3. Target Pengguna

| Persona | Kebutuhan utama |
| --- | --- |
| Mahasiswa, dosen, dan peneliti | Shortcut cepat untuk heading, caption, sitasi, dan daftar saat menulis skripsi atau jurnal |
| Penulis, editor, dan staf administrasi | Shortcut untuk format yang dipakai berulang (style, tabel, komentar, track changes) |
| Admin TI atau kepala tim | Satu konfigurasi shortcut yang seragam dan mudah dibagikan ke banyak komputer |
| Power user Word | Memindahkan kebiasaan shortcut ke komputer baru atau setelah instal ulang |

## 4. Ruang Lingkup

MVP mencakup Word desktop di Windows dan Mac (2016, 2019, 2021, 365), shortcut untuk perintah bawaan dan Style bawaan Word, serta antarmuka dua bahasa; hal lain masuk fase berikutnya.

| Fase | Termasuk |
| --- | --- |
| MVP | Word desktop Windows dan Mac (2016, 2019, 2021, 365), shortcut untuk perintah bawaan dan Style bawaan, antarmuka Indonesia dan Inggris, deteksi konflik, preset, ekspor Normal.dotm baru, panduan instalasi per sistem operasi, simpan dan muat konfigurasi (JSON) |
| Fase 2 | Mode gabung (unggah Normal.dotm lama, shortcut disisipkan tanpa mengubah isi lain), shortcut untuk AutoText dan simbol, shortcut dua tahap, cheat sheet cetak |
| Fase 3 | Shortcut untuk macro (VBA), akun gratis dan penyimpanan cloud, tautan berbagi konfigurasi, preset komunitas |
| Di luar cakupan | Word untuk web dan mobile, Google Docs, kustomisasi ribbon dan toolbar |

## 5. User Stories

- Sebagai penulis skripsi, saya ingin menetapkan Ctrl+Alt+1, 2, 3 untuk Heading 1 sampai 3 agar tidak perlu memakai mouse saat menyusun bab.
- Sebagai pengguna, saya ingin mencari perintah Word berdasarkan nama atau kategori agar tidak perlu hafal nama internalnya.
- Sebagai pengguna, saya ingin diperingatkan jika kombinasi tombol sudah dipakai perintah lain agar tidak menimpa shortcut penting tanpa sadar.
- Sebagai pengguna, saya ingin memilih preset (misalnya penulisan akademik) lalu mengubahnya sesuai selera agar tidak mulai dari nol.
- Sebagai admin kantor, saya ingin satu file Normal.dotm yang bisa disalin ke semua komputer agar shortcut tim seragam.
- Sebagai pengguna, saya ingin menyimpan konfigurasi shortcut ke file agar bisa dimuat lagi dan diubah nanti.
- Sebagai pengguna awam, saya ingin panduan pemasangan langkah demi langkah agar file hasil unduh benar-benar aktif di Word.

## 6. Kebutuhan Fungsional

P0 wajib ada di MVP, P1 menyusul sebelum rilis publik, P2 fase berikutnya.

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-01 | Katalog perintah Word: daftar perintah bawaan yang bisa dicari, dikelompokkan per kategori (Format, Paragraf, Review, Tabel, dan seterusnya), dengan nama dan deskripsi singkat dalam Indonesia dan Inggris | P0 |
| FR-02 | Penetapan shortcut: pengguna menekan kombinasi tombol langsung di kolom input; situs menampilkannya dalam format Word (misalnya Ctrl+Alt+1) dan menyediakan input manual lewat dropdown | P0 |
| FR-03 | Deteksi konflik: peringatan jika kombinasi bentrok dengan shortcut bawaan Word atau shortcut lain yang sudah diatur; pengguna memilih menimpa atau batal | P0 |
| FR-04 | Pembuatan Normal.dotm baru di browser dari template dasar yang valid, berisi semua shortcut yang diatur | P0 |
| FR-05 | Ringkasan sebelum unduh: jumlah shortcut, konflik yang ditimpa, dan peringatan bahwa file akan menggantikan Normal.dotm lama | P0 |
| FR-06 | Panduan pemasangan untuk Windows dan Mac: lokasi folder Templates, cara membackup file lama, menutup Word, dan membuka blokir file unduhan | P0 |
| FR-07 | Shortcut untuk Style bawaan Word (Normal, Heading 1 sampai 9, Title, Subtitle, Quote, Caption, List Paragraph, dan sejenisnya) | P0 |
| FR-08 | Antarmuka dua bahasa (Indonesia dan Inggris) dengan pengalih bahasa; semua teks UI, panduan, dan pesan error tersedia di keduanya | P0 |
| FR-09 | Preset shortcut siap pakai (penulisan akademik, penerbitan, dokumen hukum) yang bisa diubah | P1 |
| FR-10 | Simpan dan muat konfigurasi sebagai file JSON | P1 |
| FR-11 | Menghapus atau menonaktifkan shortcut bawaan Word yang tidak diinginkan | P1 |
| FR-12 | Mode gabung: unggah Normal.dotm lama, situs hanya menyisipkan shortcut dan membiarkan style, AutoText, dan macro tetap utuh | P2 |
| FR-13 | Shortcut dua tahap (kombinasi pertama diikuti tombol kedua) dan shortcut untuk AutoText dan simbol | P2 |
| FR-14 | Cheat sheet shortcut yang bisa dicetak atau diekspor ke PDF | P2 |
| FR-15 | Akun gratis, penyimpanan cloud, dan tautan berbagi konfigurasi | P2 |

## 7. Alur Pengguna

1. Pengguna membuka situs dan memilih mulai dari kosong, dari preset, atau memuat konfigurasi JSON.
2. Pengguna mencari perintah di katalog, lalu menekan kombinasi tombol yang diinginkan.
3. Situs memeriksa konflik dan menampilkan peringatan bila ada; pengguna memutuskan menimpa atau mengganti kombinasi.
4. Pengguna meninjau daftar shortcut di halaman ringkasan, lalu menekan Unduh Normal.dotm (opsional: simpan konfigurasi JSON).
5. Situs membuat file di browser dan memulai unduhan.
6. Pengguna menutup Word, membackup Normal.dotm lama, dan menyalin file baru ke folder Templates sesuai panduan (di Windows: %AppData%\\Microsoft\\Templates).
7. Pengguna membuka Word dan mencoba shortcut baru; jika tidak aktif, panduan pemecahan masalah menunjukkan penyebab umum (file terblokir, Word belum ditutup, salinan file di lokasi lain).

## 8. Pendekatan Teknis

Normal.dotm adalah arsip ZIP berformat Office Open XML, jadi dapat dibuat dan diubah langsung di browser tanpa server. Shortcut disimpan di bagian khusus dalam arsip itu, bukan di registry Windows.

**Struktur file yang dihasilkan**

- Paket OOXML minimum: \[Content\_Types\].xml, \_rels/.rels, word/document.xml, word/styles.xml, word/settings.xml, dan docProps.
- Tipe konten dokumen utama harus tipe template berkemampuan macro (application/vnd.ms-word.template.macroEnabledTemplate.main+xml) agar dikenali sebagai .dotm.
- Shortcut disimpan di word/customizations.xml (elemen keymap dengan kode tombol dan nama perintah), dan harus didaftarkan lewat relationship di word/\_rels/document.xml.rels serta Content\_Types.

**Arsitektur MVP**

- Aplikasi web statis (tanpa backend) dengan JSZip untuk membuat arsip dan pembuat XML sendiri untuk customizations.xml.
- Katalog perintah dan tabel shortcut bawaan Word disimpan sebagai data JSON yang diversikan per versi Word.
- Konfigurasi pengguna disimpan di localStorage dan dapat diekspor ke JSON.

**Spike teknis wajib sebelum pengembangan (1 sampai 2 hari)**

1. Di Word asli (Windows dan Mac), atur 3 shortcut perintah dan 2 shortcut Style, simpan, lalu buka Normal.dotm sebagai ZIP dan catat persis isi customizations.xml, relationship, dan content type.
2. Bangun file yang sama secara manual dari nol, lalu pastikan Word membukanya tanpa pesan perbaikan dan shortcut aktif.
3. Petakan nama perintah internal Word (nama untuk bagian fci) dan cara menautkan Style ke katalog yang tampil di UI; ini menentukan seberapa besar katalog MVP.
4. Uji perilaku saat Normal.dotm diganti ketika Word tertutup, termasuk file yang diberi tanda blokir oleh Windows.
5. Pastikan file yang sama dapat dipakai di Word Windows dan Mac; jika tidak, catat perbedaannya agar generator menghasilkan varian per sistem operasi.

Detail format di atas berasal dari pengetahuan umum tentang OOXML; nama elemen, atribut, dan kode tombol harus diverifikasi lewat spike ini sebelum dijadikan spesifikasi final.

## 9. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
| --- | --- |
| Privasi | Semua pemrosesan di browser; tidak ada unggahan file ke server; analitik hanya agregat dan tanpa isi konfigurasi |
| Kompatibilitas | Word 2016, 2019, 2021, dan Microsoft 365 desktop di Windows dan Mac; browser Chrome, Edge, Firefox, dan Safari versi terbaru |
| Keandalan file | File lolos validasi struktur OOXML (misalnya Open XML SDK Validator) dan diuji manual di Word sebelum tiap rilis |
| Performa | Katalog dengan ratusan perintah tetap responsif; pembuatan file di bawah 2 detik |
| Keamanan | Tanpa macro atau kode aktif di MVP; file hanya berisi data shortcut sehingga aman dari peringatan macro |
| Aksesibilitas | Seluruh editor dapat dioperasikan dengan keyboard, kontras memadai, kompatibel dengan screen reader |
| Bahasa | Antarmuka Bahasa Indonesia dan Inggris sejak MVP, dengan semua teks disimpan di file terjemahan terpisah; nama perintah mengikuti nama Word versi Inggris dengan padanan Indonesia bila ada |

## 10. Kebutuhan UI/UX

Antarmuka berupa satu halaman editor dengan tiga langkah yang jelas: pilih, atur, unduh.

| Halaman atau area | Isi |
| --- | --- |
| Beranda | Penjelasan satu kalimat, tombol Mulai dari kosong, Pakai preset, dan Muat konfigurasi |
| Editor (area utama) | Kiri: katalog perintah dengan pencarian dan filter kategori. Tengah: daftar shortcut yang sudah diatur, bisa diedit atau dihapus. Kanan: pratinjau keyboard visual yang menyorot tombol yang dipakai |
| Peringatan konflik | Muncul di tempat saat pengguna menekan kombinasi, menyebut perintah yang bertabrakan dan menawarkan Timpa atau Ganti |
| Ringkasan dan unduh | Daftar akhir shortcut, peringatan penggantian Normal.dotm, tombol Unduh Normal.dotm dan Simpan konfigurasi |
| Panduan pemasangan | Langkah bergambar per sistem operasi, lokasi folder dengan tombol salin, dan bagian pemecahan masalah |

Prinsip: bahasa sederhana, tidak ada istilah teknis OOXML di UI, dan setiap peringatan menyebut tindakan yang bisa dilakukan pengguna.

## 11. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| File Normal.dotm baru menggantikan yang lama, sehingga style, AutoText, dan macro pengguna hilang | Tinggi | Peringatan jelas sebelum unduh, instruksi backup di panduan, dan mode gabung (FR-10) sebagai prioritas setelah MVP |
| Format customizations.xml berbeda antar versi Word atau tidak sesuai dugaan | Tinggi | Spike teknis di awal dan uji otomatis dan manual di tiap versi Word yang didukung |
| Word menolak atau memperbaiki file buatan sendiri | Tinggi | Validasi OOXML otomatis, paket minimum yang meniru file asli Word, dan uji sebelum rilis |
| Windows memblokir file unduhan (tanda Mark of the Web) sehingga template tidak dimuat | Sedang | Panduan Unblock di Properties file dan bagian pemecahan masalah |
| Pengguna memakai Word web atau lokasi file berbeda, atau lokasi Templates di Mac berbeda antar versi | Sedang | Batasan didokumentasikan di beranda; deteksi sistem operasi dan tampilkan peringatan |
| Nama perintah internal Word sulit dipetakan lengkap | Sedang | Mulai dari katalog perintah populer (±100) dan tambah bertahap |
| Kombinasi tombol yang ditangkap browser (misalnya Ctrl+W, Ctrl+T) tidak dapat dibaca situs | Rendah | Pilihan input manual lewat dropdown modifier dan tombol |

## 12. Roadmap dan Kriteria Penerimaan

| Tahap | Isi | Kriteria selesai |
| --- | --- | --- |
| 0. Spike teknis | Bedah file Normal.dotm asli di Windows dan Mac, bangun file minimum secara manual | Word membuka file buatan manual tanpa pesan perbaikan dan 3 shortcut perintah serta 2 shortcut Style aktif |
| 1. MVP inti | FR-01 sampai FR-08 | File dari situs aktif di Word 2016 dan 365 (Windows dan Mac); pengguna baru memasang file sendiri hanya dengan panduan; UI lengkap dalam dua bahasa |
| 2. Rilis publik | FR-09 sampai FR-11, pengujian pengguna | Metrik keberhasilan di bagian 2 tercapai pada uji dengan minimal 10 pengguna; uji di Word 2019 dan 2021 lulus |
| 3. Mode gabung | FR-12 | File lama pengguna tetap utuh (style dan macro tidak berubah) setelah shortcut disisipkan |
| 4. Perluasan | FR-13 sampai FR-15, macro | Ditentukan setelah data penggunaan dan umpan balik rilis publik |

**Kriteria penerimaan inti.** Pengguna yang belum pernah membuka menu Customize Keyboard dapat membuat file, memasangnya, dan memakai minimal 10 shortcut baru di Word dalam waktu 10 menit tanpa bantuan.

## 13. Pertanyaan Terbuka

Lima pertanyaan sebelumnya sudah diputuskan dan sudah diterapkan di dokumen ini.

| Pertanyaan | Keputusan |
| --- | --- |
| Normal.dotm baru atau mode gabung di MVP | Cukup membuat Normal.dotm baru; mode gabung menjadi FR-12 (Fase 2) |
| Versi Word dan platform | Semua versi (2016, 2019, 2021, 365), Windows dan Mac sejak MVP |
| Shortcut untuk Style | Perlu, masuk MVP (FR-07) |
| Bahasa antarmuka | Indonesia dan Inggris sejak awal (FR-08) |
| Model bisnis | Gratis penuh, termasuk akun dan berbagi konfigurasi di fase berikutnya |

**Masih terbuka**

- [ ] Siapa yang menyediakan dan memelihara data perintah dan shortcut bawaan Word per versi dan platform? (Usulan: dibuat dari hasil spike dan disimpan sebagai file JSON di repositori.)

## 14. Aturan dan Keputusan Teknis untuk AI Agent

Bagian 14 sampai 17 adalah spesifikasi implementasi. AI agent membaca seluruh dokumen, lalu mengerjakan tugas di bagian 16 secara berurutan.

**Aturan kerja**

- Agent tidak memiliki Microsoft Word. Semua fakta format (nama elemen XML, kode tombol, nama internal perintah dan Style) wajib berasal dari file contoh di folder `fixtures/` yang disediakan manusia pada tugas T0. Agent tidak boleh menebak.
- Jika isi fixture bertentangan dengan PRD, fixture yang benar; catat selisihnya di `docs/decisions.md`.
- Satu tugas dianggap selesai hanya jika kriteria selesainya terpenuhi dan semua tes otomatis lulus.
- Agent berhenti dan meminta manusia menguji di Word pada tiga titik: T0 (mengumpulkan fixture), akhir T4 (file buatan generator dibuka di Word), dan akhir T12 (uji akhir).
- Tidak ada backend, tidak ada pengiriman data pengguna ke server, dan tidak ada macro atau VBA di file yang dihasilkan.
- Setiap teks yang tampil di UI harus lewat file terjemahan (Indonesia dan Inggris); tidak ada teks UI yang ditulis langsung di komponen.

**Keputusan teknis (tetap, jangan diganti tanpa alasan tertulis)**

| Aspek | Pilihan |
| --- | --- |
| Bahasa | TypeScript mode strict |
| Framework dan build | Vite dengan React 18, pnpm, Node 20 atau lebih baru |
| Styling | Tailwind CSS |
| Pembuatan arsip ZIP | JSZip |
| Pembuatan XML | Template string dengan escape karakter khusus; fast-xml-parser hanya dipakai di tes untuk membaca hasil |
| Validasi data | Zod |
| State | Zustand, disimpan ke localStorage |
| Terjemahan | react-i18next dengan berkas `id.json` dan `en.json`; bahasa awal mengikuti bahasa browser |
| Tes unit dan integrasi | Vitest |
| Tes end-to-end | Playwright |
| Validasi OOXML di CI | Open XML SDK Validator (dotnet) untuk file hasil generator |
| Hosting | Situs statis (Cloudflare Pages atau Vercel), tanpa fungsi server |

**Struktur repositori**

```text
word-shortcut-builder/
  fixtures/            file hasil spike (Normal.dotm asli dan hasil bedahnya)
  docs/                ooxml-spec.md, decisions.md
  src/
    domain/            tipe, skema Zod, aturan konflik
    generator/         pembuat customizations.xml dan paket .dotm
    data/              commands.json, styles.json, default-shortcuts.json, keycodes.json, presets/
    i18n/              id.json, en.json
    ui/                komponen dan halaman
    store/             state aplikasi
  tests/               unit, integrasi, e2e
```

## 15. Model Data dan Algoritma

**Tipe data inti** (disimpan di `src/domain/types.ts`; skema Zod yang setara di `schema.ts`)

```ts
type Platform = 'win' | 'mac';
type Modifier = 'ctrl' | 'alt' | 'shift' | 'cmd';

interface KeyCombo { modifiers: Modifier[]; key: string } // key = KeyboardEvent.code, mis. 'Digit1', 'KeyB', 'F5'

type Target =
  | { kind: 'command'; commandId: string }
  | { kind: 'style'; styleId: string };

interface ShortcutBinding { id: string; combo: KeyCombo; target: Target }

interface Command {
  id: string;
  wordName: string;            // nama internal Word, dari fixture
  category: string;
  name: { id: string; en: string };
  description: { id: string; en: string };
  platforms: Platform[];
}

interface Config { version: 1; platform: Platform; bindings: ShortcutBinding[] }
```

**Algoritma pembuatan file** (fungsi `buildNormalDotm(config): Promise<Blob>`)

1. Validasi `config` dengan skema Zod; hentikan dengan error terstruktur jika tidak valid.
2. Jalankan pemeriksaan konflik; konflik yang belum diputuskan pengguna menghentikan proses.
3. Terjemahkan setiap binding menjadi elemen keymap memakai `keycodes.json` (kode tombol dan modifier) serta `commands.json` dan `styles.json` (nama target). Semua kamus ini diisi dari fixture T0, bukan dari tebakan.
4. Tulis `word/customizations.xml`, lalu tambahkan relationship di `word/_rels/document.xml.rels` dan entri di `[Content_Types].xml` persis seperti pada fixture.
5. Salin bagian paket lain dari template dasar (`src/data/base-package/`, diambil dari fixture).
6. Susun ZIP dengan kompresi DEFLATE, kembalikan `Blob` bertipe `application/vnd.ms-word.template.macroEnabledTemplate.12`, nama berkas `Normal.dotm`.

**Aturan deteksi konflik** (fungsi murni di `src/domain/conflicts.ts`)

- Dua binding dengan kombinasi yang sama = konflik antar-pengguna; UI meminta pengguna menghapus salah satunya.
- Binding yang sama dengan entri di `default-shortcuts.json` (per platform) = konflik dengan bawaan Word; UI menampilkan perintah bawaan itu dan meminta Timpa atau Ganti.
- Kombinasi yang tidak bisa ditangkap browser (misalnya Ctrl+W, Ctrl+T, Cmd+Q) tidak boleh diharapkan lewat penangkapan tombol; UI menawarkan input manual lewat dropdown.

**Format berkas konfigurasi**

Berkas JSON dengan bidang `version`, `platform`, dan `bindings` sesuai tipe `Config`. Berkas dengan `version` yang tidak dikenal ditolak dengan pesan error dua bahasa; berkas yang merujuk perintah yang tidak ada di katalog dimuat sebagian dan perintah yang hilang dilaporkan ke pengguna.

## 16. Rencana Tugas Implementasi

Kerjakan berurutan; kolom Bergantung menunjukkan tugas yang harus selesai lebih dulu. Tugas bertanda manusia memerlukan Microsoft Word dan tidak bisa dikerjakan agent sendiri.

| ID | Tugas | Keluaran | Kriteria selesai | Bergantung |
| --- | --- | --- | --- | --- |
| T0 | Spike (manusia): di Word Windows dan Mac, atur 3 shortcut perintah dan 2 shortcut Style, simpan Normal.dotm, kirim ke agent | Folder `fixtures/` berisi Normal.dotm asli dan salinan sebelum perubahan, per platform dan versi Word | Ada minimal satu pasang file (sebelum dan sesudah) per platform | - |
| T1 | Menyiapkan proyek: Vite, React, TypeScript strict, Tailwind, Vitest, Playwright, i18n, lint, CI | Repositori yang bisa `pnpm dev`, `pnpm test`, `pnpm build` | Ketiga perintah berjalan tanpa error di CI | - |
| T2 | Membedah fixture: bandingkan file sebelum dan sesudah, dokumentasikan struktur | `docs/ooxml-spec.md` berisi nama elemen, relationship, content type, kode tombol, dan penautan Style | Dokumen cukup rinci untuk menulis generator tanpa melihat Word; setiap klaim merujuk berkas fixture | T0 |
| T3 | Pembuat paket: menghasilkan .dotm dari template dasar dan daftar binding | `buildNormalDotm` dan tes yang membandingkan hasil dengan fixture (struktur XML setara) | Tes unit lulus; hasil lolos Open XML SDK Validator | T1, T2 |
| T4 | Pemetaan data: `keycodes.json`, `commands.json`, `styles.json`, `default-shortcuts.json` dari fixture dan dokumentasi resmi Microsoft | Berkas data dengan nama Indonesia dan Inggris | Skema data lulus validasi; minimal 100 perintah populer dan semua Style bawaan; checkpoint: manusia membuka 3 file hasil generator di Word dan shortcut aktif | T2, T3 |
| T5 | Mesin konflik | `src/domain/conflicts.ts` dengan tes | Kasus konflik antar-pengguna, dengan bawaan, dan kombinasi yang tidak bisa ditangkap browser teruji | T4 |
| T6 | Editor: katalog dengan pencarian dan filter, penangkapan tombol, input manual, daftar shortcut, pratinjau keyboard | Halaman editor yang berfungsi | Pengguna dapat menambah, mengubah, dan menghapus binding; peringatan konflik muncul di tempat | T4, T5 |
| T7 | Shortcut Style: tab atau bagian khusus untuk memilih Style bawaan | Binding bertarget `style` bisa dibuat dan diekspor | Hasil ekspor memuat shortcut Style yang aktif di Word (uji manual di akhir T4 diulang untuk Style) | T4, T6 |
| T8 | Terjemahan penuh Indonesia dan Inggris, pengalih bahasa | `id.json`, `en.json`, tes yang memastikan kunci kedua berkas sama | Tidak ada teks UI yang ditulis langsung di komponen; tidak ada kunci yang hilang | T6 |
| T9 | Ringkasan sebelum unduh dan unduhan file | Halaman ringkasan dan tombol unduh | Berkas bernama Normal.dotm terunduh; peringatan penggantian file tampil | T3, T6 |
| T10 | Panduan pemasangan Windows dan Mac, termasuk Unblock dan pemecahan masalah | Halaman panduan dua bahasa dengan tombol salin lokasi folder | Lokasi folder sesuai hasil uji manusia pada T0 | T0, T8 |
| T11 | Preset, simpan dan muat konfigurasi JSON, penghapusan shortcut bawaan | Fitur FR-09 sampai FR-11 | Konfigurasi yang disimpan lalu dimuat menghasilkan file yang identik | T6, T9 |
| T12 | Pengujian menyeluruh dan rilis | Tes E2E Playwright, laporan uji manual di Word 2016, 2019, 2021, 365 (Windows dan Mac), situs terpasang | Semua kriteria di bagian 17 terpenuhi | Semua |

## 17. Pengujian dan Definition of Done

**Pengujian otomatis**

- Unit: konversi KeyCombo ke kode tombol, mesin konflik, validasi skema, pemuatan konfigurasi.
- Integrasi: `buildNormalDotm` menghasilkan ZIP yang bisa dibuka ulang, `customizations.xml` sesuai spesifikasi di `docs/ooxml-spec.md`, hasil lolos Open XML SDK Validator.
- E2E (Playwright): alur lengkap dari memilih perintah, mengatur shortcut, menyelesaikan konflik, sampai mengunduh berkas; diuji dalam bahasa Indonesia dan Inggris.
- Kesetaraan terjemahan: tes gagal jika kunci `id.json` dan `en.json` berbeda.

**Pengujian manual oleh manusia (matriks)**

| Word | Windows | Mac |
| --- | --- | --- |
| 2016 | Wajib | Wajib |
| 2019 | Wajib | Wajib |
| 2021 | Wajib | Wajib |
| Microsoft 365 | Wajib | Wajib |

Pada tiap sel: berkas terbuka tanpa pesan perbaikan, minimal 5 shortcut perintah dan 2 shortcut Style aktif, shortcut bawaan lain tetap berfungsi.

**Definition of Done MVP**

- [ ] Semua tugas T0 sampai T12 selesai dan tes otomatis lulus di CI.
- [ ] Seluruh sel matriks uji manual lulus.
- [ ] Metrik bagian 2 terpenuhi pada uji dengan minimal 10 pengguna.
- [ ] Tidak ada permintaan jaringan yang membawa isi konfigurasi atau berkas pengguna (diperiksa lewat tab Network).
- [ ] Semua teks UI tersedia dalam Indonesia dan Inggris.
- [ ] `docs/ooxml-spec.md` dan `docs/decisions.md` mutakhir.
