#!/usr/bin/env python3
"""
Tetris Web Edition - Lightweight Backend Server with SQLite DB
- Serves static assets (HTML, CSS, JS)
- Provides SQLite user authentication (/api/register, /api/login, /api/score, /api/leaderboard)
- Zero external pip dependencies (built-in standard library)
"""

import http.server
import socketserver
import json
import sqlite3
import os
import hashlib
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
DB_FILE = os.path.join(os.path.dirname(__file__), "tetris.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        high_score INTEGER DEFAULT 0,
        total_games INTEGER DEFAULT 0,
        total_lines INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()
    conn.close()

def hash_pw(password):
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

class TetrisHandler(http.server.SimpleHTTPRequestHandler):
    def send_json(self, status_code, data):
        response = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(response)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/leaderboard":
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("""
                SELECT username, high_score, total_lines, total_games 
                FROM users 
                ORDER BY high_score DESC 
                LIMIT 10
            """)
            rows = cur.fetchall()
            conn.close()
            leaders = [
                {"username": r[0], "highScore": r[1], "totalLines": r[2], "totalGames": r[3]}
                for r in rows
            ]
            self.send_json(200, {"success": True, "leaders": leaders})
            return

        # Statik dosyaları sun
        super().do_GET()

    def do_POST(self):
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
        try:
            req_data = json.loads(body)
        except json.JSONDecodeError:
            self.send_json(400, {"success": False, "errorKey": "authErrInvalid"})
            return

        conn = sqlite3.connect(DB_FILE)
        cur = conn.cursor()

        # Kayıt Ol
        if self.path == "/api/register":
            username = req_data.get("username", "").strip()
            password = req_data.get("password", "")

            if len(username) < 3:
                conn.close()
                self.send_json(400, {"success": False, "errorKey": "authErrUserShort"})
                return
            if len(password) < 4:
                conn.close()
                self.send_json(400, {"success": False, "errorKey": "authErrPassShort"})
                return

            pw_hash = hash_pw(password)
            try:
                cur.execute(
                    "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                    (username, pw_hash)
                )
                conn.commit()
                cur.execute("SELECT id, username, high_score, total_games, total_lines FROM users WHERE username = ?", (username,))
                row = cur.fetchone()
                conn.close()
                user = {
                    "id": row[0],
                    "username": row[1],
                    "highScore": row[2],
                    "totalGames": row[3],
                    "totalLines": row[4]
                }
                self.send_json(200, {"success": True, "user": user})
            except sqlite3.IntegrityError:
                conn.close()
                self.send_json(400, {"success": False, "errorKey": "authErrUserExists"})
            return

        # Giriş Yap
        elif self.path == "/api/login":
            username = req_data.get("username", "").strip()
            password = req_data.get("password", "")
            pw_hash = hash_pw(password)

            cur.execute(
                "SELECT id, username, high_score, total_games, total_lines FROM users WHERE username = ? AND password_hash = ?",
                (username, pw_hash)
            )
            row = cur.fetchone()
            conn.close()

            if row:
                user = {
                    "id": row[0],
                    "username": row[1],
                    "highScore": row[2],
                    "totalGames": row[3],
                    "totalLines": row[4]
                }
                self.send_json(200, {"success": True, "user": user})
            else:
                self.send_json(401, {"success": False, "errorKey": "authErrInvalid"})
            return

        # Skor Güncelle
        elif self.path == "/api/score":
            username = req_data.get("username", "").strip()
            score = int(req_data.get("score", 0))
            lines = int(req_data.get("lines", 0))

            cur.execute("SELECT high_score FROM users WHERE username = ?", (username,))
            row = cur.fetchone()
            if row:
                current_high = row[0]
                new_high = max(current_high, score)
                cur.execute("""
                    UPDATE users 
                    SET high_score = ?, total_games = total_games + 1, total_lines = total_lines + ?
                    WHERE username = ?
                """, (new_high, lines, username))
                conn.commit()
                conn.close()
                self.send_json(200, {"success": True, "highScore": new_high})
            else:
                conn.close()
                self.send_json(404, {"success": False, "error": "User not found"})
            return

        conn.close()
        self.send_json(404, {"success": False, "error": "Endpoint not found"})

if __name__ == "__main__":
    init_db()
    with socketserver.TCPServer(("", PORT), TetrisHandler) as httpd:
        print(f"🚀 Tetris Server running with SQLite at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
