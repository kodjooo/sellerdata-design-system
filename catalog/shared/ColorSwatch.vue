<template>
    <div class="dsSwatch" @click="copy">
        <div
            class="dsSwatch__preview"
            :class="{ 'dsSwatch__preview-light': isLight }"
            :style="{ background: bg }"
        >
            <span v-if="copied" class="dsSwatch__copied">Скопировано</span>
        </div>
        <div class="dsSwatch__body">
            <code class="dsSwatch__name">{{ name }}</code>
            <div class="dsSwatch__value">
                <span v-if="hex">{{ hex }}</span>
                <span v-if="ref" class="dsSwatch__ref">→ <code>{{ ref }}</code></span>
            </div>
            <p v-if="note" class="dsSwatch__note">{{ note }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref as vueRef, computed } from 'vue';
import { copyText } from '@/utils/clipboard';

const props = defineProps({
    name:  { type: String, required: true },
    hex:   { type: String, default: '' },
    ref:   { type: String, default: '' },
    value: { type: String, default: '' },   // для не-цветовых токенов или градиентов
    note:  { type: String, default: '' },
});

const copied = vueRef(false);

const bg = computed(() => {
    if (props.value) return props.value;
    return `var(${props.name})`;
});

// Светлый ли свотч (нужен бордер чтобы белое не сливалось с фоном)
const isLight = computed(() => {
    if (!props.hex) return false;
    const h = props.hex.replace('#', '');
    if (h.length !== 6 && h.length !== 3) return false;
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    // luminance ≈ 0.299*r + 0.587*g + 0.114*b
    return (0.299 * r + 0.587 * g + 0.114 * b) > 220;
});

async function copy() {
    const ok = await copyText(props.name);
    if (!ok) return;
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1500);
}
</script>

<style scoped>
.dsSwatch {
    display: flex;
    flex-direction: column;
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow .15s ease, transform .15s ease;
}
.dsSwatch:hover {
    box-shadow: var(--shadow-card);
    transform: translateY(-1px);
}

.dsSwatch__preview {
    height: 96px;
    position: relative;
}
.dsSwatch__preview-light {
    border-bottom: 1px solid var(--border-default);
}

.dsSwatch__copied {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--overlay-dark-40, rgba(0, 0, 0, 0.4));
    color: var(--text-on-brand);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-semibold);
}

.dsSwatch__body {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.dsSwatch__name {
    font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--text-heading);
    background: var(--surface-muted);
    padding: 2px 6px;
    border-radius: 4px;
    align-self: flex-start;
    word-break: break-all;
}

.dsSwatch__value {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font-size: var(--font-size-caption);
    color: var(--text-muted);
    font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
}

.dsSwatch__value code {
    background: var(--surface-muted);
    padding: 0 4px;
    border-radius: 3px;
    font-size: 11px;
}

.dsSwatch__ref {
    color: var(--text-muted);
}

.dsSwatch__note {
    font-size: var(--font-size-body-s);
    line-height: var(--line-height-relaxed);
    color: var(--text-default);
    margin: 4px 0 0;
}
</style>
