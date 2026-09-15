# SENSYRA '26 — Site

Built with [Vite](https://vitejs.dev) + a real Three.js hero background as
of this pass. Requires Node.js 20.19+ or 22.12+ (Vite 8's minimum --
check with `node -v`; if you're on an older Node, install the current LTS
from nodejs.org).

## Run it

```bash
npm install       # one-time
npm run dev        # local dev server with hot reload
npm run build       # production build -> dist/
npm run preview      # serve the built dist/ locally, to sanity-check before deploying
```

Deploy the contents of `dist/` to any static host (Netlify, Vercel, GitHub
Pages, etc.) at the site's **domain root** — the build uses root-absolute
paths (`/js/...`) for the plain scripts, so a subpath deployment (e.g.
`example.com/sensyra/`) needs those adjusted, or a `<base href>` tag added.

A pre-built `dist/` is included in this delivery so you can deploy
immediately without running the build yourself — `npm run build` regenerates
it any time you change something.

## Dependency notes

Pinned to Vite 8 (tested end-to-end: `dev`, `build`, and `preview` all
verified against a real served build, plus the multi-page/module-script
setup this project actually uses). The `npm audit` warning you may see on
an older lockfile is about Vite 5's dev-server-only transitive
dependencies -- irrelevant once you're on 8, and low real-world risk even
on 5 since it never affects the production `dist/` output, only your local
dev server. `npm audit fix --force` is safe to run here if you ever see it
again; just re-run `npm run build` afterward to confirm nothing broke, the
same way this pass was verified.

## Key dates (already wired in)

- Event day: **14 Oct 2026**
- Online registration closes: **12 Oct 2026** — this is what the countdown
  in `public/js/countdown.js` actually counts down to (`REGISTRATION_DEADLINE`
  near the top of that file). Both dates also appear in the hero note, the
  status band, and the About section's "When" row.

## Structure

```
index.html                    homepage
events/*.html                  6 event detail pages
css/style.css                   design system + all styles
public/js/                       plain scripts, copied as-is to dist/js/
  main.js                          nav + active-section tracking
  countdown.js                     registration countdown
  roadmap.js                       canvas timeline (Plan of Action)
  reveal.js                        scroll-reveal system (see "Reveal safety" below)
  doodles.js                       original line-art motifs, auto-mounts on [data-doodle] canvases
  cursor-spark.js                  desktop-only gold cursor spark trail
src/hero-scene.js                the ONE module -- Three.js hero particle background
assets/logo-*.png                 your uploaded emblem, used only in the nav + footer
vite.config.js                   multi-page build config (all 7 HTML files as entries)
```

`public/` vs `src/`: everything in `public/js/` is plain vanilla JS with no
imports, so it's just copied through untouched. `src/hero-scene.js` is the
one file that needs Vite's bundler, because it does `import ... from
"three"` -- a bare specifier a browser can't resolve on its own.

## This pass: bug fixes

Three real bugs were found and fixed, not just papered over:

1. **Countdown showing nothing** -- was intentional: no deadline existed
   yet. Now set to the real dates above.
2. **Hamburger menu not opening correctly on mobile** -- `.nav` has
   `backdrop-filter`, which (like `filter`) silently changes the containing
   block for `position: fixed` descendants. The mobile menu panel was
   nested inside `.nav`, so it was positioning itself relative to the
   68px-tall nav bar instead of the viewport. Fixed by moving the panel to
   be a sibling of `<header class="nav">` instead of a child.
3. **Events invisible and unclickable, second Register CTA vanished** --
   the previous scroll-reveal pass hid these elements by default in plain
   CSS (`clip-path`), only revealing them once JavaScript ran. If that JS
   ever failed to fire, the content stayed permanently invisible *and*
   unclickable, since a clipped-away area doesn't receive pointer events.
   Rewrote the system (`reveal.js` + the `.reveal-armed` gate in
   `style.css`) so every `[data-reveal]` element is fully visible by
   default; JS only arms the hidden-then-reveal animation once it confirms
   it's actually running, and a hard 4-second timeout force-reveals
   everything regardless, as a last resort. Nothing on this site can be
   permanently hidden by a script failure again.

## This pass: what's new

- **Logo** -- your uploaded emblem now appears in the nav brand and the
  footer brand only, nowhere else, per your instruction. Source files are
  `assets/logo-128.png` / `logo-256.png` (cropped + resized from your
  upload).
- **Doodle fields** (`public/js/doodles.js`) -- six original geometric
  motifs (a concentric-ring/arc mark, a hammer silhouette, a web, a
  shield-and-star, a bolt, a small radiating "spider" mark) drawn as
  stroke-only line art, never a reproduction of any trademarked logo.
  Auto-mounts on any `<canvas data-doodle='{...}'>` -- the JSON attribute
  controls count, opacity, size range, and which fraction of the canvas
  they're allowed to occupy (`xRange`/`yRange`), so they can be aimed at
  genuinely empty space instead of sitting under text. Placed in the About
  section, Contact section, both corners of the second Register band, and
  behind every event detail page's body copy. They're static (drawn once,
  redrawn on resize) rather than continuously animated, on purpose -- with
  this many canvases on one page, a shared idle rAF loop per canvas was a
  real cost for very little visual gain; the organic scatter itself reads
  as "flowing" without spending a frame budget on it.
- **Hero** -- gained a real WebGL background (see below), its own doodle
  layer, a floating fact panel (date / venue / entry fee) for the empty
  right side on desktop, and a slightly stronger shield-mark opacity.
- **About section** -- a ring-and-arc emblem now anchors the previously-bare
  left column, paired with the tagline, plus its own doodle field behind it.
- **Event roster** -- each of the six rows now has a small themed icon
  (document, chip, gavel, trophy, clapperboard, brush) ahead of its name.
- **Cursor** -- a minimal gold spark trail on desktop-with-a-mouse only
  (`public/js/cursor-spark.js`); skipped on touch and under
  `prefers-reduced-motion`. Throttled to a sprinkle, not a firehose.
- **Hero background is now real WebGL** (`src/hero-scene.js`) -- two
  `THREE.Points` layers (far/near depth), additive blending, slow group
  drift, mouse parallax on desktop / scroll parallax on touch, paused via
  `IntersectionObserver` + `visibilitychange`, and disposed on `pagehide`.
  If it can't run at all (old browser, no WebGL, or the page is opened
  without building it -- see below), the `.hero-atmosphere` CSS gradient is
  still there underneath, so the hero never looks broken, just less alive.
  Honest trade-off: three.js's renderer core alone is a real ~115KB gzipped
  even with named imports and full tree-shaking -- that's the going rate for
  actual WebGL, not a sign something's mis-configured.

## Things worth knowing before you deploy

- **This site now needs the build step.** Double-clicking `index.html`
  straight from the source folder will show the layout and styling, but
  the hero's WebGL particles won't load (bare `import "three"` can't
  resolve without a bundler) and the root-absolute `/js/...` script paths
  won't resolve from `file://`. Always go through `npm run dev` /
  `npm run build` + serve `dist/`.
- Palette, if you want to retheme again: `--verdant` / `--verdant-2` /
  `--brass` at the top of `css/style.css`.
- No prize-pool amount is shown anywhere -- none was ever supplied, and one
  wasn't invented just to have a visual moment for it.

## Visual overhaul pass (v4) — more energy, on purpose

The earlier passes were intentionally restrained. Direct feedback was that
restraint was reading as "unfinished" and "too minimal" for a *fun,
attractive event site* rather than a professional portfolio piece — so
this pass turns the energy up deliberately, not by accident:

- **Fixed the About-section ring** -- it wasn't a design choice, it was a
  bug: the two circles were stroked in `var(--line)`, a ~14%-opacity
  border color meant for subtle hairlines, so they were nearly invisible
  against the dark background while a bright gold arc floated in front of
  them, reading as a broken/incomplete circle. It's now an obviously
  intentional "reactor" emblem: two visible rings, a glowing core, and two
  arcs continuously counter-rotating at different speeds (`.about-mark-spin`
  / `-spin-rev` in `style.css`).
- **A new color, used sparingly**: `--cosmic` (a violet, `#a561e0`) joins
  verdant and brass as a third accent -- mixed into the hero atmosphere,
  the WebGL particle field, and the doodle palette, for a proper
  multi-hue "cosmic" feel rather than a two-tone one. Still weighted so
  verdant/brass dominate and violet is the occasional accent.
- **Hero, much more alive**: the atmosphere gradient now drifts slowly and
  continuously (`nebula-drift`, 46s loop); a new large rotating "halo" ring
  (`.hero-halo`) sits behind the shield mark with two independently
  counter-rotating energy arcs; the lightning crack now has a slow glow
  pulse; the WebGL particle field got denser, brighter, and a third hue.
- **Doodles now move**: `doodles.js` gained an `animate` option -- each
  shape slowly rotates around its own center at its own speed (not a
  single group rotation), plus an optional glow (`shadowBlur`) so they read
  as glowing sigils rather than flat scattered line art. All instances
  across the site now animate; still paused off-screen and under
  `prefers-reduced-motion`, same safety pattern as everywhere else.
- **Energy dividers** -- a thin shimmering gradient line (verdant → brass →
  violet, continuously sweeping) marks three section transitions (About→
  Roadmap, Roadmap→Events, Register→FAQ) for more of a "cinematic cut"
  feel between chapters, without putting one on every single boundary.

None of this touches the bug fixes from the previous pass (countdown,
hamburger menu, the reveal-safety rework) -- those are untouched and still
verified working via a real `npm run build` + `npm run preview` + curl
smoke test before every delivery.

## Round of real fixes, verified with an actual headless browser (v5)

Two more real bugs, both found the same honest way: I installed Puppeteer
in my own environment, built and served the site, and looked at the actual
rendered output instead of reasoning from code alone -- which is exactly
how these two had gone undetected through code review.

- **The "unfinished circle" bug existed in two more places** -- the small
  ring markers above "Plan of Action" and "Event Descriptions" had the
  identical flaw as the About-section ring from the previous round (a
  near-invisible ring plus a partial arc). Same fix applied: bold visible
  rings, a glowing core, a continuously-rotating arc.
- **The real cause of the "tangled wires" doodles**: every doodle
  `<canvas>` was silently stuck at the browser's default canvas size --
  300x150px -- because `position: absolute; inset: 0` alone does not
  stretch a `<canvas>` element (it's a "replaced element", the same
  category as `<img>`; it needs an explicit `width`/`height` too, which
  was missing). Every doodle field was cramming all its shapes into a tiny
  300x150 box in the corner of a much larger section, no matter how much
  spacing logic sat on top of it. Confirmed with `getComputedStyle` before
  and after: every canvas now correctly reports its real section size.
  `doodles.js` also got simpler shapes and real minimum-spacing between
  placements as a second layer of insurance, but the CSS fix was the
  actual cause.

## Premium motion pass, with GSAP (v6)

Added GSAP (gsap.com) + ScrollTrigger -- the real, industry-standard
animation library behind the majority of cinematic/portfolio-style sites --
rather than wiring in unverified third-party script tags from unfamiliar
domains, which isn't something to do on trust alone.

- **Hero entrance**: a proper orchestrated sequence instead of a single
  clip-path wipe -- atmosphere and halo scale in, the shield fades in, the
  eyebrow slides up, the title staggers in line-by-line with an `expo.out`
  ease, then the tagline, CTA, and the fact-panel HUD follow in sequence.
  All in `src/motion.js`.
- **Scroll parallax**: the hero's atmosphere and halo now drift at a
  different rate than the scroll itself (`ScrollTrigger` with `scrub`),
  which is what actually reads as "depth" rather than a static image
  behind text.
- **Magnetic buttons**: the primary CTA gently leans toward the cursor
  within a small radius on desktop, then eases back -- a standard premium
  micro-interaction, done with `gsap.quickTo` for a genuinely smooth feel.
- **Safety, applied up front this time**: every hidden starting state in
  `motion.js` is set by `gsap.from()` at runtime, never baked into CSS.
  If this script fails to load for any reason, every element it would
  animate is already sitting in its normal, fully visible CSS state --
  verified by loading the page with `prefers-reduced-motion` on and
  confirming everything (title, CTA, HUD) is visible within 200ms, with no
  dependency on a script that might not run. Same lesson the reveal-system
  bug taught, applied proactively here instead of found after the fact.
- The old CSS-only hero-title reveal (`.hero-clip` / `.is-ready`) was
  retired in favor of the GSAP timeline -- `hero-clip` is now a pure JS
  selector hook with intentionally no CSS rule of its own.
- Bundle cost: GSAP + ScrollTrigger add real weight (~160KB gzipped for
  the homepage's JS, including Three.js) -- but only the homepage pays it;
  confirmed the six event detail pages don't reference that bundle at all.

## Structural fix: scripts now work no matter how you open the site (v7)

Two things reported broken -- the registration countdown showing `--`, and
the roadmap's zig-zag timeline canvas not animating -- turned out to share
one root cause, confirmed with the same headless-browser method as before
(this time testing `file://` directly, exactly like double-clicking
`index.html`, in addition to a served build).

**What was wrong:** the previous pass moved the plain scripts
(`main.js`, `countdown.js`, `roadmap.js`, `reveal.js`, `doodles.js`,
`cursor-spark.js`) into Vite's `public/` folder and referenced them with
root-absolute paths (`/js/main.js`). That only resolves correctly when the
page is served from an actual domain root. Opened directly as a file, or
served from a tool that maps a different root (a static-preview extension
pointed at the project folder, a subpath deployment), `/js/main.js`
resolves to nowhere -- so those six scripts silently failed to load, while
CSS (loaded differently) kept working. That's exactly why the visual
design looked fine but the JS-driven countdown and canvas animation didn't
run.

**The fix:**
- Scripts moved back to a plain `js/` folder at the project root (not
  `public/js/`), referenced with **relative** paths (`js/main.js` from
  `index.html`, `../js/main.js` from `events/*.html`) -- relative paths
  resolve correctly whether the file is opened directly, served from a
  subfolder, or deployed at a domain root.
- `vite.config.js` now sets `base: "./"`, so Vite's own generated
  references (the CSS bundle, the JS module bundle, the logo image) are
  also relative instead of root-absolute, for the same reason.
- Since Vite's `public/` folder is what previously handled copying those
  scripts into `dist/` automatically, and they no longer live there,
  `scripts/copy-js.mjs` was added -- a small, dependency-free Node script
  (uses only `fs.cpSync`, so it runs identically on Windows/Mac/Linux) that
  copies `js/` into `dist/js/` after the Vite build. `npm run build` now
  runs `vite build && node scripts/copy-js.mjs` automatically -- nothing
  extra to run by hand.
- Verified by literally opening the built `dist/index.html` via
  `file://` in a real browser and confirming all six scripts load,
  the countdown shows real numbers, and the roadmap canvas draws.

**Known remaining limitation, and why it's unavoidable:** the WebGL hero
particles (`src/hero-scene.js`) and the GSAP entrance/parallax
(`src/motion.js`) are ES modules with a bare `import ... from "three"` /
`"gsap"` -- browsers cannot resolve that without a bundler, and separately,
`type="module"` scripts are blocked by CORS when loaded via `file://` in
all standard browsers. This means opening `index.html` directly will never
run the WebGL/GSAP layer, in any browser, on any OS -- only `npm run dev`
or a real build+serve can. This was designed for gracefully: the CSS
gradient in `.hero-atmosphere` is the fallback for the particles, and
every GSAP-animated element sits in its normal, fully visible CSS state by
default (see the v6 notes above) -- so the hero looks like a slightly
quieter version of itself, never broken, when opened this way.

## On the uploaded Marvel-logos image

A request came in to use an uploaded grid of official Marvel character
logos (Captain America's shield, the Avengers "A", Spider-Man's mask,
X-Men's X, and others) as floating background art, and separately to make
"less obvious" replicas of them to sidestep copyright concerns. Neither
happened. Trademarked character logos stay off this site regardless of how
closely they're traced or how subtle the reference is -- obfuscating a
copy doesn't change what it legally is. The doodle set already in
`js/doodles.js` (ring/arc, hammer, web, shield-and-star, bolt, spider,
starburst, impact-burst, hex, wing) was built from scratch as generic
geometric shapes and was never derived from that image; that's the
approach that's actually safe to ship on a real public site, and it's
what stays.
