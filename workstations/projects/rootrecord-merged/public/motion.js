
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = document.querySelectorAll(".worlds, .ava, .pulse");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.classList.add("in");
      }
    },
    { threshold: 0.12 },
  );
  for (const el of els) {
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    io.observe(el);
  }
  const style = document.createElement("style");
  style.textContent = `.worlds.in, .ava.in, .pulse.in { opacity: 1 !important; transform: none !important; }`;
  document.head.appendChild(style);
})();
