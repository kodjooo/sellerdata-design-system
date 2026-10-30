<template>
    <!--
        DsDatePicker — выбор ОДНОЙ даты (реал-кейс: поле «Действует до» в модалке
        «Настройка прав» фичи «Роли доступов»). Не путать с DsDateRangePicker —
        тот про пресеты периода («Один месяц» / «Произвольный период»).

        Триггер — DsInput (readonly, placeholder «дд.мм.гггг», suffix-иконка
        fm-calendar, высота --control-height-md). По клику открывается панель
        календаря: шапка «‹ Июнь 2026 ›», дни недели строчными (пн вт ср …),
        сетка дней; выбранный день — заливка var(--brand) + текст var(--white).

        Панель рендерит @vuepic/vue-datepicker (библиотека уже в проекте: даёт
        клавиатуру, локаль и edge-cases). Вид задан ТОЛЬКО через маппинг её
        CSS-переменных --dp-* на наши токены (см. второй <style> ниже).
        Панель телепортируется в <body> (position: absolute) — контент не
        раздвигается, и её не режет overflow модалки/таблицы.

        Пропсы:
          modelValue  String   — дата строкой «дд.мм.гггг»; '' = без ограничения (валидно)
          placeholder String   — placeholder поля, по умолчанию «дд.мм.гггг»
          label       String   — подпись над полем (t-label-m из DsInput)
          disabled    Boolean  — поле неактивно, панель не открывается
          clearable   Boolean  — показывать крестик очистки при заполненном поле
          minDate     String   — минимальная доступная дата, «дд.мм.гггг»
          maxDate     String   — максимальная доступная дата, «дд.мм.гггг»

        Эмиты:
          update:modelValue (String) — «дд.мм.гггг» либо '' при очистке

        Слоты: нет (поле-триггер фиксировано, чтобы вид даты был единым).
    -->
    <div class="ds-datepicker">
        <VueDatePicker
            ref="pickerRef"
            :model-value="dateValue"
            :disabled="disabled"
            :min-date="minDateValue"
            :max-date="maxDateValue"
            :enable-time-picker="false"
            :month-change-on-scroll="false"
            :clearable="false"
            :ui="{ menu: 'ds-datepicker__menu' }"
            locale="ru"
            month-name-format="long"
            position="left"
            six-weeks="fair"
            auto-apply
            teleport
            @update:model-value="onUpdate"
        >
            <!--
                Открываем/закрываем панель по mousedown, а click глушим (@click.stop).
                Причина: DsInput — это <label> с input внутри; клик по label (подписи,
                иконке календаря) браузер дублирует синтетическим click на самом input.
                Штатный обработчик библиотеки (click по её root) получал бы ДВА клика и
                тут же закрывал панель. mousedown приходит ровно один раз.
            -->
            <template #trigger>
                <div
                    ref="triggerRef"
                    class="ds-datepicker__trigger"
                    @mousedown="onTriggerMousedown"
                    @click.stop
                    @keydown.enter.prevent="openMenu"
                    @keydown.space.prevent="openMenu"
                >
                    <DsInput
                        :model-value="modelValue"
                        :label="label"
                        :placeholder="placeholder"
                        :disabled="disabled"
                        readonly
                        suffix-icon="fm-calendar"
                    />
                    <!-- Очистка = «без ограничения по сроку». stop, чтобы не открыть панель. -->
                    <button
                        v-if="showClear"
                        type="button"
                        class="ds-datepicker__clear fm-close"
                        aria-label="Очистить дату"
                        @mousedown.stop
                        @click.stop="clear"
                    ></button>
                </div>
            </template>
        </VueDatePicker>
    </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import DsInput from '@/Components/Ds/DsInput.vue';

