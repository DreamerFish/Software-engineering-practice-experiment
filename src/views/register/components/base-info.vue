<template>
  <a-form ref="formRef" :model="formData" class="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
    <a-form-item field="uname" label="姓名" :rules="[
      {
        required: true,
        message: '请输入姓名',
      },
      {
        match: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
        message: '请输入有效姓名，长度为2-16',
      },
    ]">
      <a-input v-model="formData.uname" placeholder="真实姓名" />
    </a-form-item>
    <a-form-item field="unumber" label="学号" :rules="[
      {
        required: true,
        message: '请输入学号',
      },
      {
        match: /^\d{12}$/,
        message: '请输入有效学号，长度为12',
      },
    ]">
        <a-input v-model="formData.unumber" placeholder="请输入学号" />
      </a-form-item>
    <a-form-item field="uusername" label="用户名" :rules="[
      {
        required: true,
        message: '请输入用户名',
      },
      {
        match: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
        message: '请输入有效姓名，长度为2-16',
      },
    ]">
      <a-input v-model="formData.uusername" placeholder="用户名" />
    </a-form-item>
    
    <a-form-item field="ucid" label="学院" :rules="[
      {
        required: true,
        message: '请选择学院',
      }
    ]">
      <a-select v-model="formData.ucid"  placeholder="请选择学院" allow-search>
        <a-option v-for="(item,index) of colleges" :value="item.cId" :label="item.cName" :key="index"/>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-button @click="goToLogin">
          取消
        </a-button>
      <a-button type="primary" @click="onNextClick">
        下一步
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref,onMounted } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { useRouter } from 'vue-router'
import {queryColleges} from '@/network/module/college/index'

const router = useRouter()
const emits = defineEmits(['changeStep']);

const colleges = ref<any[]>([
  {
    "cId": 0,
    "cName": "无学院",
    "cre": "2023-05-15 09:45:13",
    "modified": "2023-05-15 09:45:16",
    "del": 0
  },
  {
    "cId": 1,
    "cName": "水产学院",
    "cre": "2023-05-13 08:34:21",
    "modified": "2023-05-13 08:34:24",
    "del": 0
  },
  {
    "cId": 2,
    "cName": "食品科技学院",
    "cre": "2023-05-13 08:34:36",
    "modified": "2023-05-13 08:34:38",
    "del": 0
  },
  {
    "cId": 3,
    "cName": "海洋与气象学院",
    "cre": "2023-05-13 08:34:53",
    "modified": "2023-05-13 08:34:56",
    "del": 0
  },
  {
    "cId": 4,
    "cName": "滨海农业学院",
    "cre": "2023-05-13 08:35:08",
    "modified": "2023-05-13 08:35:11",
    "del": 0
  },
  {
    "cId": 5,
    "cName": "机械工程学院",
    "cre": "2023-05-13 08:35:21",
    "modified": "2023-05-13 08:35:24",
    "del": 0
  },
  {
    "cId": 6,
    "cName": "海洋工程与能源学院",
    "cre": "2023-05-13 08:35:40",
    "modified": "2023-05-13 08:35:43",
    "del": 0
  },
  {
    "cId": 7,
    "cName": "马克思主义学院",
    "cre": "2023-05-13 08:35:56",
    "modified": "2023-05-13 08:35:59",
    "del": 0
  },
  {
    "cId": 8,
    "cName": "经济学院",
    "cre": "2023-05-13 08:36:08",
    "modified": "2023-05-13 08:36:13",
    "del": 0
  },
  {
    "cId": 9,
    "cName": "管理学院",
    "cre": "2023-05-13 08:36:23",
    "modified": "2023-05-13 08:36:27",
    "del": 0
  },
  {
    "cId": 10,
    "cName": "数学与计算机学院（软件学院）",
    "cre": "2023-05-13 08:36:40",
    "modified": "2023-05-13 08:36:43",
    "del": 0
  },
  {
    "cId": 11,
    "cName": "电子与信息工程学院",
    "cre": "2023-05-13 08:36:56",
    "modified": "2023-05-13 08:36:59",
    "del": 0
  },
  {
    "cId": 12,
    "cName": "化学与环境学院",
    "cre": "2023-05-13 08:37:07",
    "modified": "2023-05-13 08:37:10",
    "del": 0
  },
  {
    "cId": 13,
    "cName": "船舶与海运学院",
    "cre": "2023-05-13 08:37:23",
    "modified": "2023-05-13 08:37:26",
    "del": 0
  },
  {
    "cId": 14,
    "cName": "文学与新闻传播学院",
    "cre": "2023-05-13 08:37:38",
    "modified": "2023-05-13 08:37:42",
    "del": 0
  },
  {
    "cId": 15,
    "cName": "法政学院",
    "cre": "2023-05-13 08:37:52",
    "modified": "2023-05-13 08:37:55",
    "del": 0
  },
  {
    "cId": 16,
    "cName": "外国语学院",
    "cre": "2023-05-13 08:38:04",
    "modified": "2023-05-13 08:38:06",
    "del": 0
  },
  {
    "cId": 17,
    "cName": "中歌艺术学院",
    "cre": "2023-05-13 08:38:26",
    "modified": "2023-05-13 08:38:29",
    "del": 0
  },
  {
    "cId": 18,
    "cName": "体育与休闲学院",
    "cre": "2023-05-13 08:38:46",
    "modified": "2023-05-13 08:38:48",
    "del": 0
  },
  {
    "cId": 19,
    "cName": "继续教育学院",
    "cre": "2023-05-13 08:39:00",
    "modified": "2023-05-13 08:39:02",
    "del": 0
  }
])
onMounted(()=>{
  queryColleges().then(res=>{
    colleges.value = res.data.list
  })
})
const formRef = ref<FormInstance>();
const formData = ref({
  uname: '',
  unumber: '',
  ucid: undefined,
  uusername: '',
});

const data= [{
  value: '1',
  label: 'Beijing',
}, {
  value: '2',
  label: 'Shanghai',
}, {
  value: '3',
  label: 'Guangzhou',
}, {
  value: '4',
  label: 'Chengdu',
}, {
  value: '1',
  label: 'Beijing',
}, {
  value: '2',
  label: 'Shanghai',
}, {
  value: '3',
  label: 'Guangzhou',
}, {
  value: '4',
  label: 'Chengdu',
}, {
  value: '1',
  label: 'Beijing',
}, {
  value: '2',
  label: 'Shanghai',
}, {
  value: '3',
  label: 'Guangzhou',
}, {
  value: '4',
  label: 'Chengdu',
}]

const goToLogin = () => {
  router.push({ name: 'login' })
}
const onNextClick = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    emits('changeStep', 'forward', { ...formData.value });
  }
};
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
  width: 500px;
}

button {
  margin-right: 20px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
