<template>
    <!--
        DsSwitch — тоггл-переключатель on/off (реал .input__toggle-label::before/::after из _forms.scss):
        трек 34×20, border 2px, костяшка 14×14 (radius 50%), переход .2s transform/background.
        on = заливка --brand; off = --border-default (трек), белая костяшка.
        Опц. подпись (label/слот) + info-иконка с подсказкой (слот #hint, рендерится через DsTooltip).
        ARIA: role="switch" + aria-checked; клик/Space переключают; фокус-обводка --shadow-input-focus.
    -->
    <label class="ds-switch" :class="{ 'is-disabled': disabled }">
        <button
            :id="id || undefined"
            type="button"
            role="switch"
            class="ds-switch__track"
            :class="{ 'is-on': modelValue }"
            :aria-checked="modelValue ? 'true' : 'false'"
            :disabled="disabled"
            @click="toggle"
            @keydown.space.prevent="toggle"
        >
            <span class="ds-switch__knob"></span>
        </button>
        <span v-if="label || $slots.default" class="t-body-s ds-switch__label">
            <slot>{{ label }}</slot>
            <DsTooltip v-if="$slots.hint" class="ds-switch__hint">
                <span class="ds-switch__hint-icon" aria-hidden="true">?</span>
                <template #content><slot name="hint" /></template>
            </DsTooltip>
        </span>
    </label>
</template>

<script setup>
import DsTooltip from './DsTooltip.vue';

const props = defineProps({
    // v-model: состояние вкл/выкл.
    modelValue: { type: Boolean, default: false },
    // Заблокированный переключатель (не реагирует, приглушён).
    disabled: { type: Boolean, default: false },
    // Подпись справа от свитча (или используйте слот по умолчанию).
    label: { type: String, default: '' },
    // id для связи с внешним <label for>.
    id: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue', 'change']);

function toggle() {
    if (props.disabled) return;
    const next = !props.modelValue;
    emit('update:modelValue', next);
    emit('change', next);
}
</script>

<style lang="scss" scoped>
.ds-switch {
    display: inline-flex;
    align-items: center;
    gap: var(--size-8);
    line-height: 1.2;
    cursor: pointer;
}

/* трек — реал .input__toggle-label::before: 34×20, border 2px, radius full */
.ds-switch__track {
    flex: 0 0 auto;
    position: relative;
    width: 34px;                 /* нет точного --size-34, реал rem(34) */
    height: var(--size-20);      /* 20 */
    padding: 0;
    border: var(--size-2) solid var(--border-default);
    border-radius: var(--radius-full);
    background: var(--white);
    box-sizing: border-box;
    cursor: pointer;
    transition:
        background var(--transition-base) var(--ease-standard),
        border-color var(--transition-base) var(--ease-standard);
}
.ds-switch__track:focus-visible {
    outline: none;
    box-shadow: var(--shadow-input-focus);
}

/* костяшка — реал ::after: 14×14, radius 50%, off=--border-default, on=белая, сдвиг по transform */
.ds-switch__knob {
    position: absolute;
    top: var(--size-2);          /* (20 - 2*border - 14) / 2 = 1px визуально; ближайший --size-2 */
    left: var(--size-2);
    width: 14px;                 /* нет точного --size-14, реал rem(14) */
    height: 14px;
    border-radius: var(--radius-full);
    background: var(--border-default);
    transition: transform var(--transition-base) var(--ease-standard),
                background var(--transition-base) var(--ease-standard);
}

/* on-состояние */
.ds-switch__track.is-on {
    background: var(--brand);
    border-color: var(--brand);
}
.ds-switch__track.is-on .ds-switch__knob {
    background: var(--white);
    transform: translateX(14px);  /* ширина трека минус костяшка минус 2 border */
}

.ds-switch__label {
    display: inline-flex;
    align-items: center;
    gap: var(--size-4);
    color: var(--text-default);
}
.ds-switch__hint { line-height: 1; }
.ds-switch__hint-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size-16);
    height: var(--size-16);
    border-radius: var(--radius-full);
    background: var(--border-default);
    color: var(--text-on-brand);
    font-size: var(--font-size-caption);
    line-height: 1;
}

.ds-switch.is-disabled {
    opacity: var(--opacity-disabled);
    cursor: not-allowed;
}
.ds-switch.is-disabled .ds-switch__track { cursor: not-allowed; }
</style>
