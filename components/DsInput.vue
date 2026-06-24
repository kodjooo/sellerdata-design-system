<template>
    <label class="ds-field">
        <span v-if="label" class="t-label-m ds-field__label">{{ label }}<span v-if="required" class="ds-field__req">*</span></span>
        <span class="ds-field__control" :class="{ 'ds-field__control--suffixed': suffix || suffixIcon }">
            <input
                class="ds-input"
                :class="{ 'is-error': error, 'ds-input--inline': inline }"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                @input="$emit('update:modelValue', $event.target.value)"
            />
            <span v-if="suffix" class="ds-input__suffix" aria-hidden="true">{{ suffix }}</span>
            <span v-else-if="suffixIcon" class="ds-input__suffix" :class="suffixIcon" aria-hidden="true"></span>
        </span>
        <span v-if="error" class="t-body-s ds-field__error">{{ error }}</span>
        <span v-else-if="helper" class="t-body-s ds-field__helper">{{ helper }}</span>
    </label>
</template>

<script setup>
/**
 * DsInput — ИЗВЛЕЧЁН ДОСЛОВНО из реального .input__text-input (main.scss:5606)
 * и состояния ошибки/disabled из _forms.scss. Значения 1:1 с текущим дизайном:
 *   border 1px --border-default · bg white · font 13px · padding 8/20 · radius 8
 *   min-height 42px · line-height 1.2 · color --text-default · disabled bg/border --border-default
 *   error: border --status-error. Сырые/legacy уже были токенами в реале — не менял.
 */
defineProps({
    modelValue: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    label: { type: String, default: '' },
    helper: { type: String, default: '' },
    error: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    // Inline-режим для ячеек таблицы: безрамочное компактное поле, рамка по hover/focus
    // (реал: product-cost-input / параметры склада / выкупщик).
    inline: { type: Boolean, default: false },
    // Суффикс в поле (₽/%) — реал inline-поля себестоимости/процентов.
    suffix: { type: String, default: '' },
    // Иконка-суффикс (класс fm-*), напр. лупа в поле поиска (реал — поиск расходов/настроек).
    suffixIcon: { type: String, default: '' },
});
defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
.ds-field { display: flex; flex-direction: column; gap: var(--size-6); width: 100%; margin: 0; }
.ds-field__label { color: var(--text-default); }
.ds-field__req { color: var(--status-danger); margin-left: 2px; }
.ds-field__control { display: block; position: relative; }
/* Суффикс ₽/% внутри поля справа */
.ds-field__control--suffixed .ds-input { padding-right: var(--size-32); }
.ds-input__suffix {
    position: absolute; top: 50%; right: var(--size-12); transform: translateY(-50%);
    color: var(--text-muted); font-size: var(--font-size-body-s); pointer-events: none;
}
.ds-field__error { color: var(--text-error); }
.ds-field__helper { color: var(--text-muted); }

/* .input__text-input — дословно */
.ds-input {
    border: 1px solid var(--border-default);
    background-color: var(--white);          /* real: --text-on-brand (=#fff) */
    font-size: var(--font-size-body-s);      /* rem(13px) */
    padding: var(--size-8) var(--size-20);   /* rem(8) rem(20) */
    border-radius: var(--radius-md);         /* rem(8) */
    width: 100%;
    color: var(--text-default);
    line-height: 1.2;
    display: block;
    min-height: var(--control-height-md);    /* 40 — единая высота контролов (= DsSelect), ровный тулбар */
    box-sizing: border-box;
    font-family: var(--font-family-sans);
    outline: none;
}
.ds-input::placeholder { color: var(--text-placeholder); }
.ds-input:focus { border-color: var(--brand); }
.ds-input:disabled {
    background: var(--border-default);
    border-color: var(--border-default);
}
.ds-input.is-error { border-color: var(--status-error); }

/* Inline-режим (ячейка таблицы): компактное безрамочное поле, рамка по hover/focus */
.ds-input--inline {
    border-color: transparent;
    background: transparent;
    min-height: var(--control-height-sm);    /* 32, плотнее ячейки */
    padding: var(--size-4) var(--size-8);
    border-radius: var(--radius-sm);
}
.ds-input--inline:hover { border-color: var(--border-default); }
.ds-input--inline:focus { border-color: var(--brand); background: var(--white); }
.ds-input--inline.is-error { border-color: var(--status-error); }
</style>
