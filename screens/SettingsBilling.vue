<template>
    <Head title="Настройки · Оплата — экран-эталон" />
    <ScreenShell active="settings" title="Оплата">
        <div class="screen">

            <!-- ─── Секция тарифов (без заголовка «Тарифы» — как реал) ─── -->
            <DsCard radius="lg" padding="--size-24" tag="section">
                <!-- Переключатели срок оплаты + валюта (DsPriceToggle): Срок по центру над тарифами, Валюта справа -->
                <div class="pricing-head">
                    <DsPriceToggle v-model="period" :options="periods" label="Срок оплаты" />
                    <DsPriceToggle v-model="currency" :options="currencyOptions" label="Валюта" />
                </div>

                <!-- Колонка названий строк (реал: фичи слева) + 3 пакета на DsPricingCard.
                     Спейсер 124px = высота шапки карточки; строки по 48px = строки DsPricingCard. -->
                <div class="plans">
                    <div class="plan-labels" aria-hidden="true">
                        <div class="plan-labels__spacer"></div>
                        <div v-for="(lbl, i) in rowLabels" :key="i" class="t-body-s plan-labels__row">
                            <span>{{ lbl.text }}</span>
                            <span v-if="lbl.info" class="plan-labels__info fm-info" aria-hidden="true"></span>
                        </div>
                    </div>
                    <DsPricingCard
                        v-for="plan in plans"
                        :key="plan.id"
                        :title="plan.title"
                        :price="`${plan.price} ${symbol}`"
                        :price-old="`${plan.priceOld} ${symbol}`"
                        :payment-note="`${plan.yearly} ${symbol} за год`"
                        :limit="plan.limit"
                        :accounts="plan.accounts"
                        :features="plan.features"
                        :row-labels="rowLabels.map(l => l.text)"
                        :current="plan.current"
                        @buy="openBuy(plan)"
                    />
                </div>
            </DsCard>

            <!-- ─── Доп. услуги (DsServiceCard) ─── -->
            <DsCard radius="lg" padding="--size-24" tag="section">
                <h2 class="t-heading-m section__title">Дополнительные услуги</h2>
                <div class="services">
                    <DsServiceCard
                        v-for="srv in services"
                        :key="srv.id"
                        :title="srv.title"
                        :description="srv.description"
                        :features-title="srv.featuresTitle"
                        :features="srv.features"
                        :price="srv.price"
                        :conditions="srv.conditions"
                        :free="srv.free"
                        @order="openBuy(plans[2])"
                    />
                </div>
            </DsCard>

        </div>

        <!-- ─── Модалка «Как вы будете платить?» (реал buyModal) ─── -->
        <DsModal v-model="buyOpen" title="Как вы будете платить?" size="md">
            <!-- Шапка-пакет (brand-gradient) -->
            <div class="buy-pack">
                <span class="t-body-s buy-pack__label">Пакет</span>
                <span class="t-heading-l buy-pack__title">{{ buyPlan.title }}</span>
                <span class="buy-pack__price">{{ buyPlan.yearly }},00 {{ symbol }}<span class="buy-pack__per">в год</span></span>
            </div>

            <!-- Сводка платежа (реал payment-success__summary) -->
            <DsInfoList :items="buySummary" flat class="buy-summary" />

            <div class="buy-field">
                <span class="t-label-m buy-field__label">Страна</span>
                <DsSelect v-model="country" :options="countryOptions" :show-footer="false" placeholder="Выберите страну" />
            </div>

            <!-- Способ оплаты: карта / счёт (реал pricing-payment-type) -->
            <div class="pay-type">
                <DsOptionCard
                    v-for="m in payMethods"
                    :key="m.key"
                    layout="stack"
                    active-style="border"
                    :icon="m.icon"
                    :title="m.label"
                    :selected="payMethod === m.key"
                    @select="payMethod = m.key"
                />
            </div>

            <!-- Тип лица: физ/юр (radio) -->
            <div class="jur">
                <DsCheckbox v-model="jurType" type="radio" value="0" label="Физическое лицо" />
                <DsCheckbox v-model="jurType" type="radio" value="1" label="Юридическое лицо" />
            </div>

            <template v-if="jurType === '1'">
                <DsInput v-model="companyName" label="Название фирмы" placeholder="" class="jur-field" />
                <DsInput v-model="inn" label="ИНН" placeholder="" class="jur-field" />
            </template>

            <DsCheckbox v-if="payMethod === 'card'" v-model="agreeTerms" class="jur-agree">
                <strong>Я понимаю, что оформляется автоплатеж</strong> в соответствии с условиями подписки.
            </DsCheckbox>
            <DsCheckbox v-model="agreePersonal" class="jur-agree" label="Я согласен с условиями обработки персональных данных" />

            <template #footer>
                <DsButton variant="primary" :disabled="!canPay">Далее</DsButton>
            </template>
        </DsModal>
    </ScreenShell>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import ScreenShell from './ScreenShell.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsInput from '@/Components/Ds/DsInput.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsCheckbox from '@/Components/Ds/DsCheckbox.vue';
