// Achievements System for Tetris Web Edition
class AchievementManager {
  constructor() {
    this.storageKey = 'tetris_achievements';
    this.definitions = [
      { id: 'first_clear', titleTr: 'İlk Zafer', titleEn: 'First Clear', descTr: 'İlk satırını temizle', descEn: 'Clear your first line', icon: '🧹' },
      { id: 'tetris_master', titleTr: 'Neon Tetris!', titleEn: 'Neon Tetris!', descTr: 'Tek seferde 4 satır temizle', descEn: 'Clear 4 lines at once', icon: '🔥' },
      { id: 'combo_king', titleTr: 'Kombo Kralı', titleEn: 'Combo King', descTr: 'Ardışık 3 satır kombosu yap', descEn: 'Get a 3x consecutive combo', icon: '⚡' },
      { id: 't_spin_pro', titleTr: 'T-Spin Ustası', titleEn: 'T-Spin Master', descTr: 'Başarılı bir T-Spin gerçekleştir', descEn: 'Perform a successful T-Spin', icon: '🌀' },
      { id: 'level_5', titleTr: 'Hız Tutkunu', titleEn: 'Speed Demon', descTr: 'Seviye 5\'e ulaş', descEn: 'Reach Level 5', icon: '🚀' },
      { id: 'score_10k', titleTr: 'Skor Avcısı', titleEn: 'Score Hunter', descTr: '10.000 puanı aş', descEn: 'Score over 10,000 points', icon: '👑' },
      { id: 'sprint_complete', titleTr: 'Sprint Şampiyonu', titleEn: 'Sprint Finisher', descTr: '40 Satır Sprint modunu bitir', descEn: 'Complete 40 Lines Sprint mode', icon: '⏱️' }
    ];
    this.unlocked = this.loadUnlocked();
  }

  loadUnlocked() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveUnlocked() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.unlocked));
  }

  unlock(id, onUnlockCallback) {
    if (this.unlocked.includes(id)) return;
    const def = this.definitions.find(a => a.id === id);
    if (!def) return;

    this.unlocked.push(id);
    this.saveUnlocked();

    if (onUnlockCallback) {
      onUnlockCallback(def);
    }
  }

  getAll(lang = 'tr') {
    return this.definitions.map(def => ({
      ...def,
      title: lang === 'tr' ? def.titleTr : def.titleEn,
      desc: lang === 'tr' ? def.descTr : def.descEn,
      isUnlocked: this.unlocked.includes(def.id)
    }));
  }
}

window.achievementManager = new AchievementManager();
