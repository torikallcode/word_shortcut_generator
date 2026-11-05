# PRD: Preset Shortcut Skripsi/Akademik (25 Item)

Status: **Disetujui — scope dikunci 4 November 2026; menunggu fixture T0b berisi macro**
Tanggal: 4 November 2026
Terkait: `PRD Word Shortcut Builder (Generator Normal.dotm).md`, `docs/ooxml-spec.md`, `docs/decisions.md`

## 0. Addendum Keputusan (4 November 2026)

Q1–Q9 sudah dijawab dan menjadi acuan implementasi:

| #   | Keputusan                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------- |
| Q1  | **Satu tekan tanpa dialog.** Item yang tidak bisa satu tekan harus memakai macro, bukan assisted.          |
| Q2  | **Macro/VBA diizinkan.** File menjadi macro-enabled dan wajib diberi peringatan keamanan.                  |
| Q3  | **Normal.dotm boleh memuat style kustom dan numbering.**                                                   |
| Q4  | **Angka bab caption diambil dari Heading 1**, format `X.Y`.                                                |
| Q5  | **Non-BAB** = style untuk halaman seperti DAFTAR ISI / KATA PENGANTAR: sejajar BAB tetapi tanpa nomor bab. |
| Q6  | **Romawi untuk bagian awal, Arab untuk isi.** Perlu section break.                                         |
| Q7  | **Heading memakai `Ctrl+Alt+1–9`.** Shortcut lain memakai `Ctrl+Alt+Shift+...` agar tidak bentrok.         |
| Q8  | **Label caption Bahasa Indonesia**: Gambar, Tabel, Lampiran.                                               |
| Q9  | **Windows Word 2021 dulu**; macOS menyusul setelah ada fixture Mac.                                        |

Konsekuensi teknis:

- Semua 25 item harus one-press, jadi 15 item non-style akan dijalankan oleh **macro VBA**.
- `Ctrl+Alt+1–3` bentrok dengan shortcut bawaan Word; preset harus menandai konflik itu
  sebagai **Timpa** secara otomatis.
- Agent tidak dapat membuat `vbaProject.bin` yang valid tanpa Word. Fixture T0b dari manusia
  wajib berisi proyek macro yang sudah dibuat Word. Modul VBA disediakan di
  `macros/SkripsiShortcuts.bas`.
- Style kustom dan numbering harus disalin dari fixture Word; tidak boleh ditebak.

## 1. Ringkasan

Fitur ini menambahkan satu preset siap pakai berisi 25 shortcut untuk penulisan skripsi,
tesis, atau disertasi: heading BAB/sub-BAB, caption gambar/tabel/lampiran, daftar isi,
daftar gambar/tabel/lampiran, penomoran halaman, nomor romawi, dan copy/paste format.

**Temuan penting sebelum implementasi:** dari 25 item, baru **10 item** yang benar-benar
dapat dihasilkan sebagai keymap murni dengan fixture dan generator saat ini (Normal + Heading
1–9). Dua item berikutnya (Copy/Paste Format) kemungkinan besar bisa setelah nama perintah
internalnya diverifikasi. Sisanya membutuhkan kemampuan baru:

- **5 item** membutuhkan perintah dengan argumen/field (daftar isi, daftar gambar/tabel/
  lampiran, halaman otomatis).
- **8 item** membutuhkan setup dokumen, style kustom, atau macro (caption 1 digit/2 digit,
  nomor romawi, style Non-BAB).

PRD ini memetakan setiap item, mengusulkan shortcut, dan membagi pekerjaan ke fase yang
tidak melanggar aturan produk saat ini: **tanpa backend, tanpa upload, dan tanpa macro**
(kecuali aturan itu secara eksplisit diubah).

## 2. Tujuan dan Metrik Keberhasilan

**Tujuan**

- Pengguna dapat menerapkan 25 shortcut skripsi dalam satu klik dari halaman beranda.
- Setiap item memiliki status kesiapan yang jujur: siap, perlu verifikasi, perlu setup,
  atau perlu macro.
- Item yang sudah didukung benar-benar bekerja di Word desktop; item yang belum didukung
  tidak diekspor diam-diam.
