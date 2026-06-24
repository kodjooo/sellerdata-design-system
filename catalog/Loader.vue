<template>
    <DocsLayout
        title="Загрузка"
        breadcrumb="Components"
        description="Компонент DsLoader — индикатор загрузки (спиннер). Реал: Bootstrap .spinner-border поверх таблицы (TableLoader) с полупрозрачным оверлеем, чтобы аккордеоны не схлопывались при подгрузке, а также inline-спиннеры. Цвет — brand. Варианты: inline (в потоке), overlay (поверх контейнера) и panel (блок-заглушка)."
    >
        <section>
            <h2>Варианты</h2>

            <h3>inline</h3>
            <p class="t-body-sm">Спиннер в потоке — внутри кнопок, строк, рядом с текстом.</p>
            <DocExample plain>
                <DsLoader variant="inline" />
                <DsLoader variant="inline" label="Загрузка…" />
            </DocExample>

            <h3>overlay</h3>
            <p class="t-body-sm">Полупрозрачная подложка + спиннер по центру поверх контейнера. Родитель должен иметь position:relative.</p>
            <DocExample plain>
                <div class="loader-demo-box">
                    <p class="t-body">Контент таблицы под оверлеем…</p>
                    <p class="t-body">Аккордеоны не схлопываются при подгрузке.</p>
                    <DsLoader variant="overlay" label="Обновляем данные…" />
                </div>
            </DocExample>

            <h3>panel</h3>
            <p class="t-body-sm">Блок-заглушка с min-height для пустого/загружаемого блока.</p>
            <DocExample plain>
                <DsLoader variant="panel" label="Загружаем отчёт…" />
            </DocExample>
        </section>

        <section>
            <h2>Размеры</h2>
            <DocExample plain>
                <DsLoader variant="inline" size="sm" />
                <DsLoader variant="inline" size="md" />
                <DsLoader variant="inline" size="lg" />
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
import DsLoader from '@/Components/Ds/DsLoader.vue';

const props = [
    { name: 'variant', type: "'inline' | 'overlay' | 'panel'", default: "'inline'", desc: 'inline — спиннер в потоке; overlay — поверх контейнера с полупрозрачной подложкой (родитель position:relative); panel — блок-заглушка с min-height.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", desc: 'Размер спиннера: 16 / 24 / 40px.' },
    { name: 'label', type: 'string', default: "''", desc: 'Опциональная подпись рядом со спиннером (inline) или под ним.' },
];
</script>

<style lang="scss" scoped>
.loader-demo-box {
    position: relative;
    padding: var(--size-24);
    min-height: var(--size-128);
    background: var(--surface-subtle);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
}
</style>
