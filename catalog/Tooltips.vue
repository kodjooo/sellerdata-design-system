<template>
    <DocsLayout
        title="Тултипы"
        breadcrumb="Components"
        description="Компонент DsTooltip — подсказка по наведению/фокусу (реал .tooltip-inner): белая карточка 11px, padding 8, radius 8, overlay-тень, max-width 320, текст слева."
    >
        <section>
            <h2>Пример</h2>
            <DocExample
                code='<DsTooltip text="Доля рекламных расходов от продаж">
  <span class="fm-info"></span>
</DsTooltip>'
            >
                <span class="t-body-s">Наведи на иконку:&nbsp;</span>
                <DsTooltip text="ДРР — доля рекламных расходов от суммы продаж за период.">
                    <span class="ttIcon fm-info" aria-label="Подсказка"></span>
                </DsTooltip>
                <span class="t-body-s">&nbsp;&nbsp;или на текст:&nbsp;</span>
                <DsTooltip text="Маржа = прибыль ÷ выручка × 100%." placement="bottom">
                    <span class="ttDashed">Маржа</span>
                </DsTooltip>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Токены</h2>
            <ul class="dsTokens">
                <li><code>--surface-default</code> · <code>--shadow-overlay</code> — карточка и тень</li>
                <li><code>--text-heading</code> · <code>--font-size-caption</code> (11) — текст</li>
                <li><code>--radius-md</code> · <code>--z-tooltip</code> — форма и слой</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsTooltip from '@/Components/Ds/DsTooltip.vue';

const props = [
    { name: 'text', type: 'string', default: "''", desc: 'Текст подсказки (или слот #content для разметки).' },
    { name: 'placement', type: "'top' | 'bottom'", default: "'top'", desc: 'Положение пузыря относительно триггера.' },
];
</script>

<style scoped>
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
.dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
.ttIcon { color: var(--status-alert); font-size: var(--font-size-title-m); cursor: help; }
.ttDashed { color: var(--text-default); border-bottom: 1px dashed var(--border-strong); }
</style>
