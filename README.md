# Android Master Boost v2026.79 Ultimate

Android Master Boost to aplikacja **Expo / React Native** (Android + web) z backendem **Express + tRPC + Drizzle (MySQL)**.
Projekt jest rozwijany iteracyjnie: warstwa UI jest rozbudowana, a warstwa wykonawcza funkcji systemowych jest aktualnie przechodzona z mocków na realne akcje (tam, gdzie Android i uprawnienia na to pozwalają).

---

## 1) Status projektu (na dziś)

### Co działa stabilnie
- Routing i ekranizacja aplikacji (`expo-router`) wraz z głównym menu funkcji.
- Dwujęzyczność PL/EN (`lib/i18n.ts`) i przełączanie języka.
- Per-feature state (`operationStatus`, `lastOperationTime`) i centralne logi operacji.
- Podstawowy backend feature API (`feature.boost`, `feature.diagnostics`, `feature.logs`, `feature.deviceFingerprint`).
- Logi operacji w DB + fallback in-memory (gdy brak `DATABASE_URL`).
- Permissions onboarding i podstawowe narzędzia systemowe (ustawienia/powiadomienia/keep-awake).
- Podstawowe testy backendowe (router feature + logout auth).

### Co jest częściowo gotowe / zależne od urządzenia
- Realne komendy systemowe (Termux/shell/root) działają tylko przy poprawnie skonfigurowanym środowisku na fizycznym Androidzie.
- Część narzędzi nadal wymaga dopracowania parserów outputu i stabilniejszych fallbacków.
- Funkcje wymagające roota zależą od Magisk/su i konfiguracji użytkownika.

### Co jeszcze nie jest domknięte produkcyjnie
- Jednolity standard obsługi błędów i timeoutów na wszystkich ekranach funkcji.
- Spójny poziom „realności” we wszystkich modułach (część ekranów nadal ma ścieżki mieszane mock/real).
- Szersze testy integracyjne/E2E pod scenariusze urządzeniowe.

---

## 2) Architektura (skrót)

### Frontend
- `app/` — ekrany aplikacji.
- `components/` — współdzielone komponenty UI (`FeatureScreen`, karty, log-entry).
- `lib/feature-context.tsx` — per-feature status + logi.
- `lib/permissions.ts` — check/request permission + settings deep-links.
- `lib/command-execution-service.ts` — wykonanie komend z guardami (Termux/root/timeout).
- `lib/root-service.ts` — detekcja root/magisk/termux.
- `lib/trpc.ts` — klient tRPC.

### Backend
- `server/routers.ts` — router główny.
- `server/featureRouter.ts` — endpointy feature.
- `server/db.ts` — helpery DB + fallback in-memory.

### Baza danych
- `drizzle/schema.ts` — `users`, `operationLogs`.
- `drizzle/0001_operation_logs.sql` — migracja logów operacji.

---

## 3) Setup i uruchomienie

### Wymagania
- Node.js 20+
- pnpm 9+
- (opcjonalnie) MySQL z `DATABASE_URL`
- Android device/emulator dla testów funkcji systemowych

### Instalacja
```bash
pnpm install
```

### Development
```bash
pnpm dev
```
Uruchamia równolegle:
- `pnpm dev:server`
- `pnpm dev:metro`

### Inne komendy
```bash
pnpm test
pnpm check
pnpm lint
pnpm build
pnpm start
pnpm android
```

---

## 4) Uprawnienia i bezpieczeństwo

Aplikacja realizuje onboarding uprawnień i rozróżnia stany:
- granted,
- denied,
- blocked (never ask again),
- needs_settings,
- unavailable.

Zasady:
- Brak ukrytego podnoszenia uprawnień.
- Każda akcja wymagająca roota/Termux jest jawnie komunikowana.
- Jeśli potrzebna jest ręczna zmiana ustawień — aplikacja przekierowuje do ustawień i informuje, co użytkownik ma zrobić.

---

## 5) Known limitations

- Web/CI nie odzwierciedla pełnych możliwości Androida (zwłaszcza Termux/root).
- Bez `DATABASE_URL` część danych działa wyłącznie w pamięci procesu.
- Komendy shellowe mogą różnić się między urządzeniami i wersjami Androida/kernel.

---

## 6) Roadmapa rozwoju (rekomendowana)

### Krótkoterminowo
1. Ujednolicić executor komend dla wszystkich ekranów feature.
2. Domknąć i18n (usunąć pozostałe hardcoded strings).
3. Rozszerzyć testy o walidację ścieżek błędów i timeoutów.
4. Dodać checklistę QA pod testy na realnym telefonie.

### Średni termin
1. Dodać telemetrykę błędów i klasyfikację błędów urządzeniowych.
2. Ustandaryzować raporty diagnostyczne (format JSON/CSV + eksport).
3. Rozszerzyć backend o historię operacji per urządzenie/użytkownik.

### Dalszy rozwój
1. Tryb „guided optimization” z warunkami bezpieczeństwa i rollbackiem.
2. Lepsze profile urządzeń (vendor/SoC-aware command templates).
3. Przygotowanie release pipeline (build APK/AAB, smoke tests, release notes).

---

## 7) Aktualna wersja

- App: **v2026.79 Ultimate**
- Status: **aktywny rozwój (pre-release / hardening)**

