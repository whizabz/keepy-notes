// Settings page. Saved values live in storage.local, which content.js watches,
// so open Keep tabs update immediately.
const box = document.getElementById('showPreview');
const saved = document.getElementById('saved');

browser.storage.local.get({ showPreview: false }).then((v) => {
  box.checked = v.showPreview;
});

box.addEventListener('change', async () => {
  await browser.storage.local.set({ showPreview: box.checked });
  saved.textContent = 'Saved';
  setTimeout(() => { saved.textContent = ''; }, 1500);
});
