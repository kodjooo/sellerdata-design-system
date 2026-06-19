<template>
    <Head title="Дэшборд — экран-эталон" />
    <DsAppShell :items="nav" active="dashboard">
        <template #title>Дэшборд</template>
        <template #actions>
            <DsTabs v-model="view" :tabs="views" />
        </template>

        <div class="screen">
            <!-- ─── Вид «Плитки» = период-карточки + тулбар + таблица товаров ─── -->
            <template v-if="view === 'grid'">
                <div class="screen__periods">
                    <DsSummaryCard
                        v-for="p in periods"
                        :key="p.title"
                        :title="p.title"
                        :subtitle="p.subtitle"
                        :gradient="p.gradient"
                        :icon="p.icon"
                        featured-first
                        :metrics="p.metrics"
                    >
                        <template #footer><button type="button" class="screen__more">Больше</button></template>
                    </DsSummaryCard>
                </div>

                <div class="screen__toolbar">
                    <DsTabs v-model="metric" :tabs="metricTabs" />
                    <div class="screen__filters">
                        <DsSelect v-model="group" :options="groups" placeholder="Группировать по" />
                        <DsButton variant="secondary">Скачать таблицу (.xls)</DsButton>
                        <DsButton variant="secondary"><template #iconLeft>⚲</template>Фильтр</DsButton>
                    </div>
                </div>

                <DsCard radius="md" padding="--size-2">
                    <DsTable :columns="cols" :rows="rows" mobile-mode="scroll" detail-title="Товар">
                        <template #cell-name="{ row }">
                            <span class="prod">
                                <span class="t-body-s prod__name">{{ row.name }}</span>
                                <span class="t-caption prod__meta">{{ row.brand }} · {{ row.article }}</span>
                            </span>
                        </template>
                        <template #cell-profit="{ row }">
                            <span :class="neg(row.profit) ? 'screen__neg' : 'screen__pos'">{{ row.profit }}</span>
                        </template>
                    </DsTable>
                </DsCard>
            </template>

            <!-- ─── Вид «Диаграмма» = комбо-график + панель финансовой сводки ─── -->
            <div v-else class="screen__chart">
                <DsCard radius="lg" class="screen__chart-graph">
                    <DsChart :labels="chartLabels" :series="chartSeries" />
                </DsCard>
                <DsCard radius="lg" class="screen__chart-summary">
                    <DsTabs v-model="sumTab" :tabs="sumTabs" />
                    <dl class="sum">
                        <template v-for="(r, i) in summary" :key="r.label">
                            <div
                                class="sum__row"
                                :class="{ 'sum__row--strong': r.strong, 'sum__row--bg': r.bg, 'sum__row--exp': r.children }"
                                @click="r.children && toggle(i)"
                            >
                                <dt class="t-body-s sum__label">
                                    <span v-if="r.children" class="sum__chev" :class="{ open: open.has(i) }" aria-hidden="true">▸</span>
                                    {{ r.label }}
                                </dt>
                                <dd class="t-body-s sum__value">{{ r.value }}</dd>
                            </div>
                            <template v-if="r.children && open.has(i)">
                                <div v-for="c in r.children" :key="c.label" class="sum__row sum__row--child">
                                    <dt class="t-body-s sum__label">{{ c.label }}</dt>
                                    <dd class="t-body-s sum__value">{{ c.value }}</dd>
                                </div>
                            </template>
                        </template>
                    </dl>
                </DsCard>
            </div>
        </div>
    </DsAppShell>
</template>

<script setup>
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import DsAppShell from '@/Components/Ds/DsAppShell.vue';
import DsSummaryCard from '@/Components/Ds/DsSummaryCard.vue';
import DsTabs from '@/Components/Ds/DsTabs.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsChart from '@/Components/Ds/DsChart.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsTable from '@/Components/Ds/DsTable.vue';

const nav = [
    { key: 'dashboard', label: 'Дэшборд', icon: '▦', href: '#' },
    { key: 'products', label: 'Товары', icon: '▭', href: '#' },
    { key: 'expenses', label: 'Расходы', icon: '↺', href: '#' },
    { key: 'ads', label: 'Реклама', icon: '◎', href: '#' },
];

const view = ref('grid');
const views = [
    { key: 'grid', label: 'Плитки' },
    { key: 'chart', label: 'Диаграмма' },
];

