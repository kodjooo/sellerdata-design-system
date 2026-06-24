<template>
    <!-- Таблица пропсов компонента. rows: [{ name, type, default, desc }]. -->
    <div class="propsTable">
        <table class="propsTable__table">
            <thead>
                <tr>
                    <th>Проп</th>
                    <th>Тип</th>
                    <th>По умолчанию</th>
                    <th>Описание</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.name">
                    <td><code class="propsTable__name">{{ row.name }}</code></td>
                    <td><code class="propsTable__type">{{ row.type }}</code></td>
                    <td>
                        <code v-if="row.default !== undefined && row.default !== ''" class="propsTable__default">{{ row.default }}</code>
                        <span v-else class="propsTable__dash">—</span>
                    </td>
                    <td class="propsTable__desc">{{ row.desc }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    rows: { type: Array, default: () => [] },
});
</script>

<style scoped>
.propsTable { width: 100%; overflow-x: auto; border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.propsTable__table { width: 100%; border-collapse: collapse; background: var(--surface-default); font-size: var(--font-size-body-s); }
.propsTable__table th,
.propsTable__table td { text-align: left; padding: var(--size-8) var(--size-12); border-bottom: 1px solid var(--border-default); vertical-align: top; }
.propsTable__table th { color: var(--text-muted); font-weight: var(--font-weight-semibold); white-space: nowrap; }
.propsTable__table tbody tr:last-child td { border-bottom: 0; }
.propsTable__name { color: var(--text-heading); font-weight: var(--font-weight-semibold); }
.propsTable__type { color: var(--brand); }
.propsTable__default { color: var(--text-default); }
.propsTable__dash { color: var(--text-muted); }
.propsTable__desc { color: var(--text-default); }
.propsTable code { font-family: var(--font-family-mono, monospace); font-size: 12px; }
</style>
