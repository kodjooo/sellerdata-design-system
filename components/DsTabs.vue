<template>
    <!--
        DsTabs — текстовые вкладки (реал .header-tabs__btn): 13px, активная = brand-текст
        + нижняя brand-полоса (--border-width-accent). Без заливки/pill.
    -->
    <div class="ds-tabs" role="tablist">
        <button
            v-for="t in tabs"
            :key="t.key ?? t.label"
            type="button"
            role="tab"
            class="t-label-m ds-tabs__tab"
            :class="{ 'is-active': (t.key ?? t.label) === modelValue }"
            :aria-selected="(t.key ?? t.label) === modelValue"
            @click="$emit('update:modelValue', t.key ?? t.label)"
        >
            <span v-if="t.icon" class="ds-tabs__ico" :class="t.icon" aria-hidden="true"></span>
            <span class="ds-tabs__text">{{ t.label }}</span>
        </button>
    </div>
</template>

<script setup>
defineProps({
    // Вкладки: [{ key, label, icon? }]. icon — класс иконочного шрифта (.fm-*).
    tabs: { type: Array, default: () => [] },
    // Активная вкладка (v-model) — значение key (или label, если key не задан).
    modelValue: { type: [String, Number], default: '' },
});
defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
.ds-tabs {
    display: flex;
    align-items: center;
    gap: var(--size-24);
    border-bottom: 1px solid var(--border-default);
}
.ds-tabs__tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--size-8);
    padding: var(--size-8) 0;
    border: 0;
    background: transparent;
    color: var(--text-default);
    cursor: pointer;
    white-space: nowrap;
    transition: color var(--transition-base) var(--ease-standard);
}
.ds-tabs__ico { font-size: var(--font-size-title-m); }
.ds-tabs__tab::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(var(--border-width-accent) * -1);
    height: var(--border-width-accent);
    border-radius: var(--radius-sm);
    background: var(--brand);
    opacity: var(--opacity-hidden);
    transition: opacity var(--transition-base) var(--ease-standard);
}
.ds-tabs__tab:hover { color: var(--brand); }
.ds-tabs__tab:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }
.ds-tabs__tab.is-active { color: var(--brand); }
.ds-tabs__tab.is-active::after { opacity: var(--opacity-full); }
</style>
