// Simple landing interactions: animate stats and nav toggle (if any)

document.addEventListener('DOMContentLoaded', () => {
  // animate stat numbers
  const nums = document.querySelectorAll('.stat-number');
  nums.forEach(el => {
    const target = parseFloat(el.dataset.target || el.textContent || 0);
    let start = 0;
    const isFloat = target !== Math.floor(target);
    const duration = 1200;
    const stepTime = Math.max(16, Math.floor(duration / 60));
    const steps = Math.floor(duration / stepTime);
    let step = 0;
    const tick = () => {
      step++;
      const v = start + (target - start) * (step / steps);
      el.textContent = isFloat ? v.toFixed(1) : Math.floor(v);
      if (step < steps) requestAnimationFrame(tick);
      else el.textContent = isFloat ? target.toFixed(1) : target;
    };
    requestAnimationFrame(tick);
  });

  // small nav toggle for mobile if exists
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('active'));
  }
});
