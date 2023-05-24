<template>
    <div class="container">
        <Breadcrumb :items="['场所信息', '公告编辑']" />
            <a-card class="general-card" title="更新场所公告">
            <mavon-editor class="mdEditor" @change="change" v-model="notice.markdown" />
            <div class="btn">
                <a-button @click="reset">{{$t('menu.announcement-penalty.reset')}}</a-button>
                <a-button @click="modify" type="primary">{{ $t('menu.announcement-penalty.modify') }}</a-button>
            </div>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import {updateNotice,selectNotice} from '@/network/module/announcement/index'
import { Message } from '@arco-design/web-vue';

const getNotice = () => {
    selectNotice(2).then(res => {
        notice.markdown = res.data.notice.nMarkdown
        notice.type = res.data.notice.nId
    })
}
onMounted(()=>{
    getNotice()
})

const reset = async()=>{
    const {code,data} = await selectNotice(2)
    if(code === 20000)  {
        Message.success('重置成功')
        notice.markdown = data.notice.nMarkdown
        notice.type = data.notice.nId
    } else {
        Message.error('重置失败，请重试！')
    }
}
const change = (value:string,render:string)=>{
    notice.markdown = value
    notice.content = render
    console.log(notice);
    
}
const notice: {
    type: number;
    markdown: string;
    content: string;
} = reactive({
    type:0,
    markdown:'',
    content:''
})
const modify = async()=>{
    console.log(notice);
    try {
        const { code, message } = await updateNotice(notice)
        if (code === 20000) {
            Message.success(message)
        } else {
            Message.error(message)
        }
    } catch (error) {
        Message.error(error as string)
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

.mdEditor {
    width: 90%;
    height: 500px;
    margin: 0px auto 20px;
    z-index: 0;
}

.btn {
    display: flex;
    justify-content: flex-end;
    margin: 40px 60px 20px;
    
    button {
        margin-left: 30px;
    }
}
</style>
