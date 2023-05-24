<template>
  <div class="success-wrap">
    <a-result status="success" :title="$t('addAdministrator.success.title')"
      :subtitle="$t('addAdministrator.success.subTitle')" />
    <a-space :size="16">
      <a-button key="view" type="primary" @click="goToEquipmentInquiry">
        查看列表
      </a-button>
    </a-space>
    <div class="details-wrapper">
      <a-typography-title :heading="6" style="margin-top: 0">
        提示
      </a-typography-title>
      <a-typography-paragraph style="margin-bottom: 0;color: #4E5969;">
        点击“查看列表”即可看到新增的器材
      </a-typography-paragraph>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const goToEquipmentInquiry = () => {
  router.push({ name: 'EquipmentInquiry' })
}
const emits = defineEmits(['changeStep']);
const oneMore = () => {
  emits('changeStep', 1);
};
</script>

<style scoped lang="less">
.success-wrap {
  text-align: center;
}

:deep(.arco-result) {
  padding-top: 0;
}

.details-wrapper {
  width: 895px;
  margin-top: 54px;
  padding: 20px;
  text-align: left;
  background-color: var(--color-fill-2);
}
</style>
