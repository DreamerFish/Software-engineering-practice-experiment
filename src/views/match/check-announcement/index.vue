<template>
    <div class="container">
        <Breadcrumb :items="['体育馆公告', '馆内公告']" />
        <a-card class="general-card" title="馆内公告查看">
            <mavon-editor class="mdEditor" @change="change" :subfield="false" defaultOpen="preview" :toolbarsFlag="false"
                v-model="notice.markdown" />
            
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import { updateNotice, selectNotice } from '@/network/module/announcement/index'
import { Message } from '@arco-design/web-vue';

const getNotice = () => {
    selectNotice(3).then(res => {
        notice.markdown = res.data.notice.nMarkdown
        notice.type = res.data.notice.nId
    })
}
onMounted(() => {
    getNotice()
})

const change = (value: string, render: string) => {
    notice.markdown = value
    notice.content = render
    console.log(notice);

}
const notice: {
    type: number;
    markdown: string;
    content: string;
} = reactive({
    type: 0,
    markdown: '',
    content: ''
})
const modify = async () => {
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
