<template>
    <!-- DsCopyButton — копирование текста (id/артикул) по клику. Реал: иконка-копир у nmId. -->
    <button
        type="button"
        class="ds-copy"
        :class="{ 'is-done': done }"
        :aria-label="done ? 'Скопировано' : 'Скопировать'"
        @click.stop="copy"
    >
        <span class="ds-copy__icon" :class="done ? 'fm-check' : 'fm-copy'" aria-hidden="true"></span>
    </button>
</template>

<script setup>
import { ref } from 'vue';
import { copyText } from '@/utils/clipboard';

const props = defineProps({
    // Текст для копирования.
    text: { type: [String, Number], default: '' },
});

const done = ref(false);
function copy() {
    copyText(String(props.text));
    done.value = true;
    setTimeout(() => { done.value = false; }, 1200);
}
</script>

<style lang="scss" scoped>
.ds-copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--transition-fast) var(--ease-standard);
}
.ds-copy:hover { color: var(--brand); }
.ds-copy.is-done { color: var(--status-success); }
.ds-copy__icon { font-size: var(--font-size-body-s); line-height: 1; }
</style>
