<template>
    <Head title="Auth / Onboarding — экран-эталон" />

    <!--
      Экран-эталон раздела «Auth / Onboarding».
      Это страницы ВНЕ кабинета (вход, регистрация, подключение магазина) — поэтому
      каркас НЕ DsAppShell, а центрированная карточка на странице с фоном --surface-subtle.
      Все секции собраны из Ds*-компонентов и токенов var(--*).
      Первоисточники: Pages/Auth/Login.vue, Pages/Auth/Register.vue,
      Pages/Connecting.vue + Components/Account/ApiKeyForm.vue,
      скрин docs/reference/screens/подключение__магазин@wb.png.
      Контролы выверены по computed-стилям реального /login (карточка 340px / radius 8 /
      border 1px --border-default) и канону DsInput/DsButton.
    -->
    <div class="auth-screen">
        <!-- Шапка-навигатор страницы-эталона (только для каталога ДС, в реале её нет) -->
        <header class="auth-screen__doc">
            <h1 class="t-heading-l">Auth / Onboarding</h1>
            <p class="t-body-s auth-screen__doc-sub">
                Экраны вне кабинета: вход, регистрация, подключение магазина. Каркас — центрированная
                карточка <code>DsCard</code> (не <code>DsAppShell</code>). Контролы выверены по реальному
                <code>/login</code> и канону <code>DsInput</code>/<code>DsButton</code>.
            </p>
        </header>

        <!-- ─────────────────────────────────────────────────────────────
             СЕКЦИЯ А. Форма входа (реал: Pages/Auth/Login.vue)
        ────────────────────────────────────────────────────────────── -->
        <section class="auth-section">
            <h2 class="t-title-m auth-section__title">А. Вход</h2>

            <div class="auth-stage">
                <div class="auth-form">
                    <a class="auth-logo" href="#" @click.prevent aria-label="sellerdata">
                        <span class="auth-logo__text">sellerdata</span>
                    </a>

                    <DsCard radius="md" padding="--size-24" tag="section" class="auth-card">
                        <h3 class="t-heading-m auth-card__title">Авторизация</h3>

                        <form class="auth-fields" @submit.prevent>
                            <DsInput
                                v-model="login.email"
                                type="email"
                                placeholder="Электронная почта"
                                autocomplete="username"
                            />
                            <DsInput
                                v-model="login.password"
                                type="password"
                                placeholder="Пароль"
                                autocomplete="current-password"
                            />

                            <div class="auth-row">
                                <DsCheckbox v-model="login.remember" label="Оставаться в системе" />
                                <a class="t-body-s auth-link" href="#" @click.prevent>Забыли пароль?</a>
                            </div>

                            <DsButton variant="primary" type="submit" class="auth-submit">Войти</DsButton>
                        </form>

                        <p class="t-body-s auth-card__foot">
                            Ещё нет аккаунта?
                            <a class="auth-link" href="#" @click.prevent>Регистрация</a>
                        </p>
                    </DsCard>

                    <!-- Футер поддержки под формой -->
                    <DsSupportFooter prefix="Свяжитесь с нами:" />
                </div>
            </div>
        </section>

        <!-- ─────────────────────────────────────────────────────────────
             СЕКЦИЯ Б. Форма регистрации (реал: Pages/Auth/Register.vue)
        ────────────────────────────────────────────────────────────── -->
        <section class="auth-section">
            <h2 class="t-title-m auth-section__title">Б. Регистрация</h2>

            <div class="auth-stage">
                <div class="auth-form">
                    <a class="auth-logo" href="#" @click.prevent aria-label="sellerdata">
                        <span class="auth-logo__text">sellerdata</span>
                    </a>

                    <DsCard radius="md" padding="--size-24" tag="section" class="auth-card">
                        <div class="auth-card__head">
                            <h3 class="t-heading-m auth-card__title">Регистрация</h3>
                            <p class="t-body-s auth-card__sub">Зарегистрируйтесь бесплатно!</p>
                        </div>

                        <form class="auth-fields" @submit.prevent>
                            <DsInput
                                v-model="reg.email"
                                type="email"
                                placeholder="Электронная почта"
                                autocomplete="email"
                            />
                            <DsInput
                                v-model="reg.password"
                                type="password"
                                placeholder="Пароль"
                                autocomplete="new-password"
                            />
                            <DsInput
                                v-model="reg.passwordConfirm"
                                type="password"
                                placeholder="Повторите пароль"
                                autocomplete="new-password"
                            />

                            <label class="auth-agree">
                                <DsCheckbox v-model="reg.agree" />
                                <span class="t-body-s">
                                    Я принимаю условия
                                    <a class="auth-link" href="#" @click.prevent>пользовательского соглашения</a>
                                </span>
                            </label>

                            <DsButton variant="primary" type="submit" class="auth-submit">Зарегистрироваться</DsButton>
                        </form>

                        <p class="t-body-s auth-card__foot">
                            Уже есть аккаунт?
                            <a class="auth-link" href="#" @click.prevent>Войти</a>
                        </p>
                    </DsCard>
                </div>
            </div>
        </section>

        <!-- ─────────────────────────────────────────────────────────────
             СЕКЦИЯ В. Подключение магазина (реал: ApiKeyForm.vue)
             По скрину подключение__магазин@wb/@ozon.png:
             лого → заголовок → warning-notice → две панели маркетплейсов → действия.
        ────────────────────────────────────────────────────────────── -->
        <section class="auth-section">
            <h2 class="t-title-m auth-section__title">В. Подключение магазина</h2>

            <div class="auth-stage">
                <div class="connect">
                    <a class="auth-logo connect__logo" href="#" @click.prevent aria-label="sellerdata">
                        <span class="auth-logo__text">sellerdata</span>
                    </a>

                    <h3 class="t-heading-l connect__title">Подключение магазина</h3>

                    <!-- Warning-баннер «Используйте этот API-ключ только в одном сервисе» -->
                    <DsNotice tone="peach" :dismissible="false" class="connect__warn">
                        <template #media><span class="connect__warn-ico fm-info" aria-hidden="true"></span></template>
                        <p class="t-label-m connect__warn-title">Используйте этот API-ключ только в одном сервисе.</p>
                        Чтобы гарантировать стабильную передачу данных и избежать сбоев, пожалуйста, не используйте
                        один и тот же ключ в нескольких сторонних сервисах.
                    </DsNotice>

                    <!-- Две панели маркетплейсов -->
                    <div class="connect__grid">
                        <!-- Wildberries -->
                        <DsCard radius="lg" padding="--size-24" shadow="none" tag="article" class="mp mp--subtle">
                            <span class="mp__brand mp__brand--wb">WILDBERRIES</span>

                            <DsInput
                                v-model="connect.wbKey"
                                placeholder="API-ключ Wildberries"
                                class="mp__field"
                            />

                            <div class="mp__or"><span class="mp__or-label t-body-s">или</span></div>

                            <DsButton variant="secondary" class="mp__oauth">Быстрое подключение</DsButton>

                            <ul class="mp__links">
                                <li><a class="auth-link t-body-s" href="#" @click.prevent>Где найти ключ API Wildberries?</a></li>
                                <li><a class="auth-link t-body-s" href="#" @click.prevent>Ключ Wildberries выдаёт ошибку?</a></li>
                                <li><a class="auth-link t-body-s" href="#" @click.prevent>Безопасность и данные</a></li>
                            </ul>
                        </DsCard>

                        <!-- Ozon -->
                        <DsCard radius="lg" padding="--size-24" shadow="none" tag="article" class="mp mp--subtle">
                            <span class="mp__brand mp__brand--ozon">OZON</span>

                            <DsInput
                                v-model="connect.ozonClientId"
                                placeholder="Client ID Ozon"
                                class="mp__field"
                            />
                            <DsInput
                                v-model="connect.ozonKey"
                                placeholder="API-ключ Ozon"
                                class="mp__field"
                            />

                            <ul class="mp__links">
                                <li><a class="auth-link t-body-s" href="#" @click.prevent>Где найти ключ API Ozon?</a></li>
                                <li><a class="auth-link t-body-s" href="#" @click.prevent>Ключ Ozon выдаёт ошибку?</a></li>
                                <li><a class="auth-link t-body-s" href="#" @click.prevent>Безопасность и данные</a></li>
                            </ul>
                        </DsCard>
                    </div>

                    <div class="connect__actions">
                        <DsButton variant="primary">Подключить</DsButton>
                        <DsButton variant="secondary">Назад</DsButton>
                    </div>
                </div>
            </div>
        </section>

        <!-- ─────────────────────────────────────────────────────────────
             СЕКЦИЯ Г. Состояние ошибки ключа (реал: submit-error в ApiKeyField)
        ────────────────────────────────────────────────────────────── -->
        <section class="auth-section">
            <h2 class="t-title-m auth-section__title">Г. Подключение — ошибка ключа</h2>

            <div class="auth-stage">
                <div class="connect connect--narrow">
                    <DsCard radius="lg" padding="--size-24" shadow="none" tag="article" class="mp mp--subtle">
                        <span class="mp__brand mp__brand--wb">WILDBERRIES</span>
                        <DsInput
                            v-model="connectError.wbKey"
                            placeholder="API-ключ Wildberries"
                            error="Неверный или просроченный ключ. Проверьте и попробуйте снова."
                            class="mp__field"
                        />
                    </DsCard>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { Head } from '@inertiajs/vue3';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsInput from '@/Components/Ds/DsInput.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsSupportFooter from '@/Components/Ds/DsSupportFooter.vue';
