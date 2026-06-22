<template>
    <Head title="Товары — экран-эталон" />
    <DsAppShell :items="nav" active="products">
        <template #logo><span class="brand">sellerdata</span></template>
        <template #title>
            <span class="topbar">
                <strong class="t-title-m topbar__page">Товары</strong>
            </span>
        </template>
        <template #actions>
            <span class="fm-help-circle topbar__ico" aria-hidden="true"></span>
            <span class="fm-bell topbar__ico" aria-hidden="true"></span>
            <DsAccountBadge name="Демо аккаунт" store="Wildberries" />
        </template>

        <div class="screen">
            <!-- Онбординг-баннер раздела (реал: BreezeDashboardInfo / подсказка о себестоимости) -->
            <DsNotice v-model:visible="hintOpen" tone="plain" collapse-mobile>
                <template #media><span class="hint-thumb" aria-hidden="true"></span></template>
                Товары для управления себестоимостью ваших товаров. Внесённая себестоимость будет применяться ко всем
                заказам, отображаемым на наших сервисах. Если вы внесли себестоимость для всех баркодов одного артикула —
                она применится ко всем товарам данного артикула. Также можно указать себестоимость для каждого баркода или
                выбрать тип «По периодам», чтобы задать разную себестоимость на разные временные промежутки.
            </DsNotice>

            <!-- Верхний тулбар: поиск + фильтр (слева), «Без себестоимости» (справа).
                 Мобайл: «Фильтр» и «Без себестоимости» уходят в воронку (full-screen фильтр). -->
            <div class="bar">
                <DsSelect
                    v-model="search"
                    :options="[]"
                    placeholder="Поиск по имени, баркоду или артикулу"
                    searchable
                    class="bar__search bar__desktop-only"
                />
                <DsButton variant="secondary" class="bar__desktop-only"><template #iconLeft>⚲</template>Фильтр</DsButton>
                <DsCheckbox v-model="onlyEmptyCost" label="Без себестоимости" class="bar__cost bar__desktop-only" />
                <DsIconButton icon="fm-filter" aria-label="Фильтр" class="bar__mobile-only" @click="filterOpen = true" />
            </div>

            <!-- Таблица товаров -->
            <DsCard radius="md" padding="--size-2">
                <DsTable
                    :columns="cols"
                    :rows="rows"
                    row-key="id"
                    expandable
                    default-sort-key="title"
                    mobile-mode="compact"
                    :mobile-columns="['select', 'title']"
                    detail-title="Товар"
                >
                    <!-- Чекбокс выбора строки -->
                    <template #head-select>
                        <DsCheckbox v-model="allSelected" />
                    </template>
                    <template #cell-select="{ row }">
                        <DsCheckbox v-model="selected" :value="row.id" />
                    </template>

                    <!-- Ячейка товара (картинка + название + nmId/артикул) -->
                    <template #cell-title="{ row }">
                        <DsProductCell
                            v-if="!row.isVariant"
                            :name="row.title"
                            :copy-id="String(row.nmId)"
                            :sub="row.article"
                        >
                            <template #sub>
                                <DsCopyButton :text="String(row.nmId)" />
                                <span class="cell-id">{{ row.nmId }}</span>
                                <span v-if="row.article" class="cell-id">/ {{ row.article }}</span>
                                <span v-if="row.price" class="cell-id">/ Цена: {{ row.price }}</span>
                            </template>
                        </DsProductCell>
                        <span v-else class="variant">
                            <span class="variant__barcode">{{ row.barcode }}</span>
                            <span v-if="row.size" class="cell-id">, размер: {{ row.size }}</span>
                        </span>
                    </template>

                    <!-- Себестоимость — инлайн-кнопка «₽ значение» (реал .inner-text-block__btn) -->
                    <template #cell-cost="{ row }">
                        <button type="button" class="cost-pill">
                            <span class="cost-pill__rub">₽</span>
                            <span>{{ row.cost }}</span>
                        </button>
                    </template>

                    <!-- Тип расчёта себестоимости -->
                    <template #cell-type="{ row }">
                        <span class="t-body-s type-cell">{{ row.type }}</span>
                    </template>

                    <!-- Комментарий -->
                    <template #cell-comment="{ row }">
                        <span class="comment" :class="{ 'comment--filled': row.comment }">
                            {{ row.comment || 'Комментарий' }}
                        </span>
                    </template>

                    <!-- Служебная колонка «Подробнее» -->
                    <template #cell-more>
                        <button type="button" class="more-btn fm-chevron-right" aria-label="Подробнее"></button>
                    </template>

                    <template #empty>
                        <div class="empty">
                            <span class="empty__icon fm-carbon_search" aria-hidden="true"></span>
                            <p class="t-heading-s empty__title">Ничего не найдено</p>
                            <p class="t-body-s empty__text">Попробуйте поменять параметры фильтра и попробовать снова</p>
                        </div>
                    </template>
                </DsTable>
            </DsCard>

            <!-- Панель массовых действий (реал: buttons-panel — Скачать / Загрузить .xls) -->
            <DsStickyBar class="actions">
                <DsButton variant="primary">Скачать таблицу (.xls)</DsButton>
                <DsButton variant="primary">Загрузить таблицу (.xls)</DsButton>
            </DsStickyBar>

            <!-- Пагинация -->
            <div class="tfoot">
                <DsPagination :page="page" :total="780" :per-page="50" @change="p => page = p" />
            </div>

            <!-- Подвал поддержки -->
            <DsSupportFooter />

            <!-- Мобильный фильтр: full-screen лист (реал /products мобайл — воронка) -->
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
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsIconButton from '@/Components/Ds/DsIconButton.vue';
import DsSupportFooter from '@/Components/Ds/DsSupportFooter.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsCheckbox from '@/Components/Ds/DsCheckbox.vue';
import DsTable from '@/Components/Ds/DsTable.vue';
import DsPagination from '@/Components/Ds/DsPagination.vue';
import DsProductCell from '@/Components/Ds/DsProductCell.vue';
import DsCopyButton from '@/Components/Ds/DsCopyButton.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';
import DsAccountBadge from '@/Components/Ds/DsAccountBadge.vue';
import DsFilterSheet from '@/Components/Ds/DsFilterSheet.vue';
import DsStickyBar from '@/Components/Ds/DsStickyBar.vue';

