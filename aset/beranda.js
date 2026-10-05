// Beranda: gambar tampilan aplikasi mengikuti bahasa, bilah atas memadat saat digulir, bagian muncul saat terlihat.
(() => {
  const gambar = () => document.querySelectorAll('img.layar').forEach((g) => {
    const src = `aset/layar/${document.documentElement.lang === 'id' ? 'id' : 'en'}/${g.dataset.n}.jpg`;
    if (g.getAttribute('src') !== src) g.src = src;
  });
  document.addEventListener('bahasa', gambar);
  addEventListener('DOMContentLoaded', () => {
    gambar();
    const nav = document.querySelector('.nav');
    const atur = () => nav.classList.toggle('padat', scrollY > 24);
    atur(); addEventListener('scroll', atur, { passive: true });
    const io = 'IntersectionObserver' in window && new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('tampak'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.muncul').forEach((el) => (io ? io.observe(el) : el.classList.add('tampak')));
    document.getElementById('tahun').textContent = new Date().getFullYear();
  });
})();
