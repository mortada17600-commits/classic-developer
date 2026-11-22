# CLASSIC DEVELOPER

A static, responsive portfolio and Discord-connected order portal built for **Cloudflare Pages + Pages Functions + D1**. No build step is required.

## Included

- Responsive dark luxury portfolio (English/Arabic language toggle)
- Discord OAuth2 login (identify scope only; the site never asks for Discord passwords)
- Signed, HttpOnly session cookie
- Authenticated project request form and customer request history
- D1 persistence for project requests
- Discord bot DM notification to the configured administrator
- Private admin page at `/admin.html` with request status management
- API-side administrator authorization

## 1. Create Discord application and bot

1. Open <https://discord.com/developers/applications> and create an application named `CLASSIC DEVELOPER`.
2. In **OAuth2 → Redirects**, add your final callback URL exactly:
   `https://YOUR-PROJECT.pages.dev/api/auth/callback`
3. Copy the **Application ID** and **Client Secret**.
4. In **Bot**, create/reset the bot token and copy it. Keep it secret.
5. Enable the bot and invite it to a server where your administrator account is also a member. The bot needs no privileged gateway intents for this project; it uses the Discord REST API.
6. Copy your Discord user ID (Developer Mode → right-click your profile → Copy User ID).

The bot attempts to open a DM with the administrator when a request is submitted. Discord may prevent delivery if the administrator's privacy settings block DMs or the bot has no shared server with that account. The order is still saved in D1 even if the DM fails.

## 2. Create the Cloudflare Pages site and free URL

1. Push this folder to a GitHub repository.
2. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository and deploy it.
4. Use these build settings:
   - Framework preset: **None**
   - Build command: leave empty
   - Build output directory: `/` (or `.` if the dashboard requires a relative path)
5. Cloudflare assigns a free address such as `classic-developer.pages.dev`.

A `pages.dev` address is free. A custom domain generally requires owning/registering a domain; Cloudflare does not provide a free arbitrary custom domain.

## 3. Create D1 database

In Cloudflare Dashboard → **Workers & Pages → D1 SQL Database**, create a database named `classic-developer-db`.

Open its **Console** and execute the complete contents of `schema.sql`.

For a Git-connected Pages project, open Pages → your project → **Settings → Functions → D1 database bindings**, add a binding named exactly `DB`, and select this database. The project intentionally leaves the database ID out of `wrangler.toml` so you can connect the database from the Cloudflare dashboard without editing a placeholder first.

## 4. Configure production secrets and variables

In Pages → your project → **Settings → Variables and Secrets**, add:

| Name | Value | Type |
|---|---|---|
| `DISCORD_CLIENT_ID` | Discord Application ID | Variable |
| `DISCORD_CLIENT_SECRET` | Discord OAuth2 Client Secret | Secret |
| `DISCORD_REDIRECT_URI` | `https://YOUR-PROJECT.pages.dev/api/auth/callback` | Variable |
| `SESSION_SECRET` | Long random secret (32+ random bytes) | Secret |
| `DISCORD_BOT_TOKEN` | Discord bot token | Secret |
| `ADMIN_DISCORD_ID` | Your Discord user ID | Variable |

Generate a session secret in Termux with:

```bash
openssl rand -hex 32
```

After setting variables, trigger a new deployment. Never put tokens or secrets in HTML, JavaScript, GitHub, screenshots, or public messages.

## 5. Publish from Termux

Install Git if needed, then:

```bash
pkg update -y && pkg install git -y
cd ~/classic-developer
# If you extracted the project elsewhere, cd to that folder instead.
git init
git add .
git commit -m "Initial CLASSIC DEVELOPER website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/classic-developer.git
git push -u origin main
```

If Git says `remote origin already exists`, use:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/classic-developer.git
git push -u origin main
```

GitHub may require a browser sign-in or a Personal Access Token instead of your account password. Do not paste a token into chat.

## 6. Local preview (optional)

Install Node.js in Termux and Wrangler, then run:

```bash
npm install -g wrangler
wrangler pages dev .
```

For local API testing, create `.dev.vars` from `.dev.vars.example` and fill test credentials. `.dev.vars` is ignored by Git. For local D1, use Wrangler's D1 local binding workflow.

## Routes

- `/` — public portfolio and request form
- `/admin.html` — administrator order dashboard
- `/api/auth/login` — Discord OAuth start
- `/api/auth/callback` — OAuth callback
- `/api/auth/me` — current user
- `/api/auth/logout` — sign out
- `/api/orders` — submit/list current user's requests
- `/api/admin/orders` — admin-only list/update requests

## Important configuration notes

- Set the OAuth redirect URL in both Discord Developer Portal and Cloudflare variables exactly; they must match.
- The Cloudflare D1 binding name must be exactly `DB`.
- The administrator ID is checked server-side against the signed-in Discord account.
- The order API validates input and stores requests before attempting the Discord DM.
- Do not enable public access to D1 or expose bot credentials in client-side code.
