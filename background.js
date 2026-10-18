// Toolbar button: turns the Keepy layout on or off without uninstalling.
// The choice lives in storage.local, which content.js watches, so open Keep
// tabs switch immediately.

const render = (enabled) => {
  browser.action.setBadgeText({ text: enabled ? '' : 'OFF' });
  browser.action.setBadgeBackgroundColor({ color: '#5f6368' });
  browser.action.setTitle({
    title: enabled ? 'Keepy Notes: click to turn off' : 'Keepy Notes is off: click to turn on',
  });
};

const read = async () => (await browser.storage.local.get({ enabled: true })).enabled;

browser.action.onClicked.addListener(async () => {
  const enabled = !(await read());
  await browser.storage.local.set({ enabled });
  render(enabled);
});

// The badge resets when the browser restarts, so restore it from storage.
read().then(render);
