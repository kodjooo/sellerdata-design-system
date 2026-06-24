<template>
    <Head title="Самовыкупы — экран-эталон" />
    <ScreenShell active="redeems" title="Самовыкупы">
        <div class="screen">
            <!-- Онбординг-баннер раздела (реал: BreezeDashboardInfo — текст про самовыкупы) -->
            <DsNotice v-model:visible="hintOpen" tone="plain" collapse-mobile>
                <template #media><span class="hint-thumb" aria-hidden="true"></span></template>
                Раздел для управления данными о самовыкупах. Здесь вы можете отметить заказы, которые выкупали
                самостоятельно, чтобы повысить рейтинг ваших товарных карточек в поисковой выдаче маркетплейса. Также
                можно указать стоимость услуги по осуществлению выкупа и отметить, был ли получен отзыв по данному заказу.
                Отмеченные как самовыкуп заказы не будут учитываться в расчете дохода, а удержания торговой площадки и
                стоимость услуги самовыкупа будут учтены при расчете затрат и чистой прибыли. По этим заказам не будет
                списана себестоимость, так как считается, что товар вернулся на склад.
            </DsNotice>

            <!-- Верхний тулбар: поиск по номеру заказа (слева) + круглая кнопка-период (справа).
                 Мобайл: поиск уходит в воронку (full-screen фильтр), период — отдельной модалкой. -->
            <div class="bar">
                <DsInput
                    v-model="query"
                    placeholder="Поиск по номеру заказа"
                    suffix-icon="fm-search"
                    class="bar__search bar__desktop-only"
                />
                <DsIconButton icon="fm-calendar" size="lg" aria-label="Период" class="bar__period bar__desktop-only" @click="periodOpen = true" />
                <DsIconButton icon="fm-filter" aria-label="Фильтр" class="bar__funnel bar__mobile-only" @click="filterOpen = true" />
            </div>

            <!-- Таблица самовыкупов с группировкой по месяцам (строка-итог «Всего в …»).
                 Колонки сверены с реалом (redeems-table); «Сумма реализации» — только WB. -->
            <DsCard radius="md" padding="--size-2" bleed-mobile>
                <DsTable
                    :columns="cols"
                    :rows="rows"
                    row-key="id"
                    group-key="isSummary"
                    default-sort-key="order"
                    mobile-mode="compact"
                    :mobile-columns="['select', 'order', 'price']"
                    detail-title="Самовыкуп"
                >
                    <!-- Чекбокс «выбрать все» в шапке -->
                    <template #head-select>
                        <DsCheckbox v-model="allSelected" />
                    </template>

                    <!-- Заголовок «Сумма заказа» с info-иконкой (реал — tippy «по цене продавца») -->
                    <template #head-orderSum>
                        Сумма заказа <span class="fm-info head-info" aria-hidden="true"></span>
                    </template>
                    <!-- Заголовок «Сумма реализации» с info-иконкой (реал — «по цене покупателя») -->
                    <template #head-saleSum>
                        Сумма реализации <span class="fm-info head-info" aria-hidden="true"></span>
                    </template>
                    <template #head-fee>
                        Стоимость <span class="head-soft">услуги</span>
                    </template>

                    <!-- Чекбокс выбора строки (в строках-итогах не показываем) -->
                    <template #cell-select="{ row }">
                        <DsCheckbox v-if="!row.isSummary" v-model="selected" :value="row.id" />
                    </template>

                    <!-- Заказ: номер с копированием + дата + кол-во позиций (реал item__order) -->
                    <template #cell-order="{ row }">
                        <template v-if="row.isSummary">
                            <span class="summary-label">{{ row.summaryLabel }}</span>
                        </template>
                        <div v-else class="order">
                            <div class="order__id">
                                <DsCopyButton :text="row.srId" />
                                <span class="order__num">{{ row.srId }}</span>
                            </div>
                            <div class="order__date">{{ row.date }}</div>
                            <div v-if="row.positions" class="order__positions">Позиций: {{ row.positions }}</div>
                        </div>
                    </template>

                    <!-- Сумма заказа -->
                    <template #cell-orderSum="{ row }">
                        <span v-if="!row.isSummary">{{ row.orderSum }}</span>
                    </template>

                    <!-- Сумма реализации (только WB) -->
                    <template #cell-saleSum="{ row }">
                        <span v-if="!row.isSummary">{{ row.saleSum }}</span>
                    </template>

                    <!-- Дата выкупа: «—» в неактивном поле, если не задана (реал inner-text-block__btn disabled) -->
                    <template #cell-redeemDate="{ row }">
                        <span v-if="row.isSummary"></span>
                        <span v-else-if="!row.redeemDate" class="redeem-date redeem-date--empty">—</span>
                        <span v-else class="redeem-date">{{ row.redeemDate }}</span>
                    </template>

                    <!-- Удержания (в строке-итоге — сумма удержаний за месяц) -->
                    <template #cell-deductions="{ row }">
                        <span :class="{ 'summary-total': row.isSummary }">{{ row.deductions }}</span>
                    </template>

                    <!-- Стоимость услуги — инлайн-поле (реал product-cost-input). В итоге — сумма за месяц. -->
                    <template #cell-fee="{ row }">
                        <span v-if="row.isSummary" class="summary-total">{{ row.fee }}</span>
                        <DsInput v-else v-model="row.fee" placeholder="0" class="inline-field" />
                    </template>

                    <!-- Выкупщик — инлайн-поле (реал product-cost-input текстовый) -->
                    <template #cell-redeemer="{ row }">
                        <DsInput v-if="!row.isSummary" v-model="row.redeemer" placeholder="ООО «Выкупщик WB»" class="inline-field" />
                    </template>

                    <!-- Товар не вернулся — чекбокс по центру -->
                    <template #cell-notReturned="{ row }">
                        <DsCheckbox v-if="!row.isSummary" v-model="row.notReturned" />
                    </template>

                    <!-- Отзыв получен — чекбокс по центру -->
                    <template #cell-feedback="{ row }">
                        <DsCheckbox v-if="!row.isSummary" v-model="row.feedback" />
                    </template>

                    <!-- Служебная колонка «Действия» → раскрыть/редактировать самовыкуп -->
                    <template #cell-actions="{ row }">
                        <button
                            v-if="!row.isSummary"
                            type="button"
                            class="action-btn fm-chevron-right"
                            aria-label="Изменить"
                            @click="openEdit(row)"
                        ></button>
                    </template>

                    <template #empty>
                        <div class="empty">
                            <span class="empty__icon fm-rotate-ccw" aria-hidden="true"></span>
                            <p class="t-heading-m empty__title">Заказы отсутствуют</p>
                            <p class="t-body-s empty__text">Добавьте заказы, которые были выкуплены</p>
                            <DsButton variant="primary" @click="openCreate">Добавить</DsButton>
                        </div>
                    </template>
                </DsTable>
            </DsCard>
        </div>

        <!-- Нижний закреплённый бар действий (реал buttons-panel) -->
        <template #bottombar>
            <DsStickyBar class="actions">
                <DsButton v-if="selected.length" variant="primary" @click="deleteOpen = true">Удалить</DsButton>
                <DsButton v-else variant="primary" @click="openCreate">Добавить</DsButton>
            </DsStickyBar>
        </template>

        <!-- ─── Модалка редактирования самовыкупа (реал: redeemCreate, режим «Изменить») ───
             Шапка с заказом → блок read-only показателей (DsInfoList) → редактируемые поля. -->
        <DsModal v-model="editOpen" title="Изменить Самовыкуп" size="sm">
            <div class="form">
                <!-- Заказ: номер с копированием + дата/сумма (реал item__product-id) -->
                <div class="form__order">
                    <span class="form__order-label t-label-m">Заказ</span>
                    <div class="form__order-id">
                        <DsCopyButton :text="editing.srId" />
                        <span class="form__order-num">{{ editing.srId }}</span>
                    </div>
                    <div class="form__order-sub t-caption">{{ editing.date }} / Сумма заказа: {{ editing.orderSum }}</div>
                </div>

                <!-- Read-only показатели заказа (реал info-list__input_dasibled) -->
                <DsInfoList flat :items="editInfo" />

                <!-- Редактируемые поля -->
                <DsInput v-model="editing.fee" label="Стоимость услуги" placeholder="0" inline />
                <DsInput v-model="editing.redeemer" label="Выкупщик" placeholder="ООО «Выкупщик WB»" inline />
                <DsCheckbox v-model="editing.notReturned" label="Товар не вернулся" />
                <DsCheckbox v-model="editing.feedback" label="Отзыв получен" />
            </div>

            <template #footer>
                <DsButton variant="secondary" @click="deleteOpen = true">Удалить</DsButton>
                <DsButton variant="primary" @click="editOpen = false">Сохранить</DsButton>
            </template>
        </DsModal>

        <!-- ─── Модалка создания самовыкупа (реал: redeemAdd) ───
             Поиск заказов + чекбоксы выбора. Здесь — компактный мок мультивыбора заказов. -->
        <DsModal v-model="createOpen" title="Добавить Самовыкуп" size="sm">
            <div class="create">
                <DsInput v-model="createSearch" placeholder="Номер заказа, артикул или баркод" />
                <div class="create__list">
                    <label v-for="o in createOrders" :key="o.srId" class="create__item">
                        <DsCheckbox v-model="createSelected" :value="o.srId" />
                        <span class="create__item-body">
                            <span class="create__item-id">
                                <DsCopyButton :text="o.srId" />
                                <span class="create__item-num">{{ o.srId }}</span>
                            </span>
                            <span class="create__item-sub t-caption">{{ o.date }} / Сумма заказа: {{ o.orderSum }}</span>
                        </span>
                    </label>
                </div>
            </div>
            <template #footer>
                <DsButton variant="primary" class="cta-full" :disabled="!createSelected.length" @click="createOpen = false">Сохранить</DsButton>
            </template>
        </DsModal>

        <!-- ─── Модалка выбора периода (реал: самовыкупы__модалка-фильтр) ─── -->
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
        <DsModal v-model="deleteOpen" title="Подтверждение" size="sm">
            <p class="t-body-l del-text">Вы уверены?</p>
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
    </ScreenShell>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import ScreenShell from './ScreenShell.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsIconButton from '@/Components/Ds/DsIconButton.vue';
