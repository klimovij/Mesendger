#!/bin/bash

# Скрипт для настройки nginx для раздачи статических файлов из /uploads

set -e

echo "🔧 Настройка nginx для раздачи статических файлов из /uploads..."

# Определяем путь к проекту
PROJECT_DIR="$HOME/mesendger/telegram-clone"
UPLOADS_DIR="$PROJECT_DIR/uploads"

# Проверяем, существует ли папка uploads
if [ ! -d "$UPLOADS_DIR" ]; then
    echo "❌ Папка uploads не найдена: $UPLOADS_DIR"
    exit 1
fi

echo "📁 Папка uploads: $UPLOADS_DIR"

# Находим конфигурационный файл nginx
NGINX_CONF=""
if [ -f "/etc/nginx/sites-available/default" ]; then
    NGINX_CONF="/etc/nginx/sites-available/default"
elif [ -f "/etc/nginx/conf.d/default.conf" ]; then
    NGINX_CONF="/etc/nginx/conf.d/default.conf"
else
    echo "❌ Не найден конфигурационный файл nginx"
    echo "   Проверьте /etc/nginx/sites-available/ или /etc/nginx/conf.d/"
    exit 1
fi

echo "📝 Конфигурационный файл nginx: $NGINX_CONF"

# Создаем бэкап
BACKUP_FILE="${NGINX_CONF}.backup.$(date +%Y%m%d_%H%M%S)"
sudo cp "$NGINX_CONF" "$BACKUP_FILE"
echo "💾 Бэкап создан: $BACKUP_FILE"

# Проверяем, есть ли уже location /uploads
if grep -q "location /uploads" "$NGINX_CONF"; then
    echo "⚠️  location /uploads уже существует в конфигурации"
    echo "   Проверьте конфигурацию вручную"
else
    echo "➕ Добавляем location /uploads в конфигурацию nginx..."
    
    # Создаем временный файл с новой конфигурацией
    TEMP_CONF=$(mktemp)
    
    # Копируем существующую конфигурацию
    sudo cp "$NGINX_CONF" "$TEMP_CONF"
    
    # Добавляем location /uploads перед location / (если есть)
    if grep -q "location / {" "$TEMP_CONF"; then
        # Вставляем перед location /
        sudo sed -i "/location \/ {/i\\
    # Статические файлы из uploads\\
    location /uploads {\\
        alias $UPLOADS_DIR;\\
        expires 1y;\\
        add_header Cache-Control \"public, immutable\";\\
        access_log off;\\
    }\\
" "$TEMP_CONF"
    else
        # Добавляем в конец server блока
        sudo sed -i "/server {/a\\
    # Статические файлы из uploads\\
    location /uploads {\\
        alias $UPLOADS_DIR;\\
        expires 1y;\\
        add_header Cache-Control \"public, immutable\";\\
        access_log off;\\
    }\\
" "$TEMP_CONF"
    fi
    
    # Копируем обратно
    sudo cp "$TEMP_CONF" "$NGINX_CONF"
    sudo rm "$TEMP_CONF"
    
    echo "✅ location /uploads добавлен в конфигурацию"
fi

# Проверяем синтаксис nginx
echo "🔍 Проверка синтаксиса nginx..."
if sudo nginx -t; then
    echo "✅ Синтаксис nginx корректен"
    
    # Перезагружаем nginx
    echo "🔄 Перезагрузка nginx..."
    sudo systemctl reload nginx || sudo service nginx reload
    
    echo ""
    echo "✅ Настройка завершена!"
    echo ""
    echo "📝 Проверьте конфигурацию:"
    echo "   sudo nginx -t"
    echo ""
    echo "📋 Просмотр конфигурации:"
    echo "   cat $NGINX_CONF | grep -A 5 'location /uploads'"
    echo ""
    echo "🔍 Проверьте логи nginx:"
    echo "   sudo tail -f /var/log/nginx/error.log"
else
    echo "❌ Ошибка в синтаксисе nginx!"
    echo "   Восстанавливаем бэкап..."
    sudo cp "$BACKUP_FILE" "$NGINX_CONF"
    exit 1
fi

