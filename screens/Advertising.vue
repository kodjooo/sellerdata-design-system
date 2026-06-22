<template>
    <Head title="Реклама — экран-эталон" />
    <DsAppShell :items="nav" active="ads">
        <template #logo><span class="brand">sellerdata</span></template>
        <template #title>
            <span class="topbar">
                <strong class="t-title-m topbar__page">Реклама</strong>
                <DsTabs v-model="tab" :tabs="tabs" class="topbar__tabs" />
            </span>
        </template>
        <template #actions>
            <span class="fm-help-circle topbar__ico" aria-hidden="true"></span>
            <span class="fm-bell topbar__ico" aria-hidden="true"></span>
            <DsAccountBadge name="Демо аккаунт" store="Дополнительный магазин" />
        </template>

        <div class="screen">
            <!-- Онбординг-баннер раздела -->
            <DsNotice v-model:visible="hintOpen" tone="plain" collapse-mobile>
                <template #media><span class="hint-thumb" aria-hidden="true"></span></template>
                Раздел для аналитики рекламных кампаний Wildberries. Здесь будут отображаться
                все ваши товарные и медийные кампании, фильтры по товарам, кампаниям, типам и
                статусам, а также детализация по площадкам, продуктам и датам. Раскрывайте строки,
                чтобы увидеть подробную статистику.
            </DsNotice>

            <!-- Тулбар фильтров: товары / кампании / типы / статусы + фильтр/сброс.
                 Мобайл: селекты уходят в воронку (full-screen фильтр). -->
            <div class="bar">
                <DsSelect v-model="fProducts" :options="[]" placeholder="Товары" searchable class="bar__select bar__desktop-only" />
                <DsSelect v-model="fCampaigns" :options="[]" placeholder="Кампании" searchable class="bar__select bar__desktop-only" />
                <DsSelect v-model="fTypes" :options="typeOptions" placeholder="Все типы" class="bar__select bar__select_sm bar__desktop-only" />
                <DsSelect v-model="fStatuses" :options="statusOptions" placeholder="Все статусы" class="bar__select bar__select_sm bar__desktop-only" />
                <DsButton variant="secondary" class="bar__desktop-only"><template #iconLeft>⚲</template>Фильтр</DsButton>
                <DsIconButton icon="fm-filter" aria-label="Фильтр" class="bar__mobile-only" @click="filterOpen = true" />
            </div>

            <!-- МНОГОУРОВНЕВАЯ ТАБЛИЦА: кампания → товар → дата -->
            <DsCard radius="md" padding="--size-2">
                <DsTable
                    :columns="cols"
                    :rows="rows"
                    row-key="id"
                    expandable
                    mobile-mode="compact"
                    :mobile-columns="['campaign', 'totalBudget']"
                    detail-title="Кампания"
                >
                    <!-- Первая колонка: уровень определяет вид (кампания/товар/дата) -->
                    <template #cell-campaign="{ row }">
                        <!-- Кампания (lvl-0) -->
                        <span v-if="row.kind === 'campaign'" class="camp">
                            <DsTag v-if="row.status" variant="soft" :tone="statusTone(row.status)" class="camp__tag">{{ row.status }}</DsTag>
                            <span class="camp__title t-body-s">{{ row.name }}</span>
                            <span class="camp__meta t-caption">
                                <DsCopyButton :text="row.advertId" />
                                <span>ID {{ row.advertId }}</span>
                                <span v-if="row.period">&nbsp;/ {{ row.period }}</span>
                                <span v-if="row.type">&nbsp;/ {{ row.type }}</span>
                            </span>
                        </span>
                        <!-- Товар (lvl-1) -->
                        <span v-else-if="row.kind === 'product'" class="prod">
                            <span class="prod__thumb" aria-hidden="true"></span>
                            <span class="prod__body">
                                <span class="prod__title t-body-s">{{ row.name }}</span>
                                <span class="prod__meta t-caption">
                                    <DsCopyButton :text="row.nmId" />
                                    <span>{{ row.nmId }}</span>
                                    <span v-if="row.article">&nbsp;/ {{ row.article }}</span>
                                    <span v-if="row.barcode">&nbsp;/ {{ row.barcode }}</span>
                                </span>
                            </span>
                        </span>
                        <!-- Дата (lvl-2) -->
                        <span v-else class="date t-body-s">{{ row.name }}</span>
                    </template>

                    <template #cell-drrOrders="{ value }">
                        <span :class="dim(value)">{{ value }}</span>
                    </template>
                    <template #cell-drrSales="{ value }">
                        <span :class="dim(value)">{{ value }}</span>
                    </template>
                </DsTable>
            </DsCard>

            <div class="tfoot">
                <DsPagination :page="page" :total="120" :per-page="20" @change="p => page = p" />
            </div>

            <!-- Мобильный фильтр: full-screen лист (реал /advertising мобайл — воронка) -->
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
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import DsAppShell from '@/Components/Ds/DsAppShell.vue';
import DsTabs from '@/Components/Ds/DsTabs.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsIconButton from '@/Components/Ds/DsIconButton.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsTable from '@/Components/Ds/DsTable.vue';
import DsTag from '@/Components/Ds/DsTag.vue';
import DsCopyButton from '@/Components/Ds/DsCopyButton.vue';
import DsPagination from '@/Components/Ds/DsPagination.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';
import DsFilterSheet from '@/Components/Ds/DsFilterSheet.vue';
import DsAccountBadge from '@/Components/Ds/DsAccountBadge.vue';

