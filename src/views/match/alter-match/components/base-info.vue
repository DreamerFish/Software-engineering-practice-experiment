<template>
  <a-form :model="submitData" class="form" :label-col-props="{ span: 3 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="gId" label="赛事ID" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="gameData.gId" size="large" disabled />
    </a-form-item>

    <a-form-item field="gname" label="赛事名称" :rules="[
      {
        required: true,
      }
    ]">
      <a-input v-model="submitData.gname" size="large" />
    </a-form-item>
    <a-form-item field="rsid" label="赛事地点" :rules="[
      {
        required: true,
      }
    ]">
      <a-select v-model="submitData.rsid" :options="placeOptions" placeholder="请选择赛事地点" :field-names="sitefieldNames"
        size="large" allow-clear />
    </a-form-item>
    <a-form-item field="rdate" label="赛事时间" :rules="[
      {
        required: true,
        message: '请选择赛事日期'
      }
    ]">
      <a-date-picker v-model="submitData.rdate"
        :disabledDate="(current: any) => dayjs(current).isBefore(dayjs().startOf('day')) || dayjs(current).isAfter(dayjs().add(1, 'week'))"
        @change=getFreeTimeDate(submitData.rdate) />
      <a-select :style="{ width: '320px' }" v-model="submitData.rduration" :options="timeOptions"
        :field-names="timefieldNames" />
    </a-form-item>
    <a-form-item field="playerNums" label="参赛者" :rules="[
      {
        required: true,
      }
    ]">
      <a-input-number v-model="gameData.playerNums" disabled>
        <template #suffix>
          人
        </template>
      </a-input-number>
    </a-form-item>
    <a-form-item field="refereeNums" label="裁判" :rules="[
      {
        required: true,
      }
    ]">
      <a-input-number v-model="gameData.refereeNums" disabled>
        <template #suffix>
          人
        </template>
      </a-input-number>
    </a-form-item>

    <a-form-item field="refereeNums" label="备注">
      <a-textarea v-model="submitData.gnotes" :max-length="{ length: 200, errorOnly: true }" allow-clear show-word-limit
        placeholder="请输入备注信息" />
    </a-form-item>

    <a-form-item label="添加人员">
      <a-input-search :style="{ width: '320px' }" placeholder="请输入人员ID" search-button @search="handleClick()"
        v-model="searchuNumber">
        <template #button-icon>
          <icon-search />
        </template>
        <template #button-default>
          查询
        </template>
      </a-input-search>
    </a-form-item>
    <a-form-item>
      <a-table :data="gameUserData" :loading="loading" size="large">
        <template #columns>
          <a-table-column title="人员ID" data-index="pId" />
          <a-table-column title="职责" data-index="pDutyName" />
          <a-table-column title="用户昵称" data-index="uUsername" />
          <a-table-column title="真实姓名" data-index="uName" />
          <a-table-column title="选手编号" data-index="pNums" />
          <a-table-column title="操作" class="btn">
            <template #cell="{ record }">
              <a-button type="text" size="mini" @click="deleteItem(record.pId)">
                删除
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>

    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="outline" @click="goToMatchInquiry">
          返回列表
        </a-button>
        <a-button type="primary" @click="goToMatchInquiry">
          保存修改
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>


  <a-modal v-model:visible="visible" :on-before-ok="handleBeforeOk" @cancel="handleCancel">
    <template #title>
      查询结果
    </template>
    <!-- 人员信息 -->
    <div class="flex-box">
      <span class="avatar">
        <IconUser />
      </span>
      <div class="content">
        人员ID：<br>
        <a-typography-paragraph copyable>
          {{ searchUserData.uNumber }}
        </a-typography-paragraph>
      </div>
      <div class="content">
        真实姓名：<br>
        <a-typography-paragraph copyable>
          {{ searchUserData.uName }}
        </a-typography-paragraph>
      </div>
      <div class="content">
        联系方式：<br>
        <a-typography-paragraph copyable>
          {{ searchUserData.uPhone }}
        </a-typography-paragraph>
      </div>
    </div>
    <a-divider class="half-divider" />
    <!-- 赛事信息 -->
    <div class="flex-box">
      <span class="avatar">
        <icon-relation />
      </span>
      <div class="content">
        赛事编号：<br>
        <a-typography-paragraph copyable>
          {{ gameData.gId }}
        </a-typography-paragraph>
        赛事名称：<br>
        <a-typography-paragraph copyable>
          {{ gameData.gName }}
        </a-typography-paragraph>
      </div>

      <div class="content">
        赛事时间：<br>
        <a-typography-paragraph copyable>
          {{ submitData.rdate }} &nbsp; {{ submitData.rduration }}
        </a-typography-paragraph>
        赛事地点：<br>
        <a-typography-paragraph copyable>
          {{ submitData.rsname }}
        </a-typography-paragraph>
      </div>
    </div>
    <a-divider class="half-divider" />
    <!-- 选手信息 -->
    <div class="flex-box">
      <span class="avatar">
        <IconPen />
      </span>
      <div class="content">
        <a-form ref="formRef" :model="submitAddData" class="form" :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 12 }">
          <a-form-item class="margin-bottom-0">
            <span>设定人员序号:</span>
          </a-form-item>

          <a-form-item class="margin-bottom-10" field="pnums" :rules="[
            {
              match: /^[1-9]\d*$/,
              required: true,
              message: '请输入为大于0的设定人员序号',
            }
          ]">
            <a-input-number v-model="submitAddData.pnums" placeholder="请输入设定人员序号" allow-clear />
          </a-form-item>
          <a-form-item class="margin-bottom-0">
            <span>设定人员定位:</span>
          </a-form-item>
          <a-form-item field="pduty" :rules="[
            {
              match: /^[1-9]\d*$/,
              required: true,
              message: '请选择设定人员定位',
            }
          ]">
            <a-select v-model="submitAddData.pduty" :options="duteOptions" placeholder="请选择设定人员定位" />
          </a-form-item>
        </a-form>

      </div>
      <div class="content">
        <span class="PS"> <a-typography-text type="danger">
            注意：
          </a-typography-text><br>
          1.选手的编号为比赛编号<br>
          2.裁判的编号为裁判编号
        </span>
      </div>
    </div>

  </a-modal>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getFreeTime } from '@/network/module/place';
