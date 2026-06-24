<template>
    <DocsLayout
        title="Пагинация"
        breadcrumb="Components"
        description="Компонент DsPagination. Десктоп (≥1200) — номера страниц со стрелками; мобайл (<1200) — селект «Страница N из M» со стрелками (как в реале)."
    >
        <section>
            <h2>Десктоп — номера</h2>
            <DocExample
                code='<DsPagination :page="page" :total="240" :per-page="20" @change="p => page = p" />'
            >
                <DsPagination :page="page" :total="240" :per-page="20" @change="p => page = p" />
            </DocExample>
        </section>

        <section>
            <h2>Мобильный вид (forceCompact)</h2>
            <p class="t-body-s dsHint">«Страница N из M» — это нативный select: тап открывает выбор страницы.</p>
            <DocExample>
                <DsPagination :page="page" :total="240" :per-page="20" force-compact @change="p => page = p" />
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsPagination from '@/Components/Ds/DsPagination.vue';

const page = ref(5);

const props = [
    { name: 'page', type: 'number', default: '1', desc: 'Текущая страница (1-based).' },
    { name: 'total', type: 'number', default: '0', desc: 'Всего элементов.' },
    { name: 'perPage', type: 'number', default: '20', desc: 'Элементов на странице.' },
    { name: 'siblingCount', type: 'number', default: '1', desc: 'Сколько соседних номеров показывать.' },
    { name: 'mobileCompact', type: 'boolean', default: 'true', desc: '<1200 — компактный селект вместо номеров.' },
    { name: 'forceCompact', type: 'boolean', default: 'false', desc: 'Принудительно компактный вид (любая ширина).' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); }
</style>
