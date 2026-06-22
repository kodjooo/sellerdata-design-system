<template>
    <!--
        DsSupportFooter — подвал поддержки под таблицей/формой (реал: support-ссылка
        внизу страниц ЛК). Текст-префикс + email + Telegram.
    -->
    <p class="t-caption ds-support">
        {{ prefix }}
        <a class="ds-support__link" :href="`mailto:${email}`">{{ email }}</a>
        или
        <a class="ds-support__link" :href="telegram" @click.prevent>Telegram</a>
    </p>
</template>

<script setup>
defineProps({
    prefix: { type: String, default: 'По любым вопросам пишите нам в' },
    email: { type: String, default: 'support@sellerdata.ru' },
    telegram: { type: String, default: '#' },
});
</script>

<style lang="scss" scoped>
.ds-support { text-align: center; color: var(--text-muted); }
.ds-support__link { color: var(--brand); text-decoration: none; }
.ds-support__link:hover { text-decoration: underline; }
</style>
