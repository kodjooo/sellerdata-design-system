<template>
    <DocsLayout
        title="Уведомления"
        breadcrumb="Components"
        description="DsNotificationBell (колокол со счётчиком непрочитанных) и DsNotificationList (список уведомлений в дропдауне). Реал: колокол fm-bell с числовым бейджем в шапке; по клику — дропдаун с уведомлениями, типы null/alert/success/warning, маркер новых, группировка по датам, отметка прочитанным."
    >
        <section>
            <h2>Колокол — состояния счётчика</h2>
            <DocExample plain>
                <div class="demoRow">
                    <DsNotificationBell :count="0" @open="onOpen" />
                    <DsNotificationBell :count="3" @open="onOpen" />
                    <DsNotificationBell :count="128" @open="onOpen" />
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Список — типы и группы</h2>
            <DocExample plain>
                <DsNotificationList :items="items" @markRead="onMarkRead" @markAllRead="onMarkAllRead" />
            </DocExample>
        </section>

        <section>
            <h2>Список — пустое состояние</h2>
            <DocExample plain>
                <DsNotificationList :items="[]" />
            </DocExample>
        </section>

        <section>
            <h2>Пропсы DsNotificationBell</h2>
            <PropsTable :rows="bellProps" />
        </section>

        <section>
            <h2>Пропсы DsNotificationList</h2>
            <PropsTable :rows="listProps" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsNotificationBell from '@/Components/Ds/DsNotificationBell.vue';
import DsNotificationList from '@/Components/Ds/DsNotificationList.vue';

const items = ref([
    { id: 1, type: null, title: 'Не удалось синхронизировать остатки', text: 'Проверьте API-ключ магазина.', date: '14:20', isNew: true, dateGroup: 'Сегодня' },
    { id: 2, type: 'success', title: 'Отчёт сформирован', text: 'Выгрузка за май готова к скачиванию.', date: '12:05', isNew: true, dateGroup: 'Сегодня' },
    { id: 3, type: 'warning', title: 'Низкий остаток товара', text: 'Артикул 1029384 — осталось 4 шт.', date: '09:41', isNew: false, dateGroup: 'Сегодня' },
    { id: 4, type: 'alert', title: 'Токен Ozon истёк', text: 'Переподключите магазин для синхронизации.', date: '18:30', isNew: false, dateGroup: 'Вчера' },
]);

function onOpen() {}
function onMarkRead(id) {
    const item = items.value.find((i) => i.id === id);
    if (item) item.isNew = false;
}
function onMarkAllRead() {
    items.value.forEach((i) => { i.isNew = false; });
}

const bellProps = [
    { name: 'count', type: 'number', default: '0', desc: 'Количество непрочитанных. 0 — бейдж скрыт.' },
    { name: 'max', type: 'number', default: '99', desc: 'Максимум на бейдже; больше — «N+».' },
    { name: 'aria-label', type: 'string', default: "'Уведомления'", desc: 'Подпись для скринридеров.' },
];

const listProps = [
    { name: 'groups', type: 'array', default: '[]', desc: 'Готовые группы [{ date, items: [...] }]. Приоритет над items.' },
    { name: 'items', type: 'array', default: '[]', desc: 'Плоский массив [{ id, type, title, text, date, isNew, dateGroup }] — группируется по date/dateGroup.' },
    { name: 'show-mark-all', type: 'boolean', default: 'true', desc: 'Показывать кнопку «Отметить все прочитанными».' },
];
</script>

<style scoped>
.demoRow {
    display: flex;
    align-items: center;
    gap: var(--size-24);
}
</style>
