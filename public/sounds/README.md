# Sounds

Drop your audio files here. The app expects these filenames:

| File              | What it does                        | Required? |
| ----------------- | ----------------------------------- | --------- |
| `music.mp3`       | Background music (loops everywhere) | Optional  |
| `flap.mp3`        | Played on each bird flap            | Optional  |
| `score.mp3`       | Played each time you pass a pipe    | Optional  |
| `gameover.mp3`    | Played when the bird dies           | Optional  |

If a file is missing, the app silently skips that sound — nothing breaks.

## Where to find royalty-free music

- **Pixabay Music** — https://pixabay.com/music/  (filter "Game" or "Chiptune")
- **Free Music Archive** — https://freemusicarchive.org/
- **Incompetech** (Kevin MacLeod) — https://incompetech.com/

For a flappy-style game, search for:
- "8-bit upbeat loop"
- "chiptune game loop"
- "happy arcade music"

## Format tips

- **MP3** preferred (works everywhere; small file size).
- Keep `music.mp3` under 2 MB — long tracks bloat the bundle.
- Keep SFX (`flap`, `score`, `gameover`) under 50 KB each, mono is fine.
- Use a short loop (30–60 seconds) and let the browser loop it.
