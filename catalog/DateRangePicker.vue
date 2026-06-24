<template>
    <DocsLayout
        title="Период / диапазон"
        breadcrumb="Components"
        description="Компонент DsDateRangePicker — выбор периода (реал: модалка «Период» на дашборде, расходах, самовыкупах, рекламе). Сетка пресетов-кнопок (Один месяц / Три месяца / Шесть месяцев / Текущий год / Произвольный период) с активным состоянием (синяя заливка var(--brand) + галочка fm-check); при выборе «Произвольный период» появляются два поля даты «с»/«по». Это контент для модалки/дропдауна — триггер-кнопка (DsIconButton fm-calendar) остаётся на экране."
    >
        <section>
            <h2>Пример (в модалке)</h2>
            <DocExample plain>
                <DsButton variant="secondary" @click="open = true">
                    <template #iconLeft><span class="fm-calendar" aria-hidden="true"></span></template>Период
                </DsButton>
                <DsModal v-model="open" title="Период" size="sm">
                    <DsDateRangePicker v-model="period" />
                    <template #footer>
                        <DsButton variant="primary" class="apply" @click="open = false">Фильтровать</DsButton>
                    </template>
                </DsModal>
                <p class="state t-body-s">Выбрано: <code>{{ JSON.stringify(period) }}</code></p>
            </DocExample>
        </section>

        <section>
            <h2>Произвольный диапазон + встроенная кнопка</h2>
            <DocExample plain>
                <div class="inline">
                    <DsDateRangePicker v-model="custom" show-apply @apply="onApply" />
                </div>
                <p class="state t-body-s">Выбрано: <code>{{ JSON.stringify(custom) }}</code></p>
                <p v-if="applied" class="state t-body-s">apply → <code>{{ JSON.stringify(applied) }}</code></p>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>События</h2>
            <PropsTable :rows="events" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsModal from '@/Components/Ds/DsModal.vue';
import DsDateRangePicker from '@/Components/Ds/DsDateRangePicker.vue';

const open = ref(false);
const period = ref('quarter');

const custom = ref({ preset: 'custom', from: '2026-01-01', to: '2026-06-22' });
const applied = ref(null);
function onApply(v) {
    applied.value = v;
}

const props = [
    { name: 'modelValue', type: 'string | { preset, from, to }', default: "'quarter'", desc: 'Ключ пресета; для произвольного периода — объект с датами.' },
    { name: 'presets', type: 'Array<{ key, label }>', default: '5 пресетов', desc: 'Список пресетов (по умолчанию: месяц / три / шесть / год / произвольный).' },
    { name: 'customKey', type: 'string', default: "'custom'", desc: 'Ключ пресета «Произвольный период» (при нём показываются поля дат).' },
    { name: 'showApply', type: 'boolean', default: 'false', desc: 'Показывать встроенную кнопку «Фильтровать» (для дропдауна; в модалке футер свой).' },
    { name: 'dropdown', type: 'boolean', default: 'false', desc: 'Компактный режим в одну колонку (дропдаун).' },
    { name: 'labels', type: '{ from, to, apply }', default: "{ С, По, Фильтровать }", desc: 'Подписи полей дат и кнопки.' },
];
const events = [
    { name: 'update:modelValue', type: '(string | object)', default: '—', desc: 'v-model: ключ пресета или { preset, from, to }.' },
    { name: 'change', type: '(string | object)', default: '—', desc: 'То же значение при любом изменении.' },
    { name: 'apply', type: '(string | object)', default: '—', desc: 'Клик по встроенной кнопке «Фильтровать» (только при show-apply).' },
];
</script>

<style scoped>
.inline { max-width: 360px; }
.apply { width: 100%; }
.state { color: var(--text-muted); margin-top: var(--size-12); }
.state code { color: var(--text-default); }
</style>
