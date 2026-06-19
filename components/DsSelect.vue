<template>
    <!--
        DsSelect — реусабельный селект/мультиселект-дропдаун дизайн-системы.
        Паттерн выверен по WarehouseDemo (селект «Все склады» / мультиселект «Товары»)
        и эталонам: склад__выбор-складов@wb, реклама__фильтр-статусы@wb, склад__группировка-тип@wb.
        Только токены: var(--*), --size-*, --radius-*, --z-*, --transition-*, t-*-классы.
    -->
    <div ref="root" class="ds-select" :class="{ 'is-open': open, 'is-disabled': disabled }">
        <!-- Триггер-кнопка с шевроном -->
        <button
            :id="triggerId"
            type="button"
            class="ds-select__trigger"
            :class="{ 'is-open': open, 'is-placeholder': !hasSelection }"
            :disabled="disabled"
            aria-haspopup="listbox"
            :aria-expanded="open"
            :aria-controls="panelId"
            @click="toggle"
        >
            <span class="t-body-s ds-select__label">{{ triggerLabel }}</span>
            <span class="ds-select__chevron" :class="{ 'is-open': open }" aria-hidden="true">▾</span>
        </button>

        <!-- Панель дропдауна -->
        <transition name="ds-select-fade">
            <div
                v-if="open"
                :id="panelId"
                class="ds-select__panel"
                role="listbox"
                :aria-multiselectable="multiple"
                :aria-labelledby="triggerId"
            >
                <!-- Поиск (опционально) -->
                <div v-if="searchable" class="ds-select__search">
                    <span class="ds-select__search-icon" aria-hidden="true">⌕</span>
                    <input
                        ref="searchInput"
                        v-model="query"
                        type="text"
                        class="ds-select__search-input t-body-s"
                        :placeholder="searchPlaceholder"
                        @keydown.esc.prevent="close"
                    />
                </div>

                <!-- Список опций -->
                <div class="ds-select__list">
                    <!-- Псевдо-опция «Все» для мультиселекта -->
                    <label
                        v-if="multiple && showSelectAll && filteredOptions.length"
                        class="ds-select__option"
                        :class="{ 'is-selected': allSelected }"
                    >
                        <input
                            type="checkbox"
                            class="ds-select__check"
                            :checked="allSelected"
                            @change="toggleAll"
                        />
                        <span class="t-body-s ds-select__option-title">{{ selectAllLabel }}</span>
                    </label>

                    <label
                        v-for="opt in filteredOptions"
                        :key="optionValue(opt)"
                        class="ds-select__option"
                        :class="{ 'is-selected': isSelected(opt), 'is-disabled': optionDisabled(opt) }"
                        role="option"
                        :aria-selected="isSelected(opt)"
                    >
                        <input
                            v-if="multiple"
                            type="checkbox"
                            class="ds-select__check"
                            :checked="isSelected(opt)"
                            :disabled="optionDisabled(opt)"
                            @change="onToggle(opt)"
                        />
                        <input
                            v-else
                            type="radio"
                            class="ds-select__radio"
                            :name="panelId"
                            :checked="isSelected(opt)"
                            :disabled="optionDisabled(opt)"
                            @change="onSelectSingle(opt)"
                        />
                        <span class="ds-select__option-body">
                            <slot name="option" :option="opt" :selected="isSelected(opt)">
                                <span class="t-body-s ds-select__option-title">{{ optionLabel(opt) }}</span>
                                <span v-if="optionSub(opt)" class="t-caption ds-select__option-sub">{{ optionSub(opt) }}</span>
                            </slot>
                        </span>
                    </label>

                    <!-- Пустой результат -->
                    <div v-if="!filteredOptions.length" class="t-body-s ds-select__empty">{{ emptyText }}</div>
                </div>

                <!-- Футер мультиселекта: «N выбрано» + действия -->
                <div v-if="multiple && showFooter" class="ds-select__footer">
                    <span class="t-caption ds-select__count">{{ selectedCountLabel }}</span>
                    <slot name="footer" :apply="close" :selected="modelValue">
                        <button type="button" class="ds-select__footer-btn t-body-s" @click="close">Применить</button>
                    </slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
    // Опции: массив строк/чисел ИЛИ объектов { value, label, sub?, disabled? }.
    options: { type: Array, default: () => [] },
    // v-model: для multiple — массив значений, иначе одиночное значение.
    modelValue: { type: [Array, String, Number, Boolean, Object, null], default: null },
    // Режим мультивыбора.
    multiple: { type: Boolean, default: false },
    // Поле поиска в панели.
    searchable: { type: Boolean, default: false },
    // Текст триггера при пустом выборе.
    placeholder: { type: String, default: 'Выбрать' },
    // Плейсхолдер поля поиска.
    searchPlaceholder: { type: String, default: 'Поиск' },
    // Текст при пустом списке.
    emptyText: { type: String, default: 'Ничего не найдено' },
    // Ключи для объектных опций.
    valueKey: { type: String, default: 'value' },
    labelKey: { type: String, default: 'label' },
    subKey: { type: String, default: 'sub' },
    // Псевдо-опция «Выбрать все» (только multiple).
    showSelectAll: { type: Boolean, default: true },
    selectAllLabel: { type: String, default: 'Все' },
    // Футер с подписью «N выбрано» (только multiple).
    showFooter: { type: Boolean, default: true },
    // Отключение всего контрола.
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'change', 'open', 'close']);