// Иконки сверены с реальным сайдбаром (Authenticated.vue).
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
const onlyEmptyCost = ref(false);
const allSelected = ref(false);
const selected = ref([]);
const page = ref(1);

// Мобильный фильтр (full-screen лист): «Фильтр» и «Без себестоимости» с десктоп-тулбара.
const filterOpen = ref(false);
const filterItems = [
    { key: 'search', label: 'Товары', icon: 'fm-calendar' },
    { key: 'type', label: 'Тип себестоимости', icon: 'fm-box' },
    { key: 'empty', label: 'Без себестоимости', icon: 'fm-filter' },
];

// Колонки таблицы (реал Products.vue: чекбокс | Товары | Себест. | Тип | Комментарий | →).
const cols = [
    { key: 'select', label: '', width: 'var(--size-32)', align: 'center' },
    { key: 'title', label: 'Товары', width: '36%' },
    { key: 'cost', label: 'Себест.', width: 'var(--size-128)' },
    { key: 'type', label: 'Тип', width: 'var(--size-128)' },
    { key: 'comment', label: 'Комментарий' },
    { key: 'more', label: '', width: 'var(--size-40)', align: 'center' },
];

// Данные строк — состав/наименования сверены с docs/reference/screens/товары__список@wb.png.
const rows = [
    {
        id: 1, title: 'Автомобильное зарядное устройство', nmId: 420154, article: 'AVTO-01',
        cost: '440,00', type: 'За всё время', comment: '',
        children: [
            { id: '1a', isVariant: true, barcode: '2040000000011', size: '', cost: '440,00', type: 'За всё время', comment: '' },
            { id: '1b', isVariant: true, barcode: '2040000000028', size: '', cost: '440,00', type: 'За всё время', comment: '' },
        ],
    },
    { id: 2, title: 'Автомобильное зарядное устройство', nmId: 420178, article: 'AVTO-02', cost: '510,00', type: 'По периодам', comment: '' },
    { id: 3, title: 'Автомобильное зарядное устройство', nmId: 426318, article: 'AVTO-03', cost: '0,00', type: 'За всё время', comment: '' },
    { id: 4, title: 'Аксессуары', nmId: 351221, article: 'AKS-01', cost: '120,00', type: 'За всё время', comment: '' },
    { id: 5, title: 'Аксессуары', nmId: 351809, article: 'AKS-02', cost: '120,00', type: 'За всё время', comment: '' },
    { id: 6, title: 'Аксессуары', nmId: 144657, article: 'AKS-03', cost: '95,00', type: 'За всё время', comment: '' },
    { id: 7, title: 'Банки для сыпучих продуктов', nmId: 880403, article: 'BANK-01', cost: '210,00', type: 'За всё время', comment: '' },
    { id: 8, title: 'Банки для сыпучих продуктов', nmId: 894004, article: 'BANK-02', cost: '210,00', type: 'За всё время', comment: '' },
    { id: 9, title: 'Банки для сыпучих продуктов', nmId: 904100, article: 'BANK-03', cost: '700,00', type: 'За всё время', comment: 'Подарочная упаковка' },
    { id: 10, title: 'Батарейка', nmId: 129875, article: 'BAT-01', cost: '60,00', type: 'За всё время', comment: '' },
    { id: 11, title: 'Батарейка', nmId: 348820, article: 'BAT-02', cost: '60,00', type: 'За всё время', comment: '' },
    { id: 12, title: 'Бинт', nmId: 175016, article: 'BINT-01', cost: '40,00', type: 'За всё время', comment: '' },
    { id: 13, title: 'Бинт', nmId: 187735, article: 'BINT-02', cost: '305,00', type: 'За всё время', comment: '' },
// В реале каждый товар раскрывается в свои баркоды — гарантируем expander на всех строках.
].map(r => r.children ? r : ({
    ...r,
    children: [{ id: r.id + 'a', isVariant: true, barcode: String(2040000000000 + r.nmId), size: '', cost: r.cost, type: r.type, comment: '' }],
}));
</script>

