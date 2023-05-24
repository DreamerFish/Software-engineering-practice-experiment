<template>
  <div class="container">
    <Breadcrumb :items="['失约信息', '失约人员列表']" />
    <a-card class="general-card" title="失约人员查询">
      <!-- 查询区域 -->
      <a-row>
        <a-col :flex="1">
          <a-form :model="searchData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="uname" label="真实姓名">
                  <a-input v-model="searchData.uname" placeholder="请输入失约人真实姓名" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="unumber" label="失约人学号">
                  <a-input v-model="searchData.unumber" placeholder="请输入失约人学号" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="dfine" label="罚款数额">
                  <a-input v-model="searchData.dfine" placeholder="请输入数值，单位为元" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="uusername" label="用户名">
                  <a-input v-model="searchData.uusername" placeholder="请输入失约人用户名" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="time" label="创建时间">
                  <a-range-picker v-model="searchData.time" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="uphone" label="联系方式">
                  <a-input v-model="searchData.uphone" placeholder="请输入借用人联系方式" />
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
              {{ $t('equipment.form.reset') }}
            </a-button>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('equipment.form.search') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('equipment.operation.download') }}
          </a-button>
        </a-col>
      </a-row>

      <!-- 表格展示 -->
      <a-table row-key="id" :loading="loading" :pagination="pagination" :data="renderData" :bordered="false"
        @page-change="onPageChange">
        <template #columns>
          <a-table-column title="失约人学号">
            <template #cell="{ record: { user: { uNumber } } }">
              {{ uNumber }}
            </template>
          </a-table-column>
          <a-table-column title="真实姓名">
            <template #cell="{ record: { user: { uName } } }">
              {{ uName }}
            </template>
          </a-table-column>
          <a-table-column title="联系方式">
            <template #cell="{ record: { user: { uPhone } } }">
              {{ uPhone }}
            </template>
          </a-table-column>
          <a-table-column title="邮箱地址">
            <template #cell="{ record: { user: { uEmail } } }">
              {{ uEmail }}
            </template>
          </a-table-column>
          <a-table-column title="失约原因">
            <template #cell="{ record: { dReason } }">
              {{ dReason }}
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="cre" />
          <a-table-column title="罚款数额">
            <template #cell="{ record: { dFine } }">
              {{ dFine }} 元
            </template>
          </a-table-column>
          <a-table-column title="操作" data-index="operations" class="btn">
            <template #cell="{ record: { dId }, rowIndex }">
              <a-button type="text" size="mini" @click="updateItem(dId)">
                修改
              </a-button>
              <a-button type="text" size="mini" @click="deleteItem(dId, rowIndex)">
                删除
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="visible" :on-before-ok="handleBeforeOk" title-align="start">
      <template #title>
        {{ $t('accountList.modif') }}
      </template>
      <a-space align="center" fill>
        <a-form ref="formRef" :model="modifyItem" :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 18 }"
          label-align="left">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item field="uname" label="罚款金额">
                <a-input v-model="modifyItem.dfine" placeholder="请输入数值。单位为元" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item field="dreason" label="罚款描述">
                <a-textarea placeholder="请输入罚款描述，200字以内" :max-length="200" allow-clear v-model="modifyItem.dreason"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-space>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import useLoading from '@/hooks/loading';
import { Modal, Message } from '@arco-design/web-vue';
import { omit } from 'lodash';
import { deleteDefaulter, searchDefaulter, update } from '@/network/module/defaulter';
import { FormInstance } from '@arco-design/web-vue/es/form';

const { loading, setLoading } = useLoading(true);
const renderData = ref<any[]>([]);
const basePagination = {
  pageNum: 1,
  pageSize: 10,
};
const pagination: {
  pageNum: number;
  pageSize: number;
  total?: number
} = reactive({
  ...basePagination,
});
const baseSearchData = {
  uname: "",
  dfine: "",
  endTime: "3000-05-24 22:05:26",
  uusername: "",
  startTime: "2000-05-10 22:05:26",
  unumber: "",
  uphone: "",
  time: [] as string[],
}
const searchData: typeof baseSearchData = reactive({
  ...baseSearchData,
});
const fetchData = async (
  params = basePagination,
  body = baseSearchData
) => {
  setLoading(true);
  try {
    const { data } = await searchDefaulter(params, omit(body, ['time']))
    renderData.value = data.pages.records;
    pagination.pageNum = params.pageNum;
    pagination.total = data.pages.total;

  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const search = () => {
  if (searchData.time.length) {
    [searchData.startTime, searchData.endTime] = searchData.time
  }
  fetchData(basePagination, searchData)
};
const onPageChange = (pageNum: number) => {
  fetchData({ ...basePagination, pageNum });
};

fetchData();
const reset = () => {
  searchData.endTime = "3000-05-24 22:05:26";
  searchData.startTime = "2000-05-10 22:05:26";
  searchData.uphone = '';
  searchData.uusername = '';
  searchData.uname = '';
  searchData.dfine = "";
  searchData.unumber = '';
  searchData.time = [] as string[];
  search()
};

const deleteItem = (id: string, rowIndex: number) => {
  Modal.warning({
    title: '移除失约人员',
    content: `是否确认移除该失约人员？`,
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      deleteDefaulter({ dId: id })
        .then((res) => {
          if (res.code === 20000) {
            Message.success('删除成功')
            renderData.value.splice(rowIndex, 1)
          } else {
            Message.error('删除失败，请重试！')
          }
        })
        .catch(() => () => Message.error('删除失败，请重试！'))
        .finally(() => done(true));
    },
  });
}

const visible = ref(false);
const modifyItem = reactive({
  did: '',
  dreason: '',
  dfine: ''
})
const updateItem = (id: number) => {
  modifyItem.did = id.toString()
  visible.value = true
}
const formRef = ref<FormInstance>();
const handleBeforeOk = (done: any) => {
  update(modifyItem)
    .then(({ code }) => {
      if (code === 20000) {
        Message.success('修改成功')
        reset()
      } else {
        Message.error('修改失败，请重试！')
      }
    })
    .catch(() => Message.error('修改失败，请重试！'))
    .finally(() => done(true));
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
