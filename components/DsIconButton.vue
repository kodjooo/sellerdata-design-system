<template>
    <!--
        DsIconButton — круглая иконочная кнопка (реал: dashboard-nav__btn / круглые
        кнопки период/фильтр в тулбарах). Заливка brand, белая иконка, круг.
        Размеры: md (40 — воронка фильтра) | lg (48 — период/календарь).
    -->
    <button
        type="button"
        class="ds-icon-btn"
        :class="[`ds-icon-btn--${size}`, `ds-icon-btn--${variant}`]"
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
    // brand (заливка brand, по умолчанию) | ghost (прозрачная, текст muted).
    variant: { type: String, default: 'brand', validator: (v) => ['brand', 'ghost'].includes(v) },
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

.ds-icon-btn--brand { background: var(--brand); color: var(--white); }
.ds-icon-btn--brand:hover { background: var(--brand-hover); }

.ds-icon-btn--ghost { background: transparent; color: var(--text-muted); }
.ds-icon-btn--ghost:hover { background: var(--surface-muted); color: var(--text-heading); }

.ds-icon-btn:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }
</style>