const props = defineProps({
    // Значение — строка «дд.мм.гггг». Пустая строка = дата не задана (валидное состояние).
    modelValue: { type: String, default: '' },
    // Placeholder поля-триггера.
    placeholder: { type: String, default: 'дд.мм.гггг' },
    // Подпись над полем.
    label: { type: String, default: '' },
    // Неактивное поле: панель не открывается.
    disabled: { type: Boolean, default: false },
    // Крестик очистки при заполненном поле.
    clearable: { type: Boolean, default: true },
    // Границы выбора, тоже «дд.мм.гггг» ('' — без границы).
    minDate: { type: String, default: '' },
    maxDate: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const pickerRef = ref(null);
const triggerRef = ref(null);
const focusScope = inject(Symbol.for('sellerdata:ds:focusScope'), null);
let unregisterPopup;

onMounted(() => {
    unregisterPopup = focusScope?.registerPopup({
        trigger: () => triggerRef.value,
        menu: () => pickerRef.value?.getDpWrapMenuRef()?.value,
        close: closeMenu,
    });
});

onBeforeUnmount(() => {
    unregisterPopup?.();
});

// ─── Парсинг/формат «дд.мм.гггг» ────────────────────────────────────────
// Своя пара функций вместо date-fns: date-fns — транзитивная зависимость
// самого пикера, прямой импорт из проекта был бы ненадёжен.
const RU_DATE_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/;

function parseRu(value) {
    const match = RU_DATE_RE.exec(String(value || '').trim());
    if (!match) return null;
    const [, day, month, year] = match.map(Number);
    const date = new Date(year, month - 1, day);
    // Date молча «переносит» 32.13.2026 на другой месяц — отсекаем такое.
    if (date.getDate() !== day || date.getMonth() !== month - 1) return null;
    return date;
}

function formatRu(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

const dateValue = computed(() => parseRu(props.modelValue));
const minDateValue = computed(() => parseRu(props.minDate) ?? undefined);
const maxDateValue = computed(() => parseRu(props.maxDate) ?? undefined);

const showClear = computed(() => props.clearable && !props.disabled && !!props.modelValue);

function onUpdate(date) {
    emit('update:modelValue', formatRu(date));
}

function clear() {
    emit('update:modelValue', '');
}

function onTriggerMousedown(event) {
    if (props.disabled) return;
    if (event.button !== 0) return; // только основная кнопка мыши
    pickerRef.value?.toggleMenu();
}

function openMenu() {
    if (props.disabled) return;
    pickerRef.value?.openMenu();
}

function closeMenu() {
    pickerRef.value?.closeMenu();
}

// Программное управление панелью (нужно каталогу ДС и редким сценариям вроде
// «открыть календарь по кнопке рядом»). На API v-model не влияет.
defineExpose({ openMenu, closeMenu });
</script>

<style lang="scss" scoped>
/* Компактное поле даты; ширина перекрывается снаружи (max-width/width на .ds-datepicker). */
.ds-datepicker { max-width: var(--size-240); }

.ds-datepicker__trigger { position: relative; }

/* Поле только читаемое — курсор как у контрола выбора. */
.ds-datepicker__trigger :deep(.ds-input) { cursor: pointer; }
.ds-datepicker__trigger :deep(.ds-input:disabled) { cursor: not-allowed; }

/* Крестик очистки: слева от suffix-иконки календаря (та стоит на right: --size-12).
   Прижат к низу триггера, чтобы центрироваться по полю и при наличии label. */
.ds-datepicker__clear {
    position: absolute;
    right: var(--size-32);
    bottom: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size-20);
    height: var(--control-height-md);
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    font-size: var(--font-size-caption);
    line-height: var(--line-height-tight);
    cursor: pointer;
    opacity: var(--opacity-hover);
    transition: opacity var(--transition-fast) var(--ease-standard),
                color var(--transition-fast) var(--ease-standard);
}
.ds-datepicker__clear:hover { opacity: var(--opacity-full); color: var(--text-default); }
.ds-datepicker__clear:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); border-radius: var(--radius-sm); }
</style>

