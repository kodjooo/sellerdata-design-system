<template>
    <article class="dsTextStyle">
        <header class="dsTextStyle__head">
            <div>
                <h3 class="dsTextStyle__name">{{ style.figmaName }}</h3>
                <code class="dsTextStyle__class">.{{ style.cssClass }}</code>
            </div>
            <div class="dsTextStyle__spec">
                {{ style.size }} / {{ style.weight }} / line-height {{ style.lineHeight }}
            </div>
        </header>

        <div class="dsTextStyle__samples">
            <div class="dsTextStyle__sample" :class="style.cssClass">
                {{ style.short }}
            </div>
            <div v-if="style.long" class="dsTextStyle__sample dsTextStyle__sample-long" :class="style.cssClass">
                {{ style.long }}
            </div>
        </div>

        <p class="dsTextStyle__note" v-if="style.when">
            <span class="dsTextStyle__noteIcon" aria-hidden="true">📝</span>
            {{ style.when }}
        </p>
    </article>
</template>

<script setup>
defineProps({
    style: { type: Object, required: true },
});
</script>

<style scoped>
.dsTextStyle {
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.dsTextStyle__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-default);
}

.dsTextStyle__name {
    font-size: var(--font-size-title-m);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-tight);
    color: var(--text-heading);
    margin: 0 0 2px;
}

.dsTextStyle__class {
    font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--brand);
    background: var(--surface-muted);
    padding: 2px 6px;
    border-radius: 4px;
}

.dsTextStyle__spec {
    font-family: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
    font-size: 12px;
    color: var(--text-muted);
    text-align: right;
}

.dsTextStyle__samples {
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--text-heading);
}

.dsTextStyle__sample {
    /* Стиль образца применяется через class из tokens.js (.t-display-xl и т.д.).
       Никаких color/weight/size override'ов здесь — иначе пример показывал бы
       не сам стиль, а его смесь с правилами карточки. */
}

.dsTextStyle__sample-long {
    max-width: 640px;
}

.dsTextStyle__note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 0;
    padding: 12px 14px;
    background: var(--surface-muted);
    border-radius: 6px;
    font-size: var(--font-size-body-s);
    line-height: var(--line-height-relaxed);
    color: var(--text-default);
}

.dsTextStyle__noteIcon {
    flex-shrink: 0;
}
</style>
