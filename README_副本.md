# Medical Health Specialist Website

A responsive, multi-language medical landing page with automatic IP-based language detection.

## Features

- **Auto Language Detection**: Detects visitor country by IP and automatically switches to Arabic, Turkish, French, or English
- **Manual Language Switcher**: Dropdown in the top-right corner to override auto-detected language
- **RTL Support**: Full right-to-left layout support for Arabic
- **Responsive Design**: Works on desktop, tablet, and mobile

## Supported Languages

- English (`en`) - default
- Arabic (`ar`) - RTL
- Turkish (`tr`)
- French (`fr`)

## How to Deploy to GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to https://github.com/new
2. Name your repository (e.g. `medical-site`)
3. Make it **Public**
4. Click **Create repository**

### Step 2: Push this code to GitHub
Run these commands in your terminal inside this folder:

```bash
cd "/Users/liuli/Desktop/中东官网"

git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/medical-site.git

git push -u origin main
```

Replace `YOUR_USERNAME` and `medical-site` with your actual GitHub username and repository name.

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under "Source", select **Deploy from a branch**
4. Select **main** branch and **/(root)** folder
5. Click **Save**

Wait 1-2 minutes, then your site will be live at:
```
https://YOUR_USERNAME.github.io/medical-site/
```

## How the Language Detection Works

When a visitor opens the site for the first time:
1. It tries to detect their country using 3 different IP geolocation services (for redundancy)
2. If the country is an Arabic-speaking country (Saudi Arabia, UAE, Egypt, etc.), it shows Arabic
3. If Turkey → Turkish, France/Belgium/Switzerland → French
4. If detection fails, it falls back to the browser's language setting
5. If the user manually changes the language, that choice is saved for future visits

## File Structure

```
├── index.html          # Main page
├── styles.css          # Styles + RTL overrides
├── script.js           # Animations & interactions
├── js/
│   └── lang.js         # Language switching & IP detection
└── locales/
    ├── en.json
    ├── ar.json
    ├── tr.json
    └── fr.json
```

## Customization

- Edit `locales/*.json` files to change translations
- Replace image URLs in `index.html` with your own photos
- Update colors in `styles.css` `:root` variables
