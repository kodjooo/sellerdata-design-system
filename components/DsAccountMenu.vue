<template>
    <!--
        DsAccountMenu — переключатель аккаунта/магазина в топбаре (реал .user_auth_dropdown):
        триггер = бейдж аккаунта + шеврон; по клику — поповер со списком магазинов
        (иконка маркетплейса), «Сводный дэшборд», «Добавить магазин», «Выйти».
        Композирует DsPopover + DsAccountBadge.
    -->
    <DsPopover placement="bottom-end" class="ds-acc-menu">
        <span class="ds-acc-menu__trigger">
            <DsAccountBadge :name="name" :store="activeStore?.name || store" :data-source="activeStore?.dataSource || dataSource" />
            <span class="fm-chevron-down ds-acc-menu__chev" aria-hidden="true"></span>
        </span>

        <template #content="{ close }">
            <div class="ds-acc-menu__list">
                <button
                    v-for="s in stores"
                    :key="s.id ?? s.name"
                    type="button"
                    class="ds-acc-menu__row"
                    :class="{ 'is-active': s.id === activeId }"
                    @click="$emit('select', s); close();"
                >
                    <img v-if="marketIcon(s.dataSource)" class="ds-acc-menu__ico" :src="marketIcon(s.dataSource)" alt="" aria-hidden="true" />
                    <span class="t-body-s ds-acc-menu__store">{{ s.name }}</span>
                </button>

                <span class="ds-acc-menu__sep" aria-hidden="true"></span>

                <button type="button" class="ds-acc-menu__row ds-acc-menu__action" @click="$emit('summary'); close();">
                    Сводный дэшборд
                </button>
                <button type="button" class="ds-acc-menu__row ds-acc-menu__action" @click="$emit('add-store'); close();">
                    <span class="ds-acc-menu__plus fm-plus" aria-hidden="true"></span>Добавить магазин
                </button>
                <button type="button" class="ds-acc-menu__row ds-acc-menu__action" @click="$emit('logout'); close();">
                    <span class="ds-acc-menu__logout fm-power" aria-hidden="true"></span>Выйти
                </button>
            </div>
        </template>
    </DsPopover>
</template>

<script setup>
import { computed } from 'vue';
import DsPopover from './DsPopover.vue';
import DsAccountBadge from './DsAccountBadge.vue';

const props = defineProps({
    name: { type: String, default: '' },
    store: { type: String, default: '' },
    dataSource: { type: String, default: '' },
    // Список магазинов: [{ id, name, dataSource: 'wildberries'|'ozon' }].
    stores: { type: Array, default: () => [] },
    // id активного магазина.
    activeId: { type: [String, Number], default: '' },
});
defineEmits(['select', 'summary', 'add-store', 'logout']);

const activeStore = computed(() => props.stores.find((s) => s.id === props.activeId) || null);
function marketIcon(ds) {
    return ({ wildberries: '/img/wb-ico.svg', ozon: '/img/ozon-ico.svg' }[ds]) || '';
}
</script>

<style lang="scss" scoped>
.ds-acc-menu__trigger { display: inline-flex; align-items: center; gap: var(--size-4); }
.ds-acc-menu__chev { color: var(--text-muted); font-size: var(--font-size-body-s); }

/* Ширина дропдауна — компактная, как реал (w-48 ≈192; берём ~224 c запасом под длинные имена). */
.ds-acc-menu__list { display: flex; flex-direction: column; min-width: calc(var(--size-128) * 1.75); }
.ds-acc-menu__row {
    display: flex; align-items: center; gap: var(--size-8);
    width: 100%; padding: var(--size-12) var(--size-16); border: 0; border-radius: var(--radius-sm);
    background: transparent; color: var(--text-default); text-align: left; cursor: pointer;
}
.ds-acc-menu__row:hover { background: var(--surface-muted); }
/* активный магазин — фон-подсветка (реал ._active) */
.ds-acc-menu__row.is-active { background: var(--surface-muted); color: var(--text-heading); font-weight: var(--font-weight-semibold); }
.ds-acc-menu__store { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ds-acc-menu__ico { flex: 0 0 auto; width: var(--size-16); height: var(--size-16); object-fit: contain; }
.ds-acc-menu__sep { height: 1px; background: var(--border-default); margin: var(--size-4) 0; }
.ds-acc-menu__action { color: var(--text-default); }
.ds-acc-menu__plus { color: var(--brand); margin-right: var(--size-6); }
.ds-acc-menu__logout { color: var(--text-muted); margin-right: var(--size-6); }
</style>
