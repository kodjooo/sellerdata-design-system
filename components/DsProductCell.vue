<template>
    <!--
        DsProductCell — ячейка товара для таблиц (реал .item: миниатюра 40×40 + название
        + строка «nmId / артикул»). Используется в таблицах Товаров, Дашборда, Рекламы.
    -->
    <span class="ds-product-cell">
        <img
            v-if="image"
            class="ds-product-cell__img"
            :src="image"
            :alt="name"
            :width="size"
            :height="size"
        />
        <span v-else-if="!hideThumb" class="ds-product-cell__thumb" aria-hidden="true"></span>

        <span class="ds-product-cell__body">
            <span class="t-body-s ds-product-cell__name">{{ name }}</span>
            <span v-if="sub || copyId || $slots.sub" class="t-body-s ds-product-cell__sub">
                <slot name="sub">
                    <DsCopyButton v-if="copyId" :text="String(copyId)" />
                    <a
                        v-if="copyId && copyHref"
                        class="ds-product-cell__id ds-product-cell__id--link"
                        :href="copyHref"
                        target="_blank"
                        rel="noopener"
                        @click.stop
                    >{{ copyId }}</a>
                    <span v-else-if="copyId" class="ds-product-cell__id">{{ copyId }}</span>
                    <span v-if="sub" class="ds-product-cell__meta">{{ sub }}</span>
                </slot>
            </span>
            <a v-if="detail" href="#" class="t-body-s ds-product-cell__detail" @click.prevent>Подробнее ›</a>
        </span>
    </span>
</template>

<script setup>
import DsCopyButton from './DsCopyButton.vue';

defineProps({
    // URL миниатюры; если не задан — рисуется placeholder-плашка (если не hideThumb).
    image: { type: String, default: '' },
    // Название товара.
    name: { type: String, default: '' },
    // Вторая строка: «nmId / артикул» (или слот #sub).
    sub: { type: String, default: '' },
    // Если задан — показать id с иконкой-копир (реал nmId + копир).
    copyId: { type: [String, Number], default: '' },
    // Если задан вместе с copyId — id становится ссылкой (реал nmId → карточка маркетплейса, brand-цвет).
    copyHref: { type: String, default: '' },
    // Показать ссылку «Подробнее ›».
    detail: { type: Boolean, default: false },
    // Размер миниатюры (px), реал — 40.
    size: { type: [Number, String], default: 40 },
    // Скрыть плашку-плейсхолдер (для вложенных строк-вариантов).
    hideThumb: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
.ds-product-cell {
    display: inline-flex;
    align-items: center;
    gap: var(--size-8);
    min-width: 0;
}
.ds-product-cell__img,
.ds-product-cell__thumb {
    flex: 0 0 auto;
    width: var(--size-40);
    height: var(--size-40);
    border-radius: var(--radius-sm);
    object-fit: cover;
}
.ds-product-cell__thumb { background: var(--surface-muted); }
.ds-product-cell__body { display: inline-flex; flex-direction: column; min-width: 0; gap: var(--size-2); }
.ds-product-cell__name { color: var(--text-heading); white-space: normal; }
.ds-product-cell__sub { color: var(--text-muted); display: inline-flex; align-items: center; flex-wrap: wrap; gap: var(--size-4); }
.ds-product-cell__id { color: var(--text-muted); }
/* nmId-ссылка на карточку маркетплейса — brand-цвет (реал item__product-id__link). */
.ds-product-cell__id--link { color: var(--brand); text-decoration: none; }
.ds-product-cell__id--link:hover { text-decoration: underline; }
/* Суффикс «/ цвет(или размер)» — основной текст (реал rgb(85,85,85) = --text-default). */
.ds-product-cell__meta { color: var(--text-default); }
.ds-product-cell__detail { color: var(--brand); text-decoration: none; }
.ds-product-cell__detail:hover { text-decoration: underline; }
</style>
