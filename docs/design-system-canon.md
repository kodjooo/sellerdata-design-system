# Дизайн-система Sellerdata — канон (Фаза 3)

> Источник истины: `resources/scss/_variables.scss` (`:root`) + `resources/js/Pages/DesignSystem/Shared/tokens.js`.
> Легенда статусов: **[есть]** — уже верно в `:root`, не трогать; **[изменить]** — есть, но нужна правка note/значения; **[новый]** — добавить.
> Это рабочая спецификация для последующей кодификации (Фаза 4). Все цвета — `var(--token)`, отступы/размеры — `var(--size-*)`, радиусы — `--radius-*`, текст — классы `t-*`. Запрещены сырые hex, px вне шкалы `--size-*`, произвольные радиусы и сырые z-index/transition/opacity.

---

## Foundations (все шкалы и токены)

### 1. Типографика

#### 1.1 font-size — 6 ступеней [есть, шкала финальна]
Новых ступеней не вводим, **display-2xl НЕ вводить** (hero 32/40/48 → 36).

| Токен | Значение | Snap из аудита | Статус |
|---|---|---|---|
| `--font-size-display-xl` | 36px | hero 22-31 → 36; 32/40/48 → 36 | [есть] |
| `--font-size-heading-l` | 24px | hero 22-31, по роли → 24 | [есть] |
| `--font-size-heading-m` | 20px | 18 → 20 (заголовки секций) | [есть] |
| `--font-size-title-m` | 16px | 15→16, 17→16, 18→16 (подзаголовки) | [есть] |
| `--font-size-body-l` | 16px | 15→16, 14→16 по роли | [есть] |
| `--font-size-body-s` | 13px | 12→13, 14→13, 0.9em/0.85em → 13 | [есть] |
| `--font-size-label-m` | 13px | 12→13 (лейблы) | [есть] |
| `--font-size-caption` | 11px | 10→11; каунтеры 12→11 | [есть] |

Снап 18px: заголовки секций → `heading-m` (20), подзаголовки/крупный body → `title-m`/`body-l` (16). Каунтеры в круглых бейджах → `caption` (11), текст/лейблы → `body-s`/`label-m` (13).

#### 1.2 font-weight [есть]
Аутлаеры **500 → 600** (если акцент) или **400**; **300 → 400**.

| Токен | Значение | Статус |
|---|---|---|
| `--font-weight-regular` | 400 | [есть] |
| `--font-weight-semibold` | 600 | [есть] |
| `--font-weight-bold` | 700 | [есть] |

#### 1.3 line-height [есть]
unitless `1` → `--line-height-tight` (1.2) везде, кроме icon-only бейджей. Дробные Figma-значения → 1.2 / 1.4 / 1.5 по роли.

| Токен | Значение | Статус |
|---|---|---|
| `--line-height-tight` | 1.2 | [есть] |
| `--line-height-normal` | 1.4 | [есть] |
| `--line-height-relaxed` | 1.5 | [есть] |

#### 1.4 Готовые text-классы `t-*` [есть — материализовать в SCSS]
Классы определены в `tokens.js`, должны существовать как реальные CSS-классы `.t-*`, каждый собирается из токенов.

| Класс | size / weight / lh | Когда |
|---|---|---|
| `.t-display-xl` | 36 / 600 / 1.2 | hero, лендинг, 404/503, success/empty |
| `.t-heading-l` | 24 / 600 / 1.2 | шапки модалок, крупные секции |
| `.t-heading-m` | 20 / 600 / 1.2 | заголовки карточек/панелей/подсекций |
| `.t-title-m` | 16 / 700 / 1.2 | page title, особо важные заголовки |
| `.t-body-l` | 16 / 400 / 1.5 | тело модалок, описания, параграфы |
| `.t-body-s` | 13 / 400 / 1.5 | helper-текст, подсказки |
| `.t-label-m` | 13 / 600 / 1.2 | status-теги, бейджи, account-name |
| `.t-caption` | 11 / 400 / 1.2 | каунтеры, подписи под иконками |
| `.t-button-cta` | 16 / 600 / 1.2 | uppercase CTA |

### 2. Цвета

#### 2.1 Primitives (Tier 1) [есть — не трогать]
Gray (50–900 + white/black), Blue (300/600/700), Red (50/300/500/700), Green (50/600), Teal-500, Orange-500, Amber (50/200/300/800), Yellow-500, Purple-500, Chart (5), Summary (6). Новые примитивы НЕ нужны.

Решения по legacy-сиротам:
- `$error-300 #EB5757` → `--red-300` (новый `--red-400` НЕ вводить).
- `$info #EE4949` → `--red-500`.
- `$primary-200 #6EBF4B` → `--green-600`.
- `$accent #52B4FB` → `--blue-300`; `$grey-400 #B9BEC6` → `--gray-500`.

#### 2.2 Semantic (Tier 2) [есть + новые]
Brand / Accent / Status / Notice / Text / Surface / Border — набор корректен. Действия:
- `_notice.scss` игнорирует `--notice-*` (хардкод `#93370D/#166534/#F0FDF4`) — применить токены.
- **[новый]** `--notice-success-bg` / `--notice-success-text` на базе `--green-*` (закрывает зелёный success-notice).
- Опорные semantic-токены, используемые компонентами: `--brand`, `--brand-hover`, `--text-on-brand`, `--text-default`, `--text-heading`, `--text-muted`, `--text-secondary`, `--text-primary`, `--text-placeholder`, `--text-disabled`, `--text-strong`, `--text-inverse`, `--surface-default`, `--surface-subtle`, `--surface-muted`, `--surface-disabled`, `--surface-scrollbar-track/thumb`, `--border-default`, `--border-input`, `--border-muted`, `--status-success`, `--status-danger`, `--status-danger-strong`, `--status-danger-bg`, `--status-error`, `--status-warning`, `--status-attention`, `--status-default`, `--accent-positive`, `--notice-bg/-border/-text-strong/-accent`, `--summary-*`.

### 3. Spacing — `--size-*` [есть, шкала финальна]
16 ступеней, кратны 2px. Новые ступени НЕ нужны; инлайн `min-width:50px/70px` выносить в классы на `--size-48`/`--size-64`.

`--size-2,4,6,8,10,12,16,20,24,32,40,48,64,80,96,128`.

### 4. Radius & Shadow

#### 4.1 Radius [есть]
Snap: 10→`--radius-lg`(12), 6→`--radius-md`(8), 3/5/2→`--radius-sm`(4), 16/20→`--radius-lg`. **`--radius-xl` НЕ вводить.**

| Токен | Значение | Статус |
|---|---|---|
| `--radius-sm` | 4px | [есть] |
| `--radius-md` | 8px | [есть] |
| `--radius-lg` | 12px | [есть] |
| `--radius-full` | 9999px | [есть] |

**Фикс-решение:** радиус КНОПОК = `--radius-sm` (4px). Note в `tokens.js` про «кнопки → --radius-md» — **[изменить]**: из note `--radius-md` убрать «кнопки» (остаётся default для карточек/модалок), добавить, что кнопки/контролы используют `--radius-sm`.

