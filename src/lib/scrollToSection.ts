export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const w = window as unknown as { __lenis?: { scrollTo: (t: Element, opts?: { offset?: number }) => void } };
  if (w.__lenis) {
    w.__lenis.scrollTo(el, { offset: -80 });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