import DsModal from '@/Components/Ds/DsModal.vue';
import DsInfoList from '@/Components/Ds/DsInfoList.vue';
import DsPricingCard from '@/Components/Ds/DsPricingCard.vue';
import DsServiceCard from '@/Components/Ds/DsServiceCard.vue';
import DsPriceToggle from '@/Components/Ds/DsPriceToggle.vue';
import DsOptionCard from '@/Components/Ds/DsOptionCard.vue';

// ── Переключатели срока и валюты (DsPriceToggle) ──
const period = ref('yearly');
const periods = [
    { key: 'monthly', label: '1 месяц' },
    { key: 'halfyearly', label: '6 месяцев', badge: '-10%' },
    { key: 'yearly', label: '12 месяцев', badge: '-20%' },
];
const currency = ref('RUB');
const currencyOptions = [
    { key: 'RUB', label: '₽ Рубли' },
    { key: 'KZT', label: '₸ Тенге' },
];
const symbol = computed(() => (currency.value === 'KZT' ? '₸' : '₽'));

// Названия строк таблицы тарифов (реал: левая колонка фич), выровнены со строками DsPricingCard:
// Оборот (=лимит), Магазины (=кол-во аккаунтов), далее 8 фич = массив features пакетов.
const rowLabels = [
    { text: 'Оборот', info: true },
    { text: 'Магазины', info: true },
    { text: 'Дэшборд' },
    { text: 'Товары' },
    { text: 'Расходы' },
    { text: 'Импорт себестоимости' },
    { text: 'Самовыкупы' },
    { text: 'Склад' },
    { text: 'Диаграммы', info: true },
    { text: 'Чат поддержки' },
];

// Пакеты (реал packs; цены/лимиты — со скрина тариф__список@wb, период 12 мес).
// Первая фича — число аккаунтов (проп accounts), далее check/minus через features.
const plans = [
    {
        id: 'start', title: 'Старт', priceOld: '500', price: '400', yearly: '4 800',
        limit: 'до 200 000 ₽/мес', accounts: '1', current: true,
        features: [true, true, true, false, false, false, false, false],
    },
    {
        id: 'standard', title: 'Стандарт', priceOld: '1 500', price: '1 200', yearly: '14 400',
        limit: 'до 1 000 000 ₽/мес', accounts: '2', current: false,
        features: [true, true, true, true, true, false, false, false],
    },
    {
        id: 'business', title: 'Бизнес', priceOld: '2 500', price: '2 000', yearly: '24 000',
        limit: 'неограниченно', accounts: '10', current: false,
        features: [true, true, true, true, true, true, true, true],
    },
];

// ── Доп. услуги (DsServiceCard) ──
const services = [
    {
        id: 'audit', title: 'Сверка остатков', description: 'Ежемесячная проверка остатков и расхождений по складам.',
        featuresTitle: 'Мы сверим:', features: ['Остатки по FBO/FBS', 'Расхождения с поставками', 'Отчёт с рекомендациями'],
        price: '5 000', conditions: 'за 1 магазин', free: false,
    },
    {
        id: 'consult', title: 'Консультация по подключению', description: 'Поможем подключить магазины и настроить интеграции.',
        features: ['Подключение ключей/OAuth', 'Проверка синхронизации'],
        price: 'Бесплатно', conditions: '1 раз/мес.', free: true,
    },
];

// ── Модалка «Как вы будете платить?» ──
const buyOpen = ref(false);
const buyPlan = ref(plans[2]);
const country = ref('Россия');
const countryOptions = ['Россия', 'Беларусь (Мир)', 'Казахстан', 'Узбекистан', 'Армения'];
const payMethod = ref('card');
const payMethods = [
    { key: 'card', label: 'Банковская карта', icon: 'fm-credit-card' },
    { key: 'invoice', label: 'Счет на оплату', icon: 'fm-file-text' },
];
const jurType = ref('1');
const companyName = ref('');
const inn = ref('');
const agreeTerms = ref(false);
const agreePersonal = ref(false);

const buySummary = computed(() => [
    { label: 'Периодичность', value: 'Ежегодная подписка' },
    { label: 'Аванс на 11.06.2026', value: '0,00 ₽' },
    { label: 'Остаток к оплате', value: `${buyPlan.value.yearly},00 ${symbol.value}`, strong: true },
    { label: 'Следующее списание', value: '11.06.2027' },
    { label: 'Сумма списания', value: `${buyPlan.value.yearly},00 ${symbol.value}` },
]);
const canPay = computed(() => agreePersonal.value && (payMethod.value === 'invoice' || agreeTerms.value));

