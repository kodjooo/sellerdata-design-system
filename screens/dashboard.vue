<template>
    <Head title="Дэшборд — экран-эталон" />
    <DsAppShell :items="nav" active="dashboard">
        <template #logo><span class="brand">sellerdata</span></template>
        <template #title>
            <span class="topbar">
                <strong class="t-title-m topbar__page">Дэшборд</strong>
                <DsTabs v-model="view" :tabs="views" class="topbar__tabs" />
            </span>
        </template>
        <template #actions>
            <DsIconButton variant="ghost" icon="fm-help-circle" aria-label="Помощь" />
            <DsNotificationMenu :count="332" />
            <DsAccountMenu name="Демо аккаунт" active-id="wb" :stores="[{id:&apos;wb&apos;,name:&apos;Основной Магазин&apos;,dataSource:&apos;wildberries&apos;},{id:&apos;ozon&apos;,name:&apos;Дополнительный магазин&apos;,dataSource:&apos;ozon&apos;}]" />
        </template>

        <div class="screen">
            <!-- Вкладки Плитки/Диаграмма: на мобайле отдельной центрированной строкой (реал),
                 на десктопе — в топбаре рядом с заголовком (см. #title). -->
            <DsTabs v-model="view" :tabs="views" variant="segmented" class="screen__tabs-mobile" />

            <!-- Онбординг-баннер -->
            <DsNotice v-model:visible="hintOpen" tone="plain" collapse-mobile>
                <template #media><span class="hint-thumb" aria-hidden="true"></span></template>
                Используйте Панель инструментов для анализа ключевых показателей эффективности.
                Нажмите «Больше» в плитках периодов или стрелку справа в строке товара, чтобы увидеть
                подробный расчёт. Для детального анализа установите фильтр; вкладка «Диаграмма» — для
                графического отображения данных за выбранный период.
            </DsNotice>

            <!-- Верхний тулбар: поиск + фильтр + период (десктоп). Мобайл: уходит в воронку. -->
            <div class="bar">
                <DsSelect v-model="search" :options="searchOptions" placeholder="Товары" searchable multiple show-select-all class="bar__search">
                    <template #option="{ option }">
                        <DsProductCell :name="option.label" :sub="option.sub" />
                    </template>
                </DsSelect>
                <DsSelect v-model="country" :options="countries" placeholder="Все страны" :show-footer="false" class="bar__country" />
                <DsButton variant="secondary"><template #iconLeft>⚲</template>Фильтр</DsButton>
                <DsIconButton icon="fm-calendar" size="lg" aria-label="Период" class="bar__date" />
            </div>

            <!-- ВЕРХНИЙ БЛОК — переключается вкладками Плитки/Диаграмма -->
            <DsSummaryCarousel v-if="view === 'grid'" :items="periods" featured-first :card-columns="2">
                <template #tabs-action>
                    <DsIconButton icon="fm-filter" aria-label="Фильтр" @click="filterOpen = true" />
                </template>
            </DsSummaryCarousel>
            <div v-else class="chart">
                <DsCard radius="lg" class="chart__graph">
                    <DsChart :labels="chartLabels" :series="chartSeries" />
                </DsCard>
                <DsCard radius="lg" class="chart__sum">
                    <DsTabs v-model="sumTab" :tabs="sumTabs" />
                    <DsInfoList :items="summary" flat class="chart__sumlist" />
                </DsCard>
            </div>

            <!-- ТАБЛИЦА ТОВАРОВ — тулбар (табы/действия) ВХОДИТ в белую карточку таблицы (реал table-tabs) -->
            <DsCard radius="md" padding="--size-2" bleed-mobile>
                <div class="tbar">
                    <DsTabs v-model="metric" :tabs="metricTabs" />
                    <div class="tbar__right">
                        <button type="button" class="tbar__link fm-download"> Скачать таблицу (.xls)</button>
                        <span class="tbar__group">
                            <span class="tbar__group-label">Группировать по</span>
                            <DsPopover placement="bottom-end">
                                <button type="button" class="tbar__group-value">{{ group }}<span class="fm-chevron-down" aria-hidden="true"></span></button>
                                <template #content="{ close }">
                                    <div class="group-menu">
                                        <button
                                            v-for="g in groups"
                                            :key="g"
                                            type="button"
                                            class="group-menu__item"
                                            :class="{ 'is-active': g === group }"
                                            @click="group = g; close();"
                                        >{{ g }}</button>
                                    </div>
                                </template>
                            </DsPopover>
                        </span>
                    </div>
                </div>
                <DsTable
                    :columns="cols" :rows="rows" row-key="id" expandable default-sort-key="profit"
                    mobile-mode="compact" :mobile-columns="['name', 'lead', 'profit', 'info']" :mobile-detail="false"
                    group-key="isGroup"
                >
                    <template #cell-name="{ row }">
                        <span v-if="row.isGroup">{{ row.name }}</span>
                        <DsProductCell
                            v-else
                            :name="row.name"
                            :copy-id="row.isVariant ? '' : row.nm"
                            :detail="!row.isVariant"
                            :hide-thumb="row.isVariant"
                        />
                    </template>
                    <template #cell-profit="{ row }">
                        <span :class="neg(row.profit) ? 'neg' : 'pos'">{{ row.profit }}</span>
                    </template>
                    <template #cell-info>
                        <button type="button" class="more-btn fm-chevron-right" aria-label="Подробнее"></button>
                    </template>
                </DsTable>
            </DsCard>

            <div class="tfoot">
                <DsPagination :page="page" :total="690" :per-page="50" @change="p => page = p" />
            </div>

            <!-- Мобильный фильтр: full-screen лист (реал /dashboard мобайл — воронка) -->
            <DsFilterSheet
                v-model:visible="filterOpen"
                :items="filterItems"
                @reset="filterOpen = false"
                @apply="filterOpen = false"
            />
        </div>
    </DsAppShell>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import DsAppShell from '@/Components/Ds/DsAppShell.vue';
import DsSummaryCard from '@/Components/Ds/DsSummaryCard.vue';
import DsSummaryCarousel from '@/Components/Ds/DsSummaryCarousel.vue';
import DsTabs from '@/Components/Ds/DsTabs.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsChart from '@/Components/Ds/DsChart.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsIconButton from '@/Components/Ds/DsIconButton.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsTable from '@/Components/Ds/DsTable.vue';
import DsPagination from '@/Components/Ds/DsPagination.vue';
import DsProductCell from '@/Components/Ds/DsProductCell.vue';
import DsInfoList from '@/Components/Ds/DsInfoList.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';
import DsAccountMenu from '@/Components/Ds/DsAccountMenu.vue';
import DsNotificationMenu from '@/Components/Ds/DsNotificationMenu.vue';
import DsFilterSheet from '@/Components/Ds/DsFilterSheet.vue';
import DsPopover from '@/Components/Ds/DsPopover.vue';

// Иконки сверены с реальным сайдбаром (Authenticated.vue).
const nav = [
    { key: 'dashboard', label: 'Дэшборд', icon: 'fm-layout', href: route('designSystem.screenDashboard') },
    { key: 'products', label: 'Товары', icon: 'fm-clipboard', href: route('designSystem.screenProducts') },
    { key: 'expenses', label: 'Расходы', icon: 'fm-credit-card', href: route('designSystem.screenExpenses') },
    { key: 'redeems', label: 'Самовыкупы', icon: 'fm-rotate-ccw', href: route('designSystem.screenRedeems') },
    { key: 'ads', label: 'Реклама', icon: 'fm-volume-2', href: route('designSystem.screenAdvertising') },
    { key: 'warehouse', label: 'Склад', icon: 'fm-archive', href: route('designSystem.screenWarehouse') },
    { key: 'settings', label: 'Настройки', icon: 'fm-settings', href: route('designSystem.screenSettings') , submenu: [{ label: 'Общие', href: route('designSystem.screenSettings') }, { label: 'Оплата', href: route('designSystem.screenSettingsBilling') }, { label: 'Пригласи друга', href: route('designSystem.screenSettingsReferral') }] },
];

const hintOpen = ref(true);
const view = ref('grid');
const views = [{ key: 'grid', label: 'Плитки', icon: 'fm-grid' }, { key: 'chart', label: 'Диаграмма', icon: 'fm-trending-up' }];
const search = ref([]);
const searchOptions = [
    { value: 'd1', label: 'Капли для носа', sub: '200405 / NOSE-01' },
    { value: 'd2', label: 'Масло для массажа', sub: '325546 / OIL-02' },
    { value: 'd3', label: 'Маска для сна', sub: '116018 / MASK-03' },
    { value: 'd4', label: 'Соска-пустышка', sub: '156004 / SOSKA-01' },
    { value: 'd5', label: 'Штора для душа', sub: '202301 / SHTORA-02' },
];
const country = ref(null);
const countries = ['Все страны', 'Россия', 'Беларусь', 'Казахстан', 'Армения', 'Киргизия'];

// Мобильный фильтр (full-screen лист): поиск/страна/фильтр/период с десктоп-тулбара.
const filterOpen = ref(false);
const filterItems = [
    { key: 'search', label: 'Товары', icon: 'fm-calendar' },
    { key: 'country', label: 'Все страны', icon: 'fm-globe' },
    { key: 'filter', label: 'Фильтр', icon: 'fm-filter' },
    { key: 'period', label: 'Период', icon: 'fm-box' },
];

// ── Период-карточки (реальные числа account 4) ──
const periods = [
    { title: 'Сегодня', subtitle: '11.06.2026', gradient: 'blue', footerText: 'Больше', metrics: pm('176 196,45 ₽ / 89 шт.', '173 750,93 ₽ / 110 шт.', '−3 637,89 ₽ / 1 шт.', '122 928,35 ₽', '88 038,35 ₽') },
    { title: 'Вчера', subtitle: '10.06.2026', gradient: 'muted', footerText: 'Больше', metrics: pm('173 322,34 ₽ / 84 шт.', '215 723,77 ₽ / 104 шт.', '−2 541,00 ₽ / 2 шт.', '101 676,38 ₽', '84 747,10 ₽') },
    { title: 'Текущий месяц', subtitle: '01.06.2026 до 11.06.2026', gradient: 'indigo-deep', icon: 'info', footerText: 'Больше', metrics: pm('2 092 470,19 ₽ / 1012 шт.', '2 356 778,09 ₽ / 1197 шт.', '−60 339,70 ₽ / 29 шт.', '1 190 513,03 ₽', '988 134,74 ₽') },
    { title: 'Прошлый месяц', subtitle: '01.05.2026 до 31.05.2026', gradient: 'periwinkle', footerText: 'Больше', metrics: pm('5 153 549,38 ₽ / 2729 шт.', '5 933 740,81 ₽ / 3130 шт.', '−278 682,95 ₽ / 134 шт.', '2 632 463,60 ₽', '2 141 283,49 ₽') },
];
function pm(sales, orders, refunds, payout, profit) {
    return [
        { label: 'Продажи', value: sales }, { label: 'Заказы', value: orders }, { label: 'Возвраты', value: refunds },
        { label: 'Сумма выплат', value: payout, info: true }, { label: 'Прибыль', value: profit, info: true },
    ];
}

// ── Диаграмма + сводка ──
const sumTab = ref('month');
const sumTabs = [{ key: 'month', label: '1–11 Июнь 2026' }, { key: 'all', label: 'Весь период' }];
const chartLabels = ['Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь'];
const chartSeries = [
    { name: 'Заказано', type: 'line', axis: 'right', color: '--chart-blue', values: [0, 5000, 5500, 1500, 6000, 4600, 3700, 3200, 4900, 5800, 5900, 1900] },
    { name: 'Продано', type: 'line', axis: 'right', color: '--chart-green', values: [0, 7000, 6300, 5000, 4600, 4200, 2900, 2800, 4900, 4900, 4600, 1700] },
    { name: 'Возвращено', type: 'line', axis: 'right', color: '--chart-red', values: [0, 200, 150, 220, 180, 160, 140, 120, 180, 200, 190, 80] },
    { name: 'Продажи', type: 'bar', axis: 'left', color: '--chart-purple-light', values: [0, 24000000, 19000000, 13500000, 15500000, 16500000, 12500000, 9000000, 7500000, 10500000, 10000000, 3500000] },
    { name: 'Прибыль', type: 'bar', axis: 'left', color: '--chart-pink', values: [0, 12000000, 9500000, 6500000, 6500000, 6500000, 4500000, 3500000, 1500000, 4200000, 4000000, 1300000] },
];
const summary = [
    { label: 'Продажи', value: '3 273 560,23 ₽', children: [{ label: 'Количество товаров', value: '1 332' }, { label: 'Продажи со скидкой', value: '3 273 560,23 ₽' }] },
    { label: 'Возвраты', value: '−88 357,00 ₽', children: [{ label: 'Количество возвратов', value: '38' }] },
    { label: 'Удержания', value: '−1 681 132,55 ₽', children: [{ label: 'Логистика', value: '−1 184 200,00 ₽' }, { label: 'Комиссия', value: '−496 932,55 ₽' }] },
    { label: 'Реклама', value: '−6 909,26 ₽', children: [{ label: 'Авто-реклама', value: '−6 909,26 ₽' }] },
    { label: 'Себестоимость', value: '−1 600,00 ₽', info: true },
    { label: 'Валовая прибыль', value: '1 495 561,42 ₽' },
    { label: 'Расходы', value: '0,00 ₽' },
    { label: 'НДС', value: '−85 428,07 ₽' },
    { label: 'Налог на доход', value: '−102 513,68 ₽' },
    { label: 'Прибыль', value: '1 307 619,67 ₽', strong: true },
    { label: 'Сумма выплат', value: '1 481 379,86 ₽' },
    { label: 'Маржа', value: '41,05 %', bg: true },
    { label: 'ROI', value: '81 726,23 %', bg: true, info: true },
    { label: 'ДРР', value: '0,21 %', bg: true },
    { label: 'Выкупаемость', value: '90,86 %', bg: true },
];

// ── Таблица товаров ──
const metric = ref('orders');
const metricTabs = [{ key: 'sales', label: 'Продажи' }, { key: 'orders', label: 'Заказы' }];
const group = ref('Артикулу');
const groups = ['Не группировать', 'Артикулу', 'Бренду'];
const page = ref(1);

// Колонки зависят от вкладки Продажи/Заказы (реал: «Продажи» — полный набор).
const baseCols = [
    { key: 'name', label: 'Товар', width: '22%' },
    { key: 'lead', label: 'Заказано', numeric: true, sortable: true },          // переопределяется
    { key: 'returned', label: 'Возвращено', numeric: true, sortable: true },
    { key: 'sales', label: 'Продажи', numeric: true, sortable: true },
    { key: 'refunds', label: 'Возвраты', numeric: true, sortable: true },
    { key: 'deduction', label: 'Удержания', numeric: true, sortable: true },
    { key: 'ads', label: 'Реклама', numeric: true, sortable: true },
    { key: 'profit', label: 'Прибыль', numeric: true, sortable: true },
    { key: 'profitUnit', label: 'Прибыль на ед.', numeric: true, sortable: true },
    { key: 'margin', label: 'Маржа', numeric: true, sortable: true },
    { key: 'roi', label: 'ROI', numeric: true, sortable: true },
    { key: 'drr', label: 'ДРР', numeric: true, sortable: true },
    { key: 'redemption', label: 'Выкупаемость', numeric: true, sortable: true },
    { key: 'info', label: 'Инфо', align: 'center', width: 'var(--size-48)' },
];
const cols = computed(() => {
    const lead = { ...baseCols[1], label: metric.value === 'orders' ? 'Заказано' : 'Продано' };
    if (metric.value === 'orders') {
        // Заказы: без Реклама/Маржа/ROI/ДРР/Выкупаемость
        const drop = new Set(['ads', 'margin', 'roi', 'drr', 'redemption']);
        return [baseCols[0], lead, ...baseCols.slice(2).filter((c) => !drop.has(c.key))];
    }
    return [baseCols[0], lead, ...baseCols.slice(2)];
});

const products = [
    { id: 1, name: 'Капли для носа', nm: '200405', lead: '60', returned: '2', sales: '0,00 ₽', refunds: '−598,00 ₽', deduction: '−3 845,15 ₽', ads: '0,00 ₽', profit: '6 928,46 ₽', profitUnit: '177,65 ₽', margin: '64,82 %', roi: '291,06 %', drr: '0,00 %', redemption: '96,7 %',
      children: [
        { id: '1a', isVariant: true, name: 'Размер S', lead: '28', returned: '1', sales: '0,00 ₽', refunds: '−299,00 ₽', deduction: '−1 922,00 ₽', ads: '0,00 ₽', profit: '3 460,00 ₽', profitUnit: '178,00 ₽', margin: '64,8 %', roi: '290,0 %', drr: '0,00 %', redemption: '96,4 %' },
        { id: '1b', isVariant: true, name: 'Размер M', lead: '32', returned: '1', sales: '0,00 ₽', refunds: '−299,00 ₽', deduction: '−1 923,15 ₽', ads: '0,00 ₽', profit: '3 468,46 ₽', profitUnit: '177,30 ₽', margin: '64,9 %', roi: '292,0 %', drr: '0,00 %', redemption: '97,0 %' },
      ] },
    { id: 2, name: 'Масло для массажа', nm: '325546', lead: '71', returned: '0', sales: '0,00 ₽', refunds: '0,00 ₽', deduction: '−21 923,60 ₽', ads: '0,00 ₽', profit: '16 825,92 ₽', profitUnit: '431,43 ₽', margin: '64,35 %', roi: '210,4 %', drr: '0,00 %', redemption: '98,1 %' },
    { id: 3, name: 'Маска для сна', nm: '116018', lead: '61', returned: '0', sales: '0,00 ₽', refunds: '0,00 ₽', deduction: '−2 235,38 ₽', ads: '0,00 ₽', profit: '4 027,31 ₽', profitUnit: '149,16 ₽', margin: '64,82 %', roi: '188,2 %', drr: '0,00 %', redemption: '95,3 %' },
    { id: 4, name: 'Соска-пустышка', nm: '156004', lead: '33', returned: '0', sales: '0,00 ₽', refunds: '0,00 ₽', deduction: '−29 895,15 ₽', ads: '0,00 ₽', profit: '28 026,09 ₽', profitUnit: '1 077,93 ₽', margin: '64,29 %', roi: '171,0 %', drr: '0,00 %', redemption: '94,9 %' },
    { id: 5, name: 'Штора для душа', nm: '702202', lead: '28', returned: '0', sales: '0,00 ₽', refunds: '0,00 ₽', deduction: '−19 288,96 ₽', ads: '0,00 ₽', profit: '19 215,98 ₽', profitUnit: '768,64 ₽', margin: '64,40 %', roi: '180,5 %', drr: '0,00 %', redemption: '93,1 %' },
];

// Группировка по бренду: строки-группы с суммой и раскрытием в товары (реал «Группировать по бренду»).
const brandGroups = [
    { id: 'g1', isGroup: true, name: 'BRAND6a0c481f9bee', lead: '69', returned: '0', sales: '122 924,79 ₽', refunds: '0,00 ₽', deduction: '−35 626,74 ₽', ads: '0,00 ₽', profit: '69 564,73 ₽', profitUnit: '1 008,18 ₽', margin: '56,59 %', roi: '2 910,66 %', drr: '0,00 %', redemption: '95,1 %',
      children: products.slice(0, 3) },
    { id: 'g2', isGroup: true, name: 'BRAND6a0c481f9f0f', lead: '8', returned: '1', sales: '17 087,60 ₽', refunds: '−3 637,89 ₽', deduction: '−3 496,92 ₽', ads: '0,00 ₽', profit: '8 674,53 ₽', profitUnit: '1 239,22 ₽', margin: '64,50 %', roi: '248,0 %', drr: '0,00 %', redemption: '90,0 %',
      children: products.slice(3, 5) },
    { id: 'g3', isGroup: true, name: 'Нет бренда', lead: '3', returned: '0', sales: '9 380,00 ₽', refunds: '0,00 ₽', deduction: '−2 720,20 ₽', ads: '0,00 ₽', profit: '6 050,44 ₽', profitUnit: '2 016,81 ₽', margin: '64,50 %', roi: '222,4 %', drr: '0,00 %', redemption: '88,0 %',
      children: products.slice(1, 3) },
];

// Итоговый набор строк зависит от выбора «Группировать по».
const rows = computed(() => (group.value === 'Бренду' ? brandGroups : products));

function neg(v) { return typeof v === 'string' && v.includes('−'); }
</script>

<style scoped>
/* ── Каркас: лого / топбар / аккаунт ── */
.brand { font-size: var(--font-size-body-s); font-weight: var(--font-weight-bold); color: var(--brand); }
/* Заголовок + вкладки прижаты к низу топбара: подчёркивание вкладок — по нижней линии (реал) */
.topbar { display: inline-flex; align-self: stretch; align-items: flex-end; gap: var(--size-24); }
.topbar__page { color: var(--text-heading); padding-bottom: var(--size-8); }
.topbar__tabs { margin-bottom: calc(var(--size-20) * -1); }
.topbar__ico { color: var(--text-muted); font-size: var(--font-size-heading-m); cursor: pointer; }

/* Без своего паддинга — отступ страницы задаёт AppShell content. */
.screen { display: flex; flex-direction: column; gap: var(--size-16); }

.hint-thumb { display: block; width: 96px; height: 56px; border-radius: var(--radius-sm); background: var(--brand-gradient); }

/* Вкладки Плитки/Диаграмма: десктоп — в топбаре, мобайл — отдельная центрированная строка */
.screen__tabs-mobile { display: none; }
@media (max-width: 767.98px) {
    .topbar__tabs { display: none; }
    .screen__tabs-mobile { display: flex; justify-content: center; }
}

/* Верхний тулбар */
.bar { display: flex; align-items: center; gap: var(--size-16); }
.bar__search { flex: 1 1 auto; max-width: 640px; }
.bar__country { width: 140px; max-width: 100%; }
/* Кнопка периода — круглая 48×48 (реал dashboard-nav__btn: 50%, brand) */
.bar__date { width: var(--size-48); height: var(--size-48); border: 0; border-radius: var(--radius-full); background: var(--brand); color: var(--white); cursor: pointer; margin-left: auto; display: inline-flex; align-items: center; justify-content: center; }
/* Мобайл: тулбар поиска/фильтра/периода уходит в воронку (в ряду табов сводки) */
@media (max-width: 767.98px) { .bar { display: none; } }

/* Круглая воронка в ряду табов сводки (видна на мобайле через #tabs-action) */
.bar__funnel {
    width: var(--control-height-md); height: var(--control-height-md);
    border: 0; border-radius: var(--radius-full);
    background: var(--brand); color: var(--white); cursor: pointer;
}

.periods { display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--size-128) * 2), 1fr)); gap: var(--size-16); }
.more { display: inline-block; padding: 1px 0; border: 0; border-bottom: 1px dashed var(--brand); background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; }

