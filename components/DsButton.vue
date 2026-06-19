<template>
    <button
        :type="type"
        class="ds-btn"
        :class="[`ds-btn--${variant}`, { 'ds-btn--lg': size === 'lg', 'is-disabled': disabled }]"
        :disabled="disabled"
        :aria-label="ariaLabel || null"
    >
        <slot name="iconLeft" />
        <slot />
        <slot name="iconRight" />
    </button>
</template>

<script setup>
/**
 * DsButton — ИЗВЛЕЧЁН ДОСЛОВНО из реальных .btn-regular / .btn-default
 * (resources/scss/_assets.scss:408+) и .btn_lg. Значения совпадают пиксель-в-пиксель
 * с текущим дизайном; сырые цвета/legacy-переменные заменены на РАВНЫЕ им токены:
 *   $blue=#4154f1 → --brand · $blue_hover → --brand-hover · $white → --white
 *   $border_color=#F0F0F0 → --border-default · $dark=#555 → --text-default
 *   $grey-200=#E4E5E7 → --gray-300 · $black → --black · $dark_grey=#999 → --text-muted
 *   radius rem(4) → --radius-sm · height rem(40) → --control-height-md · 13px → --font-size-body-s
 * НЕ менял внешний вид (нет тени, line-height .9, min-width 145, padding 5/25 — как в реале).
 * variant: primary=.btn-regular, secondary=.btn-default. size: md(40)/lg(60, =.btn_lg).
 */
defineProps({
    variant: { type: String, default: 'primary' }, // primary | secondary
    size: { type: String, default: 'md' },          // md | lg
    type: { type: String, default: 'button' },
    disabled: { type: Boolean, default: false },
    ariaLabel: { type: String, default: '' },
});
</script>

<style lang="scss" scoped>
/* База — дословно из .btn-default/.btn-regular (общая часть). */
.ds-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-8);
    height: var(--control-height-md);        /* rem(40) */
    min-width: 145px;                        /* real .btn-regular min-width: rem(145) */
    padding: 5px 25px;                       /* real: rem(5) rem(25) — кандидат на снап в шкалу при унификации */
    border: 1px solid transparent;
    border-radius: var(--radius-sm);         /* rem(4) */
    font-family: var(--font-family-sans);
    font-size: var(--font-size-body-s);      /* наследуемые 13px */
    font-weight: var(--font-weight-regular); /* реально 400 */
    line-height: 0.9;                        /* real: line-height: .9 */
    text-decoration: none;
    cursor: pointer;
    box-sizing: border-box;
}

/* primary = .btn-regular */
.ds-btn--primary {
    background-color: var(--brand);
    border-color: var(--brand);
    color: var(--white);
    &:hover, &:active { background-color: var(--brand-hover); border-color: var(--brand-hover); color: var(--white); }
    &:focus { color: var(--white); outline: none; }
}

/* secondary = .btn-default */
.ds-btn--secondary {
    background-color: var(--white);
    border-color: var(--border-default);
    color: var(--text-default);
    &:hover, &:active { background-color: var(--white); border-color: var(--gray-300); color: var(--black); text-decoration: none; }
}

/* size lg = .btn_lg */
.ds-btn--lg {
    height: 60px;                            /* rem(60) */
    font-size: var(--font-size-body-l);      /* rem(16) */
    padding: 10px 50px;                      /* rem(10) rem(50) */
    border-radius: var(--radius-md);         /* rem(8) */
}

/* disabled — дословно из реала */
.ds-btn:disabled,
.ds-btn.is-disabled {
    background-color: var(--border-default);
    border-color: var(--border-default);
    color: var(--text-muted);
    cursor: not-allowed;
    pointer-events: none;
}
</style>
