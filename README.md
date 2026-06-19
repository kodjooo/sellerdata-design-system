# Sellerdata Design System

Дизайн-система сервиса **Sellerdata** (аналитика для продавцов WB / Ozon / Yandex Market),
вынесенная отдельным репозиторием для импорта в инструменты дизайна (например, **Claude Design**)
и переиспользования.

Значения извлечены **1:1 из реального интерфейса** сервиса (сверка computed-diff), а не придуманы:
рисуя и верстая по этой системе, получаешь интерфейс «как в продукте».

## Структура

```
tokens/
  variables.scss        — источник правды: CSS-переменные (:root) + legacy $-совместимость
  tokens.json           — плоский экспорт токенов (резолвнутые значения) для дизайн-инструментов
  tokens.registry.js    — реестр токенов с описаниями и правилами применения (поле note)
scss/
  _variables.scss       — те же токены (для сборки)
  _responsive.scss      — брейкпоинты $bp-* + миксины respond-to / respond-below
  _type.scss            — типографические классы t-* (9 стилей)
  _icon-font.scss       — иконочный шрифт .fm-* (292 иконки)
fonts/
  sellerboard.*         — файлы иконочного шрифта
components/
  Ds*.vue               — библиотека компонентов (Vue 3, <script setup>): Button, Input, Select,
                          Tag, Checkbox, Card, SummaryCard, SummaryCarousel, Table, Modal, Toast,
                          Pagination, Chart, Donut, VideoBanner, AppShell
docs/
  design-system.md            — навигатор по системе
  ds-ai-style-guide.md        — гайд для генерации UI нейросетью (токены + правила + паттерны)
  design-system-components.md — API компонентов
  design-system-canon.md      — канон (плотность, эталоны, мобильные паттерны)
```

## Принципы

- **Единый источник правды — токены** (`tokens/variables.scss`, блок `:root`). Двухуровневая система:
  Tier 1 — primitives (`--blue-600`, `--gray-900`), Tier 2 — semantic (`--brand: var(--blue-600)`).
  В компонентах используются только semantic-токены.
- **Плотность ЛК = 13px-first** (`t-body-s`); 16px (`t-body-l`) — только модалки/лендинг.
- **Только токены/классы:** цвета `var(--token)`, отступы/размеры `var(--size-*)`, радиусы `--radius-*`,
  текст — классы `t-*`. Сырые hex, px вне шкалы `--size-*` и произвольные радиусы — запрещены.

## Как использовать в Claude Design

Claude Design умеет импортировать дизайн-систему из GitHub-репозитория и строить макеты по её
токенам, компонентам и конвенциям. Подключите этот репозиторий как источник системы — ключевые
артефакты: `tokens/tokens.json` (палитра/типографика/размеры/радиусы/тени), `components/Ds*.vue`
(структура и стиль компонентов), `docs/ds-ai-style-guide.md` (правила применения).

## Синхронизация с продуктом

Источник правды — кодовая база приложения Sellerdata (живой каталог — страница `/design-system`).
**Этот репозиторий — экспорт** (только app → сюда, в одну сторону). Обновляется **скриптом** из
приложения, запуск **вручную** (например раз в день, когда нужно подтянуть свежее).

### Как обновить (инструкция)

1. Один раз — склонировать этот репозиторий рядом с приложением:
   ```bash
   git clone https://github.com/kodjooo/sellerdata-design-system.git
   ```
2. Из каталога приложения запустить скрипт синхронизации, указав путь к клону и ветку-источник
   (production/develop). Флаг `--push` сразу коммитит и пушит изменения сюда:
   ```bash
   scripts/sync-design-system.sh --ds ../sellerdata-design-system --branch develop --push
   ```
   Без `--push` — только обновит файлы локально (можно посмотреть diff и закоммитить вручную).
3. Скрипт сам: возьмёт свежий снимок ветки (через `git worktree`, рабочее дерево не трогает),
   скопирует `components/`, `scss/`, `tokens/` (+ перегенерирует `tokens.json`), `fonts/`,
   `brand/`, `screens/`, `docs/`, и при `--push` закоммитит с сообщением `sync from app/<branch> @ <sha>`.
4. После обновления — **переимпортировать источник в Claude Design**, чтобы подхватить изменения.

Подробности параметров — в шапке `scripts/sync-design-system.sh`. План масштабирования
дизайн-системы на все разделы (в т.ч. с Opus-агентами) — в `docs/ds-scaling-with-opus.md`.

## Бренд и шрифты

- `brand/` — логотип Sellerdata: `logo.svg` и `logo-basic.svg` — чистый вектор (11 path, бренд #4154F1, основной); `logo_blue.png` — растровый фоллбэк. Использовать вместо плейсхолдера «SD». (Растровые SVG-обёртки удалены.)
- `fonts/OpenSans-*.{woff2,woff}` — самохостируемый Open Sans (Regular 400 / Medium 500 /
  SemiBold 600 / Bold 700). `scss/_type.scss` уже подключает их через `@font-face` (путь
  `../fonts/OpenSans-*`) — внешний CDN (Google Fonts) не нужен.
- `fonts/sellerboard.*` — иконочный шрифт `.fm-*` (см. `scss/_icon-font.scss`).

## Экраны-эталоны (screens/)

`screens/*.vue` — целые экраны кабинета, собранные из компонентов `Ds*` (композиция реального
интерфейса). Это референс layout'а (сетка, порядок блоков, какие компоненты где), а не
запускаемое приложение — импорты `@/Components/Ds/*` указывают на компоненты из `components/`.

- `screens/dashboard.vue` — Дэшборд: AppShell (rail) + ряд период-карточек (featuredFirst) +
  табы «Плитки / Диаграмма» + комбо-диаграмма / таблица товаров.
