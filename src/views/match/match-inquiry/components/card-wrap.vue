<template>
  <div class="card-wrap">
    <a-card v-if="loading" :bordered="false" hoverable>
      <slot name="skeleton"></slot>
    </a-card>
    <a-card v-else :bordered="false" hoverable>
      <a-space align="start">
        <a-card-meta>
          <template #title>
            <a-typography-text style="margin-right: 10px">
              {{ title }}
            </a-typography-text>
          </template>
          <template #description>
            {{ description }}
            <slot></slot>
          </template>
        </a-card-meta>
      </a-space>
      <template #actions>

        <div>
          <a-space v-if="userStore.role.includes('admin') || userStore.role.includes('site')">
            <a-button @click="deleteItem()">
              {{ deleteTxt }}
            </a-button>
            <a-button type="primary" @click="goToCheckMatch()">
              {{ checkTxt }}
            </a-button>
            <a-button type="outline" @click="goToAlterMatch()">
              {{ alterTxt }}
            </a-button>
          </a-space>
          <a-space v-else-if="userStore.role.includes('user')">

            <a-button type="primary" @click="goToCheckMatch()">
              {{ checkTxt }}
            </a-button>
            <a-button v-if="props.data.status == 0" type="outline" @click="handleClick()">
              报名
            </a-button>
            <a-button v-else-if="props.data.status == 1" type="outline" status="success">
              已报名
            </a-button>
          </a-space>
        </div>
      </template>
    </a-card>
  </div>
  <a-modal v-model:visible="visible" :on-before-ok="handleBeforeOk" @cancel="handleCancel">
    <template #title>
      报名信息
    </template>
    <!-- 人员信息 -->
    <div class="flex-box">
      <span class="avatar">
        <IconUser />
      </span>
      <div class="content">
        人员ID：<br>
        <a-typography-paragraph copyable>
          {{ userStore.uNumber }}
        </a-typography-paragraph>
      </div>
      <div class="content">
        真实姓名：<br>
        <a-typography-paragraph copyable>
          {{ userStore.uName }}
        </a-typography-paragraph>
      </div>
      <div class="content">
        联系方式：<br>
        <a-typography-paragraph copyable>
          {{ userStore.uPhone }}
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
          {{ props.data.gId }}
        </a-typography-paragraph>
        赛事名称：<br>
        <a-typography-paragraph copyable>
          {{ props.data.gName }}
        </a-typography-paragraph>
      </div>

      <div class="content">
        赛事时间：<br>
        <a-typography-paragraph copyable>
          {{ props.data.rdate }} &nbsp; {{ props.data.rduration }}
        </a-typography-paragraph>
        赛事地点：<br>
        <a-typography-paragraph copyable>
          {{ props.data.rsname }}
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Modal, Notification } from '@arco-design/web-vue';
import { insertParticipants } from '@/network/module/participants';
import { deleteGame } from '@/network/module/game/index'
import { FormInstance } from '@arco-design/web-vue/es/form';
import { getInfoIsDefaulter } from '@/network/module/defaulter';
import { useUserStore } from '@/store/index'

const userStore = useUserStore()
const router = useRouter()
const formRef = ref<FormInstance>();
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  defaultValue: {
    type: Boolean,
    default: false,
  },
  checkTxt: {
    type: String,
    default: '',
  },
  alterTxt: {
    type: String,
    default: '',
  },
  deleteTxt: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default() {
      return {}
    }
  }
});
console.log(props.data);

const emits = defineEmits(['updateData']);

// 新增赛事人员
const duteOptions = ref([
  {
    value: 1,
    label: '裁判'
  }, {
    value: 2,
    label: '选手'
  }
]);

const submitAddData = ref<{
  pduty: number,
  pnums: number,
  pgid: string,
  puid: string | undefined,
}>({
  pduty: NaN,
  pnums: NaN,
  pgid: '',
  puid: '',
})

const visible = ref(false);

const handleClick = async() => {
    const { code, message } = await getInfoIsDefaulter({ uId: userStore.uId as string })
    if (code === 20001) {
    Message.error(message)
    return
  }
  visible.value = true;
};
const handleBeforeOk = (done: any) => {
  formRef.value?.validate().then((res) => {
    // 验证通过的操作
    if (!res) {

      submitAddData.value.pgid = props.data.gId;
      submitAddData.value.puid = userStore.uId;
      console.log(submitAddData.value);
      insertParticipants(submitAddData.value).then((response) => {
        if (response.code === 20000) {
          Notification.success('报名成功，若要取消报名请联系管理员')
        } else {
          Notification.error(response.message)
        }
      })
      done(true);
    } else {
      // 验证失败的操作
      done(false);
    }
  }).catch(() => {
    done(false);
  }).finally(() => {
    emits('updateData');
  })
};
const handleCancel = () => {
  visible.value = false;
}


const goToCheckMatch = () => {
  router.push({ name: 'CheckMatch', query: { gId: props.data.gId } })
}
const goToAlterMatch = () => {
  router.push({ name: 'AlterMatch', query: { gId: props.data.gId } })
}
const deleteItem = () => {
  Modal.warning({
    title: '删除场所',
    content: `是否确认删除场所：序号  ${props.data.gId}`,
    titleAlign: 'start',
    hideCancel: false,
    onBeforeOk(done) {
      console.log('id=>', props.data.gId);
      deleteGame({ gId: props.data.gId })
        .then((res) => {
          console.log(res);
          if (res.code === 20000) {
            Notification.success('删除成功');
            emits('updateData');
          }
          else {
            Notification.error(res.message)
          }
        })
        .catch(() => Notification.error('删除失败，存在人员引用情况'))
        .finally(() => done(true));
    },
  });
}
</script>

<style scoped lang="less">
.card-wrap {
  height: 100%;
  transition: all 0.3s;
  border: 1px solid var(--color-neutral-3);
  border-radius: 4px;

  &:hover {
    transform: translateY(-4px);
    // box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  }

  :deep(.arco-card) {
    height: 100%;
    border-radius: 4px;

    .arco-card-body {
      height: 100%;

      .arco-space {
        width: 100%;
        height: 100%;

        .arco-space-item {
          height: 100%;

          &:last-child {
            flex: 1;
          }

          .arco-card-meta {
            height: 100%;
            display: flex;
            flex-flow: column;

            .arco-card-meta-content {
              flex: 1;

              .arco-card-meta-description {
                margin-top: 8px;
                color: rgb(var(--gray-6));
                line-height: 20px;
                font-size: 12px;
              }
            }

            .arco-card-meta-footer {
              margin-top: 0;
            }
          }
        }
      }
    }
  }

  :deep(.arco-card-meta-title) {
    display: flex;
    align-items: center;

    // To prevent the shaking
    line-height: 28px;
  }

  :deep(.arco-skeleton-line) {
    &:last-child {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
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
