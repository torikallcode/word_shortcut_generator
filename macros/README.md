# Modul VBA Preset Skripsi

File: `SkripsiShortcuts.bas`

Modul ini berisi 25 aksi untuk preset skripsi. Agent tidak dapat membuat
`vbaProject.bin` yang valid tanpa Microsoft Word, jadi modul ini harus diimpor ke Word
sekali oleh manusia untuk menghasilkan fixture T0b.

## 1. Impor modul

1. Buka Word 2021 Windows.
2. Tekan `Alt+F11` untuk membuka VBA Editor.
3. `File > Import File...` lalu pilih `macros/SkripsiShortcuts.bas`.
4. Jalankan `SkripsiSetup` sekali (F5 saat kursor di dalam `SkripsiSetup`) untuk membuat
   style **Non-BAB**.

Jika impor `.bas` bermasalah, buka `SkripsiShortcuts.bas` di Notepad, salin seluruh isinya,
lalu tempel ke modul baru di VBA Editor.

## 2. Buat fixture T0b (yang dikirim ke agent)

Kita hanya perlu **3 macro perwakilan** untuk mempelajari cara Word menulis target macro di
`customizations.xml`. Semua macro lain memakai pola yang sama.

| Macro                      | Shortcut yang diminta |
| -------------------------- | --------------------- |
| `SkripsiDaftarIsi`         | `Ctrl+Alt+Shift+T`    |
| `SkripsiCaptionGambar2`    | `Ctrl+Alt+Shift+H`    |
| `SkripsiNomorRomawi`       | `Ctrl+Alt+Shift+R`    |
| `SkripsiNonBab` (opsional) | `Ctrl+Alt+Shift+0`    |

Langkah:

1. Di Word: `File > Options > Customize Ribbon > Keyboard shortcuts: Customize`.
2. Di kotak **Categories**, pilih **Macros**.
3. Pilih macro, tekan kombinasi di atas, klik **Assign**.
4. Simpan `Normal.dotm`.
5. Salin file hasilnya ke `fixtures/win/2021b/after/Normal.dotm`.
6. Salin juga file sebelum perubahan ke `fixtures/win/2021b/before/Normal.dotm`.
7. Di VBA Editor: `File > Export File...` dan simpan ulang modul sebagai
   `fixtures/win/2021b/SkripsiShortcuts.bas`.
8. Tulis `fixtures/win/2021b/notes.md`: versi Word, langkah, dan shortcut yang dipasang.

## 3. Fixture style dan numbering

Untuk Fase 3, agent perlu contoh style dan numbering asli dari Word:

1. Buat dokumen baru.
2. Atur multilevel list untuk:
   - **BAB / Heading 1** → `BAB I`, `BAB II`, ...
   - **Sub BAB / Heading 2** → `A.`, `B.`, ...
   - **Sub-sub BAB / Heading 3** → `1.`, `2.`, ...
3. Buat/atur style **Non-BAB** (tanpa nomor bab, sejajar BAB) — macro `SkripsiSetup` sudah
   membuat style dasarnya; sesuaikan jika perlu.
4. Buat beberapa caption gambar/tabel/lampiran dengan macro caption, lalu jalankan
   `SkripsiDaftarGambar`, `SkripsiDaftarTabel`, `SkripsiDaftarLampiran`.
5. Buat bagian awal dengan nomor romawi dan bagian isi dengan nomor Arab.
6. Simpan sebagai `fixtures/win/2021b/sample-styles.docx` (bukan `.dotm`), lalu kirim.

## 4. Yang akan diperiksa agent

- Cara `wne:fci`/`wne:acd` mereferensikan macro.
- Apakah macro target ditulis sebagai nama `SkripsiShortcuts.SkripsiDaftarIsi` atau bentuk
  lain.
- Struktur `styles.xml`, `numbering.xml`, `settings.xml`, dan section/page-number properties.
- `vbaProject.bin` yang dihasilkan Word untuk diinjeksikan generator.

## 5. Catatan keamanan

File hasil akhir akan macro-enabled. Setelah Fase 2, UI wajib menampilkan peringatan bahwa
file berisi macro. Jangan menambahkan macro di luar modul ini tanpa persetujuan.