let uid = 0;
const seed = `ds-select-${(uid += 1)}-${Math.random().toString(36).slice(2, 7)}`;
const triggerId = `${seed}-trigger`;
const panelId = `${seed}-panel`;

const root = ref(null);
const searchInput = ref(null);
const open = ref(false);
const query = ref('');

/* ─── Нормализация опций ──────────────────────────────────────── */
const isObjectOption = (opt) => opt !== null && typeof opt === 'object';
const optionValue = (opt) => (isObjectOption(opt) ? opt[props.valueKey] : opt);
const optionLabel = (opt) => (isObjectOption(opt) ? opt[props.labelKey] ?? opt[props.valueKey] : opt);
const optionSub = (opt) => (isObjectOption(opt) ? opt[props.subKey] : null);
const optionDisabled = (opt) => (isObjectOption(opt) ? !!opt.disabled : false);

const filteredOptions = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return props.options;
    return props.options.filter((opt) => {
        const label = String(optionLabel(opt) ?? '').toLowerCase();
        const sub = String(optionSub(opt) ?? '').toLowerCase();
        const val = String(optionValue(opt) ?? '').toLowerCase();
        return label.includes(q) || sub.includes(q) || val.includes(q);
    });
});

/* ─── Выбор ───────────────────────────────────────────────────── */
const selectedValues = computed(() =>
    props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : []) : []
);

const isSelected = (opt) => {
    const v = optionValue(opt);
    return props.multiple ? selectedValues.value.includes(v) : props.modelValue === v;
};

const hasSelection = computed(() =>
    props.multiple ? selectedValues.value.length > 0 : props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
);

const allSelected = computed(() => {
    const selectable = props.options.filter((opt) => !optionDisabled(opt));
    return selectable.length > 0 && selectable.every((opt) => selectedValues.value.includes(optionValue(opt)));
});

const selectedLabels = computed(() =>
    props.options.filter((opt) => isSelected(opt)).map((opt) => optionLabel(opt))
);

const triggerLabel = computed(() => {
    if (!hasSelection.value) return props.placeholder;
    if (props.multiple) {
        const n = selectedValues.value.length;
        if (n === 1) return String(selectedLabels.value[0] ?? props.placeholder);
        return `${props.placeholder}: ${n}`;
    }
    return String(selectedLabels.value[0] ?? props.placeholder);
});

const selectedCountLabel = computed(() => `${selectedValues.value.length} выбрано`);

/* ─── Действия ────────────────────────────────────────────────── */
function emitValue(value) {
    emit('update:modelValue', value);
    emit('change', value);
}

function onToggle(opt) {
    if (optionDisabled(opt)) return;
    const v = optionValue(opt);
    const next = selectedValues.value.includes(v)
        ? selectedValues.value.filter((x) => x !== v)
        : [...selectedValues.value, v];
    emitValue(next);
}

function onSelectSingle(opt) {
    if (optionDisabled(opt)) return;
    emitValue(optionValue(opt));
    close();
}

function toggleAll() {
    const selectable = props.options.filter((opt) => !optionDisabled(opt));
    emitValue(allSelected.value ? [] : selectable.map((opt) => optionValue(opt)));
}

/* ─── Открытие/закрытие ───────────────────────────────────────── */
function toggle() {
    if (props.disabled) return;
    open.value ? close() : openPanel();
}
function openPanel() {
    open.value = true;
    emit('open');
    if (props.searchable) nextTick(() => searchInput.value?.focus());
}
function close() {
    if (!open.value) return;
    open.value = false;
    query.value = '';
    emit('close');
}

function handleOutsideClick(e) {
    if (open.value && root.value && !root.value.contains(e.target)) close();
}
function handleEsc(e) {
    if (e.key === 'Escape') close();
}

watch(() => props.disabled, (d) => { if (d) close(); });

onMounted(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
});
onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleEsc);
});
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

/* ─── Контейнер ───────────────────────────────────────────────── */
.ds-select {
    position: relative;
    display: inline-block;
    min-width: 0;
}
.ds-select.is-disabled { opacity: var(--opacity-disabled); pointer-events: none; }

