<template>
  <a-space size="large" class="width100">
    <a-typography-text>添加人员 :</a-typography-text>
    <a-input-search :style="{ width: '320px' }" placeholder="请输入人员ID" search-button @search="handleClick()"
      v-model="searchuNumber">
      <template #button-icon>
        <icon-search />
      </template>
      <template #button-default>
        查询
      </template>

    </a-input-search>
  </a-space>

  <!-- 表格展示 -->
  <a-table :data="gameUserData" :loading="loading" class="width100" size="large">
    <template #columns>
      <a-table-column title="人员ID" data-index="uId" />
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
  <a-space>
    <a-button type="secondary" @click="goPrev">
      {{ $t('addAdministrator.button.prev') }}
    </a-button>
    <a-button type="primary" @click="onNextClick">
      {{ $t('addAdministrator.button.next') }}
    </a-button>
  </a-space>

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
          {{ showGameData.gid }}
        </a-typography-paragraph>
        赛事名称：<br>
        <a-typography-paragraph copyable>
          {{ showGameData.gname }}
        </a-typography-paragraph>
      </div>

      <div class="content">
        赛事时间：<br>
        <a-typography-paragraph copyable>
          {{ showGameData.rdate }} &nbsp; {{ showGameData.rduration }}
        </a-typography-paragraph>
        赛事地点：<br>
        <a-typography-paragraph copyable>
          {{ showGameData.rsname }}
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
import { ref, defineProps } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { getInforGame } from '@/network/module/game';
import { getListBygId, deleteParticipants, insertParticipants } from '@/network/module/participants';
import { getInfoByNumber } from '@/network/module/user/index'
import useLoading from '@/hooks/loading';
import { Modal, Notification } from '@arco-design/web-vue';
import { getInfoIsDefaulter } from '@/network/module/defaulter';

const emits = defineEmits(['changeStep']);
const duteOptions = ref([
  {
    value: 1,
    label: '裁判'
  }, {
    value: 2,
    label: '选手'
  }
]);

const props = defineProps<{
  gId: string
}>()
console.log("要的就是你", props.gId);

const formRef = ref<FormInstance>();

const gameUserData = ref<any>([])
// 新增赛事人员
const searchUserData = ref<any>({});
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



const onNextClick = async () => {
  emits('changeStep', 'submit');
};
const goPrev = () => {
  emits('changeStep', 'backward');
};




// 表格数据
// 获取数据
const { loading, setLoading } = useLoading(true);

const getGameUserList = async () => {
  setLoading(true);
  try {
    const { data: gameUserList } = await getListBygId({
      gId: props.gId
    });

    gameUserData.value = gameUserList.list;
    gameUserData.value.forEach((item: any) => {
      item.uName = item.user.uName;
      item.uId = item.user.uId;
      item.uUsername = item.user.uUsername;
    });
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }

}

const showGameData = ref<{
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

// 学号输入框
const searchuNumber = ref('');

const visible = ref(false);
const handleClick = () => {
  Promise.all([getInfoByNumber({ uNumber: searchuNumber.value }), getInforGame({ gId: props.gId })]).then((res: any) => {
    if (res[0].code === 20000 && res[1].code === 20000) {
      Notification.success('查询成功')
      visible.value = true;
      searchUserData.value = res[0].data.user
      submitAddData.value.pgid = res[1].data.game.gId;
      submitAddData.value.puid = searchUserData.value.uId;
      showGameData.value.gid = res[1].data.game.gId
      showGameData.value.gname = res[1].data.game.gName
      showGameData.value.rdate = res[1].data.game.reservation.rDate
      showGameData.value.rduration = res[1].data.game.reservation.sDurationName
      showGameData.value.rsname = res[1].data.game.reservation.site.sName
    } else {
      Notification.error('查询失败')
    }
  }).catch(() => Notification.error('添加失败')).finally(() => {
    getGameUserList()
  })
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
// 删除人员操作
const deleteItem = (id: string) => {
  Modal.warning({
    title: '删除场所',
    content: `是否确认删除人员：序号  ${id}`,
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      console.log('id=>', id);
      deleteParticipants({ pId: id })
        .then((res) => {
          console.log(res);
          if (res.code === 20000) {
            Notification.success('删除成功');
            getGameUserList()
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
getGameUserList()
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

.form {
  width: 208px;
}

.form-content {
  padding: 8px 50px 0 30px;
}

:deep(.arco-modal) {
  width: 50%;
}

.width100 {
  width: 100%;
  margin-bottom: 20px;
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
  margin-top: 38px;
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

:deep(.arco-form-item) {
  margin-bottom: 0;
}

:deep(.arco-form-item):nth-child(2) {
  margin-bottom: 10px;
}
</style>
