<template>
    <!--
      DsApiKeyField — поле(я) ввода ключа подключения магазина.
      Реал: Components/Account/ApiKeyField.vue (WB — одно поле «API-ключ»;
      Ozon — два поля «Client ID» + «API-ключ»; getValue() склеивает их через ":").
      Эталоны: подключение__магазин@wb/@ozon, настройки__модалка-изменить-ключ@wb.
      Надстройки ДС: опциональное маскирование (показать/скрыть) и копирование (DsCopyButton).
      Построен поверх DsInput; v-model — объект { clientId, apiKey }.
    -->
    <div class="ds-apikey">
        <!-- Ozon: первое поле Client ID (для WB не рендерится) -->
        <div v-if="marketplace === 'ozon'" class="ds-apikey__row">
            <div class="ds-apikey__input">
                <DsInput
                    :model-value="modelValue.clientId"
                    :type="revealed ? 'text' : inputType"
                    :placeholder="`Client ID ${label}`"
                    :error="errorClientId"
                    @update:model-value="update('clientId', $event)"
                />
            </div>
            <div v-if="maskable || copyable" class="ds-apikey__tools">
                <button
                    v-if="maskable"
                    type="button"
                    class="ds-apikey__toggle"
                    :aria-label="revealed ? 'Скрыть' : 'Показать'"
                    @click="revealed = !revealed"
                >
                    <span :class="revealed ? 'fm-eye-off' : 'fm-eye'" aria-hidden="true"></span>
                </button>
                <DsCopyButton v-if="copyable" :text="modelValue.clientId" />
            </div>
        </div>

        <!-- API-ключ (есть у обоих маркетплейсов) -->
        <div class="ds-apikey__row">
            <div class="ds-apikey__input">
                <DsInput
                    :model-value="modelValue.apiKey"
                    :type="revealed ? 'text' : inputType"
                    :placeholder="`API-ключ ${label}`"
                    :error="error"
                    @update:model-value="update('apiKey', $event)"
                />
            </div>
            <div v-if="maskable || copyable" class="ds-apikey__tools">
                <button
                    v-if="maskable"
                    type="button"
                    class="ds-apikey__toggle"
                    :aria-label="revealed ? 'Скрыть' : 'Показать'"
                    @click="revealed = !revealed"
                >
                    <span :class="revealed ? 'fm-eye-off' : 'fm-eye'" aria-hidden="true"></span>
                </button>
                <DsCopyButton v-if="copyable" :text="modelValue.apiKey" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import DsInput from '@/Components/Ds/DsInput.vue';
import DsCopyButton from '@/Components/Ds/DsCopyButton.vue';

const props = defineProps({
    // Маркетплейс: 'wb' — одно поле; 'ozon' — Client ID + API-ключ.
    marketplace: { type: String, default: 'wb', validator: (v) => ['wb', 'ozon'].includes(v) },
    // v-model — объект значений ключа.
    modelValue: { type: Object, default: () => ({ clientId: '', apiKey: '' }) },
    // Inline-ошибка для поля API-ключа.
    error: { type: String, default: '' },
    // Inline-ошибка для поля Client ID (только Ozon).
    errorClientId: { type: String, default: '' },
    // Маскировать значение и показывать переключатель «показать/скрыть».
    maskable: { type: Boolean, default: false },
    // Показывать кнопку копирования (DsCopyButton).
    copyable: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

import { ref } from 'vue';
const revealed = ref(false);
const inputType = computed(() => (props.maskable ? 'password' : 'text'));
const label = computed(() => (props.marketplace === 'ozon' ? 'Ozon' : 'Wildberries'));

function update(field, value) {
    emit('update:modelValue', { ...props.modelValue, [field]: value });
}
</script>

<style lang="scss" scoped>
.ds-apikey { display: flex; flex-direction: column; gap: var(--size-12); }
.ds-apikey__row { display: flex; align-items: flex-start; gap: var(--size-8); }
.ds-apikey__input { flex: 1 1 auto; min-width: 0; }
.ds-apikey__tools {
    display: inline-flex;
    align-items: center;
    gap: var(--size-8);
    /* выровнять по контролу DsInput (min-height 42px), а не по ошибке снизу */
    height: 42px;
}
.ds-apikey__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--transition-fast) var(--ease-standard);
}
.ds-apikey__toggle:hover { color: var(--brand); }
.ds-apikey__toggle span { font-size: var(--font-size-body-s); line-height: 1; }
</style>
