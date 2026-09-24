#!/usr/bin/env bash
# ==============================================================================
# Tetris Web Edition - Systemd Service Installer Script
# ==============================================================================

set -e

SERVICE_NAME="tetris-web"
SERVICE_FILE="tetris-web.service"
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURRENT_USER="$(logname 2>/dev/null || echo "$USER")"
PORT="${1:-3000}"

echo "======================================================"
echo "🕹️  Tetris Web Edition - Servis Kurulumu"
echo "======================================================"

# Root yetkisi kontrolü
if [ "$EUID" -ne 0 ]; then
  echo "⚠️  Hata: Bu betik root (sudo) yetkisi ile çalıştırılmalıdır."
  echo "👉 Lütfen şu şekilde çalıştırın: sudo bash install-service.sh [PORT]"
  exit 1
fi

echo "🔹 Çalışma dizini: $CURRENT_DIR"
echo "🔹 Çalışacak kullanıcı: $CURRENT_USER"
echo "🔹 Dinlenecek port: $PORT"

# Dinamik service dosyasını oluştur
cat <<EOF > "/etc/systemd/system/${SERVICE_NAME}.service"
[Unit]
Description=Tetris Web Edition HTTP Service
After=network.target

[Service]
Type=simple
User=${CURRENT_USER}
WorkingDirectory=${CURRENT_DIR}
ExecStart=/usr/bin/python3 ${CURRENT_DIR}/server.py ${PORT}
Restart=always
RestartSec=3
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

echo "✅ /etc/systemd/system/${SERVICE_NAME}.service dosyası oluşturuldu."

# Systemd yenile ve servisi aktif et
echo "🔹 Systemd yapılandırması yeniden yükleniyor..."
systemctl daemon-reload

echo "🔹 Servis etkinleştiriliyor (açılışta otomatik başlatma)..."
systemctl enable "${SERVICE_NAME}"

echo "🔹 Servis başlatılıyor..."
systemctl restart "${SERVICE_NAME}"

echo "------------------------------------------------------"
echo "🎉 Kurulum başarıyla tamamlandı!"
echo "🌐 Tetris şu adreste yayında: http://localhost:${PORT}"
echo ""
echo "📌 Kullanışlı Komutlar:"
echo "   - Durumu kontrol et : sudo systemctl status ${SERVICE_NAME}"
echo "   - Servisi durdur    : sudo systemctl stop ${SERVICE_NAME}"
echo "   - Servisi yeniden başlat: sudo systemctl restart ${SERVICE_NAME}"
echo "   - Canlı logları izle: sudo journalctl -u ${SERVICE_NAME} -f"
echo "======================================================"
