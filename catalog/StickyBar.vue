<template>
    <DocsLayout
        title="Панель действий снизу"
        breadcrumb="Components"
        description="Компонент DsStickyBar — нижняя панель действий (реал: buttons-panel со «Скачать/Загрузить .xls»). На десктопе — обычный центрированный ряд в потоке; на мобайле (<768px) прилипает к низу вьюпорта (sticky), белый фон + верхняя граница, кнопки растягиваются на ширину. Сузьте окно, чтобы увидеть липкое поведение."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <DsStickyBar>
                    <DsButton variant="primary">Скачать таблицу (.xls)</DsButton>
                    <DsButton variant="primary">Загрузить таблицу (.xls)</DsButton>
                </DsStickyBar>
            </DocExample>
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
import DsButton from '@/Components/Ds/DsButton.vue';
import DsStickyBar from '@/Components/Ds/DsStickyBar.vue';

const props = [
    { name: 'mobile-sticky', type: 'boolean', default: 'true', desc: 'На мобайле (<768px) прилипать к низу вьюпорта. false — обычный ряд в потоке на всех ширинах.' },
];
</script>
