# Argentina IPC Rent — version 2026.10.05.1

A static, bilingual English / Argentine Spanish rent calculator for:

- ARS 1,000,000 per month from 1 October through 31 December 2026.
- Quarterly IPC adjustments in January 2027, then April, July and October.
- National all-items IPC index levels from INDEC via Datos Argentina.
- No exchange-rate or Blue Dollar features.

## Replace the existing GitHub Pages app

Target repository: https://github.com/Ultrasounddk/Arenales
Target website: https://ultrasounddk.github.io/Arenales/

1. Download and unzip `Arenales-IPC-Rent-2026.10.05.1.zip` on your computer. Upload the extracted files, **not the ZIP**.
2. Open the repository, sign in, and first use **Code → Download ZIP** to keep a backup of the old version. Also export any old app history you need; the new app does not import the old app’s different data model.
3. Open **Settings → Pages**. Note the branch and folder currently used for deployment. For this replacement, use **Deploy from a branch**, the existing publishing branch (usually `main`), and **/(root)**. Do not change to a different branch without uploading the files there.
4. Return to **Code**, select that publishing branch, and open its root (where the existing `index.html` is).
5. Choose **Add file → Upload files**. Drag all the extracted files into the upload area. Their names must appear directly at the root, not inside a `Arenales-IPC-Rent...` folder. In particular replace `index.html`, `manifest.webmanifest`, and **`service-worker.js`**. Upload every new supporting file listed below in the same commit. Do not leave the old `index.html` or service worker in place.
6. Enter a commit message such as `Replace rent app with quarterly national IPC calculator` and click **Commit changes**. If your branch requires a pull request, create and merge it into the publishing branch instead.
7. Files with identical names are replaced. Old unreferenced files may remain safely, but can be removed after backing up. Keep any existing `CNAME` and `.github` settings unless you intentionally want to change them. The new app references no old exchange-rate code.
8. Open **Actions** and wait for the Pages deployment to finish successfully. Then visit https://ultrasounddk.github.io/Arenales/ while online.
9. Verify the footer reads **2026.10.05.1**, the initial rent is ARS 1,000,000, and January 2027 uses **December 2026 / September 2026**. It should say **Awaiting data** until the necessary values exist or you enter a manual override.

### Files that must be at the repository root

`index.html`, `styles.css`, `app.mjs`, `core.mjs`, `manifest.webmanifest`, `service-worker.js`, `official-snapshot.json`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.

The ZIP also contains `.nojekyll`, this README, `TEST-RESULTS.md`, and `test-core.mjs`. The test file is not loaded by the app. If your computer hides `.nojekyll`, it is optional for these filenames; you can create an empty file called `.nojekyll` using GitHub's **Add file → Create new file**.

No build, server, API key, npm installation or paid service is needed. Serve over HTTPS (GitHub Pages) or localhost. Opening `index.html` as a `file://` file does not support module loading and PWA features reliably.

## Calculation and publication lag

For the January–March 2027 rent:

```
quarterly factor = national IPC index December 2026 / national IPC index September 2026
quarterly IPC % = (factor - 1) × 100
new monthly rent = previous monthly rent × factor
```

This covers inflation in **October, November and December 2026**. April 2027 uses **March 2027 / December 2026**, July uses **June / March**, and October uses **September / June**. Each adjustment starts from the prior adjusted rent, rounded to centavos at each quarter. The endpoints alone are sufficient: their ratio already includes the intervening months. Rounded monthly percentage changes are never summed.

Example using **synthetic test data, not official observations**: indices 100 → 110 → 121 → 133.1 represent three 10% monthly changes; the quarter is 33.1%, not 30%. The new rent is ARS 1,331,000.

IPC for a month is published afterward. December is therefore not available at the start of January. Missing values, or a missing prior quarter, leave the new rent pending. The app does not substitute an older quarter, forecast values, or assume an interim payable amount. The contractual handling of delayed payment adjustments must be agreed separately.

## Official source and dates

