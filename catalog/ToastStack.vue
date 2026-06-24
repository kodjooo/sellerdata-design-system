<template>
    <DocsLayout
        title="Стек тостов"
        breadcrumb="Components"
        description="Компонент DsToastStack — глобальный фикс-контейнер для стопки тостов (реал: AppToastsContainer). На мобайле выезжает сверху, на десктопе — снизу-справа. Управляет очередью: новые тосты добавляются в стек, закрытие крестиком emit-ит dismiss(id). Нажмите кнопку, чтобы добавить тост в стек."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <div class="dsControls">
                    <DsButton variant="primary" @click="addToast">Добавить тост</DsButton>
                    <DsButton variant="secondary" @click="toasts = []">Очистить</DsButton>
                </div>
            </DocExample>
            <p class="t-body-s dsHint">Контейнер фиксирован (teleport в body): моб — сверху, десктоп — снизу-справа.</p>
            <DsToastStack :toasts="toasts" :max="5" @dismiss="dismiss" />
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>События</h2>
            <PropsTable :rows="events" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsToastStack from '@/Components/Ds/DsToastStack.vue';
import DsButton from '@/Components/Ds/DsButton.vue';

const toasts = ref([]);
let nextId = 1;

const variants = ['info', 'success', 'warning', 'danger'];
const samples = {
    info: { title: 'Информация', message: 'Нейтральное сообщение.' },
    success: { title: 'Готово', message: 'Операция выполнена.' },
    warning: { title: 'Внимание', message: 'Данные ещё загружаются.' },
    danger: { title: 'Ошибка', message: 'Не удалось сохранить.' },
};

function addToast() {
    const variant = variants[(nextId - 1) % variants.length];
    const id = nextId++;
    toasts.value.push({ id, variant, ...samples[variant] });
    // Демонстрация авто-скрытия: убираем тост через 5с.
    setTimeout(() => dismiss(id), 5000);
}

function dismiss(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
}

const props = [
    { name: 'toasts', type: 'Array<{ id, variant, title, message, dismissible? }>', default: '[]', desc: 'Очередь тостов. id обязателен (ключ списка).' },
    { name: 'position', type: "'adaptive' | 'top' | 'bottom-right'", default: "'adaptive'", desc: 'adaptive — моб сверху / десктоп снизу-справа.' },
    { name: 'max', type: 'number', default: '0', desc: 'Лимит видимых тостов (0 — без лимита). Показываются последние.' },
];

const events = [
    { name: 'dismiss', type: '(id) => void', default: '—', desc: 'Закрытие тоста (крестик). Родитель убирает запись из toasts.' },
];
</script>

<style scoped>
.dsHint { color: var(--text-muted); }
.dsControls { display: flex; gap: var(--size-12); flex-wrap: wrap; }
</style>
