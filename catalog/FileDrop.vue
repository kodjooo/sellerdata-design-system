<template>
    <DocsLayout
        title="Загрузка файлов"
        breadcrumb="Components"
        description="Компонент DsFileDrop — зона drag&drop загрузки (реал: DropFileInput из модалок импорта expenses-import / dashboard-import). Пунктирная зона с подсветкой при перетаскивании + список выбранных файлов со статус-иконкой и полосой прогресса (DsProgressBar) на каждой строке."
    >
        <section>
            <h2>Пример</h2>
            <DocExample>
                <DsFileDrop
                    :files="demoFiles"
                    accept=".csv,.xls,.xlsx,.zip"
                    multiple
                    @select="onSelect"
                    @drop="onSelect"
                    @remove="onRemove"
                />
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Эмиты</h2>
            <PropsTable :rows="emits" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsFileDrop from '@/Components/Ds/DsFileDrop.vue';

const demoFiles = ref([
    { name: 'report-2026-06-01.xlsx', status: 'success' },
    { name: 'report-2026-06-08.xlsx', status: 'loading', progress: 50 },
    { name: 'report-2026-06-15.xlsx', status: 'partial' },
    { name: 'broken-file.csv', status: 'error' },
]);

function onSelect(list) {
    list.forEach((f) => demoFiles.value.push({ name: f.name, status: 'loading', progress: 50 }));
}
function onRemove(i) {
    demoFiles.value.splice(i, 1);
}

const props = [
    { name: 'files', type: 'Array<{ name, progress?, status }>', default: '[]', desc: 'Список файлов. status: loading | success | error | partial. progress (0–100) опционален.' },
    { name: 'accept', type: 'string', default: 'null', desc: 'Допустимые типы (атрибут accept у input[type=file]).' },
    { name: 'multiple', type: 'boolean', default: 'true', desc: 'Разрешить выбор нескольких файлов.' },
];

const emits = [
    { name: 'select', type: 'File[]', default: '—', desc: 'Выбор файлов через диалог (input change).' },
    { name: 'drop', type: 'File[]', default: '—', desc: 'Файлы перетащены в зону (drop).' },
    { name: 'remove', type: 'number', default: '—', desc: 'Удаление строки файла по индексу.' },
];
</script>
