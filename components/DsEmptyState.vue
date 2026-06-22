<template>
    <!--
        DsEmptyState — пустое состояние списка/таблицы/страницы (реал: .empty_banner).
        Иконка-кружок + заголовок + описание + опц. CTA. Используется в слоте
        #empty у DsTable и на пустых страницах («Заказы отсутствуют», «Ничего не найдено»).
    -->
    <div class="ds-empty">
        <span class="ds-empty__icon" :class="resolvedIcon" aria-hidden="true"></span>
        <p v-if="title" class="t-heading-m ds-empty__title">{{ title }}</p>
        <p v-if="description" class="t-body-s ds-empty__text">{{ description }}</p>
        <div v-if="$slots.action || $slots.default" class="ds-empty__action">
            <slot name="action"><slot /></slot>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // Иконка: готовый класс fm-* ИЛИ семантический ключ (маппинг ниже).
    icon: { type: String, default: 'search' },
    // Заголовок пустого состояния.
    title: { type: String, default: '' },
    // Описание/подсказка под заголовком.
    description: { type: String, default: '' },
});

// Маппинг семантических ключей на реальные fm-* иконки кабинета.
const iconAliases = {
    search: 'fm-carbon_search',   // «Ничего не найдено» (фильтры, поиск)
    attention: 'fm-attention',    // ошибка / нет доступа
    rotate: 'fm-rotate-ccw',      // «Заказы отсутствуют» (самовыкупы)
};

const resolvedIcon = computed(() =>
    props.icon.startsWith('fm-') ? props.icon : (iconAliases[props.icon] || iconAliases.search),
);
</script>

<style lang="scss" scoped>
.ds-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-8);
    padding: var(--size-48) var(--size-16);
    text-align: center;
}

.ds-empty__icon {
    font-size: var(--font-size-heading-l);
    color: var(--text-placeholder);
}

.ds-empty__title {
    color: var(--text-heading);
}

.ds-empty__text {
    color: var(--text-muted);
}

.ds-empty__action {
    margin-top: var(--size-8);
}
</style>
