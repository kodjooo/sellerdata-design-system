<template>
    <!--
        DsGroupBy — «Группировать по <значение>»: подпись + значение-ссылка (brand) + поповер-меню.
        Реал: dashboard/склад — без рамки (не bordered-select). Композирует DsPopover.
    -->
    <span class="ds-groupby">
        <span v-if="label" class="t-body-s ds-groupby__label">{{ label }}</span>
        <DsPopover placement="bottom-end">
            <button type="button" class="ds-groupby__value">{{ modelValue }}<span class="fm-chevron-down" aria-hidden="true"></span></button>
            <template #content="{ close }">
                <div class="ds-groupby__menu">
                    <button
                        v-for="o in options"
                        :key="o"
                        type="button"
                        class="ds-groupby__item"
                        :class="{ 'is-active': o === modelValue }"
                        @click="$emit('update:modelValue', o); close();"
                    >{{ o }}</button>
                </div>
            </template>
        </DsPopover>
    </span>
</template>

<script setup>
import DsPopover from './DsPopover.vue';

defineProps({
    // Выбранное значение (v-model).
    modelValue: { type: String, default: '' },
    // Варианты группировки (строки).
    options: { type: Array, default: () => [] },
    // Подпись слева (реал «Группировать по»).
    label: { type: String, default: 'Группировать по' },
});
defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
.ds-groupby { display: inline-flex; align-items: center; gap: var(--size-4); font-size: var(--font-size-body-s); }
.ds-groupby__label { color: var(--text-default); }
.ds-groupby__value { border: 0; background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; display: inline-flex; align-items: center; gap: var(--size-4); }
.ds-groupby__menu { display: flex; flex-direction: column; min-width: calc(var(--size-128) * 1.2); }
.ds-groupby__item { display: block; width: 100%; padding: var(--size-8) var(--size-12); border: 0; border-radius: var(--radius-sm); background: transparent; color: var(--text-default); text-align: left; cursor: pointer; font-size: var(--font-size-body-s); }
.ds-groupby__item:hover { background: var(--surface-muted); }
.ds-groupby__item.is-active { color: var(--brand); font-weight: var(--font-weight-semibold); }
</style>
