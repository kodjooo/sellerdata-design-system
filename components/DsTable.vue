<script setup>
/**
 * DsTable — плотная таблица данных дизайн-системы. ГЛАВНЫЙ компонент.
 *
 * Канон: docs/design-system-canon.md → разделы «Table», «table-specific exceptions»,
 *   «Многоколоночные таблицы данных» и «Адаптивность».
 * Эталоны: docs/reference/screens/склад__список@wb.png (плотная многоколоночная,
 *   переносные th, узкие числовые колонки, бейджи/инпуты в ячейках, раскрытие FBO/FBS),
 *   docs/reference/screens/товары__список@wb.png (ячейка товара с картинкой/ID),
 *   docs/reference/screens/расходы__список@wb.png (sticky-шапка, hover строки, total-строки).
 * Образец-паттерн: resources/js/Pages/DesignSystem/WarehouseDemo.vue.
 *
 * Плотность (table-specific exceptions):
 *   - padding ячеек --size-6/--size-8 (~5px по горизонтали);
 *   - заголовки th ПЕРЕНОСЯТСЯ (white-space:normal, vertical-align:top);
 *   - числовые колонки узкие (--size-80);
 *   - значения td — nowrap;
 *   - sticky-шапка (--z-sticky), hover строки (--surface-subtle).
 *
 * Адаптив <md, два режима (проп mobileMode):
 *   'cards'   (default) — узкие таблицы → карточки (data-title из column.label + td::before).
 *   'compact' — широкие таблицы (10+ колонок, эталон Склада): остаётся ТАБЛИЦЕЙ, видны
 *               только колонки из mobileColumns + служебная кнопка → «Подробнее», которая
 *               открывает fullscreen деталь-модалку со ВСЕМИ полями (label: value).
 *   Канон: docs/design-system-canon.md → «Широкие таблицы (10+ колонок) на мобайле».
 *   Эталоны: docs/reference/screens/_live__склад__мобайл-список.png, _live__склад__мобайл-деталь.png.
 * БЕЗ столбца «Действия» по умолчанию.
 *
 * Слоты:
 *   #cell-<key>     — кастом ячейки (бейджи, инпуты, ячейка товара).
 *                     Биндинги: { row, value, column, index }. Переиспользуется и
 *                     в деталь-модалке как значение поля.
 *   #head-<key>     — кастом заголовка колонки.
 *   #expanded       — содержимое раскрытой строки (props.expandable).
 *                     Биндинги: { row, index }. Растягивается на все колонки.
 *   #empty          — содержимое при пустом наборе строк.
 *   #detail-header  — (compact) шапка деталь-модалки (картинка/id/цена). Биндинги: { row }.
 *   #detail-footer  — (compact) футер деталь-модалки (кнопки). Биндинги: { row, close }.
 */
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import DsModal from './DsModal.vue';