#### 4.2 Shadow [есть + 1 новый]
| Токен | Значение | Статус |
|---|---|---|
| `--shadow-card` | 0 1px 2px rgb(from var(--gray-900) r g b / .12) | [есть] |
| `--shadow-button` | 0 4px 14px rgb(from var(--gray-900) r g b / .06) | [есть] |
| `--shadow-aside` | 4px 0 16px 2px rgb(from var(--gray-900) r g b / .03) | [есть] |
| `--shadow-dropdown` | 0 4px 20px rgb(from var(--gray-900) r g b / .20) | [есть] |
| `--shadow-input-focus` | 0 0 0 4px rgb(from var(--brand) r g b / .12) | [есть] |
| `--shadow-overlay` | 0 4px 12px rgb(from var(--gray-900) r g b / .12) | **[новый]** — заменяет двуслойную `rgba(24,39,75,.12)` ×36 (модалки/поповеры/тосты/тултипы) |

Замечание: `rgba(24,39,75,…)` приводим к `--gray-900` через `rgb(from …)` ради единой шкалы (микросдвиг допустим). Inset `rgba(129,140,136,.2)` → `rgb(from var(--gray-600) r g b / .2)` по месту. **Blur НЕ нужен.**

### 5. Новые оси

#### 5.1 Opacity `--opacity-*` [новый] — CSS-переменные в :root
Свести 141 сырое значение. `.55→.4`, `.50→.5`, `.2→.3`.

| Токен | Значение | Когда |
|---|---|---|
| `--opacity-full` | 1 | непрозрачно (start/end transition) |
| `--opacity-hover` | .7 | hover-затемнение |
| `--opacity-muted` | .5 | приглушённый текст/контент |
| `--opacity-disabled` | .4 | disabled-элементы (сводит .55) |
| `--opacity-faint` | .3 | очень бледный (сводит .2) |
| `--opacity-hidden` | 0 | скрыто (start/end transition) |

#### 5.2 Motion `--transition-*` + `--ease-*` [новый] — CSS-переменные в :root
| Токен | Значение | Когда |
|---|---|---|
| `--transition-fast` | 150ms | hover/focus мелких контролов (сводит .12s) |
| `--transition-base` | 200ms | стандарт: кнопки, инпуты, табы |
| `--transition-slow` | 300ms | панели, модалки, аккордеоны |
| `--ease-standard` | ease-in-out | дефолтный easing (×64) |
| `--ease-emphasized` | ease | альтернативный |
| `--ease-linear` | linear | спиннеры, прогресс |
| `--duration-spin` | 1.2s | спиннеры (общий @keyframes `spin`) |
| `--duration-skeleton` | 2s | skeleton-shimmer |

Дедупликация @keyframes: `load-ring`/`dsBtnSpin`/`admin-refresh-spin` → один общий `spin` (поворот 360°).

#### 5.3 Z-index `--z-*` [новый] — CSS-переменные в :root
`9999/10000/99999/100000 → --z-max`; bootstrap-слой 1030–1090 → токены.

| Токен | Значение | Слой |
|---|---|---|
| `--z-below` | -1 | под потоком (декор, ::before) |
| `--z-base` | 0 | базовый поток |
| `--z-raised` | 1 | приподнятый элемент |
| `--z-raised-2` | 2 | второй уровень |
| `--z-sticky` | 10 | sticky-шапки таблиц, sticky-колонки |
| `--z-dropdown` | 1000 | дропдауны, селекты |
| `--z-fixed` | 1030 | фиксированные шапки/сайдбары |
| `--z-overlay` | 1040 | backdrop модалок |
| `--z-modal` | 1050 | модалки |
| `--z-popover` | 1060 | поповеры |
| `--z-toast` | 1080 | тосты/нотификации |
| `--z-tooltip` | 1090 | тултипы |
| `--z-max` | 2147483647 | крайний случай |

#### 5.4 Control-height `--control-height-*` [новый] — CSS-переменные в :root
| Токен | Значение | Когда |
|---|---|---|
| `--control-height-sm` | 32px (= --size-32) | compact: кнопки/инпуты в плотных таблицах, фильтры |
| `--control-height-md` | 40px (= --size-40) | default: кнопки/инпуты/селекты (сводит 38/42) |
| `--control-height-lg` | 48px (= --size-48) | large: главные CTA, touch-target |

#### 5.5 Breakpoints `$bp-*` [новый] — SCSS-переменные (var() не работает в @media)
Свести: 769/767/760→768, 991→992, 577→576, дробные `*.98`→канон, 861/1081→ближайший.

| Переменная | Значение | Когда |
|---|---|---|
| `$bp-sm` | 576px | телефон → планшет (портрет) |
| `$bp-md` | 768px | планшет (главный брейк, ×96) |
| `$bp-lg` | 992px | десктоп / показ сайдбара |
| `$bp-xl` | 1200px | широкий десктоп |
| `$bp-xxl` | 1400px | очень широкий (опционально, ×8) |

Сопроводить SCSS-миксином `media-up($bp)` / `media-down($bp)`.

---

## Компоненты (по каждому: матрица + миграция)

### Button (dsBtn)
**API:** `variant` = primary | secondary | ghost | danger; `size` = sm | md | lg; `iconOnly`; `disabled`; `loading`. Состояния hover/active/focus — производные.

**База (общая):** `inline-flex; align-items/justify-content:center; gap:--size-8`; radius **`--radius-sm`** (4px, фикс); border `1px solid`; `--font-weight-regular`; `--line-height-tight`; без подчёркивания, `white-space:nowrap`; `transition: --transition-base --ease-standard` для `background-color, border-color, color, box-shadow`; `cursor:pointer`; `box-sizing:border-box`.

**Шкала размеров:**
| size | height | padding-x | font-size | iconOnly | icon |
|---|---|---|---|---|---|
| sm | `--control-height-sm` 32 | `--size-12` | `--font-size-body-s` 13 | 32×32, pad 0 | 16 |
| md | `--control-height-md` 40 | `--size-20` | `--font-size-body-s` 13 | 40×40, pad 0 | 16 |
| lg | `--control-height-lg` 48 | `--size-24` | `--font-size-body-l` 16 | 48×48, pad 0 | 20 |

**primary** × state: default `--brand`/`--text-on-brand`/border `--brand`/`--shadow-button`; hover `--brand-hover`; active `--brand-hover`, shadow none, translateY(1px) опц.; focus `--brand` + `--shadow-input-focus`; disabled `--surface-disabled`/`--text-disabled`, `pointer-events:none; cursor:not-allowed`; loading фон `--brand`, текст transparent, спиннер `currentColor`.

**secondary** (outline на белом): default `--surface-default`/`--text-default`/border `--border-input`; hover `--surface-subtle`/`--text-heading`/border `--border-strong`; active `--surface-muted`; focus border `--brand`+`--shadow-input-focus`; disabled `--text-disabled`/border `--border-default`; loading спиннер `--text-muted`.

**ghost:** default transparent/`--text-default`/border transparent; hover `--surface-muted`/`--text-heading`; active `--surface-disabled`; focus border `--brand`+`--shadow-input-focus`; disabled `--text-disabled`; loading спиннер `--text-muted`.

**danger:** default `--status-danger`(=red-500)/`--text-on-brand`/`--shadow-button`; hover `--status-danger-strong`(red-700); active strong, shadow none; focus `0 0 0 4px rgb(from var(--status-danger) r g b /.12)` (→ см. токен `--shadow-input-focus-danger`); disabled `--surface-disabled`/`--text-disabled`; loading спиннер `--text-on-brand`.

**Focus-ring:** `:focus-visible{ box-shadow:var(--shadow-input-focus); outline:none }`. danger — красное кольцо (нужен `--shadow-input-focus-danger`).
**Loading:** текст/иконки `color:transparent`; центр-спиннер общий `@keyframes spin`, `animation: spin var(--duration-spin) var(--ease-linear) infinite`, border 2px, цвет = currentColor; `pointer-events:none`.
**Disabled:** `--opacity-disabled` НЕ применять к solid (цвета уже приглушены).
**iconOnly:** квадрат `--control-height-*`, pad 0, `--radius-sm`, обязателен `aria-label`.

