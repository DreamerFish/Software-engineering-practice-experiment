<template>
  <div class="container">
    <Breadcrumb :items="['失约信息', '添加失约人员']" />
    <a-spin style="width: 100%">
      <a-card class="general-card">
        <template #title>
          添加失约人员
        </template>
        <div class="wrapper">
          <BaseInfo/>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import BaseInfo from './components/base-info.vue';

</script>

<script lang="ts">
export default {
  name: 'Step',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);

  :deep(.arco-form) {
    .arco-form-item {
      &:last-child {
        margin-top: 20px;
      }
    }
  }
}

.steps {
  margin-bottom: 76px;
}
</style>
