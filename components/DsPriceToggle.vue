<template>
    <!--
        DsPriceToggle — сегментный radio-group (срок оплаты / валюта).
        Извлечён из эталона Screens/Settings.vue (.segment / .segment__btn) — там этот
        паттерн уже сделан локально вместо реального .input._radioGroup из Pages/Pricing.vue.
        v-model — выбранный ключ опции (options[].key).
        Опция может нести badge (например «-10%» / «-20%» из реала halfyearly/yearly).
    -->
    <div class="ds-price-toggle">
        <span v-if="label" class="t-body-s ds-price-toggle__label">{{ label }}</span>
        <div class="segment" role="radiogroup" :aria-label="label || null">
            <button
                v-for="opt in options"
                :key="opt.key"
                type="button"
                role="radio"
                :aria-checked="opt.key === modelValue"
                class="segment__btn"
                :class="{ 'is-active': opt.key === modelValue }"
                @click="$emit('update:modelValue', opt.key)"
            >
                <span>{{ opt.label }}</span>
                <span v-if="opt.badge" class="segment__badge">{{ opt.badge }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    // Выбранный ключ (совпадает с options[].key).
    modelValue: { type: [String, Number], default: '' },
    // Опции сегмента: [{ key, label, badge? }]. badge — например «-10%».
    options: { type: Array, default: () => [] },
    // Необязательная подпись над сегментом (реал: «Срок оплаты» / «Валюта»).
    label: { type: String, default: '' },
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
.ds-price-toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-8);
}
.ds-price-toggle__label {
    color: var(--text-heading);
    font-weight: var(--font-weight-semibold);
}

/* Сегмент (реал .input._radioGroup → эталон Settings .segment): pill-контейнер. */
.segment {
    display: inline-flex;
    align-items: center;
    gap: var(--size-2);
    padding: var(--size-4);
    border-radius: var(--radius-full);
    background: transparent;
    border: 1px solid var(--border-default);
}
.segment__btn {
    display: inline-flex;
    align-items: center;
    gap: var(--size-6);
    padding: var(--size-4) var(--size-20);
    border: 0;
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--text-default);
    font-size: var(--font-size-body-s);
    cursor: pointer;
    white-space: nowrap;
    transition: background-color var(--transition-fast) var(--ease-standard);
}
.segment__btn.is-active { background: var(--brand); color: var(--text-on-brand); }
/* Бейдж скидки (реал radioGroupDropdown__badge): на активной — белый полупрозрачный. */
.segment__badge {
    padding: var(--size-2) var(--size-6);
    border-radius: var(--radius-full);
    background: rgb(from var(--white) r g b / 0.2);
    font-size: var(--font-size-caption);
}
.segment__btn:not(.is-active) .segment__badge {
    background: var(--surface-disabled);
    color: var(--text-muted);
}
</style>