import DsInput from '@/Components/Ds/DsInput.vue';
import DsCheckbox from '@/Components/Ds/DsCheckbox.vue';
import DsTable from '@/Components/Ds/DsTable.vue';
import DsModal from '@/Components/Ds/DsModal.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';
import DsInfoList from '@/Components/Ds/DsInfoList.vue';
import DsCopyButton from '@/Components/Ds/DsCopyButton.vue';
import DsFilterSheet from '@/Components/Ds/DsFilterSheet.vue';
import DsStickyBar from '@/Components/Ds/DsStickyBar.vue';

const hintOpen = ref(true);
const query = ref('');

const allSelected = ref(false);
const selected = ref([]);

// ── Тулбар-модалки/листы ──
const periodOpen = ref(false);
const period = ref('Три месяца');
const periodOptions = ['Один месяц', 'Три месяца', 'Шесть месяцев', 'Текущий год', 'Произвольный период'];

const filterOpen = ref(false);
const filterItems = [
    { key: 'query', label: 'Поиск по номеру заказа', icon: 'fm-search' },
    { key: 'period', label: 'Период', icon: 'fm-calendar' },
];

// ── Колонки таблицы (реал redeems-table, WB):
// чекбокс | Заказы | Сумма заказа | Сумма реализации | Дата выкупа | Удержания |
// Стоимость услуги | Выкупщик | Товар не вернулся | Отзыв получен | Действия ──
const cols = [
    { key: 'select', label: '', width: 'var(--size-32)', align: 'center' },
    { key: 'order', label: 'Заказы' },
    { key: 'orderSum', label: 'Сумма заказа', width: 'var(--size-128)' },
    { key: 'saleSum', label: 'Сумма реализации', width: 'var(--size-128)' },
    { key: 'redeemDate', label: 'Дата выкупа', width: 'var(--size-128)' },
    { key: 'deductions', label: 'Удержания', width: 'var(--size-96)' },
    { key: 'fee', label: 'Стоимость услуги', width: 'var(--size-128)' },
    { key: 'redeemer', label: 'Выкупщик', width: '18%' },
    { key: 'notReturned', label: 'Товар не вернулся', width: 'var(--size-96)', align: 'center' },
    { key: 'feedback', label: 'Отзыв получен', width: 'var(--size-96)', align: 'center' },
    { key: 'actions', label: 'Действия', width: 'var(--size-64)', align: 'center' },
];

