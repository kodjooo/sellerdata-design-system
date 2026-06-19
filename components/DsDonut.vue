<template>
    <svg :width="size" :height="size" viewBox="0 0 100 100" role="img" :aria-label="ariaLabel">
        <g :stroke-width="strokeWidth" fill="none" transform="rotate(-90 50 50)">
            <circle
                v-for="(seg, i) in computedSegments"
                :key="i"
                cx="50"
                cy="50"
                r="40"
                :stroke="seg.color"
                :stroke-dasharray="seg.dash"
                :stroke-dashoffset="seg.offset"
            ></circle>
        </g>
        <text
            v-if="label"
            x="50"
            y="50"
            text-anchor="middle"
            dominant-baseline="central"
            font-size="20"
            font-weight="600"
            fill="#232323"
        >{{ label }}</text>
    </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    segments: { type: Array, default: () => [] },
    size: { type: [Number, String], default: 78 },
    strokeWidth: { type: [Number, String], default: 14 },
    label: { type: String, default: '' },
    ariaLabel: { type: String, default: 'Кольцевая диаграмма' },
});

const CIRC = 251.327;

const computedSegments = computed(() => {
    const total = props.segments.reduce((sum, x) => sum + (x.value || 0), 0) || 1;
    let acc = 0;
    const out = [];
    for (const s of props.segments) {
        const len = (s.value / total) * CIRC;
        out.push({ color: s.color, dash: len + ' ' + CIRC, offset: -acc });
        acc += len;
    }
    return out;
});
</script>
