<template>
    <!--
        DsNotificationList — список уведомлений в дропдауне (реал: .notification-list /
        .notification-item). Группировка по датам (заголовок-дата), типы через иконку/цвет
        (null/alert/success/warning), новые (isNew) — серый фон-акцент. Пусто — DsEmptyState.
        Композирует DsEmptyState.
    -->
    <div class="ds-notif">
        <div v-if="hasItems" class="ds-notif__inner">
            <div v-if="showMarkAll" class="ds-notif__toolbar">
                <button type="button" class="t-label ds-notif__markAll" @click="emit('markAllRead')">
                    Отметить все прочитанными
                </button>
            </div>

            <div v-for="group in normalizedGroups" :key="group.date" class="ds-notif__group">
                <div class="t-caption ds-notif__groupDate">{{ group.date }}</div>

                <div
                    v-for="item in group.items"
                    :key="item.id"
                    class="ds-notif__item"
                    :class="{ 'ds-notif__item--new': item.isNew }"
                >
                    <div class="ds-notif__ico" :class="iconTone(item.type)">
                        <i :class="iconClass(item.type)" aria-hidden="true"></i>
                    </div>

                    <div class="ds-notif__body">
                        <div class="t-body-s ds-notif__title">{{ item.title }}</div>
                        <div v-if="item.text" class="t-body-s ds-notif__text">{{ item.text }}</div>
                    </div>

                    <div class="ds-notif__meta">
                        <div v-if="item.date" class="t-caption ds-notif__time">{{ item.date }}</div>
                        <button
                            v-if="item.isNew"
                            type="button"
                            class="ds-notif__markBtn"
                            aria-label="Отметить прочитанным"
                            @click="emit('markRead', item.id)"
                        >
                            <i class="fm-check" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <DsEmptyState
            v-else
            icon="rotate"
            title="Уведомлений нет"
            description="Здесь появятся события по вашим магазинам."
        />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import DsEmptyState from './DsEmptyState.vue';

const props = defineProps({
    // Готовые группы [{ date, items: [...] }]. Имеет приоритет над items.
    groups: { type: Array, default: () => [] },
    // Плоский массив [{ id, type, title, text, date, isNew }] — сгруппируем сами по date.
    items: { type: Array, default: () => [] },
    // Показывать кнопку «Отметить все прочитанными».
    showMarkAll: { type: Boolean, default: true },
});

const emit = defineEmits(['markRead', 'markAllRead']);

// Если переданы готовые группы — используем их; иначе группируем плоский items по полю date.
const normalizedGroups = computed(() => {
    if (props.groups.length) return props.groups;
    const map = new Map();
    for (const item of props.items) {
        const key = item.dateGroup || item.date || '';
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
    }
    return Array.from(map, ([date, items]) => ({ date, items }));
});

const hasItems = computed(() => normalizedGroups.value.some((g) => g.items.length));

// Тип → fm-иконка (реал: null/warning → alert-triangle, success → check).
function iconClass(type) {
    return type === 'success' ? 'fm-check' : 'fm-alert-triangle';
}

// Тип → цветовой модификатор иконки (реал: alert/warning — danger, success — success).
function iconTone(type) {
    if (type === 'success') return 'ds-notif__ico--success';
    if (type === 'alert') return 'ds-notif__ico--danger';
    if (type === 'warning') return 'ds-notif__ico--warning';
    return 'ds-notif__ico--warning';
}
</script>

<style lang="scss" scoped>
/* реал .notification-list: белая карточка, скролл, тень */
.ds-notif {
    background: var(--surface-default);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    overflow: auto;
    max-height: 60vh;
    width: 100%;
    padding: var(--size-16);
}

.ds-notif__toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--size-8);
}

.ds-notif__markAll {
    padding: 0;
    background: transparent;
    border: 0;
    color: var(--brand);
    cursor: pointer;
}

.ds-notif__group:not(:first-child) {
    margin-top: var(--size-4);
}

/* реал .notification-list__itemsGroupDate */
.ds-notif__groupDate {
    color: var(--text-muted);
    padding: var(--size-4) 0;
    margin-top: var(--size-4);
}

/* реал .notification-item: рамка, радиус, флекс */
.ds-notif__item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--size-8);
    padding: var(--size-8);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);

    & + & {
        margin-top: var(--size-4);
    }
}

/* реал .notification-item_new: серый акцент-фон у новых */
.ds-notif__item--new {
    background: var(--surface-muted);
}

/* реал .notification-item__ico: 40×40, 16px, цвет по типу */
.ds-notif__ico {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-40);
    height: var(--size-40);
    font-size: var(--size-16);
}
.ds-notif__ico--success { color: var(--status-success); }
.ds-notif__ico--danger  { color: var(--status-danger); }
.ds-notif__ico--warning { color: var(--status-warning); }

.ds-notif__body {
    flex: 1;
    min-width: 0;
}

/* реал .notification-item__title */
.ds-notif__title {
    font-weight: 600;
    color: var(--text-strong);
    line-height: 1.2;
}

/* реал .notification-item__content */
.ds-notif__text {
    color: var(--text-muted);
    margin-top: var(--size-2);
}

.ds-notif__meta {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-4);
}

/* реал .notification-item__datetime: 10px, приглушённый */
.ds-notif__time {
    color: var(--text-muted);
    text-align: center;
}

.ds-notif__markBtn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: var(--size-20);
    height: var(--size-20);
    background: transparent;
    border: 0;
    color: var(--brand);
    cursor: pointer;
}
</style>
