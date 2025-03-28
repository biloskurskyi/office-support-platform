# Офісна Мозаїка

**Офісна Мозаїка** — це український стартап, який надає власникам і менеджерам бізнесу ефективний спосіб ведення та контролю даних. Веб-додаток дозволяє створювати, оновлювати, переглядати та видаляти основну інформацію, а також працювати з метаданими.
Користувач має можливість завантажувати детальні звіти по кожній сутності бізнесу у зручному форматі.

### 🔐 Гарантія безпеки

- Дані захищені від несанкціонованого доступу.
- Персональна інформація шифрується.
- Гнучка система прав доступу для різних типів користувачів.

## 🚀 Переваги продукту

✅ Орієнтація на українського користувача.  
✅ Можливість перегляду статистики у веб-форматі та завантаження у PDF.  
✅ Простий та зручний інтерфейс.  
✅ Швидка обробка даних.  
✅ Високий рівень безпеки та захисту персональних даних.  
✅ Різні рівні доступу для користувачів.  
✅ Весь функціонал доступний безкоштовно.

## 🛠️ Технологічний стек

### 📌 Бекенд

Проєкт використовує **Django Rest Framework (DRF) v3.14.0**, що дозволяє створювати гнучкі та масштабовані REST API. Для забезпечення безпеки та зручності інтеграції застосовані наступні технології:

- **Django 4.2** — основний фреймворк для розробки.
- **Django Rest Framework (DRF) 3.14.0** — створення REST API.
- **drf-spectacular 0.26.1** — документація API.
- **psycopg2-binary 2.9.1** — взаємодія з PostgreSQL.
- **PyJWT 2.6.0** — аутентифікація через JWT.
- **django-cors-headers 3.14.0** — підтримка CORS.
- **flake8, isort** — лінтери для чистого коду.
- **python-decouple** — зберігання конфігураційних змінних.
- **drf-yasg** — генерація Swagger-документації.
- **reportlab** — генерація PDF-звітів.
- **itsdangerous** — підписані токени для безпечної передачі даних.

### 🗄️ База даних

Проєкт використовує **PostgreSQL** разом із Django ORM для ефективного управління даними.

### 🎨 Фронтенд

- **Vite** — швидкий збірник.
- **TypeScript** — статична типізація для JavaScript.
- **React** — створення динамічного інтерфейсу.
- **React Router** — маршрутизація.
- **MUI (Material UI)** — стилізація компонентів.
- **Emotion** — CSS-in-JS бібліотека.
- **Axios** — обробка HTTP-запитів.
- **Day.js** — робота з датами.
- **FileSaver.js** — збереження файлів у браузері.
- **JWT-decode** — декодування JWT-токенів.
- **ESLint & Prettier** — лінтер та форматер для чистоти коду.

## 🔧 Як запустити застосунок

### 1️⃣ Запуск бекенду

Для запуску бекенду в Docker виконайте команду в кореневій директорії:

```sh
docker-compose up --build
```

Процес запуску може зайняти **3-5 хвилин**.

### 2️⃣ Запуск фронтенду

Перейдіть у директорію `/frontend` та запустіть команду:

```sh
npm run dev
```

### 3️⃣ Доступ до адмін-панелі

Після запуску проєкту необхідно створити адміністратора через командний рядок, а потім перейти за адресою:

```sh
http://localhost:8765/admin/
```

## ⚠️ Увага

Файл `.env` не завантажується у репозиторій, його потрібно створити вручну в директорії `/app`. Приклад:

```ini
SECRET_KEY='django-SECRET_KEY-example'
DEBUG=True/False
DB_HOST=db
DB_NAME=devdb
DB_USER=devuser
DB_PASS=changeme
POSTGRES_DB=devdbexample
POSTGRES_USER=devuserexample
POSTGRES_PASSWORD=changeme
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=example@gmail.com
EMAIL_HOST_PASSWORD=examplepassword
EMAIL_PORT=587
EMAIL_USE_TLS=True
FRONTEND_BASE_URL=http://localhost:5173
RECORDS_URL=records/pdfs/
```

---

✉️ Якщо у вас є питання або пропозиції, зв'яжіться з нами!

