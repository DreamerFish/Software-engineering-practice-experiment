<template>
  <div class="content">
    <a-result class="result" status="404" :subtitle="'not found'"> </a-result>
    <div class="operation-row">
      <a-button key="back" type="primary" @click="back"> back </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import usePermission from '@/hooks/permission'
import { appRoutes } from '@/router/routes';
import { useUserStore } from '@/store';

const Permission = usePermission();
const userStore = useUserStore()

const router = useRouter();
const back = () => {
  const destination = Permission.findFirstPermissionRoute(appRoutes, userStore.role[0]) || {name:'Setting'};
  router.push(destination)
}

</script>

<style scoped lang="less">
.content {
  // padding-top: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -95px;
  margin-top: -121px;
  text-align: center;
}
</style>
