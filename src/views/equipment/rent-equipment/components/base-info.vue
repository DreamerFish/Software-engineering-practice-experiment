<template>
  <a-form ref="formRef" :model="addItem" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="eName" label="器材名称">
      <a-input :placeholder="renderData.eName" disabled />
    </a-form-item>

    <a-form-item field="eType" label="器材分类">
      <a-input :placeholder="renderData.eType" disabled />
    </a-form-item>
    <a-form-item field="eDescribe" label="器材描述">
      <a-textarea :placeholder="renderData.eDescribe" disabled />
    </a-form-item>
    <a-form-item field="eCost" label="器材成本">
      <a-input :placeholder="`${renderData.eCost} 元`" disabled />
    </a-form-item>
    <a-form-item field="eCharge" label="收费标准">
      <a-input :placeholder="`${renderData.eCharge} 元/小时`" disabled />
    </a-form-item>
    <a-form-item field="hduration" label="使用时长" :rules="[
      {
        required: true,
        message: '请输入时长',
      },{
        match:/^[1-9]$/,
        message:'只能租用1-9小时'
      }
    ]">
      <a-input placeholder="请输入数值，单位为小时" v-model="addItem.hduration"/>
    </a-form-item>
    <a-form-item field="eCharge" label="总费用">
      <a-input :placeholder="`${(renderData.eCharge * parseInt(addItem.hduration)).toString()} 元`" disabled />
    </a-form-item>
    <a-form-item>
      <a-button @click="goToEquipmentInquiry">
        保存并跳转器材查询
      </a-button>
      <a-button type="primary" @click="goToHireRecord">
        保存并跳转租用记录
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { getInfo } from '@/network/module/equipment';
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { insertHire } from '@/network/module/hire';
import { Message } from '@arco-design/web-vue';

const formRef = ref<FormInstance>();
const router = useRouter()
const props = defineProps<{
  eId: string
}>()
const addItem = ref({
  heid:'',
  hduration:''
})

const renderData: any = ref({})
const getEquipment = async () => {
  addItem.value.heid = props.eId
  const { data } = await getInfo({ eId: props.eId })
  renderData.value = data.equipment
  for (const key in renderData.value) {
    if (typeof renderData.value[key] === 'number')
      renderData.value[key] = (renderData.value[key]).toString()
  }
}
getEquipment()

const goToEquipmentInquiry = async() => {
  const res = await formRef.value?.validate();
  if (!res) {
    try {
      const { code, message } = await insertHire(addItem.value)
      if (code === 20000) {
        Message.success(message)
        router.push({ name: 'EquipmentInquiry' })
      } else {
        Message.error(message)
      }
    } catch (error) {
      Message.error('操作失败，请重试！')
    }
  }
}
const goToHireRecord = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    try {
      const { code, message } = await insertHire(addItem.value)
      if (code === 20000) {
        Message.success(message)
        router.push({ name: 'HireRecord' })
      } else {
        Message.error(message)
      }
    } catch (error) {
      Message.error('操作失败，请重试！')
    }
  }
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

:deep(button) {
  margin-right: 20px;
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
</style>
