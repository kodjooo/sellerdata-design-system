<template>
    <DocsLayout
        title="Табы"
        breadcrumb="Components"
        description="Компонент DsTabs — текстовые вкладки (реал .header-tabs): 13px, активная — brand-текст + нижняя brand-полоса. Без заливки и pill."
    >
        <section>
            <h2>Пример</h2>
            <DocExample
                code='<DsTabs v-model="active" :tabs="tabs" />'
            >
                <div style="width:100%">
                    <DsTabs v-model="active" :tabs="tabs" />
                    <p class="t-body-s" style="margin-top:var(--size-12); color:var(--text-muted)">Активная вкладка: <strong>{{ active }}</strong></p>
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Сегментный вариант (variant="segmented")</h2>
            <p class="t-body-s" style="color:var(--text-muted); margin-bottom:var(--size-12)">Пилюли в контейнере, активная — заливка brand. Для переключателей вида (напр. Плитки/Диаграмма на мобайле).</p>
            <DocExample code='<DsTabs v-model="v" :tabs="tabs" variant="segmented" />'>
                <div style="max-width:320px">
                    <DsTabs v-model="active" :tabs="tabs" variant="segmented" />
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Токены</h2>
            <ul class="dsTokens">
                <li><code>--brand</code> — активная вкладка (текст + полоса)</li>
                <li><code>--border-width-accent</code> (3px) — толщина нижней полосы</li>
                <li><code>--border-default</code> — линия-подложка под рядом</li>
                <li><code>--text-default</code> — неактивные вкладки</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsTabs from '@/Components/Ds/DsTabs.vue';

const active = ref('day');
const tabs = [
    { key: 'day', label: 'Июнь 2026' },
    { key: 'all', label: 'Весь период' },
];

const props = [
    { name: 'tabs', type: 'Array<{key,label,icon?}>', default: '[]', desc: 'Вкладки; icon — класс иконочного шрифта (.fm-*).' },
    { name: 'modelValue', type: 'string | number', default: "''", desc: 'v-model активной вкладки (значение key).' },
];
</script>

<style scoped>
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
.dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
</style>
