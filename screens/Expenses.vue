<template>
    <Head title="Расходы — экран-эталон" />
    <DsAppShell :items="nav" active="expenses">
        <template #logo><span class="brand">sellerdata</span></template>
        <template #title>
            <span class="topbar">
                <strong class="t-title-m topbar__page">Расходы</strong>
            </span>
        </template>
        <template #actions>
            <span class="fm-help-circle topbar__ico" aria-hidden="true"></span>
            <span class="fm-bell topbar__ico" aria-hidden="true"></span>
            <DsAccountBadge name="Демо аккаунт" store="Основной магазин" />
        </template>

        <div class="screen">
            <!-- Онбординг-баннер раздела (реал: BreezeDashboardInfo — текст про косвенные расходы) -->
            <DsNotice v-model:visible="hintOpen" tone="plain" collapse-mobile>
                <template #media><span class="hint-thumb" aria-hidden="true"></span></template>
                Раздел для ввода косвенных расходов компании. К ним относятся все ваши расходы на ведение торговой
                деятельности, за исключением удержаний маркетплейса. Например, расходы на аренду офиса или склада,
                зарплаты ассистента или бухгалтера, банковский кредит, внешнюю рекламу и другие. Обратите внимание на
                возможность формирования повторяющихся расходов, которые будут создаваться автоматически в одну и ту же
                дату с запланированным интервалом. Если установить галочку «Амортизировать по дням», такие расходы
                будут распределяться равномерно на каждый день периода.
            </DsNotice>

            <!-- Верхний тулбар: поиск по наименованию + категория (слева) + кнопка-период (справа).
                 Мобайл: поиск/категория уходят в воронку (full-screen фильтр), период остаётся отдельной модалкой. -->
            <div class="bar">
                <DsInput
                    v-model="query"
                    placeholder="Наименование расхода"
                    class="bar__search bar__desktop-only"
                />
                <DsSelect
                    v-model="category"
                    :options="categories"
                    placeholder="Выберите категорию"
                    :show-footer="false"
                    class="bar__select bar__desktop-only"
                />
                <DsIconButton icon="fm-calendar" size="lg" aria-label="Период" class="bar__period bar__desktop-only" @click="periodOpen = true" />
                <DsIconButton icon="fm-filter" aria-label="Фильтр" class="bar__funnel bar__mobile-only" @click="filterOpen = true" />
            </div>

            <!-- Таблица расходов с группировкой по месяцам (строка-итог «Всего в …») -->
            <DsCard radius="md" padding="--size-2">
                <DsTable
                    :columns="cols"
                    :rows="rows"
                    row-key="id"
                    group-key="isSummary"
                    default-sort-key="date"
                    mobile-mode="compact"
                    :mobile-columns="['select', 'date', 'amount']"
                    detail-title="Расход"
                >
                    <!-- Чекбокс «выбрать все» в шапке -->
                    <template #head-select>
                        <DsCheckbox v-model="allSelected" />
                    </template>

                    <!-- Чекбокс выбора строки (в строках-итогах не показываем) -->
                    <template #cell-select="{ row }">
                        <DsCheckbox v-if="!row.isSummary" v-model="selected" :value="row.id" />
                    </template>

                    <!-- Дата / для строки-итога — подпись «Всего в …» -->
                    <template #cell-date="{ row }">
                        <span v-if="row.isSummary" class="summary-label">{{ row.summaryLabel }}</span>
                        <span v-else>{{ row.date }}</span>
                    </template>

                    <!-- Товары: список кликабельных артикулов (реал — ссылки nm_id через запятую) -->
                    <template #cell-products="{ row }">
                        <span v-if="row.isSummary"></span>
                        <span v-else-if="!row.products || !row.products.length" class="muted">--</span>
                        <span v-else class="products">
                            <template v-for="(p, i) in row.products" :key="p">
                                <a class="products__link" href="#" @click.prevent>{{ p }}</a><span v-if="i < row.products.length - 1">, </span>
                            </template>
                        </span>
                    </template>

                    <!-- Категория: «--» когда не задана -->
                    <template #cell-category="{ row }">
                        <span v-if="row.isSummary"></span>
                        <span v-else-if="!row.category" class="muted">--</span>
                        <span v-else>{{ row.category }}</span>
                    </template>

                    <!-- Тип расхода (пусто в строке-итоге) -->
                    <template #cell-type="{ row }">
                        <span v-if="row.isSummary"></span>
                        <span v-else>{{ row.type }}</span>
                    </template>

                    <!-- Наименование (пусто в строке-итоге) -->
                    <template #cell-title="{ row }">
                        <span v-if="row.isSummary"></span>
                        <span v-else>{{ row.title }}</span>
                    </template>

                    <!-- Сумма (в строке-итоге — итог месяца, акцентом) -->
                    <template #cell-amount="{ row }">
                        <span :class="{ 'summary-total': row.isSummary }">{{ row.amount }}</span>
                    </template>

                    <!-- Служебная колонка «Действия» → раскрыть/редактировать расход -->
                    <template #cell-actions="{ row }">
                        <button
                            v-if="!row.isSummary"
                            type="button"
                            class="action-btn fm-chevron-right"
                            aria-label="Редактировать"
                            @click="openEdit(row)"
                        ></button>
                    </template>

                    <template #empty>
                        <div class="empty">
                            <span class="empty__icon fm-carbon_search" aria-hidden="true"></span>
                            <p class="t-heading-m empty__title">Ничего не найдено</p>
                            <p class="t-body-s empty__text">Попробуйте поменять параметры фильтра и попробовать снова</p>
                        </div>
                    </template>
                </DsTable>
            </DsCard>

            <!-- Подвал поддержки -->
            <DsSupportFooter />

            <!-- Нижняя панель действий (реал: buttons-panel — «Добавить»; при выборе строк — «Удалить») -->
            <DsStickyBar class="actions">
                <DsButton v-if="selected.length" variant="primary" @click="deleteOpen = true">Удалить</DsButton>
                <DsButton v-else variant="primary" @click="openCreate">Добавить</DsButton>
            </DsStickyBar>
        </div>

        <!-- ─── Модалка создания/редактирования расхода ─── -->
        <DsModal v-model="formOpen" :title="isCreating ? 'Добавить расход' : 'Изменить расход'" size="md">
            <div class="form">
                <!-- Наименование + Сумма в одну строку (реал — info-list__row) -->
                <div class="form__row">
                    <DsInput v-model="form.title" label="Наименование" placeholder="Название расхода" />
                    <DsInput v-model="form.amount" label="Сумма" placeholder="0" />
                </div>

                <DsInput v-model="form.date" label="Дата" placeholder="дд.мм.гггг" />

                <DsSelect
                    v-model="form.type"
                    :options="typeOptions"
                    placeholder="Выберите тип расхода"
                    :show-footer="false"
                    label="Тип"
                />

                <!-- Амортизация по дням — только для повторяющихся типов (реал: type != Единоразовый) -->
                <DsCheckbox
                    v-if="form.type && form.type !== 'Единоразовый'"
                    v-model="form.amortization"
                    label="Амортизация по дням"
                />

                <div class="form__field">
                    <span class="t-label-m form__label">Категория</span>
                    <DsSelect
                        v-model="form.category"
                        :options="categoryOptions"
                        placeholder="Выберите или создайте категорию"
                        :show-footer="false"
                    />
                </div>

                <!-- Переход в выбор товаров (реал — info-list__input_combo с шевроном) -->
                <button type="button" class="form__combo" @click="productsOpen = true">
                    <span class="t-body-s form__combo-label">Товары</span>
                    <span class="form__combo-value">
                        <span v-if="form.products.length" class="form__combo-count">{{ form.products.length }} выбрано</span>
                        <span class="form__combo-chevron fm-chevron-right" aria-hidden="true"></span>
                    </span>
                </button>
            </div>

            <template #footer>
                <DsButton v-if="!isCreating" variant="secondary" @click="deleteOpen = true">Удалить</DsButton>
                <DsButton variant="primary" :disabled="!formPopulated" @click="formOpen = false">Сохранить</DsButton>
            </template>
        </DsModal>

        <!-- ─── Модалка выбора периода (реал: расходы__модалка-фильтр) ─── -->
        <DsModal v-model="periodOpen" title="Период" size="sm">
            <div class="period">
                <button
                    v-for="opt in periodOptions"
                    :key="opt"
                    type="button"
                    class="period__btn"
                    :class="{ 'is-active': period === opt }"
                    @click="period = opt"
                >
                    <span>{{ opt }}</span>
                    <span v-if="period === opt" class="period__check fm-check" aria-hidden="true"></span>
                </button>
            </div>
            <template #footer>
                <DsButton variant="primary" class="period__apply" @click="periodOpen = false">Фильтровать</DsButton>
            </template>
        </DsModal>

        <!-- ─── Модалка подтверждения удаления (реал: modalDeleteItem) ─── -->
        <DsModal v-model="deleteOpen" title="Подтверждение удаления" size="sm">
            <p class="t-body-l del-text">Вы уверены, что хотите удалить расход?</p>
            <template #footer>
                <DsButton variant="secondary" @click="deleteOpen = false">Отменить</DsButton>
                <DsButton variant="primary" @click="deleteOpen = false">Удалить</DsButton>
            </template>
        </DsModal>

        <!-- ─── Мобильный фильтр: full-screen лист (реал — воронка) ─── -->
        <DsFilterSheet
            v-model:visible="filterOpen"
            :items="filterItems"
            @reset="filterOpen = false"
            @apply="filterOpen = false"
        />
    </DsAppShell>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import DsAppShell from '@/Components/Ds/DsAppShell.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsIconButton from '@/Components/Ds/DsIconButton.vue';
