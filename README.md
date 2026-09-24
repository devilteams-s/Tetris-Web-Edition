# 🕹️ Tetris Web Edition - Neon Arcade

Modern, akıcı, neon/retro temalı, hesap ve başarım sistemli gelişmiş bir tarayıcı tabanlı **Tetris** oyunu. Sıfır harici kütüphane bağımlılığı ile saf HTML5 Canvas, CSS3 Glassmorphism ve Web Audio API teknolojileriyle inşa edilmiştir.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## ✨ Özellikler

### 🎮 Oyun Modları (Game Modes)
- **Maraton (Marathon):** Sonsuz klasik mod, seviyeler yükseldikçe düşüş hızı katlanır.
- **40 Satır Sprint (40 Lines Sprint):** 40 satırı en kısa sürede tamamlama zamana karşı yarış modu.
- **2 Dakika Ultra (2 Min Ultra):** 120 saniyelik geri sayımda en yüksek skoru elde etme modu.
- **Hayatta Kalma (Survival):** Her 8 saniyede bir alttan delikli rastgele çöp satırların yükseldiği zorlu mod.

### 🎵 8-Bit Chiptune Müzik & Sesler (Web Audio API)
- **Orijinal Korobeiniki Müziği:** Harici mp3/wav dosyasına ihtiyaç duymadan, tarayıcının Web Audio API osilatörleriyle üretilen 8-bit tema müziği (`🎵`).
- **Retro Arcade Ses Efektleri:** Döndürme, düşürme, satır silme, Tetris patlaması ve Game Over sesleri.

### 👤 Hesap & Liderlik Tablosu (Leaderboard)
- **Kullanıcı Kayıt & Giriş:** Şifre doğrulamalı yerel profil sistemi.
- **Kişisel Skor Takibi:** En yüksek skor, oynanan oyun sayısı ve temizlenen toplam satırlar profilinizde tutulur.
- **Liderlik Sıralaması:** En yüksek skora sahip ilk 5 oyuncu sağ panelde canlı listelenir.

### 🏆 Başarımlar (Achievements) & Rozetler
- Belirli hedefleri başardığınızda açılan 7 farklı başarım rozeti (Toast bildirimi ve zafer sesi eşliğinde):
  - 🧹 *İlk Zafer (First Clear)*
  - 🔥 *Neon Tetris! (4 satır temizleme)*
  - ⚡ *Kombo Kralı (3x ardışık kombo)*
  - 🌀 *T-Spin Ustası*
  - 🚀 *Hız Tutkunu (Seviye 5)*
  - 👑 *Skor Avcısı (10.000 puan)*
  - ⏱️ *Sprint Şampiyonu (Sprint modunu tamamlama)*

### 🌀 Gelişmiş Mekanikler & Görsel Efektler
- **T-Spin Algılama:** 3-köşe kuralı algoritması ve ekstra bonus puanlar.
- **Kombo Sistemi:** Ardışık temizliklerde katlanarak artan skor çarpanı.
- **Ekran Sarsıntısı (Screen Shake):** Tetris veya T-Spin yapıldığında dinamik ekran sarsılma animasyonu.
- **Hayalet Parça (Ghost Piece):** Parçanın tam nereye düşeceğini önceden gösteren projeksiyon.
- **Hold (Saklama) & 2 Sıradaki Parça:** Parça saklama ve sıradaki taşları önizleme.
- **Çoklu Dil (TR/EN):** Sağ üstteki tek tuşla anında Türkçe ve İngilizce dil değişimi.
- **Mobil & Dokunmatik Uyumlu:** Ekran altındaki dokunmatik D-pad tuşlarıyla mobil/tablet desteği.

---

## ⌨️ Kontroller

| Tuş | Eylem |
| :--- | :--- |
| <kbd>←</kbd> / <kbd>→</kbd> veya <kbd>A</kbd> / <kbd>D</kbd> | Sola / Sağa Hareket |
| <kbd>↑</kbd> / <kbd>W</kbd> / <kbd>X</kbd> | Parçayı Döndür |
| <kbd>↓</kbd> / <kbd>S</kbd> | Hızlı Düşür (Soft Drop) |
| <kbd>Space</kbd> | Anında Düşür (Hard Drop) |
| <kbd>C</kbd> / <kbd>Shift</kbd> | Parçayı Sakla (Hold) |
| <kbd>P</kbd> / <kbd>Esc</kbd> | Duraklat / Devam Et |
| <kbd>M</kbd> | Sesi Aç / Kapat |

---

## 🚀 Kurulum ve Sunucu Başlatma

Projeyi yerel bilgisayarınızda çalıştırmak için harici bir derleme veya `npm install` gerektirmez. Statik bir web sunucusu yeterlidir.

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/devilteams-s/Tetris-Web-Edition.git
cd Tetris-Web-Edition
```

### 2. Sunucuyu Başlatın (Tercih Ettiğiniz Yöntemle)

#### Yöntem A: Python 3 ile (En Kolay)
```bash
python3 -m http.server 3000
```

#### Yöntem B: Node.js (npx serve) ile
```bash
npx serve -l 3000
# veya
npx http-server -p 3000
```

#### Yöntem C: PHP ile
```bash
php -S localhost:3000
```

### 3. Linux Sunucu Servisi (Systemd Daemon) Olarak Kurma 🤖

Sunucunuzda arka planda kesintisiz çalışması ve sunucu yeniden başladığında otomatik açılması için:

```bash
# Kurulum betiğini çalıştırın (Varsayılan port: 3000)
sudo bash install-service.sh

# Veya farklı bir port belirterek çalıştırın (Örn: 80 veya 8080)
sudo bash install-service.sh 8080
```

#### Servis Yönetim Komutları:
```bash
sudo systemctl status tetris-web    # Servis durumunu kontrol et
sudo systemctl restart tetris-web   # Servisi yeniden başlat
sudo systemctl stop tetris-web      # Servisi durdur
sudo journalctl -u tetris-web -f    # Canlı logları görüntüle
```

### 4. Oyuna Giriş
Tarayıcınızı açın ve adrese gidin:
```
http://localhost:3000
```

---

## 📂 Dosya Yapısı

```
Tetris-Web-Edition/
├── index.html       # Ana oyun arayüzü, canvas ve modallar
├── style.css        # Neon görsel tasarım, cam efekti ve responsive stiller
├── tetris.js        # Ana oyun döngüsü, parça fizikleri, modlar ve animasyonlar
├── audio.js         # Web Audio API ile Chiptune BGM (Korobeiniki) ve ses efektleri
├── auth.js          # Kullanıcı hesapları, giriş/kayıt ve liderlik tablosu mantığı
├── achievements.js  # Başarım tanımları, rozetler ve tetikleyici sistemi
├── LICENSE          # MIT Lisansı
└── README.md        # Proje dokümantasyonu
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak lisanslanmıştır. Dilediğiniz gibi kullanabilir, değiştirebilir ve geliştirebilirsiniz.
