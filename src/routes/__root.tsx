import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import jepyLogo from "@/assets/jepy-logo.png";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Cursor } from "@/components/site/Cursor";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { Loader } from "@/components/site/Loader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl tracking-tighter text-glow">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">This frame doesn&apos;t exist.</p>
        <div className="mt-8">
          <Link to="/" className="btn-primary">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl">Something cut out</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">Try again</button>
          <a href="/" className="btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#050505" },
      { title: "Jepy | Your Content, Elevated." },
      { name: "description", content: "Jepy is a premium cinematic post-production studio crafting elevated edits for creators, brands and SaaS." },
      { property: "og:site_name", content: "Jepy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Jepy | Your Content, Elevated." },
      { name: "twitter:title", content: "Jepy | Your Content, Elevated." },
      { property: "og:description", content: "Jepy is a premium cinematic post-production studio crafting elevated edits for creators, brands and SaaS." },
      { name: "twitter:description", content: "Jepy is a premium cinematic post-production studio crafting elevated edits for creators, brands and SaaS." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/crUWaju6dwceyxGbiMreaEozCci2/social-images/social-1782166453906-1000003282.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/crUWaju6dwceyxGbiMreaEozCci2/social-images/social-1782166453906-1000003282.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: jepyLogo },
      { rel: "apple-touch-icon", href: jepyLogo },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Jepy",
          slogan: "Your Content, Elevated.",
          description: "Premium cinematic post-production studio.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="noise">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Skip scroll-to-top when the URL has a hash — let the browser jump to
    // the anchor (e.g. /#pricing, /#services) naturally.
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (el) {
        // Defer until layout settles so the anchor target exists.
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "auto", block: "start" });
        });
      }
      return;
    }
    window.scrollTo(0, 0);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Loader />
      <Cursor />
      <SmoothScroll />
      <ScrollProgress />
      <Header />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
