<template>
    <!--
        DsAppShell — каркас приложения ЛК (сайдбар + топбар + контент).

        Канон: docs/design-system-canon.md → «Nav / Sidebar» (rail), «Адаптивность»
        (сайдбар: постоянный ≥lg, off-canvas <lg), «Мобильные паттерны ЛК»
        (гамбургер в топбаре слева, компактный топбар).
        Эталон: docs/reference/screens/склад__список@wb.png (иконочный rail слева, топбар).

        Адаптив:
          ≥lg  — сайдбар постоянный (rail), гамбургер скрыт;
          <lg  — сайдбар скрыт, выезжает как off-canvas drawer слева по гамбургеру
                 (☰ в топбаре слева), затемнение (--z-overlay), drawer (--z-fixed),
                 закрытие по клику вне/Esc.

        Только токены: var(--*), --size-*, --radius-*, --z-*, --shadow-*, t-*-классы.
    -->
    <div class="ds-app-shell">
        <!-- ─── Сайдбар (rail): постоянный ≥lg / off-canvas <lg ─────── -->
        <!-- Затемнение под drawer (только когда открыт на мобайле). -->
        <transition name="ds-shell-fade">
            <div
                v-if="drawerOpen"
                class="ds-app-shell__scrim"
                aria-hidden="true"
                @click="closeDrawer"
            />
        </transition>

        <aside
            class="ds-app-shell__aside"
            :class="{ 'is-open': drawerOpen }"
            aria-label="Главное меню"
        >
            <div class="ds-app-shell__logo">
                <slot name="logo"><span aria-hidden="true">SD</span></slot>
            </div>
            <nav class="ds-app-shell__nav">
                <a
                    v-for="item in items"
                    :key="item.key ?? item.label"
                    :href="item.href || '#'"
                    class="ds-app-shell__nav-item"
                    :class="{ 'is-active': isActive(item) }"
                    :aria-current="isActive(item) ? 'page' : undefined"
                    @click="onItemClick(item, $event)"
                >
                    <span class="ds-app-shell__nav-icon" aria-hidden="true">{{ item.icon }}</span>
                    <span class="t-caption ds-app-shell__nav-label">{{ item.label }}</span>
                </a>
            </nav>
        </aside>

        <!-- ─── Основная область: топбар + контент ──────────────────── -->
        <div class="ds-app-shell__main">
            <header class="ds-app-shell__topbar">
                <!-- Гамбургер (только <lg): открывает off-canvas сайдбар. -->
                <button
                    type="button"
                    class="ds-app-shell__burger"
                    aria-label="Открыть меню"
                    :aria-expanded="drawerOpen"
                    @click="openDrawer"
                >
                    <span aria-hidden="true">☰</span>
                </button>

                <div class="ds-app-shell__title">
                    <slot name="title" />
                </div>

                <div class="ds-app-shell__actions">
                    <slot name="actions" />
                </div>
            </header>

            <main class="ds-app-shell__content">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
    // Пункты сайдбара: [{ key?, label, icon, href?, active? }].
    items: {
        type: Array,
        default: () => [],
    },
    // Активный пункт по ключу/лейблу (если не задан item.active).
    active: {
        type: [String, Number],
        default: '',
    },
});

const emit = defineEmits(['select']);

// Состояние off-canvas drawer (актуально только на <lg).
const drawerOpen = ref(false);

function isActive(item) {
    if (item.active !== undefined) return item.active;
    const id = item.key ?? item.label;
    return id === props.active;
}

function openDrawer() {
    drawerOpen.value = true;
}
function closeDrawer() {
    drawerOpen.value = false;
}

function onItemClick(item, event) {
    // На мобайле выбор пункта закрывает drawer.
    closeDrawer();
    emit('select', item);
    if (!item.href) event.preventDefault();
}

function handleEsc(e) {
    if (e.key === 'Escape') closeDrawer();
}

onMounted(() => document.addEventListener('keydown', handleEsc));
onBeforeUnmount(() => document.removeEventListener('keydown', handleEsc));
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

