# Office export fidelity — issue #16

## Changes

- DOCX keeps Arabic paragraph direction and separates Latin identifiers into
  LTR runs. Formatting-only left-to-right marks surround those runs because
  an LTR run flag alone did not prevent LibreOffice from showing `0007-A`
  as `A-0007`. Original labels/values remain unchanged in their own text runs;
  stored application data and `exportedRows` are not changed. Bold labels
  stay with the following value where the document renderer permits it.
- XLSX adds wrapped, top-aligned cell styles, contextual text direction, A4
  margins and fit-to-one-page-width printing. Height is unlimited, and the
  column header row repeats on subsequent pages. Values remain inline strings,
  preserving leading zeros and preventing formula-like text from executing.

## Automated verification

The existing integration suite now reads the generated ZIP parts and checks
every exported label/value, including Arabic, mixed-script identifiers,
zero/false/empty values, XML-sensitive characters and formula-like text.
DOCX assertions distinguish original data runs from generated directional
formatting runs. XLSX checks validate styles, relationships, print headers and
fit-width/unlimited-height settings. A long fixture retains every exported row.

All existing behavioral/architecture tests, typecheck, lint, build and
`git diff --check` pass. The known large-client-chunk build warning remains.
Independent Python checks confirm ZIP CRC, XML parsing and, via openpyxl,
cell values/string types, wrapping, RTL view, print titles and page settings.

## Rendered before/after evidence

Engine: LibreOfficeDev 26.8.0.0.alpha0, Writer and Calc, exported to PDF and
inspected as PNG pages. Inputs are generated synthetic test fixtures only.

| Fixture | Before | After |
| --- | --- | --- |
| DOCX document codes | `A-0007`, `B-0001` displayed | `0007-A`, `0001-B` displayed |
| DOCX Arabic sentence with codes | numeric-leading code reversed | `0007-A` and `INV-001/2026` remain in intended order |
| Standard XLSX print | 2 pages: labels then values | 1 A4 page containing paired labels/values |
| Extended XLSX | not part of baseline fixture | 3 vertical pages; both columns and repeated headings on each |

Workspace evidence is under `/workspace/onyx-deliverables/office/` (before)
and `/workspace/onyx-deliverables/office-after/` (after), with page counts in
`office-render-results.json`. Generated documents/screenshots are not committed.

## Limits

Microsoft Word/Excel were not available; this is LibreOffice rendering QA,
not a claim of exhaustive Office-version compatibility. Copying DOCX text may
include its invisible directional formatting marks; original application data
and the DOCX data runs retain their exact text. XLSX cell values have no added
directional characters. Mixed Arabic/Latin phrases within a single XLSX cell
still depend on the viewer's bidi handling; the long fixture exposes some
numeric-leading code reordering there. This change fixes the confirmed XLSX
column-pagination defect without modifying cell text to conceal that limit.

The distinction between paragraph direction and run direction is documented
in Microsoft's [BiDi reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.bidi)
and [RightToLeftText reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.righttolefttext).

This branch is based on PR #9 and is independent of #11/#13/#15. Retarget to
`develop` only after prerequisites land and parent review passes. No merge is
performed while automatic branch-deletion settings remain unverified.
