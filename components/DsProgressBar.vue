<template>
    <!--
        DsProgressBar — тонкая полоса прогресса.
        Источник (реал): .files-input__file__progress / __bar из DropFileInput.vue —
        дорожка + заливка по ширине в % (width:1%/50%/100%). Здесь обобщено: заливка
        по value (0–100), цвет — brand (по умолчанию) либо статусный tone.
    -->
    <div
        class="ds-progress"
        role="progressbar"
        :aria-valuenow="clamped"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="trackStyle"
    >
        <div
            class="ds-progress__bar"
            :class="`ds-progress__bar--${tone}`"
            :style="{ width: clamped + '%' }"
        ></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // Значение прогресса 0–100.
    value: { type: Number, default: 0 },
    // Цвет заливки: brand (по умолчанию) | success | warning | danger.
    tone: { type: String, default: 'brand' },
    // Необязательная высота дорожки (любой CSS-размер, лучше токен var(--size-*)).
    // По умолчанию — тонкая полоса 2px (см. комментарий в стилях).
    height: { type: String, default: null },
});

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.value))));
const trackStyle = computed(() => (props.height ? { height: props.height } : {}));
</script>

<style lang="scss" scoped>
.ds-progress {
    /* Толщина полосы — единичный px: декоративная hairline-дорожка тоньше шкалы
       --size-* (минимум 2px). Намеренно вне шкалы отступов. */
    height: 2px;
    width: 100%;
    background: var(--surface-muted);
    border-radius: var(--radius-full);
    overflow: hidden;
}

.ds-progress__bar {
    height: 100%;
    border-radius: var(--radius-full);
    transition: width 0.2s ease;
}

.ds-progress__bar--brand   { background: var(--brand); }
.ds-progress__bar--success { background: var(--status-success); }
.ds-progress__bar--warning { background: var(--status-warning); }
.ds-progress__bar--danger  { background: var(--status-danger); }
</style>
