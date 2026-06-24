<template>
    <DocsLayout
        title="Прогресс-бар"
        breadcrumb="Components"
        description="Компонент DsProgressBar — тонкая полоса прогресса (реал: .files-input__file__bar из модалок импорта). Дорожка фиксированной толщины (2px) с заливкой по value (0–100). Цвет заливки — brand по умолчанию либо статусный tone (success/warning/danger)."
    >
        <section>
            <h2>Пример</h2>
            <DocExample>
                <div style="display:flex;flex-direction:column;gap:var(--size-16);max-width:360px;">
                    <DsProgressBar :value="35" />
                    <DsProgressBar :value="100" tone="success" />
                    <DsProgressBar :value="60" tone="warning" />
                    <DsProgressBar :value="15" tone="danger" />
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
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsProgressBar from '@/Components/Ds/DsProgressBar.vue';

const props = [
    { name: 'value', type: 'number', default: '0', desc: 'Значение прогресса 0–100 (обрезается до диапазона).' },
    { name: 'tone', type: "'brand' | 'success' | 'warning' | 'danger'", default: "'brand'", desc: 'Цвет заливки полосы.' },
    { name: 'height', type: 'string', default: 'null', desc: 'Необязательная высота дорожки (CSS-размер, лучше var(--size-*)). По умолчанию тонкая полоса 2px.' },
];
</script>
