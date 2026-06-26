<template>
    <DocsLayout
        title="Поток шагов"
        breadcrumb="Components"
        description="DsStepFlow — горизонтальный поток иконочных шагов со стрелками-разделителями. Реал: «Как это работает» в «Пригласи друга». На <lg — одна колонка, стрелки скрыты. Не путать с DsStepper (нумерованный вертикальный)."
    >
        <section>
            <h2>Базовый вид</h2>
            <DocExample
                code='<DsStepFlow :steps="steps" />'
            >
                <div class="dsBlock">
                    <DsStepFlow :steps="steps" />
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
                <li><code>--border-default</code> / <code>--radius-lg</code> — карточка шага</li>
                <li><code>--surface-subtle</code> / <code>--brand</code> — кружок иконки</li>
                <li><code>--text-placeholder</code> — стрелки-разделители</li>
                <li><code>--size-64</code> — размер кружка, <code>--size-24</code> — паддинг шага</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsStepFlow from '@/Components/Ds/DsStepFlow.vue';

const steps = [
    { icon: 'fm-send', title: 'Отправляете ссылку', text: 'Поделитесь ссылкой с друзьями.' },
    { icon: 'fm-user-check', title: 'Друг регистрируется', text: 'Друзья получают мгновенный доступ к бонусам.' },
    { icon: 'fm-gift', title: 'Получаете бонус', text: 'Дополнительный месяц к тарифу — бесплатно!' },
];

const props = [
    { name: 'steps', type: 'Array', default: '[]', desc: 'Шаги: [{ icon (fm-*), title, text }].' },
];
</script>

<style scoped>
.dsBlock { width: 100%; }
.dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
</style>
