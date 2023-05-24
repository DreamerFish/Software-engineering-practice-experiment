<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 6 }">
    <a-form-item field="rdate" label="预约时间" :rules="[{ required: true, message: '请选择预约日期' }]">
      <a-date-picker v-model="formData.rdate" style="width: 100%" @change=getFreeTimeDate(formData.rdate)
        :disabledDate="(current: any) => dayjs(current).isBefore(dayjs().startOf('day'))" />
    </a-form-item>
    <a-form-item field="rduration" :rules="[{ required: true, message: '请选择预约时间段' }]">
      <a-select v-model="formData.rduration" :options="timeOptions" placeholder="请选择预约时间段" :field-names="fieldNames" />
    </a-form-item>
  </a-form>

  <!-- 表格展示 -->
  <a-table row-key="id" :loading="loading" :pagination="pagination" :data="renderData" @page-change="onPageChange"
    class="table">
    <template #columns>
      <a-table-column title="预约编号" data-index="rId" />
      <a-table-column title="场所序号" data-index="site.sNums" />
      <a-table-column title="场所名称" data-index="site.sName" />
      <a-table-column title="所在校区" data-index="site.sCampusName" />
      <a-table-column title="使用人姓名" data-index="user.uName" />
      <a-table-column title="联系方式" data-index="user.uPhone" />
      <a-table-column title="预约日期" data-index="rDate" />
      <a-table-column title="预约时间段" data-index="sDurationName" />
    </template>
  </a-table>
  <a-space>
    <a-button type="secondary" @click="goPrev">
      {{ $t('addAdministrator.button.prev') }}
    </a-button>
    <a-button type="primary" @click="onNextClick">
      {{ $t('addAdministrator.button.next') }}
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/types/global';
import { getFreeTime, queryReservation, getInforReservation } from '@/network/module/place';
import dayjs from 'dayjs';

const props = defineProps<{
  sId: string,
  rId: string,
}>()

const emits = defineEmits(['changeStep']);

const formRef = ref<FormInstance>();
const formData = ref({
  rid: '',
  rdate: '',
  rduration: '',
});
const fieldNames = { value: 'sduration', label: 'sdurationName' }

const timeOptions = ref([
  {
    sduration: '1',
    sdurationName: '08:00-10:00'
  },
  {
    sduration: '2',
    sdurationName: '10:00-12:00'
  },
  {
    sduration: '3',
    sdurationName: '14:00-16:00'
  },
  {
    sduration: '4',
    sdurationName: '16:00-18:00'
  },
  {
    sduration: '5',
    sdurationName: '19:00-21:00'
  },
]);
const getFreeTimeDate = async (getdate: string) => {
  const { data } = await getFreeTime({ date: getdate })
  formData.value.rduration = ''
  timeOptions.value = data.freetime;
}




const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    console.log(formData.value);
    formData.value.rid = props.rId;
    emits('changeStep', 'submit', { ...formData.value });
  }
};
const goPrev = () => {
  emits('changeStep', 'backward');
};



// 分页
const basePagination: Pagination = {
  pageNum: 1,
  pageSize: 10,
};
const pagination = reactive({
  ...basePagination,
});
const { loading, setLoading } = useLoading(true);

// 表格数据

const renderData: any = ref<any>([]);
const fetchData = async (
  params = { pageNum: 1, pageSize: 10 }
) => {
  setLoading(true);
  try {
    const { data } = await queryReservation(params, { rsid: props.sId });
    renderData.value = data.pages.records;
    console.log(renderData.value);
    pagination.pageNum = data.pages.current;
    pagination.total = data.pages.total;
    const { data: reservationData } = await getInforReservation({ rId: props.rId });
    console.log(reservationData);
    formData.value.rdate = reservationData.reservation.rDate
    formData.value.rduration = reservationData.reservation.rDuration;
    renderData.value.sCampusName = reservationData.reservations.site.CampusName.rDuration;

  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};


const onPageChange = (pageNum: number) => {
  fetchData({ ...basePagination, pageNum });
};
fetchData();



</script>

<style scoped lang="less">
.container {
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



.form-content {
  padding: 8px 50px 0 30px;
}

.table {
  margin-bottom: 5vh;
  width: 100%;
}



:deep(.arco-form-item:last-child) {
  margin-top: 0 !important;
}

.form {
  width: 99% !important;
}

:deep(.arco-table-pagination) {
  justify-content: flex-start
}
</style>