const props = defineProps({
    // Описание колонок.
    //   key      — ключ поля в строке (и имя слота #cell-<key>);
    //   label    — заголовок th (и data-title для мобильных карточек);
    //   align    — 'left' | 'center' | 'right' (по умолчанию left, для numeric → right);
    //   numeric  — узкая числовая колонка (--size-80, выравнивание вправо);
    //   width    — явная ширина колонки (значение из шкалы --size-* через var()).
    columns: {
        type: Array,
        default: () => [],
    },
    // Данные строк (массив объектов).
    rows: {
        type: Array,
        default: () => [],
    },
    // Ключ-идентификатор строки (для :key и состояния раскрытия).
    rowKey: {
        type: String,
        default: 'id',
    },
    // Включает раскрываемые строки (слот #expanded или поле children).
    expandable: {
        type: Boolean,
        default: false,
    },
    // Имя поля строки с дочерними строками (рендерятся при раскрытии).
    childrenKey: {
        type: String,
        default: 'children',
    },
    // Hover-подсветка строк.
    hover: {
        type: Boolean,
        default: true,
    },
    // Sticky-шапка таблицы.
    stickyHeader: {
        type: Boolean,
        default: true,
    },
    // Текст-заглушка при пустом наборе (если не передан слот #empty).
    emptyText: {
        type: String,
        default: 'Нет данных',
    },
    // Поведение на <md:
    //   'cards'   — узкие таблицы → карточки;
    //   'compact' — широкие → фикс-таблица (приоритетные колонки) + деталь-модалка;
    //   'scroll'  — сложные/вложенные (как Реклама) → таблица остаётся, скроллится
    //               по горизонтали, sticky-колонка → с кнопкой «деталь» открывает модалку.
    mobileMode: {
        type: String,
        default: 'cards',
        validator: (v) => ['cards', 'compact', 'scroll'].includes(v),
    },
    // (compact) ключи колонок, видимых на <md. Остальные скрыты, доступны в деталь-модалке.
    mobileColumns: {
        type: Array,
        default: () => [],
    },
    // (compact) заголовок деталь-модалки (если не задан — берётся первая колонка строки).
    detailTitle: {
        type: String,
        default: '',
    },
    // Колонка, по которой сортировка активна изначально (key из columns с sortable).
    defaultSortKey: {
        type: String,
        default: '',
    },
    // Рисовать ли служебную деталь-колонку «→» и деталь-модалку в compact/scroll.
    // Отключить, если у страницы уже есть своя колонка-«Инфо» (чтобы не дублировать).
    mobileDetail: {
        type: Boolean,
        default: true,
    },
    // Имя поля строки, помечающего её как строку-ГРУППУ (агрегат при группировке).
    // Такие строки получают класс ds-table__row--group (жирные).
    groupKey: {
        type: String,
        default: '',
    },
    // Встроенная сортировка строк по активной колонке. Пропускается для группированных
    // таблиц (groupKey) — там порядок строк значим (итоги/секции). false → контролируемый
    // режим (только эмит 'sort', порядок задаёт родитель).
    autoSort: {
        type: Boolean,
        default: true,
    },
});

// Является ли строка группой (по полю groupKey).
function isGroupRow(row) {
    return !!(props.groupKey && row && row[props.groupKey]);
}

const emit = defineEmits(['row-click', 'toggle-expand', 'row-detail', 'sort']);

// ─── Сортировка (визуальная + событие) ─────────────────────────────
// Колонка с `sortable: true` получает кликабельный заголовок с кареткой.
const sortKey = ref(props.defaultSortKey);
const sortDesc = ref(true);
function toggleSort(column) {
    if (!column.sortable) return;
    if (sortKey.value === column.key) {
        sortDesc.value = !sortDesc.value;
    } else {
        sortKey.value = column.key;
        sortDesc.value = true;
    }
    emit('sort', { key: sortKey.value, desc: sortDesc.value });
}

// Состояние раскрытия по ключу строки.
const expandedKeys = ref(new Set());

function keyOf(row, index) {
    const k = row?.[props.rowKey];
    return k === undefined || k === null ? index : k;
}
function toggleKey(key) {
    const next = new Set(expandedKeys.value);
    next.has(key) ? next.delete(key) : next.add(key);
    expandedKeys.value = next;
    emit('toggle-expand', { key, expanded: next.has(key) });
}

// Есть ли у строки дочерние строки.
function childrenOf(row) {
    const ch = row?.[props.childrenKey];
    return Array.isArray(ch) ? ch : [];
}

// Числовое значение ячейки для сортировки (поддержка «440,00 ₽», «1 234», «12 %»).
function sortValue(row, key, numeric) {
    const raw = row?.[key];
    if (numeric) {
        const n = parseFloat(String(raw ?? '').replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, ''));
        return Number.isNaN(n) ? -Infinity : n;
    }
    return String(raw ?? '').toLowerCase();
}

// Верхний уровень строк с учётом встроенной сортировки. Для группированных таблиц
// (groupKey) порядок не трогаем — там секции/итоги значимы.
const sortedTop = computed(() => {
    if (!props.autoSort || !sortKey.value || props.groupKey) return props.rows;
    const col = props.columns.find((c) => c.key === sortKey.value);
    const numeric = !!col?.numeric;
    const dir = sortDesc.value ? -1 : 1;
    return [...props.rows].sort((a, b) => {
        const va = sortValue(a, sortKey.value, numeric);
        const vb = sortValue(b, sortKey.value, numeric);
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
    });
});

