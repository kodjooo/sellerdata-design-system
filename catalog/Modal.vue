<template>
    <DocsLayout
        title="Модалка"
        breadcrumb="Components"
        description="Компонент DsModal — диалог с градиент-шапкой, телом и футером. Размеры sm/md/lg/fullscreen; на мобайле — fullscreen. Закрытие по фону/Esc/крестику."
    >
        <section>
            <h2>Базовый пример</h2>
            <DocExample
                code='<DsModal v-model="open" title="Заголовок">
  …тело…
  <template #footer>
    <DsButton variant="secondary">Отмена</DsButton>
    <DsButton variant="primary">Применить</DsButton>
  </template>
</DsModal>'
            >
                <DsButton variant="primary" @click="open = true">Открыть модалку</DsButton>
            </DocExample>
            <DsModal v-model="open" title="Пример модалки">
                <p class="t-body-s" style="margin:0;">Содержимое модалки: градиент-шапка, тело, футер. Кнопки в футере сжимаются по контенту (как в реальных модалках).</p>
                <template #footer>
                    <DsButton variant="secondary" @click="open = false">Отмена</DsButton>
                    <DsButton variant="primary" @click="open = false">Применить</DsButton>
                </template>
            </DsModal>
        </section>

        <section>
            <h2>Размеры</h2>
            <DocExample>
                <DsButton variant="secondary" @click="size='sm'; openSized=true">sm</DsButton>
                <DsButton variant="secondary" @click="size='md'; openSized=true">md</DsButton>
                <DsButton variant="secondary" @click="size='lg'; openSized=true">lg</DsButton>
                <DsButton variant="secondary" @click="size='fullscreen'; openSized=true">fullscreen</DsButton>
            </DocExample>
            <DsModal v-model="openSized" :size="size" :title="`Размер: ${size}`">
                <p class="t-body-s" style="margin:0;">Ширина зависит от пропа size. На мобайле всё разворачивается в fullscreen.</p>
            </DsModal>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Сложная модалка (композиция)</h2>
            <p class="t-body-s dsHint">
                Тяжёлая модалка «деталь товара» (продажи/расходы/прибыль с раскрытием) — это
                композиция <code>DsModal</code> + <code>DsInfoList</code>, см.
                <Link :href="route('designSystem.patterns')">Паттерны → Эталоны-композиции</Link>.
            </p>
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsModal from '@/Components/Ds/DsModal.vue';
import DsButton from '@/Components/Ds/DsButton.vue';

const open = ref(false);
const openSized = ref(false);
const size = ref('md');

const props = [
    { name: 'modelValue', type: 'boolean', default: 'false', desc: 'v-model видимости.' },
    { name: 'title', type: 'string', default: "''", desc: 'Заголовок в шапке.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'fullscreen'", default: "'md'", desc: 'Ширина окна.' },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', desc: 'Закрывать по клику на фон.' },
    { name: 'closeOnEsc', type: 'boolean', default: 'true', desc: 'Закрывать по Esc.' },
    { name: 'closable', type: 'boolean', default: 'true', desc: 'Показывать крестик.' },
];
</script>
