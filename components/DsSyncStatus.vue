<template>
    <!--
        DsSyncStatus — блок статуса фоновой синхронизации данных
        (реал: data_loader_block «Загружаются данные» / строки «Товары /
        Транзакции / Заказы»). Каждая строка — иконка-состояние + подпись:
          loading — крутящийся индикатор (DsLoader inline, brand);
          done    — галочка fm-check (status-success);
          partial — кружок fm-circle (status-warning) «частично».
        Может быть свёрнут (collapsed) — показывается только шапка с кнопкой.
    -->
    <div class="ds-sync-status" :class="{ 'ds-sync-status--collapsed': collapsed }">
        <div class="ds-sync-status__header">
            <p class="ds-sync-status__title t-body-strong">{{ title }}</p>
            <button
                class="ds-sync-status__toggle"
                type="button"
                :aria-expanded="!collapsed"
                :aria-label="collapsed ? 'Развернуть' : 'Свернуть'"
                @click="emit('toggle')"
            >
                <i :class="collapsed ? 'fm-chevron-down' : 'fm-chevron-up'"></i>
            </button>
        </div>

        <ul v-show="!collapsed" class="ds-sync-status__list">
            <li
                v-for="(item, index) in items"
                :key="index"
                class="ds-sync-status__item t-body"
            >
                <span class="ds-sync-status__icon">
                    <DsLoader
                        v-if="item.state === 'loading'"
                        variant="inline"
                        size="sm"
                    />
                    <i
                        v-else-if="item.state === 'done'"
                        class="fm-check ds-sync-status__icon--done"
                    ></i>
                    <i
                        v-else
                        class="fm-circle ds-sync-status__icon--partial"
                    ></i>
                </span>
                <span class="ds-sync-status__label">{{ item.label }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import DsLoader from '@/Components/Ds/DsLoader.vue';

defineProps({
    // Строки статуса: [{ label, state: 'loading' | 'done' | 'partial' }].
    items: { type: Array, default: () => [] },
    // Свёрнутое состояние — показывается только шапка.
    collapsed: { type: Boolean, default: false },
    // Заголовок блока.
    title: { type: String, default: 'Обновление данных' },
});

// toggle — запрос на сворачивание/разворачивание (состояние держит родитель).
const emit = defineEmits(['toggle']);
</script>

<style lang="scss" scoped>
.ds-sync-status {
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    padding: var(--size-16);
}

.ds-sync-status__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-12);
}

.ds-sync-status__title {
    margin: 0;
    color: var(--text-default);
}

.ds-sync-status__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: 0;
    cursor: pointer;
    color: var(--text-muted);
    font-size: var(--size-20);
    line-height: 1;
}

.ds-sync-status__list {
    list-style: none;
    margin: var(--size-12) 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
}

.ds-sync-status__item {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    color: var(--text-default);
}

.ds-sync-status__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size-16);
    height: var(--size-16);
    flex-shrink: 0;
    font-size: var(--size-16);
    line-height: 1;
}

.ds-sync-status__icon--done {
    color: var(--status-success);
}

.ds-sync-status__icon--partial {
    color: var(--status-warning);
}
</style>
