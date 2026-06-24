<template>
    <DocsLayout
        title="Мобильный фильтр"
        breadcrumb="Components"
        description="Компонент DsFilterSheet — full-screen фильтр для мобайла (реал: _live__*__мобайл-фильтр). На десктопе фильтры живут в тулбаре строкой; на мобайле сворачиваются в круглую кнопку-воронку, открывающую этот лист. Шапка-градиент «← Фильтр», строки «иконка + подпись + ›», футер «Сбросить / Фильтровать». Построен поверх DsModal size=fullscreen."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <DsButton variant="secondary" @click="open = true">
                    <template #iconLeft>⚲</template>Открыть фильтр
                </DsButton>
                <DsFilterSheet
                    v-model:visible="open"
                    :items="items"
                    @reset="open = false"
                    @apply="open = false"
                />
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>События</h2>
            <PropsTable :rows="events" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsFilterSheet from '@/Components/Ds/DsFilterSheet.vue';

const open = ref(false);
const items = [
    { key: 'products', label: 'Товары', icon: 'fm-calendar' },
    { key: 'warehouses', label: 'Все склады', icon: 'fm-globe' },
    { key: 'type', label: 'FBO/FBS', icon: 'fm-box' },
];

const props = [
    { name: 'visible', type: 'boolean', default: 'false', desc: 'v-model:visible — открыт ли лист.' },
    { name: 'title', type: 'string', default: "'Фильтр'", desc: 'Заголовок в шапке.' },
    { name: 'items', type: 'Array<{ key, label, icon }>', default: '[]', desc: 'Строки фильтра; icon — класс fm-*.' },
];
const events = [
    { name: 'update:visible', type: '(boolean)', default: '—', desc: 'Закрытие/открытие (v-model).' },
    { name: 'open', type: '(key)', default: '—', desc: 'Тап по строке фильтра.' },
    { name: 'reset', type: '()', default: '—', desc: 'Кнопка «Сбросить».' },
    { name: 'apply', type: '()', default: '—', desc: 'Кнопка «Фильтровать».' },
];
</script>
