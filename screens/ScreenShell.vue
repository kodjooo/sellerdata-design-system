<template>
    <!--
        ScreenShell — ЦЕЛЬНЫЙ каркас экранов-эталонов: единые сайдбар + хедер для ВСЕХ
        страниц /design-system/screens/*. Логотип, пункты меню (nav), правые действия
        топбара (Помощь/уведомления/аккаунт) и стиль заголовка зашиты здесь, чтобы не
        дублироваться и не «съезжать» по экранам.

        Экран задаёт только:
          • active  — ключ активного пункта меню (dashboard/products/…);
          • title   — заголовок страницы в топбаре;
          • #tabs    — (опц.) вкладки рядом с заголовком (напр. Плитки/Диаграмма);
          • #actions — (опц.) переопределить правые действия топбара;
          • default  — содержимое страницы.
    -->
    <DsAppShell :items="nav" :active="active">
        <template #logo><span class="brand">sellerdata</span></template>
        <template #title>
            <span class="topbar">
                <strong class="t-title-m topbar__page">{{ title }}</strong>
                <slot name="tabs" />
            </span>
        </template>
        <template #actions>
            <slot name="actions">
                <DsHelpMenu />
                <DsNotificationMenu :count="332" />
                <DsAccountMenu name="Демо аккаунт" active-id="wb" :stores="stores" />
            </slot>
        </template>

        <slot />

        <!-- Глобальный футер поддержки (реал: под контентом на всех страницах ЛК). -->
        <footer class="screen-foot t-body-s">
            По любым вопросам пишите нам на:<br>
            <a class="screen-foot__link" href="mailto:support@sellerdata.ru">support@sellerdata.ru</a>
            или в <a class="screen-foot__link" href="https://t.me/sellerdata" target="_blank" rel="noopener">Telegram</a>
        </footer>

        <!-- Нижний закреплённый бар действий (реал buttons-panel) — fixed у нижнего края экрана.
             Спейсер резервирует место, чтобы фикс-бар не перекрывал футер/контент. -->
        <div v-if="$slots.bottombar" class="screen-bottombar-spacer" aria-hidden="true"></div>
        <slot name="bottombar" />
    </DsAppShell>
</template>

<script setup>
import DsAppShell from '@/Components/Ds/DsAppShell.vue';
import DsHelpMenu from '@/Components/Ds/DsHelpMenu.vue';
import DsNotificationMenu from '@/Components/Ds/DsNotificationMenu.vue';
import DsAccountMenu from '@/Components/Ds/DsAccountMenu.vue';

defineProps({
    // Ключ активного пункта меню (dashboard | products | expenses | redeems | ads | warehouse | settings).
    active: { type: String, default: '' },
    // Заголовок страницы в топбаре.
    title: { type: String, default: '' },
});

// Единый список магазинов аккаунт-меню (демо-данные для эталонов).
const stores = [
    { id: 'wb', name: 'Основной Магазин', dataSource: 'wildberries' },
    { id: 'ozon', name: 'Дополнительный магазин', dataSource: 'ozon' },
];

// Единые пункты меню (иконки сверены с реальным сайдбаром Authenticated.vue).
const nav = [
    { key: 'dashboard', label: 'Дэшборд', icon: 'fm-layout', href: route('designSystem.screenDashboard') },
    { key: 'products', label: 'Товары', icon: 'fm-clipboard', href: route('designSystem.screenProducts') },
    { key: 'expenses', label: 'Расходы', icon: 'fm-credit-card', href: route('designSystem.screenExpenses') },
    { key: 'redeems', label: 'Самовыкупы', icon: 'fm-rotate-ccw', href: route('designSystem.screenRedeems') },
    { key: 'ads', label: 'Реклама', icon: 'fm-volume-2', href: route('designSystem.screenAdvertising') },
    { key: 'warehouse', label: 'Склад', icon: 'fm-archive', href: route('designSystem.screenWarehouse') },
    {
        key: 'settings', label: 'Настройки', icon: 'fm-settings', href: route('designSystem.screenSettings'),
        submenu: [
            { label: 'Общие', href: route('designSystem.screenSettings') },
            { label: 'Оплата', href: route('designSystem.screenSettingsBilling') },
            { label: 'Пригласи друга', href: route('designSystem.screenSettingsReferral') },
        ],
    },
];
</script>

<style scoped>
/* Логотип в rail */
.brand { font-size: var(--font-size-body-s); font-weight: var(--font-weight-bold); color: var(--brand); }

/* Заголовок и вкладки: ТЕКСТ по центру топбара, а подчёркивание активной вкладки —
   на нижней линии топбара (как в реале: .header-tabs ::after на границе .auth_row). */
.topbar { display: flex; align-items: stretch; gap: var(--size-24); height: 100%; }
.topbar__page { color: var(--text-heading); align-self: center; }
/* Вкладки во всю высоту топбара: текст центрируется, низ — у границы. */
.topbar :deep(.ds-tabs) { align-self: stretch; align-items: stretch; border-bottom: 0; }
.topbar :deep(.ds-tabs__tab) { align-items: center; padding-top: 0; padding-bottom: 0; }
/* Подчёркивание опускаем на нижнюю границу топбара (компенсируем нижний паддинг топбара). */
.topbar :deep(.ds-tabs__tab::after) { bottom: calc(var(--size-12) * -1); }

@media (max-width: 767.98px) {
    .topbar :deep(.topbar__tabs) { display: none; }
}

/* Глобальный футер поддержки — серый текст по центру (реал .footer-support). */
.screen-foot {
    /* Полная ширина контента + центрирование (гасим внешний margin-left глобального CSS). */
    width: 100%;
    margin: 0;                    /* отступ сверху даёт gap .screen — лишний margin убран (реал) */
    padding: var(--size-12) 0;
    text-align: center;
    color: var(--text-default);   /* реал .footer-support rgb(85,85,85) */
}
.screen-foot__link { color: var(--brand); text-decoration: none; }
.screen-foot__link:hover { text-decoration: underline; }

/* Резерв высоты под фиксированный нижний бар (DsStickyBar fixed), чтобы он не перекрывал контент. */
.screen-bottombar-spacer { height: var(--size-64); }
</style>
