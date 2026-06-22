<template>
    <Head title="Настройки — экран-эталон" />
    <DsAppShell :items="nav" active="settings">
        <template #logo><span class="brand">sellerdata</span></template>
        <template #title>
            <span class="topbar">
                <strong class="t-title-m topbar__page">Общие</strong>
            </span>
        </template>
        <template #actions>
            <span class="fm-help-circle topbar__ico" aria-hidden="true"></span>
            <span class="fm-bell topbar__ico" aria-hidden="true"></span>
            <DsAccountBadge name="Демо аккаунт" store="Основной Магазин" />
        </template>

        <div class="screen">
            <!-- Онбординг-баннер раздела (реал: BreezeDashboardInfo «Режим настроек…») -->
            <DsNotice v-model:visible="hintOpen" tone="plain" collapse-mobile>
                <template #media><span class="hint-thumb" aria-hidden="true"></span></template>
                Режим настроек работы сервиса. Здесь вы можете сменить пароль и адрес электронной почты вашего
                аккаунта, управлять настройками рассылки, добавлять магазины в ваш аккаунт (для пакета «Бизнес»).
                Также вы можете активировать учёт налога, ввести процент и тип начисления, а также указать, с какой
                даты его применять в расчётах.
            </DsNotice>

            <!-- ─── Секция «Магазины» ─── -->
            <DsCard radius="lg" padding="--size-24" tag="section">
                <h2 class="t-heading-m section__title">Магазины</h2>

                <div class="stores">
                    <!-- Карточка магазина: имя+площадка | фичи (пилюли) | действия.
                         Активный магазин подсвечен фоном --surface-subtle (реал ._active). -->
                    <div
                        v-for="store in stores"
                        :key="store.id"
                        class="store"
                        :class="{ 'is-active': store.active }"
                    >
                        <div class="store__head">
                            <a class="t-body-s store__name" href="#" @click.prevent>{{ store.title }}</a>
                            <span class="t-body-s store__service">{{ store.service }}</span>
                        </div>

                        <div class="store__features">
                            <span
                                v-for="f in store.features"
                                :key="f.label"
                                class="feature"
                                :class="`feature--${f.state}`"
                            >
                                <span class="feature__ico" :class="featureIcon(f.state)" aria-hidden="true"></span>
                                <span class="t-body-s">{{ f.label }}</span>
                            </span>
                        </div>

                        <div class="store__actions">
                            <button type="button" class="store-action" @click="openKey(store)">
                                <span class="store-action__ico fm-edit" aria-hidden="true"></span>Изменить ключ
                            </button>
                            <button type="button" class="store-action" @click="openSettings(store)">
                                <span class="store-action__ico fm-settings" aria-hidden="true"></span>Настройки
                            </button>
                            <button
                                type="button"
                                class="store-action"
                                :class="{ 'is-disabled': !store.canDelete }"
                                :disabled="!store.canDelete"
                                @click="openDelete(store)"
                            >
                                <span class="store-action__ico fm-trash-2" aria-hidden="true"></span>Удалить
                            </button>
                        </div>
                    </div>
                </div>

                <DsButton variant="primary" class="stores__add" @click="addOpen = true">Добавить магазин</DsButton>
            </DsCard>

            <!-- ─── Секция «Прочие настройки» ─── -->
            <DsCard radius="lg" padding="--size-24" tag="section">
                <h2 class="t-heading-m section__title">Прочие настройки</h2>

                <!-- Эл. почта -->
                <div class="subsection">
                    <h3 class="t-heading-m subsection__title">Эл. почта</h3>
                    <div class="email">
                        <h4 class="t-heading-m email__title">Подтверждение по электронной почте</h4>
                        <p class="t-body-s email__text">Электронная почта не подтверждена</p>
                        <p class="t-body-s email__text">
                            Пожалуйста, подтвердите свой адрес электронной почты, чтобы мы могли отправлять вам важные
                            сообщения, касающиеся вашей учетной записи sellerdata
                        </p>
                        <DsButton variant="primary" class="email__btn">Отправить повторно</DsButton>
                    </div>
                </div>

                <!-- Безопасность -->
                <div class="subsection">
                    <h3 class="t-heading-m subsection__title">Безопасность</h3>
                    <a class="t-body-s link" href="#" @click.prevent>Изменить пароль</a>
                </div>
            </DsCard>

            <!-- Подвал поддержки -->
            <DsSupportFooter />
        </div>

        <!-- ─── Модалка «Изменение подключения» (реал UpdateAccountApiKeyLink) ─── -->
        <DsModal v-model="keyOpen" size="md">
            <template #header>
                <div class="key-head">
                    <h2 class="t-title-m key-head__title">Изменение подключения</h2>
                    <span class="t-body-s key-head__sub">{{ keyStore.service }} · {{ keyStore.title }}</span>
                </div>
            </template>

            <!-- Текущее состояние ключа -->
            <DsNotice tone="plain" :dismissible="false" class="key-status">
                <template #media><span class="key-status__ico fm-check-circle" aria-hidden="true"></span></template>
                <strong class="t-label-m key-status__title">Подключено по API-ключу</strong>
                <span class="t-body-s key-status__sub">Ключ активен до 7 дек. 2026 г.</span>
            </DsNotice>

            <p class="t-label-m key-section">Выберите действие</p>

            <!-- Радио-выбор действия: OAuth vs обновить ключ (реал — две карточки-варианты) -->
            <button
                v-for="opt in keyActions"
                :key="opt.key"
                type="button"
                class="key-opt"
                :class="{ 'is-active': keyAction === opt.key }"
                @click="keyAction = opt.key"
            >
                <span class="key-opt__ico" :class="opt.icon" aria-hidden="true"></span>
                <span class="key-opt__body">
                    <span class="t-label-m key-opt__title">{{ opt.title }}</span>
                    <span class="t-body-s key-opt__sub">{{ opt.sub }}</span>
                </span>
            </button>

            <DsInput
                v-if="keyAction === 'update'"
                v-model="apiKey"
                placeholder="API-ключ Wildberries"
                class="key-input"
            />

            <!-- Подсказка-ссылка (реал: «Где найти ключ API Wildberries?») -->
            <a v-if="keyAction === 'update'" class="t-body-s key-help" href="#" @click.prevent>
                Где найти ключ API Wildberries?
            </a>

            <template #footer>
                <DsButton variant="secondary" @click="keyOpen = false">Отмена</DsButton>
                <DsButton variant="primary" :disabled="keyAction === 'update' && !apiKey">Сохранить ключ</DsButton>
            </template>
        </DsModal>

        <!-- ─── Модалка «Настройки аккаунта» (реал AccountSettingsLink — налог/НДС) ─── -->
        <DsModal v-model="settingsOpen" :title="`Настройки аккаунта (${settingsStore.title})`" size="lg">
            <DsNotice tone="peach" :dismissible="false" class="tax-warn">
                Сумма налоговых расходов носит информативный характер. Перед оплатой налога проконсультируйтесь с вашим
                бухгалтером или налоговым агентом.
            </DsNotice>

            <a class="t-body-s link tax-help" href="#" @click.prevent>
                <span class="fm-help-circle" aria-hidden="true"></span> Как проверить расчет налоговой базы?
            </a>

            <!-- Налог на доход -->
            <div class="tax">
                <div class="tax__head">
                    <h3 class="t-heading-m tax__title">Налог на доход</h3>
                    <span class="fm-info tax__info" aria-hidden="true"></span>
                </div>
                <DsCheckbox v-model="incomeTax.active" label="Активировать" />

                <div v-if="incomeTax.active" class="tax__grid">
                    <div v-for="(rate, i) in incomeTax.rates" :key="i" class="tax-card">
                        <button
                            v-if="incomeTax.rates.length > 1"
                            type="button"
                            class="tax-card__remove fm-x"
                            aria-label="Удалить ставку"
                            @click="incomeTax.rates.splice(i, 1)"
                        ></button>
                        <DsInput v-model="rate.percent" label="Процент налога" placeholder="0" />
                        <DsInput v-model="rate.from" label="Применить с" placeholder="дд.мм.гггг" />
                        <div class="tax-card__field">
                            <span class="t-label-m tax-card__label">Принцип начисления</span>
                            <DsSelect
                                v-model="rate.principle"
                                :options="principleOptions"
                                :show-footer="false"
                                placeholder="Выберите"
                            />
                        </div>
                    </div>

                    <button type="button" class="tax-add" @click="incomeTax.rates.push({ percent: '', from: '', principle: 'Сумма реализации' })">
                        <span class="tax-add__ico fm-plus-square" aria-hidden="true"></span>
                        <span class="t-body-s">Добавить</span>
                    </button>
                </div>
            </div>

            <!-- НДС -->
            <div class="tax">
                <div class="tax__head">
                    <h3 class="t-heading-m tax__title">НДС</h3>
                    <span class="fm-info tax__info" aria-hidden="true"></span>
                </div>
                <DsCheckbox v-model="vat.active" label="Активировать" />
            </div>

            <template #footer>
                <DsButton variant="secondary" @click="settingsOpen = false">Отмена</DsButton>
                <DsButton variant="primary" @click="settingsOpen = false">Сохранить</DsButton>
            </template>
        </DsModal>

        <!-- ─── Модалка удаления магазина (реал DeleteAccountLink) ─── -->
        <DsModal v-model="deleteOpen" title="Вы уверены что хотите удалить магазин?" size="sm">
            <p class="t-body-l del-text">Все данные будут потеряны!!!</p>
            <template #footer>
                <DsButton variant="secondary" @click="deleteOpen = false">Отменить</DsButton>
                <DsButton variant="primary" @click="deleteOpen = false">Удалить</DsButton>
            </template>
        </DsModal>

        <!-- ─── Модалка «Добавить магазин» (реал — выбор площадки) ─── -->
        <DsModal v-model="addOpen" title="Добавить магазин" size="sm">
            <p class="t-body-l add-text">Выберите маркетплейс для подключения нового магазина.</p>
            <div class="add-grid">
                <button
                    v-for="mp in marketplaces"
                    :key="mp"
                    type="button"
                    class="add-opt"
                    :class="{ 'is-active': newMarketplace === mp }"
                    @click="newMarketplace = mp"
                >
                    <span class="t-label-m">{{ mp }}</span>
                </button>
            </div>
            <template #footer>
                <DsButton variant="secondary" @click="addOpen = false">Отмена</DsButton>
                <DsButton variant="primary" :disabled="!newMarketplace">Продолжить</DsButton>
            </template>
        </DsModal>

        <!-- ════════════════════════════════════════════════════════════
             РАЗДЕЛ «ТАРИФ / ОПЛАТА» (реал /pricing) — второй экран-эталон
             ════════════════════════════════════════════════════════════ -->
        <div class="screen screen--pricing">
            <h2 class="t-heading-m section__title">Тарифы</h2>

            <DsCard radius="lg" padding="--size-24" tag="section">
                <!-- Сегментные переключатели: срок оплаты (слева) + валюта (справа) -->
                <div class="pricing-head">
                    <div class="pricing-head__group">
                        <span class="t-body-s pricing-head__label">Срок оплаты</span>
                        <div class="segment">
                            <button
                                v-for="p in periods"
                                :key="p.key"
                                type="button"
                                class="segment__btn"
                                :class="{ 'is-active': period === p.key }"
                                @click="period = p.key"
                            >
                                <span>{{ p.label }}</span>
                                <span v-if="p.badge" class="segment__badge">{{ p.badge }}</span>
                            </button>
                        </div>
                    </div>

                    <div class="pricing-head__group">
                        <span class="t-body-s pricing-head__label">Валюта</span>
                        <div class="segment">
                            <button
                                v-for="c in currencies"
                                :key="c.code"
                                type="button"
                                class="segment__btn"
                                :class="{ 'is-active': currency === c.code }"
                                @click="currency = c.code"
                            >
                                {{ c.symbol }} {{ c.name }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Сетка тарифов: левая колонка-легенда + 3 пакета -->
                <div class="plans">
                    <div class="plans__legend">
                        <div v-for="row in legend" :key="row.label" class="plans__legend-row">
                            <span class="plans__legend-ico" :class="row.icon" aria-hidden="true"></span>
                            <span class="t-body-s">{{ row.label }}</span>
                            <span v-if="row.info" class="fm-info plans__legend-info" aria-hidden="true"></span>
                        </div>
                    </div>

                    <div
                        v-for="plan in plans"
                        :key="plan.id"
                        class="plan"
                        :class="{ 'is-current': plan.current }"
                    >
                        <div class="plan__head">
                            <span class="t-heading-m plan__name">{{ plan.title }}</span>
                            <span class="t-body-s plan__price-old">{{ plan.priceOld }} ₽<span class="plan__per">/месяц</span></span>
                            <span class="plan__price">{{ plan.price }} ₽<span class="plan__per">/месяц</span></span>
                            <span class="t-body-s plan__payment">{{ plan.yearly }} ₽ за год</span>
                        </div>
                        <div class="t-body-s plan__limit">{{ plan.limit }}</div>
                        <div class="plan__rows">
                            <div class="plan__row plan__row--accounts">{{ plan.accounts }}</div>
                            <div v-for="(on, i) in plan.features" :key="i" class="plan__row">
                                <span v-if="on" class="fm-check plan__check" aria-hidden="true"></span>
                            </div>
                        </div>
                        <div class="plan__actions">
                            <DsButton variant="primary" :disabled="plan.current" @click="openBuy(plan)">
                                {{ plan.current ? 'Текущий пакет' : 'Купить' }}
                            </DsButton>
                        </div>
                    </div>
                </div>
            </DsCard>
        </div>

        <!-- ─── Модалка «Как вы будете платить?» (реал buyModal) ─── -->
        <DsModal v-model="buyOpen" title="Как вы будете платить?" size="md">
            <!-- Шапка-пакет (brand-gradient) -->
            <div class="buy-pack">
                <span class="t-body-s buy-pack__label">Пакет</span>
                <span class="t-heading-l buy-pack__title">{{ buyPlan.title }}</span>
                <span class="buy-pack__price">{{ buyPlan.yearly }},00 ₽<span class="buy-pack__per">в год</span></span>
            </div>

            <!-- Сводка платежа (реал payment-success__summary) -->
            <DsInfoList :items="buySummary" flat class="buy-summary" />

            <div class="buy-field">
                <span class="t-label-m buy-field__label">Страна</span>
                <DsSelect v-model="country" :options="countryOptions" :show-footer="false" placeholder="Выберите страну" />
            </div>

            <!-- Способ оплаты: карта / счёт (реал pricing-payment-type) -->
            <div class="pay-type">
                <button
                    v-for="m in payMethods"
                    :key="m.key"
                    type="button"
                    class="pay-type__opt"
                    :class="{ 'is-active': payMethod === m.key }"
                    @click="payMethod = m.key"
                >
                    <span class="pay-type__ico" :class="m.icon" aria-hidden="true"></span>
                    <span class="t-body-s pay-type__text">{{ m.label }}</span>
                </button>
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
    </DsAppShell>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import DsAppShell from '@/Components/Ds/DsAppShell.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsSupportFooter from '@/Components/Ds/DsSupportFooter.vue';
import DsInput from '@/Components/Ds/DsInput.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsCheckbox from '@/Components/Ds/DsCheckbox.vue';
import DsModal from '@/Components/Ds/DsModal.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';
import DsInfoList from '@/Components/Ds/DsInfoList.vue';
import DsAccountBadge from '@/Components/Ds/DsAccountBadge.vue';

// Сайдбар — сверен с реальным Authenticated.vue (как в Screens/Expenses.vue).
const nav = [
    { key: 'dashboard', label: 'Дэшборд', icon: 'fm-layout', href: route('designSystem.screenDashboard') },
    { key: 'products', label: 'Товары', icon: 'fm-clipboard', href: route('designSystem.screenProducts') },
    { key: 'expenses', label: 'Расходы', icon: 'fm-credit-card', href: route('designSystem.screenExpenses') },
    { key: 'redeems', label: 'Самовыкупы', icon: 'fm-rotate-ccw', href: route('designSystem.screenRedeems') },
    { key: 'ads', label: 'Реклама', icon: 'fm-volume-2', href: route('designSystem.screenAdvertising') },
    { key: 'warehouse', label: 'Склад', icon: 'fm-archive', href: route('designSystem.screenWarehouse') },
    { key: 'settings', label: 'Настройки', icon: 'fm-settings', href: route('designSystem.screenSettings') },
];

const hintOpen = ref(true);

// Иконка пилюли-фичи по состоянию (реал: success=check, attention=!, disabled/add=plus).
function featureIcon(state) {
    if (state === 'success') return 'fm-check';
    if (state === 'attention') return 'fm-alert-triangle';
    return 'fm-plus';
}

// ── Магазины (реал account 4 WB + доп. Ozon) ──
const stores = [
    {
        id: 4, title: 'Основной Магазин', service: 'Wildberries', active: true, canDelete: false,
        features: [
            { label: 'Статистика', state: 'success' },
            { label: 'Реклама', state: 'success' },
            { label: 'Аналитика', state: 'success' },
            { label: 'Маркетплейс', state: 'success' },
            { label: 'Поставки', state: 'success' },
            { label: 'Финансы', state: 'success' },
        ],
    },
    {
        id: 5, title: 'Дополнительный маг…', service: 'Ozon', active: false, canDelete: true,
        features: [{ label: 'Реклама', state: 'add' }],
    },
];

// ── Модалка «Изменить ключ» ──
const keyOpen = ref(false);
const keyStore = ref(stores[0]);
const keyAction = ref('update');
const apiKey = ref('');
const keyActions = [
    { key: 'oauth', title: 'Подключить через OAuth', sub: 'Подключение через личный кабинет ВБ', icon: 'fm-link-2' },
    { key: 'update', title: 'Обновить API-ключ', sub: 'Заменить текущий ключ', icon: 'fm-key' },
];
function openKey(store) { keyStore.value = store; keyAction.value = 'update'; apiKey.value = ''; keyOpen.value = true; }

// ── Модалка «Настройки аккаунта» (налог/НДС) ──
const settingsOpen = ref(false);
const settingsStore = ref(stores[0]);
const principleOptions = ['Сумма реализации', 'Сумма поступлений'];
const incomeTax = ref({
    active: true,
    rates: [
        { percent: '7', from: '01.01.2025', principle: 'Сумма реализации' },
        { percent: '6', from: '01.02.2026', principle: 'Сумма реализации' },
    ],
});
const vat = ref({ active: true });
function openSettings(store) { settingsStore.value = store; settingsOpen.value = true; }

// ── Модалка удаления ──
const deleteOpen = ref(false);
function openDelete(store) { if (!store.canDelete) return; deleteOpen.value = true; }

// ── Модалка добавления магазина ──
const addOpen = ref(false);
const newMarketplace = ref('');
const marketplaces = ['Wildberries', 'Ozon', 'Яндекс Маркет'];

// ── Тарифы ──
const period = ref('yearly');
const periods = [
    { key: 'monthly', label: '1 месяц' },
    { key: 'halfyearly', label: '6 месяцев', badge: '-10%' },
    { key: 'yearly', label: '12 месяцев', badge: '-20%' },
];
const currency = ref('RUB');
const currencies = [
    { code: 'RUB', symbol: '₽', name: 'Рубли' },
    { code: 'KZT', symbol: '₸', name: 'Тенге' },
];

// Легенда фич (реал pricing__left) — порядок 1:1 со скрином.
const legend = [
    { label: 'Оборот', icon: 'fm-trending-up', info: true },
    { label: 'Магазины', icon: 'fm-shopping-bag', info: true },
    { label: 'Дэшборд', icon: 'fm-layout' },
    { label: 'Товары', icon: 'fm-clipboard' },
    { label: 'Расходы', icon: 'fm-credit-card' },
    { label: 'Импорт себестоимости', icon: 'fm-upload' },
    { label: 'Самовыкупы', icon: 'fm-rotate-ccw' },
    { label: 'Склад', icon: 'fm-archive' },
    { label: 'Диаграммы', icon: 'fm-trending-up', info: true },
    { label: 'Чат поддержки', icon: 'fm-message-circle' },
];

// Пакеты (реал packs; цены/лимиты — со скрина тариф__список@wb, период 12 мес).
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
    { label: 'Остаток к оплате', value: `${buyPlan.value.yearly},00 ₽`, strong: true },
    { label: 'Следующее списание', value: '11.06.2027' },
    { label: 'Сумма списания', value: `${buyPlan.value.yearly},00 ₽` },
]);
const canPay = computed(() => agreePersonal.value && (payMethod.value === 'invoice' || agreeTerms.value));

