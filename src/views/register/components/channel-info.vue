<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="uemail" label="邮箱" :rules="[
      {
        required: true,
        message: '请输入邮箱',
      },
      {
        match: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: '请输入邮箱邮箱',
      },
    ]">
      <a-input v-model="formData.uemail" placeholder="请输入邮箱" />
    </a-form-item>
    <a-form-item field="uphone" label="手机号码" :rules="phoneRules">
      <a-input v-model="formData.uphone" placeholder="请输入手机号码" />
    </a-form-item>

    <a-form-item field="upassword" label="密码" :rules="[
      {
        required: true,
        message: '请输入密码',
      }
    ]">
      <a-input-password v-model="formData.upassword" placeholder="请输入密码" />
    </a-form-item>
    <a-form-item field="checkPassword" label="确认密码" :rules="passwordRules">
      <a-input-password v-model="formData.checkPassword" placeholder="请再次输入确认密码" />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('addAdministrator.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          注册账号
        </a-button>
      </a-space>
    </a-form-item>

  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { getPhone } from '@/network/module/register/index'
// import { BaseInfoModel } from '@/api/form';

const emits = defineEmits(['changeStep']);
const formRef = ref<FormInstance>();
const formData = ref({
  uphone: '',
  upassword: '',
  uemail: '',
  checkPassword: ''
});
const phoneRules = [{
  validator: (value: string, cb: (arg0: string) => void) => {
    return new Promise<void>(resolve => {
      getPhone({ phone: formData.value.uphone }).then(res => {
        if (res.code === 20001) {
          cb(res.message)
        }
        resolve()
      })
    })
  }
}, {
  required: true,
  message: '请输入邮箱',
}, {
  match: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
  message: '请输入有效的手机号码',
}];
const passwordRules = [{
  validator: (value: string, cb: (arg0: string) => void) => {
    return new Promise<void>(resolve => {
      if (value !== formData.value.upassword) {
        cb('二次密码输入错误')
      }
      resolve()
    })
  }
}, {
  required: true,
  message: '请再次输入密码',
},];

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
