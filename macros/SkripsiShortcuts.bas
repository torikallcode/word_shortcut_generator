Attribute VB_Name = "SkripsiShortcuts"
Option Explicit

' ============================================================================
' Word Shortcut Builder - Preset Skripsi (25 aksi)
' Target: Word 2021 Windows.
'
' Cara pakai:
'   1. Buka Word > Alt+F11 (VBA Editor).
'   2. File > Import File... > pilih SkripsiShortcuts.bas.
'   3. Jalankan SkripsiSetup sekali untuk membuat style Non-BAB.
'   4. Bind macro ke shortcut lewat File > Options > Customize Ribbon >
'      Keyboard shortcuts > Customize. Pilih kategori Macros.
'
' Catatan:
'   - Semua macro bekerja pada Selection (posisi kursor) atau objek terpilih.
'   - Caption 1 digit memakai SEQ biasa; caption 2 digit memakai STYLEREF 1 \s
'     + SEQ ... \s 1 sehingga angka bab diambil dari Heading 1.
'   - SkripsiNomorRomawi mengatur section saat ini ke romawi, menambahkan
'     section break, lalu mengatur section baru ke Arab mulai 1.
' ============================================================================

' ---------------------------------------------------------------------------
' Style
' ---------------------------------------------------------------------------

Public Sub SkripsiNormal()
    ApplyBuiltInStyle wdStyleNormal
End Sub

Public Sub SkripsiHeading1()
    ApplyBuiltInStyle wdStyleHeading1
End Sub

Public Sub SkripsiHeading2()
    ApplyBuiltInStyle wdStyleHeading2
End Sub

Public Sub SkripsiHeading3()
    ApplyBuiltInStyle wdStyleHeading3
End Sub

Public Sub SkripsiHeading4()
    ApplyBuiltInStyle wdStyleHeading4
End Sub

Public Sub SkripsiHeading5()
    ApplyBuiltInStyle wdStyleHeading5
End Sub

Public Sub SkripsiHeading6()
    ApplyBuiltInStyle wdStyleHeading6
End Sub

Public Sub SkripsiHeading7()
    ApplyBuiltInStyle wdStyleHeading7
End Sub

Public Sub SkripsiHeading8()
    ApplyBuiltInStyle wdStyleHeading8
End Sub

Public Sub SkripsiHeading9()
    ApplyBuiltInStyle wdStyleHeading9
End Sub

Public Sub SkripsiNonBab()
    EnsureNonBabStyle
    ApplyParagraphStyleByName "Non-BAB"
End Sub

Private Sub ApplyBuiltInStyle(ByVal style As WdBuiltinStyle)
    On Error GoTo MissingStyle
    Selection.Style = ActiveDocument.Styles(style)
    Exit Sub
MissingStyle:
    MsgBox "Style bawaan tidak tersedia di dokumen ini.", vbExclamation, "Word Shortcut Builder"
End Sub

Private Sub ApplyParagraphStyleByName(ByVal styleName As String)
    On Error GoTo MissingStyle
    Selection.Style = ActiveDocument.Styles(styleName)
    Exit Sub
MissingStyle:
    MsgBox "Style '" & styleName & "' tidak ditemukan. Jalankan SkripsiSetup.", _
        vbExclamation, "Word Shortcut Builder"
End Sub

Public Sub SkripsiSetup()
    EnsureNonBabStyle
End Sub

Private Sub EnsureNonBabStyle()
    Dim doc As Document
    Set doc = ActiveDocument

    Dim existing As Style
    On Error Resume Next
    Set existing = doc.Styles("Non-BAB")
    On Error GoTo 0
    If Not existing Is Nothing Then
        Exit Sub
    End If

    Dim s As Style
    Set s = doc.Styles.Add(Name:="Non-BAB", Type:=wdStyleTypeParagraph)
    s.BaseStyle = doc.Styles(wdStyleNormal)
    s.NextParagraphStyle = doc.Styles(wdStyleNormal)
    s.Font.Name = "Times New Roman"
    s.Font.Size = 14
    s.Font.Bold = True
    s.ParagraphFormat.Alignment = wdAlignParagraphCenter
    s.ParagraphFormat.OutlineLevel = wdOutlineLevel1
    s.ParagraphFormat.SpaceBefore = 12
    s.ParagraphFormat.SpaceAfter = 12
    s.ParagraphFormat.KeepWithNext = True
End Sub

' ---------------------------------------------------------------------------
' Daftar isi dan daftar gambar/tabel/lampiran
' ---------------------------------------------------------------------------

Public Sub SkripsiDaftarIsi()
    ' Heading 1-3 + style Non-BAB pada level 1.
    InsertFieldAtSelection "TOC \o ""1-3"" \h \z \u \t ""Non-BAB,1"""
    UpdateLastTableOfContents
End Sub

Public Sub SkripsiDaftarGambar()
    InsertFieldAtSelection "TOC \h \z \c ""Gambar"""
    UpdateLastTableOfFigures
End Sub

Public Sub SkripsiDaftarTabel()
    InsertFieldAtSelection "TOC \h \z \c ""Tabel"""
    UpdateLastTableOfFigures
End Sub

Public Sub SkripsiDaftarLampiran()
    InsertFieldAtSelection "TOC \h \z \c ""Lampiran"""
    UpdateLastTableOfFigures
End Sub

Private Sub InsertFieldAtSelection(ByVal fieldCode As String)
    Dim inserted As Field
    Set inserted = Selection.Fields.Add( _
        Range:=Selection.Range, _
        Type:=wdFieldEmpty, _
        Text:=fieldCode, _
        PreserveFormatting:=False)
    inserted.Update
    Selection.Collapse Direction:=wdCollapseEnd
