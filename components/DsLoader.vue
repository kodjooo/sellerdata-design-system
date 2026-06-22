<template>
    <!--
        DsLoader — индикатор загрузки (спиннер) дизайн-системы Sellerdata.
        Реал: Bootstrap .spinner-border (border-цветной круг с прозрачной
        стороной, вращение). variant:
          inline  — спиннер в потоке (например, внутри кнопки/строки);
          overlay — спиннер по центру + полупрозрачная подложка поверх
                    контейнера (родитель должен иметь position:relative);
          panel   — спиннер по центру блока с min-height (пустое состояние).
        Цвет спиннера — brand.
    -->
    <div class="ds-loader" :class="[`ds-loader--${variant}`, `ds-loader--${size}`]">
        <div class="ds-loader__inner">
            <span class="ds-loader__spinner" role="status" aria-live="polite">
                <span class="ds-loader__sr">Загрузка…</span>
            </span>
            <span v-if="label" class="ds-loader__label t-body">{{ label }}</span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    // Тип отображения: в потоке, оверлей поверх контейнера или блок-заглушка.
    variant: {
        type: String,
        default: 'inline',
        validator: (v) => ['inline', 'overlay', 'panel'].includes(v),
    },
    // Размер спиннера.
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['sm', 'md', 'lg'].includes(v),
    },
    // Опциональная подпись под/рядом со спиннером.
    label: { type: String, default: '' },
});
</script>

<style lang="scss" scoped>
@keyframes spin {
    to { transform: rotate(360deg); }
}

.ds-loader {
    --ds-loader-size: var(--size-24);
    // Толщина кольца спиннера: вне шкалы --size-* намеренно (декоративный
    // штрих круга, реал — border-width 2px).
    --ds-loader-thickness: 2px;
}

.ds-loader--sm { --ds-loader-size: var(--size-16); }
.ds-loader--md { --ds-loader-size: var(--size-24); }
.ds-loader--lg { --ds-loader-size: var(--size-40); --ds-loader-thickness: 3px; }

.ds-loader__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-8);
}

.ds-loader__spinner {
    display: inline-block;
    width: var(--ds-loader-size);
    height: var(--ds-loader-size);
    border: var(--ds-loader-thickness) solid var(--brand);
    border-right-color: transparent;
    border-radius: var(--radius-full);
    animation: spin .75s linear infinite;
}

.ds-loader__label {
    color: var(--text-muted);
}

// Визуально скрытая подпись для скринридеров.
.ds-loader__sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

// inline — просто спиннер в потоке.
.ds-loader--inline {
    display: inline-flex;
}
.ds-loader--inline .ds-loader__inner {
    flex-direction: row;
}

// overlay — накрывает родителя (position:relative) полупрозрачной подложкой,
// спиннер по центру. Реал: TableLoader поверх таблицы.
.ds-loader--overlay {
    position: absolute;
    inset: 0;
    z-index: var(--z-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(from var(--surface-default) r g b / 0.7);
}

// panel — блок-заглушка с min-height, спиннер по центру.
.ds-loader--panel {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: var(--size-128);
    padding: var(--size-48);
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
}
</style>
