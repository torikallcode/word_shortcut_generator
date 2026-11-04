# Manual Word test — T4 checkpoint

The agent cannot run Microsoft Word. This checklist is the human checkpoint at the end of T4.

## Artifact

Generate the file, then test it:

```bash
pnpm sample:generate
```

File: `fixtures/generated/Normal.dotm`

It contains five shortcuts:

| Shortcut   | Target                   |
| ---------- | ------------------------ |
| Ctrl+Alt+1 | Heading 1 style          |
| Ctrl+Alt+2 | Heading 2 style          |
| Ctrl+Alt+B | Bold command             |
| Ctrl+Alt+K | InsertHyperlink command  |
| Ctrl+Alt+T | TableInsertTable command |

## Procedure

1. Close Word completely.
2. Back up the current `Normal.dotm` in `%AppData%\Microsoft\Templates`.
3. Copy `fixtures/generated/Normal.dotm` into that folder, replacing the old file.
4. If Windows marks the file as blocked: right-click → Properties → Unblock.
5. Open Word and create a new blank document.

## Expected results

- Word opens without a "repair" or "unreadable content" dialog.
- Ctrl+Alt+1 applies Heading 1; Ctrl+Alt+2 applies Heading 2.
- Ctrl+Alt+B applies bold; Ctrl+Alt+K opens the hyperlink dialog; Ctrl+Alt+T opens the
  Insert Table dialog.
- Existing default shortcuts still work (e.g. Ctrl+B for bold, Ctrl+Z undo).

## If a style shortcut fails

The mapping of style name → latent-style index is inferred from `word/styles.xml` and proven
for Heading 1/2. If another style (Title, Quote, Caption, List Paragraph, …) fails, record:

- the style name,
- the generated `wne:keymap` entry and its `wne:acd` argValue,
- whether the style was defined in `styles.xml` or only latent.

That data is the evidence needed to correct the index mapping without guessing.

## Sign-off

- [ ] Windows 2021 opens the file without repair
- [ ] Heading 1 shortcut works
- [ ] Heading 2 shortcut works
- [ ] Bold shortcut works
- [ ] InsertHyperlink shortcut works
- [ ] TableInsertTable shortcut works
- [ ] Built-in shortcuts still work

After this passes, repeat with the Mac fixture when it is available, then run the full matrix
in PRD section 17.