- Format skripsi menjadi konsisten tanpa mengatur satu per satu lewat Customize Keyboard.

| Metrik                                                           | Target                              |
| ---------------------------------------------------------------- | ----------------------------------- |
| Waktu menerapkan preset sampai daftar shortcut tampil            | ≤ 30 detik                          |
| Shortcut siap pakai pada rilis fase 1                            | 10 dari 25 (Normal + Heading 1–9)   |
| Shortcut siap pakai setelah macro + template layer               | 25 dari 25                          |
| Shortcut yang terbukti aktif di Word 2021 Windows                | 100% dari item yang ditandai "siap" |
| File hasil generator lolos Open XML SDK dan terbuka tanpa repair | 100%                                |
| Item yang gagal tanpa penjelasan                                 | 0                                   |
| Teks UI tersedia dalam Indonesia dan Inggris                     | 100%                                |

## 3. Ruang Lingkup

| Fase                     | Termasuk                                                                                                            | Tidak termasuk                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Fase 1 — Preset inti     | 10 style (Normal, H1–H9), UI preset 25 item + badge, konflik Ctrl+Alt+1–3, simpan/muat JSON                         | Daftar isi, caption, nomor romawi         |
| Fase 2 — Macro one-press | Modul VBA 25 aksi, injeksi `vbaProject.bin`, keymap target macro, daftar isi/gambar/tabel/lampiran, halaman, romawi | Style kustom dan numbering                |
| Fase 3 — Template layer  | Style Non-BAB, numbering BAB/sub-BAB, caption label Indonesia, format caption 1 digit/2 digit, integrasi penuh 25   | Perubahan di luar Normal.dotm             |
| Keamanan                 | Peringatan macro, dokumentasi, dan opsi untuk tidak memakai macro                                                   | Menyembunyikan status macro dari pengguna |

**Di luar cakupan:** Word web/mobile, Google Docs, sinkronisasi cloud, berbagi preset
komunitas.

## 4. Pemetaan 25 Item

Level:

- **A** = style/perintah tanpa argumen; dapat memakai generator saat ini.
- **B** = perintah/field dengan argumen atau dialog; perlu fixture baru (T0b) dan kemungkinan
  perubahan renderer.
- **C** = butuh setup dokumen, style kustom, numbering, atau macro; perlu keputusan scope.

