document.getElementById('y').textContent = new Date().getFullYear();
// ornaments drift subtly with the pointer
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const root = document.documentElement;
  addEventListener('pointermove', e => {
    root.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3));
    root.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3));
  }, {passive:true});
}

// prompt list: preview (first 100 chars) + copy full text
async function copyText(t){
  try { await navigator.clipboard.writeText(t); return true; } catch {}
  const ta = document.createElement('textarea');
  ta.value = t; ta.setAttribute('readonly',''); ta.style.cssText = 'position:fixed;top:0;opacity:0';
  document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length);
  let ok = false; try { ok = document.execCommand('copy'); } catch {}
  ta.remove(); return ok;
}
const list = document.getElementById('prompts'), tpl = document.getElementById('prompt-tpl');
PROMPTS.forEach((it, n) => {
    const el = tpl.content.firstElementChild.cloneNode(true);
    const full = it.text.trim();
    const flat = full.replace(/\s+/g, ' ');
    el.style.setProperty('--i', 6 + n);
    el.querySelector('.ptitle').textContent = it.title;
    el.querySelector('.pprev').textContent = flat.length > 100 ? flat.slice(0, 100).trimEnd() + '…' : flat;
    const btn = el.querySelector('.copy'), label = btn.firstElementChild;
    let timer;
    btn.addEventListener('click', async () => {
      const ok = await copyText(full);
      label.textContent = ok ? 'Tersalin ✓' : 'Gagal, salin manual';
      btn.classList.toggle('done', ok);
      clearTimeout(timer);
      timer = setTimeout(() => { label.textContent = 'Salin prompt'; btn.classList.remove('done'); }, 1800);
    });
    list.appendChild(el);
});