// Плоский список видимых строк с глубиной — поддержка РЕКУРСИВНОЙ вложенности
// (кампания → товар → дата → площадка и т.п.). Видны только потомки, у которых
// раскрыты все предки.
const flatRows = computed(() => {
    const out = [];
    let auto = 0;
    const walk = (list, depth) => {
        for (const row of list) {
            let key = row?.[props.rowKey];
            if (key === undefined || key === null) key = `auto-${auto++}`;
            const kids = childrenOf(row);
            const expanded = expandedKeys.value.has(key);
            out.push({ row, key, depth, hasChildren: kids.length > 0, expanded });
            if (kids.length && expanded) walk(kids, depth + 1);
        }
    };
    walk(sortedTop.value, 0);
    return out;
});

// Кол-во колонок (для colspan пустого состояния; +1 на служебную деталь-колонку).
const colCount = computed(() => props.columns.length + (showAutoDetail.value ? 1 : 0));

// Выравнивание ячейки: numeric → right, иначе column.align или left.
function alignOf(column) {
    if (column.align) return column.align;
    return column.numeric ? 'right' : 'left';
}

/* ─── Режимы мобайла ────────────────────────────────────────────── */
const isCompact = computed(() => props.mobileMode === 'compact');
const isScroll = computed(() => props.mobileMode === 'scroll');
// Оба режима показывают служебную колонку «деталь» и рендерят деталь-модалку.
const hasDetail = computed(() => isCompact.value || isScroll.value);
// Реально рисуем авто-деталь-колонку только если страница не отключила её (mobileDetail).
const showAutoDetail = computed(() => hasDetail.value && props.mobileDetail);

// Реактивный флаг «мобайл» (<md). На мобайле в compact-режиме НЕ подставляем
// фиксированную column.width — иначе таблица переполняет экран. Брейкпоинт
// совпадает с respond-below(md) из _responsive.scss (max-width: 767.98px).
const isMobile = ref(false);
let mql = null;
function syncMobile(e) {
    isMobile.value = e.matches;
}
onMounted(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    mql = window.matchMedia('(max-width: 767.98px)');
    isMobile.value = mql.matches;
    mql.addEventListener('change', syncMobile);
});
onBeforeUnmount(() => {
    if (mql) mql.removeEventListener('change', syncMobile);
});

// Inline-ширина колонки: фиксируем только на десктопе. В compact-режиме на
// мобайле ширину задаёт CSS (table-layout:fixed), а не column.width.
function widthStyle(column) {
    if (!column.width) return null;
    if (isCompact.value && isMobile.value) return null;
    return { width: column.width };
}

// Множество ключей видимых на <md колонок (для CSS-скрытия остальных).
const mobileColSet = computed(() => new Set(props.mobileColumns));
function isMobileHidden(column) {
    if (!isCompact.value || !props.mobileColumns.length) return false;
    return !mobileColSet.value.has(column.key);
}

// Деталь-модалка: список полей. Если есть слот #detail-header (шапка товара
// с лид-колонкой), исключаем первую колонку из списка, чтобы не дублировать.
const slots = useSlots();
const detailColumns = computed(() =>
    slots['detail-header'] && props.columns.length ? props.columns.slice(1) : props.columns
);
const detailOpen = ref(false);
const detailRow = ref(null);
function openDetail(row) {
    detailRow.value = row;
    detailOpen.value = true;
    emit('row-detail', row);
}
const detailHeading = computed(() => {
    if (props.detailTitle) return props.detailTitle;
    const first = props.columns[0];
    return first && detailRow.value ? detailRow.value[first.key] : '';
});

// Программный доступ: открыть деталь-модалку строки (например, ссылкой
// «Подробнее» на десктопе). Деталь-модалка рендерится только в compact-режиме.
defineExpose({ openDetail });
</script>

