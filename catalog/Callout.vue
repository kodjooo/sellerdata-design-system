<template>
    <DocsLayout
        title="Плашка-CTA"
        breadcrumb="Components"
        description="DsCallout — субтл-плашка с заголовком, текстом и действием справа (слот #action). Реал: блок партнёрской программы в «Пригласи друга». На узких экранах действие переносится."
    >
        <section>
            <h2>Базовый вид</h2>
            <DocExample
                code='<DsCallout title="Вы управляете сообществом продавцов?"
           text="Станьте нашим партнёром и зарабатывайте.">
  <template #action>
    <DsButton variant="primary">Станьте партнёром</DsButton>
  </template>
</DsCallout>'
            >
                <div class="dsBlock">
                    <DsCallout
                        title="Вы управляете сообществом продавцов на Wildberries или Ozon?"
                        text="Если вы обучаете, создаёте контент или помогаете общаться — мы хотим видеть вас партнёром."
                    >
                        <template #action>
                            <DsButton variant="primary">Станьте партнёром</DsButton>
                        </template>
                    </DsCallout>
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Токены</h2>
            <ul class="dsTokens">
                <li><code>--surface-subtle</code> — фон плашки</li>
                <li><code>--radius-md</code> — скругление</li>
                <li><code>--text-heading</code> / <code>--text-muted</code> — заголовок и текст</li>
                <li><code>--size-20</code> / <code>--size-24</code> — паддинги и gap</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsCallout from '@/Components/Ds/DsCallout.vue';
import DsButton from '@/Components/Ds/DsButton.vue';

const props = [
    { name: 'title', type: 'string', default: "''", desc: 'Заголовок плашки (t-label-m).' },
    { name: 'text', type: 'string', default: "''", desc: 'Текст (альтернатива default-слоту).' },
    { name: 'slot:action', type: 'slot', default: '—', desc: 'Действие справа (кнопка).' },
    { name: 'slot:default', type: 'slot', default: '—', desc: 'Контент вместо text.' },
];
</script>

<style scoped>
.dsBlock { width: 100%; }
.dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
</style>
