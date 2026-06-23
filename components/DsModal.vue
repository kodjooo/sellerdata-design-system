<template>
    <!-- Телепорт в body, чтобы backdrop/окно не зависели от overflow/transform родителей. -->
    <teleport to="body">
        <transition name="ds-modal-fade">
            <!-- modelValue управляет показом (v-show по требованию задачи: держим в DOM). -->
            <div
                v-show="modelValue"
                class="ds-modal__backdrop"
                @click.self="onBackdrop"
            >
                <transition name="ds-modal-pop">
                    <div
                        v-show="modelValue"
                        ref="dialogRef"
                        class="ds-modal"
                        :class="`ds-modal--${size}`"
                        role="dialog"
                        aria-modal="true"
                        :aria-labelledby="titleId"
                        tabindex="-1"
                        @keydown.esc="onEsc"
                    >
                        <!-- ─── Шапка (brand-gradient) ─────────────────────── -->
                        <header class="ds-modal__header">
                            <slot name="header">
                                <h2 :id="titleId" class="t-title-m ds-modal__title">{{ title }}</h2>
                            </slot>
                            <button
                                v-if="closable"
                                type="button"
                                class="ds-modal__close"
                                aria-label="Закрыть"
                                @click="close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </header>

                        <!-- ─── Тело ───────────────────────────────────────── -->
                        <div class="ds-modal__body">
                            <slot />
                        </div>

                        <!-- ─── Футер (только если задан слот) ─────────────── -->
                        <div v-if="$slots.footer" class="ds-modal__footer">
                            <slot name="footer" />
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
    // Видимость модалки (v-model).
    modelValue: { type: Boolean, default: false },
    // Заголовок по умолчанию (если не задан слот header).
    title: { type: String, default: '' },
    // Размер окна: sm | md | lg | fullscreen.
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['sm', 'md', 'lg', 'fullscreen'].includes(v),
    },
    // Закрытие кликом по подложке.
    closeOnBackdrop: { type: Boolean, default: true },
    // Закрытие по Esc.
    closeOnEsc: { type: Boolean, default: true },
    // Показывать крестик закрытия.
    closable: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue', 'close']);

const dialogRef = ref(null);

// Уникальный id для aria-labelledby.
const uid = Math.random().toString(36).slice(2, 9);
const titleId = computed(() => `ds-modal-title-${uid}`);

function close() {
    emit('update:modelValue', false);
    emit('close');
}
function onBackdrop() {
    if (props.closeOnBackdrop) close();
}
function onEsc() {
    if (props.closeOnEsc) close();
}

// Блокируем скролл страницы и переводим фокус на окно при открытии.
watch(
    () => props.modelValue,
    (open) => {
        if (typeof document === 'undefined') return;
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) nextTick(() => dialogRef.value?.focus());
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    if (typeof document !== 'undefined') document.body.style.overflow = '';
});
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

/* ─── Backdrop (канон Modal: --gray-900 .5, --z-overlay) ──────── */
.ds-modal__backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-overlay);
    display: flex;
    align-items: stretch;
    justify-content: center;
    background: rgb(from var(--gray-900) r g b / 0.5);

    @include respond-to(md) {
        align-items: center;
        padding: var(--size-16);
    }
}

/* ─── Окно (канон Modal: --surface-default, --shadow-overlay) ── */
.ds-modal {
    position: relative;
    z-index: var(--z-modal);
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 100dvh;
    background: var(--surface-default);
    color: var(--text-default);
    /* Мобайл: во весь экран → радиус 0 (канон адаптивности). */
    border-radius: 0;
    box-shadow: var(--shadow-overlay);
    overflow: hidden;
    outline: none;

    @include respond-to(md) {
        max-height: calc(100dvh - var(--size-64));
        border-radius: var(--radius-md);
    }
}

/* Размеры окна — действуют от md (на мобайле всегда fullscreen). */
@include respond-to(md) {
    .ds-modal--sm { max-width: 460px; }   /* real .modal-basic (≥576): rem(460) */
    .ds-modal--md { max-width: 600px; }   /* real .modal-basic (≥768): rem(600) — было 460, узко */
    .ds-modal--lg { max-width: 720px; }
}

/* Fullscreen — на весь экран и на десктопе. */
.ds-modal--fullscreen {
    @include respond-to(md) {
        width: 100vw;
        max-width: 100vw;
        height: 100dvh;
        max-height: 100dvh;
        border-radius: 0;
    }
}

/* ─── Шапка (brand-gradient, белый текст/крестик — по эталонам) ─ */
.ds-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-8);
    min-height: 50px;                 /* real .modal-header min-height: rem(50) */
    padding: var(--size-20);          /* real: rem(20) со всех сторон */
    background: var(--brand-gradient);
    color: var(--text-on-brand);
}
.ds-modal__title {
    margin: 0;
    flex: 1 1 auto;
    min-width: 0;
    color: var(--text-on-brand);
}

/* Крестик закрытия (канон icon-btn: --control-height-sm, --radius-sm) */
.ds-modal__close {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--control-height-sm);
    height: var(--control-height-sm);
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-on-brand);
    font-size: var(--font-size-heading-m);
    line-height: var(--line-height-tight);
    cursor: pointer;
    transition: background-color var(--transition-fast) var(--ease-standard);
}
.ds-modal__close:hover { background: rgb(from var(--white) r g b / 0.3); }
.ds-modal__close:focus-visible { box-shadow: var(--shadow-input-focus); outline: none; }

/* ─── Тело ───────────────────────────────────────────────────── */
.ds-modal__body {
    flex: 1 1 auto;
    padding: var(--size-20);
    color: var(--text-default);
    overflow-y: auto;
}

/* ─── Футер (канон: border-top от --size-20, gap --size-8) ────── */
.ds-modal__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--size-8);
    padding: var(--size-20);
    border-top: 1px solid var(--border-default);
}
/* В модалке кнопки сжимаются по контенту (реал .modal-footer .btn-default
   { min-width: auto }) — иначе min-width:145 делает их «коробками». */
.ds-modal__footer :deep(.ds-btn) { min-width: auto; }

/* ─── Анимация: backdrop fade + окно pop (translateY) ─────────── */
.ds-modal-fade-enter-active,
.ds-modal-fade-leave-active {
    transition: opacity var(--transition-base) var(--ease-standard);
}
.ds-modal-fade-enter-from,
.ds-modal-fade-leave-to { opacity: var(--opacity-hidden); }

.ds-modal-pop-enter-active,
.ds-modal-pop-leave-active {
    transition: opacity var(--transition-slow) var(--ease-standard),
                transform var(--transition-slow) var(--ease-standard);
}
.ds-modal-pop-enter-from,
.ds-modal-pop-leave-to {
    opacity: var(--opacity-hidden);
    transform: translateY(var(--size-8));
}
</style>
