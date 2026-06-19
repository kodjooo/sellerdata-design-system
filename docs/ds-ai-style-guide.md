# Sellerdata UI — стиль-язык для генерации (для ИИ)

Цель: чтобы ИИ генерировал НОВЫЕ страницы/попапы/элементы в узнаваемом стиле текущего
сайта. Это «язык» (токены + правила + эталоны), а НЕ требование собирать всё только из
готовых компонентов. Новые элементы можно придумывать/менять — но на этих токенах и по
этим правилам, тогда результат будет «родным».

Все значения ниже ВЫВЕРЕНЫ по реальному коду (computed-diff с боевыми страницами).

## 0. Жёсткие правила
- Только токены: цвета `var(--token)`, размеры `var(--size-*)`, радиусы `--radius-*`,
  текст — классы `t-*`, слои `--z-*`, анимации `--transition-*`. Сырые hex/px — нет.
- Источник значений: `resources/scss/_variables.scss` (:root) + `tokens.js`.
- Можно делать новые компоновки/варианты, но из этих токенов и по паттернам ниже.

## 1. Типография (реал)
- Базовый текст интерфейса — **13px / 400** (`--font-size-body-s`). Это плотный кабинетный UI.
- 16px (`--font-size-body-l`) — модалки/описания/лендинг, НЕ рабочие экраны.
- Заголовки: page-title 16/700 (`t-title-m`); секции/карточки 18→20 (`t-heading-m`); модалки 24 (`t-heading-l`).
- Веса: 400 обычный, 600 акцент/заголовки, 700 page-title. Промежуточных нет.
- Цвета текста: `--text-default` (#555, body), `--text-heading` (#232323), `--text-muted` (#999),
  `--text-placeholder` (#BDBDBD), `--white` на цветном.

## 2. Цвета (семантика)
- Бренд/CTA: `--brand` (#4154f1), hover `--brand-hover`.
- Статусы (solid): `--status-success` (teal), `--status-warning` (orange), `--status-danger` (red),
  `--status-attention` (purple), `--status-default` (gray).
- Поверхности: `--surface-default` (white), `--surface-subtle` (#F9F9F9, hover строк/фон),
  `--surface-muted` (#F6F6F6).
- Границы: `--border-default` (#F0F0F0, карточки/таблицы), `--border-input` (#DDD, инпуты).
- Summary-плитки: `--summary-periwinkle/blue/muted/indigo/indigo-deep/navy` (сплошной фон шапки).

## 3. Отступы, радиусы, тени
- Отступы — шкала `--size-*` (кратно 2px): база карточек 16, модалки 20, gap контролов 8.
- Радиусы: **кнопки/теги-solid/инпуты-таблиц = `--radius-sm` (4px)**; карточки/модалки/инпуты = `--radius-md` (8px);
  крупные панели/notice = `--radius-lg` (12px); пилюли/бейджи = `--radius-full`.
- Тени: карточки `--shadow-card`; дропдауны `--shadow-dropdown`; модалки/поповеры `--shadow-overlay`;
  фокус инпута `--shadow-input-focus`. **Кнопки — БЕЗ тени.**
- Высоты контролов: `--control-height-md` (40), sm (32), lg (48).

## 4. Эталонные паттерны (имитируй и адаптируй)

### Кнопка (= .btn-regular/.btn-default)
height 40, radius `--radius-sm` (4), padding `5px 25px`, min-width 145, шрифт 13/400, line-height .9, БЕЗ тени.
- primary: bg `--brand` / текст `--white` / border `--brand`; hover `--brand-hover`.
- secondary: bg `--white` / текст `--text-default` / border `--border-default`; hover border `--gray-300`, текст `--black`.
- disabled: bg/border `--border-default`, текст `--text-muted`.
Готовый компонент: `Components/Ds/DsButton.vue`.

### Поле ввода (= .input__text-input)
border 1px `--border-default`, bg white, font 13, padding `8px 20px`, radius `--radius-md` (8),
min-height 42, color `--text-default`; focus border `--brand`; error border `--status-error`.
Компонент: `DsInput.vue`.

### Тег
- solid (= .status-tag): radius `--radius-sm`, 13/600, padding `2px 8px`, bg `--status-*`, текст white.
- soft (= .tag): pill `--radius-full`, 12/600, padding `2px 6px`, текст `--status-*` + светлый фон.
Компонент: `DsTag.vue`.

### Чекбокс (= .input__checkbox)
индикатор 20×20, radius `--radius-sm`, border 2px `--border-default`, bg white; checked — border `--brand` + галочка.
Компонент: `DsCheckbox.vue`.

### Summary-плитка (= .block_item)
шапка: СПЛОШНОЙ `--summary-*`, padding `11px 56px 11px 16px`, min-height 38, radius верх `--radius-md`, заголовок 13/600 белый.
тело (.item_content): padding `16px 20px`, **сетка 2 колонки**, gap 16; метрика: label 12px `--text-default` + значение 16/600.
Компонент: `DsSummaryCard.vue`.

### Таблица данных (плотная)
ячейки: font 13/400, `white-space: normal` (заголовки переносятся в 2-3 строки), border-bottom `--border-default`,
плотный padding (~5px), hover строки `--surface-subtle`. Заголовки `th` — вес 400, `--text-muted`.
Многоколоночная: числовые колонки узкие, заголовки переносятся → не разъезжается.
Мобайл: широкая таблица → компактная (приоритетные колонки + → в деталь-модалку); узкая → карточки (data-title).
Готовый компонент: `DsTable.vue` (рекомендуется для таблиц — сложный паттерн).

### Модалка
backdrop затемнение `rgb(from var(--gray-900) r g b / .5)` на `--z-overlay`; окно `--surface-default`,
`--shadow-overlay`, `--radius-md`, `--z-modal`; на мобайле — fullscreen. Шапка-хинт (видео) — градиент `--brand-gradient`.
Готовый компонент: `DsModal.vue`.

## 5. Адаптив (mobile-first)
`@use 'responsive' as *` + `@include respond-to(md)`. Брейкпоинты 576/768/992/1200.
Паттерны: тулбар сворачивается (поиск/селекты → в фильтр-модалку, остаётся круглая воронка);
summary — табы+свайпер; таблица → компактная/карточки; пагинация «Страница N из M».

## 6. Что есть готовым компонентом, что генерировать
- **Генерируй на токенах/паттернах:** простые блоки, карточки, формы, layout, новые попапы.
- **Бери готовый компонент** (`Components/Ds/`): сложное и часто повторяющееся — **DsTable, DsModal**
  (и при удобстве DsButton/Input/Tag/Checkbox/SummaryCard как эталоны).
- Варианты допустимы: меняй компоновку/набор колонок/поля — но шрифты/цвета/отступы/радиусы из токенов.

## 7. Рецепт новой страницы
1. Каркас: сайдбар+топбар (паттерн DsAppShell).
2. Контент-фон `--surface-subtle`, page-padding 32→40→48 по брейкпоинтам.
3. Карточки `--surface-default` + `--radius-md/lg`; текст `t-*`; кнопки/теги по паттернам.
4. Таблица → DsTable; модалка → DsModal.
5. Проверка: визуально сверить с соседними реальными страницами (узнаваемость).
