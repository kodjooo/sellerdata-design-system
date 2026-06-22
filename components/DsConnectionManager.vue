<template>
    <!--
      DsConnectionManager — управление состоянием подключения магазина.
      Реал: Components/Settings/UpdateAccountApiKeyLink.vue (вычисляемое connectionState:
      oauth | apiKey | disconnected | inactive; статус-баннер + дата истечения ключа +
      карточки-действия «через OAuth» / «обновить ключ» / «отключить»).
      Эталон: настройки__модалка-изменить-ключ@wb.
      Статус-нотис — DsNotice; раскрытие ключа — DsApiKeyField; кнопки — DsButton.
      v-model:action — выбранное действие; модель ключа — v-model:apiKey.
    -->
    <div class="ds-conn">
        <!-- Статус-баннер: успех (подключено) / предупреждение (нет/отключено) -->
        <div class="ds-conn__status" :class="`ds-conn__status--${statusVariant}`" role="status">
            <span class="ds-conn__status-ico" :class="statusVariant === 'success' ? 'fm-check-circle' : 'fm-alert-circle'" aria-hidden="true"></span>
            <div>
                <p class="t-label-m ds-conn__status-title">{{ statusLabel }}</p>
                <p v-if="statusMeta" class="t-body-s ds-conn__status-meta">{{ statusMeta }}</p>
            </div>
        </div>

        <!-- Выбор действия -->
        <p class="t-label-m ds-conn__section">Выберите действие</p>
        <div class="ds-conn__actions">
            <button
                v-for="opt in actions"
                :key="opt.key"
                type="button"
                class="ds-conn__action"
                :class="{ 'is-active': selected === opt.key }"
                @click="select(opt.key)"
            >
                <span class="ds-conn__action-ico" :class="opt.icon" aria-hidden="true"></span>
                <span class="ds-conn__action-body">
                    <span class="t-label-m ds-conn__action-title">{{ opt.title }}</span>
                    <span class="t-body-s ds-conn__action-desc">{{ opt.desc }}</span>
                </span>
            </button>
        </div>

        <!-- Раскрываемый контент: ввод ключа -->
        <div v-if="selected === 'updateApiKey'" class="ds-conn__panel">
            <DsApiKeyField
                :marketplace="marketplace"
                :model-value="apiKey"
                :error="error"
                @update:model-value="$emit('update:apiKey', $event)"
            />
        </div>
        <DsNotice v-else-if="selected === 'disconnectStore'" tone="peach" :dismissible="false">
            Синхронизация будет остановлена. Все накопленные данные останутся в системе.
            Вы сможете подключить магазин заново в любой момент.
        </DsNotice>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import DsNotice from '@/Components/Ds/DsNotice.vue';
import DsApiKeyField from '@/Components/Ds/DsApiKeyField.vue';

const props = defineProps({
    // Состояние подключения (реал: connectionState).
    state: { type: String, default: 'inactive', validator: (v) => ['oauth', 'apiKey', 'disconnected', 'inactive'].includes(v) },
    // Маркетплейс — пробрасывается в DsApiKeyField.
    marketplace: { type: String, default: 'wb', validator: (v) => ['wb', 'ozon'].includes(v) },
    // Дата истечения ключа (ISO/Date) — показывается в мете при apiKey.
    expiresAt: { type: [String, Date], default: null },
    // v-model:action — выбранное действие.
    action: { type: String, default: null },
    // v-model:apiKey — объект значений ключа для DsApiKeyField.
    apiKey: { type: Object, default: () => ({ clientId: '', apiKey: '' }) },
    // Inline-ошибка ключа.
    error: { type: String, default: '' },
});
const emit = defineEmits(['update:action', 'update:apiKey']);

