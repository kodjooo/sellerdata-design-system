<template>
    <DocsLayout
        title="Меню уведомлений"
        breadcrumb="Components"
        description="Компонент DsNotificationMenu — колокол уведомлений в топбаре: триггер DsNotificationBell (иконка + счётчик), по клику — поповер со списком DsNotificationList. Композирует DsPopover + DsNotificationBell + DsNotificationList."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <div style="display:flex; justify-content:flex-end; padding:var(--size-16); background:var(--surface-default); border:1px solid var(--border-default); border-radius:var(--radius-md)">
                    <DsNotificationMenu :count="3" />
                </div>
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
import DsNotificationMenu from '@/Components/Ds/DsNotificationMenu.vue';

const props = [
    { name: 'count', type: 'number', default: '0', desc: 'Число непрочитанных (бейдж на колоколе).' },
    { name: 'items', type: 'Array<{id,type,title,text,date,isNew}>', default: '3 примера', desc: 'Уведомления для списка.' },
];
</script>
