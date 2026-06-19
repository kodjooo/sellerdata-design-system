<template>
    <Head title="Дэшборд — экран-эталон" />
    <DsAppShell :items="nav" active="dashboard">
        <template #title>Дэшборд</template>
        <template #actions>
            <DsTag variant="soft" tone="success">Основной магазин</DsTag>
        </template>

        <div class="screen">
            <!-- Ряд карточек-периодов (featuredFirst: первая метрика крупная) -->
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

            <!-- Переключатель вида: Плитки / Диаграмма -->
            <DsTabs v-model="view" :tabs="views" class="screen__tabs" />

            <!-- Вид «Диаграмма» -->
            <DsCard v-if="view === 'chart'" radius="lg">
                <DsChart :labels="chartLabels" :series="chartSeries" />
            </DsCard>

            <!-- Вид «Плитки» — таблица товаров -->
            <DsCard v-else radius="md" padding="--size-2">
                <DsTable :columns="cols" :rows="rows" mobile-mode="scroll" detail-title="Товар">
                    <template #cell-profit="{ row }">
                        <span :class="row.profitNeg ? 'screen__neg' : 'screen__pos'">{{ row.profit }}</span>
                    </template>
                </DsTable>
            </DsCard>
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
import DsTable from '@/Components/Ds/DsTable.vue';
import DsTag from '@/Components/Ds/DsTag.vue';

const nav = [
    { key: 'dashboard', label: 'Дэшборд', icon: '▦', href: '#' },
    { key: 'products', label: 'Товары', icon: '▭', href: '#' },
    { key: 'expenses', label: 'Расходы', icon: '↺', href: '#' },
    { key: 'ads', label: 'Реклама', icon: '◎', href: '#' },
];

const periods = [
    { title: 'Сегодня', subtitle: '19.06.2026', gradient: 'blue', metrics: m(0) },
    { title: 'Вчера', subtitle: '18.06.2026', gradient: 'muted', metrics: m(1) },
    { title: 'Текущий месяц', subtitle: '01.06 — 19.06.2026', gradient: 'indigo-deep', icon: 'info', metrics: m(2) },
    { title: 'Прошлый месяц', subtitle: '01.05 — 31.05.2026', gradient: 'periwinkle', metrics: m(3) },
];
function m(i) {
    const v = [
        ['0 ₽ / 0 шт.', '2 731 ₽ / 7 шт.', '0 ₽', '0 ₽', '0 ₽'],
        ['81 166 ₽ / 134 шт.', '64 602 ₽ / 102 шт.', '−1 574 ₽ / 2 шт.', '55 478 ₽', '28 531 ₽'],
        ['984 595 ₽ / 1572 шт.', '1 171 521 ₽ / 1858 шт.', '−4 411 ₽ / 5 шт.', '572 311 ₽', '242 805 ₽'],
        ['1 689 797 ₽ / 2575 шт.', '1 967 360 ₽ / 3028 шт.', '−7 408 ₽ / 12 шт.', '1 048 160 ₽', '467 549 ₽'],
    ][i];
    return [
        { label: 'Продажи', value: v[0] },
        { label: 'Заказы', value: v[1] },
        { label: 'Возвраты', value: v[2] },
        { label: 'Сумма выплат', value: v[3], info: true },
        { label: 'Прибыль', value: v[4], info: true },
    ];
}

const view = ref('chart');
const views = [
    { key: 'tiles', label: 'Плитки' },
    { key: 'chart', label: 'Диаграмма' },
];

const chartLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь'];
const chartSeries = [
    { name: 'Заказано', type: 'line', axis: 'right', color: '--chart-blue', values: [180, 240, 210, 300, 360, 420] },
    { name: 'Продано', type: 'line', axis: 'right', color: '--chart-green', values: [150, 200, 180, 260, 320, 380] },
    { name: 'Возвращено', type: 'line', axis: 'right', color: '--chart-red', values: [12, 18, 14, 22, 28, 30] },
    { name: 'Продажи', type: 'bar', axis: 'left', color: '--chart-purple-light', values: [184000, 240000, 210000, 300000, 360000, 420000] },
    { name: 'Прибыль', type: 'bar', axis: 'left', color: '--chart-pink', values: [41000, 56000, 48000, 72000, 90000, 110000] },
];

const cols = [
    { key: 'name', label: 'Товар' },
    { key: 'sold', label: 'Продано', numeric: true },
    { key: 'sales', label: 'Продажи', numeric: true },
    { key: 'profit', label: 'Прибыль', numeric: true },
    { key: 'margin', label: 'Маржа', numeric: true },
];
const rows = [
    { id: 1, name: 'Паста для полировки металла Autosol, 75 мл', sold: '312', sales: '232 440 ₽', profit: '41 320 ₽', margin: '17,8%' },
    { id: 2, name: 'Полихлоропреновый клей Kenda Farben', sold: '140', sales: '44 800 ₽', profit: '−1 210 ₽', margin: '−2,7%', profitNeg: true },
    { id: 3, name: 'Клей на водной основе, 1 л', sold: '72', sales: '28 800 ₽', profit: '6 540 ₽', margin: '22,7%' },
];
</script>

<style scoped>
.screen { padding: var(--size-24); display: flex; flex-direction: column; gap: var(--size-24); }
.screen__periods { display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--size-128) * 2), 1fr)); gap: var(--size-16); }
.screen__tabs { margin-bottom: calc(var(--size-8) * -1); }
.screen__more { display: inline-block; padding: 1px 0; border: 0; border-bottom: 1px dashed var(--brand); background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; }
.screen__pos { color: var(--accent-positive); }
.screen__neg { color: var(--status-danger); }
</style>
