<template>
    <DocsLayout
        title="Чекбоксы и радио"
        breadcrumb="Components"
        description="Компонент DsCheckbox — чекбокс и радио (через type) с лейблом, промежуточным и disabled-состоянием."
    >
        <section>
            <h2>Чекбоксы</h2>
            <DocExample
                code='<DsCheckbox v-model="v" label="Чекбокс" />'
            >
                <div class="dsCol">
                    <DsCheckbox v-model="cb1" label="Выбран" />
                    <DsCheckbox v-model="cb2" :indeterminate="true" label="Промежуточный" />
                    <DsCheckbox v-model="cb3" :disabled="true" label="Disabled" />
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Радио</h2>
            <DocExample
                code='<DsCheckbox v-model="r" type="radio" value="a" label="Вариант A" />'
            >
                <div class="dsCol">
                    <DsCheckbox v-model="radio" type="radio" value="a" label="Вариант A" />
                    <DsCheckbox v-model="radio" type="radio" value="b" label="Вариант B" />
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
                <li><code>--brand</code> — отмеченное состояние</li>
                <li><code>--border-default</code> — рамка в покое</li>
                <li><code>--radius-sm</code> — скругление чекбокса</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsCheckbox from '@/Components/Ds/DsCheckbox.vue';

const cb1 = ref(true); const cb2 = ref(false); const cb3 = ref(false); const radio = ref('a');

const props = [
    { name: 'modelValue', type: 'boolean | array | string | number', default: 'false', desc: 'v-model. Для группы чекбоксов — массив значений.' },
    { name: 'type', type: "'checkbox' | 'radio'", default: "'checkbox'", desc: 'Тип контрола.' },
    { name: 'value', type: 'string | number | boolean', default: 'true', desc: 'Значение в группе (для массива/радио).' },
    { name: 'label', type: 'string', default: "''", desc: 'Подпись справа.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', desc: 'Промежуточное состояние (только checkbox).' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: 'Неактивное состояние.' },
    { name: 'error', type: 'boolean', default: 'false', desc: 'Состояние ошибки.' },
];
</script>

<style scoped>
.dsCol { display: flex; flex-direction: column; gap: var(--size-12); }
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
.dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
</style>
