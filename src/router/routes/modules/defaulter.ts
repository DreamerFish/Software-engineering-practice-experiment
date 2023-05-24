import { DEFAULT_LAYOUT } from '@/router/constants';

export default {
    path: '/defaulter',
    name: 'defaulter',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.defaulter',
        requiresAuth: true,
        icon: 'icon-stamp',
        order: 5,
    },
    children: [
        {
            path: 'defaulter-list',
            name: 'DefaulterList',
            component: () => import('@/views/defaulter/defaulter-list/index.vue'),
            meta: {
                locale: 'menu.defaulter.list',
                requiresAuth: true,
                roles: ['admin', 'site'],
            },
        },
        {
            path: 'Add-defaulter',
            name: 'AddDefaulter',
            component: () => import('@/views/defaulter/add-defaulter/index.vue'),
            meta: {
                locale: 'menu.defaulter.add',
                requiresAuth: true,
                roles: ['admin','site'],
            },
        }
    ],
};
