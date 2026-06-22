<template>
    <!--
        DsToastStack — ИЗВЛЕЧЁН из реального AppToastsContainer
        (resources/js/Components/Notification/AppToastsContainer.vue):
        глобальный фикс-контейнер для стопки тостов. На мобайле — сверху (top:0),
        на десктопе (≥768px) — снизу-справа (right/bottom). Контейнер не ловит клики
        (pointer-events:none), сами тосты — ловят. Рендерит список DsToast.
    -->
    <teleport to="body">
        <div
            class="ds-toast-stack"
            :class="positionClass"
            role="region"
            aria-label="Уведомления"
        >
            <transition-group tag="ol" name="ds-toast-stack" class="ds-toast-stack__list">
                <li
                    v-for="toast in visibleToasts"
                    :key="toast.id"
                    class="ds-toast-stack__item"
                >
                    <DsToast
                        :variant="toast.variant ?? 'info'"
                        :title="toast.title"
                        :subtitle="toast.message ?? toast.subtitle"
                        :dismissible="toast.dismissible ?? true"
                        @close="emit('dismiss', toast.id)"
                    />
                </li>
            </transition-group>
        </div>
    </teleport>
</template>

<script setup>
import { computed } from 'vue';
import DsToast from '@/Components/Ds/DsToast.vue';

const props = defineProps({
    // Очередь тостов: [{ id, variant, title, message, dismissible }].
    toasts: {
        type: Array,
        default: () => [],
    },
    // Позиция стека. По умолчанию адаптив: моб — сверху, десктоп — снизу-справа.
    position: {
        type: String,
        default: 'adaptive',
        validator: (v) => ['adaptive', 'top', 'bottom-right'].includes(v),
    },
    // Опциональный лимит одновременно видимых тостов (показываем последние).
    max: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['dismiss']);

// При лимите показываем последние max штук (новые внизу/сверху по позиции).
const visibleToasts = computed(() => {
    if (props.max > 0 && props.toasts.length > props.max) {
        return props.toasts.slice(props.toasts.length - props.max);
    }
    return props.toasts;
});

const positionClass = computed(() => `ds-toast-stack--${props.position}`);
</script>

<style lang="scss" scoped>
/* ─── Фикс-контейнер (реал .toastContainer): сверху на мобайле ───── */
.ds-toast-stack {
    position: fixed;
    z-index: var(--z-toast);
    inset-block-start: 0;
    inset-inline-start: 0;
    inline-size: 100%;
    padding: var(--size-16);
    pointer-events: none;
    max-block-size: 100%;
    overflow-x: clip;
    overflow-y: auto;
}

/* Десктоп: снизу-справа (реал @media min-width:768px). */
@media (min-width: 768px) {
    .ds-toast-stack--adaptive {
        inset-block-start: auto;
        inset-inline-start: auto;
        inset-inline-end: 0;
        inset-block-end: 0;
        /* Контентная константа ширины контейнера как в реале. */
        max-inline-size: 460px;
    }
}

/* Явная позиция «снизу-справа» (на всех ширинах). */
.ds-toast-stack--bottom-right {
    inset-block-start: auto;
    inset-inline-start: auto;
    inset-inline-end: 0;
    inset-block-end: 0;
    max-inline-size: 460px;
}

/* Явная позиция «сверху» — дефолтный layout контейнера, доп. правил нет. */

.ds-toast-stack__list {
    display: grid;
    grid-template-columns: 100%;
    gap: var(--size-12);
    list-style: none;
    padding: 0;
    margin: 0;
}

.ds-toast-stack__item {
    /* Сами тосты кликабельны, контейнер — нет. */
    pointer-events: auto;
}

/* ─── Анимация стека: появление + сдвиг соседей ─────────────────── */
.ds-toast-stack-enter-active,
.ds-toast-stack-leave-active {
    transition: opacity var(--transition-base) var(--ease-standard),
                transform var(--transition-base) var(--ease-standard);
}
.ds-toast-stack-enter-from,
.ds-toast-stack-leave-to {
    opacity: var(--opacity-hidden);
    transform: translateX(100%);
}
/* Плавный сдвиг оставшихся при удалении. */
.ds-toast-stack-leave-active {
    position: absolute;
    inline-size: calc(100% - var(--size-32));
}
.ds-toast-stack-move {
    transition: transform var(--transition-base) var(--ease-standard);
}

@media (prefers-reduced-motion: reduce) {
    .ds-toast-stack-enter-active,
    .ds-toast-stack-leave-active,
    .ds-toast-stack-move { transition: none; }
}
</style>
