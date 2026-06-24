<template>
    <DocsLayout
        title="Иконочная кнопка"
        breadcrumb="Components"
        description="Компонент DsIconButton — круглая иконочная кнопка (реал: круглые кнопки период/фильтр в тулбарах кабинета). Заливка brand, белая иконка. Размеры: md (40 — воронка фильтра) и lg (48 — период/календарь). Вариант ghost — для второстепенных действий."
    >
        <section>
            <h2>Размеры и варианты</h2>
            <DocExample plain>
                <div class="row">
                    <DsIconButton icon="fm-filter" size="md" aria-label="Фильтр" />
                    <DsIconButton icon="fm-calendar" size="lg" aria-label="Период" />
                    <DsIconButton icon="fm-filter" size="md" variant="ghost" aria-label="Фильтр" />
                    <DsIconButton icon="fm-chevron-right" size="md" variant="link" aria-label="Подробнее" />
                </div>
            </DocExample>
            <p class="t-body-s dsHint">Слева направо: <code>md</code> (40) brand, <code>lg</code> (48) brand, <code>md</code> ghost, <code>md</code> link (плоский brand-шеврон — колонка «Инфо»/«Подробнее» в таблицах).</p>
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
import DsIconButton from '@/Components/Ds/DsIconButton.vue';

const props = [
    { name: 'icon', type: 'string', default: '— (required)', desc: 'Класс иконочного шрифта (fm-*).' },
    { name: 'size', type: "'md' | 'lg'", default: "'md'", desc: 'md = 40 (фильтр-воронка), lg = 48 (период/календарь).' },
    { name: 'variant', type: "'brand' | 'ghost' | 'link'", default: "'brand'", desc: 'brand — заливка brand/белая иконка; ghost — прозрачная мьютед; link — плоский brand-шеврон без фона («Подробнее»).' },
    { name: 'block', type: 'boolean', default: 'false', desc: 'Заполнить ячейку целиком + крупный глиф (колонка «Инфо»/«Подробнее» в таблицах, реал ≈55×53).' },
    { name: 'aria-label', type: 'string', default: "''", desc: 'Доступное имя кнопки.' },
];
</script>

<style scoped>
.row { display: flex; align-items: center; gap: var(--size-16); }
.dsHint { color: var(--text-muted); margin-top: var(--size-12); }
.dsHint code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
</style>
