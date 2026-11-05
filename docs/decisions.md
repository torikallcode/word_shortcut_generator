# Decisions and deviations

## D001 — T0 Windows fixture received; macOS fixture still missing

The T0 drop zone now contains a Windows Word 2021 before/after pair:

```text
fixtures/win/2021/before/Normal.dotm
fixtures/win/2021/after/Normal.dotm
fixtures/win/2021/notes.md
```

T2 and T3 are unblocked for Windows. The PRD's T0 completion criterion also requires one pair
per platform, so macOS remains blocked. Consequences:

- Windows `.dotm` generation is enabled.
- `buildNormalDotm` throws `FixturesRequiredError` for `platform: "mac"`; the summary page
  explains this and keeps JSON export available.
- The macOS Templates folder in the guide is still provisional.

## D002 — Packaging pipeline

`buildNormalDotm` implements the ordered pipeline from PRD section 15: schema validation →
platform/combo gate → conflict gate → missing-target gate → base-package validation →
customizations rendering → DEFLATE ZIP Blob.

The real renderer is covered by `tests/integration/fixtureMatch.test.ts`, which compares the
generated `word/customizations.xml` byte-for-byte with the Word 2021 fixture for the same
seven keymaps.

## D003 — Base package uses explicit raw imports

`_rels/.rels` starts with a dot, and Vite's `import.meta.glob` skips dotfiles. The base package
therefore imports each of the 17 parts explicitly with `?raw`.

The MVP package is XML-only, so text imports are sufficient. If a future base package contains
images or thumbnails, switch those parts to `?url` and read them as binary.

## D004 — Guide folder paths are provisional

Windows: `%AppData%\Microsoft\Templates`
macOS: `~/Library/Group Containers/UBF8T346G9.Office/User Content/Templates`

The Windows path is the standard location but was not captured in `notes.md`; the macOS path
cannot be verified without a Mac fixture. A development-only note is shown in the UI.

## D005 — Browser-blocked combinations live in data

`src/data/browser-blocked.json` lists combinations the browser may swallow (Ctrl+W/T/N/R/L/D,
Cmd+Q/W/T/N/R/L, Ctrl+Tab). This is browser behavior, not a Word fact. It is informational
only: manual key entry still allows export.

## D006 — FR-11 (remove built-in shortcuts) is deferred

Removing a Word default requires writing an explicit "unassigned" keymap entry. The fixture
contains no example of that encoding, so it is not guessed. The schema can add a
`disabledDefaults` field with a version bump once a fixture demonstrates it.

## D007 — Open XML SDK validation is wired

`tools/OpenXmlValidator` is a .NET 9 console app using `DocumentFormat.OpenXml`. CI generates
the sample file, restores the package from nuget.org, and validates it. Local result:

```text
PASS fixtures/generated/Normal.dotm
```

## D008 — HashRouter

Static hosting (Cloudflare Pages/Vercel) without server rewrites is simpler with `HashRouter`.
No backend is used, and no user data leaves the browser.

## D009 — Toolchain note

The environment had no pnpm and `corepack enable` could not write to `C:\Program Files\nodejs`.
pnpm 12.16.1 was installed through the user npm prefix. pnpm 12 blocks dependency build
scripts by default; `pnpm-workspace.yaml` allows only `esbuild`.

## D010 — Accessibility of key capture

The capture box ignores `Tab` and `Escape` so keyboard users can leave the dialog. `Tab` can
still be assigned through the manual dropdown. The dialog closes on `Escape`, traps focus,
and restores focus to the trigger when closed.

## D011 — Fixture has seven keymaps, notes list five

`fixtures/win/2021/notes.md` lists five shortcuts, but the after file contains seven keymaps:
`Ctrl+B` and `Ctrl+Shift+B` are also mapped to `Bold`. Per the PRD, the fixture wins. The
generator emits only the bindings present in the config. `Ctrl+B` is included in
`default-shortcuts.json` so the editor warns before overwriting it.

## D012 — Style index comes from `w:latentStyles` order

`wne:acd/@wne:argValue` is `01 00 00 00` plus a little-endian uint16 index. The fixture shows
Heading 1 → 1 and Heading 2 → 2, exactly matching the zero-based order of `w:lsdException`
entries in `word/styles.xml`. The generator resolves every catalog style from that list in the
base package (Normal=0 … Quote=180) instead of hardcoding indices.

Heading 1/2 are confirmed by the byte-for-byte fixture test. The other indices are derived from
the same fixture list and must be confirmed in the T4 Word test.

## D013 — Base package sanitized

The fixture's `docProps/core.xml` contained the author's name and the glossary contained
personal AutoText entries (a signature and initials). `scripts/build-base-package.mjs`
removes AutoText docParts (`w:gallery="autoTxt"`) and clears `dc:creator` /
`cp:lastModifiedBy`. Default AutoCorrect entries are kept.

## D014 — Catalog scope for this increment

Only commands directly evidenced by the fixture are in `commands.json`:

- `Bold`
- `InsertHyperlink`
- `TableInsertTable`

The style catalog covers Normal, Heading 1–9, Title, Subtitle, Quote, Caption, and List
Paragraph. The PRD's T4 target of ~100 popular commands cannot be met from this fixture alone;
more command names must come from additional Word fixtures or an approved official list.

## D015 — macOS generation is refused

The Windows fixture proves `Shift=0x01`, `Ctrl=0x02`, `Alt=0x04`. There is no evidence for the
Command flag or for whether the Mac package differs. Generating Mac files now would be a
guess, so `buildNormalDotm` throws `FixturesRequiredError` for macOS until a Mac pair is added.

## D016 — Generated sample for the T4 human checkpoint

`pnpm sample:generate` writes `fixtures/generated/Normal.dotm` with the five shortcuts from
`notes.md`. `fixtures/generated/` is gitignored. The file passes the Open XML SDK validator
and is the artifact to open in Word for the T4 checkpoint. See `docs/manual-test.md`.

## D017 — Skripsi preset scope locked (4 November 2026)

The 25-item thesis preset is approved with these decisions (see
`docs/PRD-Preset-Skripsi-Akademik.md` §0):

- **One press, no dialogs.** Non-style actions use VBA macros, not assisted dialogs.
- **Macros are allowed.** Phase 2 files are macro-enabled and must show a security warning.
- **Custom styles and numbering are allowed.**
- **Headings use `Ctrl+Alt+1–9`.** The preset marks the Word-default conflicts for
  `Ctrl+Alt+1–3` as intentional overrides. Non-heading items use `Ctrl+Alt+Shift+…`.
- **Caption chapter number comes from Heading 1.**
- **Roman numerals for front matter, Arabic for the body**, using a section break.
- **Indonesian caption labels**: Gambar, Tabel, Lampiran.
- **Windows Word 2021 first**; macOS remains gated on a Mac fixture.

Phase 1 ships 10 ready style bindings (Normal + Heading 1–9) plus the 25-item roadmap in the
UI. The other 15 items are marked `needs-macro`/`needs-fixture` and are not exported.

The agent cannot author a valid `vbaProject.bin` without Word. T0b must contain a
Word-created macro project, three representative macro bindings, and the custom
styles/numbering sample. The VBA source is in `macros/SkripsiShortcuts.bas`; instructions are
in `macros/README.md`.
