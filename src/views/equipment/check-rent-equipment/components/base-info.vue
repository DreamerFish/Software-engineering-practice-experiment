<template>
  <a-form :model="renderData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item label="器材名称">
      <a-input :placeholder="equipment.eName" disabled />
    </a-form-item>

    <a-form-item field="eType" label="器材分类">
      <a-input :placeholder="`${equipment.equipmentType}`" disabled />
    </a-form-item>
    <a-form-item field="eDescribe" label="器材描述">
      <a-textarea :placeholder="equipment.eDescribe" disabled />
    </a-form-item>
    <a-form-item field="eNotes" label="器材成本">
      <a-input :placeholder="`${equipment.eCost} 元`" disabled />
    </a-form-item>
    <a-form-item field="eNotes" label="收费标准">
      <a-input :placeholder="`${equipment.eCharge} 元/小时`" disabled />
    </a-form-item>
    <a-form-item field="eNotes" label="借用人姓名">
      <a-input :placeholder="user.uName" disabled />
    </a-form-item>
    <a-form-item field="eNotes" label="借用人学号">
      <a-input :placeholder="user.uNumber" disabled />
    </a-form-item>
    <a-form-item field="eNotes" label="联系方式">
      <a-input :placeholder="user.uPhone" disabled />
    </a-form-item>
    <a-form-item field="eNotes" label="借用时长">
      <a-input :placeholder="`${renderData.hDuration} 小时`" disabled />
    </a-form-item>
    <a-form-item field="eNotes" label="总费用">
      <a-input :placeholder="`${renderData.hDuration * equipment.eCharge } 元`" disabled />
    </a-form-item>

    <a-form-item>
      <a-button type="primary" @click="goToEquipmentInquiry">
        返回租用记录
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { getInfor } from '@/network/module/hire';
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const props = defineProps<{
  hId: string
}>()

const renderData: any = ref({})
const equipment:any = ref({})
const user:any = ref({})
const getEquipment = async () => {
  const { data } = await getInfor({ hId: props.hId })
  renderData.value = data.hire
  equipment.value = data.hire.equipment
  user.value = data.hire.user
}
getEquipment()

const goToEquipmentInquiry = () => {
  router.push({ name: 'HireRecord' })
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

.form {
  width: 500px;
}

.form-content {
  padding: 8px 50px 0 30px;
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
</style>
