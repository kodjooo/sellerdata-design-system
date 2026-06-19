<template>
    <Head title="Дэшборд — экран-эталон" />
    <DsAppShell :items="nav" active="dashboard">
        <template #title>Дэшборд</template>
        <template #actions>
            <DsTag variant="soft" tone="success">Основной магазин</DsTag>
        </template>

        <div class="screen">
            <!-- Тулбар: переключатель вида (Плитки/Диаграмма) + фильтр -->
            <div class="screen__toolbar">
                <DsTabs v-model="view" :tabs="views" />
                <div class="screen__filters">
                    <DsButton variant="secondary"><template #iconLeft>⚲</template>Фильтр</DsButton>
                </div>
            </div>

            <!-- Вид «Плитки» = сетка период-карточек -->
            <div v-if="view === 'grid'" class="screen__periods">
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

            <!-- Вид «Диаграмма» = комбо-график + панель финансовой сводки -->
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
import DsTag from '@/Components/Ds/DsTag.vue';

const nav = [
    { key: 'dashboard', label: 'Дэшборд', icon: '▦', href: '#' },
    { key: 'products', label: 'Товары', icon: '▭', href: '#' },
    { key: 'expenses', label: 'Расходы', icon: '↺', href: '#' },
    { key: 'ads', label: 'Реклама', icon: '◎', href: '#' },
];

// Вид страницы: grid (Плитки) | chart (Диаграмма) — переключает весь контент.
const view = ref('chart');
const views = [
    { key: 'grid', label: 'Плитки' },
    { key: 'chart', label: 'Диаграмма' },
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

const chartLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь'];
const chartSeries = [
    { name: 'Заказано', type: 'line', axis: 'right', color: '--chart-blue', values: [180, 240, 210, 300, 360, 420] },
    { name: 'Продано', type: 'line', axis: 'right', color: '--chart-green', values: [150, 200, 180, 260, 320, 380] },
    { name: 'Возвращено', type: 'line', axis: 'right', color: '--chart-red', values: [12, 18, 14, 22, 28, 30] },
    { name: 'Продажи', type: 'bar', axis: 'left', color: '--chart-purple-light', values: [184000, 240000, 210000, 300000, 360000, 420000] },
    { name: 'Прибыль', type: 'bar', axis: 'left', color: '--chart-pink', values: [41000, 56000, 48000, 72000, 90000, 110000] },
];

// Панель сводки (TransactionSummary): группы с раскрытием + хвост коэффициентов (серый фон).
const sumTab = ref('month');
const sumTabs = [
    { key: 'month', label: 'Июнь 2026' },
    { key: 'all', label: 'Весь период' },
];
const open = ref(new Set([0]));
function toggle(i) { const n = new Set(open.value); n.has(i) ? n.delete(i) : n.add(i); open.value = n; }
const summary = [
    { label: 'Продажи', value: '984 595 ₽', children: [
        { label: 'Количество товаров', value: '1 572' },
        { label: 'Продажи со скидкой', value: '984 595 ₽' },
    ] },
    { label: 'Возвраты', value: '−4 411 ₽', children: [{ label: 'Количество возвратов', value: '5' }] },
    { label: 'Удержания', value: '−312 880 ₽', children: [
        { label: 'Логистика', value: '−214 500 ₽' },
        { label: 'Комиссия', value: '−98 380 ₽' },
    ] },
    { label: 'Реклама', value: '−24 110 ₽' },
    { label: 'Себестоимость', value: '−286 540 ₽' },
    { label: 'Валовая прибыль', value: '356 654 ₽' },
    { label: 'НДС', value: '0 ₽' },
    { label: 'Налог на доход', value: '−59 075 ₽' },
    { label: 'Прибыль', value: '242 805 ₽', strong: true },
    { label: 'Сумма выплат', value: '572 311 ₽' },
    { label: 'Маржа', value: '24,8 %', bg: true },
    { label: 'ROI', value: '84,7 %', bg: true },
    { label: 'ДРР', value: '2,4 %', bg: true },
    { label: 'Выкупаемость', value: '96,4 %', bg: true },
];
</script>

<style scoped>
.screen { padding: var(--size-24); display: flex; flex-direction: column; gap: var(--size-20); }
.screen__toolbar { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--size-16); flex-wrap: wrap; }
.screen__periods { display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--size-128) * 2), 1fr)); gap: var(--size-16); }
.screen__more { display: inline-block; padding: 1px 0; border: 0; border-bottom: 1px dashed var(--brand); background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; }

/* Вид «Диаграмма»: график (шире) + панель сводки */
.screen__chart { display: grid; grid-template-columns: 1fr; gap: var(--size-16); }
@media (min-width: 992px) { .screen__chart { grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); align-items: start; } }

/* Панель финансовой сводки (info-list) */
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
