<template>
    <Head title="Настройки — экран-эталон" />
    <ScreenShell active="settings" title="Общие">
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
        </div>

        <!-- ─── Модалка «Изменение подключения» (реал UpdateAccountApiKeyLink) ─── -->
        <DsModal v-model="keyOpen" size="sm">
            <template #header>
                <div class="key-head">
                    <h2 class="t-title-m key-head__title">Изменение подключения</h2>
                    <span class="t-body-s key-head__sub">{{ keyStore.service }} · {{ keyStore.title }}</span>
                </div>
            </template>

            <!-- Текущее состояние ключа — зелёный success-бокс (реал) -->
            <DsNotice tone="success" :dismissible="false" class="key-status">
                <template #media><span class="key-status__ico fm-check-circle" aria-hidden="true"></span></template>
                <strong class="t-label-m key-status__title">Подключено по API-ключу</strong>
                <span class="t-body-s key-status__sub">Ключ активен до 7 дек. 2026 г.</span>
            </DsNotice>

            <p class="t-label-m key-section">Выберите действие</p>

            <!-- Радио-выбор действия: OAuth vs обновить ключ (DsOptionCard — карточки-варианты) -->
            <DsOptionCard
                v-for="opt in keyActions"
                :key="opt.key"
                class="key-opt"
                :icon="opt.icon"
                :title="opt.title"
                :sub="opt.sub"
                :selected="keyAction === opt.key"
                @select="keyAction = opt.key"
            />

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
    </ScreenShell>
</template>

<script setup>
import { ref } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import ScreenShell from './ScreenShell.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsInput from '@/Components/Ds/DsInput.vue';
import DsSelect from '@/Components/Ds/DsSelect.vue';
import DsCheckbox from '@/Components/Ds/DsCheckbox.vue';
import DsModal from '@/Components/Ds/DsModal.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';
import DsOptionCard from '@/Components/Ds/DsOptionCard.vue';

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
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

.screen { display: flex; flex-direction: column; gap: var(--size-16); }

/* Под-меню настроек (underline-вкладки на Link, единый паттерн на 3 страницах) */
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
    /* Ряд без переноса: имя | пилюли (переносятся ВНУТРИ) | действия справа сверху (реал). */
    display: flex; align-items: flex-start; gap: var(--size-16);
    padding: var(--size-16) var(--size-24);
    border: 1px solid var(--border-default); border-radius: var(--radius-md);
    background: var(--surface-default);
    flex-wrap: nowrap;
}
/* Мобайл: карточка магазина — в стопку; действия плотнее, чтобы «Удалить» не обрезался. */
@media (max-width: 767.98px) {
    .store { flex-wrap: wrap; }
    .store__actions { gap: var(--size-12); flex: 1 1 100%; }
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

.store__actions { display: flex; align-items: center; gap: var(--size-24); flex-wrap: wrap; flex: 0 0 auto; }
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
/* Блок подтверждения почты — карточка (фон+рамка) для читаемости (реал). */
.email { display: flex; flex-direction: column; gap: var(--size-6); align-items: flex-start; padding: var(--size-20) var(--size-24); border: 1px solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-subtle); }
.email__title { color: var(--text-default); font-size: var(--font-size-title-m); }
.email__text { color: var(--text-default); }
.email__btn { margin-top: var(--size-8); }

/* ── Модалка «Изменить ключ» ── */
.key-help { display: inline-block; margin-top: var(--size-8); color: var(--brand); text-decoration: none; }
.key-help:hover { text-decoration: underline; }
.key-head { display: flex; flex-direction: column; gap: var(--size-2); min-width: 0; }
.key-head__title { color: var(--text-on-brand); margin: 0; }
.key-head__sub { color: var(--text-on-brand); opacity: var(--opacity-hover); }

/* Фон/рамку зелёного бокса задаёт DsNotice tone="success" (компонент); здесь только отступ. */
.key-status { margin-bottom: var(--size-16); }
.key-status__ico { color: var(--notice-success-text); font-size: var(--font-size-heading-m); }
.key-status__title { display: block; color: var(--notice-success-text); }
.key-status__sub { display: block; color: var(--text-default); }
.key-section { color: var(--text-heading); margin-bottom: var(--size-8); }

/* Карточки действия с ключом (DsOptionCard): иконка в цветном боксе + отступ между ними. */
.key-opt { margin-bottom: var(--size-8); }
.key-opt :deep(.ds-option__icon) {
    width: var(--size-40); height: var(--size-40); border-radius: var(--radius-md);
    background: var(--surface-subtle); font-size: var(--font-size-title-m);
}
.key-opt.is-selected :deep(.ds-option__icon) { background: rgb(from var(--white) r g b / 0.2); }
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
</style>
