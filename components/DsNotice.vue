<template>
    <!--
        DsNotice — информационный/онбординг-баннер (реал: подсказка на дашборде с превью
        и текстом). Слот #media слева (картинка/превью), текст в слоте по умолчанию,
        крестик закрытия справа.
    -->
    <transition name="ds-notice">
        <div v-if="visible" class="ds-notice" :class="`ds-notice--${tone}`" role="note">
            <div v-if="$slots.media" class="ds-notice__media">
                <slot name="media" />
            </div>
            <div class="ds-notice__body">
                <p v-if="title" class="t-label-m ds-notice__title">{{ title }}</p>
                <div class="t-body-s ds-notice__text"><slot /></div>
            </div>
            <button
                v-if="dismissible"
                type="button"
                class="ds-notice__close"
                aria-label="Закрыть"
                @click="onClose"
            >
                <span class="fm-x" aria-hidden="true"></span>
            </button>
        </div>
    </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    title: { type: String, default: '' },
    // Тон фона: plain (белый, default) | info (голубой) | peach (notice-палитра).
    tone: { type: String, default: 'plain', validator: (v) => ['plain', 'info', 'peach'].includes(v) },
    dismissible: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },
});
const emit = defineEmits(['close', 'update:visible']);
const visible = computed(() => props.visible);
function onClose() { emit('update:visible', false); emit('close'); }
</script>

<style lang="scss" scoped>
.ds-notice {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--size-16);
    padding: var(--size-16) var(--size-32) var(--size-16) var(--size-16);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    background: var(--surface-default);
    box-shadow: var(--shadow-card);
}
.ds-notice--info  { background: var(--notice-info-bg);  border-color: var(--notice-info-border); }
.ds-notice--peach { background: var(--notice-bg);       border-color: var(--notice-border); }

.ds-notice__media { flex: 0 0 auto; }
.ds-notice__media :deep(img) { display: block; border-radius: var(--radius-sm); }
.ds-notice__body { min-width: 0; }
.ds-notice__title { margin: 0 0 var(--size-4); color: var(--text-heading); }
.ds-notice__text { color: var(--text-default); line-height: var(--line-height-relaxed); }

.ds-notice__close {
    position: absolute;
    top: var(--size-12);
    right: var(--size-12);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size-24);
    height: var(--size-24);
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    font-size: var(--font-size-body-s);
    cursor: pointer;
    transition: background-color var(--transition-base) var(--ease-standard), color var(--transition-base) var(--ease-standard);
}
.ds-notice__close:hover { background: var(--surface-muted); color: var(--text-heading); }

.ds-notice-enter-active, .ds-notice-leave-active { transition: opacity var(--transition-base) var(--ease-standard); }
.ds-notice-enter-from, .ds-notice-leave-to { opacity: var(--opacity-hidden); }
</style>
