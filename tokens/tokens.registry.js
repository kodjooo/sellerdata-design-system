/**
 * Метаданные дизайн-токенов для страниц документации.
 *
 * Источник истины — :root в resources/scss/_variables.scss.
 * Здесь только описания на русском и группировка для UI.
 *
 * При добавлении нового токена в SCSS — добавить запись и сюда.
 */

// ─── PRIMITIVES (Tier 1) ────────────────────────────────────────────────
export const PRIMITIVES = [
    {
        group: 'Gray',
        note: 'Нейтральная шкала: фоны, бордеры, текст. От самого светлого (gray-50) до самого тёмного (gray-900).',
        tokens: [
            { name: '--white',    hex: '#FFFFFF', note: 'Чистый белый. Базовая поверхность.' },
            { name: '--gray-50',  hex: '#F9F9F9', note: 'Самый светлый — фон страницы, обёртки.' },
            { name: '--gray-100', hex: '#F6F6F6', note: 'Светлый — фон карточек, hover-состояния, дочерняя навигация.' },
            { name: '--gray-200', hex: '#F0F0F0', note: 'Бордеры карточек и разделители — самый частый цвет границы.' },
            { name: '--gray-300', hex: '#E4E5E7', note: 'Полоса range-слайдера, отключённые элементы.' },
            { name: '--gray-400', hex: '#DDDDDD', note: 'Бордеры инпутов, dashed-разделители.' },
            { name: '--gray-500', hex: '#BDBDBD', note: 'Placeholder, disabled-текст, скроллбар-thumb.' },
            { name: '--gray-600', hex: '#999999', note: 'Muted-текст: подсказки, второстепенные надписи, account-name.' },
            { name: '--gray-800', hex: '#555555', note: 'Основной body-текст, ссылки в сайдбаре.' },
            { name: '--gray-900', hex: '#232323', note: 'Заголовки, тексты с сильным акцентом.' },
            { name: '--black',    hex: '#000000', note: 'Чистый чёрный — pure strong-text, акцентные иконки.' },
        ],
    },
    {
        group: 'Blue',
        note: 'Brand-семейство. blue-600 — основной CTA.',
        tokens: [
            { name: '--blue-300', hex: '#51B1FA', note: 'Голубой — конечная точка brand-градиента, иконка "новое".' },
            { name: '--blue-600', hex: '#4154F1', note: 'Основной brand-цвет: CTA-кнопки, активные ссылки и пункты меню, фокус полей, стартовая точка brand-градиента.' },
            { name: '--blue-700', hex: '#3549EE', note: 'Hover-состояние brand-цвета.' },
        ],
    },
    {
        group: 'Red',
        note: 'Семья ошибок и опасных действий.',
        tokens: [
            { name: '--red-50',  hex: '#FEF3F2', note: 'Светлый фон ошибок (alert-блок).' },
            { name: '--red-300', hex: '#F47171', note: 'Мягкий красный — бордер инпута с ошибкой.' },
            { name: '--red-500', hex: '#EE3131', note: 'Главный danger — текст ошибок, delete-кнопки.' },
            { name: '--red-700', hex: '#B22626', note: 'Усиленный danger — для критичных алертов.' },
        ],
    },
    {
        group: 'Green',
        note: 'Аккцентный зелёный (не CTA — это $blue).',
        tokens: [
            { name: '--green-50',  hex: '#F0F7E9', note: 'Светлый фон позитивных тегов и подсказок.' },
            { name: '--green-600', hex: '#54A631', note: 'Зелёный для иконок (account, success-tag).' },
        ],
    },
    {
        group: 'Teal',
        note: 'Сине-зелёный для статуса "успех".',
        tokens: [
            { name: '--teal-500', hex: '#17B787', note: 'Status/success: подтверждения, бейджи "выполнено".' },
        ],
    },
    {
        group: 'Orange',
        note: 'Статус предупреждения. Одна ступень — warning не нуждается в шкале оттенков.',
        tokens: [
            { name: '--orange-500', hex: '#F79009', note: 'Status/warning: предупреждения, partial-состояния.' },
        ],
    },
    {
        group: 'Amber',
        note: 'Peach-палитра для notice-блоков (важные сообщения, промо-капсы). Четыре ступени для bg / border / accent / text-strong.',
        tokens: [
            { name: '--amber-50',  hex: '#FEF9EC', note: 'Notice/Bg — фон важных сообщений (peach palette).' },
            { name: '--amber-200', hex: '#FEDF89', note: 'Notice/Border — рамка peach-блока.' },
            { name: '--amber-300', hex: '#EBAA5B', note: 'Notice/Accent — иконка/акцент peach-блока.' },
            { name: '--amber-800', hex: '#93370D', note: 'Notice/Text-Strong — сильный текст в peach-блоке.' },
        ],
    },
    {
        group: 'Yellow',
        note: 'Иконки внимания (рейтинг, info, attention).',
        tokens: [
            { name: '--yellow-500', hex: '#E9C02E', note: 'Звёздочка рейтинга, .item_content_title__info, .fm-icon-attention.' },
        ],
    },
    {
        group: 'Purple',
        note: 'Фиолетовый акцент для статус-плашек.',
        tokens: [
            { name: '--purple-500', hex: '#7A5AF8', note: 'Status/attention — отдельная категория статуса (не путать с alert).' },
        ],
    },
];

