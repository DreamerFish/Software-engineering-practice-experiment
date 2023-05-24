import { DEFAULT_LAYOUT } from '@/router/constants';

export default {
  path: '/list',
  name: 'list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.list',
    requiresAuth: true,
    icon: 'icon-list',
    order: 1,
  },
  children: [
    {
      path: 'Account-List',
      name: 'AccountList',
      component: () => import('@/views/account/account-list/index.vue'),
      meta: {
        locale: 'menu.list.accountList',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
    {
      path: 'Add-Administrator', 
      name: 'AddAdministrator',
      component: () => import('@/views/account/add-administrator/index.vue'),
      meta: {
        locale: 'menu.list.addAdministrator',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};
