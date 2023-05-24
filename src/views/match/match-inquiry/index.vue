<template>
  <div class="container">
    <Breadcrumb :items="['menu.match', 'menu.match.inquiry']" />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" :title="$t('menu.match.inquiry')">
          <a-form :model="formModel" :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 18 }">
            <a-row :gutter="8">
              <a-col :span="12">
                <a-form-item field="gid" :label="$t('match.form.id')">
                  <a-input v-model="formModel.gid" placeholder="请输入赛事编号" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="gname" :label="$t('match.form.name')">
                  <a-input v-model="formModel.gname" placeholder="请输入赛事名称" allow-clear />
                </a-form-item>
              </a-col>

              <a-col :span="12">
                <a-form-item field="rdate" label="预约时间">
                  <a-date-picker v-model="formModel.rdate" style="width: 100%" />
                  <a-select v-model="formModel.rduration" :options="timeOptions" :field-names="timefieldNames"
                    placeholder="请选择预约时间段" />
                </a-form-item>

              </a-col>
              <a-col :span="12">
                <a-form-item field="rsid" :label="$t('match.form.place')">
                  <a-select v-model="formModel.rsid" :options="placeOptions" placeholder="请选择赛事地点"
                    :field-names="sitefieldNames" allow-clear />
                </a-form-item>
              </a-col>


            </a-row>
          </a-form>

          <!-- 表格操作区域 -->
          <a-divider style="margin-top: 0" />
          <a-row style="margin-bottom: 16px">
            <a-col :span="16">
              <a-space>
                <a-button @click="reset">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  {{ $t('match.form.reset') }}
                </a-button>
                <a-button type="primary" @click="search">
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ $t('match.form.search') }}
                </a-button>
              </a-space>
            </a-col>
            <a-col :span="8" style="text-align: right">
              <a-button @click="download">
                <template #icon>
                  <icon-download />
                </template>
                {{ $t('match.operation.download') }}
              </a-button>
            </a-col>
          </a-row>
          <QualityInspection :gameData="renderData" :loading="loading" @update-data='fetchData'></QualityInspection>
          <a-pagination :total="basePagination.total || 0" :page-size="basePagination.pageSize" @change="onPageChange" />

        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import QualityInspection from './components/quality-inspection.vue';
import { Pagination } from '@/types/global';
import { getAllSites } from '@/network/module/place/index'
import { searchGame } from '@/network/module/game/index'
import useLoading from '@/hooks/loading';
import { Notification } from '@arco-design/web-vue';
import { game } from '@/network/module/download';

const sitefieldNames = { value: 'sid', label: 'sname' }
const timefieldNames = { value: 'sduration', label: 'sdurationName' }

const generateFormModel = () => {
  return {
    gid: '',
    gname: '',
    rsid: '',
    rdate: '',
    rduration: ''
  };
};


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
const placeOptions = ref([]);
const formModel = ref(generateFormModel());

getAllSites().then((res) => {
  placeOptions.value = res.data.list
})
const { loading, setLoading } = useLoading(true);


// 分页
const renderData = ref([]);

const basePagination: Pagination = {
  pageNum: 1,
  pageSize: 11,
  total: NaN
};
const fetchData = async (
  params = basePagination
) => {
  try {
    setLoading(true);
    const { data } = await searchGame(params, formModel.value);
    renderData.value = data.pages.records;
    basePagination.total = data.pages.total
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
fetchData()

const onPageChange = (current: number) => {
  fetchData({ ...basePagination, pageNum: current });
};

const reset = () => {
  formModel.value = generateFormModel();
  fetchData(basePagination);
};
const search = () => {
  fetchData(basePagination);
};

const download = async () => {
  const { data: { returnUrl }, code } = await game(basePagination, formModel.value)
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
  name: 'Card',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;

  :deep(.arco-list-content) {
    overflow-x: hidden;
  }

  :deep(.arco-card-meta-title) {
    font-size: 14px;
  }
}

:deep(.arco-list-col) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

:deep(.arco-list-item) {
  width: 33%;
}

:deep(.block-title) {
  margin: 0 0 12px 0;
  font-size: 14px;
}

:deep(.list-wrap) {

  // min-height: 140px;
  .list-row {
    align-items: stretch;

    .list-col {
      margin-bottom: 16px;
    }
  }

  :deep(.arco-space) {
    width: 100%;

    .arco-space-item {
      &:last-child {
        flex: 1;
      }
    }
  }
}
</style>
