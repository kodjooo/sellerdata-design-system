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

<script>
// Общее состояние экземпляров: скрытый v-show не владеет фокусом и scroll lock.
const activeModals = [];
let bodyOverflow = '';

function isVisible(element) {
    if (!element?.isConnected || element.closest('[hidden], [inert]')) return false;
    const style = element.ownerDocument.defaultView.getComputedStyle(element);
    return style.visibility !== 'hidden' && style.visibility !== 'collapse'
        && element.getClientRects().length > 0;
}

function topModal() {
    // Все backdrop имеют один z-index: последний в DOM нарисован поверх остальных.
    return activeModals.filter((modal) => isVisible(modal.dialog())).sort((a, b) =>
        a.dialog().compareDocumentPosition(b.dialog()) & 4 ? -1 : 1
    ).at(-1);
}
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue';

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
const modal = { dialog: () => dialogRef.value, initiator: null };
const popups = new Set();
let disposed = false;
let revision = 0;

// trigger/menu — геттеры DOM-элементов; регистрация возвращает функцию отписки.
provide(Symbol.for('sellerdata:ds:focusScope'), {
    registerPopup(popup) {
        popups.add(popup);
        return () => popups.delete(popup);
    },
});

const focusableSelector = 'a[href], area[href], button, input, select, textarea, '
    + 'iframe, object, embed, [contenteditable], [tabindex], audio[controls], video[controls], summary';

function focusables(root) {
    if (!root) return [];
    return Array.from(root.querySelectorAll(focusableSelector)).filter((element) =>
        element.tabIndex >= 0 && !element.matches(':disabled, [aria-disabled="true"]')
        && isVisible(element)
    ).sort((a, b) => (a.tabIndex || Infinity) - (b.tabIndex || Infinity));
}

function visiblePopups() {
    return Array.from(popups, (popup) => ({
        trigger: popup.trigger(),
        menu: popup.menu(),
        close: popup.close,
    })).filter(({ trigger, menu }) =>
        dialogRef.value?.contains(trigger) && isVisible(trigger) && isVisible(menu)
    );
}

function focusDialog() {
    const dialog = dialogRef.value;
    if (isVisible(dialog)) (focusables(dialog)[0] || dialog).focus({ preventScroll: true });
}

function onKeydown(event) {
    if (!props.modelValue || topModal() !== modal) return;
    const menus = visiblePopups();
    if (event.key === 'Escape') {
        if (menus.length) {
            // Escape календаря не должен закрывать родительскую модалку.
            event.preventDefault();
            event.stopImmediatePropagation();
            const popup = menus.find(({ menu }) => menu.contains(event.target)) || menus.at(-1);
            popup.close();
            (focusables(popup.trigger)[0] || dialogRef.value)?.focus({ preventScroll: true });
        } else if (!event.defaultPrevented && props.closeOnEsc) {
            event.preventDefault();
            event.stopImmediatePropagation();
            close();
        }
        return;
    }
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;

    // Пересчитываем на каждое нажатие: слоты, disabled и меню могут меняться.
    const elements = focusables(dialogRef.value);
    for (const { menu, trigger } of menus) {
        const triggerElements = focusables(trigger);
        const index = elements.indexOf(triggerElements.at(-1));
        elements.splice(index < 0 ? elements.length : index + 1, 0, ...focusables(menu));
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    const index = elements.indexOf(document.activeElement);
    const next = index < 0 ? (event.shiftKey ? elements.length - 1 : 0)
        : (index + (event.shiftKey ? -1 : 1) + elements.length) % elements.length;
    (elements[next] || dialogRef.value)?.focus({ preventScroll: true });
}

function deactivate() {
    const index = activeModals.indexOf(modal);
    if (index < 0) return;
    const wasTop = topModal() === modal;
    const ownedFocus = dialogRef.value?.contains(document.activeElement)
        || visiblePopups().some(({ menu }) => menu.contains(document.activeElement));
    visiblePopups().forEach(({ close }) => close());
    activeModals.splice(index, 1);
    document.removeEventListener('keydown', onKeydown, true);
    // Если нижнюю модалку закрыли раньше верхней, сохраняем цепочку возврата.
    activeModals.forEach((other) => {
        if (dialogRef.value?.contains(other.initiator)) other.initiator = modal.initiator;
    });
    if (!activeModals.length) document.body.style.overflow = bodyOverflow;
    const initiator = modal.initiator;
    modal.initiator = null;
    if (!wasTop && !ownedFocus) return;
    const currentRevision = revision;
    nextTick(() => {
        if (revision !== currentRevision || (props.modelValue && !disposed)) return;
        const remaining = topModal();
        if (isVisible(initiator) && !initiator.matches(':disabled')
            && (!remaining || remaining.dialog().contains(initiator))) {
            initiator.focus({ preventScroll: true });
        } else if (remaining) {
            const dialog = remaining.dialog();
            (focusables(dialog)[0] || dialog).focus({ preventScroll: true });
        }
    });
}

watch(
    () => props.modelValue,
    (open) => {
        if (typeof document === 'undefined') return;
        const currentRevision = ++revision;
        if (!open) {
            deactivate();
            return;
        }
        modal.initiator = document.activeElement;
        if (!activeModals.length) {
            bodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        }
        activeModals.push(modal);
        document.addEventListener('keydown', onKeydown, true);
        nextTick(() => {
            if (!disposed && props.modelValue && revision === currentRevision && topModal() === modal) {
                focusDialog();
            }
        });
    },
    { immediate: true, flush: 'sync' }
);

onBeforeUnmount(() => {
    disposed = true;
    revision++;
    if (typeof document !== 'undefined') deactivate();
    popups.clear();
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
