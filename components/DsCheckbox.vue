<template>
    <label class="ds-check" :class="{ 'is-disabled': disabled, 'ds-check--radio': type === 'radio' }">
        <input
            class="ds-check__input"
            :type="type"
            :checked="isChecked"
            :disabled="disabled"
            :value="value"
            @change="onChange"
        />
        <span class="ds-check__box" :class="{ 'is-error': error }"></span>
        <span v-if="label || $slots.default" class="t-body-s ds-check__label"><slot>{{ label }}</slot></span>
    </label>
</template>

<script setup>
/**
 * DsCheckbox — ИЗВЛЕЧЁН ДОСЛОВНО из .input__checkbox-label::before/::after (_forms.scss):
 *   индикатор 20×20, radius 4px (checkbox) / 50% (radio), border 2px --border-default, bg white.
 *   checked: border --brand + галочка; indeterminate: border --brand + черта; error: border --danger.
 * type: checkbox | radio.
 */
import { computed } from 'vue';

const props = defineProps({
    modelValue: { type: [Boolean, Array, String, Number], default: false },
    type: { type: String, default: 'checkbox' },
    value: { type: [String, Number, Boolean], default: true },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

const isChecked = computed(() => {
    if (Array.isArray(props.modelValue)) return props.modelValue.includes(props.value);
    if (props.type === 'radio') return props.modelValue === props.value;
    return !!props.modelValue;
});
function onChange(e) {
    if (props.type === 'radio') { emit('update:modelValue', props.value); return; }
    if (Array.isArray(props.modelValue)) {
        const next = [...props.modelValue];
        const i = next.indexOf(props.value);
        if (e.target.checked && i === -1) next.push(props.value);
        else if (!e.target.checked && i > -1) next.splice(i, 1);
        emit('update:modelValue', next);
        return;
    }
    emit('update:modelValue', e.target.checked);
}
</script>

<style lang="scss" scoped>
.ds-check {
    display: inline-flex;
    align-items: center;
    gap: var(--size-8);
    min-height: 20px;            /* real label min-height: rem(20) */
    line-height: 1.2;
    cursor: pointer;
}
.ds-check__input { position: absolute; opacity: 0; width: 0; height: 0; }

/* .input__checkbox-label::before — дословно */
.ds-check__box {
    flex: 0 0 auto;
    width: 20px;                 /* rem(20) */
    height: 20px;
    border-radius: var(--radius-sm); /* rem(4) */
    border: 2px solid var(--border-default);
    background: var(--white) no-repeat center center;
    box-sizing: border-box;
    position: relative;
}
.ds-check[class*="radio"] .ds-check__box,
.ds-check__box.is-radio { border-radius: var(--radius-full); }

/* checked: рамка --brand + галочка (CSS-аналог checked-icon.svg) */
.ds-check__input:checked ~ .ds-check__box {
    border-color: var(--brand);
}
.ds-check__input:checked ~ .ds-check__box::after {
    content: "";
    position: absolute;
    left: 5px; top: 1px;
    width: 6px; height: 11px;
    border: solid var(--brand);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}
.ds-check__input:indeterminate ~ .ds-check__box {
    border-color: var(--brand);
}
.ds-check__input:indeterminate ~ .ds-check__box::after {
    content: "";
    position: absolute;
    left: 3px; right: 3px; top: 50%;
    height: 2px; margin-top: -1px;
    background: var(--brand);
}
/* Radio без общего name считается :indeterminate, когда не выбран — гасим ложный «минус». */
.ds-check--radio .ds-check__input:indeterminate ~ .ds-check__box { border-color: var(--border-default); }
.ds-check--radio .ds-check__input:indeterminate ~ .ds-check__box::after { content: none; }
/* Radio: отмеченный — залитая точка по центру (а не галочка). */
.ds-check--radio .ds-check__input:checked ~ .ds-check__box::after {
    left: 50%; top: 50%;
    width: 10px; height: 10px;
    border: 0; border-radius: var(--radius-full);
    background: var(--brand);
    transform: translate(-50%, -50%);
}
.ds-check__box.is-error { border-color: var(--status-danger); }
.ds-check__label { color: var(--text-default); }
.ds-check.is-disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }
</style>
