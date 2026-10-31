// Menu burger (daftar bagian halaman ini + halaman lain) dan tombol kembali ke atas. Isi menu dibaca dari halaman, jadi ikut berubah bersama isinya.
(() => {
  const HALAMAN = [['./', 'Home', 'Beranda'], ['panduan.html', 'How to use', 'Cara memakai'], ['support.html', 'Support', 'Bantuan'],
    ['privacy.html', 'Privacy', 'Privasi'], ['terms.html', 'Terms', 'Ketentuan']];
  const dua = (en, id) => `<span data-lang="en">${en}</span><span data-lang="id">${id}</span>`;
  const bersih = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const diam = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Beranda: label pendek pada data-menu-*. Halaman lain: h2 per bahasa (h3 kalau h2-nya sedikit).
  const bagian = () => {
    const pilihan = [...document.querySelectorAll('[data-menu-id]')];
    if (pilihan.length) return pilihan.map((el) => ({ el, html: dua(el.dataset.menuEn, el.dataset.menuId) }));
    const hasil = [];
    for (const blok of document.querySelectorAll('main [data-lang]')) {
      if (blok.closest('.nv-panel') || !blok.querySelector('h2, h3')) continue;
      let judul = [...blok.querySelectorAll('h2')];
      if (judul.length < 3) judul = [...blok.querySelectorAll('h2, h3')];
      judul.forEach((h, i) => {
        const el = h.closest('[id]') && h.closest('[id]') !== blok && h.closest('.bagian, .kartu') ? h.closest('[id]') : h;
        if (!el.id) el.id = `b-${blok.dataset.lang}-${i + 1}`;
        hasil.push({ el, bhs: blok.dataset.lang, teks: h.textContent.trim() });
      });
    }
    return hasil;
  };

  const pasang = () => {
    const wadah = document.querySelector('header .atas, header .wadah');
    if (!wadah) return;
    const tombol = document.createElement('button');
    tombol.className = 'nv-tombol';
    tombol.type = 'button';
    tombol.setAttribute('aria-expanded', 'false');
    tombol.setAttribute('aria-controls', 'nvPanel');
    tombol.innerHTML = '<svg class="tiga" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
      + '<svg class="x" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    wadah.appendChild(tombol);

    const daftar = bagian();
    const ini = location.pathname.split('/').pop() || './';
    const saatIni = (u) => u === ini || (u === './' && ini === 'index.html');
    const panel = document.createElement('nav');
    panel.className = 'nv-panel';
    panel.id = 'nvPanel';
    panel.hidden = true;
    panel.innerHTML = (daftar.length ? `<h2>${dua('On this page', 'Di halaman ini')}</h2><ul>${daftar.map((b) => (b.html
      ? `<li><a href="#${b.el.id}">${b.html}</a></li>`
      : `<li data-lang="${b.bhs}"><a href="#${b.el.id}">${bersih(b.teks)}</a></li>`)).join('')}</ul><div class="pemisah"></div>` : '')
      + `<h2>${dua('Pages', 'Halaman')}</h2><ul>${HALAMAN.map(([u, en, id]) => `<li><a href="${u}"${saatIni(u) ? ' aria-current="page"' : ''}>${dua(en, id)}</a></li>`).join('')}</ul>`;
    document.body.appendChild(panel);

    const tutup = (kembali) => {
      if (panel.hidden) return;
      panel.hidden = true;
      tombol.setAttribute('aria-expanded', 'false');
      if (kembali) tombol.focus();
    };
    const buka = () => {
      document.documentElement.style.setProperty('--nv-atas', `${Math.round(wadah.getBoundingClientRect().bottom) + 8}px`);
      panel.hidden = false;
      tombol.setAttribute('aria-expanded', 'true');
      // Tandai bagian yang sedang dibaca dan pastikan terlihat di menu.
      panel.querySelectorAll('a.kini').forEach((a) => a.classList.remove('kini'));
      let kini = null;
      for (const a of panel.querySelectorAll('a[href^="#"]')) {
        const el = document.getElementById(a.getAttribute('href').slice(1));
        if (a.parentElement.offsetParent !== null && el && el.getBoundingClientRect().height && el.getBoundingClientRect().top <= 100) kini = a;
      }
      if (kini) { kini.classList.add('kini'); kini.scrollIntoView({ block: 'nearest' }); }
    };
    tombol.onclick = () => (panel.hidden ? buka() : tutup());
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) tutup(); });
    document.addEventListener('click', (e) => { if (!panel.contains(e.target) && !tombol.contains(e.target)) tutup(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') tutup(true); });
    addEventListener('resize', () => { if (!panel.hidden) buka(); });

    const atas = document.createElement('button');
    atas.id = 'keAtas';
    atas.type = 'button';
    atas.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg>';
    document.body.appendChild(atas);
    atas.onclick = () => {
      scrollTo({ top: 0, behavior: diam() ? 'auto' : 'smooth' });
      history.replaceState(null, '', location.pathname + location.search);
    };
    const atur = () => atas.classList.toggle('tampak', scrollY > Math.max(600, innerHeight * .9));
    atur();
    addEventListener('scroll', atur, { passive: true });

    const label = () => {
      tombol.setAttribute('aria-label', 'Menu');
      atas.setAttribute('aria-label', document.documentElement.lang === 'id' ? 'Kembali ke atas' : 'Back to top');
      atas.title = atas.getAttribute('aria-label');
    };
    label();
    document.addEventListener('bahasa', label);
  };
  pasang();

  // Dibuka lewat tautan langsung ke suatu bagian: gulir smooth bisa batal saat halaman panjang dimuat, jadi langsung lompat.
  addEventListener('load', () => {
    const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    const n = performance.getEntriesByType('navigation')[0];
    if (el && !(n && n.type === 'back_forward')) el.scrollIntoView({ behavior: 'instant' });
  });
})();
