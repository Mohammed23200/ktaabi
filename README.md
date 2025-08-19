# Library (Coffee theme) – English + icons + animated background
## Features
- JWT auth, user-specific books
- Add/edit/delete, upload cover images
- Public/private toggle + import public book
- Strong animations (Framer Motion) + moving gradient background + floating blobs
- Lucide icons (buttons, navbar, status)
## Run
Backend:
```
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
flask --app app run --debug
```
Frontend:
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173
