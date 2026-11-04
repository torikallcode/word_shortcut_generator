# Base package parts (T0 fixture output)

These 17 parts come from `fixtures/win/2021/after/Normal.dotm` (Windows Word 2021). Do not
hand-edit them; regenerate with:

```bash
pnpm base:build
```

The script removes `word/customizations.xml` and sanitizes personal metadata/AutoText. Task T2
transcribes the structure into `docs/ooxml-spec.md`. The parts are:

- `[Content_Types].xml` (must declare the macro-enabled template main content type and the
  customizations override)
- `_rels/.rels`
- `word/document.xml`
- `word/styles.xml`
- `word/settings.xml`
- `word/_rels/document.xml.rels` (must reference `word/customizations.xml`)
- `docProps/*`

`word/customizations.xml` is **not** copied: the generator writes it from user bindings.

`src/data/basePackage.ts` imports each part explicitly with Vite's `?raw` loader. A glob cannot
be used because `_rels/.rels` is a dotfile and globs skip it.
