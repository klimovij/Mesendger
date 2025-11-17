#!/bin/bash

# Скрипт полной переустановки проекта Mesendger на сервере
# ВНИМАНИЕ: Этот скрипт удалит весь код проекта, но сохранит базу данных

set -e  # Остановка при ошибке

echo "🚨 ВНИМАНИЕ: Начинается полная переустановка проекта!"
echo "📁 Текущая директория: $(pwd)"
echo ""

# Определяем путь к проекту
PROJECT_DIR="$HOME/mesendger/telegram-clone"
DB_FILE="$PROJECT_DIR/server/mesendger.db"
BACKUP_DIR="$HOME/mesendger_backup_$(date +%Y%m%d_%H%M%S)"

echo "1️⃣ Остановка PM2 процесса..."
pm2 stop mesendger 2>/dev/null || echo "   PM2 процесс не найден"
pm2 delete mesendger 2>/dev/null || echo "   PM2 процесс не найден"

echo ""
echo "2️⃣ Создание резервной копии базы данных..."
if [ -f "$DB_FILE" ]; then
    mkdir -p "$BACKUP_DIR"
    cp "$DB_FILE" "$BACKUP_DIR/mesendger.db"
    echo "   ✅ База данных скопирована в: $BACKUP_DIR/mesendger.db"
else
    echo "   ⚠️ База данных не найдена, пропускаем бэкап"
fi

# Бэкап папки uploads (аватары и файлы)
if [ -d "$PROJECT_DIR/uploads" ]; then
    echo "   📦 Копирование папки uploads..."
    cp -r "$PROJECT_DIR/uploads" "$BACKUP_DIR/uploads" 2>/dev/null || echo "   ⚠️ Не удалось скопировать uploads"
fi

echo ""
echo "3️⃣ Удаление старого проекта..."
if [ -d "$PROJECT_DIR" ]; then
    cd "$HOME/mesendger"
    rm -rf telegram-clone
    echo "   ✅ Старый проект удален"
else
    echo "   ⚠️ Папка проекта не найдена"
fi

echo ""
echo "4️⃣ Клонирование репозитория..."
cd "$HOME/mesendger"
git clone https://github.com/klimovij/Mesendger.git telegram-clone
cd telegram-clone
git checkout master

echo ""
echo "5️⃣ Восстановление базы данных..."
if [ -f "$BACKUP_DIR/mesendger.db" ]; then
    mkdir -p "$PROJECT_DIR/server"
    cp "$BACKUP_DIR/mesendger.db" "$DB_FILE"
    echo "   ✅ База данных восстановлена"
else
    echo "   ⚠️ Бэкап базы данных не найден, будет создана новая"
fi

# Восстановление папки uploads
if [ -d "$BACKUP_DIR/uploads" ]; then
    echo "   📦 Восстановление папки uploads..."
    cp -r "$BACKUP_DIR/uploads" "$PROJECT_DIR/uploads"
    echo "   ✅ Папка uploads восстановлена"
fi

echo ""
echo "6️⃣ Установка зависимостей сервера..."
cd "$PROJECT_DIR/server"
npm install

echo ""
echo "7️⃣ Установка зависимостей клиента..."
cd "$PROJECT_DIR/client-react"
npm install

echo ""
echo "8️⃣ Сборка клиентского приложения..."
npm run build

echo ""
echo "9️⃣ Запуск сервера через PM2..."
cd "$PROJECT_DIR/server"
pm2 start server.js --name mesendger
pm2 save

echo ""
echo "✅ Переустановка завершена!"
echo ""
echo "📊 Статус PM2:"
pm2 list
echo ""
echo "📝 Логи сервера:"
echo "   pm2 logs mesendger"
echo ""
echo "💾 Резервная копия сохранена в: $BACKUP_DIR"
echo ""
echo "🔍 Проверьте логи:"
echo "   pm2 logs mesendger --lines 50"