**Миграция:** `.btn-regular`→primary/md (эталон, min-width 145 не переносим); `.btn-default`→secondary/md; `.btn_lg`→lg (height→48, radius→4); bootstrap `.btn-primary/.btn-secondary/.btn-danger` по имени, `.btn-success/info/warning/light` — по месту в primary/secondary либо в Tag; `.btn-link`→ghost (или текст-ссылка); `.btn-icon/.infoBtn/.copy-btn/.show-info-btn`→iconOnly; `.loading_button/.ring_loader/.spinner-border` + 3 keyframes → встроенный loading + общий `spin`. Порядок: foundation-токены → dsBtn по матрице → legacy-алиасы → миграция разметки → удаление алиасов.

### Input / TextField (+ Textarea)
**Анатомия:** `.ds-field` → `.ds-field__label`(.t-label-m) → `.ds-field__control` → `.ds-field__message`(`__helper`.t-body-s / `__error`.t-body-s color error). Зазоры стека `--size-6`. required-звёздочка `--status-danger`.

**База контрола:** input `.t-body-l`(16/400/1.4); textarea lh `--line-height-relaxed`; radius `--radius-md`(md/lg)/`--radius-sm`(sm); border 1px; `transition: border-color, box-shadow, background-color var(--transition-base) var(--ease-standard)`; placeholder `--text-placeholder`; `width:100%`; `outline:0`.

**SIZE:**
| size | height input | min-h textarea | padding в/г | font | radius |
|---|---|---|---|---|---|
| sm | 32 | 32 | `--size-6`/`--size-12` | .t-body-s | `--radius-sm` |
| md | 40 | `--size-80` | `--size-8`/`--size-16` | .t-body-l | `--radius-md` |
| lg | 48 | `--size-96` | `--size-12`/`--size-16` | .t-body-l | `--radius-md` |

**STATE:** default `--surface-default`/`--text-default`/border `--border-input`; hover border `--border-strong`* (или без изменения); focus border `--brand` + `--shadow-input-focus`; disabled `--surface-muted`/`--text-disabled`/border `--border-default` + `--opacity-disabled` + `cursor:not-allowed`; readonly `--surface-subtle`/border `--border-default`; error border `--status-error`(red-300), placeholder→`--status-danger`; error+focus border `--status-danger` + `--shadow-error-focus`.

**Обвязка:** label .t-label-m/`--text-default`; helper .t-body-s/`--text-secondary`; error .t-body-s/`--status-danger`. С иконкой: padding стороны до `--size-40`, икона `--size-16` `--text-placeholder`→focus `--text-secondary`.

**Нужные токены:** `--shadow-error-focus` = `0 0 0 4px rgb(from var(--status-danger) r g b /.12)`; `--border-strong` = `var(--gray-500)` (либо hover=`--border-input` без токена).

**Миграция:** `.form-control`→`.ds-field__control` (убрать хардкоды `#e9ecef/#fc4848`, focus none → ring); `.form-control.error/.form_error/input.invalid`→`.ds-field__control--error` (удалить `dev1.scss` правила); `.table-input__text-input`→sm; `.input__select`→md+иконка-слот (52→`--size-48`); `$border_color/$inputPlaceholder/$white`→токены.

### Choice (Checkbox + Radio)
Единый компонент `variant: checkbox | radio`. Различие только в radius индикатора (cb=`--radius-sm`, radio=`--radius-full`) и форме отметки.

**Общее:** контейнер `<label>` `inline-flex; align-items:flex-start; gap:--size-8; cursor:pointer`; нативный input скрыт (`opacity:--opacity-hidden; position:absolute`); label `.t-body-s` color `--text-primary`; индикатор `transition: --transition-fast --ease-standard`.

**SIZE:**
| size | индикатор | border | radius | gap | font | inset-точка radio |
|---|---|---|---|---|---|---|
| sm | `--size-16` | 2px | `--radius-sm`/`--radius-full` | `--size-6` | .t-caption | `--size-4` |
| md | `--size-20` | 2px | `--radius-sm`/`--radius-full` | `--size-8` | .t-body-s | `--size-8` |

**CHECKBOX state:** unchecked `--surface-default`/border `--border-default`; hover border `--brand`; checked `--brand`+галочка `--text-inverse`/border `--brand`; hover checked + `--opacity-hover` на индикаторе; indeterminate `--brand`+черта `--text-inverse`; focus(`:focus-visible`) `--shadow-input-focus`; disabled-unchecked `--surface-muted`/border `--border-muted` + контейнер `--opacity-disabled`; disabled-checked `--brand` под `--opacity-disabled`; error border `--status-error`, focus `0 0 0 4px rgb(from var(--status-error) r g b /.12)`.

**RADIO state:** аналогично, но фон индикатора всегда `--surface-default`, отметка — центральная точка `--brand` (`--size-8`/`--size-4`); indeterminate не поддерживается.

**Лейбл:** normal `--text-primary`; disabled — контейнер `--opacity-disabled`; error — текст не меняется, ошибочность несёт бордер + helper `--status-error`.
**Реализация:** галочка/черта — CSS (border-trick/mask), цвет `--text-inverse`; focus-ring только `:focus-visible`; `transition:none`→`--transition-fast`.

**Миграция:** `.input__checkbox/__radio` + labels/`::before`/`::after`→`.ds-choice__input/__label/__box/__dot`; bootstrap `.custom-control*`→compat-слой; `$blue→--brand`, `$white→--surface-default`, `$dark→--text-primary`, `$danger→--status-error`; точка 6px→`--size-8`; svg→CSS/mask. Новых токенов нет.

### Toggle / Switch (dsToggle)
Один variant (brand-on): off=серый трек `--border-input`, on=`--brand`, knob белый `--shadow-card`, track `--radius-full`.

**Геометрия (track=2×height, knob=height−2×pad, shift=height):**
| свойство | sm | md | lg |
|---|---|---|---|
| track h×w | 16×32 | 20×40 | 24×48 |
| padding | `--size-2` | `--size-2` | `--size-2` |
| knob | `--size-12` | `--size-16` | `--size-20` |
| shift on | `--size-16` | `--size-20` | `--size-24` |
| label font | .t-body-s | .t-label-m | .t-body-l |
| gap | `--size-8` | `--size-8` | `--size-10` |

**State:** track off `--border-input`/on `--brand`; knob всегда `--white`+`--shadow-card`; disabled `--opacity-disabled`+`cursor:not-allowed`, label `--text-muted`; focus(visible) track `--shadow-input-focus`; transition `background/transform var(--transition-base) var(--ease-standard)`. Hover (fine pointer): off→`--border-strong`, on→`--brand-hover`, `--transition-fast`. Лейбл по size: sm `.t-body-s`/md `.t-label-m`/lg `.t-body-l`.

**Миграция:** прямого switch в проде нет. `.input__hidden`→`.dsToggle__input`; `.input__toggle-label`→`.t-label-m`; сегментные `._radioGroup` остаются вне scope (Segmented). Новых токенов нет.

### Select / Dropdown (Field)
Унификация 5 систем. Оси: `variant` = default | subtle | inline; `size` = sm | md | lg; `mode` = single | multi; states триггера и опции.

