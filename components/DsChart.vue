<script setup>
/**
 * DsChart — статичный МОК комбо-графика дизайн-системы (без charting-либы).
 *
 * Назначение: демо вида «Диаграмма» на Дэшборде. Рисует SVG: группы столбцов
 * (type:'bar') + линии (type:'line') поверх, оси X (подписи labels) и Y (сетка),
 * легенда сверху (цветные метки серий).
 *
 * Канон: docs/design-system-canon.md. Эталон: docs/reference/screens/дашборд__диаграмма@wb.png.
 * Цвета серий — строго из --chart-* токенов (передаются в series[].color как имя токена,
 * например '--chart-blue'). Геометрия SVG (координаты viewBox) — безразмерные единицы,
 * внешняя высота контейнера — через шкалу --size-*.
 *
 * Props:
 *   labels  — string[] подписи оси X (месяцы).
 *   series  — [{ name, type:'bar'|'line', color:'--chart-*', values:number[] }].
 */
import { computed } from 'vue';

const props = defineProps({
    labels: { type: Array, default: () => [] },
    series: { type: Array, default: () => [] },
});

// ─── Безразмерная система координат viewBox (px-юниты SVG, не CSS) ───
const VB_W = 1000;
const VB_H = 360;
const PAD_L = 64;   // место под подписи левой оси Y (₽)
const PAD_T = 16;
const PAD_B = 32;   // место под подписи оси X

const plotH = VB_H - PAD_T - PAD_B;

const bars = computed(() => props.series.filter((s) => s.type === 'bar'));
const lines = computed(() => props.series.filter((s) => s.type === 'line'));

// Ось серии: bar → 'left' (₽), line → 'right' (кол-во); можно переопределить s.axis.
function axisOf(s) {
    return s.axis || (s.type === 'bar' ? 'left' : 'right');
}

// Максимум по сериям конкретной оси → верх шкалы (с запасом 10%).
function maxOfAxis(axis) {
    let max = 0;
    props.series
        .filter((s) => axisOf(s) === axis)
        .forEach((s) => s.values.forEach((v) => { if (v > max) max = v; }));
    return max > 0 ? max * 1.1 : 1;
}

const maxLeft = computed(() => maxOfAxis('left'));
const maxRight = computed(() => maxOfAxis('right'));
// Есть ли вообще правая ось (линии с количеством).
const hasRight = computed(() => props.series.some((s) => axisOf(s) === 'right'));

// Правый отступ резервируем под подписи правой оси, если она есть.
const PAD_R = computed(() => (hasRight.value ? 56 : 16));
const plotW = computed(() => VB_W - PAD_L - PAD_R.value);

const groupCount = computed(() => props.labels.length || 1);
const groupW = computed(() => plotW.value / groupCount.value);

// 5 горизонтальных линий сетки + подписи обеих осей Y.
const gridLines = computed(() => {
    const steps = 5;
    return Array.from({ length: steps + 1 }, (_, i) => {
        const ratio = i / steps;
        return {
            y: PAD_T + plotH * ratio,
            left: Math.round(maxLeft.value * (1 - ratio)),    // ₽
            right: Math.round(maxRight.value * (1 - ratio)),  // кол-во
        };
    });
});

// Y-координата для значения по выбранной оси.
function yOf(value, axis = 'left') {
    const max = axis === 'right' ? maxRight.value : maxLeft.value;
    return PAD_T + plotH * (1 - value / max);
}

// Геометрия столбцов: внутри группы столбцы баров стоят рядом.
const barLayout = computed(() => {
    const n = bars.value.length || 1;
    const innerPad = groupW.value * 0.18;       // отступы по краям группы
    const usable = groupW.value - innerPad * 2;
    const gap = usable * 0.12;
    const barW = (usable - gap * (n - 1)) / n;
    return props.labels.map((_, gi) => {
        const gx = PAD_L + groupW.value * gi + innerPad;
        return bars.value.map((s, bi) => {
            const v = s.values[gi] ?? 0;
            const y = yOf(v, axisOf(s));
            return {
                key: `${s.name}-${gi}`,
                x: gx + bi * (barW + gap),
                y,
                w: barW,
                h: PAD_T + plotH - y,
                color: s.color,
            };
        });
    });
});

// X-центр группы (для линий и подписей оси X).
function groupCenter(gi) {
    return PAD_L + groupW.value * gi + groupW.value / 2;
}

// Polyline-точки для линейных серий.
const linePaths = computed(() =>
    lines.value.map((s) => ({
        name: s.name,
        color: s.color,
        points: props.labels
            .map((_, gi) => `${groupCenter(gi)},${yOf(s.values[gi] ?? 0, axisOf(s))}`)
            .join(' '),
        dots: props.labels.map((_, gi) => ({
            x: groupCenter(gi),
            y: yOf(s.values[gi] ?? 0, axisOf(s)),
        })),
    }))
);
</script>

