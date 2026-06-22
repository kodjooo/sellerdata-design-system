<template>
    <!--
        DsStepper — нумерованные шаги инструкции (реал: .response_block / .response_content
        со <span>N</span> + текст + .response_thumb с картинкой — из *ApiKeyHelp.vue,
        напр. resources/js/Components/Common/OzonApiKeyHelp.vue).
        Вертикальный список: кружок с номером + заголовок + контент + опциональный thumb.
        Каждый шаг — на карточке (DsCard), как в реальных инструкциях подключения.
    -->
    <ol class="ds-stepper">
        <li v-for="(step, i) in steps" :key="i" class="ds-stepper__item">
            <span class="ds-stepper__num t-label-m" aria-hidden="true">{{ i + 1 }}</span>
            <DsCard class="ds-stepper__card">
                <div class="ds-stepper__body">
                    <h3 v-if="step.title" class="ds-stepper__title t-title-m">{{ step.title }}</h3>
                    <!-- content допускает простой текст или HTML (ссылки в реальных инструкциях) -->
                    <div class="ds-stepper__content t-body-s" v-html="step.content" />
                </div>
                <div v-if="step.thumb" class="ds-stepper__thumb">
                    <img class="ds-stepper__img" :src="step.thumb" :alt="step.title || 'Шаг ' + (i + 1)">
                </div>
            </DsCard>
        </li>
    </ol>
</template>

<script setup>
import DsCard from '@/Components/Ds/DsCard.vue';

defineProps({
    // Массив шагов: [{ title, content (текст/HTML), thumb? (url картинки) }]
    steps: { type: Array, default: () => [] },
});
</script>

<style lang="scss" scoped>
.ds-stepper {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
}

.ds-stepper__item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--size-16);
}

/* Кружок с номером (реал: .response_content > span). */
.ds-stepper__num {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size-32);
    height: var(--size-32);
    border-radius: var(--radius-full);
    background: var(--brand);
    color: var(--text-on-brand);
}

.ds-stepper__card {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: var(--size-24);
}

.ds-stepper__body {
    flex: 1;
    min-width: 0;
}

.ds-stepper__title {
    margin: 0 0 var(--size-8);
    color: var(--text-default);
}

.ds-stepper__content {
    color: var(--text-default);

    :deep(a) { color: var(--brand); }
    :deep(p) { margin: 0; }
}

.ds-stepper__thumb {
    flex-shrink: 0;
}

.ds-stepper__img {
    display: block;
    /* layout-константа: предел ширины превью шага (реал .response_image ~567px). */
    max-width: 280px;
    width: 100%;
    height: auto;
    border-radius: var(--radius-md);
}

@media (max-width: 767.98px) {
    .ds-stepper__card { flex-direction: column; gap: var(--size-16); }
    .ds-stepper__img { max-width: 100%; }
}
</style>
