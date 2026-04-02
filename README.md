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
- Domknąć Developer Diagnostics v2 (clipboard/share summary, recent normalized errors, readiness score).
- Dodać testy regresji dla struktury raportu oraz integracji feature checks.

### P3 — Build / APK / Termux readiness
- Ustabilizować ścieżkę builda APK z telefonu (Termux) + checklistę środowiska i szybki env-check script.
- Utrzymać fallback: lokalny dev/test na telefonie + build w zewnętrznym środowisku gdy Termux build jest niestabilny.

### P4 — Jakość / testy / release readiness
- Dodać testy negatywne execution layer (missing-termux, missing-root, timeout, retry-exhaust, metadata propagation).
- Dokończyć i18n usuwając hardcoded strings z nowych ekranów.

### P5 — Dalszy rozwój
- Profilowanie komend per vendor/SoC.
- Raporty diagnostyczne z baseline/after-change.

## Mapa feature
| Feature | Status | Typ | Wymaga root | Wymaga Termux | Fallback | Poziom ryzyka | Komentarz |
|---|---|---|---|---|---|---|---|
| Permissions Onboarding | REAL | READ-ONLY | Nie | Nie | Tak | Niskie | Sprawdza i prowadzi przez nadanie uprawnień oraz ustawienia systemowe. |
| Root Check | HYBRID | READ-ONLY | Nie (do samego checku) | Tak (dla pełnego sygnału) | Tak | Niskie | Wykrywa root/Magisk/Termux; wynik zależy od dostępności Termux API. |
| Device Fingerprint | HYBRID | READ-ONLY | Nie | Opcjonalnie | Tak | Niskie | Najpierw API, następnie fallback lokalny/Termux. |
| Resource Monitor | HYBRID | READ-ONLY | Nie | Tak (dla pełnych danych) | Częściowy | Średnie | Część metryk zależna od dostępności komend systemowych. |
| Test & Fix | HYBRID | READ-ONLY | Nie | Tak | Tak | Średnie | Realna diagnostyka, ale część kroków może zwracać degraded wynik. |
| Developer Diagnostics | REAL (MVP) | READ-ONLY | Nie | Nie (ale testuje Termux) | Tak | Niskie | Generuje pełny raport JSON/TXT i debug summary do czatu. |
| Game Boost | HYBRID | MODYFIKUJĄCE | Często | Tak | Tak | Wysokie | Operacje wpływające na system, zależne od roota i wariantu urządzenia. |
| Advanced Tools (fstrim/sqlite/cleaner) | HYBRID | HIGH-RISK | Tak | Tak | Tak | Wysokie | Dodane ostrzeżenia i potwierdzenia; nie wszystkie komendy działają na każdym ROM. |
| Network Optimization | HYBRID | MODYFIKUJĄCE | Często | Tak | Częściowy | Średnie/Wysokie | Działanie komend sieciowych zależne od uprawnień i sterowników. |
| CPU/GPU/ZRAM tweaks | HYBRID | HIGH-RISK | Tak | Tak | Ograniczony | Wysokie | Komendy per-kernel/vendor, brak gwarancji kompatybilności między urządzeniami. |
| Restore Normal | HYBRID | HIGH-RISK | Często | Tak | Częściowy | Wysokie | Przywracanie ustawień wymaga znanego punktu odniesienia per urządzenie. |
| Log Viewer + Export | REAL | READ-ONLY | Nie | Nie | n/d | Niskie | Stabilny eksport TXT/JSON i udział raportów przez systemowe share. |

## Aktualne blokery
- Brak pełnego, powtarzalnego workflow natywnego builda APK bezpośrednio w Termux na słabszych urządzeniach (RAM/thermal/SDK).
- Część komend HIGH-RISK pozostaje vendor/kernal-specific i nie ma uniwersalnej gwarancji działania.
- Część UI poza Developer Diagnostics nadal ma hardcoded stringi (niepełne domknięcie i18n globalnie).
- Brak pełnego zestawu testów device-flow (manual QA jest, ale automatyzacja nadal ograniczona).
- Brak długoterminowej polityki retencji/archiwizacji operation logs po stronie backendu.

