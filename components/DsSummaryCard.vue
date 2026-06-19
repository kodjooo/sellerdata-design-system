<template>
    <article class="ds-summary-card">
        <header class="ds-summary-card__head" :class="`ds-summary-card__head--${gradient}`">
            <span class="ds-summary-card__title-group">
                <span class="ds-summary-card__title">
                    <slot name="title">{{ title }}</slot>
                </span>
                <span v-if="$slots.subtitle || subtitle" class="ds-summary-card__subtitle">
                    <slot name="subtitle">{{ subtitle }}</slot>
                </span>
            </span>
            <span
                v-if="$slots.icon || icon"
                class="ds-summary-card__icon"
                :class="`ds-summary-card__icon--${icon}`"
                role="img"
                :aria-label="iconAriaLabel"
            >
                <slot name="icon">{{ iconGlyph }}</slot>
            </span>
        </header>

        <div
            class="ds-summary-card__body"
            :class="{ 'ds-summary-card__body--featured': featuredFirst }"
            :style="{ '--ds-summary-cols': columns }"
        >
            <slot name="body">
                <div
                    v-for="(metric, i) in metrics"
                    :key="metric.label ?? i"
                    class="ds-summary-card__metric"
                >
                    <span class="ds-summary-card__metric-label">
                        <span
                            v-if="metric.info"
                            class="ds-summary-card__metric-info"
                            role="img"
                            aria-label="Пояснение"
                        >ⓘ</span>
                        {{ metric.label }}
                    </span>
                    <span class="ds-summary-card__metric-value">{{ metric.value }}</span>
                </div>
            </slot>
        </div>

        <div v-if="$slots.footer" class="ds-summary-card__footer">
            <slot name="footer" />
        </div>
    </article>
</template>

<script setup>
/**
 * DsSummaryCard — ИЗВЛЕЧЁН из реальной summary-плитки (.block_item_head / .item_content,
 * main.scss:1993+). Шапка — СПЛОШНОЙ цвет --summary-* (не градиент!), padding 11/56/11/16,
 * radius 8 8 0 0, min-height 38, color white, title 600, line-height 1.231.
 * Тело (.item_content): padding 16/20, gap 16. Значение метрики базово 13px/400
 * (.item_content_data наследует тело; сверено computed-diff на /warehouse и /dashboard),
 * label 12px / --text-default (.item_content_title). Карточка склада — 3 колонки без
 * эмфазы; карточка-период дашборда — featuredFirst (первая метрика 16/600 на всю ширину).
 */
import { computed } from 'vue';

const props = defineProps({
    title: { type: String, default: '' },
    // Подзаголовок под заголовком в шапке (в реале .block_item_date — период/дата).
    subtitle: { type: String, default: '' },
    // Эмфаза первой метрики (реал .item_content_inner:first-child): спан на все
    // колонки + значение 16/600; остальные значения — базовые 13/400.
    featuredFirst: { type: Boolean, default: false },
    // Имя цвета шапки — токены --summary-*. Шапка заливается СПЛОШНЫМ этим цветом.
    gradient: {
        type: String,
        default: 'periwinkle',
        validator: (v) => ['periwinkle', 'blue', 'muted', 'indigo', 'indigo-deep', 'navy'].includes(v),
    },
    icon: { type: String, default: '', validator: (v) => ['', 'info', 'warning'].includes(v) },
    iconLabel: { type: String, default: '' },
    metrics: { type: Array, default: () => [] },
    columns: { type: [Number, String], default: 2 },
});

const iconGlyph = computed(() => (props.icon === 'warning' ? '⚠' : 'ⓘ'));
const iconAriaLabel = computed(() => props.iconLabel || (props.icon === 'warning' ? 'Предупреждение' : 'Информация'));
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

.ds-summary-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: var(--radius-md);
    background: var(--surface-default);
    box-shadow: var(--shadow-card);
    overflow: hidden;
}

