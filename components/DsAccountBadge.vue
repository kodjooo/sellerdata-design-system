<template>
    <!--
        DsAccountBadge — блок аккаунта в топбаре (реал .user_auth_dropdown): аватар +
        имя + магазин. На мобайле (<md) текст скрывается, остаётся аватар.
    -->
    <span class="ds-account">
        <span class="ds-account__thumb">
            <img v-if="avatar" class="ds-account__avatar ds-account__avatar--img" :src="avatar" :alt="name" />
            <span v-else class="ds-account__avatar" aria-hidden="true">{{ initial }}</span>
            <!-- Угловой бейдж маркетплейса (реал .user_thumb_wb/_ozon::after) -->
            <img v-if="marketIcon" class="ds-account__market" :src="marketIcon" alt="" aria-hidden="true" />
        </span>
        <span class="ds-account__body">
            <span class="t-label-m ds-account__name">{{ name }}</span>
            <span v-if="store" class="t-caption ds-account__store">{{ store }}</span>
        </span>
    </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // Имя/почта аккаунта.
    name: { type: String, default: '' },
    // Подпись магазина под именем.
    store: { type: String, default: '' },
    // URL аватара; без него — буква-инициал.
    avatar: { type: String, default: '' },
    // Маркетплейс — угловая иконка-бейдж (реал различает магазины именно ею).
    dataSource: { type: String, default: '', validator: (v) => ['', 'wildberries', 'ozon'].includes(v) },
});

const initial = computed(() => (props.name ? props.name.trim().charAt(0).toUpperCase() : '?'));
const marketIcon = computed(() => ({
    wildberries: '/img/wb-ico.svg',
    ozon: '/img/ozon-ico.svg',
}[props.dataSource] || ''));
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

.ds-account { display: inline-flex; align-items: center; gap: var(--size-8); min-width: 0; }
.ds-account__thumb { position: relative; flex: 0 0 auto; display: inline-flex; }
/* Угловой бейдж маркетплейса в правом-нижнем углу аватара (реал .user_thumb_*::after) */
.ds-account__market {
    position: absolute; right: calc(var(--size-2) * -1); bottom: calc(var(--size-2) * -1);
    width: var(--size-16); height: var(--size-16); border-radius: var(--radius-full);
    background: var(--white); box-shadow: var(--shadow-card); object-fit: contain;
}
.ds-account__avatar {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size-32);
    height: var(--size-32);
    border-radius: var(--radius-full);
    background: var(--brand);
    color: var(--white);
    font-size: var(--font-size-body-s);
    object-fit: cover;
}
.ds-account__body { display: inline-flex; flex-direction: column; min-width: 0; }
.ds-account__name { color: var(--text-heading); white-space: nowrap; }
.ds-account__store { color: var(--text-muted); white-space: nowrap; }

/* На мобайле — только аватар (как в реале). */
@include respond-below(md) {
    .ds-account__body { display: none; }
}
</style>
