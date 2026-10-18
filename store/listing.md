# Keepy Notes: AMO listing copy

Paste these into the addons.mozilla.org listing form.

## Name
Keepy Notes

## Summary (max 250 characters)
Turns Google Keep into a three-column notes app: your labels, a scrolling list of notes, and the open note beside it. Unofficial and not affiliated with Google. Switch it off any time from the toolbar button.

## Description
Keepy Notes changes how Google Keep looks on keep.google.com. Instead of a grid of cards with a pop-up editor, you get a three-column layout:

- Left: Keep's own label sidebar, kept open.
- Middle: your notes as a scrolling list, each showing a title and a couple of lines of preview. Pinned notes always show their pin.
- Right: the open note, with its controls along the top. "No Note Selected" shows when nothing is open.

Also included:
- "Take a note" becomes a toolbar above the list, and the expanded box pushes the list down.
- Up and Down arrow keys move through your notes.
- Works in Keep's light and dark themes.
- One click on the toolbar button turns the layout off and brings back stock Keep, grid view included.
- If Google changes Keep's page so the layout can't be applied safely, Keepy Notes switches itself off and tells you, instead of leaving a broken page.

Privacy: Keepy Notes only runs on keep.google.com. It does not read, store or send your notes, makes no network requests and collects no data. The only thing it saves is whether it is switched on or off.

This is an unofficial add-on. It is not made by, endorsed by or affiliated with Google. Google Keep is a trademark of Google LLC.

## Categories
Appearance (primary), Other (if the form lets you pick two)

## Support
Support email or site: (your choice; AMO asks for one)

## License
Pick one in the form. MIT is a common choice for a small add-on like this.

## Privacy policy
Not required, since the add-on collects no data (the manifest declares data_collection_permissions: none). If you want one, a single sentence is enough: "Keepy Notes collects no personal data and sends nothing off your device. It stores one setting, on or off, in your browser."

## Notes for the reviewer (the "Notes to Reviewer" field)
- No build step, bundler, minification or third-party code. The uploaded files are the source.
- Runs only on https://keep.google.com/*. Permission requested: storage (saves one boolean, "enabled").
- No network requests, no remote code, no innerHTML/eval. Text is inserted with textContent only.
- The extension restyles the page with CSS gated on a class on <html>. The content script keeps that class in sync with the on/off setting, adds one placeholder element ("No Note Selected"), and handles Up/Down keys by dispatching click events on note cards.
- Keep's page uses generated class names. All of them are listed in selectors.js. If they stop matching, the extension disables itself and shows a dismissible banner.
- Needs Firefox 121+ because the CSS uses :has().

## Screenshots to take (Firefox, 1280px+ wide window, real notes blurred or swapped for sample ones)
1. Dark theme, a note open.
2. Light theme, a note open.
3. The expanded "Take a note" box with the list pushed down.
4. The "No Note Selected" state.
Use sample notes, not your real ones, since screenshots are public.
