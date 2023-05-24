import type { Router, RouteRecordNormalized } from 'vue-router';
import NProgress from 'nprogress'; 

import usePermission from '@/hooks/permission';
import { useUserStore } from '@/store';
import { appRoutes } from '../routes';
import { NOT_FOUND } from '../constants';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    const Permission = usePermission();
    let permissionsAllow = Permission.accessRouter(to);

    if (to.meta?.roles?.includes('-')) permissionsAllow = true
    if (permissionsAllow) next();
    else {
      const destination =
        Permission.findFirstPermissionRoute(appRoutes, userStore.role[0]) ||
        NOT_FOUND;
      next(destination);
    }
    NProgress.done();
  });
}
