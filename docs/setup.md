# Setup Guide

## Инсталация

1. Клонирай репозиторито
git clone https://github.com/username/dshome.git
2. Влез в папката и инсталирай зависимостите
npm install

3. Конфигурирай `.env.local`
- Пример:
  ```
  DATABASE_URL=postgresql://shopuser:password@localhost:5432/shopdb
  NEXTAUTH_SECRET=mySecret
  ```

4. Стартирай dev сървър
npm run dev


## Полезни npm команди

- `npm run dev` – development
- `npm run build` – production build
- `npm run lint` – linting
