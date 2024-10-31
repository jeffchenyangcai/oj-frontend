<template>
  <div id="manageQuestionView">
    <h2>题目管理</h2>

    <a-table
      :columns="columns"
      :data="list"
      :pagination="{
        showTotal: true,
        current: listParams.current,
        pageSize: listParams.pageSize,
        totalNum,
      }"
      @page-change="onPageChange"
    >
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)">修改</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const onPageChange = (page: number) => {
  listParams.current = page;
};

const router = useRouter();
const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    loadList();
  } else {
    message.error(res.message);
  }
};
const show = ref(true);

let listParams = reactive({
  current: 1,
  pageSize: 10,
});
const list = ref([]);
const totalNum = ref(0);
const loadList = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost({});
  if (res.code === 0) {
    list.value = res.data.records;
    totalNum.value = res.data.total;
  } else {
    message.error(res.message);
  }
};

onMounted(() => {
  loadList();
});

watchEffect(() => {
  loadList();
});

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "题目",
    dataIndex: "title",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "答案",
    dataIndex: "answer",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptNum",
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
  },
  {
    title: "创建者Id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>
