<template>
  <a-form :model="gameData" class="form" :label-col-props="{ span: 3 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="gId" label="赛事ID" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="gameData.gId" size="large" disabled />
    </a-form-item>

    <a-form-item field="gName" label="赛事名称" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="gameData.gName" size="large" disabled />
    </a-form-item>
    <a-form-item field="sName" label="赛事地点" :rules="[
      {
        required: true,
      }
    ]">
      <a-input :placeholder="siteData.sName" size="large" disabled />
    </a-form-item>
    <a-form-item field="cre" label="赛事时间" :rules="[
      {
        required: true,
      }
    ]">
      <a-date-picker :placeholder="reservationData.rDate" disabled />
      <a-select :style="{ width: '320px' }" :placeholder="reservationData.sDurationName" :options="timeOptions"
        :field-names="timefieldNames" disabled />
    </a-form-item>
    <a-form-item field="playerNums" label="参赛者" :rules="[
      {
        required: true,
      }
    ]">
      <a-input-number :placeholder="gameData.playerNums" disabled>
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
      <a-input-number :placeholder="gameData.refereeNums" disabled>
        <template #suffix>
          人
        </template>
      </a-input-number>
    </a-form-item>
    <a-form-item field="refereeNums" label="备注">
      <a-textarea v-model="gameData.gNotes" :max-length="{ length: 200, errorOnly: true }" allow-clear show-word-limit
        placeholder="暂无" disabled />
    </a-form-item>
    <a-form-item>
      <a-table :columns="columns" :data="gameUserData" :loading="loading" size="large" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="goToMatchInquiry">
        返回列表
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getInforGame } from '@/network/module/game';
import { getListBygId } from '@/network/module/participants';
import useLoading from '@/hooks/loading';

const timefieldNames = { value: 'sduration', label: 'sdurationName' }
const router = useRouter()
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

const goToMatchInquiry = () => {
  router.push({ name: 'MatchInquiry' })
}

const columns = [
  {
    title: '人员ID',
    dataIndex: 'pId',
  },
  {
    title: '职责',
    dataIndex: 'pDutyName',
  },
  {
    title: '用户昵称',
    dataIndex: 'uUsername',
  },
  {
    title: '真实姓名',
    dataIndex: 'uName',
  },
  {
    title: '选手编号',
    dataIndex: 'pNums',
  },
];


const gameData = ref<any>({})
const reservationData = ref<any>({})
const siteData = ref<any>({})
const userData = ref<any>({})
const gameUserData = ref<any>([])

// 获取数据
const { loading, setLoading } = useLoading(true);
const fetchData = async () => {
  setLoading(true);
  try {
    const { data: gamedata } = await getInforGame({ gId: props.gId });
    gameData.value = gamedata.game;
    reservationData.value = gamedata.game.reservation;
    siteData.value = gamedata.game.reservation.site;
    userData.value = gamedata.game.reservation.user;

    const { data: gameUserList } = await getListBygId({ gId: props.gId });
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
};

fetchData();
</script>

<style scoped lang="less">
.container {
  padding: 20px;

  .keep-margin {
    margin-bottom: 20px;
  }
}

:deep(textarea:disabled) {
  background-color: #f2f3f5;
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

.form-content {
  padding: 8px 50px 0 30px;
}

:deep(.arco-table) {
  width: 100%;
}

:deep(.arco-input-number) {
  width: 20%;
}

:deep(input:disabled) {
  background-color: #f2f3f5;
}

:deep(input::placeholder) {
  color: black !important;
}

:deep(.arco-input-wrapper .arco-input[disabled]) {
  -webkit-text-fill-color: black;
}

:deep(.arco-select-view-single .arco-select-view-input[disabled]) {
  -webkit-text-fill-color: black;
}

:deep(.arco-textarea[disabled]) {
  -webkit-text-fill-color: black;
}
</style>
