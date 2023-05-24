<template>
  <a-form ref="formRef" :model="addItem" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="unumber" label="学号" :rules="[
      {
        required: true,
        message: '请输入12位学号',
      },
      {
        match: /^[0-9]{12}$/,
        message: '请输入12位学号',
      },
    ]">
        <a-input v-model="addItem.unumber" placeholder="请输入12位学号" />
      </a-form-item>
    <a-form-item field="dfine" label="罚款金额" :rules="[
      {
        required: true,
        message: '请输入罚款金额',
      },
      {
        match: /^[0-9]{1,5}$/,
        message: '罚款金额有效值为0-99999',
      },
    ]">
      <a-input v-model="addItem.dfine" placeholder="请输入数值。单位为元" />
    </a-form-item>
    <a-form-item field="dreason" label="罚款描述" :rules="[
      {
        required: true,
        message: '请输入罚款描述',
      }
    ]">
      <a-textarea placeholder="请输入罚款描述，200字以内" :max-length="200" allow-clear v-model="addItem.dreason" />
    </a-form-item>
    <a-form-item>
      <a-button @click="goToDefaulterList">
        返回失约人员列表
      </a-button>
      <a-button type="primary" @click="add">
        确认添加
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { Message } from '@arco-design/web-vue';
import { insert } from '@/network/module/defaulter';

const formRef = ref<FormInstance>();
const router = useRouter()

const addItem = ref({
  dfine: "",
  dreason: "",
  dsgeid: "aaaaaaaa",
  unumber: ""
})
const reset = () => {
  addItem.value = {
    dfine: "",
    dreason: "",
    dsgeid: "aaaaaaaa",
    unumber: ""
  }
}
const add = async() => {
  const res = await formRef.value?.validate();
  if (!res) {
    try {
      const { code, message } = await insert(addItem.value)
      if (code === 20000) {
        Message.success('添加成功')
        reset()
      } else {
        Message.error(message)
      }
    } catch (error) {
      Message.error(error as string)
    }
  }
}
const goToDefaulterList = () => {
  router.push({ name: 'DefaulterList' })
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
