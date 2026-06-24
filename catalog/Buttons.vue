<template>
    <DocsLayout
        title="Кнопки"
        breadcrumb="Components"
        description="Компонент DsButton — извлечён 1:1 из реальных .btn-regular / .btn-default. Высота 40, радиус 4 (--radius-sm), 13/400, без тени, min-width 145. Замещает legacy-классы .btn-regular / .btn-default / .btn_lg."
    >
        <section>
            <h2>Варианты</h2>
            <DocExample
                code='<DsButton variant="primary">Подключить</DsButton>
<DsButton variant="secondary">Отмена</DsButton>'
            >
                <DsButton variant="primary">Подключить</DsButton>
                <DsButton variant="secondary">Отмена</DsButton>
            </DocExample>
            <p class="t-body-s dsHint">
                <code>primary</code> = <code>.btn-regular</code> (заливка --brand), <code>secondary</code> = <code>.btn-default</code> (белый + рамка --border-default).
            </p>
        </section>

        <section>
            <h2>Размеры</h2>
            <DocExample
                code='<DsButton size="md">Средняя</DsButton>
<DsButton size="lg">Большая</DsButton>'
            >
                <DsButton variant="primary" size="md">Средняя (md)</DsButton>
                <DsButton variant="primary" size="lg">Большая (lg)</DsButton>
            </DocExample>
            <p class="t-body-s dsHint"><code>md</code> — высота 40 (база), <code>lg</code> — 60 (=.btn_lg), радиус --radius-md, 16px.</p>
        </section>

        <section>
            <h2>Состояния</h2>
            <DocExample
                code='<DsButton :disabled="true">Недоступно</DsButton>'
            >
                <DsButton variant="primary">Обычная</DsButton>
                <DsButton variant="primary" :disabled="true">Недоступно</DsButton>
                <DsButton variant="secondary" :disabled="true">Недоступно</DsButton>
            </DocExample>
            <p class="t-body-s dsHint">Disabled — заливка --border-default, текст --text-muted (дословно из реала). Hover / active / focus — псевдоклассами.</p>
        </section>

        <section>
            <h2>С иконкой</h2>
            <DocExample
                code='<DsButton variant="primary">
  <template #iconLeft>＋</template>
  Добавить
</DsButton>'
            >
                <DsButton variant="primary"><template #iconLeft>＋</template>Добавить</DsButton>
                <DsButton variant="secondary">Фильтр<template #iconRight>▾</template></DsButton>
            </DocExample>
            <p class="t-body-s dsHint">Слоты <code>#iconLeft</code> / <code>#iconRight</code>. Иконки — из набора Foundations → Иконки.</p>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Токены</h2>
            <ul class="dsTokens">
                <li><code>--brand</code> / <code>--brand-hover</code> — заливка primary</li>
                <li><code>--border-default</code> — рамка secondary и disabled-фон</li>
                <li><code>--text-default</code> / <code>--text-muted</code> — текст</li>
                <li><code>--radius-sm</code> (md) / <code>--radius-md</code> (lg) — скругление</li>
                <li><code>--control-height-md</code> (40) — высота</li>
                <li><code>--font-size-body-s</code> (13) — текст</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsButton from '@/Components/Ds/DsButton.vue';

const props = [
    { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", desc: 'primary = заливка бренда; secondary = белый с рамкой.' },
    { name: 'size', type: "'md' | 'lg'", default: "'md'", desc: 'md — высота 40; lg — высота 60, радиус и текст крупнее.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", desc: 'Нативный type кнопки.' },
    { name: 'disabled', type: 'boolean', default: 'false', desc: 'Неактивное состояние.' },
    { name: 'ariaLabel', type: 'string', default: "''", desc: 'aria-label для icon-only кнопок.' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); }
.dsHint code, .dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
</style>