import { getInforGame, updateGame } from '@/network/module/game';
import { getListBygId, deleteParticipants, insertParticipants } from '@/network/module/participants';
import { getAllSites } from '@/network/module/place/index'
import { getInfoByNumber } from '@/network/module/user/index'
import { Modal, Notification } from '@arco-design/web-vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';
import dayjs from 'dayjs';
import { getInfoIsDefaulter } from '@/network/module/defaulter';

const router = useRouter()
const timefieldNames = { value: 'sduration', label: 'sdurationName' }
const sitefieldNames = { value: 'sid', label: 'sname' }
const formRef = ref<FormInstance>();

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

const props = defineProps<{
  gId: string,
}>()

const submitData = ref<{
  gid: string,
  gname: string,
  gnotes: string,
  rdate: string,
  rduration: string,
  rid: string,
  rsid: string,
  rsname: string
}>({
  gid: "string",
  gname: "string",
  gnotes: "string",
  rdate: "string",
  rduration: "string",
  rid: "string",
  rsid: "string",
  rsname: "string"
})

const getFreeTimeDate = async (getdate: string) => {
  const { data } = await getFreeTime({ date: getdate })
  submitData.value.rduration = '';
  timeOptions.value = data.freetime;
}

// 获得场地列表
const placeOptions = ref([]);
getAllSites().then((res) => {
  placeOptions.value = res.data.list
  console.log(placeOptions.value);
})
const duteOptions = ref([
  {
    value: 1,
    label: '裁判'
  }, {
    value: 2,
    label: '选手'
  }
]);






