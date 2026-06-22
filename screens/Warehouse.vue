<template>
    <Head title="Склад — экран-эталон" />
    <DsAppShell :items="nav" active="warehouse">
        <template #logo><span class="brand">sellerdata</span></template>
        <template #title>
            <span class="topbar">
                <strong class="t-title-m topbar__page">Склад</strong>
            </span>
        </template>
        <template #actions>
            <span class="fm-help-circle topbar__ico" aria-hidden="true"></span>
            <span class="fm-bell topbar__ico" aria-hidden="true"></span>
            <DsAccountBadge data-source="wildberries" name="Демо аккаунт" store="Дополнительный магазин" />
        </template>

        <div class="screen">
            <!-- Онбординг-баннер (реал: подсказка про отслеживание запасов по темпам продаж) -->
            <DsNotice v-model:visible="hintOpen" tone="plain" collapse-mobile>
                <template #media><span class="hint-thumb" aria-hidden="true"></span></template>
                Здесь, исходя из темпов продаж за последние 30 дней, вы можете отслеживать свои
                запасы и получать рекомендации о необходимости пополнить товар. Себестоимость FBO и FBS
                синхронизируется автоматически. Введите длительность одной поставки и срок выполнения
                заказа в днях, чтобы система рассчитала рекомендуемое количество для дозаказа.
            </DsNotice>

            <!-- Верхний тулбар: поиск товаров + выбор складов + FBO/FBS + фильтр -->
            <div class="bar">
                <DsSelect v-model="search" :options="[]" placeholder="Товары" searchable class="bar__search" />
                <DsSelect v-model="warehouse" :options="warehouses" placeholder="Все склады" class="bar__select" />
                <DsSelect v-model="stockType" :options="stockTypes" placeholder="FBO/FBS" :show-footer="false" class="bar__select" />
                <DsButton variant="secondary"><template #iconLeft>⚲</template>Фильтр</DsButton>
            </div>

            <!-- Сводка: 3 градиентные карточки (десктоп — ряд; мобайл — табы + свайпер + воронка) -->
            <DsSummaryCarousel :items="summary" :card-columns="2">
                <template #tabs-action>
                    <DsIconButton icon="fm-filter" aria-label="Фильтр" @click="filterOpen = true" />
                </template>
            </DsSummaryCarousel>

            <!-- Тулбар таблицы: «Группировать по» (только WB) -->
            <div class="tbar">
                <DsSelect v-model="group" :options="groups" placeholder="Группировать по" :show-footer="false" class="tbar__group" />
            </div>

            <!-- Таблица остатков FBO/FBS -->
            <DsCard radius="md" padding="--size-2">
                <DsTable
                    :columns="cols" :rows="rows" row-key="id" expandable default-sort-key="quantity"
                    mobile-mode="compact"
                    :mobile-columns="['name', 'quantity', 'quantityDays']"
                    detail-title="Товар"
                    group-key="isGroup"
                >
                    <!-- Ячейка товара: картинка + название + копируемый артикул/баркод + площадка -->
                    <template #cell-name="{ row }">
                        <span v-if="row.isGroup">{{ row.name }}</span>
                        <DsProductCell
                            v-else
                            :name="row.name"
                            :sub="row.sku"
                            :copy-id="row.nm"
                        />
                    </template>

                    <!-- Остаток на складе в днях: solid-тег только при дефиците/риске, иначе текст (реал status-tag) -->
                    <template #cell-quantityDays="{ row }">
                        <DsTag v-if="quantityDaysTone(row)" variant="solid" :tone="quantityDaysTone(row)">{{ row.quantityDays }}</DsTag>
                        <span v-else>{{ row.quantityDays }}</span>
                    </template>

                    <!-- Дней до следующего заказа: solid-тег только при риске, иначе текст -->
                    <template #cell-nextOrderDays="{ row }">
                        <template v-if="row.nextOrderDays === ''"><span>—</span></template>
                        <DsTag v-else-if="nextOrderDaysTone(row)" variant="solid" :tone="nextOrderDaysTone(row)">{{ row.nextOrderDays }}</DsTag>
                        <span v-else>{{ row.nextOrderDays }}</span>
                    </template>

                    <!-- Промежуточный склад / объём закупки / срок заказа: редактируемые поля (реал — инпуты) -->
                    <template #cell-intermediate="{ row }">
                        <span v-if="row.intermediate === ''">—</span>
                        <span v-else>{{ row.intermediate }}</span>
                    </template>

                    <!-- Деталь-модалка (мобайл compact): шапка с товаром -->
                    <template #detail-header="{ row }">
                        <DsProductCell :name="row.name" :sub="row.sku" :copy-id="row.nm" />
                    </template>
                    <template #detail-footer="{ close }">
                        <DsButton variant="secondary" @click="close">Отменить</DsButton>
                        <DsButton variant="primary" disabled>Сохранить</DsButton>
                    </template>
                </DsTable>
            </DsCard>

            <div class="tfoot">
                <DsPagination :page="page" :total="1000" :per-page="50" @change="p => page = p" />
            </div>

            <!-- Подвал поддержки -->
            <DsSupportFooter />

            <!-- Мобильный фильтр: full-screen лист (реал _live__склад__мобайл-фильтр) -->
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
import DsSummaryCarousel from '@/Components/Ds/DsSummaryCarousel.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsIconButton from '@/Components/Ds/DsIconButton.vue';
import DsSupportFooter from '@/Components/Ds/DsSupportFooter.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsTable from '@/Components/Ds/DsTable.vue';
import DsTag from '@/Components/Ds/DsTag.vue';
import DsPagination from '@/Components/Ds/DsPagination.vue';
import DsProductCell from '@/Components/Ds/DsProductCell.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';
import DsAccountBadge from '@/Components/Ds/DsAccountBadge.vue';
import DsFilterSheet from '@/Components/Ds/DsFilterSheet.vue';

