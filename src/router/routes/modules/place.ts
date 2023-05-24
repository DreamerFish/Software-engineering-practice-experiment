import { DEFAULT_LAYOUT } from '@/router/constants';

export default {
  path: '/place',
  name: 'place',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.place',
    requiresAuth: true,
    icon: 'icon-compass',
    order: 4,
  },
  children: [
    {
      path: 'place-inquiry',
      name: 'PlaceInquiry',
      component: () => import('@/views/place/place-inquiry/index.vue'),
      meta: {
        locale: 'menu.place.placeInquiry',
        requiresAuth: true,
        roles: ['admin', 'site', 'user'],
      },
    },
    {
      path: 'Add-Place',
      name: 'AddPlace',
      component: () => import('@/views/place/add-place/index.vue'),
      meta: {
        locale: 'menu.place.addPlace',
        requiresAuth: true,
        roles: ['admin', 'site'],
      },
    },
    {
      path: 'Book-Record',
      name: 'BookRecord',
      component: () => import('@/views/place/book-record/index.vue'),
      meta: {
        locale: 'menu.place.bookRecord',
        requiresAuth: true,
        roles: ['admin', 'site', 'user'],
      },
    }, {
      path: 'Check-Place',
      name: 'CheckPlace',
      component: () => import('@/views/place/check-place/index.vue'),
      meta: {
        locale: 'menu.place.checkPlace',
        requiresAuth: true,
        roles: ['-'],
      },
    }, {
      path: 'Alter-Place',
      name: 'AlterPlace',
      component: () => import('@/views/place/alter-place/index.vue'),
      meta: {
        locale: 'menu.place.alterPlace',
        requiresAuth: true,
        roles: ['-'],
      },
    }
    , {
      path: 'Book-Place',
      name: 'BookPlace',
      component: () => import('@/views/place/book-place/index.vue'),
      meta: {
        locale: 'menu.place.bookPlace',
        requiresAuth: true,
        roles: ['-'],
      },
    }, {
      path: 'Alter-Book',
      name: 'AlterBook',
      component: () => import('@/views/place/alter-book/index.vue'),
      meta: {
        locale: 'menu.place.alterBook',
        requiresAuth: true,
        roles: ['-'],
      },
    }, {
      path: 'place-announcement-penalty',
      name: 'PlaceAoticePenalty',
      component: () => import('@/views/place/announcement-penalty/index.vue'),
      meta: {
        locale: 'announcement.accountList',
        requiresAuth: true,
        roles: ['admin', 'site'],
      },
    }, {
      path: 'place-check-announcement',
      name: 'PlaceCheckPenalty',
      component: () => import('@/views/place/check-announcement/index.vue'),
      meta: {
        locale: 'check-announcement.accountList',
        requiresAuth: true,
        roles: ['*'],
      },
    }
  ],
};