function openBuy(plan) {
    buyPlan.value = plan;
    buyOpen.value = true;
}
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

/* ── Каркас: лого / топбар / аккаунт (как в Screens/Expenses.vue) ── */
.brand { font-size: var(--font-size-body-s); font-weight: var(--font-weight-bold); color: var(--brand); }
.topbar { display: inline-flex; align-items: center; gap: var(--size-24); }
.topbar__page { color: var(--text-heading); }
.topbar__ico { color: var(--text-muted); font-size: var(--font-size-heading-m); cursor: pointer; }

.screen { display: flex; flex-direction: column; gap: var(--size-16); }
.screen--pricing { margin-top: var(--size-32); }

.hint-thumb { display: block; width: 96px; height: 56px; border-radius: var(--radius-sm); background: var(--brand-gradient); }

/* Общие секционные заголовки/ссылки */
.section__title { color: var(--text-heading); margin-bottom: var(--size-16); }
.link { color: var(--brand); text-decoration: none; }
.link:hover { text-decoration: underline; }
.support { text-align: center; color: var(--text-muted); }
.support__link { color: var(--brand); text-decoration: none; }
.support__link:hover { text-decoration: underline; }

/* ── Карточки магазинов ── */
.stores { display: flex; flex-direction: column; gap: var(--size-12); }
.store {
    display: flex; align-items: center; gap: var(--size-16);
    padding: var(--size-16) var(--size-24);
    border: 1px solid var(--border-default); border-radius: var(--radius-md);
    background: var(--surface-default);
    flex-wrap: wrap;
}
.store.is-active { background: var(--surface-subtle); border-color: transparent; }
.store__head { display: flex; flex-direction: column; gap: var(--size-2); min-width: 160px; }
.store__name { color: var(--brand); text-decoration: none; font-weight: var(--font-weight-semibold); }
.store__name:hover { text-decoration: underline; }
.store__service { color: var(--text-heading); }