// ── Реальные строки (account 4, /redeems; состав/итоги сверены с самовыкупы__список@wb.png) ──
// Строки-итоги месяца помечены isSummary — DsTable рисует их выделенными (group-key).
const rows = ref([
    { id: 1, srId: 'eAr.rbbd58f30...', date: '11.06.2026', positions: 1, orderSum: '1 020,00 ₽', saleSum: '702,00 ₽', redeemDate: '', deductions: '0,00 ₽', fee: '', redeemer: '', notReturned: false, feedback: false },
    { id: 2, srId: 'eBR.i3719e710...', date: '11.06.2026', positions: 1, orderSum: '9 895,94 ₽', saleSum: '5 866,00 ₽', redeemDate: '', deductions: '0,00 ₽', fee: '', redeemer: '', notReturned: false, feedback: false },
    { id: 's-jun', isSummary: true, summaryLabel: 'Всего в июне:', deductions: '0,00 ₽', fee: '0,00 ₽' },
    { id: 3, srId: 'eAr.i311e06cf...', date: '24.05.2026', positions: 1, orderSum: '4 965,43 ₽', saleSum: '2 682,00 ₽', redeemDate: '30.05.2026', deductions: '1 761,59 ₽', fee: '500', redeemer: 'Ирина', notReturned: true, feedback: true },
    { id: 4, srId: '591465691244...', date: '17.05.2026', positions: 1, orderSum: '3 026,40 ₽', saleSum: '1 933,00 ₽', redeemDate: '19.05.2026', deductions: '1 254,46 ₽', fee: '400', redeemer: '', notReturned: false, feedback: false },
    { id: 5, srId: 'eB0.i48d4d31...', date: '17.05.2026', positions: 3, orderSum: '4 914,00 ₽', saleSum: '3 339,00 ₽', redeemDate: '', deductions: '351,30 ₽', fee: '500', redeemer: '', notReturned: true, feedback: false },
    { id: 6, srId: 'es.r87779fe9f...', date: '17.05.2026', positions: 1, orderSum: '1 322,31 ₽', saleSum: '1 068,69 ₽', redeemDate: '19.05.2026', deductions: '1 111,07 ₽', fee: '120', redeemer: '', notReturned: true, feedback: false },
    { id: 's-may', isSummary: true, summaryLabel: 'Всего в мае:', deductions: '4 478,42 ₽', fee: '1 520,00 ₽' },
]);

