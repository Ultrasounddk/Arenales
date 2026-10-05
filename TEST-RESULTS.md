# Verification — 5 October 2026

## Automated core tests: 18 passed, 0 failed

Run with Node's built-in test runner (`node --test test-core.mjs`). Covers fixed rent, December/September endpoint choice, compounding instead of addition, chained quarterly rents, centavo rounding, missing endpoint and missing prior-quarter blocking, wrong-year data, manual percentage/index calculations, manual provenance, invalid manual inputs, zero/negative rates, year boundaries, official snapshot identity, rejection of wrong series/transformed data/malformed dates, future/null observations, decimal commas and CSV escaping.

## Interactive browser checks: passed

Performed against the local static app in the Codex in-app browser:

- Official API refresh succeeds and displays August 2026 as the latest reference month.
- Base rent displays ARS 1,000,000; January 2027 is pending with missing September/December indices.
- Manual 6.5% quarter produces ARS 1,065,000 with a manual label.
- The next quarter using synthetic indices 100 and 110 produces ARS 1,171,500 from the prior adjusted rent.
- Spanish labels, numbers and month names work; language survives reload.
- Saved snapshot and manual override survive reload.
- Copy Report confirms success.
- Removing the overrides restores pending status.
- Narrow/mobile-width layout inspected visually.
- Browser error log was empty during these checks.

Synthetic inputs were entered only into the local browser's storage. They are not in the shipped snapshot or source defaults.

## Scope and limitations

The separate headless browser automation could not launch in this environment; interactive browser checks were used instead. Real iPhone installation/update behavior, the operating-system Share sheet, CSV download completion, print-to-PDF output and full offline reload were not end-to-end verified on a physical device. The manifest, service worker, cache paths and export/print implementations are included and reviewed. The website has not been deployed to GitHub; this ZIP is ready for upload.
