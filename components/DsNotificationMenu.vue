<template>
    <!--
        DsNotificationMenu — колокол уведомлений в топбаре: триггер DsNotificationBell
        (иконка + счётчик), по клику — поповер со списком DsNotificationList.
        Композирует DsPopover + DsNotificationBell + DsNotificationList.
    -->
    <DsPopover placement="bottom-end">
        <DsNotificationBell :count="count" />
        <template #content="{ close }">
            <div class="ds-notif-menu__panel">
                <DsNotificationList
                    :items="items"
                    show-mark-all
                    @mark-read="(id) => $emit('mark-read', id)"
                    @mark-all-read="$emit('mark-all-read'); close()"
                />
            </div>
        </template>
    </DsPopover>
</template>

<script setup>
import DsPopover from './DsPopover.vue';
import DsNotificationBell from './DsNotificationBell.vue';
import DsNotificationList from './DsNotificationList.vue';

defineProps({
    count: { type: Number, default: 0 },
    // Уведомления: [{ id, type, title, text, date, isNew }].
    items: {
        type: Array,
        default: () => ([
            { id: 1, type: 'success', title: 'Синхронизация завершена', text: 'Данные за сегодня обновлены.', date: 'Сегодня', isNew: true },
            { id: 2, type: 'warning', title: 'Заканчивается остаток', text: '3 товара требуют пополнения.', date: 'Сегодня', isNew: true },
            { id: 3, type: 'alert', title: 'Ошибка ключа Ozon', text: 'Проверьте API-ключ магазина.', date: 'Вчера', isNew: false },
        ]),
    },
});
defineEmits(['mark-read', 'mark-all-read']);
</script>

<style lang="scss" scoped>
/* Ширина панели уведомлений (реал ~375px) — задаёт хост-поповер. */
.ds-notif-menu__panel { width: calc(var(--size-128) * 3); max-width: 90vw; }
/* Внутри поповера список — плоский (рамку/тень/фон даёт сам поповер; иначе двойная рамка). */
.ds-notif-menu__panel :deep(.ds-notif) { border-radius: 0; box-shadow: none; background: transparent; }
</style>
