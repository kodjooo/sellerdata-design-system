<template>
    <!--
        DsAccountBadge — блок аккаунта в топбаре (реал .user_auth_dropdown): аватар +
        имя + магазин. На мобайле (<md) текст скрывается, остаётся аватар.
    -->
    <span class="ds-account">
        <img v-if="avatar" class="ds-account__avatar ds-account__avatar--img" :src="avatar" :alt="name" />
        <span v-else class="ds-account__avatar" aria-hidden="true">{{ initial }}</span>
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
});

const initial = computed(() => (props.name ? props.name.trim().charAt(0).toUpperCase() : '?'));
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

.ds-account { display: inline-flex; align-items: center; gap: var(--size-8); min-width: 0; }
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
