import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Youtube, Twitter, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-5xl md:text-7xl tracking-tighter">
              Let&apos;s craft<br />something
              <span className="text-[var(--accent)] text-glow"> exceptional.</span>
            </div>
            <Link to="/contact" className="btn-primary mt-8">
              Book A Call <ArrowUpRight size={18} />
            </Link>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">Navigate</div>
            <ul className="space-y-3 text-foreground/80">
              <li><Link to="/work" className="hover:text-[var(--accent)] transition-colors">Work</Link></li>
              <li><Link to="/services" className="hover:text-[var(--accent)] transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-[var(--accent)] transition-colors">About</Link></li>
              <li><Link to="/case-studies" className="hover:text-[var(--accent)] transition-colors">Case Studies</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">Elsewhere</div>
            <ul className="space-y-3 text-foreground/80">
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--accent)]"><Instagram size={16}/> Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--accent)]"><Linkedin size={16}/> LinkedIn</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--accent)]"><Youtube size={16}/> YouTube</a></li>
              <li><a href="https://x.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--accent)]"><Twitter size={16}/> X</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Jepy. Your Content, Elevated.</div>
          <div className="font-mono">Built for creators, brands & SaaS.</div>
        </div>
      </div>
    </footer>
  );
}