// ─── CHART (отдельная палитра данных) ───────────────────────────────────
export const CHART = [
    { name: '--chart-blue',         hex: '#4E91FF', note: 'Основная серия данных (заказы).' },
    { name: '--chart-green',        hex: '#51B578', note: 'Положительная серия (продано).' },
    { name: '--chart-red',          hex: '#F55244', note: 'Отрицательная серия (возвраты, label-yes).' },
    { name: '--chart-purple-light', hex: '#99ACF6', note: 'Вторичная серия (продажи).' },
    { name: '--chart-pink',         hex: '#EF93A0', note: 'Третичная серия (прибыль).' },
];

// ─── SUMMARY (палитра шапок summary-карточек) ───────────────────────────
// Цвета подобраны вручную, тонально близкие в blue-violet семействе — НЕ
// системная шкала. Используются в .block_item_head на дашборде и складе;
// каждая секция берёт подмножество по смыслу. Не путать с --blue-* primitives.
export const SUMMARY = [
    { name: '--summary-periwinkle',  hex: '#777BFE', note: 'Светлый периwinkle: шапка карточки «Прошлый месяц» (dashboard).' },
    { name: '--summary-blue',        hex: '#6778F4', note: 'Ярко-синий: шапка карточек «Сегодня» (dashboard) и «Себестоимость» (warehouse).' },
    { name: '--summary-muted',       hex: '#757DC4', note: 'Приглушённый сине-серый: шапка карточки «Вчера» (dashboard).' },
    { name: '--summary-indigo',      hex: '#525DB5', note: 'Средний индиго: шапка карточки «Потенциальные продажи» (warehouse).' },
    { name: '--summary-indigo-deep', hex: '#4451B1', note: 'Глубокий индиго: шапка карточки «Текущий месяц» (dashboard).' },
    { name: '--summary-navy',        hex: '#15259D', note: 'Тёмный навы: шапка карточки «Потенциальная прибыль» (warehouse).' },
];

