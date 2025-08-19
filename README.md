<img width="293" height="172" alt="image" src="https://github.com/user-attachments/assets/f58cfe23-22ca-4a51-8627-d31ef2dfb21e" />

<h1 align="center">Ktaabi – Your Online Library 📚</h1>

<p align="center">
  <i>Browse, borrow, and manage e-books with a clean, modern experience.</i>
</p>

<!-- BADGES -->
<p align="center">
  <a href="https://github.com/Mohammed23200/ktaabi/stargazers">
    <img src="https://img.shields.io/github/stars/Mohammed23200/ktaabi?style=for-the-badge&logo=github" alt="Stars"/>
  </a>
  <a href="https://github.com/Mohammed23200/ktaabi/issues">
    <img src="https://img.shields.io/github/issues/Mohammed23200/ktaabi?style=for-the-badge" alt="Issues"/>
  </a>
  <a href="#-license">
    <img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge" alt="MIT License"/>
  </a>
  <a href="#-contributing">
    <img src="https://img.shields.io/badge/PRs-Welcome-14b8a6?style=for-the-badge" alt="PRs Welcome"/>
  </a>
</p>

<!-- HERO / DEMO -->
<p align="center">
  <a href="https://your-demo-url.example.com" target="_blank">
    <img src="https://raw.githubusercontent.com/Mohammed23200/ktaabi/main/.github/hero.gif" alt="Ktaabi Demo" width="85%" />
  </a>
</p>

<p align="center">
  <a href="https://your-demo-url.example.com"><b>▶ Live Demo</b></a> ·
  <a href="#-quick-start"><b>Quick Start</b></a> ·
  <a href="#-features"><b>Features</b></a> ·
  <a href="#-tech-stack"><b>Tech Stack</b></a>
</p>

---

## ✨ Features

- 🔎 **Powerful Search** — Find books by title, author, genre, or ISBN fast.
- 👤 **User Accounts** — Sign up, log in, and track your borrow history.
- ❤️ **Favorites & Shelves** — Save books you love for later.
- 🔐 **Role-Based Admin** — Manage catalog: add, edit, archive books.
- 📱 **Responsive UI** — Looks great on desktop, tablet, and mobile.
- ⚡ **Snappy UX** — Optimistic updates, skeletons, and subtle micro-animations.
- 🌙 **Dark Mode** — Eye-friendly reading at night.
- 🌐 **i18n-ready** — Easily extend to multiple languages.

> Tip: Add short demo clips (GIFs) of search, borrow, and admin flows in `.github/` to show motion in the README.

---

## 🧩 Tech Stack

<!-- Replace with your actual stack -->
- 🖥️ **Frontend:** React + Vite (TypeScript), Tailwind CSS, Framer Motion
- 🗄️ **Backend:** Node.js (Express)
- 🧰 **Auth:** JWT (access/refresh), bcrypt
- 💾 **Database:** MongoDB (Mongoose)
- 🚦 **Validation:** Zod / Joi
- 🧪 **Testing:** Vitest / Jest + Supertest
- 📦 **Tooling:** ESLint, Prettier, Husky, Lint-Staged

<p>
  <img src="https://img.shields.io/badge/React-0ea5e9?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6366f1?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-06b6d4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-10b981?logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-111827?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-16a34a?logo=mongodb&logoColor=white" />
</p>

---

## 🚀 Quick Start

> Make sure you have **Node 18+** and (if using Mongo) a local/remote MongoDB instance.


# 1) Clone
git clone https://github.com/Mohammed23200/ktaabi.git
cd ktaabi

# 2) Install
# If using a mono-repo with client/ and server/ dirs:
npm run setup # (optional script to install both sides)
# or:
cd client && npm i
cd ../server && npm i

# 3) Environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# fill the values

# 4) Run (dev)
# from the repo root if you have a concurrent dev script:
npm run dev
# or start each side:
cd server && npm run dev
cd ../client && npm run dev
Default URLs

Frontend: http://localhost:5173

API: http://localhost:3000/api

🔧 Configuration
server/.env

ini
Copy
Edit
PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/ktaabi
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:5173
client/.env

bash
Copy
Edit
VITE_API_BASE_URL=http://localhost:3000/api
🗂️ Project Structure
text
Copy
Edit
ktaabi/
├─ client/                 # React + Vite + Tailwind
│  ├─ src/
│  │  ├─ components/      # UI building blocks
│  │  ├─ pages/           # Routes / screens
│  │  ├─ features/        # (optional) feature slices
│  │  ├─ hooks/           # React hooks
│  │  ├─ lib/             # API client, utils
│  │  └─ styles/
│  └─ public/
│
├─ server/                 # Express API
│  ├─ src/
│  │  ├─ models/          # Mongoose schemas
│  │  ├─ routes/          # REST endpoints
│  │  ├─ controllers/     # Request handlers
│  │  ├─ services/        # Business logic
│  │  ├─ middleware/      # Auth, validation
│  │  └─ utils/
│  └─ tests/
│
├─ .github/
│  ├─ hero.gif             # demo animation for README
│  └─ logo.png             # project logo
└─ README.md
🔐 Authentication Flow
Sign up / Sign in → receive access + refresh tokens.

Access token (short-lived) used for API requests via Authorization: Bearer.

Refresh token (httpOnly cookie or secure storage) to rotate tokens when access expires.

Roles: user (default), admin (catalog management).

🌊 Smooth UX (Micro-Animations)
Ktaabi uses:

Framer Motion for page transitions and hover/tap animations.

Skeleton loaders while fetching books.

Optimistic UI when favoriting or borrowing.

Auto-animate lists for book grids (add/remove/move).

Add short GIFs to .github/ showing: search → open details → borrow → success toast.

📡 API (Sample)
Base: ${API_BASE_URL}/api

http
Copy
Edit
GET   /books?query=harry&genre=fantasy        # search & filters
GET   /books/:id                               # book details
POST  /auth/signup                             # create account
POST  /auth/login                              # login
POST  /borrow/:bookId                          # borrow a book (auth)
POST  /return/:bookId                          # return a book (auth)
GET   /me/borrows                              # my borrowed books
🧪 Scripts
bash
Copy
Edit
# Client
npm run dev           # vite dev server
npm run build         # production build
npm run preview       # preview production

# Server
npm run dev           # nodemon / ts-node dev
npm run start         # production start
npm run test          # unit/integration tests
npm run lint          # eslint
🗺️ Roadmap
 Book catalog, search, filters

 Auth (JWT)

 Favorites & borrowing

 Reviews & ratings

 File uploads (cover, PDF/EPUB)

 Admin analytics dashboard

 PWA offline mode & installable app

 Multi-language (EN/AR)

Have ideas? Check Issues or open a Discussion!

🤝 Contributing
Fork the repo

Create a branch: git checkout -b feat/awesome-feature

Commit: git commit -m "feat: add awesome feature"

Push: git push origin feat/awesome-feature

Open a Pull Request

Please follow our code style (ESLint/Prettier) and include tests where possible.

📝 License
Distributed under the MIT License. See LICENSE for details.

🌟 Acknowledgements
Icons by Lucide / Heroicons

Animations by Framer Motion

UI powered by Tailwind CSS

<p align="center"> Built with ❤️ for readers. If you like it, ⭐ star the repo! </p> ``
