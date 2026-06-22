<template>
    <!--
        DsFileDrop — зона drag&drop загрузки файлов.
        Источник (реал): DropFileInput.vue (модалки импорта expenses-import / dashboard-import):
        пунктирная зона + подсветка при dragover (.highlight), список файлов со статус-иконками
        (loading спиннер / success fm-check / partial fm-alert-triangle / error fm-alert-circle)
        и полосой прогресса на каждой строке. Прогресс вынесен в DsProgressBar.
    -->
    <div class="ds-file-drop">
        <div
            class="ds-file-drop__zone"
            :class="{ 'ds-file-drop__zone--active': isDragging }"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
        >
            <input
                ref="input"
                class="ds-file-drop__input"
                type="file"
                :accept="accept"
                :multiple="multiple"
                @change="onChange"
            />
            <label class="ds-file-drop__label t-body-sm" @click="openPicker">
                <span class="ds-file-drop__icon fm-file-text"></span>
                <slot>Нажмите сюда и выберите файлы или перетащите их в эту область</slot>
            </label>
        </div>

        <div v-if="files.length" class="ds-file-drop__list">
            <div
                v-for="(file, i) in files"
                :key="file.name + i"
                class="ds-file-drop__file"
            >
                <span class="ds-file-drop__status" :class="statusIconClass(file.status)"></span>

                <div class="ds-file-drop__body">
                    <div class="ds-file-drop__name t-body-sm">{{ file.name }}</div>
                    <DsProgressBar :value="barValue(file)" :tone="barTone(file.status)" />
                </div>

                <button
                    type="button"
                    class="ds-file-drop__remove fm-x"
                    aria-label="Удалить"
                    @click="$emit('remove', i)"
                ></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DsProgressBar from './DsProgressBar.vue';

const props = defineProps({
    // Список файлов: [{ name, progress?, status }]
    // status: loading | success | error | partial
    files: { type: Array, default: () => [] },
    // Допустимые типы (атрибут accept у input[type=file]).
    accept: { type: String, default: null },
    // Множественный выбор.
    multiple: { type: Boolean, default: true },
});

const emit = defineEmits(['drop', 'select', 'remove']);

const input = ref(null);
const isDragging = ref(false);

function openPicker() {
    input.value?.click();
}
function onChange(e) {
    const list = Array.from(e.target.files || []);
    if (list.length) emit('select', list);
}
function onDragOver() {
    isDragging.value = true;
}
function onDragLeave() {
    isDragging.value = false;
}
function onDrop(e) {
    isDragging.value = false;
    const list = Array.from(e.dataTransfer?.files || []);
    if (list.length) emit('drop', list);
}

// Иконка статуса (классы шрифтовых иконок из реала).
function statusIconClass(status) {
    return {
        'ds-file-drop__status--loading fm-loader': status === 'loading',
        'ds-file-drop__status--success fm-check': status === 'success',
        'ds-file-drop__status--partial fm-alert-triangle': status === 'partial',
        'ds-file-drop__status--error fm-alert-circle': status === 'error',
    };
}

// Цвет полосы по статусу.
function barTone(status) {
    if (status === 'success') return 'success';
    if (status === 'partial') return 'warning';
    if (status === 'error') return 'danger';
    return 'brand';
}

// Заполнение полосы: явный progress, иначе по статусу (реал: 50% в процессе, 100% готово, 1% ошибка).
function barValue(file) {
    if (typeof file.progress === 'number') return file.progress;
    if (file.status === 'success' || file.status === 'partial') return 100;
    if (file.status === 'error') return 1;
    return 50;
}
</script>

<style lang="scss" scoped>
.ds-file-drop {
    display: flex;
    flex-direction: column;
    gap: var(--size-12);
}

/* ─── Зона drag&drop ─── */
.ds-file-drop__zone {
    position: relative;
    border: 1px dashed var(--border-strong);
    border-radius: var(--radius-md);
    background: var(--surface-subtle);
    transition: border-color 0.15s ease, background 0.15s ease;
}
.ds-file-drop__zone--active {
    border-color: var(--brand);
    background: var(--surface-muted);
}

.ds-file-drop__input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
}

.ds-file-drop__label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-8);
    padding: var(--size-24) var(--size-16);
    text-align: center;
    color: var(--text-muted);
    cursor: pointer;
}
.ds-file-drop__icon {
    font-size: var(--size-24);
    color: var(--brand);
}

/* ─── Список файлов ─── */
.ds-file-drop__list {
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
}
.ds-file-drop__file {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    padding: var(--size-8) var(--size-12);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    background: var(--surface-default);
}
.ds-file-drop__status {
    flex: 0 0 auto;
    font-size: var(--size-16);
    line-height: 1;
}
.ds-file-drop__status--loading { color: var(--text-muted); }
.ds-file-drop__status--success { color: var(--status-success); }
.ds-file-drop__status--partial { color: var(--status-warning); }
.ds-file-drop__status--error   { color: var(--status-danger); }

.ds-file-drop__body {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-6);
}
.ds-file-drop__name {
    color: var(--text-default);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.ds-file-drop__remove {
    flex: 0 0 auto;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    font-size: var(--size-16);
    line-height: 1;
    padding: var(--size-4);

    &:hover { color: var(--text-default); }
}
</style>