.store__features { display: flex; flex-wrap: wrap; gap: var(--size-8); flex: 1 1 auto; }
/* Пилюля-фича: white, border --gray-300, radius-full, padding 8/16/8/8 (computed-diff). */
.feature {
    display: inline-flex; align-items: center; gap: var(--size-8);
    padding: var(--size-8) var(--size-16) var(--size-8) var(--size-8);
    border: 1px solid var(--gray-300); border-radius: var(--radius-full);
    background: var(--surface-default); color: var(--text-heading);
    white-space: nowrap;
}
.feature__ico {
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--size-20); height: var(--size-20); border-radius: var(--radius-full);
    font-size: var(--font-size-caption); color: var(--white);
}
.feature--success .feature__ico { background: var(--accent-positive); }
.feature--attention .feature__ico { background: var(--status-attention); }
.feature--add .feature__ico { background: var(--surface-disabled); color: var(--text-muted); }

.store__actions { display: flex; align-items: center; gap: var(--size-24); flex-wrap: wrap; }
.store-action {
    display: inline-flex; align-items: center; gap: var(--size-8);
    border: 0; background: transparent; color: var(--brand);
    font-size: var(--font-size-body-s); cursor: pointer;
}
.store-action:hover { text-decoration: underline; }
.store-action.is-disabled { color: var(--text-muted); cursor: not-allowed; }
.store-action.is-disabled:hover { text-decoration: none; }

