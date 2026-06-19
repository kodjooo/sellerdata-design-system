<script setup>
/**
 * DsPagination — реусабельная пагинация дизайн-системы.
 *
 * Канон: docs/design-system-canon.md → раздел «Pagination» / «Table → pagination».
 * Эталоны: docs/reference/screens/склад__список@wb.png,
 *          docs/reference/screens/товары__список@wb.png
 * (нумерованные страницы, стрелки ‹ ›, многоточие при большом числе страниц).
 *
 * Сетка: кнопки --control-height-sm (32) / --radius-sm; активная страница — заливка
 * --brand / --text-on-brand. Стрелки prev/next и многоточие — отдельные элементы.
 *
 * Props:
 *   page    — текущая страница (1-based)
 *   total   — всего элементов
 *   perPage — элементов на странице
 *
 * Emit:
 *   change(page) — запрос на переход к указанной странице.
 */
import { computed } from 'vue';

const props = defineProps({
    // Текущая страница (1-based).
    page: {
        type: Number,
        default: 1,
    },
    // Всего элементов.
    total: {
        type: Number,
        default: 0,
    },
    // Элементов на странице.
    perPage: {
        type: Number,
        default: 20,
    },
    // Сколько соседних страниц показывать вокруг текущей.
    siblingCount: {
        type: Number,
        default: 1,
    },
    // Компактный режим на мобайле (<xl=1200, как в реале): select «Страница N из M»
    // + стрелки ‹ › вместо кнопок-номеров. Канон «Мобильный тулбар и баннер ЛК».
    mobileCompact: {
        type: Boolean,
        default: true,
    },
    // Принудительно компактный вид независимо от ширины (для эталона/мобильного контекста).
    forceCompact: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['change']);

// Всего страниц (минимум 1).
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / Math.max(1, props.perPage))));

// Текущая страница, ограниченная допустимым диапазоном.
const currentPage = computed(() => Math.min(Math.max(1, props.page), pageCount.value));

const isFirst = computed(() => currentPage.value <= 1);
const isLast = computed(() => currentPage.value >= pageCount.value);

// Список элементов: номера страниц + многоточия ('ellipsis-left' / 'ellipsis-right').
const items = computed(() => {
    const totalPages = pageCount.value;
    const current = currentPage.value;
    const siblings = props.siblingCount;

    // Сколько номеров показываем без сворачивания: первая + последняя + текущая
    // + соседи с двух сторон + 2 многоточия.
    const totalNumbers = siblings * 2 + 5;

    if (totalPages <= totalNumbers) {
        return range(1, totalPages);
    }

    const leftSibling = Math.max(current - siblings, 1);
    const rightSibling = Math.min(current + siblings, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const result = [];

    if (!showLeftEllipsis && showRightEllipsis) {
        // Старт списка: первые страницы + правое многоточие + последняя.
        const leftCount = siblings * 2 + 3;
        result.push(...range(1, leftCount), 'ellipsis-right', totalPages);
    } else if (showLeftEllipsis && !showRightEllipsis) {
        // Конец списка: первая + левое многоточие + последние страницы.
        const rightCount = siblings * 2 + 3;
        result.push(1, 'ellipsis-left', ...range(totalPages - rightCount + 1, totalPages));
    } else {
        // Середина: первая + многоточие + соседи + многоточие + последняя.
        result.push(1, 'ellipsis-left', ...range(leftSibling, rightSibling), 'ellipsis-right', totalPages);
    }

    return result;
});

function range(start, end) {
    const out = [];
    for (let i = start; i <= end; i += 1) out.push(i);
    return out;
}

function goTo(target) {
    const next = Math.min(Math.max(1, target), pageCount.value);
    if (next !== currentPage.value) emit('change', next);
}

function isEllipsis(item) {
    return typeof item === 'string';
}
</script>

<template>
    <nav
        class="ds-pagination"
        :class="{ 'ds-pagination--mobile-compact': mobileCompact, 'ds-pagination--compact': forceCompact }"
        aria-label="Пагинация"
    >
        <!-- Назад -->
        <button
            type="button"
            class="ds-pagination__nav"
            :disabled="isFirst"
            aria-label="Предыдущая страница"
            @click="goTo(currentPage - 1)"
        >
            <span aria-hidden="true">‹</span>
        </button>

        <!-- Компактная подпись-селект «Страница N из M» (реал .select-pagination):
             текст видим, прозрачный select сверху позволяет выбрать страницу. -->
        <label class="t-body-s ds-pagination__label">
            <span>Страница <strong class="ds-pagination__label-current">{{ currentPage }}</strong> из {{ pageCount }}</span>
            <select
                class="ds-pagination__select"
                :value="currentPage"
                aria-label="Выбрать страницу"
                @change="goTo(Number($event.target.value))"
            >
                <option v-for="p in pageCount" :key="p" :value="p">{{ p }}</option>
            </select>
        </label>

        <!-- Номера страниц и многоточия (скрыты <md при mobileCompact). -->
        <span class="ds-pagination__numbers">
            <template v-for="(item, index) in items" :key="isEllipsis(item) ? `${item}-${index}` : item">
                <span v-if="isEllipsis(item)" class="ds-pagination__ellipsis" aria-hidden="true">…</span>
                <button
                    v-else
                    type="button"
                    class="ds-pagination__page"
                    :class="{ 'ds-pagination__page--active': item === currentPage }"
                    :aria-current="item === currentPage ? 'page' : null"
                    :aria-label="`Страница ${item}`"
                    @click="goTo(item)"
                >
                    {{ item }}
                </button>
            </template>
        </span>

        <!-- Вперёд -->
        <button
            type="button"
            class="ds-pagination__nav"
            :disabled="isLast"
            aria-label="Следующая страница"
            @click="goTo(currentPage + 1)"
        >
            <span aria-hidden="true">›</span>
        </button>
    </nav>
</template>

<style lang="scss" scoped>
@use 'responsive' as *;

.ds-pagination {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--size-4);
}

