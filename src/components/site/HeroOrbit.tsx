export function HeroOrbit() {
  return (
    <div className="hero-orbit" aria-hidden="true">
      <div className="hero-orbit__outer">
        {/* 3 orbiting dots */}
        <span className="hero-orbit__dot" style={{ transform: "rotate(0deg) translateX(100px)" }} />
        <span className="hero-orbit__dot" style={{ transform: "rotate(120deg) translateX(100px)" }} />
        <span className="hero-orbit__dot" style={{ transform: "rotate(240deg) translateX(100px)" }} />

        <div className="hero-orbit__inner">
          <div className="hero-orbit__reel">
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
              <circle cx="35" cy="35" r="32" stroke="#00ff41" strokeWidth="2" />
              <circle cx="35" cy="35" r="6" fill="#00ff41" />
              <circle cx="35" cy="12" r="4" fill="#00ff41" />
              <circle cx="35" cy="58" r="4" fill="#00ff41" />
              <circle cx="12" cy="35" r="4" fill="#00ff41" />
              <circle cx="58" cy="35" r="4" fill="#00ff41" />
              <line x1="35" y1="35" x2="35" y2="12" stroke="#00ff41" strokeWidth="1.5" />
              <line x1="35" y1="35" x2="35" y2="58" stroke="#00ff41" strokeWidth="1.5" />
              <line x1="35" y1="35" x2="12" y2="35" stroke="#00ff41" strokeWidth="1.5" />
              <line x1="35" y1="35" x2="58" y2="35" stroke="#00ff41" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