## Następna iteracja
1. Domknąć i18n dla nowych ekranów (`Developer Diagnostics`, `Advanced Tools` komunikaty ostrzeżeń/confirm).
2. Dodać testy negatywne execution layer: `missing-termux`, `missing-root`, timeout + retry exhaust.
3. Rozszerzyć Developer Diagnostics o clipboard + auto-attach ostatnich znormalizowanych błędów.
4. Dodać mapę kompatybilności komend (vendor/SoC/kernel) i dynamiczne warningi per urządzenie.
5. Dopracować runbook buildowy: checklista SDK/JDK/Gradle + troubleshooting template z logami.

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
- Wdrożono **Developer Diagnostics v2**: clipboard/share `debugSummaryForChat`, recent normalized errors oraz final readiness summary (status + score).
- Rozszerzono raport diagnostyczny o sekcje: `environment`, `prerequisites`, `backendConnectivity`, `executionLayerChecks`, `featureChecks`, `recentNormalizedErrors`, `finalReadinessSummary`.
- Dodano praktyczny skrypt `scripts/termux_env_check.sh` do szybkiego sprawdzenia gotowości środowiska Termux pod debug/build.
- Rozszerzono testy execution layer o scenariusze negatywne: missing-termux, missing-root, timeout, retry exhaust, metadata propagation i output summary przy błędzie.
- Zmienione pliki:
  - `app/developer-diagnostics.tsx`
  - `lib/developer-diagnostics-service.ts`
  - `lib/log-export-service.ts`
  - `lib/command-execution-service.ts`
  - `scripts/termux_env_check.sh`
  - `tests/command-execution-service.test.ts`
  - `README.md`
- Otwarte na następną iterację:
  - pełne i18n poza dotkniętymi ekranami,
  - testy kontraktu raportu Developer Diagnostics,
  - rozszerzone testy device-flow.

## Manual QA
- [ ] Permissions onboarding: wszystkie stany (granted/denied/blocked/settings).
- [ ] Root Check: urządzenie z i bez roota.
- [ ] Advanced Tools: ostrzeżenia high-risk + potwierdzenie + logowanie operationId/sessionId.
- [ ] Test & Fix: poprawna sekwencja kroków i obsługa fail/warn.
- [ ] Developer Diagnostics: uruchomienie self-test, eksport TXT/JSON i `Copy/Share summary`.
- [ ] Developer Diagnostics: potwierdzenie sekcji `recentNormalizedErrors` i `finalReadinessSummary`.
- [ ] Log export: poprawny zapis i share.
- [ ] Kluczowe ekrany w PL/EN.
- [ ] Termux env check: uruchom z root repo `bash scripts/termux_env_check.sh` (lub z dowolnego katalogu: `bash "$(git rev-parse --show-toplevel)/scripts/termux_env_check.sh"`) i sprawdź raport.

## Build / APK
- **Aktualny stan:** częściowo gotowe.
- **Brakuje:** pełnego, potwierdzonego runbooka dla wszystkich urządzeń.
- **Build (standard):**
  1. `pnpm install`
  2. `pnpm check && pnpm test && pnpm lint`
  3. `npx expo prebuild --platform android`
  4. `cd android && ./gradlew assembleDebug`
- **Quick debug helper:** przed buildem uruchom z root repo `bash scripts/termux_env_check.sh` (alternatywnie: `bash "$(git rev-parse --show-toplevel)/scripts/termux_env_check.sh"`).
- **Instalacja APK:** `adb install -r app/build/outputs/apk/debug/app-debug.apk`
- **Zbieranie logów:** `adb logcat | tee amb_device.log`

## Build bezpośrednio z Androida / Termuxa
- **Status tej ścieżki:** **eksperymentalna / best effort**.
- **Wymagania:** Termux, storage access, Node 20+, pnpm, JDK (17), Android SDK/Build Tools, wystarczająca pamięć/RAM.
- **Ograniczenia (uczciwie):**
  - na wielu telefonach pełny Gradle build może być niestabilny (RAM/thermal/storage),
  - konfiguracja Android SDK w Termux bywa kapryśna i czasochłonna,
  - throttling termiczny potrafi ubijać długie buildy.
- **Kroki (ścieżka bezpośrednia):**
  1. `pkg update && pkg upgrade`
  2. `pkg install nodejs-lts openjdk-17 git`
  3. `npm i -g pnpm`
  4. `termux-setup-storage`
  5. sklonuj repo do pamięci urządzenia
  6. `pnpm install`
  7. `pnpm check && pnpm test`
  8. z root repo: `bash scripts/termux_env_check.sh` (lub z dowolnego katalogu: `bash "$(git rev-parse --show-toplevel)/scripts/termux_env_check.sh"`)
  9. `npx expo prebuild --platform android`
  10. przygotuj `ANDROID_HOME` + build-tools + platform-tools
  11. `cd android && ./gradlew assembleDebug | tee gradle_build.log`
