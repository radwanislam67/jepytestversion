export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = 90;
  const top = el.getBoundingClientRect().top + window.scrollY - header;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}

export function navigateToSection(
  router: { navigate: (opts: any) => Promise<unknown> | void },
  pathname: string,
  id: string,
) {
  if (pathname === "/") {
    scrollToId(id);
    return;
  }
  const result = router.navigate({ to: "/", hash: id });
  const after = () => setTimeout(() => scrollToId(id), 120);
  if (result && typeof (result as Promise<unknown>).then === "function") {
    (result as Promise<unknown>).then(after);
  } else {
    after();
  }
}