/* Группа номеров (десктоп) — выстроена в ряд. */
.ds-pagination__numbers {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--size-4);
}

/* Компактная подпись-селект «Страница N из M» — по умолчанию скрыта (десктоп = номера). */
.ds-pagination__label {
    position: relative;
    display: none;
    align-items: center;
    color: var(--text-muted);
    white-space: nowrap;
    padding: 0 var(--size-8);
    cursor: pointer;
}
.ds-pagination__label-current { color: var(--brand); font-weight: var(--font-weight-semibold); }
/* Прозрачный select поверх подписи (реал .select-pagination__select). */
.ds-pagination__select {
    position: absolute;
    inset: 0;
    width: 100%;
    opacity: var(--opacity-hidden);
    cursor: pointer;
}

/* Принудительный компактный вид (forceCompact) — независимо от ширины. */
.ds-pagination--compact { gap: var(--size-12); }
.ds-pagination--compact .ds-pagination__numbers { display: none; }
.ds-pagination--compact .ds-pagination__label { display: inline-flex; }

/* <xl (1200) при mobileCompact: показываем подпись + стрелки, прячем номера (как в реале). */
@include respond-below(xl) {
    .ds-pagination--mobile-compact {
        gap: var(--size-12);
    }
    .ds-pagination--mobile-compact .ds-pagination__numbers { display: none; }
    .ds-pagination--mobile-compact .ds-pagination__label { display: inline-flex; }
}

/* Общая база кнопок страниц и стрелок. */
.ds-pagination__page,
.ds-pagination__nav {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--control-height-sm); /* 32 */
    height: var(--control-height-sm);
    padding: 0 var(--size-8);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-body-s); /* 13 — плотность ЛК */
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-tight);
    cursor: pointer;
    box-sizing: border-box;
    transition: background-color var(--transition-base) var(--ease-standard),
        border-color var(--transition-base) var(--ease-standard),
        color var(--transition-base) var(--ease-standard),
        box-shadow var(--transition-base) var(--ease-standard);
}

.ds-pagination__page:hover,
.ds-pagination__nav:not(:disabled):hover {
    background: var(--surface-muted);
    color: var(--brand);
}

.ds-pagination__page:focus-visible,
.ds-pagination__nav:focus-visible {
    outline: none;
    box-shadow: var(--shadow-input-focus);
}

/* Активная страница — заливка бренда. */
.ds-pagination__page--active {
    background: var(--brand);
    color: var(--text-on-brand);
    border-color: var(--brand);
    font-weight: var(--font-weight-semibold);
}
.ds-pagination__page--active:hover {
    background: var(--brand-hover);
    color: var(--text-on-brand);
}

/* Стрелки prev/next — с рамкой, как отдельные навигационные контролы. */
.ds-pagination__nav {
    border-color: var(--border-default);
    background: var(--surface-default);
    font-size: var(--font-size-body-l);
}
.ds-pagination__nav:not(:disabled):hover {
    border-color: var(--brand);
}
.ds-pagination__nav:disabled {
    color: var(--text-disabled);
    opacity: var(--opacity-disabled);
    cursor: not-allowed;
}

/* Многоточие — не интерактивно. */
.ds-pagination__ellipsis {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--control-height-sm);
    height: var(--control-height-sm);
    color: var(--text-muted);
    font-size: var(--font-size-body-s);
    line-height: var(--line-height-tight);
    pointer-events: none;
    user-select: none;
}
</style>