// Сайдбар — те же иконки, что и в Dashboard-эталоне (сверены с Authenticated.vue).
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
const tab = ref('products');
const tabs = [{ key: 'products', label: 'Товары' }, { key: 'media', label: 'Медийная' }];

// Фильтры (визуальный каркас тулбара — как в реале WB).
const fProducts = ref(null);
const fCampaigns = ref(null);
const fTypes = ref(null);
const fStatuses = ref(null);

// Мобильный фильтр (full-screen лист): селекты с десктоп-тулбара.
const filterOpen = ref(false);
const filterItems = [
    { key: 'products', label: 'Товары', icon: 'fm-calendar' },
    { key: 'campaigns', label: 'Кампании', icon: 'fm-volume-2' },
    { key: 'types', label: 'Все типы', icon: 'fm-box' },
    { key: 'statuses', label: 'Все статусы', icon: 'fm-filter' },
];
const typeOptions = ['Авто-кампания', 'Аукцион', 'Поиск + Каталог'];
const statusOptions = ['Идут показы', 'Пауза', 'Завершено'];
const page = ref(1);

// Колонки WB (реальный orderedHeaders для wildberries). numeric → узкие правые.
const cols = [
    { key: 'campaign', label: 'Рекламная кампания', width: 'calc(var(--size-128) * 2)' },
    { key: 'totalBudget', label: 'Бюджет кампании', numeric: true },
    { key: 'dailyBudget', label: 'Дневной бюджет', numeric: true },
    { key: 'views', label: 'Просмотры', numeric: true },
    { key: 'clicks', label: 'Клики', numeric: true },
    { key: 'ctr', label: 'CTR', numeric: true },
    { key: 'cpc', label: 'Стоимость клика', numeric: true },
    { key: 'sum', label: 'Затраты', numeric: true },
    { key: 'atbs', label: 'Корзина', numeric: true },
    { key: 'orders', label: 'Заказов', numeric: true },
    { key: 'cr', label: 'CR', numeric: true },
    { key: 'shks', label: 'Заказано, шт.', numeric: true },
    { key: 'sumPrice', label: 'Сумма заказов', numeric: true },
    { key: 'drrOrders', label: 'ДРР заказов', numeric: true },
    { key: 'salesForecast', label: 'Прогноз продаж', numeric: true },
    { key: 'drrSales', label: 'ДРР продаж', numeric: true },
    { key: 'profitForecast', label: 'Прогноз прибыли', numeric: true },
    { key: 'avgPosition', label: 'Средняя позиция товара', numeric: true },
];

// Хелпер строки кампании (реальные числа account 4, WB, из живого /advertising).
function campaign(o) {
    return { kind: 'campaign', dailyBudget: '0 ₽', ...o };
}

// Дочерние даты раскрытой кампании от 19.06.2026 (реальные значения из DOM).
const dates1 = [
    { id: 'd1', kind: 'date', name: '22.06.2026', totalBudget: '-', dailyBudget: '-', views: '2', clicks: '0', ctr: '0%', cpc: '-', sum: '0,55 ₽', atbs: '0', orders: '0', cr: '-', shks: '0', sumPrice: '0 ₽', drrOrders: '-', salesForecast: '-', drrSales: '-', profitForecast: '-', avgPosition: '-' },
    { id: 'd2', kind: 'date', name: '21.06.2026', totalBudget: '-', dailyBudget: '-', views: '1 191', clicks: '29', ctr: '2,43%', cpc: '11,28 ₽', sum: '327,09 ₽', atbs: '1', orders: '1', cr: '3,45%', shks: '1', sumPrice: '2 773 ₽', drrOrders: '11,8%', salesForecast: '-', drrSales: '-', profitForecast: '-', avgPosition: '-' },
    { id: 'd3', kind: 'date', name: '20.06.2026', totalBudget: '-', dailyBudget: '-', views: '2 838', clicks: '76', ctr: '2,68%', cpc: '10,26 ₽', sum: '779,68 ₽', atbs: '4', orders: '2', cr: '2,63%', shks: '2', sumPrice: '5 546 ₽', drrOrders: '14,06%', salesForecast: '-', drrSales: '-', profitForecast: '-', avgPosition: '18' },
];

