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
.ds-sticky-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-12);
    flex-wrap: wrap;
}

@media (max-width: 767.98px) {
    .ds-sticky-bar--mobile-sticky {
        position: sticky;
        bottom: 0;
        z-index: var(--z-sticky, 10);
        padding: var(--size-12) var(--size-16);
        background: var(--surface-default);
        border-top: 1px solid var(--border-default);
        box-shadow: var(--shadow-card);
    }
}
</style>
