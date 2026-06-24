<template>
    <DocsLayout
        title="Диаграммы"
        breadcrumb="Components"
        description="DsChart — комбо-график как на Дэшборде (столбцы-суммы по левой оси ₽ + линии-количество по правой оси шт.). DsDonut — кольцевая диаграмма (ABC и т.п.). Цвета — палитра --chart-*."
    >
        <section>
            <h2>DsChart — комбо (как «Диаграмма» Дэшборда)</h2>
            <DocExample plain>
                <DsCard radius="lg">
                    <DsChart :labels="chartLabels" :series="chartSeries" />
                </DsCard>
            </DocExample>
            <p class="t-body-s dsHint">Серия: <code>{ name, type:'bar'|'line', axis:'left'|'right', color:'--chart-*', values:[] }</code>. Двойная ось: bars — ₽ слева, lines — шт. справа.</p>
        </section>

        <section>
            <h2>DsDonut — кольцевая</h2>
            <DocExample>
                <div class="donutRow">
                    <DsDonut :segments="abc" label="68%" aria-label="ABC: A 68%, B 22%, C 10%" />
                    <ul class="donutLegend">
                        <li v-for="s in abc" :key="s.label" class="t-body-s">
                            <span class="donutDot" :style="{ background: s.color }"></span>{{ s.label }} — {{ s.value }}%
                        </li>
                    </ul>
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <h3>DsChart</h3>
            <PropsTable :rows="chartProps" />
            <h3>DsDonut</h3>
            <PropsTable :rows="donutProps" />
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsChart from '@/Components/Ds/DsChart.vue';
import DsDonut from '@/Components/Ds/DsDonut.vue';

const chartLabels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь'];
const chartSeries = [
    { name: 'Заказано',   type: 'line', axis: 'right', color: '--chart-blue',         values: [180, 240, 210, 300, 360, 420] },
    { name: 'Продано',    type: 'line', axis: 'right', color: '--chart-green',        values: [150, 200, 180, 260, 320, 380] },
    { name: 'Возвращено', type: 'line', axis: 'right', color: '--chart-red',          values: [12, 18, 14, 22, 28, 30] },
    { name: 'Продажи',    type: 'bar',  axis: 'left',  color: '--chart-purple-light', values: [184000, 240000, 210000, 300000, 360000, 420000] },
    { name: 'Прибыль',    type: 'bar',  axis: 'left',  color: '--chart-pink',         values: [41000, 56000, 48000, 72000, 90000, 110000] },
];

const abc = [
    { label: 'A — приоритет', value: 68, color: 'var(--status-success)' },
    { label: 'B — средний', value: 22, color: 'var(--status-warning)' },
    { label: 'C — низкий', value: 10, color: 'var(--status-danger)' },
];

const chartProps = [
    { name: 'labels', type: 'string[]', default: '[]', desc: 'Подписи оси X.' },
    { name: 'series', type: 'Array<{name,type,axis?,color,values}>', default: '[]', desc: 'Серии: bar/line, ось left/right, цвет-токен, значения.' },
];
const donutProps = [
    { name: 'segments', type: 'Array<{label,value,color}>', default: '[]', desc: 'Сегменты кольца.' },
    { name: 'label', type: 'string', default: "''", desc: 'Центральная подпись.' },
    { name: 'size / strokeWidth', type: 'number', default: '78 / 14', desc: 'Размер кольца и толщина.' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); }
.dsHint code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
.donutRow { display: flex; align-items: center; gap: var(--size-16); }
.donutLegend { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--size-6); }
.donutDot { display: inline-block; width: 9px; height: 9px; border-radius: 2px; margin-right: var(--size-6); vertical-align: middle; }
</style>