// Иконки сверены с реальным сайдбаром (Authenticated.vue) — как в Screens/Dashboard.vue.
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
const search = ref(null);
const warehouse = ref(null);
const warehouses = ['Коледино', 'Электросталь', 'Казань', 'Тула'];
const stockType = ref(null);
const stockTypes = ['FBO/FBS', 'FBO', 'FBS'];
const group = ref(null);
const groups = ['Не группировать', 'Артикулу'];
const page = ref(1);

// Мобильный фильтр (full-screen лист): те же фильтры, что в десктоп-тулбаре.
const filterOpen = ref(false);
const filterItems = [
    { key: 'products', label: 'Товары', icon: 'fm-calendar' },
    { key: 'warehouses', label: 'Все склады', icon: 'fm-globe' },
    { key: 'type', label: 'FBO/FBS', icon: 'fm-type' },
];

// ── Сводка (реальные числа account 4 из /warehouse/summary) ──
// Три состояния: себестоимость, потенциальные продажи, потенциальная прибыль.
// Метрики: Склад / Доступно / Резерв / Промеж. склад / Закупка / Итого (сетка 2 колонки).
const summary = [
    {
        title: 'Себестоимость',
        gradient: 'periwinkle',
        metrics: sm('47,00 ₽', '38,00 ₽', '9,00 ₽', '0,00 ₽', '0,00 ₽', '47,00 ₽'),
    },
    {
        title: 'Потенциальные продажи',
        gradient: 'muted',
        metrics: sm('3 243 490,63 ₽', '2 665 693,25 ₽', '577 797,38 ₽', '0,00 ₽', '0,00 ₽', '3 243 490,63 ₽'),
    },
    {
        title: 'Потенциальная прибыль',
        gradient: 'blue',
        icon: 'info',
        metrics: sm('1 834 056,65 ₽', '1 568 221,50 ₽', '265 835,15 ₽', '0,00 ₽', '0,00 ₽', '1 834 056,65 ₽'),
    },
];
function sm(warehouse, available, reserve, intermediate, purchase, total) {
    return [
        { label: 'Склад', value: warehouse }, { label: 'Доступно', value: available },
        { label: 'Резерв', value: reserve }, { label: 'Промеж. склад', value: intermediate },
        { label: 'Закупка', value: purchase }, { label: 'Итого', value: total },
    ];
}

