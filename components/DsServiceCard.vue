<template>
    <!--
        DsServiceCard — карточка дополнительной услуги (реал Components/Pricing/ServiceItem.vue,
        .pricing__servicesList__item). Структура: body (заголовок + описание + список фич)
        и footer (цена + условия + кнопка «Заказать»).
        Вариант _free — бесплатная услуга (реал ._free): цена зелёным акцентом, без «₽/мес.».
    -->
    <DsCard
        radius="md"
        padding="--size-24"
        tag="article"
        class="ds-service-card"
        :class="{ 'ds-service-card--free': free }"
    >
        <div class="ds-service-card__body">
            <h3 class="t-heading-m ds-service-card__title">{{ title }}</h3>
            <p v-if="description" class="t-body-s ds-service-card__desc">{{ description }}</p>

            <template v-if="features.length">
                <p v-if="featuresTitle" class="t-body-s ds-service-card__features-title">{{ featuresTitle }}</p>
                <ul class="ds-service-card__features">
                    <li v-for="(f, i) in features" :key="i" class="ds-service-card__feature">
                        <span class="fm-check ds-service-card__feature-ico" aria-hidden="true"></span>
                        <span class="t-body-s">{{ f }}</span>
                    </li>
                </ul>
            </template>

            <slot />
        </div>

        <div class="ds-service-card__footer">
            <div class="ds-service-card__pricing">
                <div class="ds-service-card__price" :class="{ 'is-free': free }">
                    {{ price }}<span v-if="!free && priceSuffix" class="ds-service-card__price-suffix">{{ priceSuffix }}</span>
                </div>
                <div v-if="conditions" class="t-body-s ds-service-card__conditions">{{ conditions }}</div>
            </div>
            <div class="ds-service-card__action">
                <slot name="action">
                    <DsButton variant="primary" @click="$emit('order')">{{ orderLabel }}</DsButton>
                </slot>
            </div>
        </div>
    </DsCard>
</template>

<script setup>
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';

defineProps({
    // Название услуги (реал service.title).
    title: { type: String, required: true },
    // Описание (реал service.description).
    description: { type: String, default: '' },
    // Заголовок над списком фич (реал service.featuresTitle): «Мы сверим:».
    featuresTitle: { type: String, default: '' },
    // Список фич (реал service.features).
    features: { type: Array, default: () => [] },
    // Цена строкой (реал «5 000» или «Бесплатно» для free).
    price: { type: String, default: '' },
    // Приписка к цене для платной услуги (реал «₽/мес.»).
    priceSuffix: { type: String, default: '₽/мес.' },
    // Условия тарификации (реал pricingConditions): «за 1 магазин» / «1 раз/мес.».
    conditions: { type: String, default: '' },
    // Бесплатная услуга (реал ._free) — акцентная цена, без суффикса.
    free: { type: Boolean, default: false },
    // Подпись кнопки.
    orderLabel: { type: String, default: 'Заказать' },
});

defineEmits(['order']);
</script>

<style lang="scss" scoped>
.ds-service-card {
    height: 100%;
}
.ds-service-card :deep(.ds-card__body) {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.ds-service-card__body { flex: 1 1 auto; }
.ds-service-card__title { color: var(--text-heading); margin-bottom: var(--size-8); }
.ds-service-card__desc { color: var(--text-default); margin-bottom: var(--size-12); }
.ds-service-card__features-title { color: var(--text-heading); margin-bottom: var(--size-8); }
.ds-service-card__features {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
}
.ds-service-card__feature {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    color: var(--text-default);
}
.ds-service-card__feature-ico { color: var(--accent-positive); }

/* Подвал: цена слева, кнопка справа (реал .pricing__servicesList__item__footer) */
.ds-service-card__footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--size-16);
    margin-top: var(--size-24);
    padding-top: var(--size-16);
    border-top: 1px solid var(--border-default);
}
.ds-service-card__price {
    font-size: var(--font-size-heading-m);
    font-weight: var(--font-weight-bold);
    color: var(--text-heading);
}
/* «Бесплатно» — стандартный цвет заголовка (реал чёрный), не зелёный. */
.ds-service-card__price.is-free { color: var(--text-heading); }
.ds-service-card__price-suffix {
    font-size: var(--font-size-body-s);
    font-weight: var(--font-weight-regular);
    color: var(--text-muted);
    margin-left: var(--size-4);
}
.ds-service-card__conditions { color: var(--text-muted); margin-top: var(--size-2); }
</style>
