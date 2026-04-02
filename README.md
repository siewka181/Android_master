# Android Master Boost

Android Master Boost to aplikacja Expo/React Native (mobile + web) z backendem Express + tRPC + Drizzle, skupiona na diagnostyce urządzenia i scenariuszach optymalizacji (z fallbackami mock tam, gdzie urządzenie/ROOT nie jest dostępne).

## Setup (10 minut)

### Wymagania
- Node.js 20+
- pnpm 9+
- (opcjonalnie) MySQL + `DATABASE_URL` dla trwałych danych
- (mobile) Expo Go / build dev-client

### Instalacja
```bash
pnpm install
```

### Uruchomienie
```bash
pnpm dev
```
To uruchamia równolegle:
- `dev:server` – backend tRPC/Express
- `dev:metro` – Expo Router / Metro (web domyślnie na porcie 8081)

Dostępne skrypty:
```bash
pnpm dev
pnpm dev:server
pnpm dev:metro
pnpm test
pnpm check
pnpm lint
pnpm build
pnpm start
```

## Wymagane ENV

Minimalnie:
- `NODE_ENV` (development/production)

Opcjonalnie:
- `DATABASE_URL` – jeśli ustawione, logi operacji i inne query lecą do DB; bez tego aplikacja używa fallbacku in-memory dla części feature API.

## Architektura

### Frontend
- `app/` – ekrany Expo Router
- `components/` – komponenty UI (`FeatureScreen`, karty, logi)
- `lib/feature-context.tsx` – stan per-feature (`operationStatus`, `lastOperationTime`)
- `lib/language-context.tsx` + `lib/i18n.ts` – i18n PL/EN
- `lib/trpc.ts` – klient tRPC

### Backend
- `server/routers.ts` – root router (`system`, `auth`, `feature`)
- `server/featureRouter.ts` – API feature (`boost`, `diagnostics`, `logs`, `deviceFingerprint`)
- `server/db.ts` – helpery DB + fallback in-memory

### Baza danych
- `drizzle/schema.ts` – `users`, `operationLogs`
- `drizzle/0000_elite_eternals.sql` – init users
- `drizzle/0001_operation_logs.sql` – logi operacji

## Status funkcji (real vs mock)

### Real/API
- `feature.logs.add/list` (tRPC) – zapis/odczyt logów
- `feature.boost.run` – endpoint kolejkowania boost
- `feature.deviceFingerprint` – payload fingerprint z backendu

### Mixed (real + fallback)
- Ekran `Device Fingerprint` najpierw próbuje tRPC API, a przy błędzie robi fallback lokalny/Termux.

### Mock / device-dependent
- Część komend Termux/ROOT zależy od realnego urządzenia Android i uprawnień, więc w web/dev może działać jako symulacja.

## Known limitations
- Brak `DATABASE_URL` = brak trwałości w MySQL dla części feature logów (fallback in-memory).
- Operacje systemowe (ROOT/Termux) nie są w pełni emulowalne w web/CI.
- Finalna walidacja funkcji performance/root powinna być robiona na fizycznym urządzeniu.
