<template>
    <DocsLayout
        title="Баннер-подсказка"
        breadcrumb="Components"
        description="Компонент DsNotice — информационный/онбординг-баннер (реал: подсказка на дашборде). Слот #media слева, текст в слоте по умолчанию, крестик закрытия. Тоны: plain / info / peach."
    >
        <section>
            <h2>Примеры</h2>
            <DocExample plain>
                <div class="col">
                    <DsNotice :dismissible="true">
                        <template #media><span class="thumb" aria-hidden="true"></span></template>
                        Используйте Панель инструментов для анализа ключевых показателей. Нажмите «Больше» в плитках периодов, чтобы увидеть подробный расчёт.
                    </DsNotice>
                    <DsNotice tone="peach" title="Подключите магазин" :dismissible="false">
                        Добавьте API-ключ маркетплейса, чтобы начать синхронизацию данных.
                    </DsNotice>
                </div>
            </DocExample>
        </section>

        <section>
            <h2>Свёрнутый вид на мобайле (collapse-mobile)</h2>
            <p class="t-body-s note">
                С пропом <code>collapse-mobile</code> на ширине &lt;768px текст сворачивается до 2 строк,
                а превью уменьшается — как реальный онбординг-баннер в кабинете. Видно при сужении окна.
            </p>
            <DocExample plain>
                <DsNotice collapse-mobile>
                    <template #media><span class="thumb" aria-hidden="true"></span></template>
                    Здесь, исходя из темпов продаж за последние 30 дней, вы можете отслеживать свои запасы
                    и получать рекомендации о необходимости пополнить товар. Себестоимость FBO и FBS
                    синхронизируется автоматически.
                </DsNotice>
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
import DsNotice from '@/Components/Ds/DsNotice.vue';

const props = [
    { name: 'title', type: 'string', default: "''", desc: 'Заголовок (опционально).' },
    { name: 'tone', type: "'plain' | 'info' | 'peach' | 'success'", default: "'plain'", desc: 'Фон баннера: plain/info/peach/success (зелёный).' },
    { name: 'dismissible', type: 'boolean', default: 'true', desc: 'Крестик закрытия.' },
    { name: 'visible', type: 'boolean', default: 'true', desc: 'v-model:visible.' },
    { name: 'collapse-mobile', type: 'boolean', default: 'false', desc: 'На мобайле (<768px) свернуть текст до 2 строк и уменьшить превью — как баннер в кабинете.' },
];
</script>

<style scoped>
.col { display: flex; flex-direction: column; gap: var(--size-16); }
.thumb { display: block; width: 96px; height: 56px; border-radius: var(--radius-sm); background: var(--brand-gradient); }
.note { color: var(--text-muted); margin: 0 0 var(--size-12); }
.note code { font-family: var(--font-mono, monospace); }
</style>