<template>
    <div
        class="ds-table-wrap"
        :class="{
            'ds-table-wrap--sticky': stickyHeader,
            'ds-table-wrap--compact': isCompact,
            'ds-table-wrap--scroll': isScroll,
        }"
    >
        <table class="ds-table">
            <thead class="ds-table__head">
                <tr>
                    <th
                        v-for="column in columns"
                        :key="column.key"
                        class="ds-table__th"
                        :class="[
                            `ds-table__th--${alignOf(column)}`,
                            {
                                'ds-table__th--numeric': column.numeric,
                                'ds-table__cell--mobile-hidden': isMobileHidden(column),
                            },
                        ]"
                        :style="widthStyle(column)"
                        scope="col"
                    >
                        <button
                            v-if="column.sortable"
                            type="button"
                            class="ds-table__sort"
                            :class="{ 'is-active': sortKey === column.key }"
                            @click.stop="toggleSort(column)"
                        >
                            <slot :name="`head-${column.key}`" :column="column">{{ column.label }}</slot>
                            <span
                                class="ds-table__caret"
                                :class="{ 'is-active': sortKey === column.key, 'is-asc': sortKey === column.key && !sortDesc }"
                                aria-hidden="true"
                            >▾</span>
                        </button>
                        <slot v-else :name="`head-${column.key}`" :column="column">
                            {{ column.label }}
                        </slot>
                    </th>
                    <!-- Служебная колонка «Подробнее» (compact/scroll, видна на <md) -->
                    <th v-if="showAutoDetail" class="ds-table__th ds-table__th--detail" aria-hidden="true"></th>
                </tr>
            </thead>

            <tbody class="ds-table__body">
                <!-- Пустое состояние -->
                <tr v-if="!rows.length" class="ds-table__row ds-table__row--empty">
                    <td class="ds-table__td ds-table__empty" :colspan="colCount">
                        <slot name="empty">{{ emptyText }}</slot>
                    </td>
                </tr>

                <template
                    v-for="r in flatRows"
                    :key="r.key"
                >
                    <!-- Строка (любой уровень вложенности) -->
                    <tr
                        class="ds-table__row"
                        :class="{
                            'ds-table__row--hover': hover,
                            'ds-table__row--expandable': r.hasChildren,
                            'ds-table__row--child': r.depth > 0,
                            'ds-table__row--group': isGroupRow(r.row),
                            'is-expanded': r.expanded,
                        }"
                        @click="emit('row-click', { row: r.row })"
                    >
                        <td
                            v-for="(column, colIndex) in columns"
                            :key="column.key"
                            class="ds-table__td"
                            :class="[
                                `ds-table__td--${alignOf(column)}`,
                                {
                                    'ds-table__td--numeric': column.numeric,
                                    'ds-table__cell--mobile-hidden': isMobileHidden(column),
                                },
                            ]"
                            :data-title="column.label"
                        >
                            <!-- Триггер раскрытия в первой колонке (отступ по глубине) -->
                            <span v-if="colIndex === 0 && expandable" class="ds-table__lead" :style="r.depth ? { paddingLeft: `calc(var(--size-16) * ${r.depth})` } : null">
                                <button
                                    v-if="r.hasChildren"
                                    type="button"
                                    class="ds-table__expand"
                                    :aria-expanded="r.expanded"
                                    aria-label="Раскрыть строку"
                                    @click.stop="toggleKey(r.key)"
                                >
                                    <svg class="ds-table__chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                                        <path d="M4 2.5 7.5 6 4 9.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </button>
                                <span v-else class="ds-table__expand-spacer" aria-hidden="true"></span>
                                <span class="ds-table__lead-content">
                                    <slot
                                        :name="`cell-${column.key}`"
                                        :row="r.row"
                                        :value="r.row[column.key]"
                                        :column="column"
                                        :depth="r.depth"
                                    >{{ r.row[column.key] }}</slot>
                                </span>
                            </span>

                            <!-- Обычная ячейка -->
                            <slot
                                v-else
                                :name="`cell-${column.key}`"
                                :row="r.row"
                                :value="r.row[column.key]"
                                :column="column"
                                :depth="r.depth"
                            >{{ r.row[column.key] }}</slot>
                        </td>

                        <!-- Служебная ячейка «Подробнее» (compact/scroll, видна на <md) -->
                        <td v-if="showAutoDetail" class="ds-table__td ds-table__td--detail">
                            <button
                                type="button"
                                class="ds-table__detail-btn"
                                aria-label="Подробнее"
                                @click.stop="openDetail(r.row)"
                            >
                                <svg width="16" height="16" viewBox="0 0 12 12" aria-hidden="true">
                                    <path d="M4 2.5 7.5 6 4 9.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </td>
                    </tr>

                </template>
            </tbody>
        </table>
    </div>

    <!-- ─── Деталь-модалка (compact/scroll): все поля строки label: value ─ -->
    <DsModal
        v-if="showAutoDetail"
        v-model="detailOpen"
        size="fullscreen"
        :title="detailHeading"
    >
        <!-- Шапка товара (картинка/id/цена) — опциональна -->
        <div v-if="$slots['detail-header'] && detailRow" class="ds-table-detail__header">
            <slot name="detail-header" :row="detailRow" />
        </div>

        <!-- Список всех полей: label → значение (через слот #cell-<key>, если есть) -->
        <dl v-if="detailRow" class="ds-table-detail__list">
            <div
                v-for="(column, index) in detailColumns"
                :key="column.key"
                class="ds-table-detail__field"
            >
                <dt class="t-caption ds-table-detail__label">{{ column.label }}</dt>
                <dd class="t-body-s ds-table-detail__value">
                    <slot
                        :name="`cell-${column.key}`"
                        :row="detailRow"
                        :value="detailRow[column.key]"
                        :column="column"
                        :index="index"
                    >{{ detailRow[column.key] }}</slot>
                </dd>
            </div>
        </dl>

        <template v-if="$slots['detail-footer']" #footer>
            <slot name="detail-footer" :row="detailRow" :close="() => (detailOpen = false)" />
        </template>
    </DsModal>
</template>

<style lang="scss" scoped>
@use 'responsive' as *;

/* ─── Обёртка: горизонтальный скролл при многоколоночности ─────── */
.ds-table-wrap {
    width: 100%;
    overflow-x: auto;
    overflow-y: auto;
    scrollbar-color: var(--surface-scrollbar-thumb) var(--surface-scrollbar-track);
}

/* ─── Таблица ─────────────────────────────────────────────────── */
.ds-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface-default);
    color: var(--text-default);
}