| #   | Item                           | Shortcut usulan  | Level | Catatan                                                                         |
| --- | ------------------------------ | ---------------- | ----- | ------------------------------------------------------------------------------- |
| 1   | Normal                         | Ctrl+Alt+Shift+N | A     | Style `Normal`, index laten 0                                                   |
| 2   | BAB / H1                       | Ctrl+Alt+Shift+1 | A     | Style `heading 1`, index 1                                                      |
| 3   | Sub BAB / H2                   | Ctrl+Alt+Shift+2 | A     | Style `heading 2`, index 2                                                      |
| 4   | Sub-sub BAB / H3               | Ctrl+Alt+Shift+3 | A     | Style `heading 3`                                                               |
| 5   | H4                             | Ctrl+Alt+Shift+4 | A     | Style `heading 4`                                                               |
| 6   | H5                             | Ctrl+Alt+Shift+5 | A     | Style `heading 5`                                                               |
| 7   | H6                             | Ctrl+Alt+Shift+6 | A     | Style `heading 6`                                                               |
| 8   | H7                             | Ctrl+Alt+Shift+7 | A     | Style `heading 7`                                                               |
| 9   | H8                             | Ctrl+Alt+Shift+8 | A     | Style `heading 8`                                                               |
| 10  | H9                             | Ctrl+Alt+Shift+9 | A     | Style `heading 9`                                                               |
| 11  | Selevel BAB / Non-BAB          | Ctrl+Alt+Shift+0 | C     | Perlu style kustom outline level 1 tanpa numbering; definisi perlu dikonfirmasi |
| 12  | Daftar isi otomatis            | Ctrl+Alt+Shift+T | B     | Butuh field TOC (`\o "1-3" \h \z \u`) atau perintah dengan argumen              |
| 13  | Caption Gambar 1 digit         | Ctrl+Alt+Shift+G | C     | Format `Gambar 1, 2, 3`; butuh label/numbering atau macro                       |
| 14  | Caption Gambar 2 digit (X.Y)   | Ctrl+Alt+Shift+H | C     | Format `Gambar 1.1`; butuh include chapter number atau macro                    |
| 15  | Daftar Gambar                  | Ctrl+Alt+Shift+L | B     | Table of figures label `Gambar`                                                 |
| 16  | Caption Tabel 1 digit          | Ctrl+Alt+Shift+J | C     | Format `Tabel 1, 2, 3`                                                          |
| 17  | Caption Tabel 2 digit (X.Y)    | Ctrl+Alt+Shift+K | C     | Format `Tabel 1.1`                                                              |
| 18  | Daftar Tabel                   | Ctrl+Alt+Shift+U | B     | Table of figures label `Tabel`                                                  |
| 19  | Caption Lampiran 1 digit       | Ctrl+Alt+Shift+M | C     | Format `Lampiran 1, 2, 3`                                                       |
| 20  | Caption Lampiran 2 digit (X.Y) | Ctrl+Alt+Shift+P | C     | Format `Lampiran 1.1`                                                           |
| 21  | Daftar Lampiran                | Ctrl+Alt+Shift+O | B     | Table of figures label `Lampiran`; numbering A/B/C perlu keputusan              |
| 22  | Halaman otomatis               | Ctrl+Alt+Shift+F | B     | Insert page number; kursor harus di header/footer                               |
| 23  | Nomor Romawi                   | Ctrl+Alt+Shift+R | C     | Section page number format; butuh macro/argumen + section break                 |
| 24  | Copy Format                    | Ctrl+Alt+Shift+C | A/B   | Kandidat perintah format painter; nama fciName perlu verifikasi                 |
| 25  | Paste Format                   | Ctrl+Alt+Shift+V | A/B   | Idem                                                                            |

Rekap: **10 A pasti**, **2 A setelah verifikasi**, **5 B**, **8 C**.

## 5. Shortcut: Prinsip dan Alternatif

**Prinsip yang diusulkan**

- Semua shortcut memakai tiga modifier `Ctrl+Alt+Shift` (Windows) / `Command+Option+Shift`
  (macOS) agar tidak bentrok dengan shortcut bawaan Word.
- Tidak memakai kombinasi yang direbut browser (Ctrl+W, Ctrl+T, Ctrl+N, dan sejenisnya).
- Setiap shortcut tetap dapat diubah pengguna di editor.

**Alternatif konvensional (opsional)**

Jika pengguna lebih suka shortcut Word standar, sediakan varian:

- H1–H3: `Ctrl+Alt+1..3` (bentrok dengan bawaan Word; pengguna harus memilih Timpa).
- Copy/Paste Format: `Ctrl+Shift+C` / `Ctrl+Shift+V` (bawaan Word).
- Normal: `Ctrl+Shift+N` (bawaan Word).

PRD merekomendasikan varian bebas konflik sebagai default preset.

## 6. Alur Pengguna

1. Pengguna membuka beranda dan memilih **Preset Skripsi**.
2. Muncul pratinjau 25 item, dikelompokkan: Heading, Caption, Daftar, Halaman, Format.
3. Setiap item menampilkan badge:
   - **Siap** — akan langsung diekspor.
   - **Perlu verifikasi** — menunggu fixture perintah; belum diekspor.
   - **Perlu setup** — akan disertai checklist pengaturan dokumen.
   - **Perlu macro** — hanya jika opsi macro disetujui.
4. Pengguna menekan **Terapkan preset**; 10–12 binding siap ditambahkan tanpa konflik.
5. Pengguna dapat mengubah atau menghapus shortcut per item.
6. Di halaman ringkasan, item yang belum didukung ditampilkan terpisah dengan alasannya;
   file hanya berisi item yang siap, atau pengguna memilih menunggu fase berikutnya.
7. Panduan pemasangan dan checklist setup ditampilkan sebelum unduh.

## 7. Kebutuhan Fungsional

