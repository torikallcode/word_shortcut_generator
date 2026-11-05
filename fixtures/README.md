# T0 fixture drop zone (human + Microsoft Word)

Task T0 in the PRD is a **human checkpoint**: the agent cannot run Word and must not guess
OOXML facts. Please provide real `Normal.dotm` files here.

## Current status

| Platform | Fixture | Status |
| --- | --- | --- |
| Windows | `win/2021/{before,after}/Normal.dotm` | Received; transcribed in `docs/ooxml-spec.md` |
| macOS | — | **Missing**; macOS generation is disabled |

The Windows fixture contains the five requested shortcuts plus two extra Bold keymaps
(`Ctrl+B`, `Ctrl+Shift+B`) that Word persisted. This is recorded in `docs/decisions.md`.

For the next increment, provide:

1. A macOS pair with the same five shortcuts.
2. More command names (`wne:fciName`) for the PRD's ~100-command catalog target.
3. **T0b macro fixture** for the 25-item Skripsi preset (see below).

## T0b — Macro and style fixture (Skripsi preset)

The 15 non-style items need a Word-created macro project; the agent cannot build a valid
`vbaProject.bin`. Use `macros/SkripsiShortcuts.bas` and follow `macros/README.md`.

Put the result under:

```text
fixtures/win/2021b/
  before/Normal.dotm          # macro-free template before changes
  after/Normal.dotm           # macro project + 3 representative macro shortcuts
  SkripsiShortcuts.bas        # exported module
  sample-styles.docx          # custom styles/numbering/caption/roman-arabic sample
  notes.md                    # Word build + steps + shortcuts assigned
```

Minimum representative shortcuts to bind:

- `SkripsiDaftarIsi` → `Ctrl+Alt+Shift+T`
- `SkripsiCaptionGambar2` → `Ctrl+Alt+Shift+H`
- `SkripsiNomorRomawi` → `Ctrl+Alt+Shift+R`

That is enough to learn how Word encodes macro targets and how it stores custom
styles/numbering. The remaining 22 items reuse the same pattern.

## Minimum required set

For **each** platform (Windows and macOS) and **each** Word version you want to support
(2016, 2019, 2021, 365), add a before/after pair:

```text
fixtures/
  win/
    2016/
      before/Normal.dotm      # untouched template after first Word launch
      after/Normal.dotm       # same template with the 5 shortcuts below
      notes.md                # exact Word build + steps taken
    2019/
    ...
  mac/
    2016/
    ...
```

If you only have one version per platform right now, that is enough to start T2; add the
rest before T12.

## The 5 shortcuts to set in the "after" file

1. `Ctrl+Alt+1` (Windows) / `Command+Option+1` (macOS) → **Heading 1** style
2. `Ctrl+Alt+2` / `Command+Option+2` → **Heading 2** style
3. `Ctrl+Alt+B` / `Command+Option+B` → **Bold** command
4. `Ctrl+Alt+K` / `Command+Option+K` → **InsertHyperlink** command
5. `Ctrl+Alt+T` / `Command+Option+T` → **InsertTable** command

Set these through Word's **File > Options > Customize Ribbon > Keyboard shortcuts**
(Windows) or **Tools > Customize Keyboard** (macOS). Record the exact command names Word
shows in the "Commands" list — that internal name is what the generator needs.

## What T2 will extract

- Exact XML in `word/customizations.xml`, including element/attribute names and namespaces.
- How modifier flags and virtual key codes are encoded.
- How Styles are referenced (style name, style id, or both).
- The `[Content_Types].xml` override and the `word/_rels/document.xml.rels` relationship.
- Any version/platform differences.

## Privacy

`Normal.dotm` may contain personal AutoText, styles, or macros. Use a clean Word profile or
open the file as a ZIP and remove unrelated parts before committing fixtures. Only the parts
listed in `docs/ooxml-spec.md` are needed.

Do **not** commit fixtures containing confidential company content.
