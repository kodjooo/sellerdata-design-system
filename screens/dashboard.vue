<template>
    <Head title="Дэшборд — экран-эталон" />
    <DsAppShell :items="nav" active="dashboard">
        <template #logo><span class="brand">sellerdata</span></template>
        <template #title>
            <span class="topbar">
                <strong class="t-title-m topbar__page">Дэшборд</strong>
                <DsTabs v-model="view" :tabs="views" class="topbar__tabs" />
            </span>
        </template>
        <template #actions>
            <span class="fm-help-circle topbar__ico" aria-hidden="true"></span>
            <span class="fm-bell topbar__ico" aria-hidden="true"></span>
            <span class="acc">
                <span class="acc__avatar" aria-hidden="true">Д</span>
                <span class="acc__body">
                    <span class="t-label-m acc__name">Демо аккаунт</span>
                    <span class="t-caption acc__store">Дополнительный магазин</span>
                </span>
            </span>
        </template>

        <div class="screen">
            <!-- Онбординг-баннер -->
            <DsNotice v-model:visible="hintOpen" tone="plain">
                <template #media><span class="hint-thumb" aria-hidden="true"></span></template>
                Используйте Панель инструментов для анализа ключевых показателей эффективности.
                Нажмите «Больше» в плитках периодов или стрелку справа в строке товара, чтобы увидеть
                подробный расчёт. Для детального анализа установите фильтр; вкладка «Диаграмма» — для
                графического отображения данных за выбранный период.
            </DsNotice>

            <!-- Верхний тулбар: поиск + фильтр + период -->
            <div class="bar">
                <DsSelect v-model="search" :options="[]" placeholder="Товары" searchable class="bar__search" />
                <DsButton variant="secondary"><template #iconLeft>⚲</template>Фильтр</DsButton>
                <button type="button" class="bar__date fm-calendar" aria-label="Период"></button>
            </div>

            <!-- ВЕРХНИЙ БЛОК — переключается вкладками Плитки/Диаграмма -->
            <div v-if="view === 'grid'" class="periods">
                <DsSummaryCard
                    v-for="p in periods" :key="p.title"
                    :title="p.title" :subtitle="p.subtitle" :gradient="p.gradient" :icon="p.icon"
                    featured-first :metrics="p.metrics"
                >
                    <template #footer><button type="button" class="more">Больше</button></template>
                </DsSummaryCard>
            </div>
            <div v-else class="chart">
                <DsCard radius="lg" class="chart__graph">
                    <DsChart :labels="chartLabels" :series="chartSeries" />
                </DsCard>
                <DsCard radius="lg" class="chart__sum">
                    <DsTabs v-model="sumTab" :tabs="sumTabs" />
                    <DsInfoList :items="summary" :default-open="[0]" class="chart__sumlist" />
                </DsCard>
            </div>

            <!-- ТАБЛИЦА ТОВАРОВ — всегда снизу, в обоих видах -->
            <div class="tbar">
                <DsTabs v-model="metric" :tabs="metricTabs" />
                <div class="tbar__right">
                    <button type="button" class="tbar__link fm-download"> Скачать таблицу (.xls)</button>
                    <DsSelect v-model="group" :options="groups" placeholder="Группировать по" :show-footer="false" />
                </div>
            </div>

            <DsCard radius="md" padding="--size-2">
                <DsTable :columns="cols" :rows="rows" row-key="id" expandable default-sort-key="profit">
                    <template #cell-name="{ row }">
                        <span v-if="row.isGroup" class="grp">{{ row.name }}</span>
                        <DsProductCell
                            v-else
                            :name="row.name"
                            :copy-id="row.isVariant ? '' : row.nm"
                            :detail="!row.isVariant"
                            :hide-thumb="row.isVariant"
                        />
                    </template>
                    <template #cell-profit="{ row }">
                        <span :class="neg(row.profit) ? 'neg' : 'pos'">{{ row.profit }}</span>
                    </template>
                    <template #cell-info>
                        <button type="button" class="more-btn fm-chevron-right" aria-label="Подробнее"></button>
                    </template>
                </DsTable>
            </DsCard>

            <div class="tfoot">
                <DsPagination :page="page" :total="690" :per-page="50" @change="p => page = p" />
            </div>
        </div>
    </DsAppShell>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import DsAppShell from '@/Components/Ds/DsAppShell.vue';