| ID     | Kebutuhan                                                                                | Prioritas |
| ------ | ---------------------------------------------------------------------------------------- | --------- |
| FR-S01 | Preset `skripsi` berisi 25 item dengan nama, grup, shortcut, target, dan status kesiapan | P0        |
| FR-S02 | Terapkan preset dengan satu klik; idempoten (menerapkan ulang tidak menduplikasi)        | P0        |
| FR-S03 | Badge kesiapan per item: `ready`, `needs-verification`, `needs-setup`, `needs-macro`     | P0        |
| FR-S04 | Deteksi konflik untuk seluruh 25 shortcut; preset default bebas konflik                  | P0        |
| FR-S05 | Item yang belum didukung tidak diekspor diam-diam; alasan ditampilkan                    | P0        |
| FR-S06 | Ubah/hapus binding per item setelah preset diterapkan                                    | P0        |
| FR-S07 | Simpan/muat konfigurasi preset sebagai JSON                                              | P0        |
| FR-S08 | Checklist setup dokumen untuk item C (label caption, numbering, section break)           | P1        |
| FR-S09 | Dukungan target `field`/`command` berargumen setelah spike T0b                           | P1        |
| FR-S10 | Dukungan style kustom dan numbering di base package (template layer)                     | P2        |
| FR-S11 | Dukungan macro VBA hanya jika scope diubah dan pengguna menyetujui                       | P2        |
| FR-S12 | Semua teks UI, badge, dan checklist tersedia dalam Indonesia dan Inggris                 | P0        |

## 8. Model Data yang Diusulkan

Preset saat ini hanya berisi `bindings`. Untuk fitur ini, tambahkan metadata tanpa memaksa
perubahan config:

```ts
type PresetItemReadiness = 'ready' | 'needs-verification' | 'needs-setup' | 'needs-macro';

interface PresetItem {
  id: string;
  group: 'heading' | 'caption' | 'list' | 'page' | 'format';
  name: { id: string; en: string };
  combo: KeyCombo;
  target: Target;
  readiness: PresetItemReadiness;
  setupKey?: string; // kunci checklist, mis. 'caption-labels'
}

interface ThesisPreset extends Preset {
  items: PresetItem[];
}
```

Jika Fase 2/3 disetujui, `Target` diperluas:

```ts
type Target =
  | { kind: 'command'; commandId: string }
  | { kind: 'style'; styleId: string }
  | { kind: 'field'; fieldId: string; instruction: string } // Fase 2
  | { kind: 'macro'; macroId: string }; // Fase 3
```

Perubahan `Target` memerlukan **Config versi 2** dan migrasi dari versi 1. File versi lama
tetap harus dapat dimuat.

## 9. Perubahan Teknis per Fase

### Fase 1 — Preset inti (dapat dikerjakan sekarang)

- Tambah `src/data/presets/skripsi.json` dengan 25 item dan status.
- Tambah helper `applyPreset` yang idempoten.
- UI: kartu preset, grup, badge, pratinjau keyboard.
- Katalog: style Normal + Heading 1–9 sudah ada.
- Verifikasi dua perintah format painter melalui fixture T0b sebelum menandainya `ready`.
- Ekspor hanya item `ready`.

**Kriteria selesai:** preset menambahkan minimal 10 binding style tanpa konflik; file lolos
validator; item non-ready terlihat sebagai roadmap, bukan error.

### Fase 2 — Perintah berargumen / field

- Lakukan spike T0b: buat fixture Word dengan shortcut untuk daftar isi, daftar gambar,
  daftar tabel, daftar lampiran, dan halaman otomatis.
- Catat apakah Word menulis argumen di `wne:fci/@wne:swArg`, `wne:acd`, atau bentuk lain.
- Implementasikan renderer untuk bentuk yang terbukti; jangan menebak.
- Jika perintah hanya membuka dialog (bukan menyisipkan otomatis), tandai item sebagai
  **assisted**, bukan **ready**.

**Kriteria selesai:** minimal satu daftar otomatis dan halaman otomatis terbukti di Word;
perilaku assisted/otomatis terdokumentasi.

### Fase 3 — Template layer / style kustom

