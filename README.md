# SP Surya website

Fast, SEO-ready website (Astro) with an admin panel (Sanity), hosted on Hostinger.

```
sps-web/
├── web/      ← the website (Astro). Builds to plain HTML → uploaded to Hostinger
├── studio/   ← the admin panel (Sanity Studio) → hosted free at https://spsurya.sanity.studio
└── .github/workflows/deploy.yml  ← auto build + upload when you publish in the admin
```

**How it works:** you edit content in the admin → press **Publish** → GitHub rebuilds the site (~1–2 min) → uploads it to Hostinger by FTP. Enquiry-form leads go to **Admin → Leads** and to your email.

---

## One-time setup (about 1 hour)

You need: [Node.js 22+](https://nodejs.org), a free [GitHub](https://github.com) account, a free [Sanity](https://www.sanity.io) account, and your Hostinger hPanel login.

### 1. Create the Sanity project (admin database)
1. Go to <https://www.sanity.io/manage> → **Create new project** → name it *SP Surya* → dataset **production** (public).
2. Copy the **Project ID** (looks like `ab12cd34`).
3. In `studio/`, copy `.env.example` to `.env` and paste the Project ID.
4. In `web/`, copy `.env.example` to `.env`, paste the same Project ID, and set `PUBLIC_SITE_URL` to your domain, e.g. `https://www.spsurya.in`.

### 2. Start the admin and load the starter content
```bash
cd studio
npm install
npx sanity login
npx sanity dataset import seed/seed.ndjson production --replace   # loads all current text
npm run deploy                                                    # publishes the admin at https://spsurya.sanity.studio
```
If `spsurya` is taken, change `studioHost` in `studio/sanity.cli.ts`.

Then open the admin and:
- **Business details & SEO → Logo**: upload your logo (and a white version for the dark footer).
- **Home page → Top banner**: upload the hero photo.
- **Services**: add a photo to each service and replace every `[₹ PRICE]`.
- **Projects & gallery**: add real installs (photo, village, kW). Tick *Show on home page* for the best 4–5.
- Fill in every text still in `[square brackets]`. The build log lists any that are left.

### 3. Try the website on your computer
```bash
cd web
npm install
npm run dev        # open http://localhost:4321
```

### 4. Put the code on GitHub
Create a **private** repository (e.g. `sps-web`), then from the `sps-web` folder:
```bash
git init && git add . && git commit -m "SP Surya website"
git branch -M main
git remote add origin https://github.com/YOUR-USER/sps-web.git
git push -u origin main
```

### 5. Connect GitHub → Hostinger (automatic upload)
In **hPanel → Files → FTP Accounts**, note the FTP host, username and password (or create a new FTP account limited to `public_html`).

In GitHub → your repo → **Settings → Secrets and variables → Actions**:

| Type | Name | Value |
|---|---|---|
| Secret | `FTP_SERVER` | e.g. `ftp.spsurya.in` or the IP shown in hPanel |
| Secret | `FTP_USERNAME` | your FTP username |
| Secret | `FTP_PASSWORD` | your FTP password |
| Variable | `PUBLIC_SITE_URL` | `https://www.spsurya.in` |
| Variable | `PUBLIC_SANITY_PROJECT_ID` | your Sanity Project ID |
| Variable (optional) | `FTP_SERVER_DIR` | default `public_html/`. Change it if your FTP account opens inside public_html already (then use `./`) |

Then go to **Actions → Build & deploy to Hostinger → Run workflow**. The first upload takes a few minutes.

### 6. Hostinger settings
1. **Domain & SSL:** hPanel → Security → SSL → make sure SSL is **Active** for the domain.
2. **www or not:** the site uses `https://www.your-domain`. If you prefer no `www`, edit the two lines marked in `web/public/.htaccess` and set `PUBLIC_SITE_URL` without `www`.
3. **Lead form secrets:** in Sanity → manage → **API → Tokens → Add API token** → name *Website leads*, permission **Editor** → copy it.
   Then in **hPanel → File Manager**, open the folder that **contains** `public_html` and create a file named `sps-config.php` there with the contents of `web/public/api/config.sample.php`, filled in (project ID, token, your email).
   ⚠️ Never put this file inside `public_html` or on GitHub.
4. **Sender email (recommended):** hPanel → Emails → create `no-reply@your-domain` so lead emails don't land in spam.
5. Test: submit the form on the live site → it should appear in **Admin → Leads** and in your inbox.

### 7. Publish in the admin → site updates automatically
1. GitHub → your profile → **Settings → Developer settings → Fine-grained tokens → Generate**. Repository access: only `sps-web`. Permissions: **Contents: Read and write**. Copy the token.
2. Sanity → manage → **API → Webhooks → Create webhook**:
   - URL: `https://api.github.com/repos/YOUR-USER/sps-web/dispatches`
   - Dataset: `production` · Trigger on: Create, Update, Delete
   - Filter: `_type != "lead"` (so new leads don't trigger a rebuild)
   - Projection: `{"event_type": "sanity-publish"}`
   - HTTP method: `POST`
   - HTTP headers: `Authorization` = `Bearer YOUR_GITHUB_TOKEN` and `Accept` = `application/vnd.github+json`
3. Change any text in the admin → Publish → check GitHub **Actions**. The live site updates about 2 minutes later.

### 8. Google (most important for local SEO)
1. **Google Search Console:** add your domain → choose the *HTML tag* method → paste only the code into **Admin → Business details → Default SEO → Search Console verification code** → Publish → Verify. Then submit `https://www.your-domain/sitemap.xml`.
2. **Google Business Profile:** claim or verify *SP Surya*. Use the exact same name, address and phone as the website, put the website link on it, add photos, and ask every happy customer for a review.
3. In the admin, add your Google Maps link and map latitude/longitude, plus your Facebook/Instagram/Business Profile links under **Social profiles**.

---

## Everyday use
| I want to… | Where in the admin |
|---|---|
| See new enquiries | **Leads → New** (change status to Contacted / Quoted / Won) |
| Change phone, address, hours | **Business details & SEO** |
| Update subsidy amounts | **Subsidy rates & guide** (the calculator updates everywhere) |
| Add a finished installation | **Projects & gallery → +** |
| Write an article | **Blog posts → +** (the "Solar guide" menu appears after the first post) |
| Add a town page (e.g. Soro) | **Areas** → open the town → write 2–3 real paragraphs → switch on *Publish a page* |
| Change a page's Google title | the **SEO** section on that page |

## Speed & SEO already built in
- Plain HTML pages with about 2.5 KB of JavaScript (only for the calculator and form). The home page is about 100 KB in total.
- Self-hosted fonts (Latin only, plus a 1 KB ₹ file). Images are resized and converted to WebP/AVIF by Sanity's CDN, and load lazily.
- Clean URLs, HTTPS + www redirect, Brotli/Gzip, long cache headers (`web/public/.htaccess`).
- Per-page title, description, canonical and share image. Auto `sitemap.xml` + `robots.txt`.
- Structured data for Google: LocalBusiness (address, hours, areas, services), Service, FAQ, Breadcrumbs, BlogPosting.
- Separate pages for subsidy, each service, each project, each area and each article. These are what rank in Google, not a single long page.

## Commands
| Folder | Command | What it does |
|---|---|---|
| `web` | `npm run dev` | preview the site locally |
| `web` | `npm run build` | build to `web/dist` (what gets uploaded) |
| `web` | `npm run make-seed` | rebuild `studio/seed/seed.ndjson` from `src/data/fallback.ts` |
| `studio` | `npm run dev` | admin locally at http://localhost:3333 |
| `studio` | `npm run deploy` | publish the admin to *.sanity.studio |