// ─── SEMANTIC (Tier 2 — алиасы) ─────────────────────────────────────────
export const SEMANTIC = [
    {
        group: 'Brand',
        tokens: [
            { name: '--brand',          ref: '--blue-600', note: 'Основной CTA: primary-кнопки, активные ссылки, фокус полей, активные табы.' },
            { name: '--brand-hover',    ref: '--blue-700', note: 'Hover для primary-кнопки.' },
            { name: '--brand-gradient', value: 'linear-gradient(92.5deg, var(--blue-600) 0.41%, var(--blue-300) 100%)', note: 'Градиент: auth-bar, шапки модалок, рекламные блоки.' },
        ],
    },
    {
        group: 'Accent',
        tokens: [
            { name: '--accent-pink',        ref: '#FF5B9C',     note: 'Акцент-розовый (бейдж «+1» промо «Пригласи друга»).' },
            { name: '--accent-positive',    ref: '--green-600', note: 'Положительный аксент (account-icon, success-tag).' },
            { name: '--accent-positive-bg', ref: '--green-50',  note: 'Светлый фон для positive-блоков.' },
        ],
    },
    {
        group: 'Status',
        tokens: [
            { name: '--status-success',       ref: '--teal-500',   note: 'Успех — подтверждения, success-блоки.' },
            { name: '--status-alert',         ref: '--yellow-500', note: 'Жёлтый алерт — иконки внимания (рейтинг, info).' },
            { name: '--status-warning',       ref: '--orange-500', note: 'Предупреждение — warning-блоки.' },
            { name: '--status-danger',        ref: '--red-500',    note: 'Опасность — текст ошибок, delete-кнопки.' },
            { name: '--status-danger-strong', ref: '--red-700',    note: 'Усиленный danger.' },
            { name: '--status-danger-bg',     ref: '--red-50',     note: 'Светлый фон danger-блока (иконка ошибки в pricing).' },
            { name: '--status-error',         ref: '--red-300',    note: 'Мягкая ошибка — бордер инпута с ошибкой.' },
            { name: '--status-attention',     ref: '--purple-500', note: 'Фиолетовый attention — особая категория статуса.' },
            { name: '--status-default',       ref: '--gray-600',   note: 'Нейтральный статус.' },
        ],
    },
    {
        group: 'Notice',
        tokens: [
            { name: '--notice-bg',          ref: '--amber-50',  note: 'Фон peach-блока (важное уведомление).' },
            { name: '--notice-border',      ref: '--amber-200', note: 'Рамка peach-блока.' },
            { name: '--notice-accent',      ref: '--amber-300', note: 'Иконка peach-блока.' },
            { name: '--notice-text-strong', ref: '--amber-800', note: 'Сильный текст в peach-блоке.' },
        ],
    },
    {
        group: 'Text',
        tokens: [
            { name: '--text-strong',      ref: '--black',    note: 'Чистый чёрный — только для исключительных случаев максимального контраста. В большинстве UI-сценариев (заголовки, лого, лейблы, бейджи) используйте --text-heading (gray-900) — он мягче и читается так же. По умолчанию --text-strong не нужен.' },
            { name: '--text-heading',     ref: '--gray-900', note: 'Заголовки и section-титулы.' },
            { name: '--text-default',     ref: '--gray-800', note: 'Основной body-текст.' },
            { name: '--text-muted',       ref: '--gray-600', note: 'Подсказки, мета-данные, второстепенные надписи.' },
            { name: '--text-placeholder', ref: '--gray-500', note: 'Текст в placeholder инпутов.' },
            { name: '--text-disabled',    ref: '--gray-500', note: 'Disabled-текст и labels.' },
            { name: '--text-on-brand',    ref: '--white',    note: 'Текст на цветном/тёмном фоне (например, на primary-кнопке).' },
        ],
    },
    {
        group: 'Surface',
        tokens: [
            { name: '--surface-default',         ref: '--white',    note: 'Фон страницы, карточек, модалок, header, sidebar.' },
            { name: '--surface-subtle',          ref: '--gray-50',  note: 'Фон auth-страниц, секций.' },
            { name: '--surface-muted',           ref: '--gray-100', note: 'Фон вложенных карточек, hover-состояния пунктов меню.' },
            { name: '--surface-disabled',       ref: '--gray-300',  note: 'Фон disabled-инпутов.' },
            { name: '--surface-scrollbar-track', ref: '--gray-100', note: 'Подложка кастомного скроллбара.' },
            { name: '--surface-scrollbar-thumb', ref: '--gray-500', note: 'Ползунок кастомного скроллбара.' },
        ],
    },
    {
        group: 'Border',
        tokens: [
            { name: '--border-default', ref: '--gray-200', note: 'Бордеры карточек, разделители.' },
            { name: '--border-input',   ref: '--gray-400', note: 'Бордеры инпутов и форм.' },
            { name: '--border-strong',  ref: '--gray-500', note: 'Усиленный бордер.' },
        ],
    },
];