- Tambahkan style kustom `Non-BAB` (outline level 1, tanpa numbering) ke `styles.xml`.
- Tambahkan caption label dan numbering bila didukung fixture.
- Jika `word/numbering.xml` diperlukan, tambahkan part, relationship, dan content type baru;
  validasi dengan Open XML SDK.
- Caption 1 digit vs 2 digit: pilih salah satu:
  - dua label caption dengan setting berbeda (jika Word mendukung per label),
  - field `SEQ` dengan switch berbeda,
  - macro.
- Nomor romawi: butuh section page-number format; macro atau perintah berargumen.

**Kriteria selesai:** style Non-BAB dan minimal satu varian caption bekerja di Word;
tidak ada perubahan tak terduga pada style lain.

### Opsi 4 — Macro (hanya jika disetujui)

- Menambahkan `vbaProject.bin` ke paket dan macro untuk TOC/caption/roman.
- Mengubah janji produk: file menjadi macro-enabled dan dapat memicu peringatan keamanan.
- Wajib ada peringatan UI, dokumentasi keamanan, dan persetujuan pengguna.
- **Tidak dikerjakan tanpa keputusan eksplisit.**

## 10. Spike yang Wajib Sebelum Fase 2

Buat fixture baru (T0b) di Word 2021 Windows dan Mac bila memungkinkan:

1. Daftar isi otomatis.
2. Daftar gambar, daftar tabel, daftar lampiran.
3. Insert caption untuk label Gambar, Tabel, Lampiran.
4. Insert page number.
5. Format page number → romawi.
6. Copy format dan paste format.

Untuk setiap item, catat:

- nama `wne:fciName` persis dari dialog Customize Keyboard,
- apakah ada `swArg`/argumen dan isinya,
- apakah Word menulis `wne:acd`,
- perbedaan Windows vs Mac.

Kandidat nama perintah yang akan diuji (bukan spesifikasi): `TableOfContentsInsert`,
`InsertTableOfFigures`, `InsertCaption`, `InsertPageNumber`, `FormatPageNumber`,
`FormatPainterCopy`, `FormatPainterPaste`. Nama-nama ini **belum diverifikasi** dan tidak
boleh dipakai sebelum fixture membuktikannya.

## 11. Risiko dan Mitigasi

| Risiko                                                   | Dampak                                       | Mitigasi                                                      |
| -------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| 13 dari 25 item tidak bisa otomatis dalam scope saat ini | Ekspektasi pengguna tidak terpenuhi          | Badge kesiapan, roadmap, dan penjelasan sebelum unduh         |
| Nama perintah internal tidak diketahui                   | Salah target, shortcut tidak bekerja         | Spike T0b; jangan menebak                                     |
| Argumen perintah/field tidak dapat dienkode lewat keymap | Daftar otomatis tidak bisa satu tekan        | Fallback assisted (buka dialog) atau macro dengan persetujuan |
| Caption 1 digit vs 2 digit adalah setting dokumen        | Dua shortcut tidak bisa membedakan format    | Template layer, label terpisah, atau macro                    |
| Nomor romawi membutuhkan section break                   | Shortcut saja tidak cukup                    | Checklist setup + macro/argumen                               |
| Style Non-BAB tidak ada di Word bawaan                   | Tidak bisa dipetakan ke style yang ada       | Tambahkan style kustom di template layer                      |
| AltGr di layout tertentu                                 | Ctrl+Alt+Shift bisa menghasilkan karakter    | Gunakan tiga modifier, sediakan editor shortcut               |
| Macro mengubah janji keamanan produk                     | Peringatan macro, kepercayaan pengguna turun | Jangan aktifkan default; butuh persetujuan                    |
| Mac belum punya fixture                                  | Encoding Command tidak diketahui             | Tetap nonaktifkan ekspor Mac                                  |

## 12. Rencana Tugas

