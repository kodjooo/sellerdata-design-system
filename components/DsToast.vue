<template>
    <!--
        DsToast — ИЗВЛЕЧЁН из реального AppToast (resources/js/Components/Notification/AppToast.vue):
        белая карточка БЕЗ цветной полосы, иконка + заголовок (13/500) + подзаголовок (12),
        крестик в правом верхнем углу, выезд СПРАВА. Авто-скрытие и свайп — на стороне
        реального контейнера; здесь — визуальный эталон.
    -->
    <transition name="ds-toast-slide" appear>
        <div
            v-if="modelVisible"
            class="ds-toast"
            role="status"
            :aria-live="variant === 'danger' ? 'assertive' : 'polite'"
            :style="swipeX ? { transform: `translateX(${swipeX}px)`, transition: 'none' } : null"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
        >
            <button
                v-if="dismissible"
                type="button"
                class="ds-toast__close"
                aria-label="Закрыть уведомление"
                @click="onClose"
            >
                <span aria-hidden="true">×</span>
            </button>

            <div class="ds-toast__inner">
                <span v-if="$slots.icon || variant !== 'none'" class="ds-toast__icon" aria-hidden="true">
                    <slot name="icon">{{ variantIcon }}</slot>
                </span>
                <div class="ds-toast__body">
                    <p v-if="title" class="ds-toast__title">{{ title }}</p>
                    <p v-if="subtitle || $slots.default" class="ds-toast__subtitle">
                        <slot>{{ subtitle }}</slot>
                    </p>
                </div>
            </div>

            <div v-if="$slots.actions" class="ds-toast__actions">
                <slot name="actions" />
            </div>
        </div>
    </transition>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    // Семантика → только глиф иконки (в реале цвет иконки нейтральный --dark-grey).
    variant: {
        type: String,
        default: 'info',
        validator: (v) => ['none', 'info', 'success', 'warning', 'danger'].includes(v),
    },
    // Заголовок (13/500).
    title: { type: String, default: '' },
    // Подзаголовок (12). Можно передать и слотом по умолчанию.
    subtitle: { type: String, default: '' },
    // Показать крестик закрытия.
    dismissible: { type: Boolean, default: true },
    // Видимость (v-model:visible).
    visible: { type: Boolean, default: true },
    // Закрытие свайпом вправо (мобайл). Порог 100px (жест, не layout).
    swipeDismiss: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'update:visible']);

const modelVisible = computed(() => props.visible);

// Свайп-вправо для закрытия (реал AppToast): тянем только вправо, порог 100px.
const SWIPE_THRESHOLD = 100;
const touchStartX = ref(0);
const swipeX = ref(0);
function onTouchStart(e) {
    if (!props.swipeDismiss) return;
    touchStartX.value = e.changedTouches[0].screenX;
}
function onTouchMove(e) {
    if (!props.swipeDismiss) return;
    const diff = e.changedTouches[0].screenX - touchStartX.value;
    swipeX.value = Math.max(0, Math.min(diff, 200));
}
function onTouchEnd() {
    if (!props.swipeDismiss) return;
    if (swipeX.value > SWIPE_THRESHOLD) onClose();
    swipeX.value = 0;
}

const variantIcon = computed(
    () =>
        ({
            info: 'ⓘ',
            success: '✓',
            warning: '⚠',
            danger: '✕',
        })[props.variant] ?? ''
);

function onClose() {
    emit('update:visible', false);
    emit('close');
}
</script>

<style lang="scss" scoped>
/* ─── Карточка тоста (реал .appToast): белая, тень, радиус 8 ────── */
.ds-toast {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--size-8);
    /* pad 12, справа 36 под крестик (реал padding-inline-end: 36px). */
    padding: var(--size-12);
    padding-inline-end: var(--size-32);
    background: var(--surface-default);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-overlay);
    color: var(--text-default);
    /* Контентная константа: ширина тоста как в реале. */
    max-inline-size: 360px;
}

.ds-toast__inner {
    display: flex;
    align-items: flex-start;
    gap: var(--size-8);
    min-width: 0;
}

/* Иконка нейтральная (реал .appToast__ico — --dark-grey). */
.ds-toast__icon {
    flex-shrink: 0;
    font-size: var(--font-size-body-s);
    line-height: 1.1;
    color: var(--text-muted);
}

.ds-toast__body { min-width: 0; }
/* Заголовок 13/500 (реал .appToast__title). */
.ds-toast__title {
    margin: 0;
    font-size: var(--font-size-body-s);
    font-weight: var(--font-weight-medium);
    line-height: 1.1;
    color: var(--text-heading);
}
/* Подзаголовок 12 (реал .appToast__subtitle). */
.ds-toast__subtitle {
    margin: var(--size-2) 0 0;
    font-size: 12px;
    line-height: 1.2;
    color: var(--text-default);
}

.ds-toast__actions {
    display: flex;
    align-items: center;
    gap: var(--size-4);
    flex-shrink: 0;
}

/* Крестик закрытия в правом верхнем углу (реал .appToast__close: 22px, радиус 5). */
.ds-toast__close {
    position: absolute;
    inset-block-start: var(--size-8);
    inset-inline-end: var(--size-8);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size-24);
    aspect-ratio: 1;
    flex-shrink: 0;
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    font-size: var(--font-size-title-m);
    line-height: 1;
    cursor: pointer;
    transition: background-color var(--transition-base) var(--ease-standard),
                color var(--transition-base) var(--ease-standard);
}
.ds-toast__close:hover { background: var(--surface-muted); color: var(--text-heading); }
.ds-toast__close:focus-visible { box-shadow: var(--shadow-input-focus); outline: none; }

/* ─── Выезд справа (реал slideIn: translateX(100%)) ────────────── */
.ds-toast-slide-enter-active { animation: ds-toast-in var(--transition-slow) var(--ease-standard); }
.ds-toast-slide-leave-active { animation: ds-toast-out var(--transition-slow) var(--ease-standard); }

@keyframes ds-toast-in {
    from { opacity: var(--opacity-hidden); transform: translateX(100%); }
    to   { opacity: var(--opacity-full);   transform: translateX(0); }
}
@keyframes ds-toast-out {
    from { opacity: var(--opacity-full);   transform: translateX(0); }
    to   { opacity: var(--opacity-hidden); transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
    .ds-toast-slide-enter-active,
    .ds-toast-slide-leave-active { animation: none; }
}
</style>
