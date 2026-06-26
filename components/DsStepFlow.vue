<template>
    <!--
        DsStepFlow — горизонтальный поток иконочных шагов со стрелками-разделителями
        (реал: «Как это работает» в «Пригласи друга»). На <lg — одна колонка, стрелки скрыты.
    -->
    <div class="ds-step-flow" :style="{ '--ds-step-count': steps.length }">
        <template v-for="(step, i) in steps" :key="step.title">
            <div class="ds-step-flow__step">
                <span class="ds-step-flow__ico" :class="step.icon" aria-hidden="true"></span>
                <h3 class="t-title-m ds-step-flow__title">{{ step.title }}</h3>
                <p class="t-body-s ds-step-flow__text">{{ step.text }}</p>
            </div>
            <span
                v-if="i < steps.length - 1"
                class="ds-step-flow__arrow fm-arrow-right"
                aria-hidden="true"
            ></span>
        </template>
    </div>
</template>

<script setup>
defineProps({
    // Шаги: [{ icon (fm-*), title, text }].
    steps: { type: Array, default: () => [] },
});
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

.ds-step-flow {
    display: grid;
    /* чередование колонок шаг/стрелка: N шагов + (N-1) стрелок */
    grid-auto-flow: column;
    grid-auto-columns: 1fr auto;
    align-items: center;
    gap: var(--size-16);
}
.ds-step-flow__step {
    display: flex; flex-direction: column; align-items: center; gap: var(--size-8);
    padding: var(--size-24); text-align: center;
    border: 1px solid var(--border-default); border-radius: var(--radius-lg);
    height: 100%;
}
.ds-step-flow__ico {
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--size-64); height: var(--size-64); border-radius: var(--radius-full);
    background: var(--surface-subtle); color: var(--brand); font-size: var(--font-size-heading-m);
}
.ds-step-flow__title { color: var(--text-heading); margin: 0; }
.ds-step-flow__text { color: var(--text-muted); margin: 0; }
.ds-step-flow__arrow { color: var(--text-placeholder); font-size: var(--font-size-heading-m); }

@include respond-below(lg) {
    .ds-step-flow { grid-auto-flow: row; grid-auto-columns: 1fr; }
    .ds-step-flow__arrow { display: none; }
}
</style>
