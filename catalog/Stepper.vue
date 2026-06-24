<template>
    <DocsLayout
        title="Шаги-инструкция"
        breadcrumb="Components"
        description="Компонент DsStepper — нумерованный список шагов инструкции (реал: .response_block из инструкций подключения ключей *ApiKeyHelp.vue). Каждый шаг — кружок с номером + заголовок + контент (текст/HTML со ссылками) + опциональное превью-картинка. На мобайле превью уходит под текст."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <DsStepper :steps="steps" />
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
import DsStepper from '@/Components/Ds/DsStepper.vue';

const steps = [
    { title: 'Откройте личный кабинет', content: 'Перейдите в личный кабинет маркетплейса <a href="#">по этой ссылке</a> и авторизуйтесь.' },
    { title: 'Сгенерируйте ключ', content: 'В разделе «API ключи» нажмите «Сгенерировать ключ» и задайте название.' },
    { title: 'Вставьте ключ в Sellerdata', content: 'Скопируйте созданный ключ и внесите его в поле ниже, чтобы подключить магазин.' },
];

const props = [
    { name: 'steps', type: 'Array', default: '[]', desc: 'Массив шагов: [{ title, content (текст/HTML), thumb? — url превью }].' },
];
</script>