import DsSummaryCard from '@/Components/Ds/DsSummaryCard.vue';
import DsTabs from '@/Components/Ds/DsTabs.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsChart from '@/Components/Ds/DsChart.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsTable from '@/Components/Ds/DsTable.vue';
import DsPagination from '@/Components/Ds/DsPagination.vue';
import DsProductCell from '@/Components/Ds/DsProductCell.vue';
import DsInfoList from '@/Components/Ds/DsInfoList.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';

const nav = [
    { key: 'dashboard', label: 'Дэшборд', icon: 'fm-grid', href: '#' },
    { key: 'products', label: 'Товары', icon: 'fm-box', href: '#' },
    { key: 'expenses', label: 'Расходы', icon: 'fm-credit-card', href: '#' },
    { key: 'redeems', label: 'Самовыкупы', icon: 'fm-refresh-cw', href: '#' },
    { key: 'ads', label: 'Реклама', icon: 'fm-volume-2', href: '#' },
    { key: 'warehouse', label: 'Склад', icon: 'fm-archive', href: '#' },
    { key: 'settings', label: 'Настройки', icon: 'fm-settings', href: '#' },
];

const hintOpen = ref(true);
const view = ref('chart');
const views = [{ key: 'grid', label: 'Плитки' }, { key: 'chart', label: 'Диаграмма' }];
const search = ref(null);

// ── Период-карточки (реальные числа account 4) ──
const periods = [
    { title: 'Сегодня', subtitle: '11.06.2026', gradient: 'blue', metrics: pm('176 196,45 ₽ / 89 шт.', '173 750,93 ₽ / 110 шт.', '−3 637,89 ₽ / 1 шт.', '122 928,35 ₽', '88 038,35 ₽') },
    { title: 'Вчера', subtitle: '10.06.2026', gradient: 'muted', metrics: pm('173 322,34 ₽ / 84 шт.', '215 723,77 ₽ / 104 шт.', '−2 541,00 ₽ / 2 шт.', '101 676,38 ₽', '84 747,10 ₽') },
    { title: 'Текущий месяц', subtitle: '01.06.2026 до 11.06.2026', gradient: 'indigo-deep', icon: 'info', metrics: pm('2 092 470,19 ₽ / 1012 шт.', '2 356 778,09 ₽ / 1197 шт.', '−60 339,70 ₽ / 29 шт.', '1 190 513,03 ₽', '988 134,74 ₽') },
    { title: 'Прошлый месяц', subtitle: '01.05.2026 до 31.05.2026', gradient: 'periwinkle', metrics: pm('5 153 549,38 ₽ / 2729 шт.', '5 933 740,81 ₽ / 3130 шт.', '−278 682,95 ₽ / 134 шт.', '2 632 463,60 ₽', '2 141 283,49 ₽') },
];
function pm(sales, orders, refunds, payout, profit) {
    return [
        { label: 'Продажи', value: sales }, { label: 'Заказы', value: orders }, { label: 'Возвраты', value: refunds },
        { label: 'Сумма выплат', value: payout, info: true }, { label: 'Прибыль', value: profit, info: true },
    ];
}