import DsCheckbox from '@/Components/Ds/DsCheckbox.vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';

// Состояния-демо для контролов экрана-эталона.
const login = reactive({ email: '', password: '', remember: false });
const reg = reactive({ email: '', password: '', passwordConfirm: '', agree: false });
const connect = reactive({ wbKey: '', ozonClientId: '', ozonKey: '' });
const connectError = reactive({ wbKey: 'wb-key-invalid-example' });
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

/* Страница-эталон: фон вне кабинета. */
.auth-screen {
    min-height: 100vh;
    background: var(--surface-subtle);
    padding: var(--size-32);
    display: flex;
    flex-direction: column;
    gap: var(--size-48);

    @include respond-to(md) { padding: var(--size-40); }
    @include respond-to(lg) { padding: var(--size-48); }
}

.auth-screen__doc { max-width: 768px; } /* layout-конвенция: ширина текстового блока */
.auth-screen__doc-sub { color: var(--text-muted); margin-top: var(--size-8); }
.auth-screen__doc code,
.auth-section code { color: var(--text-heading); }

/* Секция-разделитель экрана-эталона. */
.auth-section { display: flex; flex-direction: column; gap: var(--size-16); }
.auth-section__title { color: var(--text-muted); }

/* «Сцена» — фон страницы реального экрана, по центру. */
.auth-stage {
    display: flex;
    justify-content: center;
    padding: var(--size-32) var(--size-16);
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
}