// Товары раскрытой кампании от 19.06.2026 (lvl-1, реальные значения).
const products1 = [
    { id: 'p1', kind: 'product', name: 'MIRA.bell’ / Платье штапель больших размеров', nmId: '1025722602', article: 'Платье_01', barcode: '2051232497562', totalBudget: '-', dailyBudget: '-', views: '7 560', clicks: '197', ctr: '2,61%', cpc: '10,51 ₽', sum: '2 070,77 ₽', atbs: '6', orders: '3', cr: '1,52%', shks: '3', sumPrice: '8 319 ₽', drrOrders: '24,89%', salesForecast: '-', drrSales: '-', profitForecast: '-', avgPosition: '23', children: dates1 },
    { id: 'p2', kind: 'product', name: 'MIRA.bell’ / Платье штапель больших размеров', nmId: '1025722603', article: 'Платье_02', barcode: '2051232589359', totalBudget: '-', dailyBudget: '-', views: '0', clicks: '0', ctr: '-', cpc: '-', sum: '0 ₽', atbs: '3', orders: '0', cr: '-', shks: '0', sumPrice: '0 ₽', drrOrders: '-', salesForecast: '-', drrSales: '-', profitForecast: '-', avgPosition: '-' },
];

// Кампании (lvl-0) — реальные данные WB account 4.
const rows = [
    campaign({ id: 'c1', status: 'Пауза', name: 'Кампания от 19.06.2026', advertId: '37520799', period: '19.06.2026', type: 'Оплата за показы. Ручная ставка', totalBudget: '1 038 ₽', views: '7 560', clicks: '197', ctr: '2,61%', cpc: '10,51 ₽', sum: '2 070,77 ₽', atbs: '9', orders: '3', cr: '1,52%', shks: '3', sumPrice: '8 319 ₽', drrOrders: '24,89%', salesForecast: '-', drrSales: '-', profitForecast: '-', avgPosition: '-', children: products1 }),
    campaign({ id: 'c2', status: 'Пауза', name: 'Кампания от 19.06.2026', advertId: '37520782', period: '19.06.2026', type: 'Оплата за показы. Ручная ставка', totalBudget: '1 506 ₽', views: '1 183', clicks: '36', ctr: '3,04%', cpc: '13,78 ₽', sum: '496,19 ₽', atbs: '1', orders: '0', cr: '0%', shks: '0', sumPrice: '0 ₽', drrOrders: '-', salesForecast: '-', drrSales: '-', profitForecast: '-', avgPosition: '-' }),
    campaign({ id: 'c3', status: 'Пауза', name: 'Кампания от 13.06.2026', advertId: '37375086', period: '13.06.2026', type: 'Оплата за показы. Ручная ставка', totalBudget: '1 413 ₽', views: '9 046', clicks: '239', ctr: '2,64%', cpc: '15,87 ₽', sum: '3 793,59 ₽', atbs: '36', orders: '14', cr: '5,86%', shks: '14', sumPrice: '26 600 ₽', drrOrders: '14,26%', salesForecast: '1 900 ₽', drrSales: '-', profitForecast: '663,29 ₽', avgPosition: '-' }),
    campaign({ id: 'c4', status: 'Пауза', name: 'Кампания от 10.06.2026', advertId: '37298455', period: '10.06.2026', type: 'Оплата за показы. Ручная ставка', totalBudget: '1 907 ₽', views: '23 028', clicks: '1 108', ctr: '4,81%', cpc: '8,21 ₽', sum: '9 101,18 ₽', atbs: '98', orders: '18', cr: '1,62%', shks: '18', sumPrice: '54 302 ₽', drrOrders: '16,76%', salesForecast: '6 043 ₽', drrSales: '-', profitForecast: '1 875,19 ₽', avgPosition: '-' }),
    campaign({ id: 'c5', status: 'Идут показы', name: 'Кампания от 09.06.2026', advertId: '37255499', period: '09.06.2026', type: 'Оплата за показы. Ручная ставка', totalBudget: '2 177 ₽', views: '21 079', clicks: '620', ctr: '2,94%', cpc: '14,28 ₽', sum: '8 854,53 ₽', atbs: '114', orders: '22', cr: '3,55%', shks: '22', sumPrice: '43 337 ₽', drrOrders: '20,43%', salesForecast: '11 473 ₽', drrSales: '77,18%', profitForecast: '3 467,74 ₽', avgPosition: '-' }),
    campaign({ id: 'c6', status: 'Завершено', name: 'Сорочки срс', advertId: '37045287', period: '01.06.2026', type: 'Оплата за показы. Ручная ставка', totalBudget: '0 ₽', views: '11', clicks: '3', ctr: '27,27%', cpc: '10 ₽', sum: '30 ₽', atbs: '2', orders: '5', cr: '166,67%', shks: '5', sumPrice: '9 291 ₽', drrOrders: '0,32%', salesForecast: '5 670 ₽', drrSales: '0,53%', profitForecast: '1 934,5 ₽', avgPosition: '-' }),
    campaign({ id: 'c7', status: 'Завершено', name: 'Кампания от 29.05.2026', advertId: '37008037', period: '29.05.2026', type: 'Оплата за показы. Ручная ставка', totalBudget: '0 ₽', views: '34', clicks: '3', ctr: '8,82%', cpc: '3 ₽', sum: '9 ₽', atbs: '0', orders: '8', cr: '266,67%', shks: '8', sumPrice: '23 534 ₽', drrOrders: '0,04%', salesForecast: '6 043 ₽', drrSales: '0,15%', profitForecast: '1 875,19 ₽', avgPosition: '-' }),
];