.stores__add { margin-top: var(--size-16); }

/* ── Прочие настройки ── */
.subsection { margin-top: var(--size-24); padding-top: var(--size-16); border-top: 1px solid var(--border-default); }
.subsection__title { color: var(--text-default); font-size: var(--font-size-title-m); margin-bottom: var(--size-12); }
.email { display: flex; flex-direction: column; gap: var(--size-6); align-items: flex-start; }
.email__title { color: var(--text-default); font-size: var(--font-size-title-m); }
.email__text { color: var(--text-default); }
.email__btn { margin-top: var(--size-8); }

/* ── Модалка «Изменить ключ» ── */
.key-help { display: inline-block; margin-top: var(--size-8); color: var(--brand); text-decoration: none; }
.key-help:hover { text-decoration: underline; }
.key-head { display: flex; flex-direction: column; gap: var(--size-2); min-width: 0; }
.key-head__title { color: var(--text-on-brand); margin: 0; }
.key-head__sub { color: var(--text-on-brand); opacity: var(--opacity-hover); }

.key-status { margin-bottom: var(--size-16); border-color: var(--notice-success-text); background: var(--notice-success-bg); }
.key-status__ico { color: var(--notice-success-text); font-size: var(--font-size-heading-m); }
.key-status__title { display: block; color: var(--notice-success-text); }
.key-status__sub { display: block; color: var(--text-default); }
.key-section { color: var(--text-heading); margin-bottom: var(--size-8); }

