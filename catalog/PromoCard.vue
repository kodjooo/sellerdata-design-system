<template>
    <DocsLayout
        title="Промо-карточка"
        breadcrumb="Components"
        description="DsPromoCard — градиентная промо-карточка с декоративной иконкой, круглым бейджем и текстом снизу. Реал: «+1 месяц бесплатно» в «Пригласи друга». Высоту задаёт раскладка страницы (не задаётся в компоненте)."
    >
        <section>
            <h2>Базовый вид</h2>
            <DocExample
                code='<DsPromoCard badge="+1" icon="fm-calendar">
  месяц бесплатного использования
</DsPromoCard>'
            >
                <div class="dsBlock">
                    <DsPromoCard badge="+1" icon="fm-calendar">
                        месяц<br>бесплатного<br>использования
                    </DsPromoCard>
                </div>
            </DocExample>
            <p class="t-body-s dsHint">В реальной раскладке высота тянется по соседней колонке (<code>grid align-items: stretch</code>). Здесь задана демо-высота обёртки.</p>
        </section>

        <section>
            <h2>Пропсы</h2>
            <PropsTable :rows="props" />
        </section>

        <section>
            <h2>Токены</h2>
            <ul class="dsTokens">
                <li><code>--brand-gradient</code> / <code>--text-on-brand</code> — фон и текст</li>
                <li><code>--accent-pink</code> — фон бейджа (badgeTone=pink)</li>
                <li><code>--radius-lg</code> / <code>--radius-full</code> — карточка и бейдж</li>
                <li><code>--size-128</code> — размер декор-иконки, <code>--opacity-hover</code> — её прозрачность</li>
            </ul>
        </section>
    </DocsLayout>
</template>

<script setup>
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsPromoCard from '@/Components/Ds/DsPromoCard.vue';

const props = [
    { name: 'badge', type: 'string', default: "''", desc: 'Текст круглого бейджа (напр. «+1»).' },
    { name: 'icon', type: 'string', default: "''", desc: 'Декоративная иконка fm-* в углу.' },
    { name: 'badgeTone', type: "'pink'", default: "'pink'", desc: 'Тон бейджа (--accent-pink).' },
    { name: 'slot:default', type: 'slot', default: '—', desc: 'Текст промо (многострочный).' },
];
</script>

<style scoped>
/* демо-обёртка: ширина/высота ≈320px из токенов шкалы (128+128+64) */
.dsBlock { width: 100%; max-width: calc(var(--size-128) * 2 + var(--size-64)); min-height: calc(var(--size-128) * 2 + var(--size-64)); display: flex; }
.dsBlock > * { width: 100%; }
.dsHint { color: var(--text-muted); }
.dsHint code, .dsTokens code { font-family: var(--font-family-mono, monospace); font-size: 12px; color: var(--brand); }
.dsTokens { margin: 0; padding-left: var(--size-20); color: var(--text-default); font-size: var(--font-size-body-s); display: flex; flex-direction: column; gap: var(--size-4); }
</style>
