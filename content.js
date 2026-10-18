(() => {
  const S = window.KEEPY_SEL;
  const root = document.documentElement;

  // The toolbar button (background.js) turns the layout on and off. Every rule
  // in styles.css is gated on the `keepy` class on <html>, so removing it
  // restores stock Keep; setEnabled() at the bottom is the only place that
  // adds or removes it.
  let enabled = false;

  const empty = document.createElement('div');
  empty.id = 'keepy-empty';
  empty.textContent = 'No Note Selected';

  // --- Health check -------------------------------------------------------
  // If Keep's markup changes and our selectors stop matching, switch the
  // layout off and tell the user instead of leaving a half-broken page.
  let disabled = false;

  const disable = (reason) => {
    if (disabled || !enabled) return; // nothing to tell the user while it's off
    disabled = true;
    root.classList.remove('keepy', 'keepy-has-note');
    empty.remove();
    console.warn(`[Keepy Notes] disabled: ${reason}`);

    const bar = document.createElement('div');
    bar.setAttribute('role', 'status');
    bar.style.cssText =
      'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483647;' +
      'max-width:480px;padding:10px 14px;border-radius:12px;font:14px/1.4 system-ui,sans-serif;' +
      'background:#303134;color:#e8eaed;box-shadow:0 2px 8px rgba(0,0,0,.4);';
    bar.textContent =
      "Keepy Notes is off: Google Keep's layout changed, so the three-column view can't be applied. " +
      'Stock Keep is shown instead. ';
    const close = document.createElement('button');
    close.textContent = 'Dismiss';
    close.style.cssText = 'margin-left:8px;background:none;border:0;color:#8ab4f8;cursor:pointer;font:inherit;';
    close.onclick = () => bar.remove();
    bar.append(close);
    document.body.append(bar);
  };

  // The notes container is the anchor for the whole layout; it must show up.
  let waited = 0;
  const waitForAnchor = setInterval(() => {
    if (disabled) return clearInterval(waitForAnchor);
    if (document.querySelector(S.notesContainer)) {
      clearInterval(waitForAnchor);
      if (!document.querySelector(S.composer)) {
        console.warn('[Keepy Notes] composer selector matched nothing');
      }
      return;
    }
    waited += 500;
    if (waited >= 10000) {
      clearInterval(waitForAnchor);
      disable(`selector ${S.notesContainer} never matched`);
    }
  }, 500);

  // After a note is opened, the editor must appear within a couple of seconds.
  let editorCheck = null;
  const checkEditor = () => {
    clearTimeout(editorCheck);
    if (!/^#(NOTE|LIST)\//.test(location.hash)) return;
    editorCheck = setTimeout(() => {
      if (!disabled && /^#(NOTE|LIST)\//.test(location.hash) && !document.querySelector(S.editor)) {
        disable(`selector ${S.editor} never matched after opening a note`);
      }
    }, 2500);
  };

  // --- Layout state -------------------------------------------------------
  const openCard = (card) => {
    // Keep switches notes when another card is clicked, so no need to close first.
    const target = card.querySelector(S.cardBody) || card;
    for (const type of ['mousedown', 'mouseup', 'click']) {
      target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
    }
    card.scrollIntoView({ block: 'nearest' });
  };

  const visibleCards = () => [...document.querySelectorAll(S.card)].filter((c) => c.offsetParent !== null);

  // The expanded "Take a note" box is fixed-position, so it floats over the
  // list. Measure how much taller it is than the collapsed toolbar and let CSS
  // push the list down by that much.
  const COLLAPSED = 46; // height of the collapsed box, measured on the live page
  let watched = null;
  const resizeObserver = new ResizeObserver(() => syncComposerHeight());
  let wasExpanded = false;

  const syncComposerHeight = () => {
    const box = document.querySelector(S.composer);
    if (!box) return;
    const expanded = !!document.querySelector(S.composerExpanded);
    const extra = expanded ? Math.max(0, box.offsetHeight - COLLAPSED) : 0;
    root.style.setProperty('--keepy-composer-extra', `${extra}px`);
    if (expanded && !wasExpanded) {
      const list = document.querySelector(S.list);
      if (list) list.scrollTop = 0; // a new note starts at the top of the list
    }
    wasExpanded = expanded;
  };

  const watchComposer = () => {
    const box = document.querySelector(S.composer);
    if (box && box !== watched) {
      if (watched) resizeObserver.unobserve(watched);
      resizeObserver.observe(box);
      watched = box;
    }
    syncComposerHeight();
  };

  const sync = () => {
    if (disabled || !enabled) return;
    const open = /^#(NOTE|LIST)\//.test(location.hash) && !!document.querySelector(S.editor);
    root.classList.toggle('keepy-has-note', open);
    watchComposer();
  };

  new MutationObserver(sync).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => {
    sync();
    checkEditor();
  });
  sync();
  checkEditor();

  // --- Sidebar ------------------------------------------------------------
  // The collapse button is hidden, so make sure a sidebar that Keep remembers
  // as collapsed gets expanded again.
  const expandSidebar = (tries = 20) => {
    const btn = document.querySelector(S.menuButton);
    if (btn && btn.getAttribute('aria-expanded') === 'false') btn.click();
    else if (!btn && tries > 0) setTimeout(() => expandSidebar(tries - 1), 250);
  };
  expandSidebar();

  // --- Keyboard navigation ------------------------------------------------
  // Up/Down moves through the list and opens each note.
  const isTyping = (el) =>
    !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

  document.addEventListener('keydown', (e) => {
    if (disabled || !enabled) return;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    if (isTyping(document.activeElement)) return;

    const cards = visibleCards();
    if (!cards.length) return;

    const current = cards.findIndex((c) => c.classList.contains(S.cardOpen));
    const step = e.key === 'ArrowDown' ? 1 : -1;
    let next = current === -1 ? (step === 1 ? 0 : cards.length - 1) : current + step;
    next = Math.max(0, Math.min(cards.length - 1, next));
    if (next === current) return;

    e.preventDefault();
    openCard(cards[next]);
  });

  // --- On/off ---------------------------------------------------------------
  const setEnabled = (on) => {
    enabled = on;
    if (disabled) return; // the health check already switched the layout off
    root.classList.toggle('keepy', on);
    if (on) {
      if (!empty.isConnected) document.body.append(empty);
      expandSidebar();
      sync();
    } else {
      empty.remove();
      root.classList.remove('keepy-has-note');
      root.style.removeProperty('--keepy-composer-extra');
    }
  };

  browser.storage.local.get({ enabled: true }).then((v) => setEnabled(v.enabled));
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) setEnabled(changes.enabled.newValue);
  });
})();
