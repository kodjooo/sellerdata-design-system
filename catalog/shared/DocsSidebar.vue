<template>
    <aside class="dsSidebar">
        <div class="dsSidebar__brand">
            <Link :href="route('designSystem.index')" class="dsSidebar__brandLink">
                Sellerdata DS
            </Link>
            <div class="dsSidebar__brandVersion">v1.0.0</div>
        </div>

        <nav class="dsSidebar__nav">
            <div class="dsSidebar__group">
                <Link
                    :href="route('designSystem.index')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.index') }"
                >
                    Главная
                </Link>
            </div>

            <div class="dsSidebar__group">
                <div class="dsSidebar__groupTitle">Foundations</div>
                <Link
                    :href="route('designSystem.colors')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.colors') }"
                >
                    Цвета
                </Link>
                <Link
                    :href="route('designSystem.typography')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.typography') }"
                >
                    Типографика
                </Link>
                <Link
                    :href="route('designSystem.shadows')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.shadows') }"
                >
                    Тени
                </Link>
                <Link
                    :href="route('designSystem.spacing')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.spacing') }"
                >
                    Размеры и отступы
                </Link>
                <Link
                    :href="route('designSystem.radius')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.radius') }"
                >
                    Радиусы
                </Link>
                <Link
                    :href="route('designSystem.icons')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.icons') }"
                >
                    Иконки
                </Link>
            </div>

            <div class="dsSidebar__group">
                <div class="dsSidebar__groupTitle">Компоненты</div>
                <Link
                    v-for="c in components"
                    :key="c.route"
                    :href="route(c.route)"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive(c.route) }"
                >
                    {{ c.label }}
                </Link>
            </div>

            <div class="dsSidebar__group">
                <div class="dsSidebar__groupTitle">Паттерны</div>
                <Link
                    :href="route('designSystem.sandbox')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.sandbox') }"
                >
                    Песочница дизайнов
                </Link>
                <Link
                    :href="route('designSystem.patterns')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.patterns') }"
                >
                    Эталоны-композиции
                </Link>
                <Link
                    :href="route('designSystem.screenDashboard')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenDashboard') }"
                >
                    Экран: Дэшборд
                </Link>
                <Link
                    :href="route('designSystem.screenProducts')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenProducts') }"
                >
                    Экран: Товары
                </Link>
                <Link
                    :href="route('designSystem.screenWarehouse')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenWarehouse') }"
                >
                    Экран: Склад
                </Link>
                <Link
                    :href="route('designSystem.screenAdvertising')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenAdvertising') }"
                >
                    Экран: Реклама
                </Link>
                <Link
                    :href="route('designSystem.screenExpenses')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenExpenses') }"
                >
                    Экран: Расходы
                </Link>
                <Link
                    :href="route('designSystem.screenRedeems')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenRedeems') }"
                >
                    Экран: Самовыкупы
                </Link>
                <Link
                    :href="route('designSystem.screenSettings')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenSettings') }"
                >
                    Экран: Настройки
                </Link>
                <Link
                    :href="route('designSystem.screenSettingsBilling')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenSettingsBilling') }"
                >
                    Экран: Настройки · Оплата
                </Link>
                <Link
                    :href="route('designSystem.screenSettingsReferral')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenSettingsReferral') }"
                >
                    Экран: Настройки · Пригласи друга
                </Link>
                <Link
                    :href="route('designSystem.screenAuth')"
                    class="dsSidebar__link"
                    :class="{ '_isActive': isActive('designSystem.screenAuth') }"
                >
                    Экран: Auth / Onboarding
                </Link>
            </div>
        </nav>
    </aside>
</template>

<script setup>
import { Link, usePage } from '@inertiajs/vue3';

const page = usePage();

