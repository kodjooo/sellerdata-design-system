<template>
    <DocsLayout
        title="Поповер"
        breadcrumb="Components"
        description="Компонент DsPopover — универсальный поповер (реал: Dropdown — слот триггера + всплывающая панель, закрытие по клику вне и Esc). Триггер — слот по умолчанию, контент — слот #content (получает функцию close). Панель телепортируется в body, z-index — токен --z-popover. База для more-button / inline-edit / вложенных меню."
    >
        <section>
            <h2>Пример — меню по кнопке</h2>
            <DocExample plain>
                <DsPopover placement="bottom-start">
                    <DsButton variant="secondary">Действия ▾</DsButton>
                    <template #content="{ close }">
                        <ul class="menu">
                            <li><button class="menu__item t-body-s" @click="close">Редактировать</button></li>
                            <li><button class="menu__item t-body-s" @click="close">Дублировать</button></li>
                            <li><button class="menu__item t-body-s" @click="close">Удалить</button></li>
                        </ul>
                    </template>
                </DsPopover>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Слоты и события</h2>
            <PropsTable :rows="api" />
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsPopover from '@/Components/Ds/DsPopover.vue';
import DsButton from '@/Components/Ds/DsButton.vue';

const props = [
    { name: 'placement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", default: "'bottom-start'", desc: 'Позиция панели относительно триггера.' },
    { name: 'open', type: 'boolean', default: 'false', desc: 'v-model:open — внешнее управление видимостью.' },
];

const api = [
    { name: 'default (слот)', type: 'слот', default: '—', desc: 'Триггер поповера (клик открывает/закрывает).' },
    { name: '#content', type: 'слот', default: '—', desc: 'Содержимое панели. Получает scoped-проп { close } для программного закрытия.' },
    { name: '@update:open', type: 'событие', default: '—', desc: 'Изменение видимости (для v-model:open).' },
];
</script>

<style scoped>
.menu { list-style: none; margin: 0; padding: 0; min-width: var(--size-128); }
.menu__item {
    display: block;
    width: 100%;
    padding: var(--size-8) var(--size-12);
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-default);
    text-align: left;
    cursor: pointer;
    transition: background-color var(--transition-base) var(--ease-standard);
}
.menu__item:hover { background: var(--surface-muted); color: var(--text-heading); }
</style>
