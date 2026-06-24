<template>
    <DocsLayout
        title="Подключение магазина"
        breadcrumb="Components"
        description="Два компонента подключения магазина к Sellerdata. DsApiKeyField — поле(я) ввода ключа (реал: Account/ApiKeyField.vue): для WB одно поле «API-ключ», для Ozon — Client ID + API-ключ; опционально маскирование (показать/скрыть) и копирование. DsConnectionManager — управление состоянием подключения (реал: Settings/UpdateAccountApiKeyLink.vue): статус-баннер (DsNotice-палитра) с датой истечения ключа и карточки-действия OAuth / обновить ключ / отключить. Состояния: oauth · apiKey · disconnected · inactive."
    >
        <section>
            <h2>DsApiKeyField — Wildberries</h2>
            <DocExample plain>
                <DsApiKeyField marketplace="wb" v-model="wbKey" />
            </DocExample>
        </section>

        <section>
            <h2>DsApiKeyField — Ozon (Client ID + ключ)</h2>
            <DocExample plain>
                <DsApiKeyField marketplace="ozon" v-model="ozKey" />
            </DocExample>
        </section>

        <section>
            <h2>DsApiKeyField — маскирование + копирование + ошибка</h2>
            <DocExample plain>
                <DsApiKeyField
                    marketplace="wb"
                    v-model="maskedKey"
                    maskable
                    copyable
                    error="Неверный формат ключа"
                />
            </DocExample>
        </section>

        <section>
            <h2>Пропсы DsApiKeyField</h2>
            <PropsTable :rows="fieldProps" />
        </section>

        <section>
            <h2>DsConnectionManager — состояния</h2>
            <p class="t-body-s conn-hint">Переключите состояние, чтобы увидеть баннер и набор карточек-действий.</p>
            <DocExample plain>
                <div class="conn-states">
                    <DsButton
                        v-for="s in states"
                        :key="s.value"
                        :variant="state === s.value ? 'primary' : 'secondary'"
                        size="md"
                        @click="setState(s.value)"
                    >{{ s.label }}</DsButton>
                </div>
                <DsConnectionManager
                    :state="state"
                    marketplace="wb"
                    expires-at="2026-12-07"
                    v-model:action="action"
                    v-model:apiKey="connKey"
                />
            </DocExample>
        </section>

        <section>
            <h2>Пропсы DsConnectionManager</h2>
            <PropsTable :rows="managerProps" />
        </section>

        <section>
            <h2>События</h2>
            <PropsTable :rows="events" />
        </section>
    </DocsLayout>
</template>

<script setup>
import { ref } from 'vue';
import DocsLayout from '../Shared/DocsLayout.vue';
import DocExample from '../Shared/DocExample.vue';
import PropsTable from '../Shared/PropsTable.vue';
import DsButton from '@/Components/Ds/DsButton.vue';
import DsApiKeyField from '@/Components/Ds/DsApiKeyField.vue';
import DsConnectionManager from '@/Components/Ds/DsConnectionManager.vue';

const wbKey = ref({ clientId: '', apiKey: '' });
const ozKey = ref({ clientId: '', apiKey: '' });
const maskedKey = ref({ clientId: '', apiKey: 'eyJhbGciOi...secret' });

const state = ref('apiKey');
const action = ref(null);
const connKey = ref({ clientId: '', apiKey: '' });
const states = [
    { value: 'oauth', label: 'OAuth' },
    { value: 'apiKey', label: 'По ключу' },
    { value: 'disconnected', label: 'Отключён' },
    { value: 'inactive', label: 'Не подключён' },
];
function setState(v) { state.value = v; action.value = null; }

const fieldProps = [
    { name: 'marketplace', type: "'wb' | 'ozon'", default: "'wb'", desc: 'wb — одно поле; ozon — Client ID + API-ключ.' },
    { name: 'modelValue', type: '{ clientId, apiKey }', default: "{ '', '' }", desc: 'v-model — объект значений ключа.' },
    { name: 'error', type: 'string', default: "''", desc: 'Inline-ошибка поля API-ключа.' },
    { name: 'errorClientId', type: 'string', default: "''", desc: 'Inline-ошибка поля Client ID (Ozon).' },
    { name: 'maskable', type: 'boolean', default: 'false', desc: 'Маскировать значение + кнопка показать/скрыть.' },
    { name: 'copyable', type: 'boolean', default: 'false', desc: 'Кнопка копирования (DsCopyButton).' },
];
const managerProps = [
    { name: 'state', type: "'oauth' | 'apiKey' | 'disconnected' | 'inactive'", default: "'inactive'", desc: 'Состояние подключения магазина.' },
    { name: 'marketplace', type: "'wb' | 'ozon'", default: "'wb'", desc: 'Пробрасывается в DsApiKeyField.' },
    { name: 'expiresAt', type: 'string | Date', default: 'null', desc: 'Дата истечения ключа (показ в мете при apiKey).' },
    { name: 'action', type: 'string', default: 'null', desc: 'v-model:action — выбранное действие.' },
    { name: 'apiKey', type: '{ clientId, apiKey }', default: "{ '', '' }", desc: 'v-model:apiKey — модель ключа для поля.' },
    { name: 'error', type: 'string', default: "''", desc: 'Inline-ошибка ключа.' },
];
const events = [
    { name: 'update:modelValue', type: '({ clientId, apiKey })', default: '—', desc: 'DsApiKeyField — изменение значений.' },
    { name: 'update:action', type: '(key)', default: '—', desc: 'DsConnectionManager — выбор карточки-действия.' },
    { name: 'update:apiKey', type: '({ clientId, apiKey })', default: '—', desc: 'DsConnectionManager — изменение ключа.' },
];
</script>

<style lang="scss" scoped>
.conn-hint { color: var(--text-muted); margin-bottom: var(--size-12); }
.conn-states { display: flex; flex-wrap: wrap; gap: var(--size-8); margin-bottom: var(--size-16); }
</style>
