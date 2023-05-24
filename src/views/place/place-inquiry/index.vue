<template>
  <div class="container">
    <Breadcrumb :items="['menu.place', 'menu.place.placeInquiry']" />
    <a-card class="general-card" :title="$t('menu.place.placeInquiry')">
      <!-- 查询区域 -->
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="snums" :label="$t('place.form.id')">
                  <a-input v-model="formModel.snums" placeholder="请输入场所序号" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="sname" :label="$t('place.form.name')">
                  <a-input v-model="formModel.sname" :placeholder="$t('place.form.name.placeholder')" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="scampus" :label="$t('place.form.campus')">
                  <a-select v-model="formModel.scampus" :options="campusOptions" placeholder="请选择所在校区" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="stype" :label="$t('place.form.placeType')">
                  <a-select v-model="formModel.stype" :options="typeOptions" placeholder="请选择场所分类" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="createdTime" :label="$t('place.form.createdTime')">
                  <a-range-picker v-model="formModel.createdTime" style="width: 100%" allow-clear />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="scharge" :label="$t('place.form.expense')">
                  <a-input v-model="formModel.scharge" :placeholder="$t('place.form.expense.placeholder')" allow-clear>
                    <template #append>
                      元 / 小时
                    </template>
                  </a-input>
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
              {{ $t('place.form.reset') }}
            </a-button>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('place.form.search') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <a-button @click="download">
            <template #icon>
              <icon-download />
            </template>
            {{ $t('place.operation.download') }}
          </a-button>
        </a-col>
      </a-row>

      <!-- 表格展示 -->
      <a-table row-key="id" :loading="loading" :pagination="pagination" :data="renderData" :bordered="false"
        @page-change="onPageChange">
        <template #columns>
          <a-table-column :title="$t('序号')">
            <template #cell="{ rowIndex }">
              {{ (rowIndex + 1) + (pagination.pageNum - 1) * pagination.pageSize }}
            </template>
          </a-table-column>
          <a-table-column :title="$t('place.columns.id')" data-index="sNums" />
          <a-table-column :title="$t('place.columns.name')" data-index="sName" />
          <a-table-column :title="$t('place.columns.campus')" data-index="sCampus">
            <template #cell="{ record: { sCampus } }">
              <a-tag color="blue" v-if="sCampus === 1">湖光校区</a-tag>
              <a-tag color="cyan" v-if="sCampus === 2">海滨校区</a-tag>
              <a-tag color="green" v-if="sCampus === 3">霞山校区</a-tag>
              <a-tag color="lime" v-if="sCampus === 4">阳江校区</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('place.columns.placeType')" data-index="sType">
            <template #cell="{ record: { sType } }">
              <a-tag color="arcoblue" v-if="sType === 1">乒乓球场</a-tag>
              <a-tag color="gold" v-if="sType === 2">羽毛球场</a-tag>
              <a-tag color="orange" v-if="sType === 3">篮球场</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('place.columns.createdTime')" data-index="modified" />
          <a-table-column :title="$t('place.columns.expense')" data-index="sCharge">
            <template #cell="{ record: { sCharge } }">
              {{ sCharge }} 元/小时
            </template>
          </a-table-column>
          <a-table-column :title="$t('place.columns.operations')" data-index="operations" class="btn">
            <template #cell="{ record }">
              <a-button type="text" size="mini" @click="cheackItem(record.sId)">
                查看
              </a-button>
              <a-button v-if="userStore.role.includes('admin') || userStore.role.includes('site')" type="text" size="mini"
                @click="alterItem(record.sId)">
                修改信息
              </a-button>
              <a-button type="text" size="mini" @click="bookItem(record.sId)">
                预约
              </a-button>
              <a-button v-if="userStore.role.includes('admin') || userStore.role.includes('site')" type="text" size="mini"
                @click="deleteItem(record)">
                删除
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { Pagination } from '@/types/global';
import { Message, Modal, Notification } from '@arco-design/web-vue';
import { useRouter } from 'vue-router'
import { querySite, deleteSite } from '@/network/module/place/index'
import { omit } from 'lodash';
import { getInfoIsDefaulter } from '@/network/module/defaulter';
import { useUserStore } from '@/store/index'
import { site } from '@/network/module/download';

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n();

const generateFormModel = () => {
  return {
    scampus: '',
    scharge: '',
    sname: '',
    startTime: '',
    endTime: '',
    stype: '',
    createdTime: [] as string[],
    snums: '',
  };
};
const { loading, setLoading } = useLoading(true);

const renderData = ref([]);

const formModel = ref(generateFormModel());

const typeOptions = computed(() => [
  {
    label: '乒乓球场',
    value: '1',
  },
  {
    label: '羽毛球场',
    value: '2',
  }, {
    label: '篮球场',
    value: '3',
  },
]);

const campusOptions = computed(() => [
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


// 分页
const basePagination: Pagination = {
  pageNum: 1,
  pageSize: 20,
};
const pagination = reactive({
  ...basePagination,
});

const fetchData = async (
  params = { pageNum: 1, pageSize: 20 }
) => {
  setLoading(true);
  try {
    const { data } = await querySite(params, omit(formModel.value, ['createdTime']));
    renderData.value = data.pages.records;
    pagination.pageNum = data.pages.current;
    pagination.total = data.pages.total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const cheackItem = (id: number) => {
  router.push({ name: 'CheckPlace', query: { id } })
}
const bookItem = async (id: number) => {
  const { code, message } = await getInfoIsDefaulter({ uId: userStore.uId as string })
  if (code === 20001) {
    Message.error(message)
    return
  }
  router.push({ name: 'BookPlace', query: { id } })
}
const alterItem = (id: number) => {
  router.push({ name: 'AlterPlace', query: { id } })
}
const deleteItem = (record: any) => {
  console.log(record);
  Modal.warning({
    title: '删除场所',
    content: `是否确认删除场所：序号 ${record.sId} 名称 ${record.sName} `,
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      console.log('id=>', record.sId);
      deleteSite({ sId: record.sId })
        .then((res) => {
          if (res.code === 20000) {
            Notification.success(t('place.delete.success'));
            fetchData()
          }
          else {
            Notification.error(res.message)
          }
        })
        .catch(() => Notification.error(t('place.delete.error')))
        .finally(() => done(true));
    },
  });
}


const search = () => {
  if (formModel.value.createdTime.length) {
    [formModel.value.startTime, formModel.value.endTime] = formModel.value.createdTime
  }
  fetchData(basePagination);
};
const onPageChange = (pageNum: number) => {
  fetchData({ ...basePagination, pageNum });
};

fetchData()
const reset = () => {
  formModel.value = generateFormModel();
  fetchData(basePagination);

};
const download = async () => {
  const { data: { returnUrl }, code } = await site(basePagination, formModel.value)
  if (code === 20000) {
    Message.warning('正在下载')
    const link = document.createElement('a');
    link.href = returnUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    Message.error('下载失败，请重试！')
  }
}
</script>

<script lang="ts">
export default {
  name: 'place',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.text {
  height: 90px;
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