/* ─── Каркас ──────────────────────────────────────────────────── */
.ds-app-shell {
    display: flex;
    min-height: 100vh;
    background: var(--surface-subtle);
    color: var(--text-default);
}

/* ─── Сайдбар (rail) ──────────────────────────────────────────── */
.ds-app-shell__aside {
    /* База = мобайл: off-canvas (спрятан слева за экраном). */
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: var(--z-fixed);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--size-4);
    width: var(--size-96);
    padding: var(--size-12) var(--size-6);
    background: var(--surface-default);
    box-shadow: var(--shadow-aside);
    transform: translateX(-100%);
    transition: transform var(--transition-base) var(--ease-standard);
    overflow-y: auto;

    &.is-open { transform: translateX(0); }

    /* ≥lg: постоянный сайдбар в потоке (rail). */
    @include respond-to(lg) {
        position: sticky;
        height: 100vh;
        flex: 0 0 var(--size-96);
        transform: none;
    }
}

.ds-app-shell__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--size-48);
    margin-bottom: var(--size-8);
    color: var(--brand);
    font-size: var(--font-size-title-m);
    font-weight: var(--font-weight-bold);
}

.ds-app-shell__nav { display: flex; flex-direction: column; gap: var(--size-4); }

.ds-app-shell__nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-4);
    padding: var(--size-8) var(--size-4);
    border-radius: var(--radius-lg);
    color: var(--text-default);
    text-decoration: none;
    text-align: center;
    transition: background-color var(--transition-base) var(--ease-standard),
                color var(--transition-base) var(--ease-standard);
}
.ds-app-shell__nav-icon { font-size: var(--font-size-heading-m); line-height: var(--line-height-tight); }
.ds-app-shell__nav-label { color: inherit; }
.ds-app-shell__nav-item:hover { background: var(--surface-muted); color: var(--text-heading); }
.ds-app-shell__nav-item:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }
.ds-app-shell__nav-item.is-active { background: var(--surface-muted); color: var(--brand); }

/* ─── Затемнение под drawer (только <lg) ──────────────────────── */
.ds-app-shell__scrim {
    position: fixed;
    inset: 0;
    z-index: var(--z-overlay);
    background: rgb(from var(--gray-900) r g b / 0.5);

    @include respond-to(lg) { display: none; }
}
/* На мобайле drawer должен быть выше затемнения. */
@include respond-below(lg) {
    .ds-app-shell__aside { z-index: var(--z-modal); }
}

.ds-shell-fade-enter-active,
.ds-shell-fade-leave-active { transition: opacity var(--transition-base) var(--ease-standard); }
.ds-shell-fade-enter-from,
.ds-shell-fade-leave-to { opacity: var(--opacity-hidden); }

/* ─── Основная область ────────────────────────────────────────── */
.ds-app-shell__main { display: flex; flex: 1 1 auto; flex-direction: column; min-width: 0; }

/* ─── Топбар (компактный на мобайле, просторнее ≥md) ──────────── */
.ds-app-shell__topbar {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    min-height: var(--control-height-lg);
    padding: var(--size-8) var(--size-16);
    background: var(--surface-default);
    border-bottom: 1px solid var(--border-default);

    @include respond-to(md) { padding: var(--size-12) var(--size-24); }
}

/* Гамбургер — только <lg (сайдбар скрыт). */
.ds-app-shell__burger {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--control-height-sm);
    height: var(--control-height-sm);
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-default);
    font-size: var(--font-size-heading-m);
    line-height: var(--line-height-tight);
    cursor: pointer;
    transition: background-color var(--transition-fast) var(--ease-standard);

    &:hover { background: var(--surface-muted); color: var(--text-heading); }
    &:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }

    @include respond-to(lg) { display: none; }
}

.ds-app-shell__title { flex: 1 1 auto; min-width: 0; }
.ds-app-shell__actions { display: flex; align-items: center; gap: var(--size-8); }

/* ─── Контент (page-padding по брейкпоинтам) ──────────────────── */
.ds-app-shell__content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    padding: var(--size-32);

    @include respond-to(md) { padding: var(--size-40); }
    @include respond-to(lg) { padding: var(--size-48); }
}
</style>
