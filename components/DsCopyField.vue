<template>
    <!--
        DsCopyField — поле «значение + копирование» (реал: реферальная ссылка в «Пригласи друга»).
        Опц. подпись сверху + бокс с border/субтл-фоном и DsCopyButton справа.
    -->
    <div class="ds-copy-field">
        <p v-if="label" class="t-body-s ds-copy-field__label">{{ label }}</p>
        <div class="ds-copy-field__box">
            <span class="t-body-s ds-copy-field__value" :class="{ 'is-break': $props.break }">{{ value }}</span>
            <DsCopyButton :text="value" class="ds-copy-field__copy" />
        </div>
    </div>
</template>

<script setup>
import DsCopyButton from '@/Components/Ds/DsCopyButton.vue';

defineProps({
    // Копируемое значение (ссылка, id, ключ).
    value: { type: String, required: true },
    // Подпись над полем.
    label: { type: String, default: '' },
    // Перенос длинного значения (для ссылок) — word-break.
    break: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.ds-copy-field__label { color: var(--text-default); margin: 0 0 var(--size-8); }

.ds-copy-field__box {
    display: flex; align-items: center; gap: var(--size-12);
    padding: var(--size-12) var(--size-16);
    border: 1px solid var(--border-input); border-radius: var(--radius-md);
    background: var(--surface-subtle);
}
.ds-copy-field__value { flex: 1 1 auto; color: var(--text-heading); }
.ds-copy-field__value.is-break { word-break: break-all; }
.ds-copy-field__copy { flex: 0 0 auto; }
</style>