// 获取数据
const { loading, setLoading } = useLoading(true);
const gameData = ref<any>({})
const gameUserData = ref<any>([])
const getGameUserList = async () => {
  setLoading(true);
  try {
    const { data: gameUserList } = await getListBygId({
      gId: props.gId
    });

    gameUserData.value = gameUserList.list;
    gameUserData.value.forEach((item: any) => {
      item.uName = item.user.uName;
      item.uUsername = item.user.uUsername;
    });
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
}
const fetchData = async () => {
  setLoading(true);
  try {
    const { data: gamedata } = await getInforGame({ gId: props.gId });
    gameData.value = gamedata.game;
    submitData.value.gid = gamedata.game.gId
    submitData.value.gname = gamedata.game.gName
    submitData.value.gnotes = gamedata.game.gNotes
    submitData.value.rdate = gamedata.game.reservation.rDate
    submitData.value.rduration = gamedata.game.reservation.rDuration
    submitData.value.rid = gamedata.game.reservation.rId
    submitData.value.rsid = gamedata.game.reservation.rSid
    submitData.value.rsname = gamedata.game.reservation.site.sName

    getGameUserList()

  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

fetchData();

// 删除人员操作
const deleteItem = (id: string) => {
  Modal.warning({
    title: '删除场所',
    content: `是否确认删除场所：序号  ${id}`,
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      console.log('id=>', id);
      deleteParticipants({ pId: id })
        .then((res) => {
          console.log(res);
          if (res.code === 20000) {
            Notification.success('删除成功');
            fetchData();

          }
          else {
            Notification.error(res.message)
          }
        })
        .catch(() => Notification.error('删除失败'))
        .finally(() => done(true));
    },
  });
}


const searchUserData = ref<any>({});

// 新增赛事人员
const submitAddData = ref<{
  pduty: number,
  pnums: number,
  pgid: string,
  puid: string,
}>({
  pduty: NaN,
  pnums: NaN,
  pgid: '',
  puid: '',
})
// 添加人员弹窗
const searchuNumber = ref('');

const visible = ref(false);
const handleClick = async () => {

  getInfoByNumber({ uNumber: searchuNumber.value }).then((res: any) => {
    if (res.code === 20000) {
      Notification.success('查询成功')
      visible.value = true;
      searchUserData.value = res.data.user
      submitAddData.value.pgid = gameData.value.gId;
      submitAddData.value.puid = searchUserData.value.uId;
    } else {
      Notification.error(res.message)
    }
  }).catch(() => Notification.error('删除失败'))
};
const handleBeforeOk = (done: any) => {
  formRef.value?.validate().then((res) => {
    // 验证通过的操作
    if (!res) {

      getInfoIsDefaulter({ uId: submitAddData.value.puid as string }).then((resData) => {
        if (resData.code === 20001) {
          Notification.error(resData.message);
        } else {
          insertParticipants(submitAddData.value).then((response) => {
            if (response.code === 20000) {
              Notification.success('添加成功')
              getGameUserList();
            } else {
              Notification.error(response.message)
            }
          })
          done(true);
        }
      })
    } else {
      // 验证失败的操作
      done(false);
    }
  }).catch(() => {
    done(false);
  })
};
const handleCancel = () => {
  visible.value = false;
}

const goToMatchInquiry = async () => {
  await updateGame(submitData.value).then((res) => {
    console.log(res);
    if (res.code === 20000) {
      Notification.success('修改成功');
      router.push({ name: 'MatchInquiry' })
    }
    else {
      Notification.error(res.message)
    }
  }).catch(() => Notification.error('修改失败'))
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
  width: 100%;
}

:deep(input:disabled) {
  background-color: #f2f3f5;
}


.form-content {
  padding: 8px 50px 0 30px;
}

:deep(.arco-table) {
  width: 100%;
}


:deep(.arco-table-pagination) {
  justify-content: flex-start;
}

.flex-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-box .avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 16px;
  color: white;
  font-size: 16px;
  background-color: #2D70FF;
  border-radius: 50%;
}

.flex-box .content {
  flex: 1;
  color: var(--color-text-2);
  font-size: 12px;
  line-height: 20px;
}


.PS {
  width: 80%;
  margin-left: 5%;
  height: 100%;
  background-color: #F7F8FA;
  display: inline-block;
  border-radius: 5px;
  line-height: 30px;
  font-size: 13px;
  padding: 14px;
}

:deep(.arco-form-item-label-col) {
  padding-right: 5px;
}

:deep(.arco-col-6) {
  flex: 0 0 8%;
}

:deep(.arco-col-12) {
  flex: 0 0 90%;
}

.margin-bottom-0 {
  margin-bottom: 0 !important;
}

.margin-bottom-10 {
  margin-bottom: 10px !important;
}
</style>