**Trigger × state (default-variant):** default `--surface-default`/`--text-default`(значение)/`--text-placeholder`(плейсхолдер)/border `--border-input`, chevron `--text-muted`; hover border `--border-strong`; focus/open border `--brand`+`--shadow-input-focus` (open: chevron rotate180°); filled border `--border-input`; disabled `--surface-disabled`/`--text-disabled`+`--opacity-disabled`+`cursor:not-allowed`; loading спиннер вместо chevron; error border `--status-error`(→`--border-error`), focus `0 0 0 4px rgb(from var(--status-error) r g b / var(--opacity-faint))`.
**subtle:** `background:transparent; border:0`, focus/open `--shadow-input-focus` без бордера, radius `--radius-sm`.
**inline:** transparent, без border/padding, height auto, color `--brand`, hover `--opacity-hover`, текст `.t-label-m`.
Общее: radius `--radius-sm`; transition `--transition-base --ease-standard`; chevron 14px.

**Trigger × size:** sm 32/.t-body-s/`--size-6`,`--size-10`; md 40/.t-body-s/`--size-8`,`--size-12`; lg 48/.t-body-l/`--size-12`,`--size-16`. Высота через `--control-height-*`+flex (без line-height-хаков). multi-чипы h `--size-24`, gap `--size-6`, «+N».

**Menu:** bg `--surface-default`; border 0; radius `--radius-md`; shadow `--shadow-overlay`; padding `--size-8 0`; min-width 100% триггера; z `--z-dropdown` (в модалке `--z-popover`); offset `--size-8`; fade `--transition-fast`; scroll `--surface-scrollbar-*`.

**Option × state:** default transparent/`--text-default`, pad `--size-8 --size-16`, .t-body-s, transition `--transition-fast`; hover `--surface-subtle`; selected-single `--surface-subtle`/`--text-heading`+left-border `--size-2 --brand`/.t-label-m; selected-multi чекбокс `--brand`; disabled `--text-disabled`+`--opacity-disabled`; active(клавиатура) `--surface-subtle`.

**Search:** bg `--surface-default`; border-bottom `1px --border-default`; radius верх `--radius-md`; h `--control-height-md`; pad `--size-10 --size-20 --size-10 --size-40`; .t-body-s; иконка `--size-16` `--text-muted`; «выбрать все» `--brand`.
**Pagination:** flex center gap `--size-16`, верх-разделитель; кнопки `--control-height-md`/`--brand`, hover `--opacity-hover`, disabled `--text-disabled`+`--opacity-disabled`; select страниц inline/sm.

**Нужные токены:** `--border-error`=`var(--red-500)`, `--text-error`=`var(--red-700)`; `--shadow-overlay` (foundations [новый]); все новые оси foundations.
**Миграция:** `sd-select`→default/single (search→`searchable`, `sd_select_modal`→авто `--z-popover`); `sd_select_narrow`→subtle; `multi-select`→default/multi/searchable; `radioGroupDropdown`→inline; bootstrap-select→default/md; `select-pagination`→слот pagination/inline-sm. Замены: `height:42px→--control-height-md`, контрол radius→`--radius-sm`/меню→`--radius-md`, тень→`--shadow-overlay`, z 1000/1060→токены, `$light_grey→--surface-subtle`, `$blue→--brand`.

### Modal / Dialog
**Оси:** `variant` = default | brand; `size` = sm | md | lg | fullscreen; states enter/open/leave.
**Backdrop:** bg `--gray-900` `--opacity-muted`; padding `--size-16`; z `--z-overlay`; opacity hidden→full; transition `--transition-base --ease-standard`; без blur.
**Dialog:** bg `--surface-default`/`--text-default`; radius `--radius-md`; shadow `--shadow-overlay`; z `--z-modal`; transition `--transition-slow`; max-height `calc(100dvh - --size-64)`; enter translateY `--size-8`→0. Ширины: sm 360 / md 460 / lg 600; fullscreen 100vw/100dvh, min576→md460.
**Header:** brand → brand-gradient/white; default `--surface-default`/`--text-heading`/border-bottom `--border-default`; min-h `--control-height-lg`; pad `--size-16 --size-20`; title `.t-title-m`.
**Icon-btn (close/back/help):** `--control-height-sm`/`--radius-sm`; hover white `--opacity-faint` или `--surface-subtle`; transition `--transition-fast`; focus `--shadow-input-focus`; disabled `--opacity-disabled`.
**Body:** pad `--size-20`/`--text-default`/`.t-body-l`; grey-вариант `--surface-subtle`.
**Footer:** pad `--size-20`; border-top `--border-default` (≥`$bp-sm`); gap `--size-8`; кнопки dsBtn `--radius-sm`/h `--control-height-md`.
**Нужные токены:** `--shadow-overlay`, `--z-overlay/--z-modal`, `--control-height-*`, `--opacity-*`, `--transition-*`, `--ease-standard`.
**Миграция:** `modal-basic`→md; `modal-fullscreen`/`filter-modal`→fullscreen; import/change/cost-price модалки→md/lg, drop own header/footer; `modal-title`→`.t-title-m`; `modal-content_grey`→grey body; bootstrap backdrop→ds (без blur); удалить `btn-default` override.

### Tag (Badge)
**Оси:** `variant` = soft | solid (default soft); `size` = sm | md; `status` = success | danger | warning | attention | info | neutral; `shape` = pill | square; модификатор `responsive`.
**База:** `inline-flex center`; gap `--size-4`; nowrap; radius pill `--radius-full`/square `--radius-sm`; border `1px solid transparent`; transition `--transition-fast --ease-standard`; lh `--line-height-tight`; focus(интеракт.) `--shadow-input-focus`.

**SIZE:** sm font `--font-size-caption`(11)/600, pad `--size-2 --size-6`, min-h `--size-20`; md font `--font-size-label-m`(13)/600, pad `--size-2 --size-8`, min-h `--size-24`. Иконка `1em`.

**soft × status:** success `rgb(from --status-success / .12)`/`--status-success`; danger `--status-danger-bg`/`--status-danger-strong`; warning `rgb(from --status-warning /.12)`/`--status-warning`; attention `rgb(from --status-attention /.12)`/`--status-attention`; info `rgb(from --blue-300 /.12)`/`--brand`; neutral `--surface-muted`/`--text-default`.
**solid × status:** success/danger/warning/attention=`--status-*`/`--text-on-brand`; info `--status-default`/`--text-on-brand`; neutral `--surface-default`/`--text-heading`/border `--border-default`.
**State:** hover(кликаб.) `--opacity-hover`; focus `--shadow-input-focus`; disabled `--opacity-disabled`+`pointer-events:none`; static `cursor:default`.
**responsive** (≤`$bp-sm`): `width/height:--size-12`, pad 0, `--radius-full`, text-indent скрыт — цветная точка из status.
**Миграция:** `.tag` (+`_sm/_success/_warning/_blue/_gray/_error`)→soft; `.status-tag` (+статусы)→solid/square; `.status-tag_responsive`→responsive; убрать сырые hex, перевести на `--status-*`/`--surface-*`/`--text-*`. Новых токенов нет.

### Notice / Alert
**Оси:** `variant` = info | success | warning | danger (default info); `size` = sm | md; states default/hover/focus-within.
**Каркас:** pad sm `--size-12 --size-16`/md `--size-16 --size-20`; gap sm `--size-8`/md `--size-12`; radius `--radius-lg`(12); border 1px; shadow none; transition `background-color, border-color var(--transition-base) var(--ease-standard)`. Title `.t-label-m`; body `.t-body-s`; иконка `--size-20`(md)/`--size-16`(sm) цвет accent.

