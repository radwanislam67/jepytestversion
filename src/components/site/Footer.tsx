import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import jepyLogo from "@/assets/jepy-logo.png";

export function Footer() {
  return (
    <footer id="about" className="relative mt-10 border-t border-white/5 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] items-start">
          <div>
            <Link to="/" aria-label="Jepy home" className="inline-flex items-center mb-6">
              <img src={jepyLogo} alt="Jepy" className="h-10 w-auto" draggable={false} />
            </Link>
            <p className="text-foreground/70 max-w-md leading-relaxed">
              Jepy is a premium cinematic post-production studio crafting elevated edits
              for creators, brands and SaaS.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">
              Navigate
            </div>
            <ul className="space-y-3 text-foreground/80">
              <li><Link to="/work" className="hover:text-[var(--accent)] transition-colors">Work</Link></li>
              <li><Link to="/services" className="hover:text-[var(--accent)] transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">
              Elsewhere
            </div>
            <ul className="space-y-3 text-foreground/80">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--accent)]"><Instagram size={16}/> Instagram</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--accent)]"><Youtube size={16}/> YouTube</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--accent)]"><Linkedin size={16}/> LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 text-xs text-muted-foreground">
          © 2026 Jepy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