// ─── SHADOWS (effect styles) ────────────────────────────────────────────
export const SHADOWS = [
    { name: '--shadow-card',        value: '0 1px 2px rgb(from var(--gray-900) r g b / 0.12)',     note: 'Тень карточек: auth-блок, info-блок.' },
    { name: '--shadow-button',      value: '0 4px 14px rgb(from var(--gray-900) r g b / 0.06)',     note: 'Тень primary-кнопки.' },
    { name: '--shadow-aside',       value: '4px 0 16px 2px rgb(from var(--gray-900) r g b / 0.03)', note: 'Тень бокового сайдбара (≥992px).' },
    { name: '--shadow-bar',         value: '0 -6px 12px rgb(from var(--gray-900) r g b / 0.06)',    note: 'Тень сверху нижнего sticky-бара действий (DsStickyBar / реал buttons-panel).' },
    { name: '--shadow-dropdown',    value: '0 4px 20px rgb(from var(--gray-900) r g b / 0.20)',     note: 'Тень дропдаунов и поповеров.' },
    { name: '--shadow-input-focus', value: '0 0 0 4px rgb(from var(--brand) r g b / 0.12)',          note: 'Фокусная "глоу"-обводка инпутов с brand-цветом.' },
    { name: '--shadow-input-focus-danger', value: '0 0 0 4px rgb(from var(--status-danger) r g b / 0.12)', note: 'Фокус-обводка инпутов с ошибкой (danger).' },
    { name: '--shadow-overlay',     value: '0 4px 12px rgb(from var(--gray-900) r g b / 0.12)',    note: 'Тень модалок/поповеров — свод повторяющейся rgba(24,39,75,.12).' },
];

// ─── SIZES (универсальная шкала отступов и размеров) ────────────────────
// Все значения кратны 2px. Имя = значение в px (--size-16 = 16px).
// Используется для padding, margin, gap, width, height, icon-size,
// avatar-size, control-height. Не путать с font-size-* (это типографика).
//
// Шаг шкалы увеличивается по мере роста значения, чтобы избежать «шумного»
// набора из 60+ ступеней:
//   • 2-12   шаг 2  — fine: gap между иконкой и текстом, padding бейджей
//   • 12-24  шаг 4  — controls: padding карточек, иконки 16/20/24
//   • 24-48  шаг 8  — components: page-padding, control-height 32/40/48
//   • 48-128 шаг 16 — layout: модалки, аватары крупные, иллюстрации
export const SIZES = [
    // ── fine ──
    { name: '--size-2',   px: 2,   tier: 'fine',      note: 'Тонкие разделители, gap между бейджем и текстом, micro-tweaks.' },
    { name: '--size-4',   px: 4,   tier: 'fine',      note: 'Gap между иконкой и текстом, padding chip\'ов, тесные inline-зазоры.' },
    { name: '--size-6',   px: 6,   tier: 'fine',      note: 'Padding мелких бейджей, gap в плотных tag-списках.' },
    { name: '--size-8',   px: 8,   tier: 'fine',      note: 'Стандартный component-gap: между кнопками в группе, padding inline-controls.' },
    { name: '--size-10',  px: 10,  tier: 'fine',      note: 'Промежуточный шаг — padding compact-кнопок, gap внутри form-row.' },
    { name: '--size-12',  px: 12,  tier: 'fine',      note: 'Gap между полями формы, padding средних карточек, gap в card-header.' },
    // ── controls ──
    { name: '--size-16',  px: 16,  tier: 'control',   note: 'База: padding карточек по умолчанию, gap между card-content блоками, размер иконок body.' },
    { name: '--size-20',  px: 20,  tier: 'control',   note: 'Padding крупных карточек, gap между секциями виджета, средний размер иконок.' },
    { name: '--size-24',  px: 24,  tier: 'control',   note: 'Padding модалок, крупный gap между группами, средний avatar/icon size.' },
    // ── components ──
    { name: '--size-32',  px: 32,  tier: 'component', note: 'Page-padding mobile, gap между секциями страницы, control-height (compact button/input).' },
    { name: '--size-40',  px: 40,  tier: 'component', note: 'Page-padding planshet, высота medium-control (default button/input).' },
    { name: '--size-48',  px: 48,  tier: 'component', note: 'Top-padding desktop, touch-target / large-control height, avatar-medium.' },
    // ── layout ──
    { name: '--size-64',  px: 64,  tier: 'layout',    note: 'Avatar-large, large badge, top-section padding desktop.' },
    { name: '--size-80',  px: 80,  tier: 'layout',    note: 'Avatar-XL, gap между крупными секциями лендинга.' },
    { name: '--size-96',  px: 96,  tier: 'layout',    note: 'Hero-illustration, modal-compact width.' },
    { name: '--size-128', px: 128, tier: 'layout',    note: 'Modal-medium width, крупные иллюстрации.' },
];

