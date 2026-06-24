<template>
    <!--
        DsStickyBar — панель действий внизу страницы (реал: buttons-panel со .xls).
        Десктоп — обычный центрированный ряд в потоке. Мобайл (<768px) — прилипает
        к низу вьюпорта (sticky), белый фон + верхняя граница, как в кабинете.
    -->
    <div class="ds-sticky-bar" :class="{ 'ds-sticky-bar--mobile-sticky': mobileSticky }">
        <slot />
    </div>
</template>

<script setup>
defineProps({
    // На мобайле прилипать к низу вьюпорта (по умолчанию да).
    mobileSticky: { type: Boolean, default: true },
});
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

/* Закреплённый снизу бар действий (реал buttons-panel): ВСЕГДА зафиксирован у нижнего
   края экрана (position: fixed) — и на десктопе, и на мобайле. Белый фон, тень сверху,
   кнопки слева. Во всю ширину; на ≥lg слева отступ под постоянный rail (100px). */
.ds-sticky-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--z-sticky, 10);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--size-12);
    flex-wrap: wrap;
    padding: var(--size-12) var(--size-24);
    background: var(--surface-default);
    box-shadow: var(--shadow-bar);

    /* ≥lg: бар начинается после постоянного rail (100px = --size-96 + --size-4). */
    @include respond-to(lg) {
        left: calc(var(--size-96) + var(--size-4));
    }
}
</style>
