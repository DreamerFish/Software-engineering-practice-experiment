<template>
  <a-form ref="formRef" :model="renderData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="sType" label="场地类别" :rules="[
      {
        required: true,
        message: '请选择场地类别',
      }
    ]">
      <a-select v-model="renderData.sType" :options="placeOptions" placeholder="请选择场地类别" size="large" />
    </a-form-item>
    <a-form-item field="sCharge" label="资费标准" :rules="[
      {
        required: true,
        match: /^\d{1,3}$/,
        message: '请输入数字并且长度不超过3位数',
      }
    ]">
      <a-input v-model="renderData.sCharge" :placeholder="$t('place.form.expense.placeholder')" allow-clear size="large">
        <template #append>
          元 / 小时
        </template>
      </a-input>
    </a-form-item>
    <a-form-item field="cre" label="创建时间" :rules="[
      {
        required: true,
        message: '请输入创建时间',
      }
    ]">
      <a-date-picker v-model="renderData.cre" :defaultValue="new Date().toISOString().slice(0, 10)" size="large"
        disabled />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('addAdministrator.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('addAdministrator.button.next') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { getInfoSite } from '@/network/module/place';

const emits = defineEmits(['changeStep']);

const props = defineProps<{
  siteData: any,
}>()

const renderData: any = ref({})
const getPlace = () => {
  renderData.value = props.siteData;
}
getPlace()

const formRef = ref<FormInstance>();

const placeOptions = [
  {
    label: '乒乓球场',
    value: 1,
  },
  {
    label: '羽毛球场',
    value: 2,
  }, {
    label: '篮球场',
    value: 3,
  },
];
const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'submit', { ...renderData.value });
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
