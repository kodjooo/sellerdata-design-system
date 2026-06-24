<template>
    <DocsLayout
        title="Ячейка товара"
        breadcrumb="Components"
        description="Компонент DsProductCell — ячейка товара для таблиц (реал .item): миниатюра 40×40 + название + строка «nmId / артикул». Используется в таблицах Товаров, Дашборда, Рекламы."
    >
        <section>
            <h2>Примеры</h2>
            <DocExample
                code='<DsProductCell name="Ночная сорочка больших размеров" sub="649546532 / сор-черная" />'
            >
                <div class="col">
                    <DsProductCell name="Ночная сорочка больших размеров" sub="649546532 / сор-черная" />
                    <DsProductCell name="Костюм брючный женский офисный" sub="174553902 / кост-син-50" />
                    <DsProductCell name="Размер 54" hide-thumb />
                </div>
            </DocExample>
            <p class="t-body-s dsHint">Без <code>image</code> рисуется плашка-плейсхолдер. <code>hide-thumb</code> — для вложенных строк-вариантов (без миниатюры).</p>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsProductCell from '@/Components/Ds/DsProductCell.vue';

const props = [
    { name: 'image', type: 'string', default: "''", desc: 'URL миниатюры; без него — плашка-плейсхолдер.' },
    { name: 'name', type: 'string', default: "''", desc: 'Название товара.' },
    { name: 'sub', type: 'string', default: "''", desc: 'Вторая строка: «nmId / артикул» (или слот #sub).' },
    { name: 'size', type: 'number', default: '40', desc: 'Размер миниатюры, px.' },
    { name: 'hideThumb', type: 'boolean', default: 'false', desc: 'Скрыть плашку (для строк-вариантов).' },
];
</script>

<style scoped>
.col { display: flex; flex-direction: column; gap: var(--size-12); }
.dsHint { color: var(--text-muted); }
.dsHint code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
</style>
