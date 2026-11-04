# OOXML specification for generated Normal.dotm

**Status: BLOCKED on T0 fixtures.** This document intentionally does not contain guessed
element names, attribute names, or key codes. The PRD (section 14) forbids inventing them.

## Facts already fixed by the PRD

These are product decisions, not OOXML guesses, and are implemented in
`src/generator/packageStructure.ts`:

| Fact                  | Value                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| Package format        | Office Open XML (ZIP)                                                                                           |
| Main part             | `word/document.xml`                                                                                             |
| Template part         | `word/customizations.xml`                                                                                       |
| Relationship file     | `word/_rels/document.xml.rels`                                                                                  |
| Content types         | `[Content_Types].xml`                                                                                           |
| Main content type     | `application/vnd.ms-word.template.macroEnabledTemplate.main+xml`                                                |
| Blob MIME type        | `application/vnd.ms-word.template.macroEnabledTemplate.12`                                                      |
| Download name         | `Normal.dotm`                                                                                                   |
| Compression           | DEFLATE                                                                                                         |
| Minimum package parts | `[Content_Types].xml`, `_rels/.rels`, `word/document.xml`, `word/styles.xml`, `word/settings.xml`, `docProps/*` |

## Still to be transcribed from fixtures (T2)

Fill every row with a quote from the fixture files in `fixtures/`. Do not fill from memory.

### 1. `word/customizations.xml`

| Item                                             | Fixture evidence | Filled |
| ------------------------------------------------ | ---------------- | ------ |
| Root element name + namespace                    | TBD              | [ ]    |
| Container element name(s)                        | TBD              | [ ]    |
| One entry per shortcut: element name             | TBD              | [ ]    |
| Command target attribute/element                 | TBD              | [ ]    |
| Style target attribute/element                   | TBD              | [ ]    |
| Modifier encoding (Ctrl/Alt/Shift/Cmd)           | TBD              | [ ]    |
| Virtual key code for `Digit1`, `KeyB`, `F5`, …   | TBD              | [ ]    |
| How a cleared/unassigned shortcut is represented | TBD              | [ ]    |
| Attribute ordering / optional attributes         | TBD              | [ ]    |

### 2. `[Content_Types].xml`

Quote the `<Override>` for `word/customizations.xml`:

```text
TBD
```

### 3. `word/_rels/document.xml.rels`

Quote the `<Relationship>` for `word/customizations.xml`:

```text
TBD
```

### 4. Style linkage

How Word maps a keymap entry to a built-in Style (Heading 1, Quote, Caption, …):

```text
TBD
```

### 5. Platform differences

| Difference               | Windows fixture | macOS fixture |
| ------------------------ | --------------- | ------------- |
| Customizations part path | TBD             | TBD           |
| Cmd key encoding         | n/a             | TBD           |
| Relationship target      | TBD             | TBD           |

## How to verify

1. Unzip `before` and `after` fixtures and diff them.
2. Copy the static parts into `src/data/base-package/`.
3. Implement `renderCustomizations` in `src/generator/customizations.ts` from the quoted
   structure.
4. Compare the generated `customizations.xml` structure against the fixture in
   `tests/integration` (use `fast-xml-parser`; it is a dev dependency).
5. Open the generated file in Word on both platforms. This is the T4 checkpoint.
6. Run the Open XML SDK Validator in CI once artifacts exist.