// ─── RADII (скругление углов) ───────────────────────────────────────────
// Минимальная шкала. Все скаляры кратны 4px (-> кратны 2px).
// `full` — semantic «полностью скруглить» (pills, бейджи, круги при w=h).
// Для острых углов используйте сырой `0`, отдельный токен не вводим.
export const RADII = [
    { name: '--radius-sm',   value: '4px',    note: 'Кнопки (.btn-regular/.btn-default), теги, small inputs, плотные chip\'ы. Радиус КНОПОК = sm.' },
    { name: '--radius-md',   value: '8px',    note: '⭐ Default — карточки, модалки, шапки виджетов, контейнеры-селекты. Также тулбар/фильтр-кнопки (Фильтр/Сбросить/селекты) = md, в отличие от primary-кнопок (--radius-sm). По умолчанию для контейнеров.', isDefault: true },
    { name: '--radius-lg',   value: '12px',   note: 'Крупные контейнеры: table_outer/панели данных, карточки настроек и тарифов, лендинг-блоки, notice-блоки. Калибровка ЛК: 10/16px → 12.' },
    { name: '--radius-full', value: '9999px', note: 'Semantic «полностью скруглить» — pills, бейджи-таблетки, круглые аватары (при равных width = height).' },
];

// ─── TYPOGRAPHY ─────────────────────────────────────────────────────────
//
// Шкала: 6 размеров (36 / 24 / 20 / 16 / 13 / 11), 9 стилей.
// Якоря — 16px (база/body) и 13px (компакт/label).
//
// Title и Body делят 16px-базу, различаются только весом (700 vs 400).
// Label и Body/S делят 13px-базу (600 vs 400).
//
// Line-height baked-in под доминирующий контекст роли:
//   • Display / Heading / Title / Label / Caption / Button — tight 1.2 (одна строка)
//   • Body / L, Body / S — relaxed 1.5 (многострочный текст)
// В плотном UI (сайдбар, dropdown, dense таблицы) line-height
// переопределяется на контейнере, а не отдельным text-style.
//
// Текст образцов унифицирован: для всех стилей используется одна и та же
// короткая фраза (SAMPLE_SHORT) и один и тот же абзац (SAMPLE_LONG).
// Это даёт честное визуальное сравнение размеров и весов между ролями.
//
// Классический русский панграмм (все 33 буквы алфавита) + английский pangram —
// тот же приём, что использует Google Fonts: одна и та же узнаваемая фраза
// для всех стилей, чтобы взгляд сравнивал только типографику.
const SAMPLE_SHORT = 'В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!';
const SAMPLE_LONG  = 'В чащах юга жил бы цитрус? Да, но фальшивый экземпляр! Съешь же ещё этих мягких французских булок, да выпей чаю. The quick brown fox jumps over the lazy dog — 0123456789.';

