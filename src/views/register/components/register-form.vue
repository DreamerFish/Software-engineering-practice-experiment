<template>
  <div class="login-form-wrapper">
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <div class="wrapper">
          <a-steps v-model:current="step"  class="steps">
            <a-step>
              个人信息
            </a-step>
            <a-step>
              基本信息
            </a-step>
            <a-step>
              注册成功
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
import {
  BaseInfoModel,
  ChannelInfoModel,
  UnitChannelModel,
} from '@/api/form';
import useLoading from '@/hooks/loading';
import BaseInfo from './base-info.vue';
import ChannelInfo from './channel-info.vue';
import Success from './success.vue';
import { register } from '@/network/module/register/index'
import { Message } from '@arco-design/web-vue';

const { loading, setLoading } = useLoading();

const step = ref(1);
const submitModel = ref({} as UnitChannelModel);
const submitForm = async () => {
  setLoading(true);
  try {
    const { code,message } = await register(submitModel.value)
    if(code===20000) {
      step.value = 3;
      submitModel.value = {} as UnitChannelModel;
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
      submitForm();
      return;
    }
    step.value += 1;
  } else if (direction === 'backward') {
    step.value -= 1;
  }
};

</script>

<style lang="less" scoped>
.steps {
  margin-bottom: 60px;
}

:deep(.arco-col-6) {
  flex: 0 0 20%;
}
</style>
