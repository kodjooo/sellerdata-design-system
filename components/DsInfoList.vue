<template>
    <!--
        DsInfoList — список «показатель → значение» с раскрытием (реал
        .info-list__accordion / TransactionSummary): группы с дочерними строками,
        выделенная строка (strong, напр. Прибыль) и хвост-коэффициенты на сером фоне
        (bg: Маржа/ROI/ДРР/Выкупаемость). Используется в сводке дашборда и деталь-модалке.
    -->
    <dl class="ds-info-list">
        <template v-for="(r, i) in items" :key="r.label ?? i">
            <div
                class="ds-info-list__row"
                :class="{
                    'is-strong': r.strong,
                    'is-bg': r.bg,
                    'is-expandable': !flat && r.children && r.children.length,
                }"
                @click="!flat && r.children && r.children.length && toggle(i)"
            >
                <dt class="t-body-s ds-info-list__label">
                    <span
                        v-if="!flat && r.children && r.children.length"
                        class="ds-info-list__chev"
                        :class="{ 'is-open': open.has(i) }"
                        aria-hidden="true"
                    >▸</span>
                    {{ r.label }}
                    <span v-if="r.info" class="ds-info-list__info" aria-hidden="true">ⓘ</span>
                </dt>
                <dd class="t-body-s ds-info-list__value">{{ r.value }}</dd>
            </div>
            <template v-if="r.children && (flat || open.has(i))">
                <div
                    v-for="c in r.children"
                    :key="c.label"
                    class="ds-info-list__row ds-info-list__row--child"
                >
                    <dt class="t-body-s ds-info-list__label">{{ c.label }}</dt>
                    <dd class="t-body-s ds-info-list__value">{{ c.value }}</dd>
                </div>
            </template>
        </template>
    </dl>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    // Строки: [{ label, value, children?:[{label,value}], strong?, bg?, info? }].
    items: { type: Array, default: () => [] },
    // Индексы строк, раскрытых изначально.
    defaultOpen: { type: Array, default: () => [] },
    // Плоский режим: все дочерние строки показаны всегда, без аккордеона и маркеров
    // (реал-сводка дашборда — плоский список, а не раскрывающийся).
    flat: { type: Boolean, default: false },
});

const open = ref(new Set(props.defaultOpen));
function toggle(i) {
    const next = new Set(open.value);
    next.has(i) ? next.delete(i) : next.add(i);
    open.value = next;
}
</script>

<style lang="scss" scoped>
.ds-info-list { margin: 0; padding: 0; }
.ds-info-list__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-12);
    padding: var(--size-8) 0;
    border-bottom: 1px solid var(--border-default);
}
.ds-info-list__label { color: var(--text-default); display: inline-flex; align-items: center; gap: var(--size-6); }
.ds-info-list__value { color: var(--text-heading); white-space: nowrap; }
.ds-info-list__row.is-expandable { cursor: pointer; }
.ds-info-list__chev { display: inline-block; color: var(--text-muted); transition: transform var(--transition-fast) var(--ease-standard); }
.ds-info-list__chev.is-open { transform: rotate(90deg); color: var(--brand); }
.ds-info-list__info { color: var(--status-alert); }

/* Вложенные строки (дочерние) — отступ, мутеный лейбл. */
.ds-info-list__row--child { padding-left: var(--size-16); }
.ds-info-list__row--child .ds-info-list__label { color: var(--text-muted); }

/* strong — выделенная строка (Прибыль): жирный текст, без заливки. */
.ds-info-list__row.is-strong .ds-info-list__label,
.ds-info-list__row.is-strong .ds-info-list__value { color: var(--text-heading); font-weight: var(--font-weight-bold); }

/* bg — серая заливка во всю ширину (Маржа/ROI/ДРР/Выкупаемость). */
.ds-info-list__row.is-bg {
    background: var(--surface-subtle);
    margin: 0 calc(var(--size-16) * -1);
    padding-left: var(--size-16);
    padding-right: var(--size-16);
    border-bottom: 0;
}
</style>
