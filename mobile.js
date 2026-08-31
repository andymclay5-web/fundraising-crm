(function () {
  function isPhone() { return window.matchMedia('(max-width: 760px)').matches; }
  if (!isPhone()) return;

  document.body.classList.add('crm-mobile');

  const h1 = document.querySelector('h1');
  if (h1) {
    const full = h1.textContent || '';
    h1.dataset.fullTitle = full;
    const version = (full.match(/v\d+(?:\.\d+)+/) || ['v18.7.28'])[0];
    h1.textContent = 'Fundraising CRM · ' + version + ' · Mobile';
  }

  const bar = document.createElement('div');
  bar.id = 'mobileQuickBar';
  bar.innerHTML = [
    '<button type="button" data-mobile-filter="callQueue">Queue</button>',
    '<button type="button" data-mobile-filter="noAnswer">No Answer</button>',
    '<button type="button" data-mobile-filter="email">Email</button>',
    '<button type="button" id="mobileSearchBtn">Search</button>',
    '<button type="button" id="mobileMoreBtn">More</button>',
    '<div id="mobileListTitle">Working list</div>'
  ].join('');

  if (h1 && h1.parentNode) h1.parentNode.insertBefore(bar, h1.nextSibling);
  else document.body.insertBefore(bar, document.body.firstChild);

  function scrollToList() {
    const target = document.getElementById('resultsInfo') || document.getElementById('crmTable');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function syncActive() {
    const title = document.getElementById('mobileListTitle');
    const active = document.querySelector('#topButtons button.active-filter-button');
    if (title) title.textContent = active ? ('Active: ' + active.textContent.replace(/\s+/g, ' ').trim()) : 'Working list';
    document.querySelectorAll('#mobileQuickBar [data-mobile-filter]').forEach(btn => {
      btn.classList.toggle('mobile-active', !!active && active.getAttribute('data-count-filter') === btn.dataset.mobileFilter);
    });
  }

  bar.querySelectorAll('[data-mobile-filter]').forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = btn.dataset.mobileFilter;
      if (typeof window.setFilter === 'function') window.setFilter(filter);
      syncActive();
      window.setTimeout(scrollToList, 30);
    });
  });

  const searchBtn = document.getElementById('mobileSearchBtn');
  if (searchBtn) searchBtn.addEventListener('click', function () {
    const box = document.getElementById('searchBox');
    if (box) {
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.setTimeout(() => box.focus(), 250);
    }
  });

  const moreBtn = document.getElementById('mobileMoreBtn');
  if (moreBtn) moreBtn.addEventListener('click', function () {
    const open = document.body.classList.toggle('mobile-tools-open');
    moreBtn.textContent = open ? 'Less' : 'More';
    if (open) {
      const tools = document.getElementById('topButtons');
      if (tools) tools.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  const observer = new MutationObserver(syncActive);
  const topButtons = document.getElementById('topButtons');
  if (topButtons) observer.observe(topButtons, { subtree: true, attributes: true, childList: true, characterData: true });
  syncActive();
})();