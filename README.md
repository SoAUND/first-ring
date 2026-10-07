# First Ring

Sales site and starter kit for an after-hours AI receptionist.

This is the customer-facing site, not the phone agent itself. The agent still gets built in Retell and pointed at a phone number. The prompt is in `agent/prompt.md`.

No city, region, or niche is assumed. Swap the business facts per client.

## Live site

GitHub Pages is not turned on. The connected app cannot enable it. Until it is on, use:

https://htmlpreview.github.io/?https://github.com/SoAUND/first-ring/blob/main/index.html

To publish `https://soaund.github.io/first-ring/`:

1. Sign in as SoAUND in a browser, not the GitHub app.
2. Open the repo, then Settings, then Pages.
3. Source: Deploy from a branch. Branch: `main`. Folder: `/ (root)`.
4. Save and wait a minute.

## What is in here

- `index.html` — one-page offer for service businesses
- `agent/prompt.md` — Retell system prompt
- `agent/outreach.md` — first-call script