- Series: **148.3_INIVELNAL_DICI_M_26**, IPC. Nivel General Nacional. Base dic 2016. Mensual.
- Provider: Datos Argentina; underlying statistical source: INDEC.
- Endpoint: https://apis.datos.gob.ar/series/api/series/?ids=148.3_INIVELNAL_DICI_M_26&start_date=2026-01-01&limit=1000&format=json
- INDEC methodology: https://www.indec.gob.ar/ftp/cuadros/economia/metodologia_ipc_nacional_2019.pdf
- INDEC publication calendar: https://www.indec.gob.ar/indec/web/Calendario-Fecha-0

The bundled response was retrieved **5 October 2026 at 14:03:28 UTC**. Its latest observation is **August 2026 = 12276.766**. September and December 2026 were not returned. The snapshot is the actual verified response, not a forecast. A live refresh is attempted on launch and through the refresh button. The portal may update later than INDEC itself.

The app validates the series identity, untransformed index representation, positive numeric values, duplicate dates and full ISO observation dates. Dates are keyed by `YYYY-MM`; the dataset metadata's original issue date in **2017** is never used as an observation date. Future/current-month observations are excluded. A response older than the latest locally available observation is rejected. Retrieval timestamps are shown separately from the reference month and are not claimed as INDEC publication dates.

If the endpoint fails, times out or blocks cross-origin requests, the app retains validated local data or the bundled snapshot. It never reports a failed refresh as fresh data. A changed index base or discontinued series requires a code update; do not mix index bases manually.

## Manual inputs and saved history

Select the quarter, expand **Manual override**, and enter either:

- The index immediately before the three inflation months and the quarter’s final index, both with the same series/base; or
- The already cumulative quarterly percentage.

Enter a source or reason. Decimal commas and decimal points work; thousands separators do not. Manual changes are saved locally, labelled as manual and remain in effect after official refreshes until removed. A later rent also shows a manual label if an earlier quarter was overridden. Complete earlier missing quarters first. The app supports quarters through October 2036.

**Save calculation** stores an immutable report snapshot on this device. Later refreshes and edits do not rewrite saved reports. Saved reports retain their original language. **Export CSV** exports the current schedule plus saved reports. **Copy report** produces plain text for WhatsApp; **Share** opens the system share sheet where supported and otherwise offers copyable text. **Print / Save PDF** uses the browser’s print function and includes the selected calculation, source date, schedule and method.

Local storage holds language, official data, manual overrides and saved history. These are not uploaded. Clearing browser/site data erases them. Private browsing or storage limits may prevent persistence; the app displays a warning. CSV is an export, not an import/restore format.

## iPhone installation and updates

1. Open the website in **Safari**, tap **Share → Add to Home Screen**.
2. Open it online once so its app shell is cached; it can then reopen offline with the latest locally available data.
3. After deployment, reopen it online and use **Check for app update**. The service worker is checked on startup and when the app returns to the foreground. A new fully cached version activates and reloads the open app.
4. The worker deliberately uses the existing site's filename **service-worker.js**, so old installations can discover the replacement. App-shell files are cached together under a versioned name; API requests are not stored in that shell cache.
5. If iOS still shows the old app, fully close the home-screen app and reopen the site in Safari while online, then reload once after the new worker installs. Confirm the version in the footer. iOS controls when background apps resume; no site can guarantee an immediate background update.
6. As a last resort, export needed history first, then remove the site's website data in Safari settings and reopen. This deletes locally saved information. Re-adding the home-screen shortcut alone may not clear website data.

For future releases: change **VERSION in both app.mjs and service-worker.js**, update the README/version notes, and upload all changed files together. Do not rename the worker. Old caches belonging to the new app are removed during activation; unrelated caches on the same GitHub Pages origin are left untouched.

## Tests

With Node.js installed, run:

```
node --test test-core.mjs
```

See `TEST-RESULTS.md` for the checks performed and limitations. No test overrides are included in the delivered app data.