export const TEXT_STYLES = [
    {
        group: 'Display',
        styles: [
            {
                figmaName: 'Display', cssClass: 't-display-xl',
                size: '36px', weight: 600, lineHeight: 1.2,
                short: SAMPLE_SHORT, long: SAMPLE_LONG,
                when: 'Hero-заголовки на лендинге, страницы подключения, 503/404, success-страницы.',
            },
        ],
    },
    {
        group: 'Heading',
        styles: [
            {
                figmaName: 'Heading / L', cssClass: 't-heading-l',
                size: '24px', weight: 600, lineHeight: 1.2,
                short: SAMPLE_SHORT, long: SAMPLE_LONG,
                when: 'Заголовки крупных секций на странице, лендинг, заголовки верхнего уровня (24px). НЕ шапки модалок — там t-title-m (16/700).',
            },
            {
                figmaName: 'Heading / M', cssClass: 't-heading-m',
                size: '20px', weight: 600, lineHeight: 1.2,
                short: SAMPLE_SHORT, long: SAMPLE_LONG,
                when: 'Заголовки карточек, панелей, подсекций, разделов настроек, подсекций модалок.',
            },
        ],
    },
    {
        group: 'Title',
        styles: [
            {
                figmaName: 'Title', cssClass: 't-title-m',
                size: '16px', weight: 700, lineHeight: 1.2,
                short: SAMPLE_SHORT, long: SAMPLE_LONG,
                when: 'Page title в шапке приложения И шапки модалок (.modal-title 16/700), особо важные заголовки. Bold 700 на той же 16px-базе что и Body.',
            },
        ],
    },
    {
        group: 'Body',
        note: 'Line-height по умолчанию relaxed 1.5 — для многострочных параграфов. В плотном UI (сайдбар, dropdown, dense таблицы) переопределяйте line-height на контейнере, а не вводите отдельный text-style.',
        styles: [
            {
                figmaName: 'Body / L', cssClass: 't-body-l',
                size: '16px', weight: 400, lineHeight: 1.5,
                short: SAMPLE_SHORT, long: SAMPLE_LONG,
                when: 'НЕ дефолт ЛК. Только тело модалок, описания продуктов, лендинг, крупные многострочные параграфы. Для рабочих экранов кабинета (таблицы/формы/панели) — НЕ использовать, там база 13px (t-body-s).',
            },
            {
                figmaName: 'Body / S', cssClass: 't-body-s',
                size: '13px', weight: 400, lineHeight: 1.5,
                short: SAMPLE_SHORT, long: SAMPLE_LONG,
                when: '⭐ ФАКТИЧЕСКИЙ body плотных экранов ЛК (дашборд, таблицы, формы, навигация, кнопки) — основной размер интерфейса. Также helper-текст под инпутами, подсказки в дропдаунах. В плотных списках line-height переопределяйте на контейнере (1.2-1.4).',
            },
        ],
    },
    {
        group: 'Label',
        styles: [
            {
                figmaName: 'Label', cssClass: 't-label-m',
                size: '13px', weight: 600, lineHeight: 1.2,
                short: SAMPLE_SHORT, long: SAMPLE_LONG,
                when: 'Status-теги, бейджи, account-name, badges с акцентом.',
            },
        ],
    },
    {
        group: 'Other',
        styles: [
            {
                figmaName: 'Caption', cssClass: 't-caption',
                size: '11px', weight: 400, lineHeight: 1.2,
                short: SAMPLE_SHORT, long: SAMPLE_LONG,
                when: 'Подписи под иконками, notification counters, маленькие круглые бейджи, дата-метки, мета-надписи.',
            },
            {
                figmaName: 'Button / CTA', cssClass: 't-button-cta',
                size: '16px', weight: 600, lineHeight: 1.2,
                short: SAMPLE_SHORT, long: SAMPLE_LONG,
                when: 'Uppercase-кнопки, главные CTA с заглавным написанием.',
            },
        ],
    },
];

// ─── LINE-HEIGHT TIERS ──────────────────────────────────────────────────
export const LINE_HEIGHTS = [
    { name: '--line-height-tight',   value: 1.2, note: 'Tight — для UI в одну строку: заголовки, теги, кнопки, навигация.' },
    { name: '--line-height-normal',  value: 1.4, note: 'Normal — для коротких многострочных текстов: card-headers с подписью.' },
    { name: '--line-height-relaxed', value: 1.5, note: 'Relaxed — для длинных параграфов и описаний.' },
];

// ─── NOTICE / ERROR (доп. семантика) ────────────────────────────────────
export const NOTICE_EXTRA = [
    { name: '--notice-success-bg',   ref: 'rgb(from var(--green-600) r g b / 0.12)', note: 'Фон зелёного success-notice.' },
    { name: '--notice-success-text', ref: '--green-600', note: 'Текст зелёного success-notice.' },
    { name: '--notice-success-border', ref: 'rgb(from var(--green-600) r g b / 0.30)', note: 'Рамка зелёного success-notice (DsNotice tone=success).' },
    { name: '--notice-info-bg',      ref: 'rgb(from var(--blue-300) r g b / 0.12)', note: 'Фон голубого info-notice.' },
    { name: '--notice-info-border',  ref: '--blue-300', note: 'Рамка голубого info-notice.' },
    { name: '--border-error',        ref: '--red-300', note: 'Бордер инпута/контрола с ошибкой.' },
    { name: '--text-error',          ref: '--red-500', note: 'Текст ошибки под полем.' },
];

