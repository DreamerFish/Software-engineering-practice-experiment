<template>
  <div class="container">
    <Breadcrumb :items="['menu.equipment', 'menu.equipment.equipmentInquiry']" />
    <a-card class="general-card" :title="$t('menu.equipment.equipmentInquiry')">
      <!-- 查询区域 -->
      <a-row>
        <a-col :flex="1">
          <a-form :model="searchData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="uname" :label="$t('equipment.form.name')">
                  <a-input v-model="searchData.ename" :placeholder="$t('equipment.form.name.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="etype" :label="$t('equipment.form.alias')">
                  <a-select v-model="searchData.etype" :options="equipmentOptions"
                    :placeholder="$t('equipment.form.selectDefault')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="echarge" label="收费标准">
                  <a-input v-model="searchData.echarge" placeholder="请输入数值，单位为元/小时" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="eborrowNums" :label="$t('equipment.form.email')">
                  <a-input v-model="searchData.eborrowNums" placeholder="请输入已借用次数" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="time" :label="$t('equipment.form.createdTime')">
                  <a-range-picker v-model="searchData.time" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="edamage" :label="$t('equipment.form.role')">
                  <a-select v-model="searchData.edamage" :options="damageOptions"
                    :placeholder="$t('equipment.form.selectDefault')" />
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
          <a-button @click="download">
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
          <a-table-column :title="$t('序号')">
            <template #cell="{ rowIndex }">
              {{ (rowIndex + 1) + (pagination.pageNum - 1) * pagination.pageSize }}
            </template>
          </a-table-column>
          <a-table-column :title="$t('equipment.columns.id')" data-index="eId" />
          <a-table-column :title="$t('equipment.columns.email')" data-index="eName" />
          <a-table-column :title="$t('equipment.columns.alias')" data-index="equipmentType">
          </a-table-column>
          <a-table-column :title="$t('equipment.columns.name')" data-index="chargeStandard">
          </a-table-column>
          <a-table-column :title="$t('equipment.columns.phone')" data-index="eBorrowNums" />
          <a-table-column :title="$t('equipment.columns.createdTime')" data-index="cre" />
          <a-table-column :title="$t('equipment.columns.role')" data-index="isDamage">
            <template #cell="{ record: { isDamage } }">
              <a-tag v-if="isDamage === '未损坏'" color="cyan" bordered>未损坏</a-tag>
              <a-tag v-else color="orangered" bordered>已损坏</a-tag>
            </template>
          </a-table-column>
          <a-table-column :title="$t('equipment.columns.operations')" data-index="operations" class="btn">
            <template #cell="{ record: { eId, isDamage }, rowIndex }">
              <a-button type="text" size="mini" @click="cheackItem(eId)">
                查看
              </a-button>
              <a-button type="text" size="mini" @click="rentItem(eId, isDamage)">
                租用
              </a-button>
              <a-button v-if="userStore.role.includes('admin') || userStore.role.includes('equipment')" type="text"
                size="mini" @click="repairItem(eId)">
                报修
              </a-button>
              <a-button v-if="userStore.role.includes('admin') || userStore.role.includes('equipment')" type="text"
                size="mini" @click="deleteItem(eId, rowIndex)">
                报废
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <a-modal v-model:visible="visible" :on-before-ok="handleBeforeOk" title-align="start">
      <template #title>
        添加报修信息
      </template>
      <a-textarea class="text" placeholder="请输入报修原因，最多不超过200字。" v-model="repair.erepairReason" allow-clear />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import { Modal, Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router'
import { selectEquipment, deleteEquipment, updateEquipment, getInfoIsHire } from '@/network/module/equipment'
import { omit } from 'lodash';
import { equipment } from '@/network/module/download';
import { getInfoIsDefaulter } from '@/network/module/defaulter';
import { useUserStore } from '@/store/index'

const router = useRouter()
const userStore = useUserStore()

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
  eborrowNums: '',
  echarge: '',
  edamage: '',
  ename: "",
  endTime: "3000-05-24 22:05:26",
  etype: '',
  startTime: "2000-05-10 22:05:26",
  time: [] as string[],
}
const searchData: typeof baseSearchData = reactive({
  ...baseSearchData,
});
const damageOptions = computed(() => [
  {
    label: '未损坏',
    value: 0,
  }, {
    label: '损坏',
    value: 1,
  }
]);
const equipmentOptions = [
  {
    label: '羽毛球类',
    value: '1',
  },
  {
    label: '足球类',
    value: '2',
  }, {
    label: '乒乓球',
    value: '3',
  }, {
    label: '篮球类',
    value: '4',
  }
];
const fetchData = async (
  params = basePagination,
  body = baseSearchData
) => {
  setLoading(true);
  try {
    const { data } = await selectEquipment(params, omit(body, ['time']))
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
  searchData.eborrowNums = '';
  searchData.echarge = '';
  searchData.edamage = '';
  searchData.ename = "";
  searchData.etype = '';
  searchData.time = [] as string[];
  search()
};

const cheackItem = (id: number) => {
  router.push({ name: 'CheckEquipment', query: { id } })
}
const rentItem = async (id: string, isDamage:string) => {
  if(isDamage==='已损坏') {
    Message.error('器材已损坏！')
    return
  }
  const res = await getInfoIsHire({ eId: id })
  if(res.code===20000) {
    const { code, message } = await getInfoIsDefaulter({ uId: userStore.uId as string })
    if (code === 20001) {
      Message.error(message)
      return
    }
    router.push({ name: 'RentEquipment', query: { id } })
  }else {
    Message.error(res.message)
  }
}
const deleteItem = (eId: string, rowIndex: number) => {
  Modal.warning({
    title: '报废器材',
    content: `是否确认报废器材：序号 ${eId}`,
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      deleteEquipment({ eId })
        .then(({code,message}) => {
          if(code===20000) {
            Message.success(t('equipment.delete.success'))
            renderData.value.splice(rowIndex, 1)
          } else {
            Message.error(message)
          }
          
        })
        .catch(() => () => Message.error(t('equipment.delete.error')))
        .finally(() => done(true));
    },
  });
}

const visible = ref(false);
const repair = reactive({
  eid: '',
  erepairReason: ''
})
const repairItem = (id: string) => {
  repair.eid = id
  visible.value = true
}
const handleBeforeOk = (done: any) => {
  console.log(repair);
  updateEquipment(repair).then(() => {
    Message.success(t('equipment.modif.success'))
    reset()
  })
    .catch(() => Message.error(t('equipment.modif.error')))
    .finally(() => done(true));
};

const download = async () => {
  const { data: { returnUrl }, code } = await equipment(basePagination, searchData)
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
  name: 'equipment',
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