**variant default:** info bg `--surface-subtle` (или `--notice-info-bg`)/border `--blue-300`/`--text-default`/accent `--brand`; success bg `--notice-success-bg`/border `--accent-positive`/`--text-default`/accent `--accent-positive`; warning `--notice-bg`/`--notice-border`/`--notice-text-strong`/`--notice-accent`; danger `--status-danger-bg`/`--status-error`/`--status-danger-strong`/`--status-danger`.
**hover:** контейнер фон без изменений; вложенные контролы (dismiss/CTA) `--opacity-hover`+`--transition-fast`.
**focus-within:** ring на вложенном контроле `--shadow-input-focus`.
**dismiss-крестик:** `--size-20`/`--text-muted`/hover `--opacity-hover`/focus `--shadow-input-focus`/`--radius-sm`.
**Нужные токены:** `--notice-success-bg`=`var(--green-50)`; опц. `--notice-success-text`=`var(--green-600)`; info — рекомендуется без новых токенов (вариант 1), иначе `--notice-info-bg/--notice-info-border`.
**Миграция:** `_notice.scss` на токены; `.notice`→info; `._warning`→warning; `._success`→success (убрать `#F0FDF4/#166534`); добавить `._danger`; целевой `<Notice variant size>`.

### Tooltip
Единый `v-tooltip` (tippy theme="ds"), опц. `DsTooltip`. API: content, placement(top/bottom/left/right ±start/end, default top), size(sm/md), variant(default/inverse), arrow, disabled, delay [150,0].
**Контейнер:** z `--z-tooltip`; max-width `--size-80`(320); pointer-events none; transition `opacity, transform var(--transition-fast) var(--ease-standard)`; opacity hidden→full.
**default (светлый):** bg `--surface-default`/`--text-heading`; radius sm `--radius-sm`/md `--radius-md`; pad sm `--size-6 --size-8`/md `--size-8 --size-12`; font sm `.t-caption`/md `.t-body-s`; shadow `--shadow-overlay`; arrow `--surface-default`.
**inverse (тёмный):** bg `--gray-900`/`--text-on-brand`; shadow `--shadow-dropdown`; arrow `--gray-900`; остальное как default.
**State:** hidden `--opacity-hidden`+`visibility:hidden`; shown `--opacity-full`; disabled — директива уничтожает инстанс; focus — показ по focus триггера. Offset `--size-8`, стрелка 8×8.
**Миграция:** `[data-bm-tooltip]`/`.tooltip-inner`/`v-tippy`/`<Tippy>`/`tippy()`→`v-tooltip` theme ds; удалить z 9999/100000, `transition:all 1.5s`, `rgba(0,0,0,.2)`. Новых токенов нет.

### Tabs (dsTabs)
**Оси:** `variant` = line | segmented (default line); `size` = sm | md | lg.
**База `.dsTab`:** font 13/400/`--line-height-tight`; gap `--size-8`; transition `color var(--transition-base) var(--ease-standard)`; focus-visible `--shadow-input-focus`+`--radius-sm`; height `--control-height-sm/md/lg`.

**line:** контейнер flex, gap sm `--size-12`/md,lg `--size-24`, border-bottom `1px --border-default`, bg `--surface-default`. Подчёркивание `::after` height 3px (литерал/опц. `--border-width-accent`)/`--radius-sm`/`--brand`. size: sm 32/13/pad0; md 40/13/pad `--size-8 0`; lg 48/`--font-size-title-m`/pad `--size-8 0`. State: rest `--text-default`/underline opacity 0; hover `--brand`; active `--brand`/underline opacity full; disabled `--text-disabled`+`--opacity-disabled`.
**segmented:** контейнер inline-flex, gap `--size-2`, pad `--size-2`, bg `--surface-muted`, radius `--radius-md`. Таб radius `--radius-sm`, transition `background,color var(--transition-base)`. State: default transparent/`--text-muted`; hover `--surface-default`/`--text-default`; active `--surface-default`(white)/`--brand`/600/`--shadow-card`; disabled `--text-disabled`+`--opacity-disabled`.
**Tag в табе:** `--brand`/`--text-on-brand`, `--font-size-caption`/600, pad `--size-2 --size-4`, `--radius-sm`. Иконка `--font-size-title-m`. Текст `display:none; @media(min-width:$bp-md){inline}`.
**Опц. токен:** `--border-width-accent: 3px` (или литерал).
**Миграция:** `.header-tabs__btn`→line/md (38→40); `.table-tabs .nav-link`→line; `.pricing-tabs__btn`→line (gap 40→24, `__inner`→`.dsTabs--scrollable`); bootstrap `.nav-tabs` (DashboardPeriods/Charts)→segmented. Табличную обвязку из `_table-tabs.scss` исключить из Tabs.

### Table
Класс `.ds-table` + обёртка `.ds-table-wrap`. Оси: variant base/bordered/striped/card; size sm/md/lg; states строк default/hover/selected/total/disabled/empty.
**База:** width 100%, border-collapse, `--text-default`, bg `--surface-default`, transition `background,color var(--transition-fast)`. Wrap `overflow-x:auto`, scrollbar `--surface-scrollbar-*`; card-wrap border `--border-default`/`--radius-md`/`--shadow-card`/`overflow:hidden`.
**size:** sm th/td pad `--size-6 --size-8`, min-h `--control-height-sm`, font 13/1.2; md th `--size-8 --size-12` pb `--size-12`/td `--size-12`, min-h 40, 13/1.4; lg th `--size-12 --size-16`/td `--size-16`, min-h 48, 16/1.5. th `.t-label-m`/`--text-muted`/600/left; td `.t-body-s`(или .t-body-l lg)/`--text-default`/400. `.ds-table--flush` pad-l/r 0.
**variant границы:** base/card th+td border-bottom `--border-default`; bordered border все; striped зебра `tr:nth-child(even) --surface-subtle`, hover поверх `--surface-muted`.
**state:** hover `--surface-subtle`; selected `rgb(from --brand /.06)`+inset 2px `--brand`; total `--surface-muted`/`--text-strong`/600; disabled `--text-disabled`+`--opacity-disabled`; empty `--text-muted` center pad `--size-32 --size-16` `.t-body-l`. Action-иконка `--text-muted`→hover `--status-error`.
**sortable th:** `--text-muted`→hover `--text-heading`; иконка неактив `--opacity-faint`/актив `--opacity-full`+`--brand`; focus `--shadow-input-focus`.
**sticky:** header `position:sticky; top:var(--ds-table-sticky-top,0); z-index:--z-sticky`, stuck `--shadow-card`; column `left:0; bg --surface-default; z --z-raised`, угол `--z-sticky`. Ширины `.ds-table__col--w48`/`--w64`.
**pagination:** flex space-between gap `--size-8` pad `--size-12 --size-16` border-top `--border-default`/.t-body-s/`--text-muted`; кнопки ghost/sm `--control-height-sm`/`--radius-sm`/.t-label-m, активная `--brand`/`--text-on-brand`, hover `--surface-subtle`, disabled `--opacity-disabled`, focus `--shadow-input-focus`.
**a11y:** кликаб. строка `:focus-visible{inset 0 0 0 2px --brand}`.
**Нужный токен:** `--shadow-overlay` для поповеров в ячейках.
**Миграция:** глобальный `table{}`→`.ds-table`; `.table-condensed`→`--sm`; `.settings_table`→`--md --flush`; `.expenses/products/dashboard-table`+`total_table_row`→`.ds-table`/`__row--total`; `.partners-table` sticky→`--sticky`+`--ds-table-sticky-top`(50→48); инлайн min-width 50/70→`__col--w48/--w64`; footable не трогать.

