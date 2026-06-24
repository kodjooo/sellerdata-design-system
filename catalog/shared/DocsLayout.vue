<template>
    <Head :title="`${title} — Sellerdata Design System`" />

    <div class="dsLayout">
        <DocsSidebar />

        <main class="dsLayout__content">
            <header class="dsHeader">
                <div class="dsHeader__breadcrumb" v-if="breadcrumb">{{ breadcrumb }}</div>
                <h1 class="dsHeader__title">{{ title }}</h1>
                <p v-if="description" class="dsHeader__description">{{ description }}</p>
            </header>

            <div class="dsLayout__body">
                <slot />
            </div>
        </main>
    </div>
</template>

<script setup>
import { Head } from '@inertiajs/vue3';
import DocsSidebar from './DocsSidebar.vue';

defineProps({
    title:       { type: String, required: true },
    breadcrumb:  { type: String, default: '' },
    description: { type: String, default: '' },
});
</script>

<style scoped>
.dsLayout {
    display: flex;
    min-height: 100vh;
    background: var(--surface-subtle);
    font-family: var(--font-family-sans);
    color: var(--text-default);
}

.dsLayout__content {
    flex: 1;
    min-width: 0;
    padding: 40px 48px 80px;
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
}

@media (max-width: 768px) {
    .dsLayout__content {
        padding: 24px 20px 60px;
    }
}

.dsHeader {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-default);
}

.dsHeader__breadcrumb {
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-semibold);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}

.dsHeader__title {
    font-size: var(--font-size-heading-l);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-tight);
    color: var(--text-heading);
    margin: 0 0 12px;
}

.dsHeader__description {
    font-size: var(--font-size-body-l);
    line-height: var(--line-height-relaxed);
    color: var(--text-default);
    margin: 0;
    max-width: 720px;
}

.dsLayout__body :deep(section) {
    margin-bottom: 48px;
}

.dsLayout__body :deep(h2) {
    font-size: var(--font-size-heading-l);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-tight);
    color: var(--text-heading);
    margin: 0 0 8px;
}

.dsLayout__body :deep(h3) {
    font-size: var(--font-size-heading-m);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-tight);
    color: var(--text-heading);
    margin: 32px 0 12px;
}

.dsLayout__body :deep(p) {
    font-size: var(--font-size-body-l);
    line-height: var(--line-height-relaxed);
    color: var(--text-default);
    margin: 0 0 16px;
    max-width: 720px;
}
</style>
