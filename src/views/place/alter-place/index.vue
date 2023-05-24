<template>
  <div class="container">
    <Breadcrumb :items="['场所信息', '修改场所信息']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          {{ $t('alterPlace.step.title') }}
        </template>
        <div class="wrapper">
          <a-steps v-model:current="step" style="width: 580px" line-less class="steps">
            <a-step>
              修改基础信息
            </a-step>
            <a-step>
              修改详细信息
            </a-step>
            <a-step>
              完成修改
            </a-step>
          </a-steps>
          <keep-alive>
            <BaseInfo v-if="step === 1" @change-step="changeStep" :sId="((route.query.id) as string)" />
            <ChannelInfo v-else-if="step === 2" @change-step="changeStep" :siteData="submitModel" />
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
  UnitChannelModel,
} from '@/api/form';
import BaseInfo from './components/base-info.vue';
import ChannelInfo from './components/channel-info.vue';
import Success from './components/success.vue';
import { useRoute } from 'vue-router'
import { updateSite } from '@/network/module/place';
import { Notification } from '@arco-design/web-vue';

const route = useRoute()

const { loading, setLoading } = useLoading(false);


const step = ref(1);
const submitModel = ref<any>({});
const loweredSubmitModel = ref<any>({});
const submitForm = async () => {
  setLoading(true);
  try {
    // 把属性名改成小写
    for (const key of Object.keys(submitModel.value)) {
      loweredSubmitModel[key.toLowerCase()] = submitModel.value[key];
    }
    submitModel.value = loweredSubmitModel;

    const { code, message } = await updateSite(submitModel.value); // The mock api default success

    if (code === 20000) {
      step.value = 3;
      submitModel.value = {} as UnitChannelModel; // init
    } else {
      Notification.error(message)
    }

  } catch (err) {
    Notification.error('操作失败，请重试！')
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
      ...model
    };
    console.log("要的就是你", submitModel.value);
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
