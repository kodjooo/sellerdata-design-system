<template>
    <!--
        DsOptionCard — карточка-вариант выбора (радио). Покрывает паттерны реала:
        пресеты периода, способ оплаты, действие с ключом и т.п.
          layout: row (иконка+текст в строку) | stack (иконка над текстом, по центру);
          activeStyle: fill (выбранная = заливка brand) | border (выбранная = brand-рамка);
          check: показывать галочку у выбранной (checkSide left|right).
    -->
    <button
        type="button"
        class="ds-option"
        :class="[`ds-option--${layout}`, `ds-option--active-${activeStyle}`, { 'is-selected': selected, 'ds-option--check-left': checkSide === 'left' }]"
        @click="$emit('select')"
    >
        <span v-if="$slots.icon || icon" class="ds-option__icon"><slot name="icon"><span :class="icon" aria-hidden="true"></span></slot></span>
        <span class="ds-option__body">
            <span v-if="title" class="t-body-s ds-option__title">{{ title }}</span>
            <span v-if="sub" class="t-caption ds-option__sub">{{ sub }}</span>
            <slot />
        </span>
        <span v-if="check && selected" class="ds-option__check fm-check" aria-hidden="true"></span>
    </button>
</template>

<script setup>
defineProps({
    selected: { type: Boolean, default: false },
    title: { type: String, default: '' },
    sub: { type: String, default: '' },
    icon: { type: String, default: '' },
    layout: { type: String, default: 'row', validator: (v) => ['row', 'stack'].includes(v) },
    activeStyle: { type: String, default: 'fill', validator: (v) => ['fill', 'border'].includes(v) },
    check: { type: Boolean, default: false },
    checkSide: { type: String, default: 'right', validator: (v) => ['right', 'left'].includes(v) },
});
defineEmits(['select']);
</script>

<style lang="scss" scoped>
.ds-option {
    position: relative;
    display: flex;
    gap: var(--size-8);
    width: 100%;
    padding: var(--size-12) var(--size-16);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-sm);
    background: var(--surface-default);
    color: var(--text-default);
    text-align: left;
    cursor: pointer;
    transition: border-color var(--transition-fast) var(--ease-standard),
                background-color var(--transition-fast) var(--ease-standard);
}
.ds-option--row { align-items: center; }
.ds-option--stack { flex-direction: column; align-items: center; text-align: center; padding: var(--size-16); }
.ds-option:hover { border-color: var(--brand); }
.ds-option:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }

.ds-option__icon { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; font-size: var(--font-size-heading-m); color: var(--brand); }
.ds-option__body { display: flex; flex-direction: column; gap: var(--size-2); min-width: 0; flex: 1 1 auto; }
.ds-option--stack .ds-option__body { flex: 0 0 auto; align-items: center; }
.ds-option__title { white-space: normal; }
.ds-option__sub { color: var(--text-muted); }
.ds-option__check { flex: 0 0 auto; color: var(--text-placeholder); }
.ds-option--check-left .ds-option__check { order: -1; }

/* Выбранная — заливка brand. */
.ds-option--active-fill.is-selected { background: var(--brand); border-color: var(--brand); color: var(--text-on-brand); }
.ds-option--active-fill.is-selected .ds-option__sub { color: var(--text-on-brand); opacity: var(--opacity-hover); }
.ds-option--active-fill.is-selected .ds-option__icon,
.ds-option--active-fill.is-selected .ds-option__check { color: var(--text-on-brand); }

/* Выбранная — brand-рамка (без заливки). */
.ds-option--active-border.is-selected { border-color: var(--brand); }
.ds-option--active-border.is-selected .ds-option__title { color: var(--brand); }
</style>
