<template>
    <!--
        DsFormErrors — единый блок сводки состояния формы.
        Унифицирует два legacy-дубля из реала:
          • Components/AuthErrors.vue       (warning_block с одной ошибкой email, $page.props.errors)
          • Components/ValidationErrors.vue (список text-red-600 по всем ошибкам)
        Один компонент с вариантами error | success | warning.
        Список ошибок (variant=error) или одиночное сообщение (success/warning).
    -->
    <transition name="ds-form-errors">
        <div
            v-if="shown"
            class="ds-form-errors"
            :class="`ds-form-errors--${variant}`"
            :role="variant === 'error' ? 'alert' : 'status'"
        >
            <span class="ds-form-errors__icon" :class="iconClass" aria-hidden="true"></span>

            <div class="ds-form-errors__body">
                <!-- Список ошибок: либо переданные строки, либо одиночное message -->
                <ul v-if="items.length > 1" class="ds-form-errors__list t-body-s">
                    <li v-for="(item, i) in items" :key="i" v-html="item"></li>
                </ul>
                <p v-else class="t-body-s ds-form-errors__text" v-html="items[0]"></p>
            </div>

            <button
                v-if="dismissible"
                type="button"
                class="ds-form-errors__close"
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
    // Список ошибок. Принимает массив строк ИЛИ объект { field: message } (как $page.props.errors).
    errors: { type: [Array, Object], default: () => [] },
    // Одиночное сообщение (для success/warning, реал: form.statusData / status).
    message: { type: String, default: '' },
    // Вариант оформления: error (danger) | success | warning.
    variant: { type: String, default: 'error', validator: (v) => ['error', 'success', 'warning'].includes(v) },
    // Показывать крестик закрытия (реал AuthErrors — закрываемый).
    dismissible: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
});
const emit = defineEmits(['close', 'update:visible']);

// Нормализуем errors (массив | объект) + message в единый список строк.
const items = computed(() => {
    const list = Array.isArray(props.errors)
        ? props.errors.slice()
        : Object.values(props.errors || {});
    if (props.message) list.unshift(props.message);
    return list.filter(Boolean);
});

const shown = computed(() => props.visible && items.value.length > 0);

const iconClass = computed(() => ({
    error: 'fm-alert-circle',
    success: 'fm-check',
    warning: 'fm-alert-triangle',
}[props.variant]));

function onClose() {
    emit('update:visible', false);
    emit('close');
}
</script>

<style lang="scss" scoped>
.ds-form-errors {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--size-12);
    padding: var(--size-12) var(--size-32) var(--size-12) var(--size-16);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
}

/* error — danger-палитра (унификация warning_block из AuthErrors). */
.ds-form-errors--error {
    background: var(--status-danger-bg);
    border-color: var(--border-error);
}
.ds-form-errors--error .ds-form-errors__icon { color: var(--status-danger); }

/* success — статусное сообщение (реал: success_block / status). */
.ds-form-errors--success {
    background: var(--notice-success-bg);
    border-color: var(--notice-success-text);
}
.ds-form-errors--success .ds-form-errors__icon { color: var(--notice-success-text); }

/* warning — мягкое предупреждение. */
.ds-form-errors--warning {
    background: var(--notice-bg);
    border-color: var(--notice-border);
}
.ds-form-errors--warning .ds-form-errors__icon { color: var(--status-warning); }

.ds-form-errors__icon {
    flex: 0 0 auto;
    margin-top: var(--size-2);
    font-size: var(--font-size-body-l);
}

.ds-form-errors__body { min-width: 0; }
.ds-form-errors__text { margin: 0; color: var(--text-default); }

.ds-form-errors__list {
    margin: 0;
    padding-left: var(--size-16);
    color: var(--text-default);
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
}

.ds-form-errors__close {
    position: absolute;
    top: var(--size-8);
    right: var(--size-8);
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
    cursor: pointer;
}
.ds-form-errors__close:hover { color: var(--text-default); }

.ds-form-errors-enter-active,
.ds-form-errors-leave-active { transition: opacity 0.15s ease; }
.ds-form-errors-enter-from,
.ds-form-errors-leave-to { opacity: 0; }
</style>
