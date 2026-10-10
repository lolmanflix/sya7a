---
name: video-fetch
description: Download or extract video, audio, reels, shorts, and clips from YouTube, Instagram, TikTok, Facebook, Vimeo and ~1800 other sites using yt-dlp, with bandwidth-frugal defaults (360p cap, audio-only and clip-range presets, no thumbnails/comments, resume). Use when the user asks to save, grab, fetch, download, pull, rip, or archive a video/reel/short/clip/soundtrack from a URL, or wants a video's metadata or formats inspected without downloading it.
---

# video-fetch — Bandwidth-Frugal Media Extraction

Engine: `yt-dlp` (binary at `~/.local/bin/yt-dlp`, symlink to `/var/data/python/bin/yt-dlp`)
Companion: `ffmpeg 7.1.3` (stream merging, clipping, remuxing)
Keyring bridge: `bin/kwallet-query` (forwards to the host — see Platform notes)

## Core principle — bytes, not speed

The user wants **minimum internet data**. Only these actually reduce bytes on
the wire: resolution/format caps, audio-only mode, partial-range capture,
skipping thumbnails/comments, and resuming interrupted transfers.
`--limit-rate` and similar throttles only *rearrange* traffic — never claim
they save data.

All defaults live in one place:
`.opencode/skills/video-fetch/ytdlp-saver.conf`
Never duplicate those flags into ad-hoc commands; override per-call instead.

## Canonical invocation

Run from the project root. `--ignore-config` first so no stray user/system
config can silently widen the bandwidth profile:

```bash
CONF=.opencode/skills/video-fetch/ytdlp-saver.conf
yt-dlp --ignore-config --config-locations "$CONF" "<URL>"
```

## Presets (append to the canonical invocation)

| Budget | Add | Typical cost |
|---|---|---|
| **MIN** — audio only | `-f "ba/b" -x --audio-format m4a` | ~1 MB/min |
| **LOW (default)** — 360p | *(nothing — config already caps at 360p)* | ~3–6 MB/min |
| **MED** — 480p | `-f "bv*[width<=854][height<=480]+ba/b[width<=854][height<=480]/b"` | ~6–10 MB/min |
| **CLIP** — only a time range | `--download-sections "*00:00:10-00:00:40"` | proportional to the range |
| **CLIP accurate cuts** | add `--force-keyframes-at-cuts` (re-encodes, CPU cost) | same download, exact boundaries |
| **PROBE** — metadata only, no media | `-s --print "%(title)s | %(duration)s s | %(format_id)s"` | **≈380 KB** (see cost model) |
| **LIST a playlist cheaply** | `--flat-playlist` (skips per-video extraction) | ~1 request, no per-item metadata |
| **PLAYLIST slice** | `--playlist-items 1-5` (config blocks whole playlists by default) | per-item count |

Prefer **PROBE before every real download**: confirm duration, resolution, and
selected `format_id`, then state the expected data cost to the user. A probe is
*not* free — do it once per URL, never in a loop.

## Measured cost model (this host, 2026-10)

| Operation | Bytes on the wire |
|---|---|
| YouTube metadata extraction (player API JSON + webpage + m3u8) | **≈380 KB** |
| Instagram probe **with Brave cookies** | **≈22 KB** |
| Instagram attempt *without* cookies → fails | ≈311 KB |
| Metadata re-fetch is **not cached** by yt-dlp — every run pays again | |
| Media: audio-only | ~1 MB/min |
| Media: 360p-band (default cap, dual-axis) | ~3–6 MB/min |
| Full fetch = extraction + media | e.g. 19 s clip: ≈380 KB + 532 KB ≈ **912 KB** |

**Portrait-aware capping:** the ladder caps *both* `width<=640` and
`height<=640`. A height-only filter would reject Instagram's 360×638 "360p"
reels and silently fall through to the 720p/11.6 MiB stream.

## Report the cost

Always tell the user how many bytes a fetch consumed. Interface-accurate meter:

```bash
rx() { awk -F: '/:/{ split($2,f," "); if (index($1,"lo")==0) s+=f[1] } END{print s}' /proc/net/dev; }
A=$(rx); <command>; B=$(rx); echo "consumed $((B-A)) B"
```

(Calibrated: reads ~1,080,751 B for a 1,000,000 B payload ≈ 8% protocol overhead.)

## Platform notes

- **YouTube:** extraction needs a JS runtime — the config binds `--js-runtimes node`.
  If formats go missing or you see *"confirm you're not a bot"*, add
  `--cookies-from-browser <browser>` (reads the live browser session; never
  exports a file).
- **Instagram — VERIFIED WORKING via Brave session cookies.** Anonymous
  extraction is blocked (`API is not granting access`); authenticated calls
  cost only ≈22 KB per probe. Always append the pinned profile path:

  ```bash
  BRAVE=/home/kimo/.config/BraveSoftware/Brave-Browser/Default
  yt-dlp --ignore-config --config-locations "$CONF" \
    --cookies-from-browser "brave:$BRAVE" "<URL>"
  ```

  Two environment quirks make the **absolute profile path mandatory**:
  1. This session inherits Flatpak's `XDG_CONFIG_HOME`, so the bare
     `--cookies-from-browser brave` looks in `~/.var/app/...` and fails.
  2. The sandbox cannot see host `/usr`, so yt-dlp's `kwallet-query` lookup is
     served by `bin/kwallet-query` (symlinked into `~/.local/bin`), which
     bridges to the host binary via `flatpak-spawn`. Cookie decryption reads
     Brave's KWallet key — **never print, log, or copy that key or any
     cookie value.**
  Some individual posts still return `HTTP Error 400` even with valid cookies
  (per-availability, not a config fault) — report it and move on rather than
  retrying in a loop.
- Never invent a URL. If none was supplied, ask for it.

## Safety & hygiene

- Media downloads are subject to each platform's Terms of Service — confirm
  intent for anything beyond personal archival.
- `downloads/`, `cookies.txt`, and `*.cookies.txt` are gitignored. Never
  commit a cookie file or a downloaded media asset.
- `--max-filesize 300M` (in the config) aborts runaway pulls.
- Interrupted downloads resume via `--continue` — re-running a command never
  restarts from zero.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `no such option` | Config flag drifted against a yt-dlp upgrade — validate with `yt-dlp --ignore-config --config-locations "$CONF" -s "<URL>"` |
| Missing formats / bot check (YouTube) | `--cookies-from-browser <browser>` |
| `login required` / empty media (Instagram) | Append `--cookies-from-browser "brave:$BRAVE"` — see Platform notes for the mandatory pinned path |
| `could not find brave cookies database` | Flatpak `XDG_CONFIG_HOME` shadowing — pass the **absolute** profile path |
| `kwallet-query command not found` | The `bin/kwallet-query` bridge symlink is missing from `~/.local/bin` |
| `HTTP Error 400` (Instagram) | Per-post availability even with valid cookies — do **not** retry-loop; report and move on |
| `Requested format is not available` | Drop the custom `-f` and let the config ladder fall back |
| Output filename split into bogus URLs | The `-o` template in the config must stay quoted |
