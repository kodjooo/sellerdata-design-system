<template>
    <span class="ds-tag" :class="[`ds-tag--${variant}`, `ds-tag--${tone}`]">
        <slot />
    </span>
</template>

<script setup>
/**
 * DsTag — ИЗВЛЕЧЁН ДОСЛОВНО из двух реальных систем тегов:
 *   variant="solid" = .status-tag (_status-tag.scss): radius 4px, 13px/600, padding 2/8,
 *     bg --status-*, текст белый, line-height 1.462.
 *   variant="soft"  = .tag (_tag.scss): pill (999px), 12px/600, padding 2/6, line-height 1.43,
 *     цвет статуса + светлый фон (--accent-positive-bg для success).
 * ВНИМАНИЕ: реал имеет РАЗНУЮ форму и размер у solid(13/радиус-4) и soft(12/pill) — это
 * накопившийся разнобой. Извлёк как есть; кандидат на унификацию (единый размер/форма).
 * tone: success | warning | danger | attention | default | blue | gray.
 */
defineProps({
    variant: { type: String, default: 'solid' }, // solid (.status-tag) | soft (.tag)
    tone: { type: String, default: 'default' },
});
</script>

<style lang="scss" scoped>
/* ─── solid = .status-tag (дословно) ─── */
.ds-tag--solid {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-body-s);   /* rem(13) */
    font-weight: 600;
    line-height: 1.462;
    border-radius: var(--radius-sm);       /* rem(4) */
    padding: 2px 8px;                      /* rem(2) rem(8) */
    text-align: center;
    white-space: nowrap;
    color: var(--white);
}
.ds-tag--solid.ds-tag--success   { background: var(--status-success); }
.ds-tag--solid.ds-tag--default   { background: var(--status-default); }
.ds-tag--solid.ds-tag--warning   { background: var(--status-warning); }
.ds-tag--solid.ds-tag--danger    { background: var(--status-danger); }
.ds-tag--solid.ds-tag--attention { background: var(--status-attention); }
.ds-tag--solid.ds-tag--blue      { background: var(--brand); }
.ds-tag--solid.ds-tag--gray      { background: var(--gray-600); }

/* ─── soft = .tag (дословно) ─── */
.ds-tag--soft {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    gap: 4px;
    padding: 2px 6px;                      /* real raw */
    border-radius: var(--radius-full);     /* 999px */
    font-size: 12px;                       /* real raw 12px — кандидат на унификацию к 13 */
    line-height: 1.43;
    font-weight: 600;
}
/* soft success: текст из той же зелёной палитры, что и фон (--accent-positive = green-600),
   а не teal-500 — иначе бирюзовый текст на зелёном фоне (несогласованность; реал — зелёный). */
.ds-tag--soft.ds-tag--success { color: var(--accent-positive); background-color: var(--accent-positive-bg); }
.ds-tag--soft.ds-tag--warning { color: var(--notice-text-strong); background-color: var(--notice-bg); }
.ds-tag--soft.ds-tag--danger  { color: var(--status-danger); background-color: var(--status-danger-bg); }
.ds-tag--soft.ds-tag--default { color: var(--text-muted); background-color: var(--surface-muted); }
/* blue — информационный/активный статус; gray — нейтральный плотный (реал status-tag_dimmed) */
.ds-tag--soft.ds-tag--blue { color: var(--brand); background-color: rgb(from var(--brand) r g b / 0.12); }
.ds-tag--soft.ds-tag--gray { color: var(--text-muted); background-color: var(--gray-100); }
</style>