/* Ячейки: плотный паддинг (table-specific exceptions, ~5px по горизонтали). */
.ds-table__th,
.ds-table__td {
    padding: var(--size-6) var(--size-8);
    border-bottom: 1px solid var(--border-default);
    line-height: var(--line-height-tight);
}

/* ─── Заголовки: переносятся, мутеный 13/400, выравнивание сверху ─ */
.ds-table__th {
    /* Шапка чуть выше по вертикали, чем тело. */
    padding-top: var(--size-8);
    padding-bottom: var(--size-8);
    background: var(--surface-default);
    color: var(--text-default);          /* real th: #555 = --text-default (не muted) */
    font-size: var(--font-size-body-s);
    font-weight: var(--font-weight-regular);
    text-align: left;
    /* Многоколоночные таблицы: заголовки ПЕРЕНОСИМ в 2–3 строки. */
    white-space: normal;
    vertical-align: top;
}
.ds-table__th--center { text-align: center; }
.ds-table__th--right { text-align: right; }
/* Числовые колонки — узкие за счёт переноса заголовка. */
.ds-table__th--numeric { width: var(--size-80); }

/* ─── Сортируемый заголовок: кликабельный, с кареткой ─────────── */
.ds-table__sort {
    display: inline-flex;
    align-items: center;
    gap: var(--size-4);
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: inherit;
    cursor: pointer;
}
.ds-table__th--numeric .ds-table__sort,
.ds-table__th--right .ds-table__sort { flex-direction: row; }
.ds-table__sort:hover { color: var(--brand); }
.ds-table__caret {
    flex: 0 0 auto;
    font-size: 10px;
    line-height: 1;
    color: var(--text-placeholder);
    transition: color var(--transition-fast) var(--ease-standard), transform var(--transition-fast) var(--ease-standard);
}
.ds-table__caret.is-active { color: var(--brand); }
.ds-table__caret.is-asc { transform: rotate(180deg); }