// ── Колонки таблицы (реал: 12 колонок без «Действий» — её рисует DsTable как деталь) ──
// Числовые колонки узкие; заголовки переносятся (DsTable).
const cols = [
    { key: 'name', label: 'Товары', width: '22%' },
    { key: 'quantity', label: 'Кол-во на складе', numeric: true, sortable: true },
    { key: 'reserved', label: 'Кол-во в резерве', numeric: true },
    { key: 'warehouseCost', label: 'Себестоимость склада', numeric: true, sortable: true },
    { key: 'salesSpeed', label: 'Скорость продаж (ед. в день)', numeric: true, sortable: true },
    { key: 'quantityDays', label: 'Остаток на складе в днях', numeric: true, align: 'center', sortable: true },
    { key: 'intermediate', label: 'Кол-во на промежуточном складе', numeric: true },
    { key: 'purchase', label: 'Объем закупки', numeric: true },
    { key: 'orderDays', label: 'Срок выполнения заказа', numeric: true },
    { key: 'nextOrderDays', label: 'Дней до следующего заказа', numeric: true, align: 'center', sortable: true },
    { key: 'recommend', label: 'Рекомендуемое кол-во для дозаказа', numeric: true, sortable: true },
    { key: 'roi', label: 'ROI', numeric: true, sortable: true },
];

// ── Реальные строки остатков (account 4, /warehouse/products) ──
const rows = [
    { id: 1, name: 'Ночная сорочка больших размеров с кружевом', nm: '649546531', sku: '2047489507697 / FBO', quantity: '50', reserved: '0', warehouseCost: '0,00 ₽', salesSpeed: '0', quantityDays: '0', intermediate: '', purchase: '', orderDays: '', nextOrderDays: '0', recommend: '—', roi: '0,00 %' },
    { id: 2, name: 'Ночная сорочка больших размеров', nm: '649546532', sku: '2047488172933 / FBO', quantity: '49', reserved: '1', warehouseCost: '0,00 ₽', salesSpeed: '0', quantityDays: '0', intermediate: '', purchase: '', orderDays: '', nextOrderDays: '0', recommend: '—', roi: '0,00 %' },
    { id: 3, name: 'Ночная сорочка больших размеров с кружевом', nm: '649546531', sku: '2047489507680 / FBO', quantity: '49', reserved: '1', warehouseCost: '0,00 ₽', salesSpeed: '0', quantityDays: '0', intermediate: '', purchase: '', orderDays: '', nextOrderDays: '0', recommend: '—', roi: '0,00 %' },
    { id: 4, name: 'Ночная сорочка больших размеров', nm: '649546532', sku: '2047488174432 / FBO', quantity: '38', reserved: '2', warehouseCost: '0,00 ₽', salesSpeed: '0', quantityDays: '0', intermediate: '', purchase: '', orderDays: '', nextOrderDays: '0', recommend: '—', roi: '0,00 %' },
    // Строки с активными продажами — демонстрируют зоны риска (red/orange), как в референс-скрине склада.
    { id: 5, name: 'Ночная сорочка больших размеров', nm: '261418820', sku: '2041214333391 / FBO', quantity: '37', reserved: '2', warehouseCost: '0,00 ₽', salesSpeed: '5.2', quantityDays: '6', intermediate: '', purchase: '', orderDays: '', nextOrderDays: '0', recommend: '120', roi: '0,00 %' },
    { id: 6, name: 'Ночная сорочка больших размеров', nm: '261418820', sku: '2041214333421 / FBO', quantity: '33', reserved: '2', warehouseCost: '0,00 ₽', salesSpeed: '2.4', quantityDays: '12', intermediate: '', purchase: '', orderDays: '', nextOrderDays: '5', recommend: '60', roi: '0,00 %' },
    { id: 7, name: 'Ночная сорочка больших размеров', nm: '261418820', sku: '2041214333407 / FBO', quantity: '32', reserved: '2', warehouseCost: '0,00 ₽', salesSpeed: '0.07', quantityDays: '457', intermediate: '', purchase: '', orderDays: '', nextOrderDays: '443', recommend: '—', roi: '0,00 %' },
    { id: 8, name: 'Ночная сорочка больших размеров', nm: '261418822', sku: '2041214334268 / FBO', quantity: '31', reserved: '0', warehouseCost: '0,00 ₽', salesSpeed: '0', quantityDays: '0', intermediate: '', purchase: '', orderDays: '', nextOrderDays: '0', recommend: '—', roi: '0,00 %' },
];

