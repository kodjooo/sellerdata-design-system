<template>
    <!--
      DsCard — реусабельный контейнер-карточка дизайн-системы.
      Канон: docs/design-system-canon.md → раздел «Card».
      База: фон --surface-default, граница 1px --border-default, тень --shadow-card.
      Эталоны: настройки__модалка-изменить-ключ@wb.png, дашборд__общий@wb.png.
    -->
    <component
        :is="tag"
        class="ds-card"
        :class="[
            `ds-card--r-${radius}`,
            `ds-card--sh-${shadow}`,
            { 'ds-card--has-header': hasHeader, 'ds-card--has-footer': hasFooter, 'ds-card--bleed-mobile': bleedMobile },
        ]"
        :style="cardStyle"
    >
        <!-- Шапка карточки: заголовок/действия. Рендерится только при наличии слота. -->
        <header v-if="hasHeader" class="ds-card__header">
            <slot name="header" />
        </header>

        <!-- Тело карточки (основной контент). -->
        <div class="ds-card__body">
            <slot />
        </div>

        <!-- Подвал карточки: кнопки/мета. Рендерится только при наличии слота. -->
        <div v-if="hasFooter" class="ds-card__footer">
            <slot name="footer" />
        </div>
    </component>
</template>

<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
    // Внутренний отступ зон. Любой токен шкалы --size-* (по умолчанию --size-16 — база карточек).
    padding: {
        type: String,
        default: '--size-16',
    },
    // Радиус скругления: md (8, default — карточки/модалки) | lg (12 — крупные панели/настройки).
    radius: {
        type: String,
        default: 'md',
        validator: (v) => ['md', 'lg'].includes(v),
    },
    // Тень: card (мягкая, default) | none (плоская, для вложенных блоков) | overlay (приподнятая — поповеры/модалки).
    shadow: {
        type: String,
        default: 'card',
        validator: (v) => ['card', 'none', 'overlay'].includes(v),
    },
    // HTML-тег корневого элемента (section/article/div и т.п.).
    tag: {
        type: String,
        default: 'section',
    },
    // На мобайле (<md) карточка выходит на всю ширину вьюпорта (full-bleed): убирает
    // боковой паддинг страницы (отрицательный margin), радиус и боковые границы.
    // Реал: таблицы в кабинете на мобайле — edge-to-edge.
    bleedMobile: {
        type: Boolean,
        default: false,
    },
});

const slots = useSlots();

const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => !!slots.footer);

// Padding прокидываем через CSS-переменную, чтобы все три зоны были согласованы.
const cardStyle = computed(() => ({ '--ds-card-padding': `var(${props.padding})` }));
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

/* ─── База ────────────────────────────────────────────────────── */
.ds-card {
    display: flex;
    flex-direction: column;
    background: var(--surface-default);
    color: var(--text-default);
    border: 1px solid var(--border-default);
    overflow: hidden;
    transition: box-shadow var(--transition-base) var(--ease-standard),
                border-color var(--transition-base) var(--ease-standard);
}

/* ─── Радиус ──────────────────────────────────────────────────── */
.ds-card--r-md { border-radius: var(--radius-md); }
.ds-card--r-lg { border-radius: var(--radius-lg); }

/* ─── Full-bleed на мобайле: таблица во всю ширину (как в реале ЛК) ─── */
@include respond-below(md) {
    .ds-card--bleed-mobile {
        /* отрицательный margin = боковой паддинг контента AppShell (--size-16) */
        margin-inline: calc(var(--size-16) * -1);
        border-radius: 0;
        border-left: 0;
        border-right: 0;
    }
}

/* ─── Тень ────────────────────────────────────────────────────── */
.ds-card--sh-card    { box-shadow: var(--shadow-card); }
.ds-card--sh-none    { box-shadow: none; }
.ds-card--sh-overlay { box-shadow: var(--shadow-overlay); }

/* ─── Зоны ────────────────────────────────────────────────────── */
.ds-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-8);
    padding: var(--ds-card-padding);
    border-bottom: 1px solid var(--border-default);
}

.ds-card__body {
    flex: 1 1 auto;
    padding: var(--ds-card-padding);
}

.ds-card__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--size-8);
    padding: var(--ds-card-padding);
    border-top: 1px solid var(--border-default);
}
</style>