// Каталог компонентов — единый список для сайдбара.
const components = [
    { route: 'designSystem.buttons',     label: 'Кнопки' },
    { route: 'designSystem.inputs',      label: 'Поля ввода' },
    { route: 'designSystem.selects',     label: 'Селекты' },
    { route: 'designSystem.checkboxes',  label: 'Чекбоксы и радио' },
    { route: 'designSystem.tags',        label: 'Теги' },
    { route: 'designSystem.cards',       label: 'Карточки' },
    { route: 'designSystem.table',       label: 'Таблица' },
    { route: 'designSystem.productCell', label: 'Ячейка товара' },
    { route: 'designSystem.infoList',    label: 'Список показателей' },
    { route: 'designSystem.modal',       label: 'Модалка' },
    { route: 'designSystem.toast',       label: 'Тост' },
    { route: 'designSystem.notice',      label: 'Баннер-подсказка' },
    { route: 'designSystem.filterSheet', label: 'Мобильный фильтр' },
    { route: 'designSystem.stickyBar',   label: 'Панель действий снизу' },
    { route: 'designSystem.iconButton',  label: 'Иконочная кнопка' },
    { route: 'designSystem.supportFooter', label: 'Подвал поддержки' },
    { route: 'designSystem.loader',      label: 'Загрузка' },
    { route: 'designSystem.emptyState',  label: 'Пустое состояние' },
    { route: 'designSystem.switch',      label: 'Переключатель' },
    { route: 'designSystem.dateRangePicker', label: 'Период / диапазон' },
    { route: 'designSystem.multiSelectAccordion', label: 'Мультивыбор' },
    { route: 'designSystem.toastStack',  label: 'Стек тостов' },
    { route: 'designSystem.syncStatus',  label: 'Статус синхронизации' },
    { route: 'designSystem.notifications', label: 'Уведомления' },
    { route: 'designSystem.helpMenu',    label: 'Меню помощи' },
    { route: 'designSystem.progressBar', label: 'Прогресс-бар' },
    { route: 'designSystem.fileDrop',    label: 'Загрузка файлов' },
    { route: 'designSystem.pricing',     label: 'Тарифы' },
    { route: 'designSystem.authForm',    label: 'Форма входа' },
    { route: 'designSystem.connection',  label: 'Подключение магазина' },
    { route: 'designSystem.stepper',     label: 'Шаги-инструкция' },
    { route: 'designSystem.errorPage',   label: 'Страница ошибки' },
    { route: 'designSystem.serviceBanner', label: 'Сервис недоступен' },
    { route: 'designSystem.videoBanner', label: 'Видео-баннер' },
    { route: 'designSystem.groupBy', label: 'Группировка' },
    { route: 'designSystem.optionCard', label: 'Карточка-вариант' },
    { route: 'designSystem.popover',     label: 'Поповер' },
    { route: 'designSystem.accountMenu', label: 'Меню аккаунта' },
    { route: 'designSystem.notificationMenu', label: 'Меню уведомлений' },
    { route: 'designSystem.pagination',  label: 'Пагинация' },
    { route: 'designSystem.tabs',        label: 'Табы' },
    { route: 'designSystem.tooltips',    label: 'Тултипы' },
    { route: 'designSystem.diagrams',    label: 'Диаграммы' },
];

function isActive(routeName) {
    // Inertia передаёт текущий URL через page.url; матчинг делаем по сравнению путей.
    const current = page.url || '';
    const target = route(routeName, [], false);
    if (routeName === 'designSystem.index') {
        return current === target || current === target + '/';
    }
    return current === target || current.startsWith(target + '/');
}
</script>

<style scoped>
.dsSidebar {
    position: sticky;
    top: 0;
    align-self: start;
    width: 240px;
    flex-shrink: 0;
    height: 100vh;
    overflow-y: auto;
    padding: 24px 16px;
    background: var(--surface-default);
    border-right: 1px solid var(--border-default);
}

.dsSidebar__brand {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-default);
}

.dsSidebar__brandLink {
    font-family: var(--font-family-sans);
    font-size: var(--font-size-title-m);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
    color: var(--text-heading);
    text-decoration: none;
}
.dsSidebar__brandLink:hover {
    color: var(--brand);
}

.dsSidebar__brandVersion {
    font-size: var(--font-size-caption);
    color: var(--text-muted);
    margin-top: 2px;
}

.dsSidebar__nav {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.dsSidebar__group {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.dsSidebar__groupTitle {
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-tight);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    padding: 0 10px;
}

.dsSidebar__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 6px;
    font-family: var(--font-family-sans);
    font-size: var(--font-size-body-s);
    line-height: var(--line-height-tight);
    color: var(--text-default);
    text-decoration: none;
    transition: background-color .15s ease, color .15s ease;
}
.dsSidebar__link:hover {
    background: var(--surface-muted);
    color: var(--text-heading);
    text-decoration: none;
}
.dsSidebar__link._isActive {
    background: var(--surface-muted);
    color: var(--brand);
}
.dsSidebar__link._isActive:hover {
    color: var(--brand);
}

.dsSidebar__link._isSoon {
    color: var(--text-muted);
}

.dsSidebar__soonBadge {
    font-size: 10px;
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    background: var(--surface-muted);
    padding: 2px 6px;
    border-radius: 999px;
}
</style>
