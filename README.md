# Printr Bird

Flappy-style game with a bold/playful landing page.

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to ./dist
npm run preview  # preview the built bundle
```

## Flow

1. **Landing** — public marketing page with countdown, coin details, contract, socials, PLAY NOW button.
2. **Game home** — bird preview, START button, BEST + LAST score, BACK to landing.
3. **Game** — Phaser canvas. Bird hovers idle until first tap/space/up. Score persists to localStorage.

## Edit page content (one file)

Every visible string and link lives in **`src/react/site.config.js`**. Open that file, edit, save — Vite hot-reloads instantly.

What you can change there:

- **Countdown launch date** — `LEADERBOARD_LAUNCH_DATE`
- **Brand name, tagline, subline** — `BRAND`
- **Token symbol, network, contract address, perks** — `TOKEN`
- **Social links** (X, Telegram, Discord — leave a link `''` to hide) — `SOCIALS`
- **Hero copy** — eyebrow text, big title lines, blurb, button labels — `HERO`
- **Section titles, subtitles, and labels** — `SECTIONS`
- **About-card emoji, title, body** — `FEATURES` (add/remove cards freely)
- **Header nav links** — `NAV`
- **Footer brand line + tagline** — `FOOTER`

## Sounds & music

Drop audio files into `public/sounds/`:

| File              | What it does                        |
| ----------------- | ----------------------------------- |
| `music.mp3`       | Background music (loops everywhere) |
| `flap.mp3`        | Played on each bird flap            |
| `score.mp3`       | Played each time you pass a pipe    |
| `gameover.mp3`    | Played when bird dies               |

Missing files are silently skipped. Volume defaults to 30% for both music and SFX (adjust `VOLUME_MUSIC` / `VOLUME_SFX` in `src/react/AudioManager.jsx`).

Users can mute via the speaker button (top-right of every screen). Mute state persists in localStorage.

## Customize the bird

The cartoon bird is drawn two ways depending on context:

- **Website** (landing + home screens): `src/react/BirdSVG.jsx` — pure SVG, edit colors via the `fill` / `stroke` attributes.
- **In-game**: `src/objects/Bird.js` — drawn procedurally with Phaser. Edit the color constants at the top (`BODY`, `BELLY`, `WING`, etc.) to retheme.

Both files share the same palette, so changing colors in one place is mostly find-and-replace in the other.

## File map

```
src/
  App.jsx                  three-view router + AudioManager mount
  main.jsx                 React entry
  react/
    site.config.js         ALL page strings + links live here
    LandingPage.jsx        bold/playful landing page
    GameHome.jsx           pre-game home screen
    GameShell.jsx          mounts the Phaser canvas
    BirdSVG.jsx            shared detailed bird SVG
    AudioManager.jsx       background music + SFX + mute toggle
  scenes/
    BootScene.js           one-shot setup
    PreloadScene.js        procedurally generates textures
    GameScene.js           gameplay (paused until first input)
    UIScene.js             HUD + game-over modal
  objects/                 Bird / Pipe / Background / Pickup
  sim/                     RNG + spawn math
  phaser/bootstrap.js      Phaser config

public/
  sounds/                  drop your mp3s here
  favicon.svg              site favicon
  icons/                   (empty — used to host PWA icons)

style.css                  full stylesheet
index.html                 loads Bagel Fat One + DM Sans
config.js                  game tuning (gravity, speed, gap sizes, colors)
```

## Score persistence

Two keys in `localStorage`:

| Key | Meaning |
|---|---|
| `pb_best_score` | All-time high score |
| `pb_last_score` | Most recent run |
| `pb_muted`      | Audio mute state |

Score dispatches to the React layer the moment the game-over modal opens — listen for `printr:score-update` if you later want to wire a backend leaderboard.

## Quick edit cheatsheet

| Change | File | What to edit |
|---|---|---|
| Title text | `site.config.js` | `HERO.titleLines` |
| Contract address | `site.config.js` | `TOKEN.contractAddress` |
| Launch countdown | `site.config.js` | `LEADERBOARD_LAUNCH_DATE` |
| Add Telegram link | `site.config.js` | `SOCIALS.telegram` |
| Add/remove an about card | `site.config.js` | `FEATURES` array |
| Bird colors (website) | `src/react/BirdSVG.jsx` | `fill="..."` attrs |
| Bird colors (in-game) | `src/objects/Bird.js` | Color constants at top |
| Music / SFX volume | `src/react/AudioManager.jsx` | `VOLUME_MUSIC`, `VOLUME_SFX` |
| Background colors | `src/objects/Background.js` | `COL` constants |
