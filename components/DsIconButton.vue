<template>
    <!--
        DsIconButton — круглая иконочная кнопка (реал: dashboard-nav__btn / круглые
        кнопки период/фильтр в тулбарах). Заливка brand, белая иконка, круг.
        Размеры: md (40 — воронка фильтра) | lg (48 — период/календарь).
    -->
    <button
        type="button"
        class="ds-icon-btn"
        :class="[`ds-icon-btn--${size}`, `ds-icon-btn--${variant}`, { 'ds-icon-btn--block': block }]"
        :aria-label="ariaLabel"
    >
        <span :class="icon" aria-hidden="true"></span>
    </button>
</template>

<script setup>
defineProps({
    // Класс иконочного шрифта (fm-*).
    icon: { type: String, required: true },
    // md (40 — фильтр-воронка) | lg (48 — период/календарь).
    size: { type: String, default: 'md', validator: (v) => ['md', 'lg'].includes(v) },
    // Заполнить контейнер целиком (для ячейки таблицы «Инфо»/«Подробнее» — реал 55×53).
    block: { type: Boolean, default: false },
    // brand (заливка brand, по умолчанию) | ghost (прозрачная, текст muted) |
    // link (прозрачная, текст brand — для «Подробнее»/деталь-шеврона в таблицах).
    variant: { type: String, default: 'brand', validator: (v) => ['brand', 'ghost', 'link'].includes(v) },
    ariaLabel: { type: String, default: '' },
});
</script>

<style lang="scss" scoped>
.ds-icon-btn {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: background-color var(--transition-fast) var(--ease-standard),
                color var(--transition-fast) var(--ease-standard);
}
.ds-icon-btn--md { width: var(--control-height-md); height: var(--control-height-md); font-size: var(--font-size-body-l); }
.ds-icon-btn--lg { width: var(--size-48); height: var(--size-48); font-size: var(--font-size-heading-m); }
/* block — заполняет ячейку (стрелка-деталь «›» в таблице); глиф 16px (реал), квадратные углы. */
.ds-icon-btn--block { width: 100%; height: 100%; min-width: var(--size-40); min-height: var(--size-48); font-size: var(--font-size-body-l); border-radius: var(--radius-sm); }

.ds-icon-btn--brand { background: var(--brand); color: var(--white); }
.ds-icon-btn--brand:hover { background: var(--brand-hover); }

.ds-icon-btn--ghost { background: transparent; color: var(--text-muted); }
.ds-icon-btn--ghost:hover { background: var(--surface-muted); color: var(--text-heading); }

/* link — плоский brand-шеврон без заливки (колонка «Инфо»/«Подробнее» в таблицах). */
.ds-icon-btn--link { background: transparent; color: var(--brand); }
.ds-icon-btn--link:hover { color: var(--brand-hover); }

.ds-icon-btn:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }
</style>
