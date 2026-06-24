<template>
    <DocsLayout
        title="Форма входа"
        breadcrumb="Components"
        description="Два компонента раздела Auth/Onboarding. DsAuthForm — каркас центрированной формы входа/регистрации (вынесен из экрана-эталона Auth.vue, реал: Pages/Auth/Login.vue, Register.vue): карточка DsCard max-width 340px, слоты лого/заголовок/поля/действия/футер. Поля передаются слотом снаружи (DsInput). DsFormErrors — единый блок сводки состояния формы; унифицирует два legacy-дубля реала (AuthErrors.vue + ValidationErrors.vue) в варианты error/success/warning."
    >
        <section>
            <h2>DsAuthForm — форма входа</h2>
            <DocExample plain>
                <DsAuthForm
                    title="Авторизация"
                    @submit="() => {}"
                >
                    <template #logo>
                        <span class="auth-demo__logo">sellerdata</span>
                    </template>

                    <template #fields>
                        <DsInput v-model="login.email" type="email" placeholder="Электронная почта" autocomplete="username" />
                        <DsInput v-model="login.password" type="password" placeholder="Пароль" autocomplete="current-password" />
                    </template>

                    <template #actions>
                        <DsButton variant="primary" type="submit">Войти</DsButton>
                    </template>

                    <template #footer>
                        Ещё нет аккаунта?
                        <a class="auth-demo__link" href="#" @click.prevent>Регистрация</a>
                    </template>
                </DsAuthForm>
            </DocExample>
        </section>

        <section>
            <h2>DsAuthForm — со сводкой ошибок (слот #status)</h2>
            <DocExample plain>
                <DsAuthForm title="Авторизация" @submit="() => {}">
                    <template #logo>
                        <span class="auth-demo__logo">sellerdata</span>
                    </template>
                    <template #status>
                        <DsFormErrors
                            variant="error"
                            :errors="['Неверный e-mail или пароль.']"
                        />
                    </template>
                    <template #fields>
                        <DsInput v-model="login2.email" type="email" placeholder="Электронная почта" />
                        <DsInput v-model="login2.password" type="password" placeholder="Пароль" />
                    </template>
                    <template #actions>
                        <DsButton variant="primary" type="submit">Войти</DsButton>
                    </template>
                </DsAuthForm>
            </DocExample>
        </section>

        <section>
            <h2>DsFormErrors — варианты</h2>
            <DocExample>
                <div class="auth-demo__stack">
                    <DsFormErrors
                        variant="error"
                        :errors="['Поле e-mail обязательно для заполнения.', 'Пароль должен быть не короче 8 символов.']"
                    />
                    <DsFormErrors
                        variant="success"
                        message="Ссылка для сброса пароля отправлена на вашу почту."
                    />
                    <DsFormErrors
                        variant="warning"
                        message="Подтвердите e-mail, чтобы продолжить работу."
                        dismissible
                    />
                </div>
            </DocExample>
        </section>

        <section>
            <h2>DsAuthForm — слоты</h2>
            <PropsTable :rows="authProps" />
            <PropsTable :rows="authSlots" />
            <PropsTable :rows="authEvents" />
        </section>

        <section>
            <h2>DsFormErrors — пропсы</h2>
            <PropsTable :rows="errorsProps" />
            <PropsTable :rows="errorsEvents" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { reactive } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsInput from '@/Components/Ds/DsInput.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsAuthForm from '@/Components/Ds/DsAuthForm.vue';
import DsFormErrors from '@/Components/Ds/DsFormErrors.vue';

const login = reactive({ email: '', password: '' });
const login2 = reactive({ email: '', password: '' });

const authProps = [
    { name: 'title', type: 'string', default: "''", desc: 'Заголовок карточки (реал: «Авторизация» / «Регистрация»).' },
    { name: 'subtitle', type: 'string', default: "''", desc: 'Подзаголовок под заголовком.' },
];
const authSlots = [
    { name: 'logo', type: 'slot', default: '—', desc: 'Логотип над карточкой.' },
    { name: 'head', type: 'slot', default: '—', desc: 'Полная замена шапки (вместо title/subtitle).' },
    { name: 'status', type: 'slot', default: '—', desc: 'Сводка состояния формы (обычно DsFormErrors).' },
    { name: 'fields', type: 'slot', default: '—', desc: 'Поля формы (DsInput и т.п.), передаются снаружи.' },
    { name: 'actions', type: 'slot', default: '—', desc: 'Кнопки действий (растягиваются на ширину).' },
    { name: 'footer', type: 'slot', default: '—', desc: 'Текст-ссылка под формой («Ещё нет аккаунта?»).' },
    { name: 'below', type: 'slot', default: '—', desc: 'Блок под карточкой (напр. DsSupportFooter).' },
];
const authEvents = [
    { name: 'submit', type: 'event', default: '—', desc: 'Отправка формы (submit.prevent внутри).' },
];

const errorsProps = [
    { name: 'errors', type: 'array | object', default: '[]', desc: 'Список ошибок: массив строк или объект { field: message } ($page.props.errors).' },
    { name: 'message', type: 'string', default: "''", desc: 'Одиночное сообщение (для success/warning).' },
    { name: 'variant', type: "'error' | 'success' | 'warning'", default: "'error'", desc: 'Тон оформления.' },
    { name: 'dismissible', type: 'boolean', default: 'false', desc: 'Показывать крестик закрытия.' },
    { name: 'visible', type: 'boolean', default: 'true', desc: 'Видимость (v-model:visible).' },
];
const errorsEvents = [
    { name: 'close', type: 'event', default: '—', desc: 'Клик по крестику.' },
    { name: 'update:visible', type: 'event', default: '—', desc: 'Поддержка v-model:visible.' },
];
</script>

<style lang="scss" scoped>
.auth-demo__logo {
    font-size: var(--font-size-heading-m);
    font-weight: var(--font-weight-semibold);
    color: var(--brand);
    letter-spacing: 0.01em;
}
.auth-demo__link { color: var(--brand); text-decoration: none; }
.auth-demo__link:hover { color: var(--brand-hover); text-decoration: underline; }
.auth-demo__stack { display: flex; flex-direction: column; gap: var(--size-16); width: 100%; max-width: 480px; }
</style>
