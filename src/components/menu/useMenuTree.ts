import { computed } from 'vue';
import { RouteRecordRaw, RouteRecordNormalized } from 'vue-router';
import usePermission from '@/hooks/permission';
import appClientMenus from '@/router/appMenus';

export default function useMenuTree() {
  const permission = usePermission();
  const appRoute = computed(() => {
    return appClientMenus;
  });
  const menuTree = computed(() => {
    const copyRouter = JSON.parse(JSON.stringify(appRoute.value));
    copyRouter.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) => {
      return (a.meta.order || 0) - (b.meta.order || 0);
    });
    function travel(_routes: RouteRecordRaw[], layer: number) {
      if (!_routes) return null;

      const collector: any = _routes.map((element) => {
        // 判断该路由是否有权限显示在菜单中
        if (!permission.accessRouter(element)) {
          return null;
        }

        // 叶子节点，则将该节点的children属性设为空数组
        if (element.meta?.hideChildrenInMenu || !element.children) {
          element.children = [];
          return element;
        }

        // 过滤，如果hideInMenu为真则不显示
        element.children = element.children.filter(
          (x) => x.meta?.hideInMenu !== true
        );

        // 关联的子节点
        const subItem = travel(element.children, layer + 1);

        if (subItem.length) {
          element.children = subItem;
          return element;
        }
        // the else logic
        if (layer > 1) {
          element.children = subItem;
          return element;
        }

        if (element.meta?.hideInMenu === false) {
          return element;
        }

        return null;
      });
      return collector.filter(Boolean);
    }
    return travel(copyRouter, 0);
  });

  return {
    menuTree,
  };
}
