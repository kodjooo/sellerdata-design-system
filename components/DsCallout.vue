<template>
    <!--
        DsCallout — плашка-CTA (реал: партнёрская программа в «Пригласи друга»).
        Субтл-карточка: тело (заголовок + текст) слева, слот #action справа, перенос на узких.
    -->
    <div class="ds-callout">
        <div class="ds-callout__body">
            <p v-if="title" class="t-label-m ds-callout__title">{{ title }}</p>
            <p class="t-body-s ds-callout__text"><slot>{{ text }}</slot></p>
        </div>
        <div v-if="$slots.action" class="ds-callout__action">
            <slot name="action" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    // Заголовок плашки.
    title: { type: String, default: '' },
    // Текст плашки (альтернатива default-слоту).
    text: { type: String, default: '' },
});
</script>

<style lang="scss" scoped>
.ds-callout {
    display: flex; align-items: center; gap: var(--size-24); flex-wrap: wrap;
    padding: var(--size-20) var(--size-24);
    border-radius: var(--radius-md); background: var(--surface-subtle);
}
.ds-callout__body { flex: 1 1 320px; min-width: 0; }
.ds-callout__title { color: var(--text-heading); margin: 0 0 var(--size-4); }
.ds-callout__text { color: var(--text-muted); margin: 0; }
.ds-callout__action { flex: 0 0 auto; }
</style>
