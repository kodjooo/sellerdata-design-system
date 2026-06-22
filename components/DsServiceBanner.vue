<template>
    <!--
        DsServiceBanner — плашка «сервис недоступен» вверху страницы
        (реал: ServiceUnavailableWidget — «Нет подключения. Повторное подключение
        через mm:ss» + ссылка «Повторить сейчас»). Сообщение + таймер обратного
        отсчёта + кнопка retry. Тон warning (по умолчанию, amber) или danger.
    -->
    <div class="ds-service-banner" :class="`ds-service-banner--${tone}`" role="alert">
        <div class="ds-service-banner__inner">
            <span class="t-label-m ds-service-banner__message">{{ message }}</span>
            <span v-if="seconds > 0" class="t-body-s ds-service-banner__timer">{{ timerLabel }}</span>
        </div>
        <button
            v-if="showRetry"
            type="button"
            class="t-label-s ds-service-banner__retry"
            @click="$emit('retry')"
        >
            {{ retryLabel }}
        </button>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
    // Текст плашки (реал: «Нет подключения.»).
    message: { type: String, required: true },
    // Длительность обратного отсчёта в секундах (0 — без таймера).
    seconds: { type: Number, default: 0 },
    // Подпись кнопки повтора.
    retryLabel: { type: String, default: 'Повторить сейчас' },
    // Тон: warning (amber, default) | danger (красный).
    tone: { type: String, default: 'warning', validator: (v) => ['warning', 'danger'].includes(v) },
});
defineEmits(['retry']);

const left = ref(props.seconds);
let intervalId = null;

// Кнопка повтора видна, когда таймер истёк (или таймера нет вовсе).
const showRetry = computed(() => left.value <= 0);

const timerLabel = computed(() => {
    const total = Math.max(left.value, 0);
    const m = Math.floor(total / 60);
    const s = total - m * 60;
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(m)}:${pad(s)}`;
});

function stop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function start() {
    stop();
    left.value = props.seconds;
    if (props.seconds <= 0) return;
    intervalId = setInterval(() => {
        left.value -= 1;
        if (left.value <= 0) stop();
    }, 1000);
}

watch(() => props.seconds, start, { immediate: true });
onBeforeUnmount(stop);
</script>

<style lang="scss" scoped>
.ds-service-banner {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--size-8);
    padding: var(--size-8) var(--size-16);
    border: 1px solid var(--notice-border);
    border-radius: var(--radius-sm);
    background: var(--notice-bg);
    color: var(--text-heading);
    text-align: center;
}
.ds-service-banner--danger {
    border-color: var(--status-danger);
    background: var(--status-danger-bg);
    color: var(--status-danger-strong);
}

.ds-service-banner__inner {
    display: inline-flex;
    align-items: center;
    gap: var(--size-8);
}
.ds-service-banner__timer { color: var(--text-muted); }
.ds-service-banner--danger .ds-service-banner__timer { color: var(--status-danger-strong); }

.ds-service-banner__retry {
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
    transition: opacity var(--transition-base) var(--ease-standard);
}
.ds-service-banner__retry:hover { opacity: var(--opacity-muted); }

@media (max-width: 767.98px) {
    .ds-service-banner__inner { flex-direction: column; gap: var(--size-2); }
}
</style>