function openBuy(plan) {
    buyPlan.value = plan;
    buyOpen.value = true;
}
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

.screen { display: flex; flex-direction: column; gap: var(--size-16); }
.section__title { color: var(--text-heading); margin-bottom: var(--size-16); }

/* Под-меню настроек (единый паттерн на 3 страницах) */
.settings-submenu {
    display: flex; align-items: center; gap: var(--size-24);
    border-bottom: 1px solid var(--border-default); margin-bottom: var(--size-8);
}
.settings-submenu__link {
    position: relative; padding: var(--size-8) 0;
    color: var(--text-default); text-decoration: none;
    transition: color var(--transition-base) var(--ease-standard);
}
.settings-submenu__link:hover { color: var(--brand); }
.settings-submenu__link.is-active { color: var(--brand); }
.settings-submenu__link.is-active::after {
    content: ''; position: absolute; left: 0; right: 0;
    bottom: calc(var(--border-width-accent) * -1); height: var(--border-width-accent);
    border-radius: var(--radius-sm); background: var(--brand);
}

/* ── Тарифы ── */
/* Сетка как у тарифов: [колонка-метки] [тарифы] [тарифы] — «Срок оплаты» по центру над
   тарифами, «Валюта» справа (реал), а не просто слева/справа на всю ширину. */
.pricing-head {
    display: grid;
    grid-template-columns: minmax(var(--size-128), 0.85fr) repeat(3, 1fr);
    align-items: start;
    gap: var(--size-24);
    margin-bottom: var(--size-32);
}
.pricing-head > :nth-child(1) { grid-column: 2 / 4; justify-self: center; }  /* «Срок оплаты» над Старт+Стандарт */
.pricing-head > :nth-child(2) { grid-column: 4 / 5; justify-self: center; }  /* «Валюта» над Бизнес */
.plans { display: grid; grid-template-columns: minmax(var(--size-128), 0.85fr) repeat(3, 1fr); gap: var(--size-16); }

/* Колонка названий фич слева (реал): спейсер под шапку + строки 48px встык со строками карточки. */
.plan-labels { display: flex; flex-direction: column; }
.plan-labels__spacer { height: 124px; }  /* = высота .ds-pricing-card__head */
.plan-labels__row {
    display: flex; align-items: center; gap: var(--size-6);
    height: var(--size-48); border-bottom: 1px solid var(--border-default);
    color: var(--text-heading);
}
.plan-labels__info { color: var(--text-placeholder); font-size: var(--font-size-body-s); }
.services { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--size-16); }

@include respond-below(lg) {
    /* Мобайл/планшет: карточки стопкой, колонка-метки скрыта (значения дублируются в карточке). */
    .pricing-head { grid-template-columns: 1fr; }
    .pricing-head > :nth-child(1),
    .pricing-head > :nth-child(2) { grid-column: 1; justify-self: stretch; }
    .plans { grid-template-columns: 1fr; }
    .plan-labels { display: none; }
    .services { grid-template-columns: 1fr; }
}

/* ── Модалка покупки ── */
.buy-pack {
    display: grid; grid-template-columns: 1fr auto; align-items: center; gap: var(--size-4);
    padding: var(--size-20); margin-bottom: var(--size-16);
    border-radius: var(--radius-md); background: var(--brand-gradient); color: var(--text-on-brand);
}
.buy-pack__label { grid-column: 1; color: var(--text-on-brand); opacity: var(--opacity-hover); }
.buy-pack__title { grid-column: 1; grid-row: 2; color: var(--text-on-brand); }
.buy-pack__price { grid-column: 2; grid-row: 1 / span 2; text-align: right; font-size: var(--font-size-heading-l); font-weight: var(--font-weight-bold); }
.buy-pack__per { display: block; font-size: var(--font-size-body-s); font-weight: var(--font-weight-regular); opacity: var(--opacity-hover); }
.buy-summary { margin-bottom: var(--size-16); }

.buy-field { display: flex; flex-direction: column; gap: var(--size-6); margin-bottom: var(--size-16); }
.buy-field__label { color: var(--text-default); }

/* Способ оплаты (DsOptionCard stack + border): 2 колонки. */
.pay-type { display: grid; grid-template-columns: 1fr 1fr; gap: var(--size-12); margin-bottom: var(--size-16); }

.jur { display: flex; gap: var(--size-24); margin-bottom: var(--size-16); }
.jur-field { margin-bottom: var(--size-16); }
.jur-agree { display: flex; margin-bottom: var(--size-12); align-items: flex-start; }
</style>