// ── Диаграмма + сводка ──
const sumTab = ref('month');
const sumTabs = [{ key: 'month', label: '1–11 Июнь 2026' }, { key: 'all', label: 'Весь период' }];
const chartLabels = ['Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь'];
const chartSeries = [
    { name: 'Заказано', type: 'line', axis: 'right', color: '--chart-blue', values: [0, 5000, 5500, 1500, 6000, 4600, 3700, 3200, 4900, 5800, 5900, 1900] },
    { name: 'Продано', type: 'line', axis: 'right', color: '--chart-green', values: [0, 7000, 6300, 5000, 4600, 4200, 2900, 2800, 4900, 4900, 4600, 1700] },
    { name: 'Возвращено', type: 'line', axis: 'right', color: '--chart-red', values: [0, 200, 150, 220, 180, 160, 140, 120, 180, 200, 190, 80] },
    { name: 'Продажи', type: 'bar', axis: 'left', color: '--chart-purple-light', values: [0, 24000000, 19000000, 13500000, 15500000, 16500000, 12500000, 9000000, 7500000, 10500000, 10000000, 3500000] },
    { name: 'Прибыль', type: 'bar', axis: 'left', color: '--chart-pink', values: [0, 12000000, 9500000, 6500000, 6500000, 6500000, 4500000, 3500000, 1500000, 4200000, 4000000, 1300000] },
];
const summary = [
    { label: 'Продажи', value: '3 273 560,23 ₽', children: [{ label: 'Количество товаров', value: '1 332' }, { label: 'Продажи со скидкой', value: '3 273 560,23 ₽' }] },
    { label: 'Возвраты', value: '−88 357,00 ₽', children: [{ label: 'Количество возвратов', value: '38' }] },
    { label: 'Удержания', value: '−1 681 132,55 ₽', children: [{ label: 'Логистика', value: '−1 184 200,00 ₽' }, { label: 'Комиссия', value: '−496 932,55 ₽' }] },
    { label: 'Реклама', value: '−6 909,26 ₽', children: [{ label: 'Авто-реклама', value: '−6 909,26 ₽' }] },
    { label: 'Себестоимость', value: '−1 600,00 ₽', info: true },
    { label: 'Валовая прибыль', value: '1 495 561,42 ₽' },
    { label: 'Расходы', value: '0,00 ₽' },
    { label: 'НДС', value: '−85 428,07 ₽' },
    { label: 'Налог на доход', value: '−102 513,68 ₽' },
    { label: 'Прибыль', value: '1 307 619,67 ₽', strong: true },
    { label: 'Сумма выплат', value: '1 481 379,86 ₽' },
    { label: 'Маржа', value: '41,05 %', bg: true },
    { label: 'ROI', value: '81 726,23 %', bg: true, info: true },
    { label: 'ДРР', value: '0,21 %', bg: true },
    { label: 'Выкупаемость', value: '90,86 %', bg: true },
];

// ── Таблица товаров ──
const metric = ref('orders');
const metricTabs = [{ key: 'sales', label: 'Продажи' }, { key: 'orders', label: 'Заказы' }];
const group = ref(null);
const groups = ['Не группировать', 'Артикулу', 'Бренду'];
const page = ref(1);

// Колонки зависят от вкладки Продажи/Заказы (реал: «Продажи» — полный набор).
const baseCols = [
    { key: 'name', label: 'Товар', width: '22%' },
    { key: 'lead', label: 'Заказано', numeric: true, sortable: true },          // переопределяется
    { key: 'returned', label: 'Возвращено', numeric: true, sortable: true },
    { key: 'sales', label: 'Продажи', numeric: true, sortable: true },
    { key: 'refunds', label: 'Возвраты', numeric: true, sortable: true },
    { key: 'deduction', label: 'Удержания', numeric: true, sortable: true },
    { key: 'ads', label: 'Реклама', numeric: true, sortable: true },
    { key: 'profit', label: 'Прибыль', numeric: true, sortable: true },
    { key: 'profitUnit', label: 'Прибыль на ед.', numeric: true, sortable: true },
    { key: 'margin', label: 'Маржа', numeric: true, sortable: true },
    { key: 'roi', label: 'ROI', numeric: true, sortable: true },
    { key: 'drr', label: 'ДРР', numeric: true, sortable: true },
    { key: 'redemption', label: 'Выкупаемость', numeric: true, sortable: true },
    { key: 'info', label: 'Инфо', align: 'center', width: 'var(--size-48)' },
];
const cols = computed(() => {
    const lead = { ...baseCols[1], label: metric.value === 'orders' ? 'Заказано' : 'Продано' };
    if (metric.value === 'orders') {
        // Заказы: без Реклама/Маржа/ROI/ДРР/Выкупаемость
        const drop = new Set(['ads', 'margin', 'roi', 'drr', 'redemption']);
        return [baseCols[0], lead, ...baseCols.slice(2).filter((c) => !drop.has(c.key))];
    }
    return [baseCols[0], lead, ...baseCols.slice(2)];
});