<style lang="scss">
/*
   Панель календаря телепортируется в <body>, поэтому scoped-стили её не достают —
   блок намеренно НЕ scoped. Все селекторы начинаются с .ds-datepicker__menu
   (класс передан через :ui), так что legacy-пикеры (_vueDatepicker.scss) не затронуты.

   Двойной класс .ds-datepicker__menu.dp__menu нужен, чтобы перебить
   .dp__theme_light / .dp__menu_index — они висят на ТОМ ЖЕ элементе.
*/
.ds-datepicker__menu.dp__menu {
    /* Слой: панель обязана лежать над модалкой (--z-modal). Библиотека ставит
       сырой z-index: 99999 — заменяем на токен. */
    z-index: var(--z-popover);

    /* Типографика/поверхность */
    --dp-font-family: var(--font-family-sans);
    --dp-font-size: var(--font-size-body-s);
    --dp-background-color: var(--surface-default);
    --dp-text-color: var(--text-default);
    --dp-hover-color: var(--surface-muted);
    --dp-hover-text-color: var(--text-heading);
    --dp-hover-icon-color: var(--text-heading);

    /* Выбранная дата — заливка бренда, текст белый */
    --dp-primary-color: var(--brand);
    --dp-primary-text-color: var(--white);
    --dp-primary-disabled-color: var(--surface-disabled);
    --dp-highlight-color: rgb(from var(--brand) r g b / 0.12);

    /* Границы/иконки/состояния */
    --dp-secondary-color: var(--text-placeholder);
    --dp-border-color: var(--border-default);
    --dp-menu-border-color: var(--border-default);
    --dp-border-color-hover: var(--border-strong);
    --dp-border-color-focus: var(--brand);
    --dp-icon-color: var(--text-muted);
    --dp-disabled-color: var(--surface-muted);
    --dp-disabled-color-text: var(--text-disabled);
    --dp-danger-color: var(--status-danger);
    --dp-marker-color: var(--status-danger);
    --dp-tooltip-color: var(--surface-subtle);
    --dp-scroll-bar-background: var(--surface-scrollbar-track);
    --dp-scroll-bar-color: var(--surface-scrollbar-thumb);

    /* Геометрия: панель = --radius-md (как DsPopover), ячейка-день = --radius-sm (плотный chip) */
    --dp-border-radius: var(--radius-md);
    --dp-cell-border-radius: var(--radius-sm);
    --dp-cell-size: var(--size-32);
    --dp-cell-padding: var(--size-2);
    --dp-menu-padding: var(--size-12);
    --dp-menu-min-width: calc(var(--size-32) * 7 + var(--size-24));
    --dp-month-year-row-height: var(--size-32);
    --dp-month-year-row-button-size: var(--size-32);
    --dp-button-height: var(--size-32);
    --dp-button-icon-height: var(--size-16);
    --dp-common-padding: var(--size-8);
    --dp-row-margin: var(--size-2) 0;
    --dp-calendar-header-cell-padding: var(--size-4);
    --dp-calendar-wrap-padding: 0;

    /* Анимация */
    --dp-animation-duration: var(--transition-fast);
    --dp-common-transition: all var(--transition-fast) var(--ease-standard);
    --dp-transition-timing: var(--ease-standard);

    /* Дропдаун-панель: рамка + выраженная тень (канон DsPopover).
       !important — legacy _vueDatepicker.scss задаёт .dp__menu { border: 0 !important;
       box-shadow: … !important } глобально; иначе перебить нельзя. */
    border: 1px solid var(--border-default) !important;
    box-shadow: var(--shadow-dropdown) !important;
}

/* Внешняя обёртка телепорта — тоже с сырым z-index: 99999 у библиотеки. */
.dp__outer_menu_wrap:has(> .ds-datepicker__menu) { z-index: var(--z-popover); }

/* Шапка «‹ Июнь 2026 ›»: месяц/год с заглавной (Intl для ru даёт «июнь»). */
.ds-datepicker__menu.dp__menu .dp__month_year_select { text-transform: capitalize; }

/* Дни недели: СТРОЧНЫМИ (legacy глобально ставит capitalize) и muted-вес,
   как у th в таблицах ЛК (--text-muted, вес 400). */
.ds-datepicker__menu.dp__menu .dp__calendar_header { font-weight: var(--font-weight-regular); }
.ds-datepicker__menu.dp__menu .dp__calendar_header_item {
    text-transform: lowercase;
    color: var(--text-muted);
}
</style>