- **Typowe problemy:** OOM, brak SDK components, timeouty Gradle, throttling termiczny.
- **Obejścia/fallbacki:**
  - buduj na telefonie tylko warstwę JS/testy/self-test,
  - **fallback rekomendowany:** finalny natywny build wykonuj poza telefonem (lokalny Linux/macOS/CI), a telefon wykorzystuj do testów runtime i diagnostyki.
- **Logi z builda:** `tee` na Gradle output + zapis raportu Developer Diagnostics z aplikacji.

## Developer diagnostics
- **Uruchomienie:** z menu głównego -> `Developer Diagnostics`.
- **Co testuje (v2):** runtime/platform, permissions status, root/termux status, backend connectivity, execution-layer sanity checks, feature-level readiness checks.
- **Gdzie zapisuje logi:** przez istniejący system logów aplikacji + raport eksportowany do pliku.
- **Eksport raportu:** TXT i JSON przez mechanizm share/filesystem.
- **Raport do czatu:** zawiera sekcję `debugSummaryForChat` (gotowy blok do wklejenia) + `recentNormalizedErrors`.
- **Copy summary:** przycisk `Copy/Share summary` najpierw używa Clipboard API; gdy niedostępny, robi share pliku TXT.

## Jak zgłosić problem do debugowania
W zgłoszeniu (lub wklejce do czatu) podaj minimum:
1. **wersję aplikacji** (np. `v2026.79` lub `appVersion` z raportu),
2. **model urządzenia**,
3. **Android version**,
4. **status root** (tak/nie + Magisk, jeśli dotyczy),
5. **status Termux** (connected/disconnected + czy działa Termux:API),
6. **`debugSummaryForChat`** z ekranu Developer Diagnostics,
7. **recent normalized errors** (jeśli są),
8. **fragment raportu** (sekcja failing checks + recommendations),
9. **wynik `finalReadinessSummary`**,
10. **kroki odtworzenia** (krok po kroku, co kliknięto i co miało się wydarzyć).

Praktyczny szablon:
```txt
App version:
Device model:
Android version:
Root status:
Termux status:
debugSummaryForChat:
Failing checks:
Reproduction steps:
Expected result:
Actual result:
```

## Kontekst do dalszej analizy / promptów
1. **Co faktycznie zmieniono w tej iteracji**
   - Developer Diagnostics v2: clipboard/share summary, recent normalized errors, readiness score.
   - Rozszerzona struktura raportu diagnostycznego o sekcje per subsystem/feature.
   - Testy execution layer rozszerzone o ścieżki negatywne i metadata propagation.
   - Dodany skrypt `scripts/termux_env_check.sh` dla szybkiej oceny środowiska Termux.
2. **Co działa po zmianach**
   - Z telefonu można uruchomić self-test i od razu skopiować/udostępnić summary do czatu.
   - Raport ma teraz bardziej praktyczny kontekst debugowy (recent errors + readiness).
   - Testy lepiej chronią warstwę execution przed regresją.
3. **Czego nadal brakuje**
   - Globalne domknięcie i18n poza dotkniętymi ekranami.
   - Automatyzacja testów device-flow i testów UI.
   - Stabilny, uniwersalny build natywny APK w Termux dla słabszych urządzeń.
4. **Największe obecne ryzyka**
   - Ograniczenia per urządzenie/ROM/kernel przy komendach high-risk.
   - Ograniczenia zasobów telefonu (RAM/thermal) przy buildzie Gradle.
   - Częściowa zależność od środowiska (root, Termux:API, backend availability).
5. **Najbardziej sensowna następna iteracja**
   - Dodać testy kontraktu `DeveloperDiagnosticsReport` (stabilność formatu).
   - Rozszerzyć diagnostics o test export/share + status clipboard availability.
   - Dodać mapę kompatybilności komend per vendor/SoC i dynamiczne ostrzeżenia.
   - Uzupełnić i18n w kolejnych ekranach high-risk.
6. **Co wkleić do czatu / analizy przy problemie**
   - `appVersion`, `device model`, `Android version`, `root status`, `Termux status`,
   - `debugSummaryForChat`, `recentNormalizedErrors`, `failing checks`,
   - kroki odtworzenia, expected vs actual result.
7. **Jeśli Codex napotkał ograniczenia**
   - **Repo:** brak dedykowanego modułu clipboard cross-platform bez dodatkowych zależności.
   - **Expo/Android/Termux:** clipboard API i build natywny zachowują się różnie zależnie od runtime i urządzenia.
   - **Środowisko testowe:** brak fizycznego telefonu w tym środowisku — część walidacji wymaga manualnego testu on-device.