// Период-карточки — реальные числа аккаунта (account 4, июнь 2026).
const periods = [
    { title: 'Сегодня', subtitle: '19.06.2026', gradient: 'blue',
      metrics: row('0,00 ₽ / 0 шт.', '0,00 ₽ / 0 шт.', '0,00 ₽ / 0 шт.', '0,00 ₽', '0,00 ₽') },
    { title: 'Вчера', subtitle: '18.06.2026', gradient: 'muted',
      metrics: row('0,00 ₽ / 0 шт.', '0,00 ₽ / 0 шт.', '0,00 ₽ / 0 шт.', '0,00 ₽', '0,00 ₽') },
    { title: 'Текущий месяц', subtitle: '01.06.2026 до 19.06.2026', gradient: 'indigo-deep', icon: 'info',
      metrics: row('740 319,80 ₽ / 302 шт.', '1 168 283,10 ₽ / 464 шт.', '−23 324,00 ₽ / 9 шт.', '279 478,21 ₽', '279 456,21 ₽') },
    { title: 'Прошлый месяц', subtitle: '01.05.2026 до 31.05.2026', gradient: 'periwinkle',
      metrics: row('1 192 464,14 ₽ / 486 шт.', '1 967 360,20 ₽ / 779 шт.', '−19 580,00 ₽ / 7 шт.', '335 324,60 ₽', '335 300,60 ₽') },
];
function row(sales, orders, refunds, payout, profit) {
    return [
        { label: 'Продажи', value: sales },
        { label: 'Заказы', value: orders },
        { label: 'Возвраты', value: refunds },
        { label: 'Сумма выплат', value: payout, info: true },
        { label: 'Прибыль', value: profit, info: true },
    ];
}

// Тулбар таблицы.
const metric = ref('sales');
const metricTabs = [{ key: 'sales', label: 'Продажи' }, { key: 'orders', label: 'Заказы' }];
const group = ref(null);
const groups = ['Не группировать', 'Артикулу', 'Бренду'];

// Таблица товаров — реальный состав колонок дашборда (13 + first).
const cols = [
    { key: 'name', label: 'Товары' },
    { key: 'sold', label: 'Продано', numeric: true },
    { key: 'returned', label: 'Возвращено', numeric: true },
    { key: 'sales', label: 'Продажи', numeric: true },
    { key: 'refunds', label: 'Возвраты', numeric: true },
    { key: 'deduction', label: 'Удержания', numeric: true },
    { key: 'ads', label: 'Реклама', numeric: true },
    { key: 'profit', label: 'Прибыль', numeric: true },
    { key: 'profitUnit', label: 'Прибыль на ед.', numeric: true },
    { key: 'margin', label: 'Маржа', numeric: true },
    { key: 'roi', label: 'ROI', numeric: true },
    { key: 'drr', label: 'ДРР', numeric: true },
    { key: 'redemption', label: 'Выкупаемость', numeric: true },
];
const rows = [
    { id: 1, name: 'Платье рубашка летнее больших размеров', brand: 'MIRA.bell', article: '180294471',
      sold: '142', returned: '6', sales: '347 580 ₽', refunds: '−14 700 ₽', deduction: '−108 240 ₽', ads: '−9 320 ₽',
      profit: '128 410 ₽', profitUnit: '904 ₽', margin: '38,6%', roi: '92,4%', drr: '2,7%', redemption: '95,8%' },
    { id: 2, name: 'Костюм брючный женский офисный', brand: 'MIRA.bell', article: '174553902',
      sold: '88', returned: '11', sales: '264 000 ₽', refunds: '−33 000 ₽', deduction: '−96 480 ₽', ads: '−18 040 ₽',
      profit: '−4 120 ₽', profitUnit: '−47 ₽', margin: '−1,8%', roi: '−3,1%', drr: '6,8%', redemption: '88,9%' },
    { id: 3, name: 'Блуза свободного кроя с воротником', brand: 'MIRA.bell', article: '169920418',
      sold: '64', returned: '2', sales: '128 640 ₽', refunds: '−4 020 ₽', deduction: '−41 200 ₽', ads: '−3 110 ₽',
      profit: '39 980 ₽', profitUnit: '625 ₽', margin: '32,1%', roi: '78,5%', drr: '2,4%', redemption: '96,9%' },
];
function neg(v) { return typeof v === 'string' && v.includes('−'); }

