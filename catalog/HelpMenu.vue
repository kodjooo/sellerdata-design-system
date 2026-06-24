<template>
    <DocsLayout
        title="Меню помощи"
        breadcrumb="Components"
        description="Компонент DsHelpMenu — меню помощи в шапке (реал: HelpMenu / .helpMenu). Круглая ghost-кнопка «?» (fm-help-circle), по клику — дропдаун со строками помощи: иконка в цветном квадрате + заголовок + описание + стрелка. Тип строки задаёт цвет иконки: faq (синий/brand) | video (зелёный/positive). Строка-ссылка (href) открывается в новой вкладке (fm-external-link); строка-кнопка эмитит select (fm-arrow-right)."
    >
        <section>
            <h2>Пример</h2>
            <DocExample plain>
                <div class="help-menu-demo">
                    <DsHelpMenu />
                </div>
            </DocExample>
            <p class="help-menu-hint t-caption">Меню показано открытым для наглядности; в реале раскрывается по клику на «?».</p>
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
import { onMounted } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsHelpMenu from '@/Components/Ds/DsHelpMenu.vue';

const props = [
    { name: 'items', type: 'Array', default: 'FAQ + Видео', desc: 'Пункты меню: [{ key, label, icon (fm-*), href?, desc?, type?: \'faq\'|\'video\' }]. href → строка-ссылка (_blank); без href → кнопка с emit select.' },
];

const events = [
    { name: 'select', type: '(item)', default: '—', desc: 'Клик по пункту меню; передаёт объект пункта. После выбора меню закрывается.' },
];

// Раскрываем меню в примере каталога, чтобы дропдаун был виден сразу.
onMounted(() => {
    const trigger = document.querySelector('.help-menu-demo .ds-icon-btn');
    if (trigger) trigger.click();
});
</script>

<style lang="scss" scoped>
.help-menu-demo {
    display: flex;
    justify-content: center;
    min-height: var(--size-128);
    padding-top: var(--size-12);
}

.help-menu-hint {
    margin-top: var(--size-12);
    color: var(--text-muted);
}
</style>