/* ─── Шапка (.block_item_head) — сплошной --summary-*, дословно ──── */
.ds-summary-card__head {
    position: relative;                       /* якорь для абсолютной иконки */
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-8);
    min-height: 38px;                         /* rem(38) */
    padding: 11px var(--size-56, 56px) 11px var(--size-16);  /* rem(11) rem(56) rem(11) rem(16) */
    color: var(--white);
    line-height: 1.231;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
}
.ds-summary-card__head--periwinkle  { background: var(--summary-periwinkle); }
.ds-summary-card__head--blue        { background: var(--summary-blue); }
.ds-summary-card__head--muted       { background: var(--summary-muted); }
.ds-summary-card__head--indigo      { background: var(--summary-indigo); }
.ds-summary-card__head--indigo-deep { background: var(--summary-indigo-deep); }
.ds-summary-card__head--navy        { background: var(--summary-navy); }

.ds-summary-card__title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}
.ds-summary-card__title {
    color: var(--white);
    font-size: var(--font-size-body-s);       /* 13 */
    font-weight: 600;                          /* .block_item_title font-weight: 600 */
    min-width: 0;
}
/* .block_item_date — период под заголовком, тот же белый, помельче/полупрозрачно */
.ds-summary-card__subtitle {
    color: var(--white);
    font-size: 12px;
    opacity: var(--opacity-hover);
}
/* Иконка-индикатор шапки (.block_item_head__tooltip): абсолютно у правого края,
   right:16px, по центру вертикали — НЕ внутри 56px-падинга (тот только под текст). */
.ds-summary-card__icon {
    position: absolute;
    top: 50%;
    right: var(--size-16);
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-size: var(--font-size-body-l);
}
.ds-summary-card__icon--info    { opacity: var(--opacity-hover); }
.ds-summary-card__icon--warning { opacity: var(--opacity-full); }

/* ─── Тело (.item_content) — padding 16/20, gap 16 ─────────────── */
.ds-summary-card__body {
    display: grid;
    /* real .item_content: grid-template-columns: repeat(2, 1fr) — всегда 2 колонки */
    grid-template-columns: repeat(var(--ds-summary-cols, 2), 1fr);
    gap: var(--size-16);
    padding: var(--size-16) var(--size-20);
    border-radius: 0 0 var(--radius-md) var(--radius-md);
}
.ds-summary-card__metric { display: flex; flex-direction: column; min-width: 0; }
/* .item_content_title: 12px / --text-default, margin-bottom 2 */
.ds-summary-card__metric-label {
    display: inline-flex;
    align-items: center;
    gap: var(--size-6);
    font-size: 12px;
    color: var(--text-default);
    margin-bottom: 2px;
}
/* .item_content_title__info — иконка-пояснение у метрики, цвет --status-alert. */
.ds-summary-card__metric-info {
    color: var(--status-alert);
    font-size: var(--font-size-body-s);
}
/* .item_content_data: базово 13/400 (без font-size наследует тело), цвет heading.
   Сверено computed-diff на /warehouse и /dashboard: все метрики 13px/400. */
.ds-summary-card__metric-value {
    font-size: var(--font-size-body-s);
    font-weight: 400;
    color: var(--text-heading);
}

/* ─── Эмфаза первой метрики (реал .item_content_inner:first-child) ─── */
/* Только в карточке-периоде дашборда: первая метрика на всю ширину и крупная
   (16/600). В карточке склада эмфазы нет — все 13/400 (featuredFirst=false). */
.ds-summary-card__body--featured .ds-summary-card__metric:first-child {
    grid-column: 1 / -1;
}
.ds-summary-card__body--featured .ds-summary-card__metric:first-child .ds-summary-card__metric-value {
    font-size: var(--font-size-body-l);
    font-weight: 600;
}

/* Футер (.block_item_footer): без фона, по центру, отступы 0/16/16. */
.ds-summary-card__footer {
    margin-top: auto;
    padding: 0 var(--size-16) var(--size-16);
    background: transparent;
    text-align: center;
    color: var(--text-muted);
}
</style>
