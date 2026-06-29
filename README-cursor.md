# DentAI Website — Deploy Guide

Static marketing site for DentAI (AI receptionist for dental practices).

## Pages

| Page | URL |
|------|-----|
| Homepage | `/index.html` |
| About | `/about.html` |
| Book a demo | `/book.html` |
| Privacy & terms | `/privacy.html` |

## Run locally

```bash
npx serve . -l 5151
```

Open http://localhost:5151

The demo form validates locally. On Netlify it submits for real — enable email notifications once (see below).

## Go live on Netlify (recommended)

Netlify handles hosting and demo form submissions with no backend code.

1. Push this folder to a GitHub repo
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Select the repo — no build command needed (static HTML)
4. Publish directory: `.` (root)
5. Deploy

After deploy:

- All pages are live at your Netlify URL (e.g. `https://your-site.netlify.app`)
- Demo form submissions appear under **Site settings → Forms**
- Set up email notifications: **Forms → Form notifications → Add notification → Email**

### Custom domain

In Netlify: **Domain management → Add custom domain** (e.g. `dentai.co`), then point DNS to Netlify.

## Files added by Cursor

| File | Purpose |
|------|---------|
| `site-config-cursor.js` | Contact email, form name, page paths |
| `form-cursor.js` | Demo form validation + Netlify submission |
| `netlify-cursor.toml` | Reference copy of deploy config |
| `netlify.toml` | Active Netlify deploy config |
| `404-cursor.html` | Custom 404 page (copy to `404.html` for Netlify auto-404) |
| `README-cursor.md` | This file |

## Form submissions

The book demo form uses [Netlify Forms](https://docs.netlify.com/forms/setup/).

**Turn on email notifications (do this once after deploy):**

1. Netlify → your site → **Forms**
2. Click **demo-request**
3. **Form notifications** → **Add notification** → **Email notification**
4. Send to: `affan@dentai.co`

Every demo request will email you automatically. Submissions also appear in the Netlify Forms tab.

To change the contact email, edit `site-config-cursor.js`.