// ─── Вид «Диаграмма» ───
const chartLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь'];
const chartSeries = [
    { name: 'Заказано', type: 'line', axis: 'right', color: '--chart-blue', values: [180, 240, 210, 300, 360, 420] },
    { name: 'Продано', type: 'line', axis: 'right', color: '--chart-green', values: [150, 200, 180, 260, 320, 380] },
    { name: 'Возвращено', type: 'line', axis: 'right', color: '--chart-red', values: [12, 18, 14, 22, 28, 30] },
    { name: 'Продажи', type: 'bar', axis: 'left', color: '--chart-purple-light', values: [820000, 980000, 910000, 1100000, 1192000, 740000] },
    { name: 'Прибыль', type: 'bar', axis: 'left', color: '--chart-pink', values: [210000, 280000, 240000, 320000, 335000, 279000] },
];
const sumTab = ref('month');
const sumTabs = [{ key: 'month', label: 'Июнь 2026' }, { key: 'all', label: 'Весь период' }];
const open = ref(new Set([0]));
function toggle(i) { const n = new Set(open.value); n.has(i) ? n.delete(i) : n.add(i); open.value = n; }
const summary = [
    { label: 'Продажи', value: '740 319,80 ₽', children: [
        { label: 'Количество товаров', value: '302' },
        { label: 'Продажи со скидкой', value: '740 319,80 ₽' },
    ] },
    { label: 'Возвраты', value: '−23 324,00 ₽', children: [{ label: 'Количество возвратов', value: '9' }] },
    { label: 'Удержания', value: '−268 410,00 ₽', children: [
        { label: 'Логистика', value: '−184 200,00 ₽' },
        { label: 'Комиссия', value: '−84 210,00 ₽' },
    ] },
    { label: 'Реклама', value: '−38 540,00 ₽' },
    { label: 'Себестоимость', value: '−210 880,00 ₽' },
    { label: 'Валовая прибыль', value: '341 720,80 ₽' },
    { label: 'НДС', value: '0,00 ₽' },
    { label: 'Налог на доход', value: '−62 264,59 ₽' },
    { label: 'Прибыль', value: '279 456,21 ₽', strong: true },
    { label: 'Сумма выплат', value: '279 478,21 ₽' },
    { label: 'Маржа', value: '37,7 %', bg: true },
    { label: 'ROI', value: '88,2 %', bg: true },
    { label: 'ДРР', value: '5,2 %', bg: true },
    { label: 'Выкупаемость', value: '95,8 %', bg: true },
];
</script>

<style scoped>
.screen { padding: var(--size-24); display: flex; flex-direction: column; gap: var(--size-20); }
.screen__periods { display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--size-128) * 2), 1fr)); gap: var(--size-16); }
.screen__more { display: inline-block; padding: 1px 0; border: 0; border-bottom: 1px dashed var(--brand); background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; }

.screen__toolbar { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--size-16); flex-wrap: wrap; }
.screen__filters { display: flex; align-items: center; gap: var(--size-8); flex-wrap: wrap; }

.prod { display: inline-flex; flex-direction: column; min-width: 0; }
.prod__name { color: var(--text-heading); }
.prod__meta { color: var(--text-muted); }
.screen__pos { color: var(--accent-positive); }
.screen__neg { color: var(--status-danger); }

.screen__chart { display: grid; grid-template-columns: 1fr; gap: var(--size-16); }
@media (min-width: 992px) { .screen__chart { grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); align-items: start; } }
.sum { margin: var(--size-12) 0 0; padding: 0; }
.sum__row { display: flex; align-items: center; justify-content: space-between; padding: var(--size-8) 0; border-bottom: 1px solid var(--border-default); }
.sum__label { color: var(--text-default); display: inline-flex; align-items: center; gap: var(--size-6); }
.sum__value { color: var(--text-heading); white-space: nowrap; }
.sum__row--exp { cursor: pointer; }
.sum__chev { display: inline-block; color: var(--text-muted); transition: transform var(--transition-fast) var(--ease-standard); }
.sum__chev.open { transform: rotate(90deg); color: var(--brand); }
.sum__row--child { padding-left: var(--size-16); }
.sum__row--child .sum__label { color: var(--text-muted); }
.sum__row--strong .sum__label, .sum__row--strong .sum__value { color: var(--text-heading); font-weight: 700; }
.sum__row--bg { background: var(--surface-subtle); margin: 0 calc(var(--size-16) * -1); padding-left: var(--size-16); padding-right: var(--size-16); border-bottom: 0; }
</style>
