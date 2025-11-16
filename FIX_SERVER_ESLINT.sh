#!/bin/bash

# Скрипт для диагностики и исправления ESLint ошибок на сервере

set -e

echo "🔍 Диагностика состояния репозитория на сервере..."
echo ""

cd ~/mesendger/telegram-clone || {
  echo "❌ Ошибка: директория ~/mesendger/telegram-clone не найдена"
  exit 1
}

echo "1️⃣ Текущая ветка и статус:"
git branch -a
git status

echo ""
echo "2️⃣ Проверка remote:"
git remote -v

echo ""
echo "3️⃣ Обновление из GitHub (все ветки):"
git fetch origin --all

echo ""
echo "4️⃣ Проверка различий между локальной main и origin/master:"
git log main..origin/master --oneline || echo "Нет различий или ветка master не существует"

echo ""
echo "5️⃣ Обновление main из master (если master существует):"
if git show-ref --verify --quiet refs/remotes/origin/master; then
  echo "Ветка master найдена, обновляем main из master..."
  git checkout main
  git merge origin/master --no-edit || {
    echo "⚠️ Конфликт при слиянии. Используем стратегию theirs..."
    git merge origin/master -X theirs --no-edit || {
      echo "❌ Не удалось автоматически объединить. Требуется ручное вмешательство."
      exit 1
    }
  }
else
  echo "Ветка master не найдена, обновляем main из origin/main..."
  git checkout main
  git pull origin main --rebase || git pull origin main
fi

echo ""
echo "6️⃣ Проверка конкретных файлов с ошибками ESLint:"
echo "Проверка AdminMobile.jsx строка 1009:"
sed -n '1009p' client-react/src/components/AdminMobile.jsx | grep -q "window.confirm" && echo "✅ Исправлено: window.confirm" || echo "❌ НЕ исправлено: нужно window.confirm"

echo "Проверка AiAssistantModal.jsx строка 26:"
head -n 5 client-react/src/components/AiAssistantModal.jsx | grep -q "import.*styled" && echo "✅ Импорты в начале" || echo "❌ Импорты не в начале"

echo ""
echo "7️⃣ Если файлы не обновлены, принудительно обновляем:"
git reset --hard origin/main || git reset --hard origin/master

echo ""
echo "8️⃣ Установка зависимостей клиента:"
cd client-react
npm install

echo ""
echo "9️⃣ Сборка клиентского приложения:"
npm run build

echo ""
echo "✅ Готово! Если ошибки остались, проверьте файлы вручную."

