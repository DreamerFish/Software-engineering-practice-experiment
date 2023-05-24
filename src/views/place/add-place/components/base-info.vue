<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="snums" label="场所编号">
      <a-input disabled placeholder="场所编号自动生成" size="large" />
    </a-form-item>
    <a-form-item field="snums" label="场所序号" :rules="[
      {
        required: true,
        match: /^[0-9]*$/,
        max: 6,
        message: '请输入数字并且长度不超过6位数'
      }
    ]">
      <a-input size="large" v-model="formData.snums" placeholder="请输入场所序号" />
    </a-form-item>
    <a-form-item field="sname" label="场所名称" :rules="[
      {
        required: true,
        message: '请输入场所名称',
      }
    ]">
      <a-input size="large" v-model="formData.sname" placeholder="请输入场所名称" />
    </a-form-item>
    <a-form-item field="scampus" label="所在校区" :rules="[
      {
        required: true,
        message: '请选择所在校区',
      }
    ]">
      <a-select size="large" v-model="formData.scampus" :options="placeOptions" placeholder="请选择所在校区" />
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
// import { BaseInfoModel } from '@/api/form';

const emits = defineEmits(['changeStep']);
const formRef = ref<FormInstance>();
const formData = ref({
  sname: '',
  snums: '',
  scampus: ''
});

const placeOptions = [
  {
    label: '湖光校区',
    value: '1',
  },
  {
    label: '海滨校区',
    value: '2',
  }, {
    label: '霞山校区',
    value: '3',
  }, {
    label: '阳江校区',
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
