<template>
    <!--
        DsPricingCard — карточка тарифного пакета (реал .pricing__pack из Pages/Pricing.vue;
        паттерн вынесен из эталона Screens/Settings.vue .plan).
        Структура 1:1 со скрином тариф__список@wb/@ozon:
          head (название · старая зачёркнутая цена · текущая /месяц · сумма за период)
          → лимит оборота → строки фич (число аккаунтов + fm-check / fm-minus)
          → действие («Купить»/«Текущий пакет»/disabled с tippy-причиной).
        Подсветка текущего пакета — проп current (реал .current → бордер --brand).

        Действия (реал — 5 веток): обычная «Купить»; «Текущий пакет»; три disabled-ветки
        с разной причиной (триал-уже-куплен / превышен оборот / Старт при активном Бизнес).
        Поддержано через props: current, disabled, disabledReason (tippy). Для нестандартных
        случаев — слот #actions полностью переопределяет футер.
    -->
    <DsCard
        radius="md"
        padding="0"
        tag="article"
        class="ds-pricing-card"
        :class="{ 'is-current': current }"
    >
        <!-- Шапка: название + цены -->
        <div class="ds-pricing-card__head">
            <span class="t-heading-m ds-pricing-card__name">{{ title }}</span>
            <span v-if="priceOld" class="t-body-s ds-pricing-card__price-old">
                {{ priceOld }}<span class="ds-pricing-card__per">{{ pricePer }}</span>
            </span>
            <span class="ds-pricing-card__price">
                {{ price }}<span class="ds-pricing-card__per">{{ pricePer }}</span>
            </span>
            <span v-if="paymentNote" class="t-body-s ds-pricing-card__payment">{{ paymentNote }}</span>
        </div>

        <!-- Лимит оборота (реал salesLimit) -->
        <div v-if="limit" class="t-body-s ds-pricing-card__limit">{{ limit }}</div>

        <!-- Строки фич: первая — число аккаунтов, далее check/minus.
             Можно задать через проп features ([{value?|on}]) либо слотом #features. -->
        <div class="ds-pricing-card__rows">
            <slot name="features">
                <div v-if="accounts !== null" class="ds-pricing-card__row ds-pricing-card__row--accounts">
                    {{ accounts }}
                </div>
                <div v-for="(f, i) in normalizedFeatures" :key="i" class="ds-pricing-card__row">
                    <span
                        v-if="f.value != null"
                        class="t-body-s ds-pricing-card__value"
                    >{{ f.value }}</span>
                    <span
                        v-else-if="f.on"
                        class="fm-check ds-pricing-card__check"
                        aria-hidden="true"
                    ></span>
                    <span
                        v-else
                        class="fm-minus ds-pricing-card__minus"
                        aria-hidden="true"
                    ></span>
                </div>
            </slot>
        </div>

        <!-- Действие -->
        <div class="ds-pricing-card__actions">
            <slot name="actions">
                <!-- Текущий пакет -->
                <div v-if="current" class="t-body-s ds-pricing-card__current">{{ currentLabel }}</div>

                <!-- Недоступно: кнопка disabled + причина в тултипе (реал v-tippy) -->
                <DsTooltip v-else-if="disabled && disabledReason" :text="disabledReason" class="ds-pricing-card__tip">
                    <DsButton variant="primary" disabled>{{ buyLabel }}</DsButton>
                </DsTooltip>
                <DsButton v-else-if="disabled" variant="primary" disabled>{{ buyLabel }}</DsButton>

                <!-- Доступно к покупке -->
                <DsButton v-else variant="primary" @click="$emit('buy')">{{ buyLabel }}</DsButton>
            </slot>
        </div>
    </DsCard>
</template>

<script setup>
import { computed } from 'vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsTooltip from '@/Components/Ds/DsTooltip.vue';

const props = defineProps({
    // Название пакета (реал variant.title): «Старт» / «Стандарт» / «Бизнес».
    title: { type: String, required: true },
    // Текущая цена (готовая строка, например «400 ₽»).
    price: { type: String, default: '' },
    // Старая зачёркнутая цена (реал price_old, скрыта при monthly).
    priceOld: { type: String, default: '' },
    // Приписка к цене (реал «/месяц»).
    pricePer: { type: String, default: '/месяц' },
    // Сумма за период (реал «4 800 ₽ за год»).
    paymentNote: { type: String, default: '' },
    // Лимит оборота (реал salesLimit): «до 200 000 ₽/мес» / «неограниченно».
    limit: { type: String, default: '' },
    // Число подключаемых аккаунтов (первая строка). null — строку не рендерить.
    accounts: { type: [String, Number], default: null },
    // Фичи: массив boolean (вкл/выкл = check/minus) ИЛИ объектов { on, value }.
    features: { type: Array, default: () => [] },
    // Подсветка текущего пакета (реал .current).
    current: { type: Boolean, default: false },
    // Заблокировать кнопку покупки.
    disabled: { type: Boolean, default: false },
    // Причина блокировки — текст тултипа (реал v-tippy на обёртке disabled-кнопки).
    disabledReason: { type: String, default: '' },
    // Подписи действий.
    buyLabel: { type: String, default: 'Купить' },
    currentLabel: { type: String, default: 'Текущий пакет' },
});

defineEmits(['buy']);

// Нормализуем фичи к { on, value } для единой отрисовки.
const normalizedFeatures = computed(() =>
    props.features.map((f) =>
        typeof f === 'object' && f !== null ? f : { on: !!f, value: null }
    )
);
</script>

<style lang="scss" scoped>
.ds-pricing-card { overflow: hidden; }
.ds-pricing-card.is-current { border-color: var(--brand); }

/* Шапка с ценами (реал .pricing__pack__header) */
.ds-pricing-card__head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-2);
    padding: var(--size-16);
    border-bottom: 1px solid var(--border-default);
}
.ds-pricing-card__name { color: var(--text-heading); }
.ds-pricing-card__price-old { color: var(--text-muted); text-decoration: line-through; }
.ds-pricing-card__price {
    font-size: var(--font-size-heading-m);
    font-weight: var(--font-weight-bold);
    color: var(--text-heading);
}
.ds-pricing-card__per {
    font-size: var(--font-size-body-s);
    font-weight: var(--font-weight-regular);
    color: var(--text-muted);
    margin-left: var(--size-4);
}
.ds-pricing-card__payment { color: var(--text-muted); }

/* Лимит + строки фич (реал .pricing__row, высота 48) */
.ds-pricing-card__limit,
.ds-pricing-card__row {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--size-48);
    border-bottom: 1px solid var(--border-default);
    color: var(--text-heading);
    text-align: center;
}
.ds-pricing-card__limit { font-weight: var(--font-weight-semibold); }
.ds-pricing-card__rows { display: flex; flex-direction: column; }
.ds-pricing-card__row--accounts { font-weight: var(--font-weight-semibold); }
.ds-pricing-card__check { color: var(--text-heading); }
.ds-pricing-card__minus { color: var(--text-muted); }

/* Действия */
.ds-pricing-card__actions { margin-top: auto; padding: var(--size-16); }
.ds-pricing-card__actions :deep(.ds-btn) { width: 100%; }
.ds-pricing-card__tip { display: block; }
.ds-pricing-card__tip :deep(.ds-btn) { width: 100%; }
.ds-pricing-card__current {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--control-height-md);
    color: var(--text-muted);
    font-weight: var(--font-weight-semibold);
}
</style>
