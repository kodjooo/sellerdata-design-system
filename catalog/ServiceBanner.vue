<template>
    <DocsLayout
        title="Сервис недоступен"
        breadcrumb="Components"
        description="Компонент DsServiceBanner — плашка вверху страницы (реал: ServiceUnavailableWidget — «Нет подключения. Повторное подключение через mm:ss» + ссылка «Повторить сейчас»). Сообщение + таймер обратного отсчёта + кнопка retry. Тоны: warning (amber) / danger (красный). Когда таймер истекает, появляется кнопка повтора."
    >
        <section>
            <h2>Примеры</h2>
            <DocExample plain>
                <div class="col">
                    <DsServiceBanner message="Нет подключения." :seconds="180" @retry="onRetry" />
                    <DsServiceBanner tone="danger" message="Сервис временно недоступен." :seconds="0" @retry="onRetry" />
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Слоты и события</h2>
            <PropsTable :rows="api" />
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsServiceBanner from '@/Components/Ds/DsServiceBanner.vue';

function onRetry() { /* демонстрация: здесь был бы запрос на переподключение */ }

const props = [
    { name: 'message', type: 'string', default: '—', desc: 'Текст плашки (обязательный).' },
    { name: 'seconds', type: 'number', default: '0', desc: 'Длительность обратного отсчёта в секундах. 0 — без таймера, кнопка повтора видна сразу.' },
    { name: 'retry-label', type: 'string', default: "'Повторить сейчас'", desc: 'Подпись кнопки повтора.' },
    { name: 'tone', type: "'warning' | 'danger'", default: "'warning'", desc: 'Тон плашки.' },
];

const api = [
    { name: '@retry', type: 'событие', default: '—', desc: 'Клик по кнопке повтора (после истечения таймера).' },
];
</script>

<style scoped>
.col { display: flex; flex-direction: column; gap: var(--size-16); }
</style>
