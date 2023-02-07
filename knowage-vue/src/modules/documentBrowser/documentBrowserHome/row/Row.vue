<template>
    <tr v-if="propRow.type === 'colHeader'">
        <th v-for="(value, index) in propRow.value" :key="index" width="10%">{{ value }}</th>
    </tr>
    <tr v-else-if="propRow.type === 'rowHeader'">
        <td v-for="(value, index) in propRow.value" :key="index" width="10%">{{ value }}</td>
    </tr>
    <tr v-else-if="propRow.type === 'data'">
        <td v-for="(value, index) in propRow.value" :key="index" width="10%" :style="index === 0 ? style : ''">{{ value }}</td>
    </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'row',
    components: {},
    props: { propRow: { type: Object, required: true } },

    data() {
        return {}
    },
    computed: {
        style() {
            return {
                ['padding-left']: this.propRow.depth * 100 + 'px'
            }
        }
    },
    async created() {},
    methods: {}
})
</script>
