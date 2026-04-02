# Android Master Boost

## Status projektu
- **Aktualny etap rozwoju:** hardening (pre-release).
- **Ogólna charakterystyka:** aplikacja działa end-to-end (UI + backend + logowanie + część realnych operacji), ale nadal część funkcji jest HYBRID i zależna od środowiska urządzenia.
- **Klasyfikacja etapu:** pre-release / hardening, jeszcze nie release candidate.

## Co działa
- Stabilny UI i nawigacja Expo Router (ekrany główne, feature screens, log viewer).
- Per-feature status (`operationStatus`, `lastOperationTime`) i globalne logowanie operacji.
- Wspólna warstwa execution z timeout/retry/error classification + output summary + metadata (`operationId`, `sessionId`, `timestamp`).
- Permissions onboarding (check/request/settings redirection).
- Root/Termux readiness checks i podstawowa integracja komend.
- Backend feature API (`feature.boost`, `feature.diagnostics`, `feature.deviceFingerprint`, `feature.logs.add/list`).
- Operation logs w DB + fallback in-memory.
- Developer Diagnostics screen (self-test + raport JSON/TXT + debug summary for chat).
- Testy backendu i helperów execution layer (`feature.router`, `auth.logout`, `command-execution-service`).

## Co jest częściowo gotowe
- Funkcje HYBRID: część ekranów używa realnych komend, ale nie wszystkie ścieżki mają pełny zestaw fallbacków per vendor/device.
- Elementy zależne od środowiska: root, Magisk, Termux:API, lokalny backend.
- Build readiness: konfiguracja Expo jest gotowa do standardowych ścieżek, ale pełny natywny build APK bezpośrednio w Termux może być niestabilny zależnie od telefonu.

## Co nie jest domknięte
- Brak pełnej unifikacji i18n (część nowych komunikatów nadal hardcoded).
- Brak E2E testów UI na urządzeniu i pełnej automatyzacji smoke flow.
- Brak pełnego rollbacku dla wszystkich high-risk operacji modyfikujących.
- Brak twardego raportu kompatybilności komend per SoC/vendor.
- Build readiness: brak zamkniętego runbooka CI/CD dla powtarzalnego release.
- Release readiness: jeszcze wymaga pełnego manual QA na fizycznym urządzeniu.
- Known limitations:
  - Web/CI nie odzwierciedla realnego środowiska Android root/Termux.
  - Bez `DATABASE_URL` operation logs są ulotne (in-memory fallback).
  - Komendy shell mogą działać różnie między ROM/kernel/vendor.

## Priorytety
### P1 — Stabilność
- Domknąć jednolite mapowanie błędów i komunikatów user-facing dla wszystkich feature.
- Ujednolicić prerequisites checks na każdym ekranie wykonującym komendy.

### P2 — Developer diagnostics
- Rozszerzyć self-test o więcej checks per feature + auto-collect ostatnich znormalizowanych błędów.
- Dodać „kopiuj do schowka” dla debug summary.

### P3 — Build / APK / Termux readiness
- Ustabilizować ścieżkę builda APK z telefonu (Termux) + checklistę środowiska.
- Utrzymać fallback: lokalny dev/test na telefonie + build w zewnętrznym środowisku gdy Termux build jest niestabilny.

### P4 — Jakość / testy / release readiness
- Dodać testy negatywne execution layer (missing-termux, missing-root, timeout).
- Dokończyć i18n usuwając hardcoded strings z nowych ekranów.

### P5 — Dalszy rozwój
- Profilowanie komend per vendor/SoC.
- Raporty diagnostyczne z baseline/after-change.

## Ocena modułów
- **UI / Nawigacja**
  - status: stabilny
  - dojrzałość: wysoka
  - co działa: flow ekranów i routing
  - czego brakuje: drobne dopracowanie copy/i18n
  - ryzyka: niskie
- **Feature flow**
  - status: HYBRID
  - dojrzałość: średnia
  - co działa: większość flow uruchamia się poprawnie
  - czego brakuje: pełna spójność real vs fallback
  - ryzyka: średnie (różnice urządzeń)
- **Execution layer**
  - status: działa
  - dojrzałość: średnio-wysoka
  - co działa: retries, timeout, error code, output summary, metadata
  - czego brakuje: pełne pokrycie testami integracyjnymi
  - ryzyka: średnie
- **Logging**
  - status: działa
  - dojrzałość: średnio-wysoka
  - co działa: operation logs + eksport
  - czego brakuje: standaryzacja raportów per feature
  - ryzyka: niskie
- **Error handling**
  - status: częściowo zunifikowany
  - dojrzałość: średnia
  - co działa: klasyfikacja w execution layer
  - czego brakuje: pełna propagacja na wszystkie ekrany
  - ryzyka: średnie
- **i18n**
  - status: częściowo domknięte
  - dojrzałość: średnia
  - co działa: PL/EN dla kluczowych ekranów
  - czego brakuje: usunięcie wszystkich hardcoded stringów
  - ryzyka: niskie
- **Permissions / prerequisites**
  - status: działa
  - dojrzałość: średnio-wysoka
  - co działa: onboarding + settings redirect
  - czego brakuje: pełne mapowanie per feature
  - ryzyka: średnie
- **Backend API**
  - status: działa
  - dojrzałość: średnia
  - co działa: feature router + auth/system
  - czego brakuje: rozszerzone endpointy domenowe
  - ryzyka: średnie