### Card
Структура `.card[.card--{variant}][.card--{size}][.is-{state}]` → `__header/__body/__footer`.
**База:** bg `--surface-default`/`--text-primary`/border `1px --border-default`/radius `--radius-md`/`--shadow-card`/transition `box-shadow,border-color var(--transition-base)`.
**variant:** default; flat `--surface-subtle`/no shadow; outline transparent/no shadow; elevated `--surface-default`/`--shadow-overlay`; interactive +hover/focus/active+`cursor:pointer`; summary `--summary-*`/`--text-on-brand`/no border/shadow.
**size:** sm pad `--size-12` gap `--size-8` radius `--radius-md` header `.t-heading-m` body `.t-body-s`; md pad `--size-16` gap `--size-12` header `.t-heading-m` body `.t-body-l`; lg pad `--size-24` gap `--size-16` radius `--radius-lg` header `.t-heading-l` body `.t-body-l`. Без фикс height.
**state (interactive):** hover border `--border-strong`/`--shadow-button`; focus/focus-within border `--brand`/`--shadow-input-focus`; active `--surface-subtle`/border `--border-strong`/`--shadow-card`; selected border `--brand`; disabled `--surface-disabled`/`--opacity-disabled`/`pointer-events:none`; loading skeleton `--duration-skeleton`.
**Зоны:** header pad по size/border-bottom `--border-default`/flex space-between gap `--size-8`; body pad/`--text-primary`; footer pad/border-top `--border-default`/flex flex-end gap `--size-8`.
**z:** base `--z-base`; elevated — родителем; interactive:active опц. `--z-raised`.
**Нужные токены:** `--shadow-overlay`; `--text-on-brand` (проверить, иначе `--white` в summary).
**Миграция:** разнотипные `.*-card/.panel/.box`→`@extend .card.card--md`; серые блоки→`--flat`; кликаб.→`--interactive`; сводки main.scss:2032-2053→`--summary` (`--summary-*`); карты в модалках/поповерах (rgba(24,39,75,.12))→`--elevated`/`--shadow-overlay`; radius/padding по осям.

### Nav / Sidebar
Один компонент `Nav`. Оси: variant rail | stacked; size (для stacked) md | sm; item-state default/hover/active/focus-visible/disabled; container expanded/collapsed.
**Контейнер:** bg `--surface-default`; rail ширина 96px (`--size-96`, снап 100→96), padding 0, height 100vh, shadow `--shadow-aside`(≥992), z `--z-fixed`, scrollbar `--size-2`+`--surface-scrollbar-*`, transition `--transition-base`; stacked padding `--size-24 --size-16`(доки)/`--size-8`(флайаут), флайаут shadow `--shadow-dropdown` z `--z-dropdown`, backdrop `--z-overlay`.
**rail item:** bg default `--surface-default`/hover,active `--surface-muted`; color default `--text-default`/hover `--text-heading`/active `--brand`; icon 24px; title `--font-size-body-s`/400; таблетка radius `--radius-lg` pad `--size-12`; item pad `--size-12 --size-8`; gap `--size-8`; focus `--shadow-input-focus`+`--radius-lg`; disabled `--opacity-disabled`+`pointer-events:none`; transition `--transition-base`.
**stacked md:** row icon16+label; bg hover/active `--surface-muted`; color `--text-default`→hover `--text-heading`→active `--brand`; label `--font-size-body-s`/400 (active опц. 600); radius `--radius-md`; pad `--size-12`; gap `--size-8`; height `--control-height-md`; focus `--shadow-input-focus`+`--radius-md`. Флайаут-панель min-width 240px (контентная константа).
**stacked sm (доки):** pad `--size-8 --size-10`; height auto; transition `--transition-fast`; цвета как md.
**Группа:** group-title `--font-size-caption`/600/`--text-muted`/pad `0 --size-10`; дети `none`→`flex` при `.is-open`, фон `--surface-muted`, transition `--transition-slow`. Badge — Tag soft. Логотип-блок height `--size-48`/border-bottom `--border-default`.
**Снапы:** `$border_color`→`--surface-muted`; `$blue`→`--brand`; radius 10→`--radius-lg`/6→`--radius-md`; transition .3/.2/.15→slow/base/fast; z 6/5→`--z-fixed`, флайаут→`--z-dropdown`, backdrop→`--z-overlay`.
**Миграция:** `aside.aside`→`.nav.nav--rail`; `.main_nav*`→`.nav__list/__item-wrap`; `.main_link`→`.nav__item`(rail); `.main_linkInner`/`.children_link`→`.nav__item`(stacked); `.dsSidebar__link`→stacked/sm; `.dsSidebar__section-title`→`.nav__group-title`. Открытые вопросы: ширина рейла 96px; min-width 240px (без токена).

### Pagination
Один компонент, две зоны (desktop numbered + compact prev/next). Части: page item, nav button, ellipsis, compact-label.
**Сетка:** md квадрат `--control-height-md`(40), sm `--control-height-sm`(32). 42→40 snap. pad `0 --size-8`; radius `--radius-sm` (круги prev/next отменяем); font `.t-body-l`(16/400/1.2); transition `--transition-base --ease-standard`; z `--z-base`.
**page × state:** default transparent/`--text-muted`/border transparent; hover `--surface-muted`/`--brand`; focus `--shadow-input-focus`; disabled `--text-disabled`+`--opacity-disabled`.
**page active:** `--brand`/`--text-on-brand`/border `--brand`/600; hover `--brand-hover`; focus +`--shadow-input-focus`.
**nav (prev/next):** default `--surface-default`/`--text-muted`/border `--border-default`; hover `--surface-muted`/`--brand`; focus border `--brand`+`--shadow-input-focus`; disabled `--text-disabled`+`--opacity-disabled`; icon `--font-size-body-l`.
**ellipsis:** transparent/`--text-muted`/`pointer-events:none`/`.t-body-l`.
**Контейнер:** flex center, gap md `--size-4`/sm `--size-2`; compact-зона gap `--size-12`(или `--size-16`). compact-label `.t-body-s`/`--text-muted`, текущий номер 600/`--brand`.
**Респонсив:** `@media(min-width:$bp-xl)` numbered; ниже compact. Скрытый `<select>` `--opacity-hidden`/z `--z-raised`.
**Миграция:** `.page_nav .navigation`→numbered; `span.current`→`--active` (заливка `--brand`); prev/next `border-radius:50%`→`--radius-sm`; `.select-pagination*`→compact; удалить override `dev1.scss:27`; слить `_select-pagination.scss` в `_pagination.scss`.