import DsSupportFooter from '@/Components/Ds/DsSupportFooter.vue';
import DsInput from '@/Components/Ds/DsInput.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsCheckbox from '@/Components/Ds/DsCheckbox.vue';
import DsTable from '@/Components/Ds/DsTable.vue';
import DsModal from '@/Components/Ds/DsModal.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';
import DsAccountBadge from '@/Components/Ds/DsAccountBadge.vue';
import DsFilterSheet from '@/Components/Ds/DsFilterSheet.vue';
import DsStickyBar from '@/Components/Ds/DsStickyBar.vue';

// Иконки сверены с реальным сайдбаром (Authenticated.vue) — как в Screens/Products.vue/Warehouse.vue.
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
const query = ref('');
const category = ref(null);
const categories = ['Все', 'Реклама', 'Фото', 'Аренда', 'Зарплата'];

const allSelected = ref(false);
const selected = ref([]);

// ── Тулбар-модалки/листы ──
const periodOpen = ref(false);
const period = ref('Три месяца');
const periodOptions = ['Один месяц', 'Три месяца', 'Шесть месяцев', 'Текущий год', 'Произвольный период'];

const filterOpen = ref(false);
const filterItems = [
    { key: 'query', label: 'Наименование расхода', icon: 'fm-search' },
    { key: 'category', label: 'Выберите категорию', icon: 'fm-clipboard' },
    { key: 'period', label: 'Период', icon: 'fm-calendar' },
];

