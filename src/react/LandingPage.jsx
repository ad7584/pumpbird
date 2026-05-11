// ============================================================
// LandingPage — bold/playful marketing page.
// Sections: hero · countdown · coin · about · CTA · footer
// All copy + tunables come from ./site.config.js
// ============================================================
import { useEffect, useState, useCallback } from 'react';
import {
  LEADERBOARD_LAUNCH_DATE,
  BRAND,
  TOKEN,
  SOCIALS,
  HERO,
  SECTIONS,
  FEATURES,
  NAV,
  FOOTER,
} from './site.config.js';
import BirdSVG from './BirdSVG.jsx';

export default function LandingPage({ onPlay, bestScore = 0, lastScore = 0 }) {
  const [timer, setTimer] = useState(() => getTimerParts(LEADERBOARD_LAUNCH_DATE));
  const [caCopied, setCaCopied] = useState(false);

  useEffect(() => {
    const id = setInterval(
      () => setTimer(getTimerParts(LEADERBOARD_LAUNCH_DATE)),
      1000
    );
    return () => clearInterval(id);
  }, []);

  const copyCA = useCallback(() => {
    if (!TOKEN.contractAddress) return;
    try {
      navigator.clipboard.writeText(TOKEN.contractAddress);
      setCaCopied(true);
      setTimeout(() => setCaCopied(false), 1500);
    } catch {}
  }, []);

  const timerSub = timer.expired
    ? SECTIONS.timer.subLive
    : SECTIONS.timer.subUpcoming.replace('{date}', formatLaunchDate(LEADERBOARD_LAUNCH_DATE));

  return (
    <div className="lp">
      {/* Decorative background — chunky shapes */}
      <div className="lp-bg" aria-hidden>
        <div className="lp-shape lp-shape-circle lp-shape-1" />
        <div className="lp-shape lp-shape-blob lp-shape-2" />
        <div className="lp-shape lp-shape-circle lp-shape-3" />
        <div className="lp-shape lp-shape-square lp-shape-4" />
        <div className="lp-shape lp-shape-circle lp-shape-5" />
      </div>

      {/* HEADER */}
      <header className="lp-header">
        <a href="#top" className="lp-logo">
          <span className="lp-logo-mark">P</span>
          <span className="lp-logo-text">
            {splitBrandName(BRAND.name)}
          </span>
        </a>
        <nav className="lp-nav">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="lp-nav-link">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="lp-actions">
          <SocialIcons />
          <button className="lp-btn-pill lp-btn-pill-pink" onClick={onPlay}>
            PLAY ▶
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="lp-hero" id="top">
        <div className="lp-hero-text">
          <div className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            {HERO.eyebrow}
          </div>
          <h1 className="lp-title">
            {HERO.titleLines.map((line, i) => (
              <span
                key={i}
                className={
                  'lp-title-row' +
                  (i === HERO.accentLineIndex ? ' lp-title-row-accent' : '')
                }
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="lp-blurb">{HERO.blurb}</p>

          <div className="lp-hero-cta">
            <button className="lp-btn-play" onClick={onPlay}>
              <span className="lp-btn-play-label">{HERO.primaryCta}</span>
              <span className="lp-btn-play-arrow">→</span>
            </button>
            <a href="#about" className="lp-btn-ghost">{HERO.secondaryCta}</a>
          </div>

          {(bestScore > 0 || lastScore > 0) && (
            <div className="lp-score-row">
              {bestScore > 0 && (
                <span className="lp-score-pill lp-score-pill-best">
                  <span className="lp-score-pill-lbl">BEST</span>
                  <span className="lp-score-pill-val">{bestScore}</span>
                </span>
              )}
              {lastScore > 0 && (
                <span className="lp-score-pill">
                  <span className="lp-score-pill-lbl">LAST</span>
                  <span className="lp-score-pill-val">{lastScore}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="lp-hero-art" aria-hidden>
          <div className="lp-hero-card">
            <BirdSVG className="lp-hero-bird" />
            <div className="lp-hero-badge">{HERO.birdBadge}</div>
          </div>
          <div className="lp-hero-stamp lp-hero-stamp-1">★</div>
          <div className="lp-hero-stamp lp-hero-stamp-2">✦</div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="lp-section lp-timer-section" id="timer">
        <div className="lp-section-tag">{SECTIONS.timer.tag}</div>
        <h2 className="lp-section-title">
          {timer.expired ? (
            <>LEADERBOARD <span className="lp-section-accent">{SECTIONS.timer.titleLive}</span></>
          ) : (
            <>
              {SECTIONS.timer.titlePrefix}{' '}
              <span className="lp-section-accent">{SECTIONS.timer.titleUpcoming}</span>
            </>
          )}
        </h2>
        <div className="lp-timer">
          <Chunk value={timer.days}  label="DAYS" />
          <Chunk value={timer.hours} label="HOURS" />
          <Chunk value={timer.mins}  label="MINS" />
          <Chunk value={timer.secs}  label="SECS" />
        </div>
        <p className="lp-section-sub">{timerSub}</p>
      </section>

      {/* COIN */}
      <section id="coin" className="lp-section lp-coin-section">
        <div className="lp-section-tag">{SECTIONS.coin.tag}</div>
        <h2 className="lp-section-title">
          {SECTIONS.coin.titlePrefix}{' '}
          <span className="lp-section-accent">{SECTIONS.coin.titleAccent}</span>
        </h2>
        <p className="lp-section-sub">{SECTIONS.coin.sub}</p>

        <div className="lp-coin-card">
          <div className="lp-coin-head">
            <div className="lp-coin-meta">
              <div className="lp-coin-symbol">{TOKEN.symbol}</div>
              <div className="lp-coin-net">{SECTIONS.coin.networkLabel}</div>
            </div>
            <button
              className="lp-btn-pill lp-btn-pill-pink lp-coin-buy"
              onClick={copyCA}
            >
              {caCopied ? SECTIONS.coin.copiedLabel : SECTIONS.coin.buyButton}
            </button>
          </div>

          <div className="lp-ca-row">
            <span className="lp-ca-label">{SECTIONS.coin.contractLabel}</span>
            <span className="lp-ca-val">{TOKEN.contractAddress}</span>
            <button
              className="lp-ca-copy"
              onClick={copyCA}
              aria-label="Copy contract address"
            >
              {caCopied ? '✓' : '📋'}
            </button>
          </div>

          {TOKEN.perks?.length > 0 && (
            <ul className="lp-perks">
              {TOKEN.perks.map((p, i) => (
                <li key={i} className="lp-perk">
                  <span className="lp-perk-dot" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="lp-section lp-about-section">
        <div className="lp-section-tag">{SECTIONS.about.tag}</div>
        <h2 className="lp-section-title">
          {SECTIONS.about.titlePrefix}{' '}
          <span className="lp-section-accent">{SECTIONS.about.titleAccent}</span>
        </h2>
        <div className="lp-about-grid">
          {FEATURES.map((f, i) => (
            <Feature key={i} emoji={f.emoji} title={f.title} body={f.body} />
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-finalcta">
        <h2 className="lp-finalcta-title">
          {SECTIONS.finalCta.titlePrefix}{' '}
          <span className="lp-section-accent">{SECTIONS.finalCta.titleAccent}</span>
        </h2>
        <button className="lp-btn-play lp-btn-play-lg" onClick={onPlay}>
          <span className="lp-btn-play-label">{SECTIONS.finalCta.button}</span>
          <span className="lp-btn-play-arrow">→</span>
        </button>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <span className="lp-logo-mark lp-logo-mark-sm">P</span>
          <span>{FOOTER.brandLine}</span>
        </div>
        <div className="lp-footer-tag">{FOOTER.tagline || BRAND.tagline}</div>
        <div className="lp-footer-links">
          <SocialIcons />
        </div>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

function Chunk({ value, label }) {
  return (
    <div className="lp-timer-chunk">
      <div className="lp-timer-num">{String(value).padStart(2, '0')}</div>
      <div className="lp-timer-lbl">{label}</div>
    </div>
  );
}

function Feature({ emoji, title, body }) {
  return (
    <div className="lp-feature">
      <div className="lp-feature-emoji" aria-hidden>{emoji}</div>
      <div className="lp-feature-title">{title}</div>
      <div className="lp-feature-body">{body}</div>
    </div>
  );
}

function SocialIcons() {
  const items = [
    { key: 'x',        url: SOCIALS.x,        Icon: XIcon,        label: 'X (Twitter)' },
    { key: 'telegram', url: SOCIALS.telegram, Icon: TelegramIcon, label: 'Telegram' },
    { key: 'discord',  url: SOCIALS.discord,  Icon: DiscordIcon,  label: 'Discord' },
  ].filter((s) => !!s.url);
  if (!items.length) return null;
  return (
    <div className="lp-social-row">
      {items.map(({ key, url, Icon, label }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="lp-social-btn"
          aria-label={label}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}

// Split "PRINTR BIRD" into "PRINTR" + accent "BIRD" so the second word
// can render in pink without us hardcoding a value.
function splitBrandName(name) {
  const parts = name.split(' ');
  if (parts.length < 2) return name;
  const last = parts.pop();
  return (
    <>
      {parts.join(' ')} <span className="lp-logo-accent">{last}</span>
    </>
  );
}

// --- icons ---
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.643.135-.953l11.566-4.458c.538-.196 1.006.128.832.949z" />
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.027 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.42 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.335-.956 2.42-2.157 2.42zm7.974 0c-1.183 0-2.157-1.085-2.157-2.42 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.335-.946 2.42-2.157 2.42z" />
    </svg>
  );
}

// --- date helpers ---
function getTimerParts(launchIso) {
  const diff = new Date(launchIso).getTime() - Date.now();
  if (isNaN(diff) || diff <= 0) {
    return { days: 0, hours: 0, mins: 0, secs: 0, expired: true };
  }
  const total = Math.floor(diff / 1000);
  return {
    days:  Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    mins:  Math.floor((total % 3600) / 60),
    secs:  total % 60,
    expired: false,
  };
}
function formatLaunchDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    });
  } catch {
    return 'launch day';
  }
}
