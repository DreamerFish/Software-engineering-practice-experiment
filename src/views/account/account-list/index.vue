<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.accountList']" />
    <a-card class="general-card" :title="$t('menu.list.accountList')">
      <!-- 查询区域 -->
      <a-row>
        <a-col :flex="1">
          <a-form :model="searchData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="uname" :label="$t('accountList.form.name')">
                  <a-input v-model="searchData.uname" :placeholder="$t('accountList.form.name.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="uusername" :label="$t('accountList.form.alias')">
                  <a-input v-model="searchData.uusername" :placeholder="$t('accountList.form.alias.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="uphone" :label="$t('accountList.form.phone')">
                  <a-input v-model="searchData.uphone" :placeholder="$t('accountList.form.phone.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="uemail" :label="$t('accountList.form.email')">
                  <a-input v-model="searchData.uemail" :placeholder="$t('accountList.form.email.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="time" :label="$t('accountList.form.createdTime')">
                  <a-range-picker v-model="searchData.time" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="uroles" :label="$t('accountList.form.role')">
                  <a-select v-model="searchData.uroles" :options="roleOptions"
                    :placeholder="$t('accountList.form.selectDefault')" />
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
          <a-table-column :title="$t('序号')">
            <template #cell="{ rowIndex }">
              {{ (rowIndex + 1) + (pagination.pageNum - 1) * pagination.pageSize }}
            </template>
          </a-table-column>
          <a-table-column :title="$t('学号id')" data-index="uNumber" />
          <a-table-column :title="$t('accountList.columns.email')" data-index="uEmail" />
          <a-table-column :title="$t('accountList.columns.alias')" data-index="uUsername">
          </a-table-column>
          <a-table-column :title="$t('accountList.columns.name')" data-index="uName">
          </a-table-column>
          <a-table-column :title="$t('accountList.columns.phone')" data-index="uPhone" />
          <a-table-column :title="$t('accountList.columns.createdTime')" data-index="cre" />
          <a-table-column :title="$t('accountList.columns.roles')" data-index="uRoles">
          </a-table-column>
          <a-table-column :title="$t('accountList.columns.operations')" data-index="operations" class="btn">
            <template #cell="{ record: { uId }, rowIndex }">
              <a-button type="text" size="mini" @click="deleteItem(uId, rowIndex)">
                {{ $t('accountList.columns.operations.delete') }}
              </a-button>
              <a-button type="text" size="mini" @click="modifyRole(uId)">
                {{ $t('accountList.columns.operations.modify') }}
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
        <a-checkbox-group v-model="modifyItem.roles" :options="roleOptions" />
      </a-space>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { Modal, Message } from '@arco-design/web-vue';
import { inforSreach, deleteUser, updateRoles } from "@/network/module/user/index";
import { omit } from 'lodash';
import { user } from '@/network/module/download';

const { loading, setLoading } = useLoading(true);
const { t } = useI18n();
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
  endTime: "3000-05-24 22:05:26",
  startTime: "2000-05-10 22:05:26",
  uemail: "",
  uname: "",
  uphone: "",
  uroles: "",
  uusername: "",
  time: [] as string[],
}
const searchData: typeof baseSearchData = reactive({
  ...baseSearchData,
});
const roleOptions = computed(() => [
  {
    label: t('accountList.form.role.site'),
    value: 'site',
  },
  {
    label: t('accountList.form.role.game'),
    value: 'game',
  }, {
    label: t('accountList.form.role.equipment'),
    value: 'equipment',
  }, {
    label: '普通',
    value: 'user',
  }
]);
const fetchData = async (
  params = basePagination,
  body = baseSearchData
) => {
  setLoading(true);
  try {
    const { data } = await inforSreach(params, omit(body, ['time']))
    data.pages.records.forEach((item: any) => {
      item.uRoles = (item.uRoles as string).slice(0, -1)
    });
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
  searchData.uemail = "";
  searchData.uname = "";
  searchData.uphone = "";
  searchData.uroles = "";
  searchData.uusername = "";
  searchData.time = [] as string[];
  search()
};

const deleteItem = (id: number, rowIndex: number) => {
  Modal.warning({
    title: t('accountList.delete'),
    content: t('accountList.delete.message'),
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      console.log('id=>', id, rowIndex);
      deleteUser({ uid: id })
        .then(() => {
          Message.success(t('accountList.delete.success'))
          renderData.value.splice(rowIndex, 1)
        })
        .catch(() => Message.error(t('accountList.delete.error')))
        .finally(() => done(true));
    },
  });
}
const visible = ref(false);
const modifyItem: { roles: string[], userId?: string } = reactive({
  roles: [],
  userId: ''
})
const modifyRole = (id: number) => {
  modifyItem.userId = id.toString()
  visible.value = true
}
const handleBeforeOk = (done: any) => {
  const obj: { uid: string, roles: string } = { uid: '', roles: '' }
  obj.uid = (modifyItem.userId)!
  obj.roles = modifyItem.roles.join(',')
  updateRoles(obj)
    .then(() => {
      Message.success(t('accountList.modif.success'))
      reset()
    })
    .catch(() => Message.error(t('accountList.modif.error')))
    .finally(() => done(true));
};

const download = async () => {
  const { data: { returnUrl }, code } = await user(basePagination, searchData)
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
