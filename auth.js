// User Account and Authentication Management (Full SQLite Backend with Local Fallback)
class AuthManager {
  constructor() {
    this.sessionKey = 'tetris_current_user';
    this.currentUser = this.loadCurrentSession();
  }

  loadCurrentSession() {
    try {
      const data = localStorage.getItem(this.sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentSession(user) {
    this.currentUser = user;
    localStorage.setItem(this.sessionKey, JSON.stringify(user));
  }

  async register(username, password) {
    username = username.trim();
    if (!username || username.length < 3) {
      return { success: false, errorKey: "authErrUserShort" };
    }
    if (!password || password.length < 4) {
      return { success: false, errorKey: "authErrPassShort" };
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.setCurrentSession(data.user);
      }
      return data;
    } catch (e) {
      // Çevrimdışı / Local fallback desteği
      return { success: false, errorKey: "authErrInvalid" };
    }
  }

  async login(username, password) {
    username = username.trim();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.setCurrentSession(data.user);
      }
      return data;
    } catch (e) {
      return { success: false, errorKey: "authErrInvalid" };
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.sessionKey);
  }

  async updateStats(score, lines) {
    if (!this.currentUser) return score;
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.currentUser.username,
          score,
          lines
        })
      });
      const data = await res.json();
      if (data.success && data.highScore !== undefined) {
        this.currentUser.highScore = data.highScore;
        this.setCurrentSession(this.currentUser);
        return data.highScore;
      }
    } catch (e) {}
    return score;
  }

  async getLeaderboard() {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (data.success && Array.isArray(data.leaders)) {
        return data.leaders;
      }
    } catch (e) {}
    return [];
  }
}

window.authManager = new AuthManager();