const products = [
    { id: 1, name: 'Капли для носа', nm: '200405', lead: '60', returned: '2', sales: '0,00 ₽', refunds: '−598,00 ₽', deduction: '−3 845,15 ₽', ads: '0,00 ₽', profit: '6 928,46 ₽', profitUnit: '177,65 ₽', margin: '64,82 %', roi: '291,06 %', drr: '0,00 %', redemption: '96,7 %',
      children: [
        { id: '1a', isVariant: true, name: 'Размер S', lead: '28', returned: '1', sales: '0,00 ₽', refunds: '−299,00 ₽', deduction: '−1 922,00 ₽', ads: '0,00 ₽', profit: '3 460,00 ₽', profitUnit: '178,00 ₽', margin: '64,8 %', roi: '290,0 %', drr: '0,00 %', redemption: '96,4 %' },
        { id: '1b', isVariant: true, name: 'Размер M', lead: '32', returned: '1', sales: '0,00 ₽', refunds: '−299,00 ₽', deduction: '−1 923,15 ₽', ads: '0,00 ₽', profit: '3 468,46 ₽', profitUnit: '177,30 ₽', margin: '64,9 %', roi: '292,0 %', drr: '0,00 %', redemption: '97,0 %' },
      ] },
    { id: 2, name: 'Масло для массажа', nm: '325546', lead: '71', returned: '0', sales: '0,00 ₽', refunds: '0,00 ₽', deduction: '−21 923,60 ₽', ads: '0,00 ₽', profit: '16 825,92 ₽', profitUnit: '431,43 ₽', margin: '64,35 %', roi: '210,4 %', drr: '0,00 %', redemption: '98,1 %' },
    { id: 3, name: 'Маска для сна', nm: '116018', lead: '61', returned: '0', sales: '0,00 ₽', refunds: '0,00 ₽', deduction: '−2 235,38 ₽', ads: '0,00 ₽', profit: '4 027,31 ₽', profitUnit: '149,16 ₽', margin: '64,82 %', roi: '188,2 %', drr: '0,00 %', redemption: '95,3 %' },
    { id: 4, name: 'Соска-пустышка', nm: '156004', lead: '33', returned: '0', sales: '0,00 ₽', refunds: '0,00 ₽', deduction: '−29 895,15 ₽', ads: '0,00 ₽', profit: '28 026,09 ₽', profitUnit: '1 077,93 ₽', margin: '64,29 %', roi: '171,0 %', drr: '0,00 %', redemption: '94,9 %' },
    { id: 5, name: 'Штора для душа', nm: '702202', lead: '28', returned: '0', sales: '0,00 ₽', refunds: '0,00 ₽', deduction: '−19 288,96 ₽', ads: '0,00 ₽', profit: '19 215,98 ₽', profitUnit: '768,64 ₽', margin: '64,40 %', roi: '180,5 %', drr: '0,00 %', redemption: '93,1 %' },
];

