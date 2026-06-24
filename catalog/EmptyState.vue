<template>
    <DocsLayout
        title="Пустое состояние"
        breadcrumb="Components"
        description="Компонент DsEmptyState — пустое состояние списка/таблицы/страницы (реал: .empty_banner). Иконка-кружок + заголовок + описание + опциональная кнопка-CTA. Применяется в слоте #empty у DsTable, на пустых фильтрах («Ничего не найдено») и пустых разделах («Заказы отсутствуют»)."
    >
        <section>
            <h2>С кнопкой (CTA)</h2>
            <DocExample plain>
                <DsEmptyState
                    icon="rotate"
                    title="Заказы отсутствуют"
                    description="Добавьте заказы, которые были выкуплены"
                >
                    <DsButton variant="primary">Добавить</DsButton>
                </DsEmptyState>
            </DocExample>
        </section>

        <section>
            <h2>Без кнопки (фильтр без результата)</h2>
            <DocExample plain>
                <DsEmptyState
                    icon="search"
                    title="Ничего не найдено"
                    description="Попробуйте поменять параметры фильтра и попробовать снова"
                />
            </DocExample>
        </section>

        <section>
            <h2>Иконки</h2>
            <DocExample plain>
                <DsEmptyState
                    icon="attention"
                    title="Нет доступа"
                    description="Подключите магазин, чтобы увидеть данные"
                />
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Слоты</h2>
            <PropsTable :rows="slots" />
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsEmptyState from '@/Components/Ds/DsEmptyState.vue';

const props = [
    { name: 'icon', type: 'string', default: "'search'", desc: "Класс fm-* ИЛИ ключ: 'search' (fm-carbon_search), 'attention' (fm-attention), 'rotate' (fm-rotate-ccw)." },
    { name: 'title', type: 'string', default: "''", desc: 'Заголовок пустого состояния (t-heading-m).' },
    { name: 'description', type: 'string', default: "''", desc: 'Подсказка под заголовком (t-body-s, muted).' },
];

const slots = [
    { name: 'action', type: 'slot', default: '—', desc: 'Кнопка-CTA (DsButton передаётся снаружи). Дефолтный слот — алиас для action.' },
];
</script>
