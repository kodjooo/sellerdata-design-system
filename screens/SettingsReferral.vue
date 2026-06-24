<template>
    <Head title="Настройки · Пригласи друга — экран-эталон" />
    <ScreenShell active="settings" title="Пригласи друга">
        <div class="screen">

            <DsCard radius="lg" padding="--size-32" tag="section">
                <!-- ── Hero: слева оффер+ссылка+партнёр, справа промо-карточка ── -->
                <div class="ref-hero">
                    <div class="ref-hero__left">
                        <h1 class="t-heading-l ref-title">
                            Порекомендуйте sellerdata другу и получите 1 дополнительный бесплатный месяц к Вашему текущему тарифу
                        </h1>
                        <p class="t-body-l ref-sub">
                            Ваш друг получит 2 месяца бесплатного пробного периода на тариф «Бизнес» вместо 1
                        </p>

                        <p class="t-body-s ref-link-label">Ниже Ваша персональная реферальная ссылка:</p>
                        <div class="ref-link">
                            <span class="t-body-s ref-link__value">{{ referralLink }}</span>
                            <DsCopyButton :text="referralLink" class="ref-link__copy" />
                        </div>

                        <!-- Карточка партнёрской программы -->
                        <div class="ref-partner">
                            <div class="ref-partner__body">
                                <p class="t-label-m ref-partner__title">Вы управляете сообществом продавцов на Wildberries или Ozon?</p>
                                <p class="t-body-s ref-partner__text">
                                    Если вы обучаете, создаёте контент, оказываете влияние или помогаете общаться, мы хотим видеть вас в качестве нашего партнёра.
                                </p>
                            </div>
                            <DsButton variant="primary" class="ref-partner__btn">Станьте партнером</DsButton>
                        </div>
                    </div>

                    <!-- Промо-карточка с «+1» -->
                    <div class="ref-promo">
                        <span class="ref-promo__cal fm-calendar" aria-hidden="true"></span>
                        <span class="ref-promo__badge">+1</span>
                        <span class="ref-promo__text">месяц<br>бесплатного<br>использования</span>
                    </div>
                </div>

                <!-- ── Как это работает: 3 шага со стрелками ── -->
                <div class="ref-flow">
                    <template v-for="(step, i) in steps" :key="step.title">
                        <div class="ref-step">
                            <span class="ref-step__ico" :class="step.icon" aria-hidden="true"></span>
                            <h3 class="t-title-m ref-step__title">{{ step.title }}</h3>
                            <p class="t-body-s ref-step__text">{{ step.text }}</p>
                        </div>
                        <span v-if="i < steps.length - 1" class="ref-flow__arrow fm-arrow-right" aria-hidden="true"></span>
                    </template>
                </div>
            </DsCard>
        </div>
    </ScreenShell>
</template>

<script setup>
import { Head, Link } from '@inertiajs/vue3';
import ScreenShell from './ScreenShell.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsCopyButton from '@/Components/Ds/DsCopyButton.vue';

const referralLink = 'https://app.sellerdata.ru/?friend=6e72e3fa0e';

const steps = [
    { icon: 'fm-send', title: 'Отправляете ссылку', text: 'Поделитесь ссылкой с друзьями и откройте для них доступ к уникальному предложению!' },
    { icon: 'fm-user-check', title: 'Друг регистрируется', text: 'Ваши друзья легко присоединяются, получая мгновенный доступ к бонусам.' },
    { icon: 'fm-gift', title: 'Получаете бонус', text: 'Получите дополнительный месяц к вашему тарифу — бесплатно!' },
];
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

.screen { display: flex; flex-direction: column; gap: var(--size-16); }

