# Troubleshooting

## npm проблеми
- ❌ `ERESOLVE unable to resolve dependency tree`  
  Решение: Опитай с `npm install --legacy-peer-deps`

## Next.js development
- ❌ 404 или redirect loop  
  Решение: Провери layout/page файловете, конфигурацията на NextAuth.

## Auth проблеми
- NextAuth не валидира  
  Решение: Провери `.env.local` (NEXTAUTH_SECRET), рестартирай сървъра.

## Database connection
- Проверете `DATABASE_URL` формата, креденшълите.

## Други
- Изчисти `.next/` и `node_modules/` и инсталирай наново.
