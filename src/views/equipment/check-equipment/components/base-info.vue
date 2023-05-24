<template>
  <a-form :model="renderData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="eName" label="器材名称" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.name.required'),
      },
      {
        match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
        message: $t('addAdministrator.form.error.name.pattern'),
      },
    ]">
      <a-input :placeholder="renderData.eName" disabled />
    </a-form-item>

    <a-form-item field="eType" label="器材分类" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.phone.required'),
      },
      {
        match: /^(?:(?:\+|00)86)?1\d{10}$/,
        message: $t('addAdministrator.form.error.phone.required'),
      },
    ]">
      <a-input :placeholder="renderData.equipmentType" disabled />
    </a-form-item>
    <a-form-item field="eDescribe" label="器材描述" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.phone.required'),
      },
      {
        match: /^(?:(?:\+|00)86)?1\d{10}$/,
        message: $t('addAdministrator.form.error.phone.required'),
      },
    ]">
      <a-textarea :placeholder="renderData.eDescribe" disabled />
    </a-form-item>
    <a-form-item field="eNotes" label="备注" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.phone.required'),
      },
      {
        match: /^(?:(?:\+|00)86)?1\d{10}$/,
        message: $t('addAdministrator.form.error.phone.required'),
      },
    ]">
      <a-textarea :placeholder="renderData.eNotes" disabled />
    </a-form-item>
    <a-form-item field="eCost" label="器材成本" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.email.required'),
      },
      {
        match: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: $t('addAdministrator.form.error.email.required'),
      },
    ]">
      <a-input :placeholder="`${renderData.eCost}元`" disabled />
    </a-form-item>
    <a-form-item field="eCharge" label="收费标准" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.email.required'),
      },
      {
        match: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: $t('addAdministrator.form.error.email.required'),
      },
    ]">
      <a-input :placeholder="`${renderData.eCharge} 元/小时`" disabled />
    </a-form-item>
    <a-form-item field="eDamage" label="是否损坏">
      <a-tag v-if="renderData.eDamage === '0'" color="cyan" bordered>未损坏</a-tag>
      <a-tag v-else color="orangered" bordered>已损坏</a-tag>
    </a-form-item>
    <a-form-item field="eBorrowNums" label="借用次数" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.email.required'),
      },
      {
        match: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: $t('addAdministrator.form.error.email.required'),
      },
    ]">
      <a-input :placeholder="renderData.eBorrowNums" disabled />
    </a-form-item>
    <a-form-item field="eRepairReason" label="报修原因" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.phone.required'),
      },
      {
        match: /^(?:(?:\+|00)86)?1\d{10}$/,
        message: $t('addAdministrator.form.error.phone.required'),
      },
    ]">
      <a-textarea :placeholder="renderData.eRepairReason" disabled />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" @click="goToEquipmentInquiry">
        返回列表
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { getInfo } from '@/network/module/equipment';
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const props = defineProps<{
  eId: string
}>()

const renderData: any = ref({})
const getEquipment = async () => {
  const { data } = await getInfo({ eId: props.eId })
  renderData.value = data.equipment
  for (const key in renderData.value) {
    if (typeof renderData.value[key] === 'number')
      renderData.value[key] = (renderData.value[key]).toString()
  }
}
getEquipment()

const goToEquipmentInquiry = () => {
  router.push({ name: 'EquipmentInquiry' })
}
</script>

<style scoped lang="less">
.container {
  padding: 20px;

  .keep-margin {
    margin-bottom: 20px;
  }
}

:deep(textarea:disabled) {
  background-color: #f2f3f5;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
}

.steps {
  margin-bottom: 36px;
}

:deep(input::placeholder) {
  color: black !important;
}

:deep(.arco-input-wrapper .arco-input[disabled]) {
  -webkit-text-fill-color: black;
}

:deep(.arco-textarea[disabled]) {
  -webkit-text-fill-color: black;
}

:deep(.arco-select-view-single .arco-select-view-input[disabled]) {
  -webkit-text-fill-color: black;
}

.form {
  width: 500px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
