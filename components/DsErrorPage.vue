<template>
    <!--
        DsErrorPage — каркас страницы ошибки (реал: .error-page из
        resources/scss/_error-page.scss + resources/js/Pages/404.vue / 503.vue).
        Структура: лого сверху → карточка-«тело» с двумя колонками:
        слева код/заголовок/описание/действия, справа иллюстрация.
        Действия — через слот #actions (кнопки DsButton). Иллюстрация — слот #image.
    -->
    <div class="ds-error-page">
        <img class="ds-error-page__logo" src="/img/logo-basic.svg" width="153" height="24" alt="sellerdata">

        <div class="ds-error-page__body" :class="{ 'ds-error-page__body--center': !$slots.actions }">
            <div class="ds-error-page__content">
                <p v-if="code" class="ds-error-page__code t-caption">{{ code }}</p>
                <h1 class="ds-error-page__title t-display-xl">{{ title }}</h1>
                <p v-if="description" class="ds-error-page__desc t-body-l">{{ description }}</p>
                <div v-if="$slots.actions" class="ds-error-page__actions">
                    <slot name="actions" />
                </div>
            </div>
            <div class="ds-error-page__image">
                <slot name="image" />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    code: { type: [String, Number], default: '' },   // 404 / 503 — код ошибки
    title: { type: String, default: '' },            // заголовок ('Страница не найдена')
    description: { type: String, default: '' },      // поясняющий текст
});
</script>

<style lang="scss" scoped>
.ds-error-page {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--size-48) var(--size-16);
    background: var(--surface-muted);
}

.ds-error-page__logo {
    flex-shrink: 0;
    margin-bottom: var(--size-48);
}

.ds-error-page__body {
    display: grid;
    grid-template-columns: 100%;
    gap: var(--size-24);
    width: 100%;
    /* layout-константа: предел ширины карточки ошибки (реал .error-page__body 860px). */
    max-width: 860px;
    margin: auto;
    padding: var(--size-24);
    border-radius: var(--radius-lg);
    background: var(--surface-default);

    @media (min-width: 768px) {
        /* layout-константа: фикс. колонка под иллюстрацию (реал 290px). */
        grid-template-columns: auto 290px;
        gap: var(--size-48);
        padding: var(--size-48);
    }
}

.ds-error-page__body--center {
    align-items: center;
}

.ds-error-page__code {
    margin: 0 0 var(--size-8);
    color: var(--text-muted);
}

.ds-error-page__title {
    margin: 0 0 var(--size-16);
    color: var(--text-default);

    @media (min-width: 768px) {
        margin: 0 0 var(--size-24);
    }
}

.ds-error-page__desc {
    margin: 0;
    color: var(--text-default);
}

.ds-error-page__actions {
    display: flex;
    gap: var(--size-16);
    margin: var(--size-24) 0 0;
    flex-wrap: wrap;

    @media (min-width: 768px) {
        margin: var(--size-48) 0 0;
    }
}

.ds-error-page__image {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
}
</style>
