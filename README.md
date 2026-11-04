# Word Shortcut Builder

A static web app that builds a `Normal.dotm` containing custom Microsoft Word keyboard
shortcuts. All processing happens in the browser: no backend, no uploads, no macros.

This repository implements the PRD in `PRD Word Shortcut Builder (Generator Normal.dotm).md`.

## Status

**Windows Word 2021 generation works end-to-end. The T4 human Word test is the next
checkpoint. macOS generation is blocked on a Mac fixture.**

Implemented:

- Windows `.dotm` generation from the T0 fixture. `word/customizations.xml` matches Word 2021
  byte-for-byte for the fixture's seven keymaps.
- Command shortcuts (`fci`) and Style shortcuts (`acd`) including the latent-style index
  encoding.
- 15 built-in styles and the three commands verified by the fixture (`Bold`,
  `InsertHyperlink`, `TableInsertTable`).
- Conflict detection, keyboard capture/manual input, keyboard preview, bilingual UI, presets,
  JSON save/load, summary, and installation guide.
- Open XML SDK validation of the generated sample.
- macOS configuration works, but `.dotm` generation is refused with an explanation because
  Command-key encoding is not verified.

See `docs/ooxml-spec.md`, `docs/decisions.md`, and `docs/manual-test.md`.

## Requirements

- Node.js 20 or newer
- pnpm 9+ (this repo pins pnpm 12.16.1 via `packageManager`)
- .NET 9 SDK only for the optional Open XML SDK validator

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:5173
pnpm test             # Vitest unit + integration (includes fixture parity)
pnpm test:e2e         # Playwright, including a real .dotm download
pnpm lint
pnpm typecheck
pnpm build

pnpm sample:generate  # writes fixtures/generated/Normal.dotm
pnpm base:build       # rebuild src/data/base-package from the Windows fixture
pnpm keycodes:build   # regenerate src/data/keycodes.json
pnpm fixture:inspect  # dump a .dotm archive
pnpm validate:ooxml   # run the Open XML SDK validator (after restore)
```

Open XML validator setup:

```bash
dotnet restore tools/OpenXmlValidator/OpenXmlValidator.csproj --source https://api.nuget.org/v3/index.json
pnpm validate:ooxml
```

## Structure

```text
fixtures/              T0 fixtures (win/2021 received; mac still needed)
docs/                  ooxml-spec.md, decisions.md, manual-test.md
scripts/               fixture inspection, base-package/keycode generation, sample output
tools/OpenXmlValidator Open XML SDK validator (.NET 9)
src/
  domain/              types, Zod schemas, conflicts, key capture, config I/O
  generator/           packaging, keymap encoding, style indices, customizations renderer
  data/                catalogs, defaults, keycodes, presets, base-package/
  i18n/                id.json, en.json
  store/               Zustand state persisted to localStorage
  ui/                  layout, pages, components
tests/
  unit/                conflicts, key capture, keycodes, config, store, i18n, keymap encoding
  integration/         ZIP round-trip, error gates, byte-for-byte fixture parity
  e2e/                 Playwright flows including generation/download
```

## Next step (human)

Run the T4 checkpoint in `docs/manual-test.md`: copy `fixtures/generated/Normal.dotm` into
Word 2021 and confirm all five shortcuts work without a repair dialog.

Then provide:

1. A macOS before/after pair with the same five shortcuts.
2. More internal command names (`wne:fciName`) for the T4 catalog target of ~100 commands.

## Privacy

No configuration or file content is sent anywhere. Language preference and shortcuts are
stored in `localStorage` only. The fixture-derived base package was sanitized: the author's
name and personal AutoText entries were removed before committing.
