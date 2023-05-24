<template>
  <a-form ref="formRef" :model="renderData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">

    <a-form-item field="sId" label="场所编号" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="renderData.sId" disabled size="large" allow-clear />
    </a-form-item>

    <a-form-item field="sNums" label="场所序号" :rules="[
      {
        // match: /^[0-9]*$/,
        match: /^\d{1,3}$/,
        required: true,
        message: '请输入不超过3位数的数字'
      }
    ]">
      <a-input v-model="renderData.sNums" placeholder="请输入场所序号" size="large" allow-clear />
    </a-form-item>
    <a-form-item field="sName" label="场所名称" :rules="[
      {
        required: true,
        message: '请输入场所名称',
      }
    ]">
      <a-input v-model="renderData.sName" placeholder="请输入场所名称" size="large" allow-clear />
    </a-form-item>
    <a-form-item field="sCampus" label="所在校区" :rules="[
      {
        required: true,
        message: '请选择所在校区',
      }
    ]">
      <a-select v-model="renderData.sCampus" :options="campusOptions" placeholder="请选择所在校区" size="large" allow-clear />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="outline" @click="goToPlaceInquiry">
          返回列表
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
import { defineProps } from 'vue'
import { getInfoSite } from '@/network/module/place';
import { useRouter } from 'vue-router';

const emits = defineEmits(['changeStep']);
const formRef = ref<FormInstance>();
const router = useRouter()

const props = defineProps<{
  sId: string,
}>()

const renderData: any = ref({

})
const getPlace = async () => {
  const { data } = await getInfoSite({ sId: props.sId })
  renderData.value = data.site;
  console.log(renderData.value);
}
getPlace()

const campusOptions = [
  {
    label: '湖光校区',
    value: 1,
  },
  {
    label: '海滨校区',
    value: 2,
  }, {
    label: '霞山校区',
    value: 3,
  }, {
    label: '阳江校区',
    value: 4,
  }
];
const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'forward', { ...renderData.value });
  }
};

const goToPlaceInquiry = () => {
  router.push({ name: 'PlaceInquiry' })
}
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
