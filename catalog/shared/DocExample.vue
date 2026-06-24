<template>
    <!-- Единый контейнер примера: подпись + «сцена» с живым компонентом + опц. код. -->
    <figure class="docEx">
        <figcaption v-if="title" class="docEx__caption">{{ title }}</figcaption>
        <div class="docEx__stage" :class="{ 'docEx__stage--plain': plain }">
            <slot />
        </div>
        <pre v-if="code" class="docEx__code"><code>{{ code }}</code></pre>
    </figure>
</template>

<script setup>
defineProps({
    // Подпись над примером.
    title: { type: String, default: '' },
    // Сниппет кода под примером (опционально).
    code: { type: String, default: '' },
    // plain — без фона/рамки сцены (для тёмных/полноразмерных демо).
    plain: { type: Boolean, default: false },
});
</script>

<style scoped>
.docEx { margin: 0 0 var(--size-16); }
.docEx__caption {
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-semibold);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: var(--size-8);
}
.docEx__stage {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--size-12);
    padding: var(--size-20);
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
}
.docEx__stage--plain { display: block; padding: 0; background: transparent; border: 0; }
.docEx__code {
    margin: var(--size-8) 0 0;
    padding: var(--size-12) var(--size-16);
    background: var(--surface-subtle);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    overflow-x: auto;
    font-family: var(--font-family-mono, monospace);
    font-size: 12px;
    line-height: var(--line-height-normal);
    color: var(--text-heading);
    white-space: pre;
}
.docEx__code code { font-family: inherit; }
</style>
