<template>
    <Head title="Настройки · Пригласи друга — экран-эталон" />
    <DsAppShell :items="nav" active="settings">
        <template #logo><span class="brand">sellerdata</span></template>
        <template #title>
            <span class="topbar">
                <strong class="t-title-m topbar__page">Пригласи друга</strong>
            </span>
        </template>
        <template #actions>
            <span class="fm-help-circle topbar__ico" aria-hidden="true"></span>
            <span class="fm-bell topbar__ico" aria-hidden="true"></span>
            <DsAccountMenu name="Демо аккаунт" active-id="wb" :stores="[{id:&apos;wb&apos;,name:&apos;Основной Магазин&apos;,dataSource:&apos;wildberries&apos;},{id:&apos;ozon&apos;,name:&apos;Дополнительный магазин&apos;,dataSource:&apos;ozon&apos;}]" />
        </template>

        <div class="screen">
            <!-- Под-меню настроек: Общие | Оплата | Пригласи друга -->
            <nav class="settings-submenu">
                <Link
                    :href="route('designSystem.screenSettings')"
                    class="t-label-m settings-submenu__link"
                >Общие</Link>
                <Link
                    :href="route('designSystem.screenSettingsBilling')"
                    class="t-label-m settings-submenu__link"
                >Оплата</Link>
                <Link
                    :href="route('designSystem.screenSettingsReferral')"
                    class="t-label-m settings-submenu__link is-active"
                >Пригласи друга</Link>
            </nav>

            <!-- ─── Реферальная ссылка ─── -->
            <DsCard radius="lg" padding="--size-24" tag="section">
                <h2 class="t-heading-m section__title">Ваша реферальная ссылка</h2>
                <p class="t-body-s ref-lead">
                    Поделитесь ссылкой с друзьями. Когда они оплатят любой пакет, вы оба получите бонус на счёт.
                </p>

                <!-- Поле-ссылка + DsCopyButton -->
                <div class="ref-link">
                    <span class="t-body-s ref-link__value">{{ referralLink }}</span>
                    <DsCopyButton :text="referralLink" class="ref-link__copy" />
                </div>

                <p class="t-body-s ref-code">Промокод: <strong>{{ referralCode }}</strong></p>
            </DsCard>

            <!-- ─── Условия и награда ─── -->
            <DsCard radius="lg" padding="--size-24" tag="section">
                <h2 class="t-heading-m section__title">Как это работает</h2>
                <div class="ref-steps">
                    <div v-for="step in steps" :key="step.title" class="ref-step">
                        <span class="ref-step__ico" :class="step.icon" aria-hidden="true"></span>
                        <div class="ref-step__body">
                            <h3 class="t-label-m ref-step__title">{{ step.title }}</h3>
                            <p class="t-body-s ref-step__text">{{ step.text }}</p>
                        </div>
                    </div>
                </div>
            </DsCard>

            <!-- ─── Статистика приглашений ─── -->
            <DsCard radius="lg" padding="--size-24" tag="section">
                <h2 class="t-heading-m section__title">Статистика приглашений</h2>
                <div class="ref-stats">
                    <div v-for="stat in stats" :key="stat.label" class="ref-stat">
                        <span class="ref-stat__value">{{ stat.value }}</span>
                        <span class="t-body-s ref-stat__label">{{ stat.label }}</span>
                    </div>
                </div>
            </DsCard>

            <DsSupportFooter />
        </div>
    </DsAppShell>
</template>

<script setup>
import { Head, Link } from '@inertiajs/vue3';
import DsAppShell from '@/Components/Ds/DsAppShell.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsSupportFooter from '@/Components/Ds/DsSupportFooter.vue';
import DsCopyButton from '@/Components/Ds/DsCopyButton.vue';
import DsAccountMenu from '@/Components/Ds/DsAccountMenu.vue';