// ── Модалка редактирования ──
const editOpen = ref(false);
const editing = ref({});
const editInfo = computed(() => [
    { label: 'Дата заказа', value: editing.value.date },
    { label: 'Дата выкупа', value: editing.value.redeemDate || '—' },
    { label: 'Сумма заказа', value: editing.value.orderSum, info: true },
    { label: 'Сумма реализации', value: editing.value.saleSum, info: true },
    { label: 'Удержания', value: editing.value.deductions },
]);

function openEdit(row) {
    editing.value = row;
    editOpen.value = true;
}

// ── Модалка создания ──
const createOpen = ref(false);
const createSearch = ref('');
const createSelected = ref([]);
const createOrders = [
    { srId: 'eAr.c1311e06cf...', date: '24.05.2026', orderSum: '4 965,43 ₽' },
    { srId: '591465691244...', date: '17.05.2026', orderSum: '3 026,40 ₽' },
    { srId: 'eB0.i48d4d31...', date: '17.05.2026', orderSum: '4 914,00 ₽' },
];

function openCreate() {
    createSelected.value = [];
    createSearch.value = '';
    createOpen.value = true;
}

const deleteOpen = ref(false);
</script>

<style scoped>
/* Без своего паддинга — отступ страницы задаёт AppShell content. */
.screen { display: flex; flex-direction: column; gap: var(--size-16); }