/* ─── Лого ─── */
.auth-logo { display: inline-flex; text-decoration: none; }
.auth-logo__text {
    font-size: var(--font-size-heading-m);
    font-weight: var(--font-weight-semibold);
    color: var(--brand);
    letter-spacing: 0.01em;
}

/* ─── Форма входа/регистрации ─── */
.auth-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-24);
    width: 100%;
    max-width: 340px;            /* реал .auth__block width: 340px */
}
.auth-card { width: 100%; }
.auth-card__head { display: flex; flex-direction: column; gap: var(--size-4); text-align: center; }
.auth-card__title { text-align: center; color: var(--text-heading); margin-bottom: var(--size-16); }
.auth-card__head .auth-card__title { margin-bottom: 0; }
.auth-card__sub { color: var(--text-muted); margin-bottom: var(--size-16); }

.auth-fields { display: flex; flex-direction: column; gap: var(--size-16); }

.auth-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-12);
}

.auth-agree { display: flex; align-items: flex-start; gap: var(--size-8); cursor: pointer; }
.auth-agree :deep(.ds-check) { min-height: auto; }

.auth-submit { width: 100%; }

.auth-card__foot { text-align: center; color: var(--text-muted); margin-top: var(--size-16); }
.auth-support { text-align: center; color: var(--text-muted); margin-top: var(--size-16); }

.auth-link { color: var(--brand); text-decoration: none; }
.auth-link:hover { color: var(--brand-hover); text-decoration: underline; }

/* ─── Подключение магазина ─── */
.connect {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-24);
    width: 100%;
    max-width: 960px;            /* layout-конвенция: ширина страницы подключения */
}
.connect--narrow { max-width: 460px; }
.connect__logo { margin-bottom: var(--size-8); }
.connect__title { text-align: center; color: var(--text-heading); }

.connect__warn { width: 100%; }
.connect__warn-title { margin: 0 0 var(--size-4); color: var(--text-heading); }
.connect__warn-ico { color: var(--notice-accent); font-size: var(--font-size-heading-m); }

/* Две панели маркетплейсов: десктоп — рядом, мобайл — колонкой. */
.connect__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-24);
    width: 100%;

    @include respond-to(md) { grid-template-columns: 1fr 1fr; }
}

.mp { width: 100%; }
.mp--subtle { background: var(--surface-subtle); }
.mp :deep(.ds-card__body) { display: flex; flex-direction: column; gap: var(--size-16); }

.mp__brand { font-size: var(--font-size-heading-m); font-weight: var(--font-weight-semibold); letter-spacing: 0.02em; }
/* WB-бренд в реале — фирменный маджента, в палитре ДС нет такого токена.
   Используем ближайший семантический --status-attention (purple), Ozon — --brand. */
.mp__brand--wb { color: var(--status-attention); }
.mp__brand--ozon { color: var(--brand); }

.mp__field :deep(.ds-input) { background: var(--surface-default); }

/* Разделитель «или» между ключом и OAuth. */
.mp__or { display: flex; align-items: center; gap: var(--size-12); }
.mp__or::before,
.mp__or::after { content: ""; flex: 1 1 auto; height: 1px; background: var(--border-default); }
.mp__or-label { color: var(--text-muted); }

.mp__oauth { width: 100%; }

.mp__links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--size-6); }

.connect__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--size-16);
}
</style>
