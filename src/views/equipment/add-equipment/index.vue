<template>
  <div class="container">
    <Breadcrumb :items="['器材信息', '新增器材']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
           新增器材 
        </template>
        <div class="wrapper">
          <a-steps v-model:current="step" style="width: 580px" line-less class="steps">
            <a-step>
              填写基础信息
            </a-step>
            <a-step>
              输入详细信息
            </a-step>
            <a-step>
              完成创建
            </a-step>
          </a-steps>
          <keep-alive>
            <BaseInfo v-if="step === 1" @change-step="changeStep" />
            <ChannelInfo v-else-if="step === 2" @change-step="changeStep" />
            <Success v-else-if="step === 3" @change-step="changeStep" />
          </keep-alive>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useLoading from '@/hooks/loading';
import {
  BaseInfoModel,
  ChannelInfoModel,
} from '@/api/form';
import BaseInfo from './components/base-info.vue';
import ChannelInfo from './components/channel-info.vue';
import Success from './components/success.vue';
import { Message } from '@arco-design/web-vue';
import { insertEquipment } from '@/network/module/equipment';

const { loading, setLoading } = useLoading(false);
const step = ref(1);
const submitModel = ref<any>({});
const submitForm = async () => {
  setLoading(true);
  try {
    const { code, message } = await insertEquipment(submitModel.value)
    if (code === 20000) {
      step.value = 3;
      submitModel.value = {};
    } else {
      Message.error(message)
    }
  } catch (err) {
    Message.error('操作失败，请重试！')
  } finally {
    setLoading(false);
  }
};
const changeStep = (
  direction: string | number,
  model: BaseInfoModel | ChannelInfoModel,
) => {
  if (typeof direction === 'number') {
    step.value = direction;
    return;
  }

  if (direction === 'forward' || direction === 'submit') {
    // submitModel 是提交的详细数据
    submitModel.value = {
      ...submitModel.value,
      ...model,
    };
    if (direction === 'submit') {
      console.log(submitModel.value);
      submitForm();
      return;
    }
    step.value += 1;
  } else if (direction === 'backward') {
    step.value -= 1;
  }
};
</script>

<script lang="ts">
export default {
  name: 'Step',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);

  :deep(.arco-form) {
    .arco-form-item {
      &:last-child {
        margin-top: 20px;
      }
    }
  }
}

.steps {
  margin-bottom: 76px;
}
</style>
