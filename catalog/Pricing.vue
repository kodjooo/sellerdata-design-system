<template>
    <DocsLayout
        title="Тарифы"
        breadcrumb="Components"
        description="Компоненты раздела тарифов (реал /pricing): DsPricingCard — карточка пакета (старая зачёркнутая + текущая цена, лимит оборота, строки фич fm-check/fm-minus, действие); DsServiceCard — карточка доп.услуги (тело со списком фич + подвал цена/условия/«Заказать», вариант _free); DsPriceToggle — сегментный radio-group для срока оплаты (с бейджами −10/−20%) и валюты. Паттерны вынесены из экрана-эталона Screens/Settings.vue."
    >
        <!-- ─── DsPriceToggle ─── -->
        <section>
            <h2>DsPriceToggle — переключатель срока / валюты</h2>
            <DocExample plain>
                <div class="row">
                    <DsPriceToggle v-model="period" :options="periods" label="Срок оплаты" />
                    <DsPriceToggle v-model="currency" :options="currencies" label="Валюта" />
                </div>
            </DocExample>
            <PropsTable :rows="toggleProps" />
        </section>

        <!-- ─── DsPricingCard ─── -->
        <section>
            <h2>DsPricingCard — карточка тарифа</h2>
            <DocExample plain>
                <div class="plans">
                    <div class="plans__legend">
                        <div v-for="row in legend" :key="row.label" class="plans__legend-row">
                            <span class="plans__legend-ico" :class="row.icon" aria-hidden="true"></span>
                            <span class="t-body-s">{{ row.label }}</span>
                        </div>
                    </div>

                    <!-- Обычный пакет, доступен к покупке -->
                    <DsPricingCard
                        title="Старт"
                        price="400 ₽"
                        price-old="500 ₽"
                        payment-note="4 800 ₽ за год"
                        limit="до 200 000 ₽/мес"
                        :accounts="1"
                        :features="[true, true, true, false, false, false]"
                        current
                    />

                    <!-- Обычный пакет, доступен к покупке -->
                    <DsPricingCard
                        title="Стандарт"
                        price="1 200 ₽"
                        price-old="1 500 ₽"
                        payment-note="14 400 ₽ за год"
                        limit="до 1 000 000 ₽/мес"
                        :accounts="2"
                        :features="[true, true, true, true, true, false]"
                        @buy="onBuy('Стандарт')"
                    />

                    <!-- Заблокирован с причиной (disabled + tippy) -->
                    <DsPricingCard
                        title="Бизнес"
                        price="2 000 ₽"
                        price-old="2 500 ₽"
                        payment-note="24 000 ₽ за год"
                        limit="неограниченно"
                        :accounts="10"
                        :features="[true, true, true, true, true, true]"
                        disabled
                        disabled-reason="Сейчас вы не можете приобрести этот пакет, так как у вас активен бесплатный период"
                    />
                </div>
            </DocExample>
            <PropsTable :rows="cardProps" />
        </section>

        <!-- ─── DsServiceCard ─── -->
        <section>
            <h2>DsServiceCard — карточка доп.услуги</h2>
            <DocExample plain>
                <div class="services">
                    <DsServiceCard
                        free
                        title="Сравнение данных"
                        description="Есть сомнения в корректности данных? Мы сделаем сравнение с отчетами маркетплейсов."
                        features-title="Мы сверим:"
                        :features="['Количество и сумму продаж', 'Количество и сумму возвратов', 'Удержания маркетплейсов']"
                        price="Бесплатно"
                        conditions="1 раз/мес."
                        @order="onOrder('Сравнение данных')"
                    />
                    <DsServiceCard
                        title="Финансовый аудит"
                        description="Хотите понимать куда движется ваш бизнес? Наш финансовый аналитик сделает ежемесячный отчёт."
                        features-title="Структура отчёта:"
                        :features="['Анализ финансовых показателей', 'ABC анализ по товарам', 'Анализ складских запасов']"
                        price="5 000"
                        conditions="за 1 магазин"
                        @order="onOrder('Финансовый аудит')"
                    />
                </div>
            </DocExample>
            <PropsTable :rows="serviceProps" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsPriceToggle from '@/Components/Ds/DsPriceToggle.vue';
import DsPricingCard from '@/Components/Ds/DsPricingCard.vue';
import DsServiceCard from '@/Components/Ds/DsServiceCard.vue';

const period = ref('yearly');
const periods = [
    { key: 'monthly', label: '1 месяц' },
    { key: 'halfyearly', label: '6 месяцев', badge: '-10%' },
    { key: 'yearly', label: '12 месяцев', badge: '-20%' },
];
const currency = ref('RUB');
const currencies = [
    { key: 'RUB', label: '₽ Рубли' },
    { key: 'KZT', label: '₸ Тенге' },
];