// ── Модалка создания/редактирования ──
const formOpen = ref(false);
const isCreating = ref(true);
const productsOpen = ref(false);
const deleteOpen = ref(false);
const typeOptions = ['Единоразовый', 'Ежемесячный', 'Еженедельный'];
const categoryOptions = ['--', 'Реклама', 'Фото', 'Аренда', 'Зарплата'];
const form = ref({ title: '', amount: '', date: '11.06.2026', type: 'Единоразовый', amortization: false, category: '', products: [] });
const formPopulated = computed(() => !!(form.value.title && form.value.amount && form.value.date));

function openCreate() {
    isCreating.value = true;
    form.value = { title: '', amount: '', date: '11.06.2026', type: 'Единоразовый', amortization: false, category: '', products: [] };
    formOpen.value = true;
}
function openEdit(row) {
    isCreating.value = false;
    form.value = {
        title: row.title, amount: String(row.amount).replace(/[^\d]/g, ''), date: row.date,
        type: row.type, amortization: false, category: row.category || '', products: row.products || [],
    };
    formOpen.value = true;
}

// ── Колонки таблицы (реал Expenses.vue: чекбокс | Дата | Наименование | Тип расхода | Категория | Товар | Сумма | Действия) ──
const cols = [
    { key: 'select', label: '', width: 'var(--size-32)', align: 'center' },
    { key: 'date', label: 'Дата', width: 'var(--size-96)', sortable: true },
    { key: 'title', label: 'Наименование' },
    { key: 'type', label: 'Тип расхода' },
    { key: 'category', label: 'Категория' },
    { key: 'products', label: 'Товар', width: '28%' },
    { key: 'amount', label: 'Сумма', width: 'var(--size-128)' },
    { key: 'actions', label: 'Действия', width: 'var(--size-64)', align: 'center' },
];

