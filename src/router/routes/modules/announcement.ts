import { DEFAULT_LAYOUT } from '@/router/constants';

export default {
    path: '/announcement',
    name: 'announcement',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.announcement',
        requiresAuth: true,
        icon: 'icon-mind-mapping',
        order: 6,
    },
    children: [
        {
            path: 'announcement-penalty',
            name: 'AoticePenalty',
            component: () => import('@/views/announcement/announcement-penalty/index.vue'),
            meta: {
                locale: 'menu.announcement-penalty.accountList',
                requiresAuth: true,
                roles: ['admin'],
            },
        }, {
            path: 'check-announcement',
            name: 'CheckPenalty',
            component: () => import('@/views/announcement/check-announcement/index.vue'),
            meta: {
                locale: 'menu.check-announcement.accountList',
                requiresAuth: true,
                roles: ['*'],
            },
        }
    ],
};
