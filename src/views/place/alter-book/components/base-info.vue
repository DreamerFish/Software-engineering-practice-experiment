<template>
  <a-form ref="formRef" :model="props" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="sId" label="场所编号" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="renderData.sId" disabled size="large" />
    </a-form-item>

    <a-form-item field="sNums" label="场所序号" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="renderData.sNums" disabled size="large" />
    </a-form-item>

    <a-form-item field="sName" label="场所名称" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="renderData.sName" disabled size="large" />
    </a-form-item>

    <a-form-item field="sCampusName" label="所在校区" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="renderData.sCampusName" disabled size="large" />
    </a-form-item>

    <a-form-item field="sTypeName" label="场地类别" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="renderData.sTypeName" disabled size="large" />
    </a-form-item>

    <a-form-item field="sCharge" label="场地资费" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="renderData.sCharge" disabled size="large">
        <template #append>
          元 / 小时
        </template>
      </a-input>
    </a-form-item>
    <a-form-item field="cre" label="创建时间" :rules="[
      {
        required: true,
      }
    ]">
      <a-date-picker :placeholder="renderData.cre" disabled size="large" />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="outline" @click="goToBookRecord">
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
import { defineProps, ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { getInfoSite } from '@/network/module/place';
import { useRouter } from 'vue-router';

const router = useRouter()
const emits = defineEmits(['changeStep']);
const formRef = ref<FormInstance>();

const props = defineProps<{
  sId: string,
}>()
console.log(props.sId);

const renderData: any = ref({})
const getPlace = async () => {
  const { data } = await getInfoSite({ sId: props.sId })
  renderData.value = data.site;
  for (const key in renderData.value) {
    if (typeof renderData.value[key] === 'number')
      renderData.value[key] = (renderData.value[key]).toString()
  }
}
getPlace()

const goToBookRecord = () => {
  router.push({ name: 'BookRecord' })
}

const onNextClick = async () => {
  emits('changeStep', 'forward', { ...renderData.value });
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


:deep(input:disabled) {
  background-color: #f2f3f5;
}

:deep(input::placeholder) {
  color: black !important;
}

:deep(.arco-input-wrapper .arco-input[disabled]) {
  -webkit-text-fill-color: black;
}
</style>