End Sub

Private Sub UpdateLastTableOfContents()
    If ActiveDocument.TablesOfContents.Count > 0 Then
        ActiveDocument.TablesOfContents(ActiveDocument.TablesOfContents.Count).Update
    End If
End Sub

Private Sub UpdateLastTableOfFigures()
    If ActiveDocument.TablesOfFigures.Count > 0 Then
        ActiveDocument.TablesOfFigures(ActiveDocument.TablesOfFigures.Count).Update
    End If
End Sub

' ---------------------------------------------------------------------------
' Caption: 1 digit (SEQ biasa) dan 2 digit (STYLEREF Heading 1 + SEQ)
' ---------------------------------------------------------------------------

Public Sub SkripsiCaptionGambar1()
    InsertCaptionField "Gambar", False
End Sub

Public Sub SkripsiCaptionGambar2()
    InsertCaptionField "Gambar", True
End Sub

Public Sub SkripsiCaptionTabel1()
    InsertCaptionField "Tabel", False
End Sub

Public Sub SkripsiCaptionTabel2()
    InsertCaptionField "Tabel", True
End Sub

Public Sub SkripsiCaptionLampiran1()
    InsertCaptionField "Lampiran", False
End Sub

Public Sub SkripsiCaptionLampiran2()
    InsertCaptionField "Lampiran", True
End Sub

Private Sub InsertCaptionField(ByVal label As String, ByVal includeChapter As Boolean)
    PrepareCaptionParagraph
    Selection.TypeText Text:=label & " "

    If includeChapter Then
        ' Contoh hasil: Gambar 1.1
        Selection.Fields.Add Range:=Selection.Range, Type:=wdFieldEmpty, _
            Text:="STYLEREF 1 \s", PreserveFormatting:=False
        Selection.Collapse Direction:=wdCollapseEnd
        Selection.TypeText Text:="."
        Selection.Fields.Add Range:=Selection.Range, Type:=wdFieldEmpty, _
            Text:="SEQ " & label & " \* ARABIC \s 1", PreserveFormatting:=False
    Else
        ' Contoh hasil: Gambar 1
        Selection.Fields.Add Range:=Selection.Range, Type:=wdFieldEmpty, _
            Text:="SEQ " & label & " \* ARABIC", PreserveFormatting:=False
    End If

    Selection.Collapse Direction:=wdCollapseEnd
    Selection.TypeText Text:=" "
End Sub

Private Sub PrepareCaptionParagraph()
    Dim paragraphText As String
    paragraphText = Selection.Paragraphs(1).Range.Text
    paragraphText = Replace(paragraphText, vbCr, "")
    paragraphText = Replace(paragraphText, Chr(7), "")

    If Len(Trim(paragraphText)) > 0 Then
        Selection.TypeParagraph
    End If

    On Error Resume Next
    Selection.Style = ActiveDocument.Styles(wdStyleCaption)
    On Error GoTo 0
End Sub

' ---------------------------------------------------------------------------
' Halaman otomatis dan nomor romawi
' ---------------------------------------------------------------------------

Public Sub SkripsiHalamanOtomatis()
    Dim sec As Section
    Set sec = Selection.Sections(1)

    Dim footer As HeaderFooter
    Set footer = sec.Footers(wdHeaderFooterPrimary)
    footer.LinkToPrevious = False

    Dim existing As Field
    For Each existing In footer.Range.Fields
        If InStr(1, existing.Code.Text, "PAGE", vbTextCompare) > 0 Then
            footer.Range.ParagraphFormat.Alignment = wdAlignParagraphCenter
            Exit Sub
        End If
    Next existing

    Dim rng As Range
    Set rng = footer.Range
    rng.Collapse Direction:=wdCollapseEnd
    rng.InsertParagraphAfter

    Set rng = footer.Range
    rng.Collapse Direction:=wdCollapseEnd
    rng.Fields.Add Range:=rng, Type:=wdFieldEmpty, _
        Text:="PAGE", PreserveFormatting:=False
    rng.ParagraphFormat.Alignment = wdAlignParagraphCenter
End Sub

Public Sub SkripsiNomorRomawi()
    ' Letakkan kursor di akhir bagian awal, lalu jalankan macro ini.
    ' Section saat ini menjadi romawi; section baru (isi) menjadi Arab mulai 1.
    Dim currentSection As Section
    Set currentSection = Selection.Sections(1)
    SetPageNumberStyle currentSection, wdPageNumberStyleLowercaseRoman, 1

    Selection.InsertBreak Type:=wdSectionBreakNextPage

    Dim bodySection As Section
    Set bodySection = Selection.Sections(1)
    SetPageNumberStyle bodySection, wdPageNumberStyleArabic, 1
End Sub

Public Sub SkripsiNomorArab()
    ' Pengaturan manual untuk section saat ini.
    SetPageNumberStyle Selection.Sections(1), wdPageNumberStyleArabic, 1
End Sub

Private Sub SetPageNumberStyle(ByVal sec As Section, _
        ByVal numberStyle As WdPageNumberStyle, ByVal startAt As Long)
    With sec.PageNumbers
        .NumberStyle = numberStyle
        .RestartNumberingAtSection = True
        .StartingNumber = startAt
        .IncludeChapterNumber = False
    End With
End Sub

' ---------------------------------------------------------------------------
' Copy / paste format
' ---------------------------------------------------------------------------

Public Sub SkripsiCopyFormat()
    Selection.CopyFormat
End Sub

Public Sub SkripsiPasteFormat()
    Selection.PasteFormat
End Sub
