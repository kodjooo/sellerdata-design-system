<template>
    <DocsLayout
        title="Подвал поддержки"
        breadcrumb="Components"
        description="Компонент DsSupportFooter — строка поддержки под таблицей/формой (реал: support-ссылка внизу страниц кабинета). Текст-префикс + email + Telegram. Центрирован, muted."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <DsSupportFooter />
            </DocExample>
        </section>

        <section>
            <h2>Свой префикс</h2>
            <DocExample plain>
                <DsSupportFooter prefix="Свяжитесь с нами:" />
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
import DsSupportFooter from '@/Components/Ds/DsSupportFooter.vue';

const props = [
    { name: 'prefix', type: 'string', default: "'По любым вопросам пишите нам в'", desc: 'Текст перед ссылками.' },
    { name: 'email', type: 'string', default: "'support@sellerdata.ru'", desc: 'Email поддержки (mailto).' },
    { name: 'telegram', type: 'string', default: "'#'", desc: 'Ссылка на Telegram.' },
];
</script>