/* ─── Триггер-кнопка (канон контрол-селекта: radius-md как тулбар-кнопки ЛК) ── */
.ds-select__trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-8);
    width: 100%;
    height: var(--control-height-md);
    padding: 0 var(--size-12);
    background: var(--surface-default);
    color: var(--text-default);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-md);
    font-family: var(--font-family-sans);
    line-height: var(--line-height-tight);
    cursor: pointer;
    box-sizing: border-box;
    transition: border-color var(--transition-base) var(--ease-standard),
                box-shadow var(--transition-base) var(--ease-standard),
                color var(--transition-base) var(--ease-standard);
}
.ds-select__trigger:hover { border-color: var(--border-strong); color: var(--text-heading); }
.ds-select__trigger:focus-visible,
.ds-select__trigger.is-open { border-color: var(--brand); box-shadow: var(--shadow-input-focus); outline: none; }
.ds-select__trigger.is-placeholder { color: var(--text-placeholder); }
.ds-select__trigger:disabled { cursor: not-allowed; }

.ds-select__label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: inherit; }
.ds-select__chevron {
    flex: 0 0 auto;
    color: var(--text-muted);
    transition: transform var(--transition-fast) var(--ease-standard);
}
.ds-select__chevron.is-open { transform: rotate(180deg); }

/* ─── Панель ──────────────────────────────────────────────────── */
.ds-select__panel {
    position: absolute;
    top: calc(100% + var(--size-4));
    left: 0;
    z-index: var(--z-dropdown);
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: calc(var(--size-128) * 2);
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-dropdown);
    overflow: hidden;
}

/* ─── Поиск ───────────────────────────────────────────────────── */
.ds-select__search {
    position: relative;
    padding: var(--size-8);
    border-bottom: 1px solid var(--border-default);
}
.ds-select__search-icon {
    position: absolute;
    top: 50%;
    left: var(--size-20);
    transform: translateY(-50%);
    color: var(--text-placeholder);
    font-size: var(--font-size-body-l);
    pointer-events: none;
}
.ds-select__search-input {
    width: 100%;
    box-sizing: border-box;
    height: var(--control-height-sm);
    padding: var(--size-6) var(--size-12) var(--size-6) var(--size-32);
    background: var(--surface-default);
    color: var(--text-default);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-sm);
    font-family: var(--font-family-sans);
    outline: 0;
    transition: border-color var(--transition-base) var(--ease-standard),
                box-shadow var(--transition-base) var(--ease-standard);
}
.ds-select__search-input::placeholder { color: var(--text-placeholder); }
.ds-select__search-input:focus { border-color: var(--brand); box-shadow: var(--shadow-input-focus); }

/* ─── Список опций ────────────────────────────────────────────── */
.ds-select__list {
    display: flex;
    flex-direction: column;
    max-height: calc(var(--size-128) * 2);
    padding: var(--size-4);
    overflow-y: auto;
}
.ds-select__option {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    padding: var(--size-6) var(--size-8);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color var(--transition-fast) var(--ease-standard);
}
.ds-select__option:hover { background: var(--surface-subtle); }
.ds-select__option.is-selected { background: var(--surface-muted); }
.ds-select__option.is-disabled { opacity: var(--opacity-disabled); cursor: not-allowed; }

.ds-select__check,
.ds-select__radio {
    flex: 0 0 auto;
    width: var(--size-16);
    height: var(--size-16);
    accent-color: var(--brand);
    cursor: pointer;
}
.ds-select__option-body { display: flex; flex-direction: column; gap: var(--size-2); min-width: 0; }
.ds-select__option-title { color: var(--text-heading); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ds-select__option-sub { color: var(--text-muted); }

.ds-select__empty {
    padding: var(--size-12) var(--size-8);
    color: var(--text-muted);
    text-align: center;
}

/* ─── Футер мультиселекта ─────────────────────────────────────── */
.ds-select__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-8);
    padding: var(--size-8);
    border-top: 1px solid var(--border-default);
}
.ds-select__count { color: var(--text-muted); }
.ds-select__footer-btn {
    border: 0;
    background: transparent;
    padding: var(--size-2) var(--size-4);
    color: var(--brand);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: opacity var(--transition-fast) var(--ease-standard);
}
.ds-select__footer-btn:hover { opacity: var(--opacity-hover); }
.ds-select__footer-btn:focus-visible { box-shadow: var(--shadow-input-focus); outline: none; }

/* ─── Анимация панели ─────────────────────────────────────────── */
.ds-select-fade-enter-active,
.ds-select-fade-leave-active { transition: opacity var(--transition-fast) var(--ease-standard); }
.ds-select-fade-enter-from,
.ds-select-fade-leave-to { opacity: var(--opacity-hidden); }

/* ─── Адаптив: панель на всю ширину < md ──────────────────────── */
@include respond-below(md) {
    .ds-select { display: block; width: 100%; }
    .ds-select__panel { min-width: 0; left: 0; right: 0; width: 100%; }
}
</style>
