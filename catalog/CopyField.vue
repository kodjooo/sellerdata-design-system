<template>
    <DocsLayout
        title="Поле копирования"
        breadcrumb="Components"
        description="DsCopyField — значение + кнопка копирования (DsCopyButton). Реал: персональная реферальная ссылка в «Пригласи друга». Опц. подпись сверху и перенос длинного значения."
    >
        <section>
            <h2>Базовый вид</h2>
            <DocExample
                code='<DsCopyField value="WB-7f3a-0e72" label="Ваш ключ" />'
            >
                <div class="dsBlock">
                    <DsCopyField value="WB-7f3a-0e72" label="Ваш ключ" />
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Длинное значение (ссылка)</h2>
            <DocExample
                code='<DsCopyField :value="link" break />'
            >
                <div class="dsBlock">
                    <DsCopyField :value="link" label="Реферальная ссылка" break />
                </div>
            </DocExample>
            <p class="t-body-s dsHint">Проп <code>break</code> переносит длинную строку (<code>word-break</code>).</p>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Токены</h2>
            <ul class="dsTokens">
                <li><code>--border-input</code> / <code>--surface-subtle</code> — рамка и фон бокса</li>
                <li><code>--radius-md</code> — скругление</li>
                <li><code>--text-heading</code> / <code>--text-default</code> — значение и подпись</li>
                <li><code>--size-12</code> / <code>--size-16</code> — паддинги и gap</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsCopyField from '@/Components/Ds/DsCopyField.vue';

const link = 'https://app.sellerdata.ru/?friend=6e72e3fa0e';

const props = [
    { name: 'value', type: 'string', default: '—', desc: 'Копируемое значение (обязательный).' },
    { name: 'label', type: 'string', default: "''", desc: 'Подпись над полем.' },
    { name: 'break', type: 'boolean', default: 'false', desc: 'Перенос длинного значения (для ссылок).' },
];
</script>

<style scoped>
.dsBlock { width: 100%; }
.dsHint { color: var(--text-muted); }
.dsHint code, .dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
</style>
