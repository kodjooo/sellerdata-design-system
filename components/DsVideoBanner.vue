<template>
    <!--
        DsVideoBanner — баннер-хинт с видео (паттерн «видео-хинт» ЛК).
        Канон: docs/design-system-canon.md → «Мобильный тулбар и баннер ЛК».
        Эталон: docs/reference/screens/_live__склад__мобайл-видео-попап.png

        Превью: картинка-постер с кнопкой play + текст-описание (свёрнут).
        Клик по play/превью → fullscreen-модалка (на десктопе — крупное окно):
        градиентная шапка «← {section}», видео-плейсхолдер 16:9, полный текст,
        футер с кнопкой «Понятно».

        Только токены: var(--*), --size-*, --radius-*, t-*-классы.
    -->
    <div class="ds-video-banner">
        <button
            type="button"
            class="ds-video-banner__preview"
            :aria-label="`Смотреть видео: ${title}`"
            @click="open = true"
        >
            <span class="ds-video-banner__poster">
                <img v-if="poster" :src="poster" alt="" class="ds-video-banner__poster-img" />
                <span class="ds-video-banner__play" aria-hidden="true">▶</span>
            </span>
        </button>

        <div class="ds-video-banner__text">
            <span v-if="title" class="t-label-m ds-video-banner__title">{{ title }}</span>
            <span class="t-body-s ds-video-banner__excerpt">{{ text }}</span>
        </div>

        <button
            type="button"
            class="ds-video-banner__dismiss"
            aria-label="Скрыть"
            @click="$emit('dismiss')"
        >
            <span aria-hidden="true">×</span>
        </button>

        <!-- Fullscreen-попап с видео -->
        <DsModal
            v-model="open"
            size="fullscreen"
            :closable="false"
        >
            <template #header>
                <button
                    type="button"
                    class="ds-video-banner__back"
                    :aria-label="`Назад: ${section}`"
                    @click="open = false"
                >
                    <span aria-hidden="true">←</span>
                </button>
                <h2 class="t-title-m ds-video-banner__modal-title">{{ section }}</h2>
            </template>

            <!-- Видео-плейсхолдер 16:9 -->
            <div class="ds-video-banner__player" role="img" :aria-label="title">
                <slot name="player">
                    <span class="ds-video-banner__play ds-video-banner__play--lg" aria-hidden="true">▶</span>
                </slot>
            </div>

            <!-- Полный текст -->
            <p class="t-body-l ds-video-banner__full">{{ text }}</p>

            <template #footer>
                <DsButton @click="open = false">Понятно</DsButton>
            </template>
        </DsModal>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DsModal from './DsModal.vue';
import DsButton from './DsButton.vue';

defineProps({
    // Заголовок (в превью, под play-кнопкой нет — у текста).
    title: { type: String, default: '' },
    // Текст-описание (превью обрезает, в попапе показан полностью).
    text: { type: String, default: '' },
    // URL постера-превью (если нет — серая подложка с play).
    poster: { type: String, default: '' },
    // Название раздела для шапки попапа («← Склад»).
    section: { type: String, default: '' },
});

defineEmits(['dismiss']);

const open = ref(false);
</script>

<style lang="scss" scoped>
@use 'responsive' as *;

/* ─── Баннер-превью (карточка) ─────────────────────────────────── */
.ds-video-banner {
    display: flex;
    align-items: flex-start;
    gap: var(--size-12);
    padding: var(--size-12);
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
}

/* Превью-постер с play. */
.ds-video-banner__preview {
    flex: 0 0 auto;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    border-radius: var(--radius-md);
}
.ds-video-banner__preview:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }

.ds-video-banner__poster {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--size-64) + var(--size-16)); /* 80 */
    height: var(--size-64);
    border-radius: var(--radius-md);
    background: var(--brand-gradient);
    overflow: hidden;
}
.ds-video-banner__poster-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.ds-video-banner__play {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size-24);
    height: var(--size-24);
    border-radius: var(--radius-full);
    background: rgb(from var(--white) r g b / 0.85);
    color: var(--brand);
    font-size: var(--font-size-caption);
}
.ds-video-banner__play--lg {
    width: var(--size-48);
    height: var(--size-48);
    font-size: var(--font-size-heading-m);
}

.ds-video-banner__text {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: var(--size-2);
    min-width: 0;
}
.ds-video-banner__title { color: var(--text-heading); }
.ds-video-banner__excerpt {
    color: var(--text-default);
    /* Свёрнутый текст — 3 строки. */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Крестик «скрыть». */
.ds-video-banner__dismiss {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--control-height-sm);
    height: var(--control-height-sm);
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    font-size: var(--font-size-heading-m);
    line-height: var(--line-height-tight);
    cursor: pointer;
    transition: background-color var(--transition-fast) var(--ease-standard);
}
.ds-video-banner__dismiss:hover { background: var(--surface-muted); color: var(--text-heading); }
.ds-video-banner__dismiss:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }

/* ─── Шапка попапа: «← Раздел» ─────────────────────────────────── */
.ds-video-banner__modal-title {
    margin: 0;
    flex: 1 1 auto;
    min-width: 0;
    color: var(--text-on-brand);
}
.ds-video-banner__back {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--control-height-sm);
    height: var(--control-height-sm);
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-on-brand);
    font-size: var(--font-size-heading-m);
    line-height: var(--line-height-tight);
    cursor: pointer;
    transition: background-color var(--transition-fast) var(--ease-standard);
}
.ds-video-banner__back:hover { background: rgb(from var(--white) r g b / 0.3); }
.ds-video-banner__back:focus-visible { outline: none; box-shadow: var(--shadow-input-focus); }

/* ─── Видео-плейсхолдер 16:9 в попапе ──────────────────────────── */
.ds-video-banner__player {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 16 / 9;
    width: 100%;
    border-radius: var(--radius-md);
    background: var(--surface-muted);
    overflow: hidden;
}
.ds-video-banner__full {
    margin: var(--size-16) 0 0;
    color: var(--text-default);
}
</style>
