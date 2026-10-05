// Bahasa halaman: ?lang=en / ?lang=id, pilihan terakhir pengunjung, atau bahasa peramban (Indonesia → id, lainnya → en).
(() => {
  const q = new URLSearchParams(location.search).get('lang');
  let simpan = null;
  try { simpan = localStorage.getItem('mubeena.lang'); } catch {}
  const awal = q === 'en' || q === 'id' ? q : simpan || ((navigator.language || 'en').toLowerCase().startsWith('id') ? 'id' : 'en');
  const pasang = (l) => {
    document.documentElement.lang = l;
    document.querySelectorAll('.bhs button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.set === l));
    const t = document.querySelector(`meta[name="judul-${l}"]`);
    if (t) document.title = t.content;
    document.dispatchEvent(new CustomEvent('bahasa', { detail: l }));
  };
  pasang(awal);
  addEventListener('DOMContentLoaded', () => {
    pasang(document.documentElement.lang);
    document.querySelectorAll('.bhs button').forEach((b) => (b.onclick = () => {
      pasang(b.dataset.set);
      try { localStorage.setItem('mubeena.lang', b.dataset.set); } catch {}
    }));
  });
})();
