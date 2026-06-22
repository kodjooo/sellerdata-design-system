<template>
    <!--
        DsMultiSelectAccordion — мультивыбор с поиском, «Выбрать все», счётчиком и миниатюрами.
        Композирует существующие Ds*: DsInput (поиск), DsCheckbox (опции/select-all),
        DsProductCell (миниатюра+название+id), DsTag (счётчик), DsLoader (loading),
        DsEmptyState (пусто). Реал: productMultiselectAccordion (товары, вложенные группы)
        и CampaignSelector (кампании) — поле поиска, «Выбрать все»/«Сбросить»,
        «Выбрано: N», список опций, аккордеон для children, single/multiple, inverted.
    -->
    <div class="ds-msa">
        <!-- Шапка: поиск + «Выбрать все» -->
        <div v-if="searchable || showSelectAll" class="ds-msa__head">
            <div v-if="searchable" class="ds-msa__search">
                <DsInput
                    :model-value="search"
                    type="search"
                    :placeholder="searchPlaceholder"
                    @update:model-value="onSearch"
                />
            </div>
            <button
                v-if="multiple && showSelectAll && !loading"
                type="button"
                class="t-body-s ds-msa__all"
                @click="toggleSelectAll"
            >
                {{ allSelected ? 'Сбросить' : 'Выбрать все' }}
            </button>
        </div>

        <!-- Счётчик «Выбрано: N» -->
        <div v-if="selectedLabel" class="ds-msa__counter">
            <DsTag variant="soft" tone="blue">{{ selectedLabel }}</DsTag>
        </div>

        <!-- Тело: loading / empty / список -->
        <div class="ds-msa__body">
            <DsLoader v-if="loading" variant="panel" label="Загрузка…" />

            <DsEmptyState
                v-else-if="!filteredOptions.length"
                icon="search"
                :title="emptyText"
            />

            <ul v-else class="ds-msa__list">
                <li
                    v-for="opt in filteredOptions"
                    :key="opt.id"
                    class="ds-msa__item"
                >
                    <!-- Группа с детьми → аккордеон -->
                    <template v-if="opt.children && opt.children.length">
                        <div class="ds-msa__row ds-msa__row--group">
                            <DsCheckbox
                                v-if="multiple"
                                :type="'checkbox'"
                                :model-value="groupChecked(opt)"
                                @update:model-value="toggleGroup(opt)"
                                :ref="(el) => setIndeterminate(el, groupIndeterminate(opt))"
                            />
                            <button
                                type="button"
                                class="ds-msa__group-head"
                                @click="toggleOpen(opt.id)"
                            >
                                <DsProductCell
                                    v-if="opt.image"
                                    :image="opt.image"
                                    :name="opt.label"
                                    :sub="opt.sub"
                                />
                                <span v-else class="t-body-s ds-msa__label">{{ opt.label }}</span>
                                <span
                                    class="ds-msa__chevron"
                                    :class="{ 'is-open': isOpen(opt.id) }"
                                    aria-hidden="true"
                                >›</span>
                            </button>
                        </div>
                        <ul v-show="isOpen(opt.id)" class="ds-msa__children">
                            <li v-for="child in opt.children" :key="child.id" class="ds-msa__child">
                                <DsCheckbox
                                    :type="multiple ? 'checkbox' : 'radio'"
                                    :value="child.id"
                                    :model-value="multiple ? modelValue : singleValue"
                                    @update:model-value="onCheckboxUpdate(child.id, $event)"
                                >
                                    {{ child.label }}
                                </DsCheckbox>
                            </li>
                        </ul>
                    </template>

                    <!-- Обычная опция -->
                    <template v-else>
                        <div class="ds-msa__row">
                            <DsCheckbox
                                :type="multiple ? 'checkbox' : 'radio'"
                                :value="opt.id"
                                :model-value="multiple ? modelValue : singleValue"
                                @update:model-value="onCheckboxUpdate(opt.id, $event)"
                            >
                                <DsProductCell
                                    v-if="opt.image"
                                    :image="opt.image"
                                    :name="opt.label"
                                    :sub="opt.sub"
                                />
                                <span v-else class="t-body-s ds-msa__label">{{ opt.label }}</span>
                            </DsCheckbox>
                        </div>
                    </template>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import DsInput from './DsInput.vue';
import DsCheckbox from './DsCheckbox.vue';
import DsProductCell from './DsProductCell.vue';
import DsTag from './DsTag.vue';
import DsLoader from './DsLoader.vue';
import DsEmptyState from './DsEmptyState.vue';

const props = defineProps({
    // Массив выбранных id (v-model).
    modelValue: { type: Array, default: () => [] },
    // Опции: [{ id, label, sub?, image?, children? }].
    options: { type: Array, default: () => [] },
    // Множественный выбор (true) или одиночный (false → ведёт себя как radio).
    multiple: { type: Boolean, default: true },
    // Показывать поле поиска.
    searchable: { type: Boolean, default: true },
    // Плейсхолдер поиска.
    searchPlaceholder: { type: String, default: 'Поиск по названию или ID' },
    // Показывать кнопку «Выбрать все» (только при multiple).
    showSelectAll: { type: Boolean, default: true },
    // Состояние загрузки.
    loading: { type: Boolean, default: false },
    // Текст пустого состояния.
    emptyText: { type: String, default: 'Ничего не найдено' },
    // Исключающий выбор: «Все кроме N» (как inverted в реале).
    inverted: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'change', 'search']);

