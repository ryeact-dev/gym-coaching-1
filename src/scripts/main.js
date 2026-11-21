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
function onScroll() {
  const vh = innerHeight;
  panels.forEach((p, i) => {
    const r = p.getBoundingClientRect();
    const bg = p.querySelector('.bg');
    const nextTop = panels[i + 1] ? panels[i + 1].getBoundingClientRect().top : vh;
    const entering = Math.max(0, Math.min(1, r.top / vh)); // 1 → just below screen, 0 → in place
    const covered = Math.max(0, Math.min(1, 1 - nextTop / vh)); // 0 → untouched, 1 → fully covered
    if (bg) bg.style.transform = `translateY(${entering * 5 - covered * 5}%) scale(${1.04 + covered * 0.05})`;
    const next = panels[i + 1];
    const dim = p.querySelector('.dim');
    if (next && dim) {
      const nr = next.getBoundingClientRect().top;
      dim.style.opacity = Math.max(0, Math.min(0.75, 1 - nr / vh)) * 0.75;
    }
  });

}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.querySelector('form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const b = e.target.querySelector('button');
  b.textContent = 'Thanks — I reply within 24 hours.';
  b.disabled = true;
});
