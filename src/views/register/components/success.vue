<template>
  <div class="success-wrap">
    <img src="@/assets/images/success.svg" alt="">
    <a-space :size="16">
      <div class="btn">
        <a-button @click="goToLogin" key="view" type="primary" long>
          返回登录
        </a-button>
      </div>
    </a-space>
    
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'

const router = useRouter()
const goToLogin = ()=>{
  router.push({name:'login'})
}
</script>

<style scoped lang="less">
  .success-wrap {
    text-align: center;
    width: 500px;
  }

  :deep(.arco-result) {
    padding-top: 0;
  }

  img {
    margin-top: -60px;
    height: 300px;
  }

  .btn {
    margin-top: 20px;
    width: 280px;
  }
</style>
