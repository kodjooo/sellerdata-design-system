<template>
    <DocsLayout
        title="Страница ошибки"
        breadcrumb="Components"
        description="Компонент DsErrorPage — каркас страницы ошибки (реал: .error-page из 404.vue / 503.vue). Лого сверху, карточка с кодом/заголовком/описанием и иллюстрацией справа. Действия — через слот #actions (кнопки DsButton), иллюстрация — через слот #image. Без слота actions карточка центрируется по вертикали (как 503)."
    >
        <section>
            <h2>404 — с действиями</h2>
            <DocExample plain>
                <DsErrorPage
                    code="404"
                    title="Страница не найдена"
                    description="Страница по введённому вами адресу не существует. Измените запрос и попробуйте ещё раз."
                >
                    <template #actions>
                        <DsButton variant="secondary">Назад</DsButton>
                        <DsButton variant="primary">В Дэшборд</DsButton>
                    </template>
                </DsErrorPage>
            </DocExample>
        </section>

        <section>
            <h2>503 — технические работы</h2>
            <DocExample plain>
                <DsErrorPage
                    code="503"
                    title="Технические работы"
                    description="Приносим свои извинения, ведутся технические работы."
                />
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
import DsErrorPage from '@/Components/Ds/DsErrorPage.vue';

const props = [
    { name: 'code', type: 'string | number', default: "''", desc: 'Код ошибки (404, 503).' },
    { name: 'title', type: 'string', default: "''", desc: 'Заголовок страницы.' },
    { name: 'description', type: 'string', default: "''", desc: 'Поясняющий текст.' },
];
</script>