const legend = [
    { label: 'Оборот', icon: 'fm-trending-up' },
    { label: 'Магазины', icon: 'fm-shopping-bag' },
    { label: 'Дэшборд', icon: 'fm-layout' },
    { label: 'Товары', icon: 'fm-clipboard' },
    { label: 'Расходы', icon: 'fm-credit-card' },
    { label: 'Импорт себестоимости', icon: 'fm-upload' },
];

function onBuy(plan) { console.log('buy', plan); }
function onOrder(service) { console.log('order', service); }

const toggleProps = [
    { name: 'modelValue', type: 'string | number', default: "''", desc: 'v-model — выбранный ключ (options[].key).' },
    { name: 'options', type: 'array', default: '[]', desc: 'Опции сегмента: [{ key, label, badge? }]. badge — например «-10%».' },
    { name: 'label', type: 'string', default: "''", desc: 'Подпись над сегментом (реал «Срок оплаты» / «Валюта»).' },
];

const cardProps = [
    { name: 'title', type: 'string', default: '—', desc: 'Название пакета (обязательный).' },
    { name: 'price', type: 'string', default: "''", desc: 'Текущая цена строкой, например «400 ₽».' },
    { name: 'priceOld', type: 'string', default: "''", desc: 'Старая зачёркнутая цена (скрыта при monthly).' },
    { name: 'pricePer', type: 'string', default: "'/месяц'", desc: 'Приписка к цене.' },
    { name: 'paymentNote', type: 'string', default: "''", desc: 'Сумма за период («4 800 ₽ за год»).' },
    { name: 'limit', type: 'string', default: "''", desc: 'Лимит оборота («до 200 000 ₽/мес» / «неограниченно»).' },
    { name: 'accounts', type: 'string | number', default: 'null', desc: 'Число аккаунтов (первая строка). null — не рендерить.' },
    { name: 'features', type: 'array', default: '[]', desc: 'Boolean (check/minus) или объекты { on, value }.' },
    { name: 'rowLabels', type: 'array', default: '[]', desc: 'Подписи строк [лимит, аккаунты, ...фичи] — инлайн на мобайле (<lg), когда внешняя колонка-метки скрыта.' },
    { name: 'current', type: 'boolean', default: 'false', desc: 'Подсветка текущего пакета (бордер --brand) + «Текущий пакет».' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: 'Заблокировать кнопку покупки.' },
    { name: 'disabledReason', type: 'string', default: "''", desc: 'Причина блокировки — текст тултипа (реал v-tippy).' },
    { name: 'buyLabel', type: 'string', default: "'Купить'", desc: 'Подпись кнопки покупки.' },
    { name: 'currentLabel', type: 'string', default: "'Текущий пакет'", desc: 'Подпись для текущего пакета.' },
];

const serviceProps = [
    { name: 'title', type: 'string', default: '—', desc: 'Название услуги (обязательный).' },
    { name: 'description', type: 'string', default: "''", desc: 'Описание услуги.' },
    { name: 'featuresTitle', type: 'string', default: "''", desc: 'Заголовок над списком фич («Мы сверим:»).' },
    { name: 'features', type: 'array', default: '[]', desc: 'Список фич (строки).' },
    { name: 'price', type: 'string', default: "''", desc: 'Цена строкой («5 000» / «Бесплатно»).' },
    { name: 'priceSuffix', type: 'string', default: "'₽/мес.'", desc: 'Суффикс цены платной услуги.' },
    { name: 'conditions', type: 'string', default: "''", desc: 'Условия тарификации («за 1 магазин»).' },
    { name: 'free', type: 'boolean', default: 'false', desc: 'Бесплатная услуга — цена стандартным цветом (не зелёным), без суффикса.' },
    { name: 'orderLabel', type: 'string', default: "'Заказать'", desc: 'Подпись кнопки.' },
];
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

.row { display: flex; flex-wrap: wrap; gap: var(--size-32); align-items: flex-start; }

.plans {
    display: grid;
    grid-template-columns: minmax(160px, 1fr) repeat(3, 1fr);
    gap: var(--size-16);
    align-items: stretch;
}
.plans__legend { display: flex; flex-direction: column; justify-content: flex-end; }
.plans__legend-row {
    display: flex; align-items: center; gap: var(--size-8);
    height: var(--size-48); border-bottom: 1px solid var(--border-default);
    color: var(--text-default);
}
.plans__legend-ico { color: var(--text-muted); font-size: var(--font-size-title-m); }

.services { display: grid; grid-template-columns: 1fr 1fr; gap: var(--size-16); align-items: stretch; }

@include respond-below(lg) {
    .plans { grid-template-columns: 1fr; }
    .plans__legend { display: none; }
    .services { grid-template-columns: 1fr; }
}
</style>
