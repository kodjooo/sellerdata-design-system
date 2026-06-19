<template>
    <!--
        DsSummaryCarousel — обёртка над набором summary-карточек (DsSummaryCard).

        Канон: docs/design-system-canon.md → «Мобильные паттерны ЛК» (Summary-карточки
        на мобайле = вкладки + свайпер: ряд табов с заголовками, показана ОДНА карточка,
        метрики внутри в 2 колонки). Эталон: docs/reference/screens/склад__список@wb.png
        (ряд из N градиентных карточек на десктопе).

        Адаптив:
          ≥lg  — РЯД из N карточек (grid), все видны;
          <lg  — ВКЛАДКИ: ряд табов-заголовков + одна активная карточка,
                 метрики в 2 колонки (columns=2).

        Только токены: var(--*), --size-*, --radius-*, t-*-классы.
    -->
    <section class="ds-summary-carousel" aria-label="Сводка">
        <!--
            Ряд табов (виден только <lg). Канон «Мобильный тулбар и баннер ЛК»:
            табы ТЕКСТОВЫЕ (активный — brand-текст + нижняя brand-полоса), НЕ pill.
            Справа в ряду — слот #tabs-action (страница кладёт туда круглую воронку).
        -->
        <div class="ds-summary-carousel__tabs-row">
            <div class="ds-summary-carousel__tabs" role="tablist">
                <button
                    v-for="(item, i) in items"
                    :key="item.title ?? i"
                    type="button"
                    role="tab"
                    class="t-label-m ds-summary-carousel__tab"
                    :class="{ 'is-active': i === activeIndex }"
                    :aria-selected="i === activeIndex"
                    @click="activeIndex = i"
                >
                    {{ item.title }}
                </button>
            </div>
            <div v-if="$slots['tabs-action']" class="ds-summary-carousel__tabs-action">
                <slot name="tabs-action" />
            </div>
        </div>

        <!-- Лента карточек. -->
        <div class="ds-summary-carousel__track">
            <DsSummaryCard
                v-for="(item, i) in items"
                :key="item.title ?? i"
                class="ds-summary-carousel__card"
                :class="{ 'is-active': i === activeIndex }"
                :title="item.title"
                :subtitle="item.subtitle || ''"
                :gradient="item.gradient"
                :icon="item.icon || ''"
                :metrics="item.metrics"
                :columns="cardColumns"
                :featured-first="featuredFirst"
            >
                <template v-if="item.footerText" #footer>
                    <button type="button" class="ds-summary-carousel__more">{{ item.footerText }}</button>
                </template>
            </DsSummaryCard>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import DsSummaryCard from './DsSummaryCard.vue';

defineProps({
    // Карточки: [{ title, gradient, icon?, metrics: [{label,value}] }].
    items: {
        type: Array,
        default: () => [],
    },
    // Число колонок метрик внутри карточки на десктопе (на мобайле принудительно 2).
    cardColumns: {
        type: [Number, String],
        default: 3,
    },
    // Эмфаза первой метрики (как в период-карточках дашборда).
    featuredFirst: {
        type: Boolean,
        default: false,
    },
});

// Активная карточка для мобильных вкладок/свайпера.
const activeIndex = ref(0);
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

.ds-summary-carousel { display: flex; flex-direction: column; gap: var(--size-12); }

/* ─── Ряд табов (только <lg): табы слева + action-слот справа ──── */
.ds-summary-carousel__tabs-row {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    /* Нижняя линия-подложка под текстовыми табами (канон Tabs line). */
    border-bottom: 1px solid var(--border-default);

    @include respond-to(lg) { display: none; }
}
.ds-summary-carousel__tabs {
    display: flex;
    flex: 1 1 auto;
    gap: var(--size-16);
    overflow-x: auto;
    scrollbar-width: none;
}
.ds-summary-carousel__tabs::-webkit-scrollbar { display: none; }
.ds-summary-carousel__tabs-action { flex: 0 0 auto; }

/* Текстовые табы (канон Tabs line): brand-текст + нижняя brand-полоса на активном. */
.ds-summary-carousel__tab {
    position: relative;
    flex: 0 0 auto;
    padding: var(--size-8) 0;
    border: 0;
    background: transparent;
    color: var(--text-default);
    cursor: pointer;
    white-space: nowrap;
    transition: color var(--transition-base) var(--ease-standard);
}
.ds-summary-carousel__tab::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(var(--border-width-accent) * -1);
    height: var(--border-width-accent);
    border-radius: var(--radius-sm);
    background: var(--brand);
    opacity: var(--opacity-hidden);
    transition: opacity var(--transition-base) var(--ease-standard);
}
.ds-summary-carousel__tab:hover { color: var(--brand); }
.ds-summary-carousel__tab:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }
.ds-summary-carousel__tab.is-active { color: var(--brand); }
.ds-summary-carousel__tab.is-active::after { opacity: var(--opacity-full); }

/* ─── Лента карточек ──────────────────────────────────────────── */
/* Кнопка «Больше» в футере карточки-периода (как в реале). */
.ds-summary-carousel__more {
    display: inline-block;
    padding: 1px 0;
    border: 0;
    border-bottom: 1px dashed var(--brand);
    background: transparent;
    color: var(--brand);
    font-size: var(--font-size-body-s);
    cursor: pointer;
}

/* База = мобайл: показываем ТОЛЬКО активную карточку (вкладки/свайпер). */
.ds-summary-carousel__track {
    display: grid;
    gap: var(--size-16);
}
.ds-summary-carousel__card { display: none; }
.ds-summary-carousel__card.is-active { display: block; }

/* На мобайле метрики в 2 колонки (канон). DsSummaryCard включает columns от md,
   но на телефоне (<md) грид метрик одноколоночный — форсим 2 колонки. */
@include respond-below(md) {
    .ds-summary-carousel__card.is-active :deep(.ds-summary-card__body) {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* ─── ≥lg: ряд из N карточек, табы скрыты, все карточки видны ──── */
@include respond-to(lg) {
    .ds-summary-carousel__track {
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
    }
    .ds-summary-carousel__card,
    .ds-summary-carousel__card.is-active { display: block; }
}
</style>
