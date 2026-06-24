<template>
    <DocsLayout
        title="Группировка"
        breadcrumb="Components"
        description="Компонент DsGroupBy — «Группировать по <значение>»: подпись + значение-ссылка (brand) + поповер-меню выбора. Без рамки (не bordered-select), как в реальном кабинете (Дэшборд/Склад). Композирует DsPopover."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <DsGroupBy v-model="group" :options="['Не группировать', 'Артикулу', 'Бренду']" />
            </DocExample>
            <p class="t-body-s dsHint">Выбрано: <code>{{ group }}</code></p>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsGroupBy from '@/Components/Ds/DsGroupBy.vue';

const group = ref('Артикулу');

const props = [
    { name: 'modelValue', type: 'string', default: "''", desc: 'Выбранное значение (v-model).' },
    { name: 'options', type: 'string[]', default: '[]', desc: 'Варианты группировки.' },
    { name: 'label', type: 'string', default: "'Группировать по'", desc: 'Подпись слева.' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); margin-top: var(--size-12); }
.dsHint code { font-family: var(--font-family-mono, monospace); color: var(--brand); }
</style>