### Toast / Notification
Источник: `AppToast.vue`/`AppToastsContainer.vue`. Soft (белый фон + цветной акцент).
**Контейнер:** fixed; z `--z-toast`; pad `--size-16`; gap `--size-12`; pointer-events none; `@media(min-width:$bp-md)`; max-inline-size 460px (инлайн-исключение).
**Ячейка (info/md/default):** bg `--surface-default`; accent-bar 4px по variant; radius `--radius-md`; pad block `--size-12`/start `--size-12`/end `--size-32`; gap `--size-8`; min-h `--control-height-lg`; shadow `--shadow-overlay`; transition `transform var(--transition-base)`.
**variant:** info `--brand`; success `--status-success`; warning `--status-warning`; error `--status-danger`; neutral `--text-muted`. Title `--text-heading`/`.t-label-m`. Опц. solid-режим: success `--notice-success-bg/-text`, error `--status-danger-bg/-strong`, warning `--notice-bg/-text-strong`.
**size:** sm pad `--size-8`/`--size-10`, min-h 32, icon 13, title .t-label-m/sub .t-caption; md pad `--size-12`, min-h 40, sub .t-body-s; lg pad `--size-16`, min-h 48, icon 16.
**close:** `--size-24`; inset `--size-8`; `--radius-sm`; `--font-size-caption`; `--text-muted`; hover `--text-heading`/`--surface-muted`/`--transition-base`; focus `--shadow-input-focus`.
**Motion:** keyframes `toast-in/out/fade`, длительности `--transition-slow`, easing standard(in)/emphasized(out/fade), opacity `--opacity-hidden/full`.
**Нужный токен:** max-inline-size 460px (вне `--size-*`, инлайн-исключение).
**Миграция:** сохранить имена классов `.appToast*`/`.toast*`, переписать `<style>` на токены; `title` 500→600; subtitle 12→13; close 5→4 radius, 22→24; z 2000→`--z-toast`; добавить проп `variant`; keyframes `slideIn/Out`→`toast-in/out/fade`.

### Skeleton / Loader (Spinner)
Один компонент, `type` = skeleton | spinner. Общий `@keyframes spin` + `@keyframes skeleton-shimmer`.
**Spinner — variant** default | inverse | overlay. **size:** sm `--size-16`/border 2px; md `--size-24`/2px; lg `--size-40`/3px. Кольцо = border + прозрачный сектор (без SVG).
- default: трек `2px --border-default`, бегунок `--brand`, radius `--radius-full`.
- inverse: трек `rgb(from --white /.3)` (`--opacity-faint`), бегунок `--white`.
- overlay: backdrop `rgb(from --surface-default /.7)`, pad `--size-24`, z `--z-overlay`, появление `opacity var(--transition-base)`.
- animation `spin var(--duration-spin) var(--ease-linear) infinite`; reduced-motion → none. dimmed-контент `--opacity-muted`+`pointer-events:none`.
**Skeleton — variant** text | title | block | circle. text h `--size-12` radius `--radius-sm`; title h `--size-20` width 60%; block h проп(`--size-80`) radius `--radius-md`; circle radius `--radius-full`. База bg `--surface-muted`; shimmer `linear-gradient(90deg, --surface-muted, --surface-subtle, --surface-muted)`/`200% 100%`; animation `skeleton-shimmer var(--duration-skeleton) var(--ease-standard) infinite`; reduced-motion → статичный `--surface-muted`; переход к контенту fade `--transition-slow`.
**Нужные токены:** `--duration-spin/skeleton`, `--ease-linear/standard`, `--transition-base/slow`, `--opacity-*`, `--z-overlay` (все foundations [новый]).
**Миграция:** `.load-ring`(+svg)→spinner/md (border-кольцо); 3 keyframes→общий `spin`; `.btn-loader`→inverse/default внутри dsBtn; оверлеи→overlay/lg/dimmed; skeleton — новый паттерн.

---

## Сводный список НУЖНЫХ новых токенов

### Из foundations (обязательны до верстки — блокирующая предпосылка)
- **[новый]** `--shadow-overlay` = `0 4px 12px rgb(from var(--gray-900) r g b / .12)` — модалки, поповеры, тосты, тултипы, меню Select, карты elevated, поповеры в таблицах.
- **[новый]** Opacity: `--opacity-full` (1), `--opacity-hover` (.7), `--opacity-muted` (.5), `--opacity-disabled` (.4), `--opacity-faint` (.3), `--opacity-hidden` (0).
- **[новый]** Motion: `--transition-fast` (150ms), `--transition-base` (200ms), `--transition-slow` (300ms), `--ease-standard` (ease-in-out), `--ease-emphasized` (ease), `--ease-linear` (linear), `--duration-spin` (1.2s), `--duration-skeleton` (2s).
- **[новый]** Z-index: `--z-below, --z-base, --z-raised, --z-raised-2, --z-sticky, --z-dropdown, --z-fixed, --z-overlay, --z-modal, --z-popover, --z-toast, --z-tooltip, --z-max`.
- **[новый]** Control-height: `--control-height-sm` (32), `--control-height-md` (40), `--control-height-lg` (48).
- **[новый]** Breakpoints (SCSS): `$bp-sm` (576), `$bp-md` (768), `$bp-lg` (992), `$bp-xl` (1200), `$bp-xxl` (1400) + миксины `media-up/media-down`.
- **[новый]** `--notice-success-bg` = `var(--green-50)`; опц. `--notice-success-text` = `var(--green-600)`.
- **[изменить]** `--radius-md` note в `tokens.js`: убрать «кнопки», добавить, что кнопки/контролы используют `--radius-sm`.

### Из компонентов
- `--shadow-input-focus-danger` = `0 0 0 4px rgb(from var(--status-danger) r g b / .12)` (Button danger focus-ring). До ввода — инлайн-выражение.
- `--shadow-error-focus` = `0 0 0 4px rgb(from var(--status-danger) r g b / .12)` (Input/Select error+focus). До ввода — инлайн.
- `--border-strong` = `var(--gray-500)` (hover-граница Input/Select/Button-secondary/Card). Альтернатива: hover = `--border-input` без токена.
- `--border-error` = `var(--red-500)` и `--text-error` = `var(--red-700)` (Tier-2 error-семантика контролов; Select). До ввода — `--status-error`/`--status-danger`.
- `--notice-info-bg` / `--notice-info-border` (опционально; Notice info). Рекомендация — НЕ вводить (info через `--surface-subtle` + `--blue-300`).
- `--border-width-accent` = `3px` (опционально; толщина подчёркивания Tabs line). Допустим литерал.
- Контентные константы вне `--size-*` (НЕ токенизировать): рейл Nav 96px (снап на `--size-96`), флайаут-панель 240px, max-inline-size тоста 460px.

### Применение существующих токенов (правка legacy-хардкодов)
- `_notice.scss`: применить `--notice-*` вместо `#93370D/#166534/#F0FDF4`.
- Общий `@keyframes spin` вместо `load-ring`/`dsBtnSpin`/`admin-refresh-spin`.
- Inset `rgba(129,140,136,.2)` → `rgb(from var(--gray-600) r g b / .2)` по месту.
- Материализовать `.t-*` классы как реальный CSS из токенов.

---

## Открытые вопросы

1. **Ширина рейла Nav (100px):** не на шкале `--size-*` (кратной 2px). Рекомендация — снап на 96px (`--size-96`, микросдвиг −4px). Требует подтверждения, что визуальный сдвиг приемлем.
2. **min-width флайаут-панели Nav (240px) и max-inline-size тоста (460px):** контентные константы вне `--size-*` (нет ступеней 240/460). Решение — оставить локальными константами с комментарием, не вводить токены. Подтвердить.
3. **`--border-strong`:** вводить ли отдельный токен hover-границы (gray-500) или оставлять hover = `--border-input` (без визуального изменения). Затрагивает Input, Select, Button-secondary, Card, Toggle. Нужно единое решение.
4. **Notice info-вариант:** вводить ли `--notice-info-bg/--notice-info-border` (голубой фон) или реализовать через `--surface-subtle` + `--blue-300` (рекомендуется, без новых токенов).
5. **`--border-error`/`--text-error` vs `--status-error`/`--status-danger`:** аудит не зафиксировал явную error-семантику бордера/текста контролов. Рекомендация — завести Tier-2 пару, чтобы не использовать сырые примитивы. Требует решения архитектора DS.
6. **Pagination active-state:** канон — заливка `--brand` (ясная семантика выбранной страницы) против буквального сохранения legacy «только bold+цвет». Рекомендована заливка; нужно подтверждение продукта.
7. **`--border-width-accent` (3px) Tabs:** токенизировать толщину акцент-полосы или оставить литералом как декоративную константу.
8. **Tabs из bootstrap `.nav-tabs` (DashboardPeriods/Charts):** рекомендована явная миграция в `segmented`, а не алиас — подтвердить объём переразметки.
---