| ID  | Tugas                                                             | Keluaran                                 | Bergantung |
| --- | ----------------------------------------------------------------- | ---------------------------------------- | ---------- |
| S0  | Setujui PRD dan keputusan Q1–Q9                                   | Dokumen ini disetujui                    | —          |
| S1  | Tulis modul VBA 25 aksi                                           | `macros/SkripsiShortcuts.bas`            | S0         |
| S2  | Data preset 25 item + badge + UI Fase 1                           | `skripsi.json`, schema, UI               | S0         |
| S3  | Implementasi Fase 1: 10 style, override otomatis Ctrl+Alt+1–3     | Preset 10 binding siap                   | S2         |
| S4  | **Human T0b**: import `.bas`, buat proyek macro, style/numbering, | `fixtures/win/2021b/` + `.bas` + catatan | S1         |
|     | bind 3 macro perwakilan, simpan Normal.dotm                       |                                          |            |
| S5  | Transkrip encoding keymap macro + style/numbering                 | `docs/ooxml-spec.md` diperbarui          | S4         |
| S6  | Injeksi `vbaProject.bin` + keymap target macro                    | Fase 2 (23 item siap)                    | S5         |
| S7  | Template layer: Non-BAB, numbering, caption label                 | Fase 3 (25 item siap)                    | S5         |
| S8  | Uji manual Word 2021 + rilis                                      | Laporan matriks                          | S3, S6, S7 |

## 13. Kriteria Penerimaan

- Preset dapat diterapkan dan menampilkan 25 item dengan grup dan badge yang benar.
- Tidak ada binding duplikat; `Ctrl+Alt+1–3` otomatis ditandai Timpa.
- Item `ready` benar-benar bekerja di Word 2021 Windows.
- Item `needs-*` tidak diekspor diam-diam dan alasannya terlihat.
- Semua 25 item bekerja **satu tekan tanpa dialog** setelah Fase 2/3 selesai.
- File hasil ekspor lolos Open XML SDK dan terbuka tanpa repair.
- File yang memuat macro menampilkan peringatan keamanan sebelum diunduh.
- Simpan/muat JSON menghasilkan konfigurasi yang identik.
- Semua teks tersedia dalam Indonesia dan Inggris.

## 14. Keputusan dan Hal yang Masih Perlu Dibuktikan

Keputusan produk sudah dikunci di §0 (Q1–Q9). Tidak ada pertanyaan produk yang tersisa.
Yang masih perlu dibuktikan adalah fakta teknis dari Word:

1. **Encoding keymap untuk macro.** Bagaimana Word menulis target macro di
   `word/customizations.xml` (`wne:fci`, `wne:acd`, atau bentuk lain). Jawabannya hanya bisa
   diperoleh dari fixture T0b.
2. **Struktur `vbaProject.bin`.** Agent tidak dapat membuat file OLE/VBA yang valid tanpa
   Word; fixture T0b harus menyediakannya.
3. **Numbering BAB/sub-BAB.** Skema persisnya (BAB I, A, 1, …) harus disalin dari style dan
   `numbering.xml` hasil Word, bukan ditebak.
4. **Perilaku field caption.** Apakah `STYLEREF 1 \s` menghasilkan angka bab yang diinginkan,
   dan apakah `SEQ ... \s 1` mereset per bab. Diuji di Word.
5. **Section roman/Arab.** Perilaku `PageNumbers.NumberStyle` dan section break di Word 2021.
6. **Ukuran dan validitas paket dengan `vbaProject.bin`.** Harus lolos Open XML SDK dan
   dibuka Word tanpa repair.

## 15. Rekomendasi Eksekutif

1. **Kerjakan Fase 1 sekarang**: preset 25 item (10 siap + 15 roadmap), 10 style shortcut,
   override otomatis `Ctrl+Alt+1–3`. Ini tidak terblokir fixture.
2. **Sediakan modul VBA** `macros/SkripsiShortcuts.bas` untuk diimpor ke Word.
3. **Minta fixture T0b** dari manusia: macro project + 3 macro perwakilan + style/numbering.
   Tanpa `vbaProject.bin`, 15 item sisanya tidak dapat dibuat tanpa menebak.
4. **Setelah T0b**: implementasikan injeksi macro, keymap macro, dan template layer; lalu uji
   matriks Word 2021.
5. **Tampilkan peringatan macro** di UI dan dokumentasi. Jangan menyembunyikan bahwa file
   hasil unduhan kini macro-enabled.

---

Status implementasi saat ini: Fase 1 sedang dikerjakan. Fase 2/3 menunggu fixture T0b.