// ── Реальные строки расходов (account 4, /expenses; состав/итоги сверены с расходы__список@wb.png) ──
// Строки-итоги месяца помечены isSummary — DsTable рисует их жирными (group-key).
const rows = [
    { id: 1, date: '11.06.2026', title: 'Фото товара', type: 'Единоразовый', category: '', products: ['270887', '324734', '306649'], amount: '20 000,00 ₽' },
    { id: 2, date: '04.06.2026', title: 'Фото товара', type: 'Ежемесячный', category: '', products: ['287632', '671002', '966654', '772480'], amount: '30 000,00 ₽' },
    { id: 's-jun', isSummary: true, summaryLabel: 'Всего в июне:', amount: '50 000,00 ₽' },
    { id: 3, date: '18.05.2026', title: 'Аренда склада', type: 'Ежемесячный', category: '', products: ['952235', '449868', '324734'], amount: '30 000,00 ₽' },
    { id: 4, date: '04.05.2026', title: 'Фото товара', type: 'Ежемесячный', category: '', products: ['287632', '671002', '966654', '772480'], amount: '30 000,00 ₽' },
    { id: 's-may', isSummary: true, summaryLabel: 'Всего в мае:', amount: '60 000,00 ₽' },
    { id: 5, date: '18.04.2026', title: 'Аренда склада', type: 'Ежемесячный', category: '', products: ['952235', '449868', '324734'], amount: '30 000,00 ₽' },
    { id: 's-apr', isSummary: true, summaryLabel: 'Всего в апреле:', amount: '30 000,00 ₽' },
];
</script>

<style scoped>
/* ── Каркас: лого / топбар / аккаунт (как в Screens/Products.vue) ── */
.brand { font-size: var(--font-size-body-s); font-weight: var(--font-weight-bold); color: var(--brand); }
.topbar { display: inline-flex; align-items: center; gap: var(--size-24); }
.topbar__page { color: var(--text-heading); }
.topbar__ico { color: var(--text-muted); font-size: var(--font-size-heading-m); cursor: pointer; }

/* Без своего паддинга — отступ страницы задаёт AppShell content. */
.screen { display: flex; flex-direction: column; gap: var(--size-16); }

.hint-thumb { display: block; width: 96px; height: 56px; border-radius: var(--radius-sm); background: var(--brand-gradient); }

/* ── Верхний тулбар ── */
.bar { display: flex; align-items: center; gap: var(--size-16); flex-wrap: wrap; }
.bar__search { flex: 1 1 auto; max-width: 620px; }
.bar__select { width: 240px; max-width: 100%; }

