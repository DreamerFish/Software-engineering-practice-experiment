<template>
  <div class="success-wrap">
    <a-result status="success" :title="$t('addAdministrator.success.title')"
      :subtitle="$t('addAdministrator.success.subTitle')" />
    <a-space :size="16">
      <a-button key="view" type="primary" @click="goToBookRecord">
        查看预约列表
      </a-button>
      <a-button key="again" type="secondary" @click="oneMore">
        {{ $t('再次修改') }}
      </a-button>
    </a-space>
    <div class="details-wrapper">
      <a-typography-title :heading="6" style="margin-top: 0">
        提示
      </a-typography-title>
      <a-typography-paragraph style="margin-bottom: 0;color: #4E5969;">
        点击“查看预约列表”即可看到修改成功的预约记录
      </a-typography-paragraph>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const goToBookRecord = () => {
  router.push({ name: 'BookRecord' })
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