const search = ref('');
const openIds = ref(new Set());

// Все id-листья (с учётом вложенных групп) — для select-all и подсчётов.
const allLeafIds = computed(() => {
    const ids = [];
    for (const opt of props.options) {
        if (opt.children && opt.children.length) {
            for (const c of opt.children) ids.push(c.id);
        } else {
            ids.push(opt.id);
        }
    }
    return ids;
});

// Для одиночного выбора DsCheckbox(radio) ждёт скалярное значение.
const singleValue = computed(() => props.modelValue[0] ?? null);

const filteredOptions = computed(() => {
    const term = search.value.trim().toLowerCase();
    if (!term) return props.options;
    const match = (o) =>
        [o.label, o.sub, o.id].some((v) => String(v ?? '').toLowerCase().includes(term));
    const result = [];
    for (const opt of props.options) {
        if (opt.children && opt.children.length) {
            if (match(opt)) { result.push(opt); continue; }
            const kids = opt.children.filter(match);
            if (kids.length) result.push({ ...opt, children: kids });
        } else if (match(opt)) {
            result.push(opt);
        }
    }
    return result;
});

const allSelected = computed(() => {
    const total = allLeafIds.value.length;
    return total > 0 && props.modelValue.length >= total;
});

const selectedLabel = computed(() => {
    const n = props.modelValue.length;
    if (props.inverted) {
        return n ? `Выбрано: Все кроме ${n}` : 'Выбрано: Все';
    }
    if (!n) return '';
    return `Выбрано: ${n}`;
});

function isOpen(id) {
    return openIds.value.has(id);
}
function toggleOpen(id) {
    const next = new Set(openIds.value);
    if (next.has(id)) next.delete(id); else next.add(id);
    openIds.value = next;
}

function emitValue(next) {
    emit('update:modelValue', next);
    emit('change', next);
}

function onSearch(value) {
    search.value = value;
    emit('search', value);
}

// Обновление от DsCheckbox: для multiple приходит массив, для radio — скаляр.
function onCheckboxUpdate(id, value) {
    if (props.multiple) {
        emitValue(Array.isArray(value) ? value : [...props.modelValue]);
    } else {
        emitValue([id]);
    }
}

function groupChecked(opt) {
    return opt.children.every((c) => props.modelValue.includes(c.id));
}
function groupIndeterminate(opt) {
    const sel = opt.children.filter((c) => props.modelValue.includes(c.id)).length;
    return sel > 0 && sel < opt.children.length;
}
function toggleGroup(opt) {
    const ids = opt.children.map((c) => c.id);
    const all = groupChecked(opt);
    const set = new Set(props.modelValue);
    if (all) ids.forEach((id) => set.delete(id));
    else ids.forEach((id) => set.add(id));
    emitValue([...set]);
}

function toggleSelectAll() {
    emitValue(allSelected.value ? [] : [...allLeafIds.value]);
}

// Проставление indeterminate на нативный input группового чекбокса.
function setIndeterminate(comp, value) {
    const input = comp?.$el?.querySelector?.('input');
    if (input) input.indeterminate = value;
}
</script>

<style lang="scss" scoped>
.ds-msa {
    display: flex;
    flex-direction: column;
    gap: var(--size-12);
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    padding: var(--size-12);
}

.ds-msa__head {
    display: flex;
    align-items: center;
    gap: var(--size-12);
}
.ds-msa__search { flex: 1 1 auto; min-width: 0; }
.ds-msa__all {
    flex: 0 0 auto;
    background: none;
    border: none;
    padding: 0;
    color: var(--brand);
    cursor: pointer;
    white-space: nowrap;
}
.ds-msa__all:hover { text-decoration: underline; }

.ds-msa__counter { display: flex; }

.ds-msa__body { min-height: var(--size-48); }

.ds-msa__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    max-height: var(--size-320, 320px);
    overflow-y: auto;
}

.ds-msa__row {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    padding: var(--size-6) var(--size-4);
    border-radius: var(--radius-md);
}
.ds-msa__row:hover { background: var(--surface-muted); }

.ds-msa__label { color: var(--text-default); }

.ds-msa__group-head {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    gap: var(--size-8);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    min-width: 0;
}
.ds-msa__chevron {
    margin-left: auto;
    color: var(--text-muted);
    transition: transform .15s ease;
}
.ds-msa__chevron.is-open { transform: rotate(90deg); }

.ds-msa__children {
    list-style: none;
    margin: 0;
    padding: var(--size-4) 0 var(--size-4) var(--size-32);
    display: flex;
    flex-direction: column;
    gap: var(--size-6);
}
.ds-msa__child { display: flex; }
</style>
