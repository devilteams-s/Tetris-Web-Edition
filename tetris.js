// Tetris Core Game Logic with Modes, BGM, Combo, T-Spin, Achievements & Screen Shake
(() => {
  // Sabitler
  const COLS = 10;
  const ROWS = 20;
  const BLOCK_SIZE = 30; // 300x600 canvas

  // Dil Sözlüğü (i18n)
  const I18N = {
    tr: {
      holdTitle: "SAKLANAN",
      statScore: "SKOR",
      statHighScore: "EN YÜKSEK",
      statLevel: "SEVİYE",
      statLines: "SATIRLAR",
      statTime: "SÜRE",
      nextTitle: "SIRADAKİ",
      leaderboardTitle: "LİDERLER",
      noPlayersYet: "Henüz kayıtlı skor yok",
      controlsTitle: "KONTROLLER",
      ctrlRotate: "Döndür:",
      ctrlMove: "Sol / Sağ:",
      ctrlSoftDrop: "Hızlı Düşüş:",
      ctrlHardDrop: "Anında Düşür:",
      ctrlHold: "Taşı Sakla:",
      ctrlPause: "Duraklat:",
      soundOn: "🔊 SES AÇIK",
      soundOff: "🔇 SES KAPALI",
      readyTitle: "HAZIR MISIN?",
      readyDesc: "Klasik Tetris deneyimi, neon efektler ve seslerle!",
      btnStart: "OYUNA BAŞLA",
      pausedTitle: "DURAKLATILDI",
      pausedDesc: "Devam etmek için butona veya P tuşuna bas.",
      btnResume: "DEVAM ET",
      gameOverTitle: "OYUN BİTTİ",
      gameOverDesc: (score, lines) => `Toplam Skor: ${score} | Satırlar: ${lines}`,
      btnRestart: "TEKRAR OYNA",
      levelUp: (lvl) => `SEVİYE ${lvl}!`,
      tetrisClear: "TETRIS! 🔥",
      multiLines: (c) => `${c}x SATIR!`,
      comboText: (c) => `${c}x KOMBO! ⚡`,
      tspinText: "T-SPIN! 🌀",
      achievementUnlocked: "BAŞARIM AÇILDI!",
      achievementsTitle: "🏆 BAŞARIMLAR",
      accountLoginBtn: "Giriş Yap",
      authModalTitleLogin: "Hesaba Giriş Yap",
      authModalTitleRegister: "Yeni Hesap Oluştur",
      tabLogin: "Giriş Yap",
      tabRegister: "Kayıt Ol",
      authLabelUser: "Kullanıcı Adı",
      authLabelPass: "Şifre",
      authSubmitLogin: "Giriş Yap",
      authSubmitRegister: "Kayıt Ol",
      authErrUserShort: "Kullanıcı adı en az 3 karakter olmalıdır.",
      authErrPassShort: "Şifre en az 4 karakter olmalıdır.",
      authErrUserExists: "Bu kullanıcı adı zaten alınmış.",
      authErrInvalid: "Geçersiz kullanıcı adı veya şifre.",
      authSuccessLogin: "Giriş başarılı! Hoş geldin, ",
      authSuccessRegister: "Hesap oluşturuldu! Hoş geldin, ",
      modeMarathon: "MARATON",
      modeSprint: "40 SATIR SPRINT",
      modeUltra: "2 DK ULTRA",
      modeSurvival: "HAYATTA KALMA",
      sprintWon: (time) => `TEBRİKLER! Süre: ${time}`,
      ultraFinished: (sc) => `SÜRE DOLDU! Skor: ${sc}`
    },
    en: {
      holdTitle: "HOLD",
      statScore: "SCORE",
      statHighScore: "HIGH SCORE",
      statLevel: "LEVEL",
      statLines: "LINES",
      statTime: "TIME",
      nextTitle: "NEXT",
      leaderboardTitle: "LEADERBOARD",
      noPlayersYet: "No registered scores yet",
      controlsTitle: "CONTROLS",
      ctrlRotate: "Rotate:",
      ctrlMove: "Left / Right:",
      ctrlSoftDrop: "Soft Drop:",
      ctrlHardDrop: "Hard Drop:",
      ctrlHold: "Hold Piece:",
      ctrlPause: "Pause:",
      soundOn: "🔊 AUDIO ON",
      soundOff: "🔇 AUDIO OFF",
      readyTitle: "READY?",
      readyDesc: "Classic Tetris experience with neon aesthetics & sound effects!",
      btnStart: "START GAME",
      pausedTitle: "PAUSED",
      pausedDesc: "Press button or P key to resume playing.",
      btnResume: "RESUME",
      gameOverTitle: "GAME OVER",
      gameOverDesc: (score, lines) => `Total Score: ${score} | Lines Cleared: ${lines}`,
      btnRestart: "PLAY AGAIN",
      levelUp: (lvl) => `LEVEL ${lvl}!`,
      tetrisClear: "TETRIS! 🔥",
      multiLines: (c) => `${c}x LINES!`,
      comboText: (c) => `${c}x COMBO! ⚡`,
      tspinText: "T-SPIN! 🌀",
      achievementUnlocked: "ACHIEVEMENT UNLOCKED!",
      achievementsTitle: "🏆 ACHIEVEMENTS",
      accountLoginBtn: "Log In",
      authModalTitleLogin: "Account Log In",
      authModalTitleRegister: "Create New Account",
      tabLogin: "Log In",
      tabRegister: "Sign Up",
      authLabelUser: "Username",
      authLabelPass: "Password",
      authSubmitLogin: "Log In",
      authSubmitRegister: "Register",
      authErrUserShort: "Username must be at least 3 characters.",
      authErrPassShort: "Password must be at least 4 characters.",
      authErrUserExists: "Username already taken.",
      authErrInvalid: "Invalid username or password.",
      authSuccessLogin: "Login successful! Welcome, ",
      authSuccessRegister: "Account created! Welcome, ",
      modeMarathon: "MARATHON",
      modeSprint: "40 LINES SPRINT",
      modeUltra: "2 MIN ULTRA",
      modeSurvival: "SURVIVAL",
      sprintWon: (time) => `VICTORY! Time: ${time}`,
      ultraFinished: (sc) => `TIME'S UP! Score: ${sc}`
    }
  };

  let currentLang = localStorage.getItem('tetris_lang') || 'tr';
  let gameMode = 'marathon'; // 'marathon', 'sprint', 'ultra', 'survival'
  let gameTimeSeconds = 0;
  let timerInterval = null;

  // Tetromino Şekilleri
  const SHAPES = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
  };

  const COLORS = {
    I: { main: '#06b6d4', glow: '#67e8f9', dark: '#0891b2' },
    J: { main: '#3b82f6', glow: '#93c5fd', dark: '#1d4ed8' },
    L: { main: '#f97316', glow: '#fdba74', dark: '#c2410c' },
    O: { main: '#eab308', glow: '#fef08a', dark: '#a16207' },
    S: { main: '#22c55e', glow: '#86efac', dark: '#15803d' },
    T: { main: '#a855f7', glow: '#d8b4fe', dark: '#7e22ce' },
    Z: { main: '#ef4444', glow: '#fca5a5', dark: '#b91c1c' }
  };

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.vx = (Math.random() - 0.5) * 8;
      this.vy = (Math.random() - 0.8) * 8;
      this.size = Math.random() * 4 + 2;
      this.alpha = 1;
      this.life = 0.95;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.2;
      this.alpha *= this.life;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size);
      ctx.restore();
    }
  }

  // DOM
  const canvas = document.getElementById('tetris-canvas');
  const ctx = canvas.getContext('2d');
  const boardCard = document.getElementById('board-card');
  const holdCanvas = document.getElementById('hold-canvas');
  const holdCtx = holdCanvas.getContext('2d');
  const nextCanvas = document.getElementById('next-canvas');
  const nextCtx = nextCanvas.getContext('2d');
  const next2Canvas = document.getElementById('next2-canvas');
  const next2Ctx = next2Canvas.getContext('2d');

  const scoreEl = document.getElementById('score-val');
  const highscoreEl = document.getElementById('highscore-val');
  const levelEl = document.getElementById('level-val');
  const linesEl = document.getElementById('lines-val');
  const timerBox = document.getElementById('timer-box');
  const timeEl = document.getElementById('time-val');
  const overlayScreen = document.getElementById('overlay-screen');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayDesc = document.getElementById('overlay-desc');
  const btnMainAction = document.getElementById('btn-main-action');
  const floatMessage = document.getElementById('float-message');
  const soundIndicator = document.getElementById('sound-indicator');
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const btnToggleBgm = document.getElementById('btn-toggle-bgm');
  const btnToggleLang = document.getElementById('btn-toggle-lang');
  const langIndicator = document.getElementById('lang-indicator');

  const btnOpenAuth = document.getElementById('btn-open-auth');
  const userDisplayName = document.getElementById('user-display-name');
  const btnLogout = document.getElementById('btn-logout');
  const authModal = document.getElementById('auth-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const authModalTitle = document.getElementById('auth-modal-title');
  const authUsernameInput = document.getElementById('auth-username');
  const authPasswordInput = document.getElementById('auth-password');
  const btnSubmitAuth = document.getElementById('btn-submit-auth');
  const authFeedback = document.getElementById('auth-feedback');
  const authForm = document.getElementById('auth-form');
  const leaderboardList = document.getElementById('leaderboard-list');

  // Başarımlar DOM
  const btnOpenAchievements = document.getElementById('btn-open-achievements');
  const achievementsModal = document.getElementById('achievements-modal');
  const btnCloseAchievements = document.getElementById('btn-close-achievements');
  const achievementsList = document.getElementById('achievements-list');
  const achievementToast = document.getElementById('achievement-toast');
  const toastIcon = document.getElementById('toast-icon');
  const toastTitle = document.getElementById('toast-title');

  let authMode = 'login';

  // Oyun Durumu Değişkenleri
  let grid = [];
  let currentPiece = null;
  let nextQueue = [];
  let holdPiece = null;
  let canHold = true;
  let score = 0;
  let lines = 0;
  let level = 1;
  let comboCount = 0;
  let lastActionWasRotate = false;
  let highscore = 0;
  let isGameOver = false;
  let isPaused = false;
  let isRunning = false;
  let dropCounter = 0;
  let lastTime = 0;
  let particles = [];
  let survivalGarbageTimer = 0;

  // Ekran Sarsıntısı (Screen Shake) Tetikleyici
  function triggerScreenShake() {
    boardCard.classList.remove('shake');
    void boardCard.offsetWidth; // reflow
    boardCard.classList.add('shake');
  }

  // Başarım Tetiklendiğinde Toast Göster
  function showAchievementToast(def) {
    window.soundFX?.playAchievement();
    toastIcon.textContent = def.icon;
    toastTitle.textContent = currentLang === 'tr' ? def.titleTr : def.titleEn;
    achievementToast.classList.add('show');
    setTimeout(() => {
      achievementToast.classList.remove('show');
    }, 3200);
  }

  function renderAchievementsModal() {
    if (!window.achievementManager) return;
    const all = window.achievementManager.getAll(currentLang);
    achievementsList.innerHTML = all.map(ach => `
      <div class="achievement-card ${ach.isUnlocked ? 'unlocked' : ''}">
        <span class="ach-icon">${ach.icon}</span>
        <div class="ach-info">
          <h4>${ach.title} ${ach.isUnlocked ? '✓' : ''}</h4>
          <p>${ach.desc}</p>
        </div>
      </div>
    `).join('');
  }

  btnOpenAchievements.addEventListener('click', () => {
    renderAchievementsModal();
    achievementsModal.classList.add('active');
  });

  btnCloseAchievements.addEventListener('click', () => {
    achievementsModal.classList.remove('active');
  });

  // BGM Buton Olayı
  btnToggleBgm.addEventListener('click', () => {
    const isPlaying = window.soundFX?.toggleBGM();
    btnToggleBgm.classList.toggle('active', isPlaying);
  });

  // Mod Seçimi
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      gameMode = e.target.getAttribute('data-mode');
      if (gameMode === 'sprint' || gameMode === 'ultra') {
        timerBox.style.display = 'flex';
      } else {
        timerBox.style.display = 'none';
      }
      if (isRunning) {
        startGame();
      }
    });
  });

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function startTimer() {
    stopTimer();
    gameTimeSeconds = gameMode === 'ultra' ? 120 : 0;
    timeEl.textContent = formatTime(gameTimeSeconds);

    timerInterval = setInterval(() => {
      if (isPaused || isGameOver || !isRunning) return;

      if (gameMode === 'ultra') {
        gameTimeSeconds--;
        timeEl.textContent = formatTime(gameTimeSeconds);
        if (gameTimeSeconds <= 0) {
          triggerGameWin(I18N[currentLang].ultraFinished(score));
        }
      } else {
        gameTimeSeconds++;
        timeEl.textContent = formatTime(gameTimeSeconds);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function refreshHighScore() {
    if (window.authManager && window.authManager.currentUser) {
      highscore = window.authManager.currentUser.highScore || 0;
    } else {
      highscore = parseInt(localStorage.getItem('tetris_high_score') || '0', 10);
    }
    highscoreEl.textContent = highscore;
  }

  async function updateLeaderboard() {
    if (!window.authManager) return;
    const leaders = await window.authManager.getLeaderboard();
    const t = I18N[currentLang];

    if (!leaders || leaders.length === 0) {
      leaderboardList.innerHTML = `<li class="empty-list">${t.noPlayersYet}</li>`;
      return;
    }

    leaderboardList.innerHTML = leaders.map((player, idx) => `
      <li class="leaderboard-item ${idx === 0 ? 'rank-1' : ''}">
        <span class="player-name">${idx + 1}. ${escapeHtml(player.username)}</span>
        <span class="player-score">${player.highScore || 0}</span>
      </li>
    `).join('');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  function syncUserUI() {
    const user = window.authManager?.currentUser;
    const t = I18N[currentLang];

    if (user) {
      userDisplayName.textContent = user.username;
      btnLogout.classList.remove('hidden');
    } else {
      userDisplayName.textContent = t.accountLoginBtn;
      btnLogout.classList.add('hidden');
    }
    refreshHighScore();
    updateLeaderboard();
  }

  function openAuthModal(mode = 'login') {
    authMode = mode;
    authFeedback.textContent = '';
    authFeedback.className = 'auth-feedback';
    authUsernameInput.value = '';
    authPasswordInput.value = '';

    const t = I18N[currentLang];
    if (mode === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      authModalTitle.textContent = t.authModalTitleLogin;
      btnSubmitAuth.textContent = t.authSubmitLogin;
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      authModalTitle.textContent = t.authModalTitleRegister;
      btnSubmitAuth.textContent = t.authSubmitRegister;
    }
    authModal.classList.add('active');
  }

  function closeAuthModal() {
    authModal.classList.remove('active');
  }

  btnOpenAuth.addEventListener('click', () => {
    if (!window.authManager?.currentUser) {
      openAuthModal('login');
    }
  });

  btnLogout.addEventListener('click', () => {
    window.authManager?.logout();
    syncUserUI();
    triggerMessage("Görüşmek üzere!");
  });

  btnCloseModal.addEventListener('click', closeAuthModal);
  tabLogin.addEventListener('click', () => openAuthModal('login'));
  tabRegister.addEventListener('click', () => openAuthModal('register'));

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = authUsernameInput.value;
    const password = authPasswordInput.value;
    const t = I18N[currentLang];

    if (authMode === 'login') {
      const res = await window.authManager.login(username, password);
      if (res.success) {
        authFeedback.className = 'auth-feedback success';
        authFeedback.textContent = t.authSuccessLogin + res.user.username;
        syncUserUI();
        setTimeout(closeAuthModal, 700);
      } else {
        authFeedback.className = 'auth-feedback';
        authFeedback.textContent = t[res.errorKey] || res.errorKey;
      }
    } else {
      const res = await window.authManager.register(username, password);
      if (res.success) {
        authFeedback.className = 'auth-feedback success';
        authFeedback.textContent = t.authSuccessRegister + res.user.username;
        syncUserUI();
        setTimeout(closeAuthModal, 700);
      } else {
        authFeedback.className = 'auth-feedback';
        authFeedback.textContent = t[res.errorKey] || res.errorKey;
      }
    }
  });

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('tetris_lang', lang);
    langIndicator.textContent = lang === 'tr' ? 'EN' : 'TR';
    document.documentElement.lang = lang;

    const t = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    const isSoundOn = window.soundFX ? window.soundFX.enabled : true;
    soundIndicator.textContent = isSoundOn ? t.soundOn : t.soundOff;

    if (!isRunning && !isGameOver) {
      overlayTitle.textContent = t.readyTitle;
      overlayDesc.textContent = t.readyDesc;
      btnMainAction.textContent = t.btnStart;
    } else if (isPaused) {
      overlayTitle.textContent = t.pausedTitle;
      overlayDesc.textContent = t.pausedDesc;
      btnMainAction.textContent = t.btnResume;
    } else if (isGameOver) {
      overlayTitle.textContent = t.gameOverTitle;
      overlayDesc.textContent = t.gameOverDesc(score, lines);
      btnMainAction.textContent = t.btnRestart;
    }

    syncUserUI();
  }

  btnToggleLang.addEventListener('click', () => {
    const nextL = currentLang === 'tr' ? 'en' : 'tr';
    applyLanguage(nextL);
  });

  function createBag() {
    const keys = Object.keys(SHAPES);
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]];
    }
    return keys;
  }

  function getNextType() {
    if (nextQueue.length <= 3) {
      nextQueue.push(...createBag());
    }
    return nextQueue.shift();
  }

  function createPiece(type) {
    const matrix = SHAPES[type].map(row => [...row]);
    return {
      type,
      matrix,
      x: Math.floor(COLS / 2) - Math.ceil(matrix[0].length / 2),
      y: 0
    };
  }

  function createEmptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  function resetGame() {
    grid = createEmptyGrid();
    nextQueue = [];
    nextQueue.push(...createBag(), ...createBag());
    currentPiece = createPiece(getNextType());
    holdPiece = null;
    canHold = true;
    score = 0;
    lines = 0;
    level = 1;
    comboCount = 0;
    lastActionWasRotate = false;
    survivalGarbageTimer = 0;
    isGameOver = false;
    isPaused = false;
    isRunning = true;
    particles = [];
    startTimer();
    updateUI();
  }

  function updateUI() {
    scoreEl.textContent = score;
    levelEl.textContent = level;
    linesEl.textContent = lines;

    if (score > highscore) {
      highscore = score;
      if (window.authManager && window.authManager.currentUser) {
        window.authManager.updateStats(score, 0);
      } else {
        localStorage.setItem('tetris_high_score', highscore.toString());
      }
      highscoreEl.textContent = highscore;
      updateLeaderboard();
    }

    // Başarım Kontrolleri
    if (score >= 10000) {
      window.achievementManager?.unlock('score_10k', showAchievementToast);
    }
    if (level >= 5) {
      window.achievementManager?.unlock('level_5', showAchievementToast);
    }
  }

  function collide(piece, customOffset = { x: 0, y: 0 }) {
    const matrix = piece.matrix;
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          const newX = piece.x + c + customOffset.x;
          const newY = piece.y + r + customOffset.y;
          if (newX < 0 || newX >= COLS || newY >= ROWS) {
            return true;
          }
          if (newY >= 0 && grid[newY][newX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function rotateMatrix(matrix, dir = 1) {
    const N = matrix.length;
    const result = Array.from({ length: N }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (dir > 0) {
          result[c][N - 1 - r] = matrix[r][c];
        } else {
          result[N - 1 - c][r] = matrix[r][c];
        }
      }
    }
    return result;
  }

  // T-Spin Algılama (3-köşe kuralı)
  function checkTSpin() {
    if (!currentPiece || currentPiece.type !== 'T' || !lastActionWasRotate) return false;
    const { x, y } = currentPiece;
    const corners = [
      [x, y], [x + 2, y], [x, y + 2], [x + 2, y + 2]
    ];
    let occupiedCorners = 0;
    for (const [cx, cy] of corners) {
      if (cx < 0 || cx >= COLS || cy >= ROWS || (cy >= 0 && grid[cy][cx] !== 0)) {
        occupiedCorners++;
      }
    }
    return occupiedCorners >= 3;
  }

  function rotateCurrent() {
    if (!currentPiece || isPaused || isGameOver) return;
    const prevMatrix = currentPiece.matrix;
    currentPiece.matrix = rotateMatrix(currentPiece.matrix, 1);

    const kicks = [0, -1, 1, -2, 2];
    let kicked = false;
    for (const offset of kicks) {
      if (!collide(currentPiece, { x: offset, y: 0 })) {
        currentPiece.x += offset;
        kicked = true;
        break;
      }
    }

    if (!kicked) {
      currentPiece.matrix = prevMatrix;
    } else {
      lastActionWasRotate = true;
      window.soundFX?.playRotate();
    }
  }

  function getGhostY() {
    if (!currentPiece) return 0;
    let offset = 0;
    while (!collide(currentPiece, { x: 0, y: offset + 1 })) {
      offset++;
    }
    return currentPiece.y + offset;
  }

  // Hayatta Kalma Modu İçin Alttan Çöp Satırı Ekle
  function addGarbageLine() {
    if (isPaused || isGameOver || !isRunning) return;
    grid.shift();
    const hole = Math.floor(Math.random() * COLS);
    const garbageRow = Array(COLS).fill('Z');
    garbageRow[hole] = 0;
    grid.push(garbageRow);
    triggerScreenShake();
  }

  function lockPiece() {
    const { matrix, x, y, type } = currentPiece;
    const isTSpin = checkTSpin();

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          if (y + r < 0) {
            triggerGameOver();
            return;
          }
          grid[y + r][x + c] = type;
        }
      }
    }

    window.soundFX?.playDrop();

    if (isTSpin) {
      window.soundFX?.playTSpin();
      triggerMessage(I18N[currentLang].tspinText);
      score += 400 * level;
      triggerScreenShake();
      window.achievementManager?.unlock('t_spin_pro', showAchievementToast);
    }

    checkLines(isTSpin);

    currentPiece = createPiece(getNextType());
    canHold = true;
    lastActionWasRotate = false;

    if (collide(currentPiece)) {
      triggerGameOver();
    }
  }

  function triggerMessage(text) {
    floatMessage.textContent = text;
    floatMessage.classList.add('show');
    setTimeout(() => {
      floatMessage.classList.remove('show');
    }, 900);
  }

  function checkLines(isTSpin = false) {
    const linesToClear = [];
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r].every(val => val !== 0)) {
        linesToClear.push(r);
      }
    }

    if (linesToClear.length === 0) {
      comboCount = 0;
      return;
    }

    comboCount++;

    // Parçacık patlaması
    linesToClear.forEach(rowIdx => {
      for (let c = 0; c < COLS; c++) {
        const type = grid[rowIdx][c];
        const color = COLORS[type]?.main || '#fff';
        const px = c * BLOCK_SIZE + BLOCK_SIZE / 2;
        const py = rowIdx * BLOCK_SIZE + BLOCK_SIZE / 2;
        for (let i = 0; i < 8; i++) {
          particles.push(new Particle(px, py, color));
        }
      }
    });

    linesToClear.forEach(rowIdx => {
      grid.splice(rowIdx, 1);
      grid.unshift(Array(COLS).fill(0));
    });

    const cleared = linesToClear.length;
    lines += cleared;

    // Ekran Sarsıntısı (Screen Shake)
    if (cleared >= 3 || isTSpin) {
      triggerScreenShake();
    }

    // Skor Tablosu
    const basePoints = [0, 100, 300, 500, 800];
    score += (basePoints[cleared] || 100) * level;

    // Kombo bonusu
    if (comboCount > 1) {
      score += (comboCount * 50) * level;
      triggerMessage(I18N[currentLang].comboText(comboCount));
    }

    // Başarımlar
    window.achievementManager?.unlock('first_clear', showAchievementToast);
    if (cleared === 4) {
      window.achievementManager?.unlock('tetris_master', showAchievementToast);
    }
    if (comboCount >= 3) {
      window.achievementManager?.unlock('combo_king', showAchievementToast);
    }

    const t = I18N[currentLang];
    const nextLevel = Math.floor(lines / 10) + 1;
    if (nextLevel > level) {
      level = nextLevel;
      triggerMessage(t.levelUp(level));
    } else if (cleared === 4) {
      triggerMessage(t.tetrisClear);
    } else if (cleared >= 2 && comboCount <= 1) {
      triggerMessage(t.multiLines(cleared));
    }

    // Sprint Modu Kontrolü (40 Satır)
    if (gameMode === 'sprint' && lines >= 40) {
      window.achievementManager?.unlock('sprint_complete', showAchievementToast);
      triggerGameWin(t.sprintWon(formatTime(gameTimeSeconds)));
      return;
    }

    window.soundFX?.playLineClear(cleared);
    updateUI();
  }

  function holdCurrentPiece() {
    if (!canHold || !currentPiece || isPaused || isGameOver) return;
    window.soundFX?.playRotate();

    if (holdPiece === null) {
      holdPiece = currentPiece.type;
      currentPiece = createPiece(getNextType());
    } else {
      const temp = holdPiece;
      holdPiece = currentPiece.type;
      currentPiece = createPiece(temp);
    }
    canHold = false;
    lastActionWasRotate = false;
  }

  function hardDrop() {
    if (!currentPiece || isPaused || isGameOver) return;
    let droppedLines = 0;
    while (!collide(currentPiece, { x: 0, y: 1 })) {
      currentPiece.y++;
      droppedLines++;
    }
    score += droppedLines * 2;
    updateUI();
    lockPiece();
  }

  function drop() {
    if (!currentPiece || isPaused || isGameOver) return;
    if (!collide(currentPiece, { x: 0, y: 1 })) {
      currentPiece.y++;
      score += 1;
      updateUI();
    } else {
      lockPiece();
    }
    dropCounter = 0;
  }

  function move(dir) {
    if (!currentPiece || isPaused || isGameOver) return;
    if (!collide(currentPiece, { x: dir, y: 0 })) {
      currentPiece.x += dir;
      lastActionWasRotate = false;
      window.soundFX?.playMove();
    }
  }

  function drawBlock(targetCtx, x, y, size, type, isGhost = false) {
    const colorInfo = COLORS[type] || { main: '#fff', glow: '#fff', dark: '#888' };
    targetCtx.save();

    if (isGhost) {
      targetCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      targetCtx.strokeStyle = colorInfo.glow;
      targetCtx.lineWidth = 1.5;
      targetCtx.strokeRect(x + 1, y + 1, size - 2, size - 2);
      targetCtx.fillRect(x + 1, y + 1, size - 2, size - 2);
    } else {
      targetCtx.shadowColor = colorInfo.glow;
      targetCtx.shadowBlur = 8;

      const grad = targetCtx.createLinearGradient(x, y, x + size, y + size);
      grad.addColorStop(0, colorInfo.glow);
      grad.addColorStop(0.3, colorInfo.main);
      grad.addColorStop(1, colorInfo.dark);

      targetCtx.fillStyle = grad;
      targetCtx.fillRect(x + 1, y + 1, size - 2, size - 2);

      targetCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      targetCtx.lineWidth = 1;
      targetCtx.strokeRect(x + 2, y + 2, size - 4, size - 4);
    }

    targetCtx.restore();
  }

  function drawGridBackground() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * BLOCK_SIZE, 0);
      ctx.lineTo(c * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * BLOCK_SIZE);
      ctx.lineTo(COLS * BLOCK_SIZE, r * BLOCK_SIZE);
      ctx.stroke();
    }
  }

  function drawPreview(targetCtx, type, canvasWidth, canvasHeight, boxSize = 22) {
    targetCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (!type) return;

    const matrix = SHAPES[type];
    const width = matrix[0].length * boxSize;
    const height = matrix.length * boxSize;
    const offsetX = Math.floor((canvasWidth - width) / 2);
    const offsetY = Math.floor((canvasHeight - height) / 2);

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] !== 0) {
          drawBlock(targetCtx, offsetX + c * boxSize, offsetY + r * boxSize, boxSize, type);
        }
      }
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGridBackground();

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[r][c] !== 0) {
          drawBlock(ctx, c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, grid[r][c]);
        }
      }
    }

    if (currentPiece && !isGameOver) {
      const ghostY = getGhostY();
      const { matrix, x, type } = currentPiece;
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c] !== 0) {
            drawBlock(ctx, (x + c) * BLOCK_SIZE, (ghostY + r) * BLOCK_SIZE, BLOCK_SIZE, type, true);
          }
        }
      }

      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c] !== 0) {
            drawBlock(ctx, (x + c) * BLOCK_SIZE, (currentPiece.y + r) * BLOCK_SIZE, BLOCK_SIZE, type);
          }
        }
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].alpha <= 0.05) {
        particles.splice(i, 1);
      }
    }

    drawPreview(holdCtx, holdPiece, holdCanvas.width, holdCanvas.height, 24);
    drawPreview(nextCtx, nextQueue[0], nextCanvas.width, nextCanvas.height, 24);
    drawPreview(next2Ctx, nextQueue[1], next2Canvas.width, next2Canvas.height, 16);
  }

  function gameLoop(time = 0) {
    if (!isRunning) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    if (!isPaused && !isGameOver) {
      dropCounter += deltaTime;
      const dropInterval = Math.max(100, 1000 - (level - 1) * 90);
      if (dropCounter > dropInterval) {
        drop();
      }

      // Hayatta kalma modu: Her 8 saniyede bir alttan satır yükselir
      if (gameMode === 'survival') {
        survivalGarbageTimer += deltaTime;
        if (survivalGarbageTimer > 8000) {
          survivalGarbageTimer = 0;
          addGarbageLine();
        }
      }
    }

    render();
    requestAnimationFrame(gameLoop);
  }

  function startGame() {
    overlayScreen.classList.remove('active');
    resetGame();
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }

  function togglePause() {
    if (!isRunning || isGameOver) return;
    isPaused = !isPaused;
    const t = I18N[currentLang];
    if (isPaused) {
      overlayTitle.textContent = t.pausedTitle;
      overlayDesc.textContent = t.pausedDesc;
      btnMainAction.textContent = t.btnResume;
      overlayScreen.classList.add('active');
    } else {
      overlayScreen.classList.remove('active');
      lastTime = performance.now();
    }
  }

  function triggerGameWin(desc) {
    isGameOver = true;
    isRunning = false;
    stopTimer();
    window.soundFX?.playAchievement();
    overlayTitle.textContent = "🏆 TEBRİKLER!";
    overlayDesc.textContent = desc;
    btnMainAction.textContent = I18N[currentLang].btnRestart;
    overlayScreen.classList.add('active');

    if (window.authManager && window.authManager.currentUser) {
      window.authManager.updateStats(score, lines);
      refreshHighScore();
      updateLeaderboard();
    }
  }

  function triggerGameOver() {
    isGameOver = true;
    isRunning = false;
    stopTimer();
    window.soundFX?.playGameOver();
    const t = I18N[currentLang];
    overlayTitle.textContent = t.gameOverTitle;
    overlayDesc.textContent = t.gameOverDesc(score, lines);
    btnMainAction.textContent = t.btnRestart;
    overlayScreen.classList.add('active');

    if (window.authManager && window.authManager.currentUser) {
      window.authManager.updateStats(score, lines);
      refreshHighScore();
      updateLeaderboard();
    }
  }

  window.addEventListener('keydown', (e) => {
    if (authModal.classList.contains('active') || achievementsModal.classList.contains('active')) return;

    window.soundFX?.init();

    if (e.code === 'KeyP' || e.code === 'Escape') {
      togglePause();
      return;
    }

    if (isPaused || isGameOver || !isRunning) {
      if (e.code === 'Enter' || e.code === 'Space') {
        if (!isRunning || isGameOver) startGame();
        else if (isPaused) togglePause();
      }
      return;
    }

    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        move(-1);
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'KeyD':
        move(1);
        e.preventDefault();
        break;
      case 'ArrowDown':
      case 'KeyS':
        drop();
        e.preventDefault();
        break;
      case 'ArrowUp':
      case 'KeyW':
      case 'KeyX':
        rotateCurrent();
        e.preventDefault();
        break;
      case 'Space':
        hardDrop();
        e.preventDefault();
        break;
      case 'KeyC':
      case 'ShiftLeft':
      case 'ShiftRight':
        holdCurrentPiece();
        e.preventDefault();
        break;
      case 'KeyM':
        toggleSound();
        e.preventDefault();
        break;
    }
  });

  btnMainAction.addEventListener('click', () => {
    window.soundFX?.init();
    if (!isRunning || isGameOver) {
      startGame();
    } else if (isPaused) {
      togglePause();
    }
  });

  function toggleSound() {
    const isEnabled = window.soundFX.toggle();
    const t = I18N[currentLang];
    soundIndicator.textContent = isEnabled ? t.soundOn : t.soundOff;
    btnToggleSound.textContent = isEnabled ? "🔔" : "🔕";
  }

  btnToggleSound.addEventListener('click', toggleSound);

  const bindTouch = (id, action) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      window.soundFX?.init();
      action();
    }, { passive: false });
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.soundFX?.init();
      action();
    });
  };

  bindTouch('touch-left', () => move(-1));
  bindTouch('touch-right', () => move(1));
  bindTouch('touch-down', () => drop());
  bindTouch('touch-rotate', () => rotateCurrent());
  bindTouch('touch-hard-drop', () => hardDrop());
  bindTouch('touch-hold', () => holdCurrentPiece());

  applyLanguage(currentLang);
  syncUserUI();
  grid = createEmptyGrid();
  render();
})();