// Группировка по бренду: строки-группы с суммой и раскрытием в товары (реал «Группировать по бренду»).
const brandGroups = [
    { id: 'g1', isGroup: true, name: 'BRAND6a0c481f9bee', lead: '69', returned: '0', sales: '122 924,79 ₽', refunds: '0,00 ₽', deduction: '−35 626,74 ₽', ads: '0,00 ₽', profit: '69 564,73 ₽', profitUnit: '1 008,18 ₽', margin: '56,59 %', roi: '2 910,66 %', drr: '0,00 %', redemption: '95,1 %',
      children: products.slice(0, 3) },
    { id: 'g2', isGroup: true, name: 'BRAND6a0c481f9f0f', lead: '8', returned: '1', sales: '17 087,60 ₽', refunds: '−3 637,89 ₽', deduction: '−3 496,92 ₽', ads: '0,00 ₽', profit: '8 674,53 ₽', profitUnit: '1 239,22 ₽', margin: '64,50 %', roi: '248,0 %', drr: '0,00 %', redemption: '90,0 %',
      children: products.slice(3, 5) },
    { id: 'g3', isGroup: true, name: 'Нет бренда', lead: '3', returned: '0', sales: '9 380,00 ₽', refunds: '0,00 ₽', deduction: '−2 720,20 ₽', ads: '0,00 ₽', profit: '6 050,44 ₽', profitUnit: '2 016,81 ₽', margin: '64,50 %', roi: '222,4 %', drr: '0,00 %', redemption: '88,0 %',
      children: products.slice(1, 3) },
];

// Итоговый набор строк зависит от выбора «Группировать по».
const rows = computed(() => (group.value === 'Бренду' || group.value === 'Артикулу' ? brandGroups : products));

function neg(v) { return typeof v === 'string' && v.includes('−'); }
</script>

<style scoped>
/* ── Каркас: лого / топбар / аккаунт ── */
.brand { font-size: var(--font-size-heading-m); font-weight: var(--font-weight-bold); color: var(--brand); }
.topbar { display: inline-flex; align-items: center; gap: var(--size-24); }
.topbar__page { color: var(--text-heading); }
.topbar__ico { color: var(--text-muted); font-size: var(--font-size-heading-m); cursor: pointer; }
.acc { display: inline-flex; align-items: center; gap: var(--size-8); }
.acc__avatar { display: inline-flex; align-items: center; justify-content: center; width: var(--size-32); height: var(--size-32); border-radius: var(--radius-full); background: var(--brand); color: var(--white); font-size: var(--font-size-body-s); }
.acc__body { display: inline-flex; flex-direction: column; }
.acc__name { color: var(--text-heading); }
.acc__store { color: var(--text-muted); }

.screen { padding: var(--size-24); display: flex; flex-direction: column; gap: var(--size-16); }

.hint-thumb { display: block; width: 96px; height: 56px; border-radius: var(--radius-sm); background: var(--brand-gradient); }

/* Верхний тулбар */
.bar { display: flex; align-items: center; gap: var(--size-8); }
.bar__search { flex: 1 1 auto; max-width: 540px; }
.bar__date { width: var(--control-height-md); height: var(--control-height-md); border: 0; border-radius: var(--radius-sm); background: var(--brand); color: var(--white); cursor: pointer; margin-left: auto; }

.periods { display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--size-128) * 2), 1fr)); gap: var(--size-16); }
.more { display: inline-block; padding: 1px 0; border: 0; border-bottom: 1px dashed var(--brand); background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; }

.chart { display: grid; grid-template-columns: 1fr; gap: var(--size-16); }
@media (min-width: 992px) { .chart { grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); align-items: start; } }
.chart__sumlist { margin-top: var(--size-12); }

/* Тулбар таблицы */
.tbar { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--size-16); flex-wrap: wrap; }
.tbar__right { display: flex; align-items: center; gap: var(--size-16); flex-wrap: wrap; }
.tbar__link { border: 0; background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; display: inline-flex; align-items: center; gap: var(--size-4); }

.grp { font-weight: var(--font-weight-semibold); color: var(--text-heading); }
.more-btn { border: 0; background: transparent; color: var(--text-muted); font-size: var(--font-size-title-m); line-height: 1; cursor: pointer; }
.more-btn:hover { color: var(--brand); }
.pos { color: var(--accent-positive); }
.neg { color: var(--status-danger); }
.tfoot { display: flex; justify-content: center; }
</style>
