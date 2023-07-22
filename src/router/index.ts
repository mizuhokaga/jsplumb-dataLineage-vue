// @ts-ignore
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../views/Index.vue'

const routes: Array<any> = [
    {
        path: '/index',
        name: 'Index',
        component: Index
    },
    {
        path: '',
        redirect: '/index'
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/index'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
