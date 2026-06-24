<template>
    <div class="dsColorTable">
        <table>
            <thead>
                <tr>
                    <th class="dsColorTable__thPreview" aria-label="Превью"></th>
                    <th>Токен</th>
                    <th>Значение</th>
                    <th>Описание</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in tokens" :key="t.name" class="dsColorTable__row">
                    <td class="dsColorTable__previewCell">
                        <span
                            class="dsColorTable__preview"
                            :class="{ 'dsColorTable__preview-light': isLight(t.hex) }"
                            :style="{ background: bgFor(t) }"
                        ></span>
                    </td>
                    <td class="dsColorTable__nameCell">
                        <button
                            type="button"
                            class="dsCopy"
                            :class="{ '_isDone': copiedKey === t.name + ':name' }"
                            :title="`Скопировать ${t.name}`"
                            @click="copy(t.name, t.name + ':name')"
                        >
                            <code>{{ t.name }}</code>
                            <span class="dsCopy__icon" aria-hidden="true">
                                <CopyIcon v-if="copiedKey !== t.name + ':name'" />
                                <CheckIcon v-else />
                            </span>
                        </button>
                    </td>
                    <td class="dsColorTable__valueCell">
                        <button
                            v-if="copyableValue(t)"
                            type="button"
                            class="dsCopy _asValue"
                            :class="{ '_isDone': copiedKey === t.name + ':value' }"
                            :title="`Скопировать ${copyableValue(t)}`"
                            @click="copy(copyableValue(t), t.name + ':value')"
                        >
                            <code :class="{ 'dsCopy__text-wrap': t.value && !t.hex && !t.ref }">{{ displayValue(t) }}</code>
                            <span class="dsCopy__icon" aria-hidden="true">
                                <CopyIcon v-if="copiedKey !== t.name + ':value'" />
                                <CheckIcon v-else />
                            </span>
                        </button>
                    </td>
                    <td class="dsColorTable__note">{{ t.note }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref as vueRef, h } from 'vue';
import { copyText } from '@/utils/clipboard';

defineProps({
    tokens: { type: Array, required: true },
});

const copiedKey = vueRef(null);

const CopyIcon = () =>
    h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
        h('rect', { x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2 }),
        h('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }),
    ]);

const CheckIcon = () =>
    h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
        h('polyline', { points: '20 6 9 17 4 12' }),
    ]);

function bgFor(t) {
    if (t.value && !t.hex) return t.value;       // градиенты и спец-значения
    return `var(${t.name})`;
}

function isLight(hex) {
    if (!hex) return false;
    const h = hex.replace('#', '');
    if (h.length !== 6 && h.length !== 3) return false;
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 220;
}

// Что показывать в колонке «Значение»
function displayValue(t) {
    if (t.hex) return t.hex;
    if (t.ref) return `→ ${t.ref}`;
    if (t.value) return t.value;
    return '';
}

// Что копировать (только сырое значение, без «→» префикса)
function copyableValue(t) {
    if (t.hex) return t.hex;
    if (t.ref) return t.ref;
    if (t.value) return t.value;
    return null;
}

async function copy(text, key) {
    const ok = await copyText(text);
    if (!ok) return;
    copiedKey.value = key;
    setTimeout(() => {
        if (copiedKey.value === key) copiedKey.value = null;
    }, 1500);
}
</script>

<style scoped>
.dsColorTable {
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: 8px;
    overflow: hidden;
}

.dsColorTable table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-family-sans);
}

.dsColorTable thead th {
    text-align: left;
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-semibold);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 12px 16px;
    background: var(--surface-muted);
    border-bottom: 1px solid var(--border-default);
}

.dsColorTable__thPreview {
    width: 56px;
}

.dsColorTable__row + .dsColorTable__row td {
    border-top: 1px solid var(--border-default);
}

.dsColorTable tbody td {
    padding: 10px 16px;
    vertical-align: middle;
    font-size: var(--font-size-body-s);
    line-height: var(--line-height-relaxed);
    color: var(--text-default);
}

.dsColorTable__previewCell {
    width: 56px;
    padding-right: 0;
}

.dsColorTable__preview {
    display: block;
    width: 32px;
    height: 32px;
    border-radius: 4px;
}
.dsColorTable__preview-light {
    box-shadow: inset 0 0 0 1px var(--border-default);
}

.dsColorTable__nameCell {
    width: 240px;
    white-space: nowrap;
}

.dsColorTable__valueCell {
    width: 200px;
}

.dsColorTable__note {
    color: var(--text-default);
}

/* — кнопка-копировалка (общая для имени и значения) — */
.dsCopy {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    margin: 0;
    border: 1px solid transparent;
    border-radius: 5px;
    background: var(--surface-muted);
    color: var(--text-heading);
    font-family: inherit;
    cursor: pointer;
    transition: background-color .12s ease, border-color .12s ease, color .12s ease;
    text-align: left;
}
.dsCopy:hover {
    background: var(--surface-default);
    border-color: var(--brand);
    color: var(--brand);
}
.dsCopy:focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 2px;
}
.dsCopy._isDone {
    background: var(--accent-positive-bg);
    border-color: var(--status-success);
    color: var(--status-success);
}
.dsCopy._isDone:hover {
    background: var(--accent-positive-bg);
    border-color: var(--status-success);
    color: var(--status-success);
}

/* Floating tooltip «Скопировано» над кнопкой во время состояния done. */
.dsCopy._isDone::after {
    content: 'Скопировано';
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 8px;
    background: var(--text-heading);
    color: var(--text-on-brand);
    font-size: 11px;
    font-weight: var(--font-weight-semibold);
    line-height: 1;
    white-space: nowrap;
    border-radius: 4px;
    pointer-events: none;
    animation: dsCopy-tooltip .15s ease-out;
    z-index: 10;
}
.dsCopy._isDone::before {
    content: '';
    position: absolute;
    bottom: calc(100% + 2px);
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: var(--text-heading);
    pointer-events: none;
    z-index: 10;
}

@keyframes dsCopy-tooltip {
    from { opacity: 0; transform: translateX(-50%) translateY(2px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.dsCopy code {
    font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
    font-size: 12px;
    background: transparent;
    padding: 0;
    color: inherit;
}

.dsCopy._asValue code {
    color: var(--text-muted);
}
.dsCopy._asValue:hover code,
.dsCopy._asValue._isDone code {
    color: inherit;
}

.dsCopy__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-muted);
}
.dsCopy:hover .dsCopy__icon,
.dsCopy._isDone .dsCopy__icon {
    color: inherit;
}

.dsCopy__text-wrap {
    white-space: normal;
    word-break: break-word;
    font-size: 11px;
    line-height: 1.4;
    display: inline-block;
    max-width: 220px;
}

@media (max-width: 720px) {
    .dsColorTable {
        overflow-x: auto;
    }
    .dsColorTable table {
        min-width: 700px;
    }
}
</style>
