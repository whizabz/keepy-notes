# Keepy Notes

A Firefox extension that turns Google Keep (keep.google.com) into a three-column, Apple Notes style layout: labels on the left, a scrolling list of notes in the middle, the open note on the right.

Unofficial. Not affiliated with or endorsed by Google. Google Keep is a trademark of Google LLC.

## What it does

- Notes as a list with a title and a couple of preview lines; pinned notes always show their pin.
- The open note docks in the right pane, with its controls on top and the edited date beside them.
- "Take a note" becomes a toolbar above the list; the expanded box pushes the list down.
- Up/Down arrow keys move through notes.
- Light and dark themes.
- Toolbar button turns the layout off to get stock Keep back.
- If Keep's markup changes and the selectors stop matching, it switches itself off and shows a banner.

It only runs on keep.google.com, makes no network requests, and does not read or store your notes. The one thing it saves is whether it is on or off.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Manifest V3 manifest, Firefox 121+ |
| `selectors.js` | Every Keep class name and selector the script depends on |
| `styles.css` | The layout; every rule is gated on `html.keepy` (the same class names are repeated here) |
| `content.js` | Applies the class, health check, arrow-key navigation, composer sizing, on/off |
| `background.js` | Toolbar on/off button and badge |
| `store/` | Listing copy and icon for addons.mozilla.org |

## Try it

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on…** and choose `manifest.json`.
3. Open https://keep.google.com.

Temporary add-ons disappear when Firefox quits.

## Keeping it working

Keep uses generated class names (like `IZ65Hb-n0tgWb`) that can change whenever Google rebuilds its stylesheet. When the layout breaks, re-inspect the page and update the names in `selectors.js` and `styles.css`.

## Build a package

```bash
mkdir -p dist
zip -X dist/keepy-notes-$(grep -o '"version": "[^"]*' manifest.json | cut -d'"' -f4).zip \
  manifest.json background.js content.js selectors.js styles.css icons/keepy.svg
```

## License

[MIT](LICENSE)