## Адаптивность (Responsive) — канон

Mobile-first. Брейкпоинты — `resources/scss/_responsive.scss` (`$bp-sm 576 / md 768 / lg 992 / xl 1200 / xxl 1400`), подключение `@use 'responsive' as *;` + `@include respond-to(md){…}`. Сырые px в `@media` запрещены.

| Зона | Мобайл (база) | ≥ md (планшет) | ≥ lg (десктоп) |
|---|---|---|---|
| Page-padding | `--size-32` | `--size-40` | `--size-48` |
| Тулбар | колонка / перенос, поиск на всю ширину; вторичные кнопки → иконки | строка | строка |
| Таблица | список карточек (tr→card, td с data-title) | таблица | таблица |
| Модалка | во весь экран / bottom-sheet, `--radius-*` сверху | центр, фикс. ширина (`--size-128`×N), `--radius-md` | то же |
| Сетка карточек | 1 кол. | 2 кол. | 3–4 кол. (`auto-fill, minmax`) |
| Сайдбар | скрыт / off-canvas | off-canvas | постоянный |

**Таблица→карточки (паттерн):** `respond-below(md)`: `table,thead,tbody,tr,td{display:block}`; `thead{display:none}`; `tr` = карточка (`--surface-default`, `--border-default`, `--radius-md`, padding `--size-12`, margin-bottom `--size-8`); `td` flex space-between с подписью через `td::before{content:attr(data-title)}` (`t-caption`, `--text-muted`).

---

## Калибровка по реальному ЛК (выводы для системы)

Замеры всех страниц ЛК (отчёт — `docs/design-system-calibration.md`). Подтверждено: плотность 13px, кнопки 4px/40, title 16/700, брейкпоинты — совпадают. Дополнительно зафиксировано в систему:

### Радиусы контейнеров (по размеру)
- **Мелкие** (виджет, карточка-строка, day-block) → `--radius-md` (8).
- **Крупные** (table_outer/панель данных, карточки настроек и тарифов, notice, лендинг) → `--radius-lg` (12). Реальные 10/16px снапятся сюда.
- **Тулбар/фильтр-кнопки и контейнеры-селекты** → `--radius-md` (8) — осознанное исключение из 4px primary-кнопок.

### Заголовки секций/карточек
Реально 18px/600 (sep-title, settings/warehouse титулы). По канону снапятся в `--font-size-heading-m` (20/600) — `t-heading-m`. Это +2px к текущему (в рамках «причесать на шкалу»).

### Table-specific exceptions (осознанные исключения вне шкалы — НЕ вводить токены)
Плотные таблицы данных имеют спец-значения, которые сохраняем как есть:
- высота строк: 50/52px (десктоп), 64px (мобильный th) — фикс. под контент;
- padding ячеек 5px — плотный (крайние 10/20px);
- inline-поля в ячейках (себестоимость/комментарий): `border-radius: 0` (намеренно прямоугольные);
- mobile font-size инлайн-полей = 16px (анти-зум iOS), desktop = 13px.
Это не разнобой, а паттерн плотных таблиц — фиксируем как исключение.

### Анти-зум мобильных инпутов
Для редактируемых полей: на мобайле `font-size: 16px` (iOS не зумит), от `md` → `--font-size-body-s` (13). Применять только к реальным полям ввода в таблицах.

### Многоколоночные таблицы данных (Склад и т.п.)
Чтобы плотная таблица с 10+ колонками помещалась по ширине и не разъезжалась:
- заголовки `th` — ПЕРЕНОСИМ в 2–3 строки (`white-space: normal; vertical-align: bottom`);
- значения `td` — НЕ переносим (`white-space: nowrap`);
- числовые колонки — узкие (`width: --size-80`), за счёт переноса заголовка;
- горизонтальный скролл оставляем как запасной (overflow-x:auto), но цель — влезть в экран.
Это даёт компактность по горизонтали, как в реальном ЛК.

### Мобильные паттерны ЛК (эталон — живое приложение, скринов нет)
Снято с реального приложения на 390px. Применять при сборке мобильных версий:
- **Навигация:** сайдбар сворачивается в **гамбургер** (☰ в топбаре слева) + off-canvas drawer; не просто `display:none`. Топбар на мобайле компактный — иконки help/bell/account без подписей.
- **Summary-карточки:** на мобайле НЕ стопкой, а **вкладки + свайпер**: ряд табов с заголовками (Себестоимость/Потенц. продажи/Потенц. прибыль), показана одна карточка, переключение табами/свайпом. Метрики внутри — в **2 колонки** (не 3).
- **Таблица:** →карточки через data-title (как уже в каноне).
- **Тулбар:** в колонку, поиск на всю ширину.
Проверка мобайла — ресайзом живого приложения (reference = real app at 390px), а не статичными скринами.

### Широкие таблицы (10+ колонок) на мобайле — компактный режим + деталь
Снято с живого Склада (основной магазин, mark.aborchie). Широкая таблица на мобайле
НЕ превращается в карточки со всеми полями. Вместо этого:
- **Компактная таблица**: показываются только приоритетные колонки (Склад: Товары +
  Кол-во на складе + Остаток в днях) + кнопка **→ «Больше»** в строке.
- **→ открывает fullscreen-модалку «Товар»** (градиентная шапка + back): шапка товара
  (картинка/id/цена) + список ВСЕХ полей label:value (бейджи для статусных) + футер
  «Отменить/Сохранить».
- ▶ слева — раскрытие группы (FBO/FBS) как подстроки.
Узкие таблицы (≤5-6 колонок, товары/расходы) — паттерн «таблица→карточки» (data-title).
Эталоны: docs/reference/screens/_live__склад__мобайл-список.png, _live__склад__мобайл-деталь.png

### Мобильный тулбар и баннер ЛК (живой эталон Склада с данными)
Снято с реального Склада (mark.aborchie, основной магазин). КРИТИЧНО — мобайл это НЕ «десктоп стопкой»:
- **Тулбар сворачивается:** на мобайле НЕ показываем поле поиска, селекты («Все склады»/«FBO/FBS») и текстовую кнопку «Фильтр». Вместо всего — **одна круглая иконка-воронка** (в ряду табов summary, справа), открывающая фильтр-модалку. Поиск/склады/тип — секции ВНУТРИ фильтр-модалки.
- **Summary-табы:** на мобайле — текстовые табы (активный — brand-текст), НЕ pill-таблетки; в ряду табов справа — круглая воронка. В шапке карточки — иконка info/⚠.
- **Видео-баннер:** превью с кнопкой play; клик → **fullscreen-модалка** (градиентная шапка ← раздел, видео-плеер, полный текст-описание, кнопка «Понятно»). Это отдельный паттерн «видео-хинт».
- **Пагинация на мобайле:** НЕ кнопки-номера, а «Страница N из M» + стрелки ‹ ›.
Эталоны: _live__склад__мобайл-верх-тулбар.png, _live__склад__мобайл-фильтр.png, _live__склад__мобайл-видео-попап.png, _live__склад__мобайл-список.png, _live__склад__мобайл-деталь.png