.chart { display: grid; grid-template-columns: 1fr; gap: var(--size-16); }
@media (min-width: 992px) { .chart { grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); align-items: start; } }
.chart__sumlist { margin-top: var(--size-12); }

/* Тулбар таблицы — входит в белую карточку таблицы (реал table-tabs): ряд с разделителем снизу */
.tbar { display: flex; align-items: center; justify-content: space-between; gap: var(--size-16); flex-wrap: wrap; padding: 0 var(--size-12); border-bottom: 1px solid var(--border-default); }
.tbar__right { display: flex; align-items: center; gap: var(--size-16); flex-wrap: wrap; }
.tbar__link { border: 0; background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; display: inline-flex; align-items: center; gap: var(--size-4); }
/* «Группировать по <значение>» — label + значение-ссылка (реал: без рамки, не селект) */
.tbar__group { display: inline-flex; align-items: center; gap: var(--size-4); font-size: var(--font-size-body-s); }
.tbar__group-label { color: var(--text-default); }
.tbar__group-value { border: 0; background: transparent; color: var(--brand); font-size: var(--font-size-body-s); cursor: pointer; display: inline-flex; align-items: center; gap: var(--size-4); }
/* Меню выбора группировки (поповер) */
.group-menu { display: flex; flex-direction: column; min-width: calc(var(--size-128) * 1.2); }
.group-menu__item { display: block; width: 100%; padding: var(--size-8) var(--size-12); border: 0; border-radius: var(--radius-sm); background: transparent; color: var(--text-default); text-align: left; cursor: pointer; font-size: var(--font-size-body-s); }
.group-menu__item:hover { background: var(--surface-muted); }
.group-menu__item.is-active { color: var(--brand); font-weight: var(--font-weight-semibold); }

.more-btn { border: 0; background: transparent; color: var(--text-muted); font-size: var(--font-size-title-m); line-height: 1; cursor: pointer; }
.more-btn:hover { color: var(--brand); }
.pos { color: var(--accent-positive); }
.neg { color: var(--status-danger); }
.tfoot { display: flex; justify-content: center; }
</style>
