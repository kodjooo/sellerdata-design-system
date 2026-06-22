<template>
    <!--
        DsNotificationBell — колокол со счётчиком непрочитанных (реал: .notification__trigger
        + .notification__counter в шапке). Иконка fm-bell, синяя; при count>0 — числовой
        бейдж (бренд-фон, белый текст, min 16px, скруглён). Клик открывает список.
    -->
    <button
        type="button"
        class="ds-bell"
        :aria-label="ariaLabel"
        @click="onClick"
    >
        <i class="fm-bell ds-bell__icon" aria-hidden="true"></i>
        <span v-if="count > 0" class="ds-bell__counter">{{ displayCount }}</span>
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // Количество непрочитанных. 0 — бейдж скрыт.
    count: { type: Number, default: 0 },
    // Максимум на бейдже: больше — показывается «N+».
    max: { type: Number, default: 99 },
    // Подпись для скринридеров.
    ariaLabel: { type: String, default: 'Уведомления' },
});

const emit = defineEmits(['click', 'open']);

// «99+» при превышении max (реал бейдж узкий — длинные числа сокращаем).
const displayCount = computed(() =>
    props.count > props.max ? `${props.max}+` : String(props.count),
);

function onClick(event) {
    emit('click', event);
    emit('open');
}
</script>

<style lang="scss" scoped>
/* реал .notification__trigger: прозрачная кнопка 38×38, синяя иконка 16px */
.ds-bell {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--size-40);
    min-height: var(--size-40);
    padding: 0;
    background: transparent;
    border: 0;
    cursor: pointer;
}

.ds-bell__icon {
    font-size: var(--size-16);
    color: var(--brand);
}

/* реал .notification__counter: бренд-фон, белый, 10px/600, min 16px, скруглён */
.ds-bell__counter {
    position: absolute;
    top: var(--size-4);
    right: var(--size-4);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--size-16);
    height: var(--size-16);
    padding: 0 var(--size-4);
    font-size: var(--size-10);
    font-weight: 600;
    line-height: 1;
    color: var(--white);
    background: var(--brand);
    border-radius: var(--radius-full);
}
</style>
