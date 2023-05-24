<template>
  <div class="container">
    <Breadcrumb :items="['menu.match', 'menu.match.add']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          {{ $t('match.step.title') }}
        </template>
        <div class="wrapper">
          <a-steps v-model:current="step" style="width: 580px" line-less class="steps">
            <a-step>
              创建赛事信息
            </a-step>
            <a-step>
              添加赛事人员
            </a-step>
            <a-step>
              完成创建
            </a-step>
          </a-steps>
          <keep-alive>
            <BaseInfo v-if="step === 1" @change-step="changeStep" />
            <ChannelInfo v-else-if="step === 2" @change-step="changeStep" :gId='gameId' />
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

const { loading, setLoading } = useLoading(false);
const step = ref(1);
const submitModel = ref<UnitChannelModel>({} as UnitChannelModel);
const submitForm = async () => {
  setLoading(true);
  try {
    step.value = 3;
    submitModel.value = {} as UnitChannelModel; // init
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
const gameId = ref<any>()
const changeStep = (
  direction: string | number,
  model: BaseInfoModel | ChannelInfoModel,
  gId: number | null = null
) => {

  if (typeof direction === 'number') {
    step.value = direction;
    return;
  }

  if (direction === 'forward' || direction === 'submit') {
    if (gId) gameId.value = gId
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
