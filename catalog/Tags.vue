<template>
    <DocsLayout
        title="Теги"
        breadcrumb="Components"
        description="Компонент DsTag — статус-бейдж. Два вида: solid (.status-tag, заливка) и soft (.tag, мягкая подложка). Тон задаёт семантику."
    >
        <section>
            <h2>Solid</h2>
            <DocExample
                code='<DsTag variant="solid" tone="success">Выполнено</DsTag>'
            >
                <DsTag variant="solid" tone="success">Выполнено</DsTag>
                <DsTag variant="solid" tone="warning">В работе</DsTag>
                <DsTag variant="solid" tone="danger">Возврат</DsTag>
                <DsTag variant="solid" tone="attention">Внимание</DsTag>
            </DocExample>
        </section>

        <section>
            <h2>Soft</h2>
            <DocExample
                code='<DsTag variant="soft" tone="success">В продаже</DsTag>'
            >
                <DsTag variant="soft" tone="success">В продаже</DsTag>
                <DsTag variant="soft" tone="warning">Мало</DsTag>
                <DsTag variant="soft" tone="danger">Нет</DsTag>
                <DsTag variant="soft" tone="default">Нейтральный</DsTag>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Токены</h2>
            <ul class="dsTokens">
                <li><code>--status-success / --status-warning / --status-danger / --status-attention</code> — тона</li>
                <li><code>--radius-sm</code> — скругление</li>
                <li><code>--font-size-caption</code> — размер текста</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsTag from '@/Components/Ds/DsTag.vue';

const props = [
    { name: 'variant', type: "'solid' | 'soft'", default: "'solid'", desc: 'solid — заливка (.status-tag); soft — мягкая подложка (.tag).' },
    { name: 'tone', type: "'default' | 'success' | 'warning' | 'danger' | 'attention'", default: "'default'", desc: 'Семантический тон (цвет).' },
];
</script>

<style scoped>
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
.dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
</style>