.key-opt {
    display: flex; align-items: center; gap: var(--size-12); width: 100%;
    padding: var(--size-12) var(--size-16); margin-bottom: var(--size-8);
    border: 1px solid var(--border-default); border-radius: var(--radius-md);
    background: var(--surface-default); cursor: pointer; text-align: left;
    transition: border-color var(--transition-fast) var(--ease-standard);
}
.key-opt:hover { border-color: var(--border-strong); }
.key-opt.is-active { background: var(--brand); border-color: var(--brand); }
.key-opt.is-active .key-opt__title,
.key-opt.is-active .key-opt__sub,
.key-opt.is-active .key-opt__ico { color: var(--text-on-brand); }
.key-opt__ico {
    flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center;
    width: var(--size-40); height: var(--size-40); border-radius: var(--radius-md);
    background: var(--surface-subtle); color: var(--brand); font-size: var(--font-size-title-m);
}
.key-opt.is-active .key-opt__ico { background: rgb(from var(--white) r g b / 0.2); }
.key-opt__body { display: flex; flex-direction: column; gap: var(--size-2); }
.key-opt__title { color: var(--text-heading); }
.key-opt__sub { color: var(--text-muted); }
.key-input { margin-top: var(--size-8); }

/* ── Модалка «Настройки аккаунта» ── */
.tax-warn { margin-bottom: var(--size-16); }
.tax-help { display: inline-flex; align-items: center; gap: var(--size-6); margin-bottom: var(--size-24); }
.tax { padding-top: var(--size-16); border-top: 1px solid var(--border-default); margin-top: var(--size-16); }
.tax:first-of-type { border-top: 0; padding-top: 0; margin-top: 0; }
.tax__head { display: flex; align-items: center; gap: var(--size-8); margin-bottom: var(--size-12); }
.tax__title { color: var(--text-heading); }
.tax__info { color: var(--text-muted); }
.tax__grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: var(--size-16);
    margin-top: var(--size-16);
}
.tax-card {
    position: relative; display: flex; flex-direction: column; gap: var(--size-12);
    padding: var(--size-16); border-radius: var(--radius-md); background: var(--surface-subtle);
}
.tax-card__remove {
    position: absolute; top: var(--size-8); right: var(--size-8);
    border: 0; background: transparent; color: var(--text-muted); cursor: pointer;
}
.tax-card__field { display: flex; flex-direction: column; gap: var(--size-6); }
.tax-card__label { color: var(--text-default); }
.tax-add {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--size-8);
    padding: var(--size-16); border: 1px dashed var(--border-input); border-radius: var(--radius-md);
    background: transparent; color: var(--brand); cursor: pointer;
}
.tax-add__ico { font-size: var(--font-size-title-m); }

