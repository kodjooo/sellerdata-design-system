<template>
    <DocsLayout
        title="Меню аккаунта"
        breadcrumb="Components"
        description="Компонент DsAccountMenu — переключатель аккаунта/магазина в топбаре (реал .user_auth_dropdown): бейдж аккаунта + шеврон, по клику — поповер со списком магазинов (иконка маркетплейса), «Сводный дэшборд», «Добавить магазин», «Выйти». Композирует DsPopover + DsAccountBadge."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <div style="display:flex; justify-content:flex-end; padding:var(--size-16); background:var(--surface-default); border:1px solid var(--border-default); border-radius:var(--radius-md)">
                    <DsAccountMenu
                        name="Демо аккаунт"
                        :stores="stores"
                        active-id="wb"
                        @select="s => active = s.name"
                    />
                </div>
            </DocExample>
            <p class="t-body-s dsHint">Выбран магазин: <strong>{{ active }}</strong></p>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>События</h2>
            <PropsTable :rows="events" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsAccountMenu from '@/Components/Ds/DsAccountMenu.vue';

const active = ref('Основной Магазин');
const stores = [
    { id: 'wb', name: 'Основной Магазин', dataSource: 'wildberries' },
    { id: 'ozon', name: 'Дополнительный магазин', dataSource: 'ozon' },
];

const props = [
    { name: 'name', type: 'string', default: "''", desc: 'Имя/почта аккаунта.' },
    { name: 'store', type: 'string', default: "''", desc: 'Подпись активного магазина (если без stores).' },
    { name: 'dataSource', type: 'string', default: "''", desc: 'Маркетплейс активного (если без stores).' },
    { name: 'stores', type: 'Array<{id,name,dataSource}>', default: '[]', desc: 'Список магазинов в меню.' },
    { name: 'activeId', type: 'string|number', default: "''", desc: 'id активного магазина (подсветка).' },
];
const events = [
    { name: 'select', type: '(store)', default: '—', desc: 'Выбран магазин.' },
    { name: 'summary', type: '()', default: '—', desc: '«Сводный дэшборд».' },
    { name: 'add-store', type: '()', default: '—', desc: '«Добавить магазин».' },
    { name: 'logout', type: '()', default: '—', desc: '«Выйти».' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); margin-top: var(--size-12); }
</style>
