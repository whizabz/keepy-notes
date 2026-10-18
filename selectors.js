// Every Keep DOM assumption lives here. Keep uses obfuscated class names that
// change on redeploy, so when the layout breaks, fix these first.
// Verified against the live page on 2026-10-18 (grid view, dark theme).
window.KEEPY_SEL = {
  // Wrapper around the "Take a note" box and every note section
  notesContainer: '.notes-container',
  // Absolutely positioned masonry grid for one section (pinned / others)
  grid: '.gkA7Yd-sKfxWe',
  // A note card in the list; Keep sets inline width + transform on it
  card: '.gkA7Yd-sKfxWe .IZ65Hb-n0tgWb.IZ65Hb-WsjYwc-nUpftc',
  // Class Keep puts on the card whose note is open (it also fades it to 0)
  cardOpen: 'IZ65Hb-fbudBf',
  // Clickable body of a card
  cardBody: '.IZ65Hb-s2gQvd',
  // Editor popup shown when a note is open (fixed, inline left/top)
  editor: '.VIpgJd-TUo6Hb.XKSfm-L9AdLc',
  // Full-viewport backdrop behind the editor
  backdrop: '.VIpgJd-TUo6Hb-xJ5Hnf',
  // The "Take a note" box that becomes the list toolbar
  composer: '.RfDI4d-bN97Pc .h1U9Be-xhiy4',
  // Present inside the composer only while it is expanded for a new note
  composerExpanded: '.RfDI4d-bN97Pc .h1U9Be-xhiy4 > .IZ65Hb-QQhtn',
  // The scrolling list column
  list: '.RfDI4d-bN97Pc',
  // The list/grid view toggle in the top bar (its label flips with the state)
  viewToggle: 'header [aria-label="List view"], header [aria-label="Grid view"]',
  // The sidebar collapse (hamburger) button
  menuButton: '[aria-label="Main menu"]',
};
