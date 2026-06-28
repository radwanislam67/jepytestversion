import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Twitter, Mail } from "lucide-react";
import jepyLogo from "@/assets/jepy-logo.png";

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_auto] items-start">
          {/* Brand */}
          <div>
            <Link to="/" aria-label="Jepy home" className="inline-flex items-center mb-5">
              <img src={jepyLogo} alt="Jepy" className="h-10 w-auto" draggable={false} />
            </Link>
            <p className="text-foreground/70 max-w-md leading-relaxed text-sm">
              Premium cinematic post-production for creators, brands and SaaS.
            </p>
            <div className="mt-5 space-y-2 text-sm text-foreground/80">
              <a
                href="mailto:hello@jepy.studio"
                className="inline-flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
              >
                <Mail size={14} /> hello@jepy.studio
              </a>
              <br />
              <a
                href="tel:+10000000000"
                className="inline-flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
              >
                <Phone size={14} /> +1 (000) 000-0000
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">
              Navigate
            </div>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li><Link to="/work" className="hover:text-[var(--accent)] transition-colors">Work</Link></li>
              <li><Link to="/services" className="hover:text-[var(--accent)] transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-[var(--accent)] transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">
              Legal
            </div>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li><Link to="/" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-[var(--accent)] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5">
              Follow
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-foreground/80 hover:text-[var(--accent)] hover:border-[var(--accent)]/60 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-foreground/80 hover:text-[var(--accent)] hover:border-[var(--accent)]/60 transition-colors"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-foreground/80 hover:text-[var(--accent)] hover:border-[var(--accent)]/60 transition-colors"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>
      </div>

      </div>
    </footer>
  );
}