<style scoped>
/* ── Каркас: лого / топбар / аккаунт ── */
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
.bar__cost { margin-left: auto; }

/* Круглая воронка (мобайл) — открывает full-screen фильтр */
.bar__funnel {
    flex: 0 0 auto;
    width: var(--control-height-md); height: var(--control-height-md);
    border: 0; border-radius: var(--radius-full);
    background: var(--brand); color: var(--white); cursor: pointer;
}
/* Десктоп: фильтр-кнопка и чекбокс видны, воронка скрыта */
.bar__mobile-only { display: none; }
@media (max-width: 767.98px) {
    .bar__desktop-only { display: none; }
    .bar__mobile-only { display: inline-flex; align-items: center; justify-content: center; margin-left: auto; }
}

/* Ячейка товара — детали в sub */
.cell-id { color: var(--text-muted); }

/* Вариант (баркод) во вложенной строке */
.variant { display: inline-flex; align-items: center; gap: var(--size-4); }
.variant__barcode { color: var(--text-default); }

/* Инлайн-кнопка себестоимости (реал .inner-text-block__btn) */
.cost-pill {
    display: inline-flex;
    align-items: center;
    gap: var(--size-4);
    min-width: var(--size-80);
    padding: var(--size-6) var(--size-12);
    border: 1px solid var(--border-input);
    border-radius: var(--radius-sm);
    background: var(--surface-default);
    color: var(--text-default);
    font-size: var(--font-size-body-s);
    cursor: text;
    transition: border-color var(--transition-fast) var(--ease-standard);
}
.cost-pill:hover { border-color: var(--brand); }
.cost-pill__rub { color: var(--text-muted); }

.type-cell { color: var(--text-default); }

/* Комментарий — плейсхолдер до заполнения */
.comment {
    display: block;
    min-height: var(--control-height-sm);
    padding: var(--size-6) var(--size-8);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    color: var(--text-placeholder);
    white-space: normal;
}
.comment--filled { color: var(--text-default); }
.comment:hover { border-color: var(--border-input); }

/* Кнопка «Подробнее» */
.more-btn { border: 0; background: transparent; color: var(--text-muted); font-size: var(--font-size-title-m); line-height: 1; cursor: pointer; }
.more-btn:hover { color: var(--brand); }

/* Пустое состояние */
.empty { display: flex; flex-direction: column; align-items: center; gap: var(--size-8); padding: var(--size-48) var(--size-16); text-align: center; }
.empty__icon { font-size: var(--font-size-heading-l); color: var(--text-placeholder); }
.empty__title { color: var(--text-heading); }
.empty__text { color: var(--text-muted); }

/* Панель массовых действий */
.actions { display: flex; justify-content: center; gap: var(--size-8); flex-wrap: wrap; }

.tfoot { display: flex; justify-content: center; }

/* Подвал поддержки */
.support { text-align: center; color: var(--text-muted); }
.support__link { color: var(--brand); text-decoration: none; }
.support__link:hover { text-decoration: underline; }
</style>
