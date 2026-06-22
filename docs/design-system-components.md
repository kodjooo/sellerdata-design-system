# Библиотека компонентов Ds* — индекс

Все компоненты в `resources/js/Components/Ds/`. Каждый использует `<script setup>`, `@use 'responsive' as *`, только design-токены (`var(--*)`, `--size-*`, `--radius-*`, `t-*`). Резолв `responsive` подтверждён (`vite.config.js` → `loadPaths: ['resources/scss']`, файл `resources/scss/_responsive.scss` с миксинами `respond-to`/`respond-below`).

| Компонент | Props | Состояния | Файл |
|---|---|---|---|
| **DsButton** | `variant` primary\|secondary\|ghost\|danger (def primary), `size` sm\|md\|lg (def md), `iconOnly`, `loading`, `disabled`, `type` (def button), `ariaLabel` | default, hover, active, focus-visible, disabled, loading (центр-спиннер), iconOnly | `resources/js/Components/Ds/DsButton.vue` |
| **DsInput** | `modelValue` (v-model), `type`, `label`, `helper`, `error`, `placeholder`, `disabled`, `readonly`, `required`, `inline`, `suffix` | default, hover, focus, disabled, readonly, error; `inline` — безрамочное поле ячейки (рамка по hover/focus); `suffix` — ₽/% в поле | `resources/js/Components/Ds/DsInput.vue` |
| **DsSelect** | `options` (строки/числа/объекты), `modelValue` (v-model; массив для multiple), `multiple`, `searchable`, `placeholder`, `searchPlaceholder`, `emptyText`, `valueKey`/`labelKey`/`subKey`, `showSelectAll`+`selectAllLabel`, `showFooter`, `disabled` | trigger: default/hover/focus/open/placeholder/disabled; option: default/hover/selected/disabled; panel fade; multiselect footer; empty; адаптив <md | `resources/js/Components/Ds/DsSelect.vue` |
| **DsTag** | `variant` soft\|solid (def soft), `tone` success\|warning\|danger\|attention\|default\|blue\|gray (def default), `size` sm\|md (def md), `clickable` | soft×tone, solid×tone, hover (clickable), focus-visible (clickable), static | `resources/js/Components/Ds/DsTag.vue` |
| **DsCard** | `padding` токен --size-* (def --size-16), `radius` md\|lg (def md), `shadow` card\|none\|overlay (def card), `tag` (def section) | default, header (border-bottom), footer (border-top), радиус md/lg, тень card/none/overlay | `resources/js/Components/Ds/DsCard.vue` |
| **DsSummaryCard** | `title`, `gradient` periwinkle\|blue\|muted\|indigo\|indigo-deep\|navy (def periwinkle), `icon` ''\|info\|warning, `iconLabel`, `metrics` [{label,value}], `columns` (def 3) | шапка с градиентом+заголовок, иконка info/warning, тело-сетка метрик (моб 1 кол → md repeat(columns)), опц. футер | `resources/js/Components/Ds/DsSummaryCard.vue` |
| **DsTable** | `columns` [{key,label,align,numeric,width,sortable}], `rows`, `rowKey` (def id), `expandable`, `childrenKey` (def children), `groupKey`, `defaultSortKey`, `autoSort` (def true), `mobileMode`/`mobileColumns`/`detailTitle`, `hover`, `stickyHeader`, `emptyText` | default, hover, РЕКУРСИВНАЯ вложенность N уровней (children, depth-отступ), встроенная сортировка по sortable-колонке (numeric-aware; пропускается при groupKey), строки-группы (groupKey), sticky-шапка, empty (#empty), адаптив <md (compact→деталь / scroll) | `resources/js/Components/Ds/DsTable.vue` |
| **DsModal** | `modelValue` (v-model), `title`, `size` sm\|md\|lg\|fullscreen (def md), `closeOnBackdrop` (def true), `closeOnEsc` (def true), `closable` (def true) | скрыта/показана, enter/leave (fade+pop), close hover/focus, моб fullscreen, size fullscreen | `resources/js/Components/Ds/DsModal.vue` |
| **DsFilterSheet** | `visible` (v-model:visible), `title` (def 'Фильтр'), `items` [{key,label,icon}] | full-screen лист (поверх DsModal fullscreen): шапка-градиент «← Фильтр», строки иконка+подпись+›, футер Сбросить/Фильтровать; мобильная замена тулбару фильтров | `resources/js/Components/Ds/DsFilterSheet.vue` |
| **DsStickyBar** | `mobileSticky` (def true) | панель действий снизу: десктоп — ряд в потоке; мобайл (<768) — sticky к низу вьюпорта, белый фон + верхняя граница, кнопки растягиваются | `resources/js/Components/Ds/DsStickyBar.vue` |
| **DsIconButton** | `icon` (fm-*, required), `size` md\|lg (def md), `variant` brand\|ghost (def brand), `ariaLabel` | круглая иконочная кнопка: md=40 (воронка фильтра), lg=48 (период/календарь); brand-заливка/ghost; hover, focus-visible | `resources/js/Components/Ds/DsIconButton.vue` |
| **DsSupportFooter** | `prefix`, `email`, `telegram` | подвал поддержки под таблицей/формой: префикс + email(mailto) + Telegram, центрирован, muted | `resources/js/Components/Ds/DsSupportFooter.vue` |
| **DsLoader** | `variant` inline\|overlay\|panel (def inline), `size` sm\|md\|lg (def md), `label` | спиннер загрузки (реал TableLoader/spinner-border): inline в потоке; overlay — по центру + полупрозрачная подложка над контейнером; panel — по центру блока; brand-цвет, spin-анимация | `resources/js/Components/Ds/DsLoader.vue` |
| **DsEmptyState** | `icon` (fm-* или ключ search\|attention\|rotate), `title`, `description` | пустое состояние (реал .empty_banner): иконка + заголовок + описание + опц. CTA; вкладывается в слот #empty у DsTable | `resources/js/Components/Ds/DsEmptyState.vue` |
| **DsSwitch** | `modelValue` (v-model), `disabled`, `label`, `id` | тоггл on/off (подписки/НДС/согласия): трек+костяшка, on=brand, role=switch, focus/disabled | `resources/js/Components/Ds/DsSwitch.vue` |
| **DsDateRangePicker** | `modelValue`, `presets` [{key,label}], `customKey`, `showApply`, `dropdown`, `labels` | выбор периода: пресеты (месяц/3/6/год/произвольный, active=brand+fm-check) + произвольный диапазон (2 DsInput type=date); контент для модалки/дропдауна | `resources/js/Components/Ds/DsDateRangePicker.vue` |
| **DsMultiSelectAccordion** | `modelValue` [], `options` [{id,label,sub,image,children}], `multiple` (def true), `searchable`, `showSelectAll`, `loading`, `emptyText`, `inverted` | мультивыбор: поиск, «Выбрать все» (indeterminate), счётчик «Выбрано N», опции с миниатюрой/вложенными группами; loading→DsLoader, пусто→DsEmptyState | `resources/js/Components/Ds/DsMultiSelectAccordion.vue` |
| **DsToastStack** | `toasts` [], `position` adaptive\|top\|bottom-right (def adaptive), `max` | контейнер-стек тостов (fixed, teleport body): моб сверху / десктоп снизу-справа; рендерит DsToast из массива | `resources/js/Components/Ds/DsToastStack.vue` |
| **DsSyncStatus** | `items` [{label,state}], `collapsed`, `title` | статус фоновой синхронизации: строки loading(DsLoader)/done(fm-check success)/partial(warning); сворачивается | `resources/js/Components/Ds/DsSyncStatus.vue` |
| **DsNotificationBell** | `count`, `max`, `ariaLabel` | колокол fm-bell + числовой бейдж (brand) при count>0, «N+» при превышении | `resources/js/Components/Ds/DsNotificationBell.vue` |
| **DsNotificationList** | `groups` [{date,items}] / `items` [{id,type,title,text,date,isNew}], `showMarkAll` | список уведомлений: типы (success/alert/warning + иконка), isNew-акцент, группировка по датам, mark-as-read; пусто→DsEmptyState | `resources/js/Components/Ds/DsNotificationList.vue` |
| **DsHelpMenu** | `items` [{key,label,icon,href,desc,type}] (def FAQ+Видео) | меню помощи в шапке: триггер «?» (DsIconButton ghost) + дропдаун строк faq/video | `resources/js/Components/Ds/DsHelpMenu.vue` |
| **DsProgressBar** | `value` 0-100, `tone` brand\|success\|warning\|danger (def brand), `height` | тонкая полоса прогресса (h≈2px), заливка по value% | `resources/js/Components/Ds/DsProgressBar.vue` |
| **DsFileDrop** | `files` [{name,progress,status}], `accept`, `multiple` | drag&drop зона (dashed + highlight) + список файлов со статусами и DsProgressBar | `resources/js/Components/Ds/DsFileDrop.vue` |
| **DsPricingCard** | `title`, `priceOld`, `price`, `features` [{label,enabled}], `current`, `action` (label/disabled/reason) | карточка тарифа: старая зачёркнутая + текущая цена, фичи fm-check/minus, кнопка, подсветка current | `resources/js/Components/Ds/DsPricingCard.vue` |
| **DsServiceCard** | `title`, `features`, `free`, footer-слот | карточка доп.услуги (body/features/footer, вариант free) | `resources/js/Components/Ds/DsServiceCard.vue` |
| **DsPriceToggle** | `modelValue`, `options` [{key,label,badge}] | сегментный переключатель срок оплаты (badge −10/−20%) / валюта (стиль .segment) | `resources/js/Components/Ds/DsPriceToggle.vue` |
| **DsAuthForm** | `title`, `subtitle` + слоты | каркас формы входа/регистрации: центр-карточка max-340, слоты logo/fields/actions/footer | `resources/js/Components/Ds/DsAuthForm.vue` |
| **DsFormErrors** | `errors` [], `message`, `variant` error\|success\|warning, `dismissible`, `visible` | единый блок сводки ошибок/статуса формы (унифицирует AuthErrors/ValidationErrors) | `resources/js/Components/Ds/DsFormErrors.vue` |
| **DsApiKeyField** | `marketplace` wb\|ozon, `modelValue` {clientId,apiKey}, `maskable`, `copyable`, `error`/`errorClientId` | поле(я) API-ключа (WB 1 / Ozon 2), маскирование + DsCopyButton + inline-error | `resources/js/Components/Ds/DsApiKeyField.vue` |
| **DsConnectionManager** | `state` oauth\|apiKey\|disconnected\|inactive, `marketplace`, `expiresAt`, `action`, `apiKey` | статус подключения магазина (DsNotice) + дата истечения + action-карточки | `resources/js/Components/Ds/DsConnectionManager.vue` |
| **DsStepper** | `steps` [{title,content,thumb}] | нумерованные шаги инструкции (кружок-номер + контент + thumb), вертикальный список | `resources/js/Components/Ds/DsStepper.vue` |
| **DsErrorPage** | `code`, `title`, `description` + слоты #actions/#image | каркас страницы ошибки 404/503: лого, код+заголовок, описание, действия, иллюстрация | `resources/js/Components/Ds/DsErrorPage.vue` |
| **DsServiceBanner** | `message`, `seconds`, `retryLabel`, `tone` warning\|danger | плашка «сервис недоступен» + таймер обратного отсчёта + retry | `resources/js/Components/Ds/DsServiceBanner.vue` |
| **DsPopover** | `placement`, `open` (v-model:open) | универсальный поповер (teleport): триггер + панель #content; закрытие по клику-вне/Esc | `resources/js/Components/Ds/DsPopover.vue` |
| **DsAccountMenu** | `name`, `store`, `dataSource`, `stores` [{id,name,dataSource}], `activeId` | переключатель аккаунта/магазина в топбаре: бейдж+шеврон → поповер со списком магазинов (иконка МП), Сводный дэшборд, Добавить магазин, Выйти | `resources/js/Components/Ds/DsAccountMenu.vue` |
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
- **DsFilterSheet** — без slots (строки через `items`). Emits: `update:visible`, `open(key)`, `reset`, `apply`. Доп.: `DsNotice` получил проп `collapse-mobile` (свёрнутый баннер <768px).
- **DsStickyBar** — slot: default (кнопки). Без emits.
- **DsIconButton** — без slots. Click — нативный (fallthrough на `<button>`).
- **DsSupportFooter** — без slots/emits.
- **DsLoader** — без slots/emits.
- **DsEmptyState** — slot: `action` (CTA; дефолтный слот — алиас). Без emits.
- **DsSwitch** — slots: default (подпись), `hint` (подсказка через DsTooltip). Emits: `update:modelValue`, `change`.
- **DsDateRangePicker** — без slots. Emits: `update:modelValue`, `change`, `apply`.
- **DsMultiSelectAccordion** — без slots (опции из `options`). Emits: `update:modelValue`, `change`, `search`. Композирует DsInput/DsCheckbox/DsProductCell/DsTag/DsLoader/DsEmptyState.
- **DsToastStack** — без slots (рендерит DsToast из `toasts`). Emits: `dismiss(id)`. Доп.: `DsToast` получил проп `swipe-dismiss` (закрытие свайпом вправо, порог 100px).
- **DsSyncStatus** — без slots. Emits: `toggle`. Композирует DsLoader.
- **DsNotificationBell** — без slots. Emits: `click`, `open`.
- **DsNotificationList** — без slots (данные через `groups`/`items`). Emits: `markRead(id)`, `markAllRead`. Композирует DsEmptyState.
- **DsHelpMenu** — без slots. Emits: `select(item)`. Композирует DsIconButton.
- **DsProgressBar** — без slots/emits.
- **DsFileDrop** — slot: default (подсказка зоны). Emits: `select(File[])`, `drop(File[])`, `remove(i)`. Композирует DsProgressBar.
- **DsPricingCard** — slots: `features`, `action`. Композирует DsButton/DsTag/DsTooltip.
- **DsServiceCard** — slot: `footer`. Композирует DsCard/DsButton.
- **DsPriceToggle** — без slots. Emits: `update:modelValue`, `change`.
- **DsAuthForm** — slots: `logo`, `head`, `status`, `fields`, `actions`, `footer`, `below`. Emits: `submit`. Композирует DsCard.
- **DsFormErrors** — без slots. Emits: `close`, `update:visible`.
- **DsApiKeyField** — без slots. v-model `{clientId,apiKey}`. Композирует DsInput/DsCopyButton.
- **DsConnectionManager** — без slots. v-model:action / v-model:apiKey. Композирует DsNotice/DsCard/DsButton/DsApiKeyField.
- **DsStepper** — без slots (steps; content через v-html). Композирует DsCard.
- **DsErrorPage** — slots: `actions`, `image`. Композирует DsButton.
- **DsServiceBanner** — без slots. Emits: `retry`. Композирует DsButton.
- **DsPopover** — slots: default (триггер), `content` (scoped `{ close }`). Emits: `update:open`. Expose: `close()`.
- **DsAccountMenu** — без slots. Emits: `select(store)`, `summary`, `add-store`, `logout`. Композирует DsPopover/DsAccountBadge.
- **DsInfoList** — без slots (строки через `items`). Проп `flat` — плоский список без аккордеона (сводка дашборда). `DsTag` soft-success: текст `--accent-positive` (green-600), не teal.
- **DsToast** — slots: `icon`, default. Emits: `close`, `update:visible`.
- **DsCheckbox** — slot: default. Emits: `update:modelValue`, `change`, `focus`, `blur`. Expose: `focus()`/`blur()`.
- **DsPagination** — без slots. Emits: `change(page)`.

## Согласованность именования
- Размеры: `size` sm/md/lg (Button/Input/Select-фикс), sm/md (Tag/Checkbox) — единый паттерн.
- Семантика статусов: tone/variant используют общий набор success/warning/danger/info — единообразно (Tag, Toast).
- v-model: одиночный modelValue везде; `visible` в DsToast через `v-model:visible` (осознанное, чтобы не путать с контентом).
- Token-дисциплина соблюдена во всех файлах; новых токенов не вводилось.