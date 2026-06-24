<template>
    <DocsLayout
        title="Переключатель"
        breadcrumb="Components"
        description="Компонент DsSwitch — тоггл-переключатель on/off (реал .input__toggle из _forms.scss). Применяется для подписок и уведомлений, учёта налога/НДС, согласий. Включён — заливка --brand; выключен — серый трек. Поддерживает disabled, подпись и info-подсказку. ARIA role=switch, переключение кликом и Space."
    >
        <section>
            <h2>Вкл / Выкл</h2>
            <DocExample plain>
                <DsSwitch v-model="on" label="Включён" />
                <DsSwitch v-model="off" label="Выключен" />
            </DocExample>
        </section>

        <section>
            <h2>Disabled</h2>
            <DocExample plain>
                <DsSwitch :model-value="true" disabled label="Заблокирован (вкл)" />
                <DsSwitch :model-value="false" disabled label="Заблокирован (выкл)" />
            </DocExample>
        </section>

        <section>
            <h2>С подписью и подсказкой</h2>
            <DocExample plain>
                <DsSwitch v-model="vat" label="Учитывать НДС">
                    <template #hint>Включает НДС в расчёт себестоимости и прибыли.</template>
                </DsSwitch>
            </DocExample>
        </section>

        <section>
            <h2>Без подписи</h2>
            <DocExample plain>
                <DsSwitch v-model="bare" :id="'notify-switch'" />
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="propRows" />
        </section>

        <section>
            <h2>События и слоты</h2>
            <PropsTable :rows="eventRows" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsSwitch from '@/Components/Ds/DsSwitch.vue';

const on = ref(true);
const off = ref(false);
const vat = ref(true);
const bare = ref(false);

const propRows = [
    { name: 'modelValue', type: 'boolean', default: 'false', desc: 'v-model: состояние вкл/выкл.' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: 'Заблокирован — не реагирует, приглушён.' },
    { name: 'label', type: 'string', default: "''", desc: 'Подпись справа (или слот по умолчанию).' },
    { name: 'id', type: 'string', default: "''", desc: 'id для связи с внешним <label for>.' },
];

const eventRows = [
    { name: 'update:modelValue', type: 'event', default: '—', desc: 'Новое состояние (boolean).' },
    { name: 'change', type: 'event', default: '—', desc: 'Новое состояние (boolean) при переключении.' },
    { name: 'default (слот)', type: 'slot', default: '—', desc: 'Содержимое подписи (альтернатива props.label).' },
    { name: 'hint (слот)', type: 'slot', default: '—', desc: 'Содержимое подсказки info-иконки (через DsTooltip).' },
];
</script>