// ─── OPACITY ────────────────────────────────────────────────────────────
// Семантическая шкала непрозрачности. Своды из аудита: .55→.4, .50→.5, .2→.3.
export const OPACITY = [
    { name: '--opacity-full',     value: '1',   note: 'Непрозрачно (start/end transition).' },
    { name: '--opacity-hover',    value: '0.7', note: 'Hover-затемнение.' },
    { name: '--opacity-muted',    value: '0.5', note: 'Приглушённый контент.' },
    { name: '--opacity-disabled', value: '0.4', note: 'Disabled-элементы.' },
    { name: '--opacity-faint',    value: '0.3', note: 'Очень бледный.' },
    { name: '--opacity-hidden',   value: '0',   note: 'Скрыто (start/end transition).' },
];

// ─── MOTION (transition / easing / duration) ────────────────────────────
export const MOTION = [
    { name: '--transition-fast',   value: '150ms', note: 'Мелкие контролы: hover/focus.' },
    { name: '--transition-base',   value: '200ms', note: 'Стандарт: кнопки, инпуты, табы.' },
    { name: '--transition-slow',   value: '300ms', note: 'Панели, модалки, аккордеоны.' },
    { name: '--ease-standard',     value: 'ease-in-out', note: 'Дефолтный easing (доминирует).' },
    { name: '--ease-emphasized',   value: 'ease',        note: 'Альтернативный easing.' },
    { name: '--ease-linear',       value: 'linear',      note: 'Спиннеры, прогресс.' },
    { name: '--duration-spin',     value: '1.2s', note: 'Спиннеры (общий @keyframes spin).' },
    { name: '--duration-skeleton', value: '2s',   note: 'Skeleton-shimmer.' },
];

// ─── Z-INDEX (шкала слоёв) ──────────────────────────────────────────────
// Запрет на сырые числа. Замена зоопарка 1…100000 и bootstrap-слоёв.
export const ZINDEX = [
    { name: '--z-below',    value: '-1',         note: 'Под потоком (декор, ::before).' },
    { name: '--z-base',     value: '0',          note: 'Базовый поток.' },
    { name: '--z-raised',   value: '1',          note: 'Приподнятый элемент.' },
    { name: '--z-raised-2', value: '2',          note: 'Второй уровень.' },
    { name: '--z-sticky',   value: '10',         note: 'Sticky-шапки/колонки таблиц.' },
    { name: '--z-dropdown', value: '1000',       note: 'Дропдауны/селекты.' },
    { name: '--z-fixed',    value: '1030',       note: 'Фикс. шапки/сайдбары.' },
    { name: '--z-overlay',  value: '1040',       note: 'Backdrop модалок.' },
    { name: '--z-modal',    value: '1050',       note: 'Модалки.' },
    { name: '--z-popover',  value: '1060',       note: 'Поповеры.' },
    { name: '--z-toast',    value: '1080',       note: 'Тосты.' },
    { name: '--z-tooltip',  value: '1090',       note: 'Тултипы.' },
    { name: '--z-max',      value: '2147483647', note: 'Крайний случай.' },
];

// ─── CONTROL HEIGHT ─────────────────────────────────────────────────────
// Высота интерактивных контролов. Закрывает разнобой 38/42px.
export const CONTROL_HEIGHTS = [
    { name: '--control-height-sm', ref: '--size-32', note: '32 — compact кнопки/инпуты.' },
    { name: '--control-height-md', ref: '--size-40', note: '40 — default кнопки/инпуты.' },
    { name: '--control-height-lg', ref: '--size-48', note: '48 — large CTA / touch-target.' },
];

// ─── BREAKPOINTS (SCSS — источник resources/scss/_responsive.scss) ──────
// Не CSS-токены: var() не работает в @media. Использовать через mixin
// respond-to() (@use 'responsive' as *). Mobile-first.
export const BREAKPOINTS = [
    { name: '$bp-sm',  value: '576px',  note: 'Телефон → планшет.' },
    { name: '$bp-md',  value: '768px',  note: 'Планшет (главный брейк).' },
    { name: '$bp-lg',  value: '992px',  note: 'Десктоп / показ сайдбара.' },
    { name: '$bp-xl',  value: '1200px', note: 'Широкий десктоп.' },
    { name: '$bp-xxl', value: '1400px', note: 'Очень широкий (опционально).' },
];

// ─── ПРОЧЕЕ ─────────────────────────────────────────────────────────────
export const MISC = [
    { name: '--border-width-accent', value: '3px', note: 'Толщина акцент-полосы (активный таб и т.п.).' },
];
