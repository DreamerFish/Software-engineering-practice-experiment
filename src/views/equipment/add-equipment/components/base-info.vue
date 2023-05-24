<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="ename" label="器材名称" :rules="[
      {
        required: true,
        message: '请输入器材名称',
      }
    ]">
      <a-input v-model="formData.ename" placeholder="请输入器材名称" />
    </a-form-item>
    <a-form-item field="etype" label="器材分类" :rules="[
      {
        required: true,
        message: '请选择器材分类',
      }
    ]">
      <a-select v-model="formData.etype" :options="equipmentOptions" placeholder="请选择器材分类" />
    </a-form-item>
    <a-form-item field="edescribe" label="器材描述" :rules="[
      {
        required: true,
        message: '请输入器材描述',
      }
    ]">
      <a-textarea v-model="formData.edescribe" placeholder="请输入器材描述，最多不超过200字" :max-length="200" allow-clear/>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="onNextClick">
        {{ $t('addAdministrator.button.next') }}
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';

const emits = defineEmits(['changeStep']);
const formRef = ref<FormInstance>();
const formData = ref({
  ename: '',
  etype: '',
  edescribe:''
});

const equipmentOptions = [
  {
    label: '羽毛球类',
    value: '1',
  },
  {
    label: '足球类',
    value: '2',
  }, {
    label: '乒乓球',
    value: '3',
  }, {
    label: '篮球类',
    value: '4',
  }
];
const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'forward', { ...formData.value });
  }
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;

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
  width: 500px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
