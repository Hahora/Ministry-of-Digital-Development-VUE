# Система мониторинга информационного пространства — Фронтенд

Веб-интерфейс системы мониторинга общественного мнения и медиапространства.

## Технологии

- **Vue 3** (Composition API, TypeScript)
- **Vue Router** — маршрутизация
- **Tailwind CSS 4** — стилизация
- **ApexCharts** — графики и визуализация
- **Lucide Icons** — иконки
- **Vite** — сборка и dev-сервер

## Запуск

```bash
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:5173`.

## Переменные окружения

| Переменная | По умолчанию | Описание |
|---|---|---|
| `VITE_API_BASE_URL` | `/api/v1` | Базовый URL API бекенда |

В режиме разработки Vite проксирует `/api` на `http://localhost:8000`.

## Структура проекта

```
src/
├── auth/              # Аутентификация (JWT)
├── components/
│   ├── common/        # Переиспользуемые компоненты (BaseCard, MetricCard, ...)
│   ├── icons/         # SVG-иконки (VK, Telegram)
│   └── layout/        # Лейаут (Sidebar, Header, Footer, ChatPanel)
├── composables/       # Vue composables
├── data/              # Константы (категории, цвета, лейблы)
├── pages/             # Страницы приложения
├── router/            # Конфигурация маршрутов
└── services/          # API-клиент и сервисы
```

## Страницы

| Маршрут | Страница | Описание |
|---|---|---|
| `/login` | LoginPage | Авторизация |
| `/` | DashboardPage | Дашборд: метрики, топ-10 тем, графики |
| `/topics` | TopicsPage | Лента событий с фильтрацией |
| `/topics/:id` | TopicDetailPage | Карточка темы: факты, источники, динамика |
| `/analytics` | AnalyticsPage | Аналитика: тренды, категории, тональность |
| `/reports` | ReportsPage | Генерация и список отчётов |
| `/reports/:id` | ReportDetailPage | Детали отчёта |
| `/sources` | SourcesPage | Управление источниками (VK, Telegram) |

## API

Фронтенд взаимодействует с бекендом через REST API (`/api/v1`). Все запросы (кроме `/auth/login`) требуют JWT-токен в заголовке `Authorization: Bearer <token>`.

Основные эндпоинты:
- `POST /auth/login` — авторизация
- `GET /dashboard/summary` — сводка дашборда
- `GET /topics` — список тем
- `GET /analytics` — аналитика за период
- `GET /sources` — список источников
- `POST /chat/message` — ИИ-ассистент

## Сборка

```bash
npm run build
```

Результат в директории `dist/`.
