<template>
    <DocsLayout
        title="Карточки"
        breadcrumb="Components"
        description="Поверхности и сводные плитки: DsCard (базовая карточка), DsSummaryCard (сводная плитка склада/дашборда) и DsSummaryCarousel (ряд плиток → вкладки на мобайле)."
    >
        <!-- ─── DsCard ─────────────────────────────────────────────── -->
        <section>
            <h2>DsCard — базовая поверхность</h2>
            <DocExample
                code='<DsCard radius="md" shadow="card">
  <template #header>…</template>
  …
  <template #footer>…</template>
</DsCard>'
            >
                <DsCard style="max-width: 360px;">
                    <template #header><strong class="t-heading-m">Заголовок</strong></template>
                    <p class="t-body-s" style="margin:0;">Тело карточки на токенах: фон --surface-default, тень --shadow-card, радиус --radius-md.</p>
                </DsCard>
            </DocExample>
            <PropsTable :rows="cardProps" />
        </section>

        <!-- ─── DsSummaryCard ──────────────────────────────────────── -->
        <section>
            <h2>DsSummaryCard — сводная плитка</h2>
            <p class="t-body-s dsHint">Шапка — сплошной цвет <code>--summary-*</code>, тело — метрики (12px label / 13px значение). <code>featuredFirst</code> делает первую метрику крупной на всю ширину (карточка-период дашборда).</p>
            <DocExample title="Склад (3 колонки, без эмфазы)">
                <DsSummaryCard gradient="blue" icon="warning" :columns="3" :metrics="summaryMetrics" style="max-width: 460px;">
                    <template #title>Потенциальная прибыль <span class="cardInfo">ⓘ</span></template>
                </DsSummaryCard>
            </DocExample>
            <DocExample title="Период дашборда (featuredFirst + футер)">
                <DsSummaryCard
                    title="Текущий месяц"
                    subtitle="01.06.2026 до 19.06.2026"
                    gradient="indigo-deep"
                    icon="info"
                    featured-first
                    :metrics="dashboardMetrics"
                    style="max-width: 460px;"
                >
                    <template #footer><button type="button" class="cardMore">Больше</button></template>
                </DsSummaryCard>
            </DocExample>
            <PropsTable :rows="summaryProps" />
        </section>

        <!-- ─── DsSummaryCarousel ──────────────────────────────────── -->
        <section>
            <h2>DsSummaryCarousel — ряд плиток</h2>
            <p class="t-body-s dsHint">≥lg — ряд из N плиток; &lt;lg — текстовые вкладки + одна активная карточка (как сводка склада на мобайле).</p>
            <DocExample plain>
                <DsSummaryCarousel :items="carouselItems" :card-columns="3" />
            </DocExample>
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsSummaryCard from '@/Components/Ds/DsSummaryCard.vue';
import DsSummaryCarousel from '@/Components/Ds/DsSummaryCarousel.vue';

const summaryMetrics = [
    { label: 'Склад', value: '12 400 ₽' }, { label: 'Доступно', value: '9 850 ₽' }, { label: 'Резерв', value: '2 550 ₽' },
    { label: 'Промеж. склад', value: '1 120 ₽' }, { label: 'Закупка', value: '4 300 ₽' }, { label: 'Итого', value: '17 820 ₽' },
];
const dashboardMetrics = [
    { label: 'Продажи', value: '184 200 ₽ / 312 шт.' },
    { label: 'Заказы', value: '210 400 ₽ / 358 шт.' },
    { label: 'Возвраты', value: '−12 800 ₽ / 21 шт.' },
    { label: 'Сумма выплат', value: '96 740 ₽', info: true },
    { label: 'Прибыль', value: '41 320 ₽', info: true },
];
const carouselItems = [
    { title: 'Себестоимость', gradient: 'periwinkle', metrics: summaryMetrics },
    { title: 'Потенциальные продажи', gradient: 'blue', metrics: summaryMetrics },
    { title: 'Потенциальная прибыль', gradient: 'indigo-deep', icon: 'warning', metrics: summaryMetrics },
];

const cardProps = [
    { name: 'padding', type: 'string (--size-*)', default: "'--size-16'", desc: 'Внутренний отступ зон.' },
    { name: 'radius', type: "'md' | 'lg'", default: "'md'", desc: 'md (8) — карточки; lg (12) — крупные панели.' },
    { name: 'shadow', type: "'card' | 'none' | 'overlay'", default: "'card'", desc: 'Мягкая тень / плоская / приподнятая.' },
    { name: 'tag', type: 'string', default: "'section'", desc: 'HTML-тег корня.' },
];
const summaryProps = [
    { name: 'title / subtitle', type: 'string', default: "''", desc: 'Заголовок и период в шапке.' },
    { name: 'gradient', type: 'periwinkle | blue | muted | indigo | indigo-deep | navy', default: "'periwinkle'", desc: 'Цвет шапки (сплошной --summary-*).' },
    { name: 'icon', type: "'' | 'info' | 'warning'", default: "''", desc: 'Иконка-индикатор справа в шапке.' },
    { name: 'metrics', type: 'Array<{label,value,info?}>', default: '[]', desc: 'Метрики тела.' },
    { name: 'columns', type: 'number', default: '2', desc: 'Число колонок метрик.' },
    { name: 'featuredFirst', type: 'boolean', default: 'false', desc: 'Первая метрика — крупная, на всю ширину.' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); }
.dsHint code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
.cardInfo { color: var(--white); opacity: var(--opacity-hover); font-size: var(--font-size-body-s); }
.cardMore { display: inline-block; padding: 1px 0; border: 0; border-bottom: 1px dashed var(--brand); background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; }
</style>
