<template>
    <DocsLayout
        title="Таблица"
        breadcrumb="Components"
        description="Компонент DsTable — плотная таблица данных: переносимые заголовки, узкие числовые колонки, sticky-шапка, hover. Рекурсивная вложенность и три режима мобайла (cards / compact / scroll)."
    >
        <section>
            <h2>Простая таблица</h2>
            <DocExample plain>
                <DsCard radius="md" padding="--size-2">
                    <DsTable :columns="simpleCols" :rows="simpleRows" />
                </DsCard>
            </DocExample>
        </section>

        <section>
            <h2>Сложная, многоуровневая (как в Рекламе)</h2>
            <p class="t-body-s dsHint">Рекурсивная вложенность: кампания → товар → дата → площадка. На мобайле — <code>mobile-mode="scroll"</code>: таблица скроллится по горизонтали, закреплённая справа кнопка «→» открывает деталь-модалку.</p>
            <DocExample plain>
                <DsCard radius="md" padding="--size-2">
                    <DsTable :columns="adCols" :rows="adRows" expandable mobile-mode="scroll" detail-title="Рекламная кампания">
                        <template #cell-name="{ row }">
                            <span class="adName">
                                <span v-if="row.status" class="t-caption adName__status">Идут показы</span>
                                <span class="t-body-s adName__title">{{ row.name }}</span>
                                <span v-if="row.meta" class="t-caption adName__meta">{{ row.meta }}</span>
                            </span>
                        </template>
                    </DsTable>
                </DsCard>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Режимы мобайла (mobileMode)</h2>
            <ul class="dsTokens">
                <li><code>cards</code> — узкие таблицы → карточки (label: value).</li>
                <li><code>compact</code> — широкие → фикс-таблица из приоритетных колонок (<code>mobileColumns</code>) + «→» деталь.</li>
                <li><code>scroll</code> — сложные/вложенные → таблица + горизонтальный скролл + sticky «→» деталь.</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsTable from '@/Components/Ds/DsTable.vue';

const simpleCols = [
    { key: 'name', label: 'Товар' },
    { key: 'stock', label: 'Остаток', numeric: true },
    { key: 'price', label: 'Цена', numeric: true },
];
const simpleRows = [
    { id: 1, name: 'Паста для полировки', stock: '2 198', price: '745 ₽' },
    { id: 2, name: 'Клей полихлоропреновый', stock: '540', price: '320 ₽' },
    { id: 3, name: 'Полироль металла', stock: '0', price: '610 ₽' },
];

const adCols = [
    { key: 'name', label: 'Рекламная кампания' },
    { key: 'budget', label: 'Бюджет', numeric: true },
    { key: 'shows', label: 'Показы', numeric: true },
    { key: 'clicks', label: 'Клики', numeric: true },
    { key: 'ctr', label: 'CTR', numeric: true },
    { key: 'spend', label: 'Расход', numeric: true },
];
const adRows = [
    {
        id: 'c1', status: true, name: 'КЛЕИ 16.06.2026', meta: 'ID 37441498 · Оплата за показы',
        budget: '1 000 ₽', shows: '12 480', clicks: '212', ctr: '1.70%', spend: '842 ₽',
        children: [
            {
                id: 'c1p1', name: 'Kenda Farben / Полихлоропреновый клей', meta: '172165970 / OZN772590453',
                budget: '—', shows: '8 200', clicks: '140', ctr: '1.71%', spend: '560 ₽',
                children: [
                    { id: 'c1p1d1', name: '18.06.2026', budget: '—', shows: '4 100', clicks: '70', ctr: '1.71%', spend: '280 ₽', children: [
                        { id: 'c1p1d1a', name: 'Android', budget: '—', shows: '2 000', clicks: '34', ctr: '1.70%', spend: '136 ₽' },
                        { id: 'c1p1d1b', name: 'iOS', budget: '—', shows: '1 500', clicks: '26', ctr: '1.73%', spend: '104 ₽' },
                    ] },
                ],
            },
            { id: 'c1p2', name: 'Kenda Farben / Клей на водной основе', meta: '172192929 / OZN888728965', budget: '—', shows: '4 280', clicks: '72', ctr: '1.68%', spend: '282 ₽', children: [] },
        ],
    },
    { id: 'c2', status: true, name: 'ПОЛИРОЛИ 14.06.2026', meta: 'ID 37118822 · Авто-кампания', budget: '1 500 ₽', shows: '9 320', clicks: '180', ctr: '1.93%', spend: '1 210 ₽', children: [] },
];

const props = [
    { name: 'columns', type: 'Array<{key,label,numeric?,align?,width?}>', default: '[]', desc: 'Описание колонок.' },
    { name: 'rows', type: 'Array', default: '[]', desc: 'Данные строк (объекты).' },
    { name: 'expandable', type: 'boolean', default: 'false', desc: 'Раскрываемые строки (поле children).' },
    { name: 'expandColumn', type: 'string', default: "''", desc: 'Ключ колонки со стрелкой раскрытия (по умолчанию первая).' },
    { name: 'numericAlign', type: "'left' | 'right'", default: "'right'", desc: 'Выравнивание числовых колонок (реал ЛК — left).' },
    { name: 'childrenKey', type: 'string', default: "'children'", desc: 'Имя поля с дочерними строками.' },
    { name: 'hover', type: 'boolean', default: 'true', desc: 'Подсветка строки при наведении.' },
    { name: 'stickyHeader', type: 'boolean', default: 'true', desc: 'Залипающая шапка.' },
    { name: 'mobileMode', type: "'cards' | 'compact' | 'scroll'", default: "'cards'", desc: 'Поведение на мобайле.' },
    { name: 'mobileColumns', type: 'string[]', default: '[]', desc: '(compact) приоритетные колонки на мобайле.' },
    { name: 'detailTitle', type: 'string', default: "''", desc: 'Заголовок деталь-модалки (compact/scroll).' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); }
.dsHint code, .dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-6); }
.adName { display: inline-flex; flex-direction: column; min-width: 0; }
.adName__status { color: var(--status-success); font-weight: 600; }
.adName__title { color: var(--text-heading); }
.adName__meta { color: var(--text-muted); }
</style>