const statusVariant = computed(() =>
    props.state === 'oauth' || props.state === 'apiKey' ? 'success' : 'warning'
);
const statusLabel = computed(() => ({
    oauth: 'Подключено через OAuth 2.0',
    apiKey: 'Подключено по API-ключу',
    disconnected: 'OAuth-подключение отключено',
    inactive: 'Не подключено',
}[props.state]));
const statusMeta = computed(() => {
    if (props.state === 'apiKey' && props.expiresAt) {
        const d = new Date(props.expiresAt);
        return 'Ключ активен до ' + d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (props.state === 'disconnected') return 'Синхронизация данных остановлена';
    return '';
});

// Карточки-действия зависят от состояния (реал: actionLabels/showDisconnectOption).
const actions = computed(() => {
    const isOAuth = props.state === 'oauth';
    const list = [
        {
            key: 'reconnectOAuth',
            icon: isOAuth ? 'fm-refresh-cw' : 'fm-link',
            title: isOAuth ? 'Переподключить через OAuth' : 'Подключить через OAuth',
            desc: isOAuth ? 'Обновить через личный кабинет ВБ' : 'Подключение через личный кабинет ВБ',
        },
        {
            key: 'updateApiKey',
            icon: 'fm-key',
            title: props.state === 'apiKey' ? 'Обновить API-ключ' : 'Подключить по API-ключу',
            desc: props.state === 'apiKey' ? 'Заменить текущий ключ' : 'Вставить ключ из настроек вручную',
        },
    ];
    if (isOAuth) {
        list.push({
            key: 'disconnectStore',
            icon: 'fm-slash',
            title: 'Отключить магазин',
            desc: 'Данные сохранятся, синхронизация остановится',
        });
    }
    return list;
});

// Действие по умолчанию: для oauth/disconnected — OAuth, иначе — ключ.
const defaultAction = computed(() =>
    props.state === 'oauth' || props.state === 'disconnected' ? 'reconnectOAuth' : 'updateApiKey'
);
const selected = computed(() => props.action ?? defaultAction.value);

function select(key) { emit('update:action', key); }
</script>

<style lang="scss" scoped>
.ds-conn { display: flex; flex-direction: column; gap: var(--size-16); }

/* Статус-баннер */
.ds-conn__status {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    padding: var(--size-16);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
}
.ds-conn__status--success { background: var(--notice-success-bg); border-color: var(--notice-success-text); }
.ds-conn__status--warning { background: var(--notice-bg);         border-color: var(--notice-border); }
.ds-conn__status-ico { font-size: var(--font-size-heading-m); line-height: 1; }
.ds-conn__status--success .ds-conn__status-ico { color: var(--notice-success-text); }
.ds-conn__status--warning .ds-conn__status-ico { color: var(--status-warning); }
.ds-conn__status-title { display: block; margin: 0; color: var(--text-heading); }
.ds-conn__status-meta { margin: 0; color: var(--text-muted); }

.ds-conn__section { margin: 0; color: var(--text-heading); }

/* Карточки-действия */
.ds-conn__actions { display: flex; flex-direction: column; gap: var(--size-8); }
.ds-conn__action {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    width: 100%;
    padding: var(--size-12) var(--size-16);
    text-align: left;
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: border-color var(--transition-base) var(--ease-standard),
                background-color var(--transition-base) var(--ease-standard);
}
.ds-conn__action:hover { border-color: var(--brand); }
.ds-conn__action.is-active { background: var(--brand); border-color: var(--brand); }
.ds-conn__action.is-active .ds-conn__action-title,
.ds-conn__action.is-active .ds-conn__action-desc,
.ds-conn__action.is-active .ds-conn__action-ico { color: var(--text-on-brand); }
.ds-conn__action-ico {
    flex: 0 0 auto;
    font-size: var(--font-size-heading-m);
    line-height: 1;
    color: var(--brand);
}
.ds-conn__action-body { display: flex; flex-direction: column; min-width: 0; }
.ds-conn__action-title { color: var(--text-heading); }
.ds-conn__action-desc { color: var(--text-muted); }

.ds-conn__panel { display: flex; flex-direction: column; gap: var(--size-8); }
</style>
