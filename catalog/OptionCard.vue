<template>
    <DocsLayout
        title="Карточка-вариант"
        breadcrumb="Components"
        description="Компонент DsOptionCard — карточка выбора (радио): пресеты периода, способ оплаты, действие с ключом и т.п. layout row|stack, activeStyle fill|border, опц. галочка."
    >
        <section>
            <h2>row + fill (пресеты периода)</h2>
            <DocExample plain>
                <div class="col">
                    <DsOptionCard
                        v-for="o in periods"
                        :key="o"
                        :title="o"
                        :selected="period === o"
                        check
                        @select="period = o"
                    />
                </div>
            </DocExample>
        </section>

        <section>
            <h2>row + fill с иконкой и подписью</h2>
            <DocExample plain>
                <div class="col">
                    <DsOptionCard icon="fm-link" title="Подключить через OAuth" sub="Через личный кабинет" :selected="action === 'oauth'" @select="action = 'oauth'" />
                    <DsOptionCard icon="fm-key" title="Обновить API-ключ" sub="Заменить текущий ключ" :selected="action === 'update'" @select="action = 'update'" />
                </div>
            </DocExample>
        </section>

        <section>
            <h2>stack + border (способ оплаты)</h2>
            <DocExample plain>
                <div class="row">
                    <DsOptionCard layout="stack" active-style="border" icon="fm-credit-card" title="Банковская карта" :selected="pay === 'card'" @select="pay = 'card'" />
                    <DsOptionCard layout="stack" active-style="border" icon="fm-file-text" title="Счет на оплату" :selected="pay === 'invoice'" @select="pay = 'invoice'" />
                </div>
            </DocExample>
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
import DsOptionCard from '@/Components/Ds/DsOptionCard.vue';

const period = ref('Текущий месяц');
const periods = ['Один месяц', 'Текущий месяц', 'Текущий год'];
const action = ref('update');
const pay = ref('card');

const props = [
    { name: 'selected', type: 'boolean', default: 'false', desc: 'Выбранная карточка.' },
    { name: 'title', type: 'string', default: "''", desc: 'Заголовок.' },
    { name: 'sub', type: 'string', default: "''", desc: 'Подпись под заголовком.' },
    { name: 'icon', type: 'string', default: "''", desc: 'Иконка fm-* (или слот #icon).' },
    { name: 'layout', type: "'row' | 'stack'", default: "'row'", desc: 'row — иконка+текст в строку; stack — иконка над текстом по центру.' },
    { name: 'activeStyle', type: "'fill' | 'border'", default: "'fill'", desc: 'Выбранная = заливка brand / brand-рамка.' },
    { name: 'check', type: 'boolean', default: 'false', desc: 'Галочка у выбранной.' },
    { name: 'checkSide', type: "'right' | 'left'", default: "'right'", desc: 'Сторона галочки.' },
    { name: '@select', type: 'событие', default: '—', desc: 'Клик по карточке.' },
];
</script>

<style scoped>
.col { display: flex; flex-direction: column; gap: var(--size-8); max-width: 360px; }
.row { display: flex; gap: var(--size-12); }
.row > * { flex: 1 1 0; }
</style>
