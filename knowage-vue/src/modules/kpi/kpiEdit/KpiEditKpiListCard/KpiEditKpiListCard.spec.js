import { mount } from '@vue/test-utils'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import KpiEditKpiListCard from './KpiEditKpiListCard.vue'
import PrimeVue from 'primevue/config'
import ProgressBar from 'primevue/progressbar'
import Toolbar from 'primevue/toolbar'

const mockedPropData = {
    kpi: [
        { isSuffix: 'true', name: 'MARKUP', prefixSuffixValue: 'SE', rangeMaxValue: '14', rangeMinValue: '2', vieweas: 'Speedometer', category: 'PROFIT' },
        { isSuffix: 'false', name: 'ROTATION', prefixSuffixValue: 'SA', rangeMaxValue: '23', rangeMinValue: '3', vieweas: 'Speedometer', category: 'PROFIT' }
    ]
}
const mockedKpiList = [
    {
        id: 216,
        version: 0,
        name: 'PROFIT MARGIN',
        author: 'demo_admin',
        dateCreation: 1477312200000,
        active: false,
        enableVersioning: false,
        definition: null,
        cardinality: null,
        placeholder: null,
        category: {
            valueId: 404,
            valueCd: 'PROFIT',
            valueName: 'PROFIT',
            valueDescription: 'PROFIT',
            domainCode: 'KPI_KPI_CATEGORY',
            domainName: 'KPI_KPI_CATEGORY',
            translatedValueDescription: 'PROFIT',
            translatedValueName: 'PROFIT'
        },
        threshold: null
    },
    {
        id: 217,
        version: 0,
        name: 'MARKUP',
        author: 'demo_admin',
        dateCreation: 1477312334000,
        active: false,
        enableVersioning: false,
        definition: null,
        cardinality: null,
        placeholder: null,
        category: {
            valueId: 404,
            valueCd: 'PROFIT',
            valueName: 'PROFIT',
            valueDescription: 'PROFIT',
            domainCode: 'KPI_KPI_CATEGORY',
            domainName: 'KPI_KPI_CATEGORY',
            translatedValueDescription: 'PROFIT',
            translatedValueName: 'PROFIT'
        },
        threshold: null
    },
    {
        id: 218,
        version: 4,
        name: 'ROTATION',
        author: 'demo_admin',
        dateCreation: 1594037177000,
        active: false,
        enableVersioning: false,
        definition: null,
        cardinality: null,
        placeholder: null,
        category: {
            valueId: 404,
            valueCd: 'PROFIT',
            valueName: 'PROFIT',
            valueDescription: 'PROFIT',
            domainCode: 'KPI_KPI_CATEGORY',
            domainName: 'KPI_KPI_CATEGORY',
            translatedValueDescription: 'PROFIT',
            translatedValueName: 'PROFIT'
        },
        threshold: null
    }
]

const $confirm = {
    require: jest.fn()
}

const $router = {
    push: jest.fn()
}

const factory = () => {
    return mount(KpiEditKpiListCard, {
        props: {
            propData: mockedPropData,
            kpiList: mockedKpiList,
            documentType: 'kpi'
        },
        provide: [PrimeVue],
        global: {
            directives: {
                tooltip() {}
            },
            plugins: [],
            stubs: {
                Button,
                Card,
                Column,
                DataTable,
                Dropdown,
                InputText,
                KpiEditKpiSelectDialog: true,
                ProgressBar,
                Toolbar,
                routerView: true
            },
            mocks: {
                $t: (msg) => msg,
                $confirm,
                $router
            }
        }
    })
}

describe('Kpi Edit Kpi List Card', () => {
    it('Loads kpi list and shows datatable', () => {
        const wrapper = factory()

        expect(wrapper.html()).toContain('MARKUP')
        expect(wrapper.html()).toContain('14')
        expect(wrapper.html()).toContain('Speedometer')
        expect(wrapper.html()).toContain('ROTATION')
        expect(wrapper.html()).toContain('SA')
    })
})
