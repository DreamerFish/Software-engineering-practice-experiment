<template>
  <div class="container">
    <Breadcrumb :items="['器材信息', '租用记录']" />
    <a-card class="general-card" title="租用信息查询">
      <!-- 查询区域 -->
      <a-row>
        <a-col :flex="1">
          <a-form :model="searchData" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="ename" label="器材名称">
                  <a-input v-model="searchData.ename" placeholder="请输入器材名称" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="etype" label="借用人学号">
                  <a-input v-model="searchData.unumber" placeholder="请输入借用人学号" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="echarge" label="收费标准">
                  <a-input v-model="searchData.echarge" placeholder="请输入数值，单位为元/小时" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="searchData" label="借用时长">
                  <a-input v-model="searchData.hduration" placeholder="请输入借用时长" />
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
          <a-table-column title="借用人id">
            <template #cell="{ record: { user: { uNumber } } }">
              {{ uNumber }}
            </template>
          </a-table-column>
          <a-table-column title="器材名称">
            <template #cell="{ record: { equipment: { eName } } }">
              {{ eName }}
            </template>
          </a-table-column>
          <a-table-column title="借用人姓名">
            <template #cell="{ record: { user: { uName } } }">
              {{ uName }}
            </template>
          </a-table-column>
          <a-table-column title="收费标准">
            <template #cell="{ record: { equipment: { eCharge } } }">
              {{ eCharge }}元/小时
            </template>
          </a-table-column>
          <a-table-column title="借用时长">
            <template #cell="{ record: { hDuration } }">
              {{ hDuration }}小时
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="cre" />
          <a-table-column title="联系方式">
            <template #cell="{ record: { user: { uPhone } } }">
              {{ uPhone }}
            </template>
          </a-table-column>
          <a-table-column title="状态">
              <template #cell="{ record: {  hRecycleHire  } }">
                <a-tag v-if="hRecycleHire === 1" color="cyan" bordered>已回收</a-tag>
                <a-tag v-else color="orangered" bordered>未回收</a-tag>
              </template>
            </a-table-column>
          <a-table-column title="操作" data-index="operations" class="btn">
            <template #cell="{ record: { hId, equipment: { eCost } }, rowIndex }">
              <a-button type="text" size="mini" @click="checkItem(hId)">
                查看
              </a-button>
              <a-button type="text" size="mini" @click="recycleItem(hId, rowIndex)">
                回收
              </a-button>
              <a-button type="text" size="mini" @click="damageItem(hId, rowIndex, eCost)">
                损坏
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
import useLoading from '@/hooks/loading';
import { Modal, Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router'
import { omit } from 'lodash';
import { deleteHire, selectHireByMul, updateHire } from '@/network/module/hire';
import { hire } from '@/network/module/download';

const router = useRouter()

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
  echarge: "",
  ename: "",
  endTime: "3000-05-24 22:05:26",
  hduration: "",
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
    const { data } = await selectHireByMul(params, omit(body, ['time']))
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
  searchData.echarge = '';
  searchData.hduration = '';
  searchData.ename = "";
  searchData.unumber = '';
  searchData.time = [] as string[];
  search()
};

const checkItem = (hId: string)=>{
  console.log(hId);
  router.push({name:'CheckRentEquipment',query:{ hId }})
}
const recycleItem = (id: string, rowIndex: number) => {
  Modal.warning({
    title: '回收器材',
    content: `是否确认回收器材（序号：${id}）`,
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      deleteHire({ hId:id }).then(({code,message}) => {
        if(code === 20000) {
          Message.success('提交成功')
          reset()
        } else {
          Message.error(message)
        }
      })
        .catch(() => () => Message.error('提交失败，请重试！'))
        .finally(() => done(true));
    },
  });
}
const damageItem = (id: string, rowIndex: number, eCost: string) => {
  Modal.warning({
    title: '损坏器材',
    content: `是否确认损坏器材（序号：${id}），损坏需赔偿${eCost}元！`,
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      updateHire({ hid: id, hdamage: 1 })
        .then(({ code, message }) => {
          if (code === 20000) {
            Message.success('提交成功')
            reset()
          } else {
            Message.error(message)
          }
        })
        .catch(() => () => Message.error('提交失败，请重试！'))
        .finally(() => done(true));
    },
  });
}

const download = async () => {
  const { data: { returnUrl }, code } = await hire(basePagination, searchData)
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
