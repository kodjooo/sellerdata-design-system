<template>
    <DocsLayout
        title="Мультивыбор"
        breadcrumb="Components"
        description="Компонент DsMultiSelectAccordion — фильтр выбора товаров/кампаний (реал: productMultiselectAccordion на Расходах/Дашборде/Самовыкупах и CampaignSelector в Рекламе). Поле поиска, «Выбрать все» с indeterminate, счётчик-чипс «Выбрано: N», список опций с миниатюрой+названием+id или вложенными группами-аккордеонами. Single/multiple, состояния loading/empty, опц. inverted («Все кроме N»). Композирует DsInput, DsCheckbox, DsProductCell, DsTag, DsLoader, DsEmptyState."
    >
        <section>
            <h2>Мультивыбор с миниатюрами + «Выбрать все»</h2>
            <DocExample plain>
                <DsMultiSelectAccordion
                    v-model="multi"
                    :options="products"
                />
                <p class="t-caption ds-demo-note">modelValue: {{ multi }}</p>
            </DocExample>
        </section>

        <section>
            <h2>Одиночный выбор (single)</h2>
            <DocExample plain>
                <DsMultiSelectAccordion
                    v-model="single"
                    :options="simple"
                    :multiple="false"
                    :show-select-all="false"
                />
                <p class="t-caption ds-demo-note">modelValue: {{ single }}</p>
            </DocExample>
        </section>

        <section>
            <h2>Вложенные группы (кампании-аккордеон)</h2>
            <DocExample plain>
                <DsMultiSelectAccordion
                    v-model="groups"
                    :options="campaigns"
                />
            </DocExample>
        </section>

        <section>
            <h2>Загрузка</h2>
            <DocExample plain>
                <DsMultiSelectAccordion :options="[]" :loading="true" />
            </DocExample>
        </section>

        <section>
            <h2>Пусто</h2>
            <DocExample plain>
                <DsMultiSelectAccordion :options="[]" empty-text="Ничего не найдено" />
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
import DsMultiSelectAccordion from '@/Components/Ds/DsMultiSelectAccordion.vue';

const multi = ref([101]);
const single = ref([]);
const groups = ref([]);

const products = [
    { id: 101, label: 'Кроссовки беговые Pro', sub: '101 / ART-101', image: 'https://picsum.photos/seed/p1/80' },
    { id: 102, label: 'Куртка зимняя Arctic', sub: '102 / ART-102', image: 'https://picsum.photos/seed/p2/80' },
    { id: 103, label: 'Рюкзак городской 25 л', sub: '103 / ART-103', image: 'https://picsum.photos/seed/p3/80' },
];

const simple = [
    { id: 'wb', label: 'Wildberries' },
    { id: 'ozon', label: 'Ozon' },
    { id: 'ym', label: 'Яндекс Маркет' },
];

const campaigns = [
    {
        id: 'g1', label: 'Авто-кампании', sub: 'ID 5501',
        children: [
            { id: 5501, label: 'Авто · Обувь' },
            { id: 5502, label: 'Авто · Одежда' },
        ],
    },
    {
        id: 'g2', label: 'Поиск + каталог', sub: 'ID 5601',
        children: [
            { id: 5601, label: 'Поиск · Бренд' },
            { id: 5602, label: 'Каталог · Сезон' },
        ],
    },
];

const props = [
    { name: 'modelValue', type: 'Array', default: '[]', desc: 'v-model — массив выбранных id.' },
    { name: 'options', type: 'Array<{ id, label, sub?, image?, children? }>', default: '[]', desc: 'Опции; children — вложенная группа (аккордеон).' },
    { name: 'multiple', type: 'boolean', default: 'true', desc: 'Множественный выбор; false — одиночный (radio).' },
    { name: 'searchable', type: 'boolean', default: 'true', desc: 'Показывать поле поиска.' },
    { name: 'searchPlaceholder', type: 'string', default: "'Поиск по названию или ID'", desc: 'Плейсхолдер поиска.' },
    { name: 'showSelectAll', type: 'boolean', default: 'true', desc: 'Кнопка «Выбрать все» (только при multiple).' },
    { name: 'loading', type: 'boolean', default: 'false', desc: 'Состояние загрузки — DsLoader.' },
    { name: 'emptyText', type: 'string', default: "'Ничего не найдено'", desc: 'Текст пустого состояния — DsEmptyState.' },
    { name: 'inverted', type: 'boolean', default: 'false', desc: 'Исключающий выбор: счётчик «Все кроме N».' },
];

const events = [
    { name: 'update:modelValue', type: '(ids: Array)', default: '—', desc: 'Изменение выбора (v-model).' },
    { name: 'change', type: '(ids: Array)', default: '—', desc: 'То же, что update:modelValue (удобно для побочных действий).' },
    { name: 'search', type: '(term: string)', default: '—', desc: 'Ввод в поле поиска (для серверной фильтрации/пагинации).' },
];
</script>

<style lang="scss" scoped>
.ds-demo-note { color: var(--text-muted); margin-top: var(--size-8); }
</style>
