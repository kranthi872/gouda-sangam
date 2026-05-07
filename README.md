# Gouds Chitti - Fund Management App

A mobile-first PWA for managing Gouds Chitti fund — members, monthly payments, 20K and 50K lifts.

---

## 🚀 Quick Start in VS Code

### Step 1 — Install Node.js
Download and install Node.js (v18 or later) from https://nodejs.org

### Step 2 — Open in VS Code
1. Extract this folder
2. Open VS Code → File → Open Folder → select `goudschitti`

### Step 3 — Install dependencies
Open Terminal in VS Code (Ctrl + ` ) and run:
```bash
npm install
```

### Step 4 — Run the app
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

---

## 🔐 Admin Password
Default password: **GoudsChitti@2024**

- Members can only VIEW data
- Admin can ADD, EDIT, DELETE members and lifts
- Admin can mark monthly payments
- Tap "Admin" button on Dashboard → enter password to login

To change the password, edit this line in `src/context/AppContext.js`:
```js
const ADMIN_PASSWORD = "GoudsChitti@2024";
```

---

## 📁 Project Structure
```
goudschitti/
├── src/
│   ├── pages/
│   │   ├── _app.js          # App wrapper
│   │   ├── _document.js     # HTML head / PWA meta
│   │   └── index.js         # Main page
│   ├── components/
│   │   ├── Navbar.js        # Top header + bottom nav
│   │   ├── Dashboard.js     # Stats overview
│   │   ├── Members.js       # Member management
│   │   ├── Lifts.js         # 20K / 50K lifts
│   │   ├── Payments.js      # Monthly payment tracker
│   │   └── AdminLogin.js    # Admin password modal
│   ├── context/
│   │   └── AppContext.js    # All data & state management
│   └── styles/
│       └── globals.css      # Global styles
├── public/
│   └── manifest.json        # PWA manifest
├── next.config.js           # Next.js + PWA config
├── tailwind.config.js
└── package.json
```

---

## 🌐 Connect to Git

```bash
git init
git add .
git commit -m "Initial commit - Gouds Chitti app"
git remote add origin https://github.com/YOUR_USERNAME/goudschitti.git
git push -u origin main
```

---

## 📱 Build PWA for Mobile (APK)

### Option A — Deploy to Vercel (Recommended)
1. Push code to GitHub (above)
2. Go to https://vercel.com → Import your repo
3. Deploy → get a live URL like `https://goudschitti.vercel.app`
4. Open on Android Chrome → "Add to Home Screen" → works like an APK!

### Option B — Convert PWA to APK using PWABuilder
1. Deploy to Vercel first (above)
2. Go to https://www.pwabuilder.com
3. Enter your Vercel URL
4. Click "Build My PWA" → Download Android APK
5. Install APK on your Android phone

### Option C — Bubblewrap (Advanced)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-url.vercel.app/manifest.json
bubblewrap build
```

---

## 💾 Data Storage
- All data is saved in **browser localStorage**
- Data persists between sessions on the same device
- To share data across devices, consider adding a Firebase backend later

---

## 📲 Add App Icon (for PWA)
Create two PNG icons and place them in `public/icons/`:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

You can use any image editor or https://favicon.io to generate them.