/* Круглая кнопка-период (реал — синяя круглая кнопка с календарём справа) */
/* Круглая кнопка периода — 48×48 (единый размер с Дэшбордом, реал dashboard-nav__btn 48) */
.bar__period {
    flex: 0 0 auto; margin-left: auto;
    width: var(--size-48); height: var(--size-48);
    border: 0; border-radius: var(--radius-full);
    background: var(--brand); color: var(--white); cursor: pointer;
}
.bar__period:hover { background: var(--brand-hover); }

/* Круглая воронка (мобайл) — открывает full-screen фильтр */
.bar__funnel {
    flex: 0 0 auto; margin-left: auto;
    width: var(--control-height-md); height: var(--control-height-md);
    border: 0; border-radius: var(--radius-full);
    background: var(--brand); color: var(--white); cursor: pointer;
}
.bar__mobile-only { display: none; }
@media (max-width: 767.98px) {
    .bar__desktop-only { display: none; }
    .bar__mobile-only { display: inline-flex; align-items: center; justify-content: center; }
}

/* ── Ячейки таблицы ── */
.muted { color: var(--text-muted); }
.products { white-space: normal; }
.products__link { color: var(--brand); text-decoration: none; }
.products__link:hover { text-decoration: underline; }

/* Строка-итог месяца «Всего в …»: вес 600 + muted #555 (реал total_table_row — не тёмный heading) */
.summary-label { display: block; white-space: nowrap; font-weight: var(--font-weight-semibold); color: var(--text-default); }
.summary-total { font-weight: var(--font-weight-semibold); color: var(--text-default); }

.action-btn { border: 0; background: transparent; color: var(--text-muted); font-size: var(--font-size-title-m); line-height: 1; cursor: pointer; }
.action-btn:hover { color: var(--brand); }

/* Пустое состояние */
.empty { display: flex; flex-direction: column; align-items: center; gap: var(--size-8); padding: var(--size-48) var(--size-16); text-align: center; }
.empty__icon { font-size: var(--font-size-heading-l); color: var(--text-placeholder); }
.empty__title { color: var(--text-heading); }
.empty__text { color: var(--text-muted); }

/* ── Панель действий / пагинация / подвал ── */
.actions { display: flex; justify-content: flex-start; gap: var(--size-8); flex-wrap: wrap; }
.support { text-align: center; color: var(--text-muted); }
.support__link { color: var(--brand); text-decoration: none; }
.support__link:hover { text-decoration: underline; }

/* ── Форма расхода (реал info-list) ── */
.form { display: flex; flex-direction: column; gap: var(--size-16); }
.form__row { display: flex; gap: var(--size-16); }
.form__field { display: flex; flex-direction: column; gap: var(--size-6); }
.form__label { color: var(--text-default); }

/* Комбо-строка «Товары» с шевроном (реал info-list__input_combo) */
.form__combo {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: var(--size-12) 0;
    border: 0; border-top: 1px solid var(--border-default);
    background: transparent; cursor: pointer;
}
.form__combo-label { color: var(--text-default); }
.form__combo-value { display: inline-flex; align-items: center; gap: var(--size-8); }
.form__combo-count { color: var(--text-muted); font-size: var(--font-size-body-s); }
.form__combo-chevron { color: var(--text-muted); }

@media (max-width: 575.98px) { .form__row { flex-direction: column; } }

/* ── Модалка периода (реал — сетка кнопок-выбора) ── */
.period { display: grid; grid-template-columns: 1fr 1fr; gap: var(--size-12); }
.period__btn {
    display: flex; align-items: center; justify-content: space-between;
    padding: var(--size-12) var(--size-16);
    border: 1px solid var(--border-default); border-radius: var(--radius-md);
    background: var(--surface-default); color: var(--text-default);
    font-size: var(--font-size-body-s); cursor: pointer;
    transition: border-color var(--transition-fast) var(--ease-standard);
}
.period__btn:hover { border-color: var(--border-strong); }
.period__btn.is-active { background: var(--brand); border-color: var(--brand); color: var(--white); }
.period__btn:last-child { grid-column: 1 / -1; }
.period__check { color: var(--white); }
.period__apply { width: 100%; }

.del-text { color: var(--text-default); text-align: center; }
</style>
