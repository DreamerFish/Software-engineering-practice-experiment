<template>
  <div class="list-wrap">
    <a-typography-title class="block-title" :heading="6">
      {{ $t('match.list') }}
    </a-typography-title>
    <a-row class="list-row" :gutter="24">
      <a-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6" :xxl="6" class="list-col">
        <div class="card-wrap empty-wrap" @click="goToAddMatch()">
          <a-card :bordered="false" hoverable>
            <a-result :status="null" :title="$t('match.content.action')">
              <template #icon>
                <icon-plus style="font-size: 20px" />
              </template>
            </a-result>
          </a-card>
        </div>
      </a-col>
      <a-col v-for="item in fetchData" :key="item.id" class="list-col" :xs="12" :sm="12" :md="12" :lg="6" :xl="6"
        :xxl="6">
        <CardWrap :loading="props.loading" :title="item.gName" :description="item.cre" :data="item"
          @update-data="updateData" :default-value="item.enable" :check-txt="$t('match.content.inspection')"
          :delete-txt="$t('match.content.delete')" :alter-txt="$t('match.content.alter')">
          <a-descriptions style="margin-top: 16px" :data="item.data" layout="inline-horizontal" :column="2" />
          <template #skeleton>
            <a-skeleton :animation="true">
              <a-skeleton-line :widths="['50%', '50%', '100%', '40%']" :rows="4" />
              <a-skeleton-line :widths="['40%']" :rows="1" />
            </a-skeleton>
          </template>
        </CardWrap>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUpdated } from 'vue';
import CardWrap from './card-wrap.vue';
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/index'
import { Notification } from '@arco-design/web-vue';
import { getIsParticipants } from '@/network/module/participants';

const userStore = useUserStore()
const router = useRouter();
const props = defineProps<{
  gameData: any,
  loading: boolean
}>();
const emits = defineEmits(['updateData']);

const IsParticipants = ref<any>([])
const getIsParticipantsData = () => {
  getIsParticipants().then((res) => {
    IsParticipants.value = res.data.data
    console.log("要的就是你", IsParticipants.value[0]);
  })
}
getIsParticipantsData();
const fetchData: any = ref({})
const getGame = () => {
  fetchData.value = props.gameData
  fetchData.value = fetchData.value.map((el: any) => {
    return {
      ...el, data: [
        {
          label: '场地',
          value: el.reservation.site.sName,
        },
        {
          label: '参赛者',
          value: el.playerNums,
        },
        {
          label: '裁判数',
          value: el.refereeNums,
        },
      ]
    };
  });
  getIsParticipantsData();
  fetchData.value.forEach((item: any) => {
    item.rdate = item.reservation.rDate;
    item.rduration = item.reservation.sDurationName;
    item.rsname = item.reservation.site.sName;
    if (IsParticipants.value[1].list.includes(item.gId)) {
      item.status = IsParticipants.value[1].status
    } else {
      item.status = IsParticipants.value[0].status
    }
  })
  console.log(fetchData.value);
}
const updateData = () => {
  emits('updateData');
  getGame()
}
onUpdated(() => {
  getGame()
})

const goToAddMatch = () => {
  if (userStore.role.includes('admin') || userStore.role.includes('game')) {
    router.push({ name: 'AddMatch' })
  } else {
    Notification.error({
      content: '权限不足，无法创建赛事!',
    })
  }
}

</script>

<style scoped lang="less">
.card-wrap {
  height: 100%;
  transition: all 0.3s;
  border: 1px solid var(--color-neutral-3);

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.arco-card-meta-description) {
    color: rgb(var(--gray-6));

    .arco-descriptions-item-label-inline {
      font-weight: normal;
      font-size: 12px;
      color: rgb(var(--gray-6));
    }

    .arco-descriptions-item-value-inline {
      color: rgb(var(--gray-8));
    }
  }
}

:deep(.arco-space-horizontal .arco-space-item) {
  display: inline-block;
}

.empty-wrap {
  height: 200px;
  border-radius: 4px;
  cursor: pointer;

  :deep(.arco-card) {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    .arco-result-title {
      color: rgb(var(--gray-6));
    }
  }
}

:deep(.arco-descriptions-body) {
  margin-bottom: 20px;
}
</style>
