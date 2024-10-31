<template>
  <div id="questionsView">
    <a-form :model="listParams" layout="inline">
      <a-form-item field="title" label="名称">
        <a-input
          v-model="listParams.title"
          placeholder="请输入题目名称"
          style="min-width: 240px"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          v-model="listParams.tags"
          placeholder="按回车生成单个标签"
          style="min-width: 240px"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="serchQuestion">搜索</a-button>
      </a-form-item>
      <a-divider size="0" />
    </a-form>
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
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${
            record.submitNum ? record.acceptedNum / record.submitNum : "0"
          }% (${record.acceptedNum} / ${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)"
            >练习
          </a-button>
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
import moment from "moment";

const onPageChange = (page: number) => {
  listParams.current = page;
};

const router = useRouter();
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

const show = ref(true);

let listParams = reactive({
  title: "",
  tags: [],
  current: 1,
  pageSize: 10,
});

const list = ref([]);
const totalNum = ref(0);
const loadList = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    listParams
  );
  if (res.code === 0) {
    list.value = res.data.records;
    totalNum.value = res.data.total;
  } else {
    message.error(res.message);
  }
};

const serchQuestion = () => {
  listParams.current = 1;
  loadList();
};

onMounted(() => {
  loadList();
});

watchEffect(() => {
  loadList();
});

const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
