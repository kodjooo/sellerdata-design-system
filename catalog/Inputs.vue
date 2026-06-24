<template>
    <DocsLayout
        title="Поля ввода"
        breadcrumb="Components"
        description="Компонент DsInput — текстовое поле с лейблом, подсказкой и состоянием ошибки. Высота и плотность — как у полей текущего сервиса."
    >
        <section>
            <h2>Примеры</h2>
            <DocExample
                code='<DsInput v-model="v" label="Обычное поле" placeholder="Введите значение" />'
            >
                <div class="dsCol">
                    <DsInput v-model="t1" label="Обычное поле" placeholder="Введите значение" />
                    <DsInput v-model="t2" label="С ошибкой" error="Поле обязательно" placeholder="..." />
                    <DsInput v-model="t3" label="С подсказкой" helper="Короткое пояснение под полем" placeholder="..." />
                    <DsInput v-model="t4" label="Disabled" :disabled="true" placeholder="Недоступно" />
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Inline-поле и суффикс (ячейка таблицы)</h2>
            <DocExample
                code='<DsInput v-model="c" inline suffix="₽" placeholder="0,00" />'
                plain
            >
                <div style="display:flex; gap:var(--size-16); align-items:center; max-width:360px">
                    <DsInput v-model="t5" inline suffix="₽" placeholder="0,00" />
                    <DsInput v-model="t6" inline suffix="%" placeholder="0" />
                    <DsInput v-model="t7" label="С суффиксом" suffix="₽" placeholder="440,00" />
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
                <li><code>--border-default</code> / <code>--brand</code> — рамка и фокус</li>
                <li><code>--status-danger</code> — состояние ошибки</li>
                <li><code>--text-default</code> / <code>--text-muted</code> — текст и плейсхолдер</li>
                <li><code>--radius-sm</code> · <code>--control-height-md</code> — форма и высота</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsInput from '@/Components/Ds/DsInput.vue';

const t1 = ref(''); const t2 = ref(''); const t3 = ref(''); const t4 = ref('');
const t5 = ref('440,00'); const t6 = ref('12'); const t7 = ref('');

const props = [
    { name: 'modelValue', type: 'string | number', default: "''", desc: 'v-model значения поля.' },
    { name: 'type', type: 'string', default: "'text'", desc: 'Нативный type (text, number, email…).' },
    { name: 'label', type: 'string', default: "''", desc: 'Подпись над полем.' },
    { name: 'helper', type: 'string', default: "''", desc: 'Подсказка под полем.' },
    { name: 'error', type: 'string', default: "''", desc: 'Текст ошибки (включает состояние ошибки).' },
    { name: 'placeholder', type: 'string', default: "''", desc: 'Плейсхолдер.' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: 'Неактивное состояние.' },
    { name: 'readonly', type: 'boolean', default: 'false', desc: 'Только чтение.' },
    { name: 'required', type: 'boolean', default: 'false', desc: 'Обязательное поле.' },
    { name: 'inline', type: 'boolean', default: 'false', desc: 'Безрамочное поле ячейки (рамка по hover/focus).' },
    { name: 'suffix', type: 'string', default: "''", desc: 'Текстовый суффикс справа (₽/%).' },
    { name: 'suffixIcon', type: 'string', default: "''", desc: 'Иконка-суффикс (fm-*), напр. лупа в поиске.' },
];
</script>

<style scoped>
.dsCol { display: flex; flex-direction: column; gap: var(--size-16); width: 100%; max-width: 360px; }
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
.dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
</style>
