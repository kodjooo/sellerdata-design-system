<template>
    <!--
        DsPromoCard — градиентная промо-карточка (реал: «+1 месяц бесплатно» в «Пригласи друга»).
        Декоративная иконка в углу, круглый бейдж, текст промо снизу. Высоту задаёт раскладка страницы.
    -->
    <div class="ds-promo-card">
        <span v-if="icon" class="ds-promo-card__deco" :class="icon" aria-hidden="true"></span>
        <span v-if="badge" class="t-heading-l ds-promo-card__badge" :class="`is-${badgeTone}`">{{ badge }}</span>
        <span class="t-heading-m ds-promo-card__text"><slot /></span>
    </div>
</template>

<script setup>
defineProps({
    // Текст бейджа (напр. «+1»).
    badge: { type: String, default: '' },
    // Декоративная иконка fm-* в правом верхнем углу.
    icon: { type: String, default: '' },
    // Тон бейджа: pink (--accent-pink).
    badgeTone: { type: String, default: 'pink', validator: (v) => ['pink'].includes(v) },
});
</script>

<style lang="scss" scoped>
.ds-promo-card {
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: var(--size-32);
    border-radius: var(--radius-lg); background: var(--brand-gradient); color: var(--text-on-brand);
}
.ds-promo-card__deco {
    position: absolute; top: var(--size-32); right: var(--size-32);
    font-size: var(--size-128); line-height: 1; opacity: var(--opacity-hover);
}
.ds-promo-card__badge {
    position: absolute; top: var(--size-48); right: var(--size-48);
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--size-64); height: var(--size-64); border-radius: var(--radius-full);
    color: var(--white);
}
.ds-promo-card__badge.is-pink { background: var(--accent-pink); }
</style>
