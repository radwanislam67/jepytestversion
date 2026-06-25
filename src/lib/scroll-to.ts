import type { Router } from "@tanstack/react-router";

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = 90;
  const top = el.getBoundingClientRect().top + window.scrollY - header;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
}

export function navigateToSection(
  router: Router<any, any, any, any>,
  pathname: string,
  id: string,
) {
  if (pathname === "/") {
    scrollToId(id);
    return;
  }
  router.navigate({ to: "/", hash: id }).then(() => {
    setTimeout(() => scrollToId(id), 80);
  });
}
