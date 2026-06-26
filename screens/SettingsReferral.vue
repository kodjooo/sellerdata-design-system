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

                        <DsCopyField
                            class="ref-link"
                            :value="referralLink"
                            label="Ниже Ваша персональная реферальная ссылка:"
                            break
                        />

                        <!-- Партнёрская программа -->
                        <DsCallout
                            title="Вы управляете сообществом продавцов на Wildberries или Ozon?"
                            text="Если вы обучаете, создаёте контент, оказываете влияние или помогаете общаться, мы хотим видеть вас в качестве нашего партнёра."
                        >
                            <template #action>
                                <DsButton variant="primary">Станьте партнером</DsButton>
                            </template>
                        </DsCallout>
                    </div>

                    <!-- Промо-карточка с «+1» -->
                    <DsPromoCard class="ref-promo" badge="+1" icon="fm-calendar">
                        месяц<br>бесплатного<br>использования
                    </DsPromoCard>
                </div>

                <!-- ── Как это работает: 3 шага со стрелками ── -->
                <DsStepFlow class="ref-flow" :steps="steps" />
            </DsCard>
        </div>
    </ScreenShell>
</template>

<script setup>
import { Head } from '@inertiajs/vue3';
import ScreenShell from './ScreenShell.vue';
import DsCard from '@/Components/Ds/DsCard.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsCopyField from '@/Components/Ds/DsCopyField.vue';
import DsCallout from '@/Components/Ds/DsCallout.vue';
import DsPromoCard from '@/Components/Ds/DsPromoCard.vue';
import DsStepFlow from '@/Components/Ds/DsStepFlow.vue';

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

/* ── Hero (раскладка страницы) ── */
.ref-hero {
    display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: var(--size-32); align-items: stretch;
}
.ref-title { color: var(--text-heading); margin: 0 0 var(--size-16); }
.ref-sub { color: var(--text-muted); margin: 0 0 var(--size-24); }

/* отступы блоков героя между собой */
.ref-link { margin-bottom: var(--size-24); }

.ref-flow { margin-top: var(--size-32); }

@include respond-below(lg) {
    .ref-hero { grid-template-columns: 1fr; }
}
</style>
