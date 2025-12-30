# Portfolio Server

Backend сервер для управления портфолио с админ панелью.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` в корне папки `server`:
```
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=8081
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

3. Убедитесь, что MongoDB запущен и доступен

4. Запустите сервер:
```bash
npm start
# или для разработки с автоперезагрузкой:
npm run dev
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация админа
- `POST /api/auth/login` - Вход в систему

### Проекты
- `GET /api/projects` - Получить все проекты (публичный)
- `GET /api/projects/:id` - Получить проект по ID (публичный)
- `POST /api/projects` - Создать проект (требует авторизации)
- `PUT /api/projects/:id` - Обновить проект (требует авторизации)
- `DELETE /api/projects/:id` - Удалить проект (требует авторизации)

### Переводы
- `GET /api/translations` - Получить все переводы (публичный)
- `GET /api/translations/:language` - Получить перевод для языка (публичный)
- `POST /api/translations` - Создать/обновить перевод (требует авторизации)
- `PUT /api/translations/:language` - Обновить перевод (требует авторизации)
- `DELETE /api/translations/:language` - Удалить перевод (требует авторизации)

### Загрузка файлов
- `POST /api/upload` - Загрузить файл (требует авторизации)
- `DELETE /api/upload/:filename` - Удалить файл (требует авторизации)

## Первоначальная настройка

После первого запуска создайте админ аккаунт:
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

Или используйте админ панель для регистрации (если реализовано).

