<template>
    <DocsLayout
        title="Список показателей"
        breadcrumb="Components"
        description="Компонент DsInfoList — список «показатель → значение» с раскрытием (реал TransactionSummary / info-list): группы с дочерними строками, выделенная строка (strong) и хвост-коэффициенты на сером фоне (bg). Используется в сводке дашборда и деталь-модалке товара."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <DsCard radius="lg" style="max-width:460px">
                    <DsInfoList :items="items" :default-open="[0]" />
                </DsCard>
            </DocExample>
            <p class="t-body-s dsHint">Строка с <code>children</code> раскрывается по клику. <code>strong</code> — жирная (Прибыль), <code>bg</code> — серая заливка (коэффициенты).</p>
        </section>

        <section>
            <h2>Плоский режим (flat)</h2>
            <p class="t-body-s dsHint">С пропом <code>flat</code> все подстроки показаны всегда, без аккордеона и маркеров — как сводка на дашборде.</p>
            <DocExample plain>
                <DsCard radius="lg" style="max-width:460px">
                    <DsInfoList :items="items" flat />
                </DsCard>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsInfoList from '@/Components/Ds/DsInfoList.vue';

const items = [
    { label: 'Продажи', value: '740 319,80 ₽', children: [
        { label: 'Количество товаров', value: '302' },
        { label: 'Продажи со скидкой', value: '740 319,80 ₽' },
    ] },
    { label: 'Возвраты', value: '−23 324,00 ₽', children: [{ label: 'Количество возвратов', value: '9' }] },
    { label: 'Удержания', value: '−268 410,00 ₽' },
    { label: 'Прибыль', value: '279 456,21 ₽', strong: true },
    { label: 'Маржа', value: '37,7 %', bg: true },
    { label: 'ROI', value: '88,2 %', bg: true },
];

const props = [
    { name: 'items', type: 'Array<{label,value,children?,strong?,bg?,info?}>', default: '[]', desc: 'Строки списка; children — раскрываемые подстроки.' },
    { name: 'defaultOpen', type: 'number[]', default: '[]', desc: 'Индексы строк, раскрытых изначально.' },
    { name: 'flat', type: 'boolean', default: 'false', desc: 'Плоский список: все подстроки показаны всегда, без аккордеона и маркеров (сводка дашборда).' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); }
.dsHint code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
</style>
