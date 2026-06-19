<template>
    <label class="ds-field">
        <span v-if="label" class="t-label-m ds-field__label">{{ label }}<span v-if="required" class="ds-field__req">*</span></span>
        <span class="ds-field__control">
            <input
                class="ds-input"
                :class="{ 'is-error': error }"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :readonly="readonly"
                @input="$emit('update:modelValue', $event.target.value)"
            />
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
});
defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
.ds-field { display: flex; flex-direction: column; gap: var(--size-6); width: 100%; }
.ds-field__label { color: var(--text-default); }
.ds-field__req { color: var(--status-danger); margin-left: 2px; }
.ds-field__control { display: block; }
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
    min-height: 42px;                        /* real: rem(42) — кандидат на унификацию к 40 */
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
</style>