@include respond-below(md) {
    .tax__grid { grid-template-columns: 1fr; }
}

.del-text { color: var(--text-default); }
.add-text { color: var(--text-default); margin-bottom: var(--size-16); }
.add-grid { display: grid; grid-template-columns: 1fr; gap: var(--size-8); }
.add-opt {
    padding: var(--size-12) var(--size-16); border: 1px solid var(--border-default);
    border-radius: var(--radius-md); background: var(--surface-default); color: var(--text-heading);
    cursor: pointer; text-align: left;
}
.add-opt:hover { border-color: var(--border-strong); }
.add-opt.is-active { border-color: var(--brand); background: var(--surface-subtle); }

/* ── Тарифы: сегментные переключатели ── */
.pricing-head {
    display: flex; justify-content: space-between; align-items: flex-start;
    gap: var(--size-24); flex-wrap: wrap; margin-bottom: var(--size-32);
}
.pricing-head__group { display: flex; flex-direction: column; align-items: center; gap: var(--size-8); }
.pricing-head__label { color: var(--text-heading); font-weight: var(--font-weight-semibold); }
/* Сегмент (реал radioGroup): pill-контейнер, активная кнопка — brand. */
.segment {
    display: inline-flex; align-items: center; gap: var(--size-2);
    padding: var(--size-4); border-radius: var(--radius-full);
    background: transparent; border: 1px solid var(--border-default);
}
.segment__btn {
    display: inline-flex; align-items: center; gap: var(--size-6);
    padding: var(--size-4) var(--size-20); border: 0; border-radius: var(--radius-full);
    background: transparent; color: var(--text-default); font-size: var(--font-size-body-s);
    cursor: pointer; white-space: nowrap;
    transition: background-color var(--transition-fast) var(--ease-standard);
}
.segment__btn.is-active { background: var(--brand); color: var(--text-on-brand); }
.segment__badge {
    padding: var(--size-2) var(--size-6); border-radius: var(--radius-full);
    background: rgb(from var(--white) r g b / 0.2); font-size: var(--font-size-caption);
}
.segment__btn:not(.is-active) .segment__badge { background: var(--surface-disabled); color: var(--text-muted); }