/* ─── Sticky-шапка ────────────────────────────────────────────── */
.ds-table-wrap--sticky .ds-table__head .ds-table__th {
    position: sticky;
    top: var(--ds-table-sticky-top, 0);
    z-index: var(--z-sticky);
}

/* ─── Тело: значения в одну строку, hover ─────────────────────── */
.ds-table__td {
    font-size: var(--font-size-body-s);
    color: var(--text-default);
    vertical-align: middle;
    white-space: nowrap;
}
.ds-table__td--center { text-align: center; }
.ds-table__td--right { text-align: right; }

.ds-table__row {
    transition: background-color var(--transition-fast) var(--ease-standard);
}
.ds-table__row--hover:hover { background: var(--surface-subtle); }
.ds-table__row--expandable { cursor: pointer; }
.ds-table__body .ds-table__row:last-child .ds-table__td { border-bottom: 0; }

/* Дочерние строки раскрытия — подложка subtle. */
.ds-table__row--child > .ds-table__td { background: var(--surface-subtle); }

/* Строка-группа (агрегат при группировке) — как обычная строка (реал: вес 400),
   отличается лишь раскрытием/именем группы. Класс — семантический хук без эмфазы. */
.ds-table__row--group > .ds-table__td { color: var(--text-heading); }

/* ─── Лид-ячейка с триггером раскрытия ────────────────────────── */
.ds-table__lead {
    display: inline-flex;
    align-items: flex-start;
    gap: var(--size-8);
    min-width: 0;
}
.ds-table__lead-content { min-width: 0; }
.ds-table__expand,
.ds-table__expand-spacer {
    flex: 0 0 var(--size-20);
    width: var(--size-20);
    height: var(--size-20);
}
.ds-table__expand {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: color var(--transition-fast) var(--ease-standard);
}
.ds-table__expand:hover { color: var(--brand); }
.ds-table__expand:focus-visible { box-shadow: var(--shadow-input-focus); outline: none; }
.ds-table__chevron { transition: transform var(--transition-fast) var(--ease-standard); }
.ds-table__row.is-expanded .ds-table__expand { color: var(--brand); }
.ds-table__row.is-expanded .ds-table__chevron { transform: rotate(90deg); }

/* ─── Раскрытое содержимое (слот #expanded) ───────────────────── */
.ds-table__detail { background: var(--surface-subtle); white-space: normal; }

/* ─── Compact: служебная колонка «Подробнее» — только на <md ───── */
.ds-table__th--detail,
.ds-table__td--detail {
    display: none;
    width: var(--size-40);
    text-align: center;
}
.ds-table__detail-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--control-height-sm);
    height: var(--control-height-sm);
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--brand);
    cursor: pointer;
    transition: background-color var(--transition-fast) var(--ease-standard);
}
.ds-table__detail-btn:hover { background: var(--surface-subtle); }
.ds-table__detail-btn:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }

/* ─── Деталь-модалка (compact): список полей label → value ─────── */
.ds-table-detail__header { padding-bottom: var(--size-16); border-bottom: 1px solid var(--border-default); margin-bottom: var(--size-8); }
.ds-table-detail__list { margin: 0; }
.ds-table-detail__field {
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    padding: var(--size-12) 0;
    border-bottom: 1px solid var(--border-default);
}
.ds-table-detail__field:last-child { border-bottom: 0; }
.ds-table-detail__label { color: var(--text-muted); }
.ds-table-detail__value { color: var(--text-default); }

