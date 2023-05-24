<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="id" label="赛事序号">
      <a-input placeholder="序号自动生成" disabled />
    </a-form-item>
    <a-form-item field="gname" label="赛事名称" :rules="[
      {
        required: true,
        message: '请输入赛事名称',
      }
    ]">
      <a-input v-model="formData.gname" placeholder="请输入赛事名称" />
    </a-form-item>
    <a-form-item field="rsid" label="赛事地点" :rules="[
      {
        required: true,
        message: '请选择赛事地点的场所',
      }
    ]">
      <a-select v-model="formData.rsid" placeholder="请选择赛事地点的场所">
        <a-option v-for="item of placeOptions" :value="item.sid" :disabled="item.disabled" :label="item.sname"
          :key="item.sid" />
      </a-select>
    </a-form-item>

    <a-form-item field="rdate" label="预约日期" :rules="[{ required: true, message: '请选择预约日期' }]">
      <a-date-picker v-model="formData.rdate" @change="changeTime" style="width: 100%"
        :disabledDate="(current: any) => dayjs(current).isBefore(dayjs().startOf('day')) || dayjs(current).isAfter(dayjs().add(1, 'week'))" />
    </a-form-item>
    <a-form-item field="rduration" label="预约时间段" :rules="[{ required: true, message: '请选择预约时间段' }]">
      <a-select v-model="formData.rduration" placeholder="请选择预约时间段" :field-names="fieldNames" :options="timeOptions">
      </a-select>
    </a-form-item>

    <a-form-item field="gnote" label="备注">
      <a-textarea v-model="formData.gnote" placeholder="请输入备注，最多不超过200字" :max-length="200" allow-clear />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="outline" @click="goToMatchInquiry">
          返回列表
        </a-button>
        <a-button type="primary" @click="onNextClick">
          创建赛事
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { getAllSites, getFreeTime } from '@/network/module/place';
import { insertGame } from '@/network/module/game';
import { Notification } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';

const router = useRouter()
const emits = defineEmits(['changeStep']);
const formRef = ref<FormInstance>();
const formData = ref({
  gname: "",
  gnote: "",
  rdate: "",
  rduration: "",
  rsid: ""
});
const fieldNames = { value: 'sduration', label: 'sdurationName' }

const placeOptions = ref([
  {
    sname: '暂无数据',
    sid: '0',
    disabled: true
  }
])
const getSites = async () => {
  const { data: { list } } = await getAllSites()
  placeOptions.value = list
  console.log(placeOptions.value);
}
getSites()
const timeOptions = ref([
  {
    lable: '请先选择日期',
    value: '0',
    disabled: true
  }
])
const changeTime:any = async (date: string) => {
  const { data: { freetime } } = await getFreeTime({ date })
  formData.value.rduration = ''
  console.log(freetime);
  timeOptions.value = freetime;
}
const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    const { code, message, data } = await insertGame(formData.value)
    console.log("要的就是你", data);

    if (code === 20000) {
      Notification.success('添加成功')
      emits('changeStep', 'forward', { ...formData.value }, data.gid);
    } else {
      Notification.error(message)
    }
  }
};

const goToMatchInquiry = () => {
  router.push({ name: 'MatchInquiry' })
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
