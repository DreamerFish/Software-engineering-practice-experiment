<template>
  <div class="success-wrap">
    <a-result
      status="success"
      :title="$t('addAdministrator.success.title')"
      :subtitle="$t('addAdministrator.success.subTitle')"
    />
    <a-space :size="16">
      <a-button key="view" type="primary" @click="goToAccountList">
        返回用户列表
      </a-button>
    </a-space>
    <div class="details-wrapper">
      <a-typography-title :heading="6" style="margin-top: 0">
        {{ $t('addAdministrator.form.description.title') }}
      </a-typography-title>
      <a-typography-paragraph style="margin-bottom: 0;color: #4E5969;">
        {{ $t('addAdministrator.form.description.text') }}
      </a-typography-paragraph>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'

const router = useRouter()
const goToAccountList = ()=>{
  router.replace({name:'AccountList'})
}

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
