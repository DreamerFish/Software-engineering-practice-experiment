<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
      <a-form-item field="uphone" :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']" hide-label>
        <a-input v-model="userInfo.uphone" placeholder="请输入手机号码">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="upassword" :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']" hide-label>
        <a-input-password v-model="userInfo.upassword" placeholder="请输入密码" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox checked="rememberPassword" :model-value="loginConfig.rememberPassword"
            @change="(setRememberPassword as any)">
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <a-link @click="goToRegister">{{ $t('login.form.studentRegistration') }}</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/loading';
import type { LoginData } from '@/api/user';

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();

const loginConfig = useStorage('login-config', {
  rememberPassword: true,
  uphone: '',
  upassword: '',
});
const userInfo = reactive({
  uphone: loginConfig.value.uphone || '',
  upassword: loginConfig.value.upassword || '',
});

const goToRegister = () => {
  router.push({ name: 'register' })
}

const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (!errors) {
    setLoading(true);
    try {
      await userStore.login(values as LoginData);
      if (loginConfig.value.rememberPassword) {
        loginConfig.value.uphone = values.uphone
        loginConfig.value.upassword = values.upassword
      } else {
        loginConfig.value.uphone = ''
        loginConfig.value.upassword = ''
      }
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      console.log(router.currentRoute, '1111111111111', router.currentRoute.value);

      router.push({
        // name: (redirect as string) || 'Workplace',
        name: 'AccountList',
        query: {
          ...othersQuery,
        },
      });
      Message.success(t('login.form.login.success'));
    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {
      setLoading(false);
    }
  }
};
const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};
</script>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 320px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}
</style>