/* ─── Пустое состояние ────────────────────────────────────────── */
.ds-table__empty {
    padding: var(--size-32) var(--size-16);
    text-align: center;
    color: var(--text-muted);
    font-size: var(--font-size-body-l);
    white-space: normal;
}

/* ─── Адаптив <md, режим 'cards' (default): таблица → карточки ─── */
/* Применяется ко ВСЕМ таблицам, кроме .ds-table-wrap--compact. */
@include respond-below(md) {
    .ds-table-wrap:not(.ds-table-wrap--compact):not(.ds-table-wrap--scroll) {
        overflow: visible;

        .ds-table,
        .ds-table__head,
        .ds-table__body,
        .ds-table__row,
        .ds-table__td {
            display: block;
            width: 100%;
        }
        .ds-table__head { display: none; }

        .ds-table__row {
            background: var(--surface-default);
            border: 1px solid var(--border-default);
            border-radius: var(--radius-md);
            padding: var(--size-12);
            margin-bottom: var(--size-8);
        }
        .ds-table__row--child {
            background: var(--surface-subtle);
            margin-left: var(--size-12);
        }

        .ds-table__td {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--size-12);
            padding: var(--size-6) 0;
            text-align: right;
            border-bottom: 0;
            white-space: normal;
        }
        /* Подпись из column.label через data-title. */
        .ds-table__td[data-title]::before {
            content: attr(data-title);
            flex: 0 0 auto;
            font-size: var(--font-size-caption);
            font-weight: var(--font-weight-regular);
            color: var(--text-muted);
            text-align: left;
        }
        /* Первая (лид) ячейка — без подписи, контент слева на всю ширину. */
        .ds-table__td:first-child {
            justify-content: flex-start;
            text-align: left;
        }
        .ds-table__td:first-child[data-title]::before { content: none; }

        .ds-table__detail,
        .ds-table__empty {
            display: block;
            text-align: left;
        }
        .ds-table__empty { text-align: center; }
    }
}

/* ─── Адаптив <md, режим 'compact': остаётся ТАБЛИЦЕЙ ──────────── */
/* Видны только приоритетные колонки (mobileColumns) + кнопка → «Подробнее». */
@include respond-below(md) {
    .ds-table-wrap--compact {
        /* Если приоритетные колонки всё же не влезают — горизонтальный скролл,
           но без посимвольного переноса чисел. */
        overflow-x: auto;

        /* Прячем непрриоритетные колонки. */
        .ds-table__cell--mobile-hidden { display: none; }

        /* Показываем служебную колонку «Подробнее». */
        .ds-table__th--detail,
        .ds-table__td--detail { display: table-cell; }

        /* Авто-раскладка: колонки по контенту, имя забирает остаток. */
        .ds-table { width: 100%; }

        /* Числовые колонки — значения в ОДНУ строку (не рвать «6 928,46 ₽»). */
        .ds-table__th--numeric { width: auto; }
        .ds-table__td--numeric { white-space: nowrap; }

        /* Колонка «Товары» (лид) — гибкая, занимает оставшееся место, имя переносится. */
        .ds-table__th:first-child,
        .ds-table__td:first-child { width: auto; }
        .ds-table__td:first-child {
            white-space: normal;
            overflow-wrap: break-word;
        }
    }
}

/* ─── Адаптив <md, режим 'scroll': сложная таблица (как Реклама) ──── */
/* Таблица остаётся таблицей и скроллится по горизонтали; деталь-колонка
   закреплена справа и открывает деталь-модалку. Колонки НЕ скрываются. */
@include respond-below(md) {
    .ds-table-wrap--scroll {
        /* overflow-x: auto уже задан на .ds-table-wrap (скролл). */

        .ds-table__th--detail,
        .ds-table__td--detail {
            display: table-cell;
            position: sticky;
            right: 0;
            z-index: var(--z-sticky);
            background: var(--surface-default);
            border-left: 1px solid var(--border-default);
        }
        /* Дочерние строки: липкая деталь-ячейка на подложке subtle. */
        .ds-table__row--child .ds-table__td--detail { background: var(--surface-subtle); }
    }
}
</style>