.hint-thumb { display: block; width: 96px; height: 56px; border-radius: var(--radius-sm); background: var(--brand-gradient); }

/* ── Верхний тулбар ── */
.bar { display: flex; align-items: center; gap: var(--size-16); flex-wrap: wrap; }
.bar__search { flex: 1 1 auto; max-width: 620px; }

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

/* ── Заголовки колонок ── */
.head-info { color: var(--text-placeholder); font-size: var(--font-size-body-s); margin-left: var(--size-4); }
.head-soft { color: var(--text-muted); }

/* ── Ячейка «Заказ» (реал item__order) ── */
.order { display: flex; flex-direction: column; gap: var(--size-2); }
.order__id { display: inline-flex; align-items: center; gap: var(--size-6); }
.order__num { color: var(--text-default); }
.order__date { color: var(--text-default); }
.order__positions { color: var(--text-muted); font-size: var(--font-size-body-s); }

/* Дата выкупа: пустая — плейсхолдер «—» в неактивном поле (реал disabled input) */
.redeem-date { color: var(--text-default); }
.redeem-date--empty {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: var(--size-64); padding: var(--size-6) var(--size-12);
    border-radius: var(--radius-sm); background: var(--surface-muted); color: var(--text-placeholder);
}

/* Инлайн-поле в ячейке (стоимость услуги / выкупщик) */
.inline-field { width: 100%; }

/* Строка-итог месяца «Всего в …»: вес 600 (реал total_table_row) */
.summary-label { display: block; white-space: nowrap; font-weight: var(--font-weight-semibold); color: var(--text-default); }
.summary-total { font-weight: var(--font-weight-semibold); color: var(--text-default); }

.action-btn { border: 0; background: transparent; color: var(--text-muted); font-size: var(--font-size-title-m); line-height: 1; cursor: pointer; }
.action-btn:hover { color: var(--brand); }

/* Пустое состояние (реал empty_banner — «Заказы отсутствуют») */
.empty { display: flex; flex-direction: column; align-items: center; gap: var(--size-8); padding: var(--size-48) var(--size-16); text-align: center; }
.empty__icon { font-size: var(--font-size-heading-l); color: var(--text-placeholder); }
.empty__title { color: var(--text-heading); }
.empty__text { color: var(--text-muted); }

/* ── Панель действий / подвал ── */
.actions { display: flex; justify-content: flex-start; gap: var(--size-8); flex-wrap: wrap; }
.support { text-align: center; color: var(--text-muted); }
.support__link { color: var(--brand); text-decoration: none; }
.support__link:hover { text-decoration: underline; }

/* ── Форма редактирования (реал info-list) ── */
.form { display: flex; flex-direction: column; gap: var(--size-16); }
.form__order { display: flex; flex-direction: column; gap: var(--size-4); }
.form__order-label { color: var(--text-muted); }
.form__order-id { display: inline-flex; align-items: center; gap: var(--size-6); }
.form__order-num { color: var(--text-default); font-weight: var(--font-weight-medium); }
.form__order-sub { color: var(--text-muted); }

/* ── Модалка создания (реал multi-select) ── */
.create { display: flex; flex-direction: column; gap: var(--size-16); }
.create__list { display: flex; flex-direction: column; }
.create__item {
    display: flex; align-items: flex-start; gap: var(--size-12);
    padding: var(--size-12) 0; border-top: 1px solid var(--border-default); cursor: pointer;
}
.create__item-body { display: flex; flex-direction: column; gap: var(--size-2); }
.create__item-id { display: inline-flex; align-items: center; gap: var(--size-6); }
.create__item-num { color: var(--text-default); }
.create__item-sub { color: var(--text-muted); }

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

/* CTA во всю ширину футера (модалка создания — одна кнопка «Сохранить»). */
.cta-full { width: 100%; }
</style>
