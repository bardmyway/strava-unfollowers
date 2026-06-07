# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A browser-console tool (vanilla JS, no dependencies, no build step) that finds Strava users who don't follow you back and mass-unfollows them, plus a view-only "Fans" tab (people who follow you that you don't follow back). Users load it either via a bookmarklet or by pasting the script into the dev console on strava.com.

## Development and testing

There is no build, lint, or test tooling. The only files that matter:

- `strava-unfollowers.js` — the entire application, a single IIFE.
- `bookmarklet.html` — the installation page, served via GitHub Pages at `bardmyway.github.io/strava-unfollowers/bookmarklet.html`.
- `files/` — unused leftover assets; ignore it.

Syntax check: `node --check strava-unfollowers.js`

Real verification requires pasting the script into the browser console while logged in at www.strava.com (the script refuses to run on any other hostname).

**Deployment = pushing to main.** The bookmarklet loads the script live from GitHub Pages: `https://bardmyway.github.io/strava-unfollowers/strava-unfollowers.js` (served as `application/javascript`). The installer page's copy button fetches it same-origin. Anything merged to main is live for all users once Pages rebuilds (~1 min; Pages caches with `max-age=600`, the `?v=Date.now()` cache-buster handles freshness). **Never load executable code from `raw.githubusercontent.com`** — it serves `text/plain` with `nosniff`, so browsers refuse to run it (this was the original bookmarklet bug). The raw URL is acceptable only as a human "read the source" link.

## Architecture

`strava-unfollowers.js` must remain a single self-contained file (it is injected as a raw `<script>` by the bookmarklet — no modules, no imports, no external deps). It is organized into banner-commented sections: STYLES, STATE, UTILITIES, STRAVA API FUNCTIONS, DETECT ATHLETE ID, SCAN & UNFOLLOW OPERATIONS, RENDER FUNCTIONS, EVENT HANDLERS, PUBLIC API.

**UI pattern:** a single `state` object + a `render()` function that rebuilds the full-screen overlay's `innerHTML` on every state change. Inline `onclick` attributes call methods on `window.stravaUnfollowers` (the public API exposed at the bottom of the file); card-click and whitelist-button listeners are re-attached via `addEventListener` at the end of each `render()`. Any new interactive control must either go through `window.stravaUnfollowers.*` or get its listener re-attached in `render()`. User-derived strings (athlete names, locations) must pass through the `escapeHtml()` helper before being interpolated into render templates.

**Tabs:** `non_followers` (selectable, unfollowable), `fans` (view-only — followers you don't follow back; no selection, cards link to profiles, guards in `toggleSelection`/`selectAll`/`selectPage`), `whitelisted`, `all_following`. `state.fans` is computed in `startScan()` as followers minus following by id.

**Data layer — there is no public Strava API for this.** The tool scrapes and replays Strava's internal endpoints:

- Scanning: fetches `https://www.strava.com/athletes/{id}/follows?type={following|followers}&page=N` and parses the returned HTML with DOMParser. Athlete cards are `li[data-athlete-id]`; name comes from `.text-callout a`, location from `.location`, avatar/premium from the `data-react-props` JSON, and pagination from `.pagination a[rel="next"]`. If scanning breaks, the first suspect is Strava changing this markup.
- Unfollowing: `DELETE https://www.strava.com/athletes/{myAthleteId}/follows/{followId}` with the CSRF token from the page's `meta[name="csrf-token"]`. Note `followId` is the *relationship* ID scraped from each card's `button[data-follow]`, not the athlete ID.
- The user's own athlete ID is auto-detected (URL → nav links → fetching /settings/profile and regex-matching).

**Persistence:** localStorage keys `strava_unfollowers_whitelist` and `strava_unfollowers_settings`.

## Constraints

- **Do not lower the default rate-limit delays** (`delayBetweenRequests`, `delayAfterFiveRequests`, `delayBetweenUnfollows`, `delayAfterFiveUnfollows` in `state.settings`). Every 5th request/unfollow triggers a long sleep by design — this protects users' accounts from being flagged by Strava.
- The tool's selling point is that nothing leaves the browser: no external servers, no credentials. Don't add network calls to anything other than strava.com.
- License is "All Rights Reserved, personal use only" — not open source.
