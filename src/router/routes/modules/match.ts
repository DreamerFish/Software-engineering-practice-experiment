import { DEFAULT_LAYOUT } from '@/router/constants';

export default {
  path: '/match',
  name: 'match',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.match',
    requiresAuth: true,
    icon: 'icon-userGroup',
    order: 4,
  },
  children: [
    {
      path: 'match-inquiry',
      name: 'MatchInquiry',
      component: () => import('@/views/match/match-inquiry/index.vue'),
      meta: {
        locale: 'menu.match.inquiry',
        requiresAuth: true,
        roles: ['admin', 'game', 'user'],
      },
    },
    {
      path: 'Add-Match',
      name: 'AddMatch',
      component: () => import('@/views/match/add-match/index.vue'),
      meta: {
        locale: 'menu.match.add',
        requiresAuth: true,
        roles: ['admin', 'game'],
      },
    },
    {
      path: 'Check-Match',
      name: 'CheckMatch',
      component: () => import('@/views/match/check-match/index.vue'),
      meta: {
        locale: 'menu.match.checkMatch',
        requiresAuth: true,
        roles: ['-'],
      },
    },
    {
      path: 'Alter-Match',
      name: 'AlterMatch',
      component: () => import('@/views/match/alter-match/index.vue'),
      meta: {
        locale: 'menu.match.alterMatch',
        requiresAuth: true,
        roles: ['-'],
      },
    }, {
      path: 'match-announcement-penalty',
      name: 'MatchAoticePenalty',
      component: () => import('@/views/match/announcement-penalty/index.vue'),
      meta: {
        locale: 'announcement.accountList',
        requiresAuth: true,
        roles: ['admin', 'game'],
      },
    }, {
      path: 'match-check-announcement',
      name: 'MatchCheckPenalty',
      component: () => import('@/views/match/check-announcement/index.vue'),
      meta: {
        locale: 'check-announcement.accountList',
        requiresAuth: true,
        roles: ['*'],
      },
    }

  ],
};