- **Database / operation logs**
  - status: działa
  - dojrzałość: średnia
  - co działa: schema + migration + fallback
  - czego brakuje: pełna polityka retencji/archiwizacji
  - ryzyka: niskie
- **Developer diagnostics**
  - status: działa (MVP)
  - dojrzałość: średnia
  - co działa: self-test, raport JSON/TXT, debug summary
  - czego brakuje: szerszy zestaw checks i clipboard
  - ryzyka: niskie-średnie
- **Tests**
  - status: działa
  - dojrzałość: średnia
  - co działa: testy backendu i helperów execution
  - czego brakuje: UI/integration/device tests
  - ryzyka: średnie
- **Build / APK readiness**
  - status: częściowo gotowe
  - dojrzałość: średnia
  - co działa: konfiguracja Expo pod Android
  - czego brakuje: pełny stabilny runbook release build
  - ryzyka: średnie
- **Termux build readiness**
  - status: eksperymentalne / warunkowe
  - dojrzałość: niska-średnia
  - co działa: uruchamianie projektu i testy logiczne
  - czego brakuje: w pełni powtarzalny natywny build APK na każdym urządzeniu
  - ryzyka: wysokie (zasoby telefonu, SDK/NDK/JDK)
- **Release readiness**
  - status: niegotowe
  - dojrzałość: średnia
  - co działa: fundamenty jakości i dokumentacja
  - czego brakuje: finalne QA, komplet i18n, potwierdzony build workflow
  - ryzyka: średnie

## Ostatnia iteracja
- Dodano ekran **Developer Diagnostics** (self-test + export raportów).
- Rozszerzono `log-export-service` o eksport dowolnego raportu TXT/JSON.
- README przeformatowano do stałego szablonu statusowego.
- Dodano testy helperów execution layer i stabilizację klasyfikacji błędów.
- Zmienione pliki:
  - `app/developer-diagnostics.tsx`
  - `lib/developer-diagnostics-service.ts`
  - `lib/log-export-service.ts`
  - `lib/command-execution-service.ts`
  - `tests/command-execution-service.test.ts`
  - `README.md`
- Otwarte na następną iterację:
  - pełne i18n dla nowych ekranów,
  - clipboard support dla debug summary,
  - rozszerzone testy device-flow.

## Manual QA
- [ ] Permissions onboarding: wszystkie stany (granted/denied/blocked/settings).
- [ ] Root Check: urządzenie z i bez roota.
- [ ] Advanced Tools: ostrzeżenia high-risk + potwierdzenie + logowanie operationId/sessionId.
- [ ] Test & Fix: poprawna sekwencja kroków i obsługa fail/warn.
- [ ] Developer Diagnostics: uruchomienie self-test, eksport TXT i JSON.
- [ ] Log export: poprawny zapis i share.
- [ ] Kluczowe ekrany w PL/EN.

## Build / APK
- **Aktualny stan:** częściowo gotowe.
- **Brakuje:** pełnego, potwierdzonego runbooka dla wszystkich urządzeń.
- **Build (standard):**
  1. `pnpm install`
  2. `pnpm check && pnpm test && pnpm lint`
  3. `npx expo prebuild --platform android`
  4. `cd android && ./gradlew assembleDebug`
- **Instalacja APK:** `adb install -r app/build/outputs/apk/debug/app-debug.apk`
- **Zbieranie logów:** `adb logcat | tee amb_device.log`

## Build bezpośrednio z Androida / Termuxa
- **Wymagania:** Termux, storage access, Node 20+, pnpm, JDK (17), Android SDK/Build Tools, wystarczająca pamięć/RAM.
- **Ograniczenia:** na wielu telefonach pełny Gradle build może być niestabilny (RAM/thermal/storage), szczególnie dla większych projektów React Native.
- **Kroki (ścieżka bezpośrednia):**
  1. `pkg update && pkg upgrade`
  2. `pkg install nodejs-lts openjdk-17 git`
  3. `npm i -g pnpm`
  4. `termux-setup-storage`
  5. sklonuj repo do pamięci urządzenia
  6. `pnpm install`
  7. `pnpm check && pnpm test`
  8. `npx expo prebuild --platform android`
  9. przygotuj `ANDROID_HOME` + build-tools + platform-tools
  10. `cd android && ./gradlew assembleDebug | tee gradle_build.log`
- **Typowe problemy:** OOM, brak SDK components, timeouty Gradle, throttling termiczny.
- **Obejścia/fallbacki:**
  - buduj na telefonie tylko warstwę JS/testy/self-test,
  - finalny natywny build wykonuj na mocniejszym środowisku (lokalny Linux/macOS/CI) i przenoś APK na telefon.
- **Logi z builda:** `tee` na Gradle output + zapis raportu Developer Diagnostics z aplikacji.

## Developer diagnostics
- **Uruchomienie:** z menu głównego -> `Developer Diagnostics`.
- **Co testuje (MVP):** runtime/platform, permissions status, root/termux status, backend connectivity, execution-layer sanity checks.
- **Gdzie zapisuje logi:** przez istniejący system logów aplikacji + raport eksportowany do pliku.
- **Eksport raportu:** TXT i JSON przez mechanizm share/filesystem.
- **Raport do czatu:** zawiera sekcję `debugSummaryForChat` (gotowy blok do wklejenia).

