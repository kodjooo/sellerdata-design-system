<template>
    <!--
        DsPopover — универсальный поповер (реал: Dropdown — слот триггера + всплывающая
        панель, закрытие по клику вне и Esc). База для more-button / inline-edit /
        вложенных меню. Триггер — слот по умолчанию, контент — слот #content.
        Панель телепортируется в <body> и позиционируется относительно триггера.
    -->
    <span ref="triggerEl" class="ds-popover__trigger" @click="toggle">
        <slot />
    </span>

    <teleport to="body">
        <transition name="ds-popover">
            <div
                v-if="isOpen"
                ref="panelEl"
                class="ds-popover__panel"
                role="dialog"
                :style="panelStyle"
            >
                <slot name="content" :close="close" />
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
    // Позиция панели относительно триггера.
    placement: {
        type: String,
        default: 'bottom-start',
        validator: (v) => ['bottom-start', 'bottom-end', 'top-start', 'top-end'].includes(v),
    },
    // Внешнее управление видимостью (v-model:open).
    open: { type: Boolean, default: false },
});
const emit = defineEmits(['update:open']);

const triggerEl = ref(null);
const panelEl = ref(null);
const isOpen = ref(props.open);
const panelStyle = ref({});

watch(() => props.open, (v) => { isOpen.value = v; });
watch(isOpen, (v) => {
    emit('update:open', v);
    if (v) {
        nextTick(updatePosition);
        addListeners();
    } else {
        removeListeners();
    }
});

function toggle() { isOpen.value = !isOpen.value; }
function close() { isOpen.value = false; }

function updatePosition() {
    const trigger = triggerEl.value;
    if (!trigger) return;
    const r = trigger.getBoundingClientRect();
    const top = props.placement.startsWith('top');
    const end = props.placement.endsWith('end');
    const style = { position: 'fixed' };
    if (top) {
        style.bottom = `${window.innerHeight - r.top + 4}px`;
    } else {
        style.top = `${r.bottom + 4}px`;
    }
    if (end) {
        style.right = `${window.innerWidth - r.right}px`;
    } else {
        style.left = `${r.left}px`;
    }
    panelStyle.value = style;
}

function onDocClick(e) {
    if (triggerEl.value?.contains(e.target)) return;
    if (panelEl.value?.contains(e.target)) return;
    close();
}
function onKeydown(e) { if (e.key === 'Escape') close(); }

function addListeners() {
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', onKeydown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
}
function removeListeners() {
    document.removeEventListener('click', onDocClick, true);
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', updatePosition);
    window.removeEventListener('scroll', updatePosition, true);
}

onBeforeUnmount(removeListeners);

defineExpose({ close });
</script>

<style lang="scss" scoped>
.ds-popover__trigger {
    display: inline-flex;
    cursor: pointer;
}

.ds-popover__panel {
    z-index: var(--z-popover);
    min-width: var(--size-128);
    padding: var(--size-4);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    background: var(--surface-default);
    box-shadow: var(--shadow-card);
}

.ds-popover-enter-active, .ds-popover-leave-active {
    transition: opacity var(--transition-fast) var(--ease-standard),
                transform var(--transition-fast) var(--ease-standard);
}
.ds-popover-enter-from, .ds-popover-leave-to {
    opacity: var(--opacity-hidden);
    transform: translateY(calc(-1 * var(--size-4)));
}
</style>