/* ── Сетка тарифов ── */
.plans {
    display: grid; grid-template-columns: minmax(180px, 1.2fr) repeat(3, 1fr);
    gap: var(--size-16);
}
.plans__legend { display: flex; flex-direction: column; justify-content: flex-end; }
.plans__legend-row {
    display: flex; align-items: center; gap: var(--size-8);
    height: var(--size-48); border-bottom: 1px solid var(--border-default);
    color: var(--text-default);
}
.plans__legend-ico { color: var(--text-muted); font-size: var(--font-size-title-m); }
.plans__legend-info { margin-left: auto; color: var(--text-muted); }

.plan {
    display: flex; flex-direction: column;
    border: 1px solid var(--border-default); border-radius: var(--radius-md);
    background: var(--surface-default); overflow: hidden;
}
.plan.is-current { border-color: var(--brand); }
.plan__head {
    display: flex; flex-direction: column; align-items: center; gap: var(--size-2);
    padding: var(--size-16); border-bottom: 1px solid var(--border-default);
}
.plan__name { color: var(--text-heading); }
.plan__price-old { color: var(--text-muted); text-decoration: line-through; }
.plan__price { font-size: var(--font-size-heading-m); font-weight: var(--font-weight-bold); color: var(--text-heading); }
.plan__per { font-size: var(--font-size-body-s); font-weight: var(--font-weight-regular); color: var(--text-muted); margin-left: var(--size-4); }
.plan__payment { color: var(--text-muted); }
.plan__limit {
    display: flex; align-items: center; justify-content: center;
    height: var(--size-48); border-bottom: 1px solid var(--border-default);
    color: var(--text-heading); font-weight: var(--font-weight-semibold); text-align: center;
}
.plan__rows { display: flex; flex-direction: column; }
.plan__row {
    display: flex; align-items: center; justify-content: center;
    height: var(--size-48); border-bottom: 1px solid var(--border-default);
    color: var(--text-heading);
}
.plan__row--accounts { font-weight: var(--font-weight-semibold); }
.plan__check { color: var(--text-heading); }
.plan__actions { margin-top: auto; padding: var(--size-16); }
.plan__actions :deep(.ds-btn) { width: 100%; }

@include respond-below(lg) {
    .plans { grid-template-columns: 1fr; }
    .plans__legend { display: none; }
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

.pay-type { display: grid; grid-template-columns: 1fr 1fr; gap: var(--size-12); margin-bottom: var(--size-16); }
.pay-type__opt {
    display: flex; flex-direction: column; align-items: center; gap: var(--size-8);
    padding: var(--size-16); border: 1px solid var(--border-default); border-radius: var(--radius-md);
    background: var(--surface-default); cursor: pointer;
    transition: border-color var(--transition-fast) var(--ease-standard);
}
.pay-type__opt:hover { border-color: var(--border-strong); }
.pay-type__opt.is-active { border-color: var(--brand); }
.pay-type__ico { font-size: var(--font-size-heading-m); color: var(--brand); }
.pay-type__opt:not(.is-active) .pay-type__text { color: var(--text-heading); }
.pay-type__opt.is-active .pay-type__text { color: var(--brand); }

.jur { display: flex; gap: var(--size-24); margin-bottom: var(--size-16); }
.jur-field { margin-bottom: var(--size-16); }
.jur-agree { display: flex; margin-bottom: var(--size-12); align-items: flex-start; }
</style>
