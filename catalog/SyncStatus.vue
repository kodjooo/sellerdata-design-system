<template>
    <DocsLayout
        title="Статус синхронизации"
        breadcrumb="Components"
        description="Компонент DsSyncStatus — блок статуса фоновой синхронизации данных (реал: data_loader_block «Загружаются данные» со строками «Товары / Транзакции / Заказы»). Каждая строка — иконка-состояние + подпись: загрузка (крутящийся DsLoader inline, brand), завершено (галочка fm-check, status-success), частично (кружок fm-circle, status-warning). Блок можно свернуть/развернуть."
    >
        <section>
            <h2>Все состояния строк</h2>
            <DocExample plain>
                <DsSyncStatus :items="allStates" />
            </DocExample>
        </section>

        <section>
            <h2>Развёрнутый / свёрнутый</h2>
            <DocExample plain>
                <DsSyncStatus :items="liveItems" :collapsed="collapsed" @toggle="collapsed = !collapsed" />
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
import DsSyncStatus from '@/Components/Ds/DsSyncStatus.vue';

const collapsed = ref(false);

const allStates = [
    { label: 'Товары', state: 'loading' },
    { label: 'Транзакции', state: 'done' },
    { label: 'Заказы', state: 'partial' },
];

const liveItems = [
    { label: 'Товары', state: 'done' },
    { label: 'Транзакции', state: 'loading' },
    { label: 'Заказы', state: 'loading' },
];

const props = [
    { name: 'items', type: 'array', default: '[]', desc: 'Строки статуса: [{ label, state: \'loading\' | \'done\' | \'partial\' }].' },
    { name: 'collapsed', type: 'boolean', default: 'false', desc: 'Свёрнутое состояние — показывается только шапка с кнопкой.' },
    { name: 'title', type: 'string', default: '\'Обновление данных\'', desc: 'Заголовок блока.' },
];

const emits = [
    { name: 'toggle', type: 'event', default: '—', desc: 'Запрос на сворачивание/разворачивание (состояние держит родитель).' },
];
</script>