// Сайдбар — сверен с реальным Authenticated.vue.
const nav = [
    { key: 'dashboard', label: 'Дэшборд', icon: 'fm-layout', href: route('designSystem.screenDashboard') },
    { key: 'products', label: 'Товары', icon: 'fm-clipboard', href: route('designSystem.screenProducts') },
    { key: 'expenses', label: 'Расходы', icon: 'fm-credit-card', href: route('designSystem.screenExpenses') },
    { key: 'redeems', label: 'Самовыкупы', icon: 'fm-rotate-ccw', href: route('designSystem.screenRedeems') },
    { key: 'ads', label: 'Реклама', icon: 'fm-volume-2', href: route('designSystem.screenAdvertising') },
    { key: 'warehouse', label: 'Склад', icon: 'fm-archive', href: route('designSystem.screenWarehouse') },
    { key: 'settings', label: 'Настройки', icon: 'fm-settings', href: route('designSystem.screenSettings') },
];

const referralCode = 'SD-DEMO-2026';
const referralLink = 'https://sellerdata.ru/r/SD-DEMO-2026';

const steps = [
    { icon: 'fm-share-2', title: 'Поделитесь ссылкой', text: 'Отправьте реферальную ссылку друзьям-селлерам.' },
    { icon: 'fm-user-plus', title: 'Друг регистрируется', text: 'Друг создаёт аккаунт и подключает свой магазин.' },
    { icon: 'fm-gift', title: 'Вы оба получаете бонус', text: 'После первой оплаты — +1 месяц подписки каждому.' },
];

const stats = [
    { value: '8', label: 'Переходов по ссылке' },
    { value: '3', label: 'Регистраций' },
    { value: '2', label: 'Оплативших друзей' },
    { value: '2 мес.', label: 'Начислено бонусов' },
];
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

/* ── Каркас ── */
.brand { font-size: var(--font-size-body-s); font-weight: var(--font-weight-bold); color: var(--brand); }
.topbar { display: inline-flex; align-items: center; gap: var(--size-24); }
.topbar__page { color: var(--text-heading); }
.topbar__ico { color: var(--text-muted); font-size: var(--font-size-heading-m); cursor: pointer; }

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

/* ── Реферальная ссылка ── */
.ref-lead { color: var(--text-default); margin-bottom: var(--size-16); }
.ref-link {
    display: flex; align-items: center; gap: var(--size-12);
    padding: var(--size-12) var(--size-16);
    border: 1px solid var(--border-input); border-radius: var(--radius-md);
    background: var(--surface-subtle);
}
.ref-link__value { flex: 1 1 auto; color: var(--text-heading); word-break: break-all; }
.ref-link__copy { flex: 0 0 auto; }
.ref-code { color: var(--text-default); margin-top: var(--size-12); }
.ref-code strong { color: var(--text-heading); }

/* ── Шаги «Как это работает» ── */
.ref-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--size-16); }
.ref-step { display: flex; gap: var(--size-12); align-items: flex-start; }
.ref-step__ico {
    flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center;
    width: var(--size-40); height: var(--size-40); border-radius: var(--radius-md);
    background: var(--surface-subtle); color: var(--brand); font-size: var(--font-size-title-m);
}
.ref-step__body { display: flex; flex-direction: column; gap: var(--size-2); }
.ref-step__title { color: var(--text-heading); }
.ref-step__text { color: var(--text-default); }

/* ── Статистика ── */
.ref-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--size-16); }
.ref-stat {
    display: flex; flex-direction: column; gap: var(--size-4);
    padding: var(--size-16); border: 1px solid var(--border-default); border-radius: var(--radius-md);
    background: var(--surface-default);
}
.ref-stat__value { font-size: var(--font-size-heading-m); font-weight: var(--font-weight-bold); color: var(--text-heading); }
.ref-stat__label { color: var(--text-muted); }

@include respond-below(lg) {
    .ref-steps { grid-template-columns: 1fr; }
    .ref-stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
