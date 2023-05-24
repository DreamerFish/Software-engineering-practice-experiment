<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="unumber" label="工号" :rules="[
      {
        required: true,
        message: '请输入12位工号',
      },
      {
        match: /^[0-9]{12}$/,
        message: '请输入12位工号',
      },
    ]">
      <a-input v-model="formData.unumber" placeholder="12位工号" />
    </a-form-item>
    <a-form-item field="uname" :label="$t('addAdministrator.form.label.name')" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.name.required'),
      },
      {
        match: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/,
        message: $t('addAdministrator.form.error.name.pattern'),
      },
    ]">
      <a-input v-model="formData.uname" :placeholder="$t('addAdministrator.placeholder.name')" />
    </a-form-item>
    <a-form-item field="uphone" :label="$t('addAdministrator.form.label.phone')" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.phone.required'),
      },
      {
        match: /^(?:(?:\+|00)86)?1\d{10}$/,
        message: $t('addAdministrator.form.error.phone.required'),
      },
    ]">
      <a-input v-model="formData.uphone" :placeholder="$t('addAdministrator.placeholder.phone')" />
    </a-form-item>
    <a-form-item field="uemail" :label="$t('addAdministrator.form.label.email')" :rules="[
      {
        required: true,
        message: $t('addAdministrator.form.error.email.required'),
      },
      {
        match: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: $t('addAdministrator.form.error.email.required'),
      },
    ]">
      <a-input v-model="formData.uemail" :placeholder="$t('addAdministrator.placeholder.email')" />
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
  unumber: '',
  uname: '',
  uphone: '',
  uemail: '',
});

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
