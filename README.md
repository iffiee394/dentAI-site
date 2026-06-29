# DentAI Website

Static marketing site for DentAI — AI receptionist for dental practices.

## Make a change and go live

```powershell
# 1. Edit files in Cursor
# 2. Commit and push
git add .
git commit -m "Describe your change"
git push
# 3. Netlify auto-deploys in ~30 seconds
```

## First-time GitHub setup

1. Create repo at [github.com/new](https://github.com/new) (empty, no README)
2. Push:

```powershell
cd "D:\Cursor Projects\SMME1"
git remote add origin https://github.com/YOUR-USERNAME/dentai-site.git
git push -u origin main
```

3. Netlify → **Project configuration** → **Build & deploy** → **Link repository** → select repo  
   - Build command: empty  
   - Publish directory: `.`

See `README-cursor.md` for full details.