<template>
    <div class="ds-chart">
        <!-- Легенда серий -->
        <ul class="ds-chart__legend">
            <li v-for="s in series" :key="s.name" class="ds-chart__legend-item">
                <span
                    class="ds-chart__legend-mark"
                    :class="{ 'ds-chart__legend-mark--line': s.type === 'line' }"
                    :style="{ '--mark-color': `var(${s.color})` }"
                    aria-hidden="true"
                ></span>
                <span class="t-caption ds-chart__legend-label">{{ s.name }}</span>
            </li>
        </ul>

        <!-- Полотно графика -->
        <div class="ds-chart__canvas">
            <svg
                class="ds-chart__svg"
                :viewBox="`0 0 ${VB_W} ${VB_H}`"
                preserveAspectRatio="none"
                role="img"
                aria-label="Комбинированный график: столбцы и линия по периодам"
            >
                <!-- Сетка + подписи оси Y -->
                <g class="ds-chart__grid">
                    <line
                        v-for="(g, i) in gridLines"
                        :key="`grid-${i}`"
                        :x1="PAD_L"
                        :x2="VB_W - PAD_R"
                        :y1="g.y"
                        :y2="g.y"
                    />
                </g>
                <!-- Левая ось — суммы (₽) -->
                <g class="ds-chart__y-axis">
                    <text
                        v-for="(g, i) in gridLines"
                        :key="`yl-${i}`"
                        :x="PAD_L - 8"
                        :y="g.y + 4"
                        text-anchor="end"
                    >{{ g.left.toLocaleString('ru-RU') }} ₽</text>
                </g>
                <!-- Правая ось — количество (шт.) -->
                <g v-if="hasRight" class="ds-chart__y-axis">
                    <text
                        v-for="(g, i) in gridLines"
                        :key="`yr-${i}`"
                        :x="VB_W - PAD_R + 8"
                        :y="g.y + 4"
                        text-anchor="start"
                    >{{ g.right.toLocaleString('ru-RU') }}</text>
                </g>

                <!-- Столбцы -->
                <g class="ds-chart__bars">
                    <template v-for="(group, gi) in barLayout" :key="`bg-${gi}`">
                        <rect
                            v-for="bar in group"
                            :key="bar.key"
                            :x="bar.x"
                            :y="bar.y"
                            :width="bar.w"
                            :height="bar.h"
                            rx="3"
                            :style="{ fill: `var(${bar.color})` }"
                        />
                    </template>
                </g>

                <!-- Линии -->
                <g class="ds-chart__lines">
                    <template v-for="line in linePaths" :key="`ln-${line.name}`">
                        <polyline
                            :points="line.points"
                            fill="none"
                            :style="{ stroke: `var(${line.color})` }"
                        />
                        <circle
                            v-for="(dot, di) in line.dots"
                            :key="`dot-${line.name}-${di}`"
                            class="ds-chart__dot"
                            :cx="dot.x"
                            :cy="dot.y"
                            r="4"
                            :style="{ stroke: `var(${line.color})` }"
                        />
                    </template>
                </g>

                <!-- Подписи оси X -->
                <g class="ds-chart__x-axis">
                    <text
                        v-for="(label, gi) in labels"
                        :key="`xl-${gi}`"
                        :x="groupCenter(gi)"
                        :y="VB_H - 10"
                        text-anchor="middle"
                    >{{ label }}</text>
                </g>
            </svg>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use 'responsive' as *;

.ds-chart {
    display: flex;
    flex-direction: column;
    gap: var(--size-12);
    width: 100%;
}

/* ─── Легенда: цветные метки серий, переносится на мобайле ─────── */
.ds-chart__legend {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--size-8) var(--size-16);
    margin: 0;
    padding: 0;
    list-style: none;
}
.ds-chart__legend-item { display: inline-flex; align-items: center; gap: var(--size-6); }
.ds-chart__legend-mark {
    display: inline-block;
    width: var(--size-12);
    height: var(--size-12);
    border-radius: var(--radius-sm);
    background: var(--mark-color);
}
/* Линейная серия — метка в виде полого кружка (как точки на линиях). */
.ds-chart__legend-mark--line {
    width: var(--size-12);
    height: var(--size-12);
    border-radius: var(--radius-full);
    background: var(--surface-default);
    border: 2px solid var(--mark-color);
}
.ds-chart__legend-label { color: var(--text-default); }

/* ─── Полотно: фиксированная высота через шкалу --size-* ───────── */
.ds-chart__canvas {
    width: 100%;
    height: calc(var(--size-128) * 2.5);   /* ~320 — десктоп */
}
@include respond-below(md) {
    .ds-chart__canvas { height: calc(var(--size-128) * 1.75); }   /* ~224 — мобайл */
}
.ds-chart__svg { display: block; width: 100%; height: 100%; }

/* ─── Сетка / оси ─────────────────────────────────────────────── */
.ds-chart__grid line {
    stroke: var(--border-default);
    stroke-width: 1;
}
.ds-chart__y-axis text,
.ds-chart__x-axis text {
    fill: var(--text-muted);
    font-size: var(--font-size-caption);
}

/* ─── Линии серий ─────────────────────────────────────────────── */
.ds-chart__lines polyline {
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
}
/* Полые точки (реал pointBackgroundColor = surface, border = цвет линии). */
.ds-chart__dot {
    fill: var(--surface-default);
    stroke-width: 2.5;
}
</style>
