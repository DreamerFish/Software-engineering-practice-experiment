<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="uusername" label="用户名" :rules="[
      {
        required: true,
        message: '请输入用户名',
      }
    ]">
      <a-input v-model="formData.uusername" placeholder="请输入用户名" />
    </a-form-item>
    <a-form-item field="upassword" label="输入密码" :rules="[
      {
        required: true,
        message: '请输入密码',
      }
    ]">
      <a-input-password v-model="formData.upassword" placeholder="请输入密码" />
    </a-form-item>
    <a-form-item field="checkPassword" label="确认密码" :rules="passwordRules">
      <a-input-password v-model="formData.checkPassword" placeholder="请输入确认密码" />
    </a-form-item>
    <a-form-item field="uroles" :label="$t('addAdministrator.form.label.select')"
      :rules="[{ type: 'array', minLength: 1, message: '最少选择一项' }]">
      <a-checkbox-group v-model="formData.uroles">
        <a-checkbox value="site">场地</a-checkbox>
        <a-checkbox value="game">赛事</a-checkbox>
        <a-checkbox value="equipment">器材</a-checkbox>
      </a-checkbox-group>
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

const emits = defineEmits(['changeStep']);

const formRef = ref<FormInstance>();
const formData = ref({
  ucid:0,
  upassword: '',
  checkPassword: '',
  uusername: '',
  uroles: []
});

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
