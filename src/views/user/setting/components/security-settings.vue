<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.password') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{ $t('userSetting.SecuritySettings.placeholder.password') }}
            </a-typography-paragraph>
          </div>
          <div style="cursor: pointer;" @click="updatePassword">修改密码</div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.phone') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              已绑定：{{ userStore.uPhone }}
            </a-typography-paragraph>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph>
            {{ $t('userSetting.SecuritySettings.form.label.email') }}
          </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph class="tip">
              {{ userStore.uEmail }}
            </a-typography-paragraph>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-modal v-model:visible="visible" :on-before-ok="handleBeforeOk" title-align="start">
      <template #title>
        添加报修信息
      </template>
      <a-input-password class="text" placeholder="请输入旧密码" v-model="password.oldpwd" />
      <a-input-password class="text" placeholder="请输入新密码" v-model="password.newpwd" />
    </a-modal>
  </a-list>
</template>

<script lang="ts" setup>
import { modifiedPwd } from '@/network/module/user';
import { useUserStore } from '@/store/index';
import { Message } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';
import useUser from '@/hooks/user';

const { logout } = useUser();

const password = reactive({
  newpwd: '',
  oldpwd: ''
})


const visible = ref(false);
const updatePassword = () => {
  visible.value = true
}
const handleBeforeOk = (done: any) => {
  modifiedPwd(password).then(({ code, message }) => {
    if (code === 20000) {
      Message.success('修改成功,请重新登录')
      logout();
    } else {
      Message.error(message)
    }
  })
    .catch(() => Message.error('修改失败，请重试'))
    .finally(() => done(true));
};

const userStore = useUserStore()
</script>

<style scoped lang="less">
:deep(.arco-list-item) {
  border-bottom: none !important;

  .arco-typography {
    margin-bottom: 20px;
  }

  .arco-list-item-meta-avatar {
    margin-bottom: 1px;
  }

  .arco-list-item-meta {
    padding: 0;
  }
}

.text {
  margin: 10px;
  width: 440px;
}

:deep(.arco-list-item-meta-content) {
  flex: 1;
  border-bottom: 1px solid var(--color-neutral-3);

  .arco-list-item-meta-description {
    display: flex;
    flex-flow: row;
    justify-content: space-between;

    .tip {
      color: rgb(var(--gray-6));
    }

    .operation {
      margin-right: 6px;
    }
  }
}</style>
