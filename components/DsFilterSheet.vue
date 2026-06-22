<template>
    <!--
        DsFilterSheet — мобильный full-screen фильтр (реал: _live__*__мобайл-фильтр).
        Обёртка над DsModal fullscreen: шапка-градиент с «← Фильтр», список строк
        «иконка + подпись + ›», футер «Сбросить / Фильтровать». На мобайле заменяет
        стопку селектов, которая на десктопе живёт в тулбаре.
    -->
    <DsModal
        :model-value="visible"
        size="fullscreen"
        :closable="false"
        @update:model-value="v => $emit('update:visible', v)"
    >
        <template #header>
            <button type="button" class="ds-fsheet__back" aria-label="Назад" @click="$emit('update:visible', false)">
                <span class="fm-arrow-left" aria-hidden="true"></span>
            </button>
            <h2 class="t-title-m ds-fsheet__title">{{ title }}</h2>
        </template>

        <ul class="ds-fsheet__list">
            <li v-for="item in items" :key="item.key">
                <button type="button" class="ds-fsheet__row" @click="$emit('open', item.key)">
                    <span class="ds-fsheet__ico" :class="item.icon" aria-hidden="true"></span>
                    <span class="t-body-m ds-fsheet__label">{{ item.label }}</span>
                    <span class="fm-chevron-right ds-fsheet__chev" aria-hidden="true"></span>
                </button>
            </li>
        </ul>

        <template #footer>
            <DsButton variant="secondary" @click="$emit('reset')">Сбросить</DsButton>
            <DsButton variant="primary" @click="$emit('apply')">Фильтровать</DsButton>
        </template>
    </DsModal>
</template>

<script setup>
import DsModal from '@/Components/Ds/DsModal.vue';
import DsButton from '@/Components/Ds/DsButton.vue';

defineProps({
    visible: { type: Boolean, default: false },
    title: { type: String, default: 'Фильтр' },
    // Строки фильтра: [{ key, label, icon }], icon — класс иконочного шрифта (fm-*).
    items: { type: Array, default: () => [] },
});
defineEmits(['update:visible', 'open', 'reset', 'apply']);
</script>

<style lang="scss" scoped>
.ds-fsheet__back {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--control-height-sm);
    height: var(--control-height-sm);
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-on-brand);
    font-size: var(--font-size-heading-m);
    cursor: pointer;
}
.ds-fsheet__title { margin: 0; flex: 1 1 auto; min-width: 0; color: var(--text-on-brand); }

/* Тело модалки уже даёт padding; убираем его у списка, строки — на всю ширину. */
.ds-fsheet__list { list-style: none; margin: calc(var(--size-20) * -1); padding: 0; }
.ds-fsheet__row {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    width: 100%;
    padding: var(--size-16) var(--size-20);
    border: 0;
    border-bottom: 1px solid var(--border-default);
    background: transparent;
    color: var(--text-default);
    text-align: left;
    cursor: pointer;
}
.ds-fsheet__row:hover { background: var(--surface-muted); }
.ds-fsheet__ico { flex: 0 0 auto; color: var(--text-muted); font-size: var(--font-size-body-l); }
.ds-fsheet__label { flex: 1 1 auto; min-width: 0; }
.ds-fsheet__chev { flex: 0 0 auto; color: var(--brand); font-size: var(--font-size-body-m); }
</style>
