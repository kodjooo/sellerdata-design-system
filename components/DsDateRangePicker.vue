<template>
    <!--
        DsDateRangePicker — выбор периода (реал: расходы/самовыкупы/дашборд/реклама → модалка «Период»).
        Сетка пресетов-кнопок (Один месяц / Три месяца / Шесть месяцев / Текущий год /
        Произвольный период) с активным состоянием (синяя заливка var(--brand) + галочка
        fm-check), плюс два поля даты «с»/«по» при выборе «Произвольный период».
        Это КОНТЕНТ для модалки/дропдауна — триггер (DsIconButton fm-calendar) живёт на экране.
    -->
    <div class="ds-drp" :class="{ 'ds-drp--dropdown': dropdown }">
        <div class="ds-drp__presets">
            <button
                v-for="opt in presets"
                :key="opt.key"
                type="button"
                class="ds-drp__btn"
                :class="{ 'is-active': activePreset === opt.key }"
                @click="selectPreset(opt.key)"
            >
                <span>{{ opt.label }}</span>
                <span v-if="activePreset === opt.key" class="ds-drp__check fm-check" aria-hidden="true"></span>
            </button>
        </div>

        <!-- Произвольный диапазон: два поля даты (показываются при выборе «Произвольный период») -->
        <div v-if="activePreset === customKey" class="ds-drp__range">
            <DsInput
                type="date"
                :label="labels.from"
                :model-value="from"
                @update:model-value="updateFrom"
            />
            <DsInput
                type="date"
                :label="labels.to"
                :model-value="to"
                @update:model-value="updateTo"
            />
        </div>

        <!-- Кнопка применения (опциональна — модалки уже дают свой футер) -->
        <div v-if="showApply" class="ds-drp__footer">
            <DsButton variant="primary" class="ds-drp__apply" @click="apply">{{ labels.apply }}</DsButton>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import DsInput from '@/Components/Ds/DsInput.vue';
import DsButton from '@/Components/Ds/DsButton.vue';

const props = defineProps({
    // Выбранный пресет: строка-ключ ИЛИ объект { preset, from, to } для произвольного диапазона.
    modelValue: { type: [String, Object], default: 'quarter' },
    // Список пресетов: [{ key, label }]. Дефолт — 5 пресетов (реал periodOptions из Expenses/Redeems).
    presets: {
        type: Array,
        default: () => ([
            { key: 'month', label: 'Один месяц' },
            { key: 'quarter', label: 'Три месяца' },
            { key: 'half', label: 'Шесть месяцев' },
            { key: 'year', label: 'Текущий год' },
            { key: 'custom', label: 'Произвольный период' },
        ]),
    },
    // Ключ пресета «произвольный период» (при нём показываются поля дат).
    customKey: { type: String, default: 'custom' },
    // Показывать ли встроенную кнопку «Фильтровать» (для дропдауна; в модалке футер свой).
    showApply: { type: Boolean, default: false },
    // Режим компактного дропдауна (узкая колонка пресетов).
    dropdown: { type: Boolean, default: false },
    // Подписи интерфейса.
    labels: {
        type: Object,
        default: () => ({ from: 'С', to: 'По', apply: 'Фильтровать' }),
    },
});

const emit = defineEmits(['update:modelValue', 'apply', 'change']);

// Нормализуем modelValue → { preset, from, to }.
const value = computed(() => {
    if (typeof props.modelValue === 'string') {
        return { preset: props.modelValue, from: '', to: '' };
    }
    return { preset: props.modelValue?.preset ?? '', from: props.modelValue?.from ?? '', to: props.modelValue?.to ?? '' };
});

const activePreset = computed(() => value.value.preset);
const from = computed(() => value.value.from);
const to = computed(() => value.value.to);

// Если выбран не-произвольный пресет — отдаём строку-ключ; иначе объект с датами.
function emitValue(next) {
    const payload = next.preset === props.customKey
        ? { preset: next.preset, from: next.from, to: next.to }
        : next.preset;
    emit('update:modelValue', payload);
    emit('change', payload);
}

function selectPreset(key) {
    emitValue({ ...value.value, preset: key });
}
function updateFrom(v) {
    emitValue({ ...value.value, from: v });
}
function updateTo(v) {
    emitValue({ ...value.value, to: v });
}
function apply() {
    const v = value.value;
    emit('apply', v.preset === props.customKey ? { preset: v.preset, from: v.from, to: v.to } : v.preset);
}
</script>

<style lang="scss" scoped>
.ds-drp { display: flex; flex-direction: column; gap: var(--size-16); }

/* Сетка кнопок-пресетов (реал .period — 2 колонки, произвольный на всю ширину) */
.ds-drp__presets { display: grid; grid-template-columns: 1fr 1fr; gap: var(--size-12); }

.ds-drp__btn {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--size-12) var(--size-16);
    border: 1px solid var(--border-default); border-radius: var(--radius-md);
    background: var(--surface-default); color: var(--text-default);
    font-size: var(--font-size-body-s); cursor: pointer;
    transition: border-color var(--transition-fast) var(--ease-standard);
}
.ds-drp__btn:hover { border-color: var(--border-strong); }
/* Активный пресет: синяя заливка + обводка var(--brand), текст и галочка белые (реал .period__btn.is-active) */
.ds-drp__btn.is-active { background: var(--brand); border-color: var(--brand); color: var(--white); }
.ds-drp__btn:last-child { grid-column: 1 / -1; }
.ds-drp__check { color: var(--white); }

/* Произвольный диапазон: два поля даты «с»/«по» */
.ds-drp__range { display: flex; gap: var(--size-12); }

.ds-drp__footer { display: flex; }
.ds-drp__apply { width: 100%; }

/* Дропдаун-режим: одна колонка, компактнее */
.ds-drp--dropdown .ds-drp__presets { grid-template-columns: 1fr; }
.ds-drp--dropdown .ds-drp__btn:last-child { grid-column: auto; }
.ds-drp--dropdown .ds-drp__range { flex-direction: column; }

@media (max-width: 575.98px) {
    .ds-drp__range { flex-direction: column; }
}
</style>
