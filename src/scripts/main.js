// split headings with [data-split] into words for the blur-in reveal
document.querySelectorAll('[data-split]').forEach((el) => {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w.trim()) { frag.append(w); return; }
          const s = document.createElement('span');
          s.className = 'word'; s.textContent = w;
          s.style.transitionDelay = `${frag.querySelectorAll?.('.word').length * 0}s`;
          frag.append(s);
        });
        n.replaceWith(frag);
      } else walk(n);
    });
  };
  walk(el);
  el.querySelectorAll('.word').forEach((w, i) => (w.style.transitionDelay = `${i * 0.09}s`));
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      if (e.target.hasAttribute('data-split')) e.target.classList.add('revealed');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.reveal, .chapter, [data-split]').forEach((el) => io.observe(el));

// parallax on panel backgrounds + dim previous panel as next one slides over
const panels = [...document.querySelectorAll('.panel')];
const header = document.querySelector('.header');
let lastY = 0;
function onScroll() {
  const vh = innerHeight;
  panels.forEach((p, i) => {
    const r = p.getBoundingClientRect();
    const bg = p.querySelector('.bg');
    if (bg) bg.style.transform = `translateY(${(-r.top / vh) * 6}%) scale(${1.04 + Math.min(Math.abs(r.top) / vh, 1) * 0.04})`;
    const next = panels[i + 1];
    const dim = p.querySelector('.dim');
    if (next && dim) {
      const nr = next.getBoundingClientRect().top;
      dim.style.opacity = Math.max(0, Math.min(0.75, 1 - nr / vh)) * 0.75;
    }
  });
  const y = scrollY;
  header.classList.toggle('hide', y > lastY && y > vh * 0.6 && y - lastY > 2);
  if (y < lastY) header.classList.remove('hide');
  const lt = document.querySelector('.light').getBoundingClientRect();
  header.classList.toggle('on-light', lt.top < 50 && lt.bottom > 50);
  lastY = y;
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.querySelector('form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const b = e.target.querySelector('button');
  b.textContent = 'Thanks — I reply within 24 hours.';
  b.disabled = true;
});
