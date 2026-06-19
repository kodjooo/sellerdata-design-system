# Библиотека компонентов Ds* — индекс

Все компоненты в `resources/js/Components/Ds/`. Каждый использует `<script setup>`, `@use 'responsive' as *`, только design-токены (`var(--*)`, `--size-*`, `--radius-*`, `t-*`). Резолв `responsive` подтверждён (`vite.config.js` → `loadPaths: ['resources/scss']`, файл `resources/scss/_responsive.scss` с миксинами `respond-to`/`respond-below`).

| Компонент | Props | Состояния | Файл |
|---|---|---|---|
| **DsButton** | `variant` primary\|secondary\|ghost\|danger (def primary), `size` sm\|md\|lg (def md), `iconOnly`, `loading`, `disabled`, `type` (def button), `ariaLabel` | default, hover, active, focus-visible, disabled, loading (центр-спиннер), iconOnly | `resources/js/Components/Ds/DsButton.vue` |
| **DsInput** | `modelValue` (v-model), `type`, `size` sm\|md\|lg (def md), `label`, `helper`, `error`, `placeholder`, `icon`, `disabled`, `readonly`, `required`, `id` | default, hover, focus, disabled, readonly, error, error+focus | `resources/js/Components/Ds/DsInput.vue` |
| **DsSelect** | `options` (строки/числа/объекты), `modelValue` (v-model; массив для multiple), `multiple`, `searchable`, `placeholder`, `searchPlaceholder`, `emptyText`, `valueKey`/`labelKey`/`subKey`, `showSelectAll`+`selectAllLabel`, `showFooter`, `disabled` | trigger: default/hover/focus/open/placeholder/disabled; option: default/hover/selected/disabled; panel fade; multiselect footer; empty; адаптив <md | `resources/js/Components/Ds/DsSelect.vue` |
| **DsTag** | `variant` soft\|solid (def soft), `tone` success\|warning\|danger\|info\|neutral (def neutral), `size` sm\|md (def md), `clickable` | soft×tone, solid×tone, hover (clickable), focus-visible (clickable), static | `resources/js/Components/Ds/DsTag.vue` |
| **DsCard** | `padding` токен --size-* (def --size-16), `radius` md\|lg (def md), `shadow` card\|none\|overlay (def card), `tag` (def section) | default, header (border-bottom), footer (border-top), радиус md/lg, тень card/none/overlay | `resources/js/Components/Ds/DsCard.vue` |
| **DsSummaryCard** | `title`, `gradient` periwinkle\|blue\|muted\|indigo\|indigo-deep\|navy (def periwinkle), `icon` ''\|info\|warning, `iconLabel`, `metrics` [{label,value}], `columns` (def 3) | шапка с градиентом+заголовок, иконка info/warning, тело-сетка метрик (моб 1 кол → md repeat(columns)), опц. футер | `resources/js/Components/Ds/DsSummaryCard.vue` |
| **DsTable** | `columns` [{key,label,align,numeric,width}], `rows`, `rowKey` (def id), `expandable`, `childrenKey` (def children), `hover` (def true), `stickyHeader` (def true), `emptyText` | default, hover строки, expandable (шеврон/is-expanded), раскрытие #expanded/children, sticky-шапка, empty, адаптив <md (таблица→карточки) | `resources/js/Components/Ds/DsTable.vue` |
| **DsModal** | `modelValue` (v-model), `title`, `size` sm\|md\|lg\|fullscreen (def md), `closeOnBackdrop` (def true), `closeOnEsc` (def true), `closable` (def true) | скрыта/показана, enter/leave (fade+pop), close hover/focus, моб fullscreen, size fullscreen | `resources/js/Components/Ds/DsModal.vue` |
| **DsToast** | `variant` info\|success\|warning\|danger (def info), `title`, `position` 6 углов (def top-right), `dismissible` (def true), `visible` (v-model:visible) | info/success/warning/danger (accent), hidden/visible, close hover/focus, reduced-motion, появление top/bottom | `resources/js/Components/Ds/DsToast.vue` |
| **DsCheckbox** | `modelValue` (v-model: Boolean\|Array\|radio-value), `type` checkbox\|radio (def checkbox), `size` sm\|md (def md), `value`, `label`, `name`, `indeterminate`, `disabled`, `required`, `error`, `id` | unchecked, checked, indeterminate (cb), disabled, focus, hover, error | `resources/js/Components/Ds/DsCheckbox.vue` |
| **DsPagination** | `page` (def 1), `total` (def 0), `perPage` (def 20), `siblingCount` (def 1) | default, hover, focus, active (заливка brand), active:hover, nav prev/next, nav disabled, ellipsis | `resources/js/Components/Ds/DsPagination.vue` |

## Slots / Emits (для сборки страниц)

- **DsButton** — slots: default, `iconLeft`, `iconRight`. Emits: `click`.
- **DsInput** — slot: `icon`. Emits: `update:modelValue`, `change`, `focus`, `blur`. Expose: `focus()`/`blur()`.
- **DsSelect** — slots: `option`, `footer`(`apply`,`selected`). Emits: `update:modelValue`, `change`, `open`, `close`.
- **DsTag** — slots: default, `icon`. Emits: `click`.
- **DsCard** — slots: `header`, default, `footer` (условные).
- **DsSummaryCard** — slots: `title`, `icon`, `body`, `footer`.
- **DsTable** — slots: `cell-<key>`, `head-<key>`, `expanded`, `empty`. Emits: `row-click`, `toggle-expand`.
- **DsModal** — slots: `header`, default, `footer`. Emits: `update:modelValue`, `close`.
- **DsToast** — slots: `icon`, default. Emits: `close`, `update:visible`.
- **DsCheckbox** — slot: default. Emits: `update:modelValue`, `change`, `focus`, `blur`. Expose: `focus()`/`blur()`.
- **DsPagination** — без slots. Emits: `change(page)`.

## Согласованность именования
- Размеры: `size` sm/md/lg (Button/Input/Select-фикс), sm/md (Tag/Checkbox) — единый паттерн.
- Семантика статусов: tone/variant используют общий набор success/warning/danger/info — единообразно (Tag, Toast).
- v-model: одиночный modelValue везде; `visible` в DsToast через `v-model:visible` (осознанное, чтобы не путать с контентом).
- Token-дисциплина соблюдена во всех файлах; новых токенов не вводилось.