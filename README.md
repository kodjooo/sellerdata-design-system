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

Источник — кодовая база приложения Sellerdata (живой каталог — страница `/design-system`).
Этот репозиторий — экспорт. При изменении токенов/компонентов в приложении обновлять файлы здесь
(скопировать `_variables.scss`, `tokens.js`, `Components/Ds/*`, перегенерировать `tokens.json`).

## Бренд и шрифты

- `brand/` — логотип Sellerdata: `logo.svg` (основной, шапка ЛК), `logo-auth.svg` (auth-экраны),
  `logo-basic.svg`, `logo_blue.png`. Использовать вместо плейсхолдера «SD».
- `fonts/OpenSans-*.{woff2,woff}` — самохостируемый Open Sans (Regular 400 / Medium 500 /
  SemiBold 600 / Bold 700). `scss/_type.scss` уже подключает их через `@font-face` (путь
  `../fonts/OpenSans-*`) — внешний CDN (Google Fonts) не нужен.
- `fonts/sellerboard.*` — иконочный шрифт `.fm-*` (см. `scss/_icon-font.scss`).