/* Под-меню настроек (единый паттерн на 3 страницах) */
.settings-submenu {
    display: flex; align-items: center; gap: var(--size-24);
    border-bottom: 1px solid var(--border-default); margin-bottom: var(--size-8);
}
.settings-submenu__link {
    position: relative; padding: var(--size-8) 0;
    color: var(--text-default); text-decoration: none;
    transition: color var(--transition-base) var(--ease-standard);
}
.settings-submenu__link:hover { color: var(--brand); }
.settings-submenu__link.is-active { color: var(--brand); }
.settings-submenu__link.is-active::after {
    content: ''; position: absolute; left: 0; right: 0;
    bottom: calc(var(--border-width-accent) * -1); height: var(--border-width-accent);
    border-radius: var(--radius-sm); background: var(--brand);
}

/* ── Hero ── */
.ref-hero {
    display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: var(--size-32); align-items: stretch;
}
.ref-title { color: var(--text-heading); margin: 0 0 var(--size-16); }
.ref-sub { color: var(--text-muted); margin: 0 0 var(--size-24); }
.ref-link-label { color: var(--text-default); margin: 0 0 var(--size-8); }

.ref-link {
    display: flex; align-items: center; gap: var(--size-12);
    padding: var(--size-12) var(--size-16);
    border: 1px solid var(--border-input); border-radius: var(--radius-md);
    background: var(--surface-subtle); margin-bottom: var(--size-24);
}
.ref-link__value { flex: 1 1 auto; color: var(--text-heading); word-break: break-all; }
.ref-link__copy { flex: 0 0 auto; }

/* Партнёрская карточка */
.ref-partner {
    display: flex; align-items: center; gap: var(--size-24); flex-wrap: wrap;
    padding: var(--size-20) var(--size-24);
    border-radius: var(--radius-md); background: var(--surface-subtle);
}
.ref-partner__body { flex: 1 1 320px; min-width: 0; }
.ref-partner__title { color: var(--text-heading); margin: 0 0 var(--size-4); }
.ref-partner__text { color: var(--text-muted); margin: 0; }
.ref-partner__btn { flex: 0 0 auto; }

/* Промо-карточка «+1» */
.ref-promo {
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: flex-end;
    min-height: 320px;   /* layout-константа: высота промо-карточки ≈ левой колонки */
    padding: var(--size-32);
    border-radius: var(--radius-lg); background: var(--brand-gradient); color: var(--text-on-brand);
}
.ref-promo__cal {
    position: absolute; top: var(--size-32); right: var(--size-32);
    font-size: 120px; line-height: 1; opacity: var(--opacity-hover);   /* декоративная иллюстрация */
}
.ref-promo__badge {
    position: absolute; top: var(--size-48); right: var(--size-48);
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--size-64); height: var(--size-64); border-radius: var(--radius-full);
    background: var(--accent-pink); color: var(--white);
    font-size: var(--font-size-heading-l); font-weight: var(--font-weight-bold);
}
.ref-promo__text { font-size: var(--font-size-heading-m); font-weight: var(--font-weight-bold); line-height: var(--line-height-tight); }

/* ── 3 шага ── */
.ref-flow {
    display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center;
    gap: var(--size-16); margin-top: var(--size-32);
}
.ref-step {
    display: flex; flex-direction: column; align-items: center; gap: var(--size-8);
    padding: var(--size-24); text-align: center;
    border: 1px solid var(--border-default); border-radius: var(--radius-lg);
    height: 100%;
}
.ref-step__ico {
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--size-64); height: var(--size-64); border-radius: var(--radius-full);
    background: var(--surface-subtle); color: var(--brand); font-size: var(--font-size-heading-m);
}
.ref-step__title { color: var(--text-heading); margin: 0; }
.ref-step__text { color: var(--text-muted); margin: 0; }
.ref-flow__arrow { color: var(--text-placeholder); font-size: var(--font-size-heading-m); }

@include respond-below(lg) {
    .ref-hero { grid-template-columns: 1fr; }
    .ref-flow { grid-template-columns: 1fr; }
    .ref-flow__arrow { display: none; }
}
</style>