// Раскраска «дней» — 1:1 с реальным WarehouseProductsTableRowChild.vue:
// тег появляется только в зоне риска, нормальный остаток — просто текст без фона.
const num = (v) => Number(String(v).replace(/[^\d.-]/g, ''));

// Остаток в днях: danger при 0<дней≤7 или (есть продажи и дней=0); warning при 7<дней≤14; иначе текст.
function quantityDaysTone(row) {
    const d = num(row.quantityDays), s = num(row.salesSpeed);
    if ((d > 0 && d <= 7) || (s > 0 && d === 0)) return 'danger';
    if (d > 7 && d <= 14) return 'warning';
    return '';
}

// Дней до заказа: danger при ≤0 и есть продажи; warning при 0<x≤7 и есть продажи; иначе текст.
function nextOrderDaysTone(row) {
    const d = num(row.nextOrderDays), s = num(row.salesSpeed);
    if (s <= 0) return '';
    if (d <= 0) return 'danger';
    if (d > 0 && d <= 7) return 'warning';
    return '';
}
</script>

<style scoped>
/* ── Каркас: лого / топбар / аккаунт (как в Screens/Dashboard.vue) ── */
.brand { font-size: var(--font-size-body-s); font-weight: var(--font-weight-bold); color: var(--brand); }
.topbar { display: inline-flex; align-items: center; gap: var(--size-24); }
.topbar__page { color: var(--text-heading); }
.topbar__ico { color: var(--text-muted); font-size: var(--font-size-heading-m); cursor: pointer; }

/* Без своего паддинга — отступ страницы задаёт AppShell content. */
.screen { display: flex; flex-direction: column; gap: var(--size-16); }

.hint-thumb { display: block; width: 96px; height: 56px; border-radius: var(--radius-sm); background: var(--brand-gradient); }

/* Верхний тулбар */
.bar { display: flex; align-items: center; gap: var(--size-8); flex-wrap: wrap; }
.bar__search { flex: 1 1 auto; max-width: 540px; }
.bar__select { width: 200px; max-width: 100%; }
/* Мобайл: селекты-фильтры уходят в full-screen воронку (реал), на странице — только сводка/таблица */
@media (max-width: 767.98px) { .bar { display: none; } }

/* Круглая воронка в ряду табов сводки (видна на мобайле через #tabs-action) */
.bar__funnel {
    width: var(--control-height-md); height: var(--control-height-md);
    border: 0; border-radius: var(--radius-full);
    background: var(--brand); color: var(--white); cursor: pointer;
}

/* Тулбар таблицы — «Группировать по» прижато вправо (реал) */
.tbar { display: flex; align-items: center; justify-content: flex-end; gap: var(--size-16); flex-wrap: wrap; }
.tbar__group { width: 220px; max-width: 100%; }

.tfoot { display: flex; justify-content: center; }
.support { text-align: center; color: var(--text-muted); }
.support__link { color: var(--brand); text-decoration: none; }
.support__link:hover { text-decoration: underline; }
</style>