document.getElementById('y').textContent = new Date().getFullYear();
// ornaments drift subtly with the pointer
if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const root = document.documentElement;
  addEventListener('pointermove', e => {
    root.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3));
    root.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3));
  }, {passive:true});
}
