<template>
    <DocsLayout
        title="Видео-баннер"
        breadcrumb="Components"
        description="Компонент DsVideoBanner — баннер-видеохинт вверху раздела (реал: подсказка с превью-видео и текстом). Превью с play-кнопкой + текст-описание; по клику открывается попап с полным текстом и шапкой «← раздел». Используется на Складе/Расходах и др."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <DsVideoBanner
                    section="Склад"
                    title="Как работать со складом"
                    text="Здесь, исходя из темпов продаж за последние 30 дней, вы можете отслеживать запасы и получать рекомендации о необходимости пополнить товар. Себестоимость FBO и FBS синхронизируется автоматически."
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
import DsVideoBanner from '@/Components/Ds/DsVideoBanner.vue';

const props = [
    { name: 'title', type: 'string', default: "''", desc: 'Заголовок подсказки (в попапе).' },
    { name: 'text', type: 'string', default: "''", desc: 'Текст-описание (в превью обрезается, в попапе — полностью).' },
    { name: 'poster', type: 'string', default: "''", desc: 'URL постера-превью; без него — серая подложка с play.' },
    { name: 'section', type: 'string', default: "''", desc: 'Название раздела для шапки попапа («← Склад»).' },
];
</script>
