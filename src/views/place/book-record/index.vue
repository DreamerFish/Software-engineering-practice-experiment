<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.accountList']" />
    <a-card class="general-card" title="预约信息查询">
      <!-- 查询区域 -->
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="snums" label="场所序号">
                  <a-input v-model="formModel.snums" placeholder="请输入场所序号" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="sname" label="场所名称">
                  <a-input v-model="formModel.sname" placeholder="请输入场所名称" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="ruid" label="使用人学号">
                  <a-input v-model="formModel.ruid" placeholder="请输入使用人学号" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="scharge" label="收费标准">
                  <a-input v-model="formModel.scharge" :placeholder="$t('place.form.expense.placeholder')" allow-clear>
                    <template #append>
                      元 / 小时
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="scampus" label="所在校区">
                  <a-select v-model="formModel.scampus" :options="campusOptions" placeholder="请选择所在校区" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="rdate" label="预约时间">
                  <a-date-picker v-model="formModel.rdate" style="width: 100%" />
                  <a-select v-model="formModel.rduration" :options="timeOptions" :field-names="timefieldNames"
                    placeholder="请选择预约时间段" />
                </a-form-item>

              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
      </a-row>

      <!-- 表格操作区域 -->
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="16">
          <a-space>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('accountList.form.reset') }}
            </a-button>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('accountList.form.search') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <a-button @click="download">
            <template #icon>
              <icon-download />
            </template>
            {{ $t('accountList.operation.download') }}
          </a-button>
        </a-col>
      </a-row>

      <!-- 表格展示 -->
      <a-table row-key="id" :loading="loading" :pagination="pagination" :data="renderData" :bordered="false"
        @page-change="onPageChange">
        <template #columns>
          <a-table-column :title="$t('序号')" :width=60>
            <template #cell="{ rowIndex }">
              {{ (rowIndex + 1) + (pagination.pageNum - 1) * pagination.pageSize }}
            </template>
          </a-table-column>
          <a-table-column title="预约编号" data-index="rId" :width=110 />

          <a-table-column title="场所序号" data-index="site.sNums" :width=110 />
          <a-table-column title="场所名称" data-index="site.sName" :width=120 />
          <a-table-column title="所在校区" data-index="sCampusName">

            <template #cell="{ record }">
              <a-tag color="blue" v-if="record.site.sCampus === 1">湖光校区</a-tag>
              <a-tag color="cyan" v-if="record.site.sCampus === 2">海滨校区</a-tag>
              <a-tag color="green" v-if="record.site.sCampus === 3">霞山校区</a-tag>
              <a-tag color="lime" v-if="record.site.sCampus === 4">阳江校区</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="使用人学号" data-index="user.uNumber" :width=140 />
          <a-table-column title="使用人姓名" data-index="user.uName" :width=110 />

          <a-table-column title="联系方式" data-index="user.uPhone" :width=130 />
          <a-table-column title="收费标准" data-index="site.sCharge" :width=110>
            <template #cell="{ record }">
              {{ record.site.sCharge }} 元/小时
            </template>
          </a-table-column>
          <a-table-column title="预约时间" data-index="rDate" :width=110 />
          <a-table-column title="状态" data-index="rStatus" :filterable="statusFilters">
            <template #cell="{ record }">
              <a-tag :color="statusColors[record.rStatus]">{{ record.rStatusName }}</a-tag>
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="operations" class="btn" fixed='right' :width=110
            v-if="userStore.role.includes('admin') || userStore.role.includes('site')">
            <template #cell="{ record }">
              <a-button type="text" size="mini" @click="goToAlterBook(record.rSid, record.rId)">
                修改预约
              </a-button>
              <a-button type="text" size="mini" @click="deleteItem(record)">
                已赴约
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useLoading from '@/hooks/loading';
import { Modal, Notification } from '@arco-design/web-vue';
import { queryReservation, deleteReservation } from '@/network/module/place/index'
import { Pagination } from '@/types/global';
import { reservation } from '@/network/module/download';
import { useUserStore } from '@/store/index'


const userStore = useUserStore()
const router = useRouter()
const generateFormModel = () => {
  return {
    snums: '',
    sname: '',
    ruid: '',
    scharge: '',
    scampus: '',
    rdate: '',
    rduration: '',
  };
};
const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
const renderData = ref([]);
const formModel = ref(generateFormModel());
const statusFilters = {
  filters: [{
    text: '未到时间',
    value: '0',
  }, {
    text: '已赴约',
    value: '1',
  }, {
    text: '未赴约',
    value: '2',
  },],
  filter: (value: any, record: any) => (record.rStatus === Number(value)),
};
const statusColors = ['gold', 'arcoblue', 'red'];
const basePagination: Pagination = {
  pageNum: 1,
  pageSize: 10,
};
const pagination = reactive({
  ...basePagination,
});
const campusOptions = ref([
  {
    label: '湖光校区',
    value: '1',
  },
  {
    label: '海滨校区',
    value: '2',
  }, {
    label: '霞山校区',
    value: '3',
  }, {
    label: '阳江校区',
    value: '4',
  }
]);
const timefieldNames = { value: 'sduration', label: 'sdurationName' }
const timeOptions = ref([
  {
    sduration: '0',
    sdurationName: '08:00-10:00'
  },
  {
    sduration: '1',
    sdurationName: '10:00-12:00'
  },
  {
    sduration: '2',
    sdurationName: '14:00-16:00'
  },
  {
    sduration: '3',
    sdurationName: '16:00-18:00'
  },
  {
    sduration: '4',
    sdurationName: '19:00-21:00'
  },
]);
const fetchData = async (
  params = { pageNum: 1, pageSize: 20 }
) => {
  setLoading(true);
  try {
    const { data } = await queryReservation(params, formModel.value);
    renderData.value = data.pages.records;
    pagination.pageNum = data.pages.current;
    pagination.total = data.pages.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const deleteItem = (record: any) => {
  console.log(record);
  Modal.warning({
    title: '该记录赴约',
    content: (`是否确认该记录已赴约： 预约编号 ${record.rId} `),
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      console.log('id=>', record.rId);
      deleteReservation({ rId: record.rId })
        .then((res) => {
          if (res.code === 20000) {
            Notification.success(t('赴约状态修改成功'));
            fetchData();
          }
          else {
            Notification.error(res.message)
          }
        })
        .catch(() => Notification.error(t('操作失败')))
        .finally(() => done(true));
    },
  });
}

const search = () => {
  fetchData(basePagination);
};
const onPageChange = (pageNum: number) => {
  fetchData({ ...basePagination, pageNum });
};

fetchData();
const reset = () => {
  formModel.value = generateFormModel();
  fetchData(basePagination);
};


const goToAlterBook = (rsId: number, rId: number) => {
  router.push({ name: 'AlterBook', query: { rsId, rId } })
}

const download = async () => {
  const { data: { returnUrl }, code } = await reservation(basePagination, formModel.value)
  if (code === 20000) {
    Notification.warning('正在下载')

    const link = document.createElement('a');
    link.href = returnUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    Notification.error('下载失败，请重试！')
  }
}
</script>

<script lang="ts">
export default {
  name: 'AccountList',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

:deep(.arco-btn-size-mini) {
  padding: 0 6px 0 0;
}
</style>
