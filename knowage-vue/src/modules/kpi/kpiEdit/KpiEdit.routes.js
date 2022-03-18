const routes = [
    {
        path: '/kpi-edit/new-kpi',
        name: 'kpi-edit-new-kpi',
        component: () => import('@/modules/kpi/kpiEdit/KpiEdit.vue')
    },
    {
        path: '/kpi-edit/:id',
        name: 'kpi-edit-edit-kpi',
        props: true,
        component: () => import('@/modules/kpi/kpiEdit/KpiEdit.vue')
    }
]

export default routes
