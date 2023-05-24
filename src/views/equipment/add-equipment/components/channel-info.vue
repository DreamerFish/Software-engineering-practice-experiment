<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="ecost" label="器材成本" :rules="[
      {
        required: true,
        message: '请输入器材成本',
      }, {
        match: /^(?:[1-9]\d{0,3}|9999)$/,
        message: '请输入成本价：1-9999',
      }
    ]">
      <a-input v-model="formData.ecost" placeholder="请输入器材成本">
        <template #append>
          元
        </template>
      </a-input>
    </a-form-item>
    <a-form-item field="echarge" label="收费标准" :rules="[
      {
        required: true,
        message: '请输入收费标准',
      }, {
        match: /^(?:[1-9]|[1-9]\d)$/,
        message: '请输入收费标准：1-99',
      }
    ]">
      <a-input v-model="formData.echarge" placeholder="请输入数值，单位为元/小时">
         <template #append>
            元/小时
          </template>
      </a-input>
    </a-form-item>
    <a-form-item field="enotes" label="备注信息">
      <a-textarea v-model="formData.enotes" placeholder="请输入备注信息，最多不超过200字" :max-length="200" allow-clear />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('addAdministrator.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          创建器材
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';

const emits = defineEmits(['changeStep']);

const formRef = ref<FormInstance>();
const formData = ref({
  ecost: '',
  echarge: '',
  eborrowNums: '',
  enotes: ''
});

const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'submit', { ...formData.value });
  }
};
const goPrev = () => {
  emits('changeStep', 'backward');
};
</script>

<style scoped lang="less">
.container {
  .keep-margin {
    margin-bottom: 20px;
  }
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
  width: 540px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
