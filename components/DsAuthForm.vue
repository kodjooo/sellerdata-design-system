<template>
    <!--
        DsAuthForm — каркас формы входа/регистрации (вне кабинета).
        Вынесен из экрана-эталона Auth.vue (секции А/Б), первоисточники реала:
        Pages/Auth/Login.vue, Pages/Auth/Register.vue.
        Центрированная карточка DsCard (max-width 340px, реал .auth__block).
        Поля передаются слотом #fields снаружи (DsInput), чтобы каркас не зависел
        от модели формы. Сводку ошибок кладут в слот #status (обычно DsFormErrors).
    -->
    <div class="ds-auth-form">
        <a v-if="$slots.logo" class="ds-auth-form__logo" href="#" @click.prevent>
            <slot name="logo" />
        </a>

        <DsCard radius="md" padding="--size-24" tag="section" class="ds-auth-form__card">
            <div v-if="title || subtitle || $slots.head" class="ds-auth-form__head">
                <slot name="head">
                    <h3 v-if="title" class="t-heading-m ds-auth-form__title">{{ title }}</h3>
                    <p v-if="subtitle" class="t-body-s ds-auth-form__sub">{{ subtitle }}</p>
                </slot>
            </div>

            <!-- Слот сводки состояния формы (DsFormErrors): между заголовком и полями. -->
            <div v-if="$slots.status" class="ds-auth-form__status">
                <slot name="status" />
            </div>

            <form class="ds-auth-form__fields" @submit.prevent="$emit('submit')">
                <slot name="fields" />
                <div v-if="$slots.actions" class="ds-auth-form__actions">
                    <slot name="actions" />
                </div>
            </form>

            <p v-if="$slots.footer" class="t-body-s ds-auth-form__foot">
                <slot name="footer" />
            </p>
        </DsCard>

        <div v-if="$slots.below" class="ds-auth-form__below">
            <slot name="below" />
        </div>
    </div>
</template>

<script setup>
import DsCard from '@/Components/Ds/DsCard.vue';

defineProps({
    // Заголовок карточки (реал: «Авторизация» / «Регистрация»).
    title: { type: String, default: '' },
    // Подзаголовок под заголовком (реал: «Зарегистрируйтесь бесплатно!»).
    subtitle: { type: String, default: '' },
});
defineEmits(['submit']);
</script>

<style lang="scss" scoped>
.ds-auth-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-24);
    width: 100%;
    max-width: 340px;            /* реал .auth__block width: 340px */
}

.ds-auth-form__logo { display: inline-flex; text-decoration: none; }

.ds-auth-form__card { width: 100%; }

.ds-auth-form__head {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    text-align: center;
    margin-bottom: var(--size-16);
}
.ds-auth-form__title { color: var(--text-heading); }
.ds-auth-form__sub { color: var(--text-muted); }

.ds-auth-form__status { margin-bottom: var(--size-16); }

.ds-auth-form__fields { display: flex; flex-direction: column; gap: var(--size-16); }
.ds-auth-form__actions { display: flex; flex-direction: column; gap: var(--size-12); }
.ds-auth-form__actions :deep(.ds-button) { width: 100%; }

.ds-auth-form__foot { text-align: center; color: var(--text-muted); margin-top: var(--size-16); }

.ds-auth-form__below { width: 100%; text-align: center; }
</style>
