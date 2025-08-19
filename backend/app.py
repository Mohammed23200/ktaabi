from datetime import datetime, timedelta, timezone
import os, uuid
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///app.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = os.getenv("UPLOAD_FOLDER", "uploads")
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5MB

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)  # DEV: wide-open CORS
db = SQLAlchemy(app)
jwt = JWTManager(app)

Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    books = db.relationship("Book", backref="owner", lazy=True)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email}

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(50), default="to-read")  # to-read | reading | done
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    cover_url = db.Column(db.String(500), nullable=True)
    is_public = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "cover_url": self.cover_url,
            "is_public": self.is_public,
        }

with app.app_context():
    db.create_all()

@app.post("/api/auth/register")
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")
    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already in use"}), 409
    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Account created"}), 201

@app.post("/api/auth/login")
def login():
    data = request.get_json() or {}
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401
    expires = timedelta(days=7)
    access_token = create_access_token(identity=str(user.id), expires_delta=expires, additional_claims={"name": user.name})
    return jsonify({"access_token": access_token, "user": user.to_dict()})

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.post("/api/upload")
@jwt_required()
def upload():
    if "file" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "Invalid filename"}), 400
    if not allowed_file(file.filename):
        return jsonify({"message": "Unsupported file type"}), 400
    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = secure_filename(f"{uuid.uuid4().hex}.{ext}")
    path = Path(app.config["UPLOAD_FOLDER"]) / filename
    file.save(path)
    url = f"/api/uploads/{filename}"
    return jsonify({"url": url}), 201

@app.get("/api/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=False)

@app.get("/api/books")
@jwt_required()
def list_books():
    user_id = int(get_jwt_identity())
    books = Book.query.filter_by(user_id=user_id).order_by(Book.created_at.desc()).all()
    return jsonify([b.to_dict() for b in books])

@app.get("/api/books/public")
def public_books():
    books = Book.query.filter_by(is_public=True).order_by(Book.created_at.desc()).limit(50).all()
    return jsonify([b.to_dict() for b in books])

@app.post("/api/books")
@jwt_required()
def add_book():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    author = (data.get("author") or "").strip() or None
    status = data.get("status", "to-read")
    cover_url = (data.get("cover_url") or "").strip() or None
    is_public = bool(data.get("is_public", False))
    if not title:
        return jsonify({"message": "Title is required"}), 400
    book = Book(title=title, author=author, status=status, user_id=user_id, cover_url=cover_url, is_public=is_public)
    db.session.add(book)
    db.session.commit()
    return jsonify(book.to_dict()), 201

@app.put("/api/books/<int:book_id>")
@jwt_required()
def update_book(book_id):
    user_id = int(get_jwt_identity())
    book = Book.query.filter_by(id=book_id, user_id=user_id).first()
    if not book:
        return jsonify({"message": "Book not found"}), 404
    data = request.get_json() or {}
    if "title" in data: book.title = data["title"].strip()
    if "author" in data: book.author = (data["author"] or "").strip() or None
    if "status" in data: book.status = data["status"]
    if "cover_url" in data: book.cover_url = (data["cover_url"] or "").strip() or None
    if "is_public" in data: book.is_public = bool(data["is_public"])
    db.session.commit()
    return jsonify(book.to_dict())

@app.delete("/api/books/<int:book_id>")
@jwt_required()
def delete_book(book_id):
    user_id = int(get_jwt_identity())
    book = Book.query.filter_by(id=book_id, user_id=user_id).first()
    if not book:
        return jsonify({"message": "Book not found"}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Deleted"})

@app.post("/api/books/import/<int:book_id>")
@jwt_required()
def import_public_book(book_id):
    user_id = int(get_jwt_identity())
    src = Book.query.filter_by(id=book_id, is_public=True).first()
    if not src:
        return jsonify({"message": "Not found or not public"}), 404
    new_book = Book(
        title=src.title, author=src.author, status="to-read",
        user_id=user_id, cover_url=src.cover_url, is_public=False
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify(new_book.to_dict()), 201

@app.get("/api/ping")
def ping():
    return jsonify({"status": "ok", "time": datetime.now(timezone.utc).isoformat()})

def seed():
    if User.query.first():
        return
    u = User(name="Demo", email="demo@example.com")
    u.set_password("demo1234")
    db.session.add(u)
    db.session.commit()
    samples = [
        ("The Alchemist", "Paulo Coelho"),
        ("Oliver Twist", "Charles Dickens"),
        ("Black Coffee", "Agatha Christie"),
        ("Atomic Habits", "James Clear"),
    ]
    for t, a in samples:
        db.session.add(Book(title=t, author=a, status="to-read", user_id=u.id, is_public=True))
    db.session.commit()

if os.getenv("AUTO_SEED", "0") == "1":
    with app.app_context():
        seed()

if __name__ == "__main__":
    app.run(debug=True)