// Статус → тон тега (по rowHelpers.statusClass: success/gray/...).
function statusTone(status) {
    const s = String(status).toLowerCase();
    if (['идут показы', 'активна', 'активно', 'на показах'].includes(s)) return 'success';
    if (['на модерации', 'запланировано', 'черновик', 'готова к запуску'].includes(s)) return 'attention';
    if (['не прошла модерацию', 'отменено', 'отказался'].includes(s)) return 'danger';
    if (['остановлена из-за бюджета', 'пауза по дневному лимиту', 'в процессе удаления'].includes(s)) return 'warning';
    return 'default';
}

// Прочерк/нулевые значения — приглушаем.
function dim(v) { return v === '-' ? 'muted' : null; }
</script>

<style scoped>
/* ── Каркас: лого / топбар / аккаунт (как в Dashboard-эталоне) ── */
.brand { font-size: var(--font-size-body-s); font-weight: var(--font-weight-bold); color: var(--brand); }
.topbar { display: inline-flex; align-items: center; gap: var(--size-24); }
.topbar__page { color: var(--text-heading); }
.topbar__ico { color: var(--text-muted); font-size: var(--font-size-heading-m); cursor: pointer; }

.screen { display: flex; flex-direction: column; gap: var(--size-16); }
.hint-thumb { display: block; width: 96px; height: 56px; border-radius: var(--radius-sm); background: var(--brand-gradient); }

/* Тулбар фильтров */
.bar { display: flex; align-items: center; gap: var(--size-8); flex-wrap: wrap; }
.bar__select { flex: 1 1 180px; max-width: 320px; }
.bar__select_sm { flex: 0 1 180px; }

/* Круглая воронка (мобайл) — открывает full-screen фильтр */
.bar__funnel {
    flex: 0 0 auto;
    width: var(--control-height-md); height: var(--control-height-md);
    border: 0; border-radius: var(--radius-full);
    background: var(--brand); color: var(--white); cursor: pointer;
}
.bar__mobile-only { display: none; }
@media (max-width: 767.98px) {
    .bar__desktop-only { display: none; }
    .bar__mobile-only { display: inline-flex; align-items: center; justify-content: center; margin-left: auto; }
}

/* Ячейка кампании (lvl-0) */
.camp { display: inline-flex; flex-direction: column; gap: var(--size-2); }
.camp__tag { align-self: flex-start; }
.camp__title { color: var(--text-heading); }
.camp__meta { display: inline-flex; align-items: center; gap: var(--size-4); color: var(--text-muted); }

/* Ячейка товара (lvl-1) */
.prod { display: inline-flex; align-items: center; gap: var(--size-8); }
.prod__thumb { flex: none; width: var(--size-40); height: var(--size-40); border-radius: var(--radius-sm); background: var(--surface-muted); }
.prod__body { display: inline-flex; flex-direction: column; gap: var(--size-2); }
.prod__title { color: var(--text-heading); }
.prod__meta { display: inline-flex; align-items: center; gap: var(--size-4); color: var(--text-muted); }

/* Ячейка даты (lvl-2) */
.date { color: var(--text-default); }

.muted { color: var(--text-muted); }
.tfoot { display: flex; justify-content: center; }
</style>
