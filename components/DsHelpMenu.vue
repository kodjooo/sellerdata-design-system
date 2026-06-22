<template>
    <!--
        DsHelpMenu — меню помощи в шапке (реал: HelpMenu.vue / .helpMenu).
        Круглая кнопка «?» (fm-help-circle), по клику — дропдаун со строками
        помощи: иконка в цветном квадрате + заголовок + описание + стрелка.
        Тип строки задаёт цвет иконки: faq (brand/info) | video (success).
    -->
    <div class="ds-help-menu" ref="root">
        <DsIconButton
            icon="fm-help-circle"
            variant="ghost"
            aria-label="Помощь"
            @click="toggle"
        />

        <div v-show="open" class="ds-help-menu__panel" role="menu">
            <component
                v-for="item in items"
                :is="item.href ? 'a' : 'button'"
                :key="item.key"
                class="ds-help-menu__item"
                :href="item.href || undefined"
                :target="item.href ? '_blank' : undefined"
                :rel="item.href ? 'noopener' : undefined"
                :type="item.href ? undefined : 'button'"
                role="menuitem"
                @click="onSelect(item)"
            >
                <span
                    class="ds-help-menu__icon"
                    :class="`ds-help-menu__icon--${item.type || 'faq'}`"
                >
                    <i :class="item.icon" aria-hidden="true"></i>
                </span>
                <span class="ds-help-menu__body">
                    <span class="ds-help-menu__title t-label-m">{{ item.label }}</span>
                    <span v-if="item.desc" class="ds-help-menu__desc t-caption">{{ item.desc }}</span>
                </span>
                <i
                    class="ds-help-menu__arrow"
                    :class="item.href ? 'fm-external-link' : 'fm-arrow-right'"
                    aria-hidden="true"
                ></i>
            </component>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import DsIconButton from '@/Components/Ds/DsIconButton.vue';

const props = defineProps({
    // Пункты меню: [{ key, label, icon (fm-*), href?, desc?, type?: 'faq'|'video' }].
    // href есть → строка-ссылка (внешняя, _blank, иконка fm-external-link);
    // без href → кнопка (иконка fm-arrow-right), действие через emit select.
    items: {
        type: Array,
        default: () => [
            {
                key: 'faq',
                label: 'База знаний',
                desc: 'Ответы на частые вопросы',
                icon: 'fm-book-open',
                href: 'https://sellerdata.ru/faq/',
                type: 'faq',
            },
            {
                key: 'video',
                label: 'Видео-подсказка',
                desc: 'Как пользоваться разделом',
                icon: 'fm-play-circle',
                type: 'video',
            },
        ],
    },
});

const emit = defineEmits(['select']);

const open = ref(false);
const root = ref(null);

function toggle() {
    open.value = !open.value;
}

function close() {
    open.value = false;
}

function onSelect(item) {
    emit('select', item);
    close();
}

function onDocClick(e) {
    if (root.value && !root.value.contains(e.target)) {
        close();
    }
}

onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<style lang="scss" scoped>
.ds-help-menu {
    position: relative;
    display: inline-flex;
}

.ds-help-menu__panel {
    position: absolute;
    z-index: 5;
    top: calc(100% + var(--size-8));
    right: 0;
    width: var(--size-128);
    min-width: 17.5rem; /* ~280px — ширина дропдауна помощи в реале */
    background: var(--surface-default);
    padding: var(--size-8);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-dropdown);
    display: grid;
    gap: var(--size-4);
}

.ds-help-menu__item {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    padding: var(--size-12);
    border: 0;
    border-radius: var(--radius-md);
    background: transparent;
    text-align: left;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    width: 100%;
    transition: background-color var(--transition-fast) var(--ease-standard);

    &:hover {
        background: var(--surface-muted);
        text-decoration: none;
        color: inherit;
    }
}

.ds-help-menu__icon {
    flex-shrink: 0;
    width: var(--size-40);
    height: var(--size-40);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-body-l);

    &--faq {
        background: var(--notice-info-bg);
        color: var(--brand);
    }

    &--video {
        background: var(--notice-success-bg);
        color: var(--accent-positive);
    }
}

.ds-help-menu__body {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: var(--size-2);
}

.ds-help-menu__title {
    color: var(--text-heading);
}

.ds-help-menu__desc {
    color: var(--text-muted);
}

.ds-help-menu__arrow {
    flex-shrink: 0;
    font-size: var(--font-size-body-s);
    color: var(--text-muted);
}
</style>
