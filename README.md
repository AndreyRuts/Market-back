# Market Backend

Node.js backend для торговой площадки, аналогичной OLX. Поддерживает регистрацию, авторизацию, CRUD для товаров, заказы, email-уведомления продавцам, JWT-like сессии, загрузку изображений на Cloudinary и валидацию запросов.

## 📦 Стек технологий

- **Node.js**, **Express**
- **MongoDB**, **Mongoose**
- **Cloudinary** (загрузка изображений)
- **JWT-like сессии**: хранение access/refresh токенов в базе (коллекция Session)
- **Handlebars** (email-шаблоны)
- **Brevo (ex Sendinblue)** — email-рассылка
- **Multer** (обработка изображений)
- **Joi** (валидация данных)
- **dotenv** (переменные окружения)
- **Vercel/Netlify-совместим** (если будет фронтенд)

---

## ⚙️ Запуск проекта

```bash
git clone https://github.com/your-username/market-back.git
cd market-back
npm install
cp .env.example .env
# Заполнить .env своими данными
npm run dev
```

---

## 📁 Структура проекта

```
src/
├── controllers/        # Обработчики маршрутов
├── models/             # Mongoose-схемы: User, Goods, Order, Session
├── routes/             # auth, goods, own/goods, own/orders
├── services/           # Бизнес-логика (например, createOrder)
├── middlewares/        # Аутентификация, валидация, загрузка файлов
├── utils/              # Вспомогательные функции, sendEmail, ctrlWrapper
├── validation/         # Joi-схемы
├── constants/          # Константы (email subjects, шаблоны)
└── app.js              # Инициализация сервера
```

---

## 🔐 Аутентификация

- Все защищённые маршруты используют `authenticate` middleware.
- Access и Refresh токены хранятся в коллекции `Session`, валидируются по сроку действия.

---

## ✅ Реализованные роуты

### 🔑 `/auth`

| Метод | Путь        | Описание                 |
| ----- | ----------- | ------------------------ |
| POST  | `/register` | Регистрация пользователя |
| POST  | `/login`    | Логин и создание сессии  |
| POST  | `/logout`   | Удаление текущей сессии  |
| POST  | `/refresh`  | Обновление access токена |

---

### 📦 `/goods`

Публичные товары (доступны без авторизации).

| Метод | Путь   | Описание                                     |
| ----- | ------ | -------------------------------------------- |
| GET   | `/`    | Получить список товаров (фильтры, пагинация) |
| GET   | `/:id` | Получить товар по ID                         |

---

### 🛒 `/own/goods` (только для авторизованных пользователей)

| Метод  | Путь   | Описание                      |
| ------ | ------ | ----------------------------- |
| GET    | `/`    | Получить список своих товаров |
| POST   | `/`    | Создать товар с изображениями |
| PATCH  | `/:id` | Обновить товар по ID          |
| DELETE | `/:id` | Удалить товар по ID           |

---

### 📬 `/own/orders` (только для авторизованных пользователей)

| Метод | Путь | Описание                                                          |
| ----- | ---- | ----------------------------------------------------------------- |
| POST  | `/`  | Создать заказ, уведомить продавцов, уменьшить остаток товаров     |
| GET   | `/`  | Получить свои заказы с пагинацией, сортировкой и данными продавца |

- В теле каждого заказа содержится `seller` — ссылка на продавца.
- При создании заказа все продавцы автоматически получают email с деталями.

---

## ☁️ Загрузка изображений

- Используется `multer` для парсинга multipart/form-data.
- Файлы загружаются на **Cloudinary** при создании/редактировании товара.

---

## 🧪 Валидация

- Валидация осуществляется через Joi.
- Все схемы находятся в `validation/`
- Подключается через middleware `validateBody(schema)`

---

## ✉️ Email-уведомления продавцам

- Используется шаблонизатор **Handlebars**
- Письма рассылаются через **Brevo** (ex Sendinblue)
- Продавец получает email со списком заказанных у него товаров и адресом доставки

---

## 🔧 Переменные окружения (`.env`)

Пример в `.env.example`. Обязательные переменные:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email
CLIENT_URL=https://your-frontend.example.com
```

---

## 📝 Планы на будущее

---
