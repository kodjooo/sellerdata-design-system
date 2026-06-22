<template>
    <!--
        DsTooltip — подсказка по наведению/фокусу (реал .tooltip-inner / tippy):
        белая карточка, 11px, padding 8, radius 8, overlay-тень, max-width 320, текст слева.
        Триггер — слот по умолчанию; содержимое — проп text или слот #content.
    -->
    <span class="ds-tooltip" :class="`ds-tooltip--${placement}`" tabindex="0">
        <slot />
        <span class="ds-tooltip__bubble" role="tooltip">
            <slot name="content">{{ text }}</slot>
        </span>
    </span>
</template>

<script setup>
defineProps({
    // Текст подсказки (или используйте слот #content для разметки).
    text: { type: String, default: '' },
    // Положение: bottom (default, как Tippy в реале) | top.
    placement: { type: String, default: 'bottom', validator: (v) => ['top', 'bottom'].includes(v) },
});
</script>

<style lang="scss" scoped>
.ds-tooltip {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: help;
}
.ds-tooltip__bubble {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--z-tooltip);
    width: max-content;
    max-width: 360px;                 /* реал tippy ~350-370 */
    padding: var(--size-8);
    background: var(--surface-default);
    color: var(--text-heading);
    text-align: left;
    font-size: var(--font-size-caption);   /* 11 */
    line-height: var(--size-16);            /* 16 */
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-overlay);
    opacity: var(--opacity-hidden);
    visibility: hidden;
    pointer-events: none;
    transition: opacity var(--transition-base) var(--ease-standard);
}
.ds-tooltip--top .ds-tooltip__bubble    { bottom: calc(100% + var(--size-8)); }
.ds-tooltip--bottom .ds-tooltip__bubble { top: calc(100% + var(--size-8)); }

.ds-tooltip:hover .ds-tooltip__bubble,
.ds-tooltip:focus-visible .ds-tooltip__bubble {
    opacity: var(--opacity-full);
    visibility: visible;
}
</style>
