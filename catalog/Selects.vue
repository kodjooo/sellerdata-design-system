<template>
    <DocsLayout
        title="Селекты"
        breadcrumb="Components"
        description="Компонент DsSelect — выпадающий список: одиночный и множественный выбор, поиск, «Выбрать все», футер с подтверждением. Поведение — как у фильтров склада/товаров."
    >
        <section>
            <h2>Примеры</h2>
            <DocExample
                code='<DsSelect v-model="v" :options="warehouses" multiple placeholder="Все склады" />'
            >
                <DsSelect v-model="sel1" :options="warehouses" multiple placeholder="Все склады" :show-footer="true" />
                <DsSelect v-model="sel2" :options="['FBO','FBS','FBO/FBS']" placeholder="Тип склада" />
                <DsSelect v-model="sel3" :options="warehouses" searchable placeholder="С поиском" />
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Токены</h2>
            <ul class="dsTokens">
                <li><code>--surface-default</code> / <code>--shadow-overlay</code> — поповер списка</li>
                <li><code>--brand</code> — выбранные пункты, чекбоксы</li>
                <li><code>--border-default</code> · <code>--radius-sm</code> — поле и форма</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';

const warehouses = ['Коледино', 'Электросталь', 'Казань', 'Тула', 'Краснодар'];
const sel1 = ref([]); const sel2 = ref(null); const sel3 = ref(null);

const props = [
    { name: 'options', type: 'Array', default: '[]', desc: 'Список опций (строки или объекты).' },
    { name: 'modelValue', type: 'any | any[]', default: 'null', desc: 'v-model выбранного значения (массив при multiple).' },
    { name: 'multiple', type: 'boolean', default: 'false', desc: 'Множественный выбор.' },
    { name: 'searchable', type: 'boolean', default: 'false', desc: 'Строка поиска внутри списка.' },
    { name: 'placeholder', type: 'string', default: "'Выбрать'", desc: 'Плейсхолдер поля.' },
    { name: 'valueKey / labelKey / subKey', type: 'string', default: "'value' / 'label' / 'sub'", desc: 'Ключи полей для объектов-опций.' },
    { name: 'showSelectAll', type: 'boolean', default: 'true', desc: 'Пункт «Выбрать все» (для multiple).' },
    { name: 'showFooter', type: 'boolean', default: 'true', desc: 'Футер с кнопкой подтверждения.' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: 'Неактивное состояние.' },
];
</script>

<style scoped>
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
.dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
</style>
