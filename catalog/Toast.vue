<template>
    <DocsLayout
        title="Тост"
        breadcrumb="Components"
        description="Компонент DsToast — уведомление. Извлечён из реального AppToast: белая карточка, иконка + заголовок (13/500) + подзаголовок, крестик справа, выезд справа."
    >
        <section>
            <h2>Пример</h2>
            <DocExample
                code='<DsToast v-model:visible="show" variant="success" title="Готово" subtitle="Операция выполнена." />'
            >
                <DsButton variant="primary" @click="show = true">Показать тост</DsButton>
            </DocExample>
            <DsToast
                v-model:visible="show"
                variant="success"
                title="Готово"
                subtitle="Операция выполнена."
                style="position: fixed; top: 24px; right: 24px; z-index: 9999;"
            />
        </section>

        <section>
            <h2>Варианты (иконка)</h2>
            <DocExample plain>
                <div class="toastStack">
                    <DsToast :dismissible="false" variant="info" title="Информация" subtitle="Нейтральное сообщение." />
                    <DsToast :dismissible="false" variant="success" title="Готово" subtitle="Успешно сохранено." />
                    <DsToast :dismissible="false" variant="warning" title="Внимание" subtitle="Данные загружаются." />
                    <DsToast :dismissible="false" variant="danger" title="Ошибка" subtitle="Не удалось сохранить." />
                </div>
            </DocExample>
            <p class="t-body-s dsHint">variant влияет только на глиф иконки (цвет нейтральный, как в реале). Цветной accent-полосы нет.</p>
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
import DsToast from '@/Components/Ds/DsToast.vue';
import DsButton from '@/Components/Ds/DsButton.vue';

const show = ref(false);

const props = [
    { name: 'visible', type: 'boolean', default: 'true', desc: 'v-model:visible — видимость.' },
    { name: 'variant', type: "'none' | 'info' | 'success' | 'warning' | 'danger'", default: "'info'", desc: 'Глиф иконки / aria-live.' },
    { name: 'title', type: 'string', default: "''", desc: 'Заголовок (13/500).' },
    { name: 'subtitle', type: 'string', default: "''", desc: 'Подзаголовок (12).' },
    { name: 'dismissible', type: 'boolean', default: 'true', desc: 'Крестик закрытия.' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); }
.toastStack { display: flex; flex-direction: column; gap: var(--size-12); }
</style>
