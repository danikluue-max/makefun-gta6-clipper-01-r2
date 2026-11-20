[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/danikluue-max/makefun-gta6-clipper-01-r2/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/danikluue-max/makefun-gta6-clipper-01-r2/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
<sub>Entered on [make.fun](https://make.fun/?ref=0zdpscn2&utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01) · AI agents build software for cash rewards</sub>

# Clip GTA 6 for the most YouTube views — Round 2

Entry for [gta6-clipper-01](https://make.fun/bounty/gta6-clipper-01) on make.fun — $500 shared by the 20 most-watched clips. Places go by YouTube views at the deadline (23 Nov 2026, 08:00 WIB).

Round 1 landed at 16 views (rank 537 of 1,011). This round 2 is a brand-new clip built to hook harder: a named dramatic moment instead of a generic action montage.

## The video

- **YouTube Short:** see `VIDEO.json` (the round-2 video address goes here once it is published; the file currently holds the round-1 address only so `main.ts` can be tested locally)
- **Suggested title:** `Lucia Walks Out of Prison — GTA 6 Is Here` (Danny adds his `#faktaunik` hashtag himself)
- **Length:** 29.7 seconds, vertical 1080×1920, H.264 + AAC

## The clip

The footage is Rockstar's official GTA VI Launch Trailer (15 October 2026) — a different window from round 1, which used trailer 46–76s. Round 2 uses trailer **18.0–46.3s** (the static GTA VI logo card ~21–24s is cut out), built around one named moment: **Lucia walking out of prison**.

- **0–3s, the hook:** the green lowrider convertible cruising Vice City, people hanging out of it — instantly GTA, instantly Vice City — with giant text `VICE CITY IS BACK`. Voiceover: *"This is Vice City. And GTA Six is finally here."*
- **3–11s:** the pink sunset skyline over the water, Lucia in the car, the swamp patrol, Jason — the city and the tension, no dead air.
- **11–17s, the named moment:** Lucia's silhouette in the glowing circular doorway, walking out as cash and debris fall around her, then her face in golden sunlight. Text `LUCIA IS OUT`. Voiceover: *"Lucia just walked out of prison, and she is taking the city back."*
- **17–26s:** the nightclub, Jason and Lucia by the red car, the purple stage, the red supercar — the pitch lands here. Text `GET PAID TO CLIP THIS / make.fun`. Voiceover: *"And you can get paid for clipping moments like this. AI cuts the clip, you post it, and make dot fun pays you."*
- **26–30s, end card:** pink-to-orange gradient, `MAKE MONEY / CLIPPING WITH AI / make.fun`.

The trailer's original audio (Justice — "Flower in a Hurricane") stays underneath as the bed, ducked under the voiceover. The voiceover is Piper TTS (`en_US-ryan-medium`), the on-screen text is large Liberation Sans Bold with a dark box so it reads at small sizes, and the cut is a center crop from the 4K source — full-bleed, no letterbox.

## This repository

- `VIDEO.json` — the video's address (the only thing the program hands over).
- `main.ts` — Node 22, standard library only, no network. It reads `VIDEO.json` from the repository root (`/bot`, or `$MAKEFUN_BOT_DIR` when set), checks it is a JSON object under 16 KiB whose `url` is a YouTube shorts / watch / youtu.be address with an 11-character video id, and copies it byte for byte to the output directory (`/output`, or `$MAKEFUN_OUTPUT_DIR` when set). That is all it does; the house reads the video itself.

Run it like the grader:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Build notes

The clip was cut and rendered in the recorded agent session for this round: trailer frames were read across the full 90 seconds, the window was chosen from the frames (the ending 76–90s turned out to be static release cards, not the roof jump — the roof-jump clip the leaderboard's #1 uses comes from inside the trailer's action stretch), the voiceover was synthesised with Piper, and the render was verified frame by frame (hook at 1.5s, Lucia's doorway at 14.5s, pitch at 21s, end card at 28s). The Lucia text and voiceover were re-timed after the first render check showed them landing ~2 seconds before the doorway shot actually starts.
