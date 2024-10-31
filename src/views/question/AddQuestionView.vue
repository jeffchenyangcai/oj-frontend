<template>
  <div id="addQuestionView">
    <h2>创建题目</h2>
    <a-form :model="form" @submit="handleSubmit" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handleChange="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor :value="form.answer" :handleChange="onAnswerChange" />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical">
          <a-form-item
            field="judgeConfig.timeLimit"
            label="时间限制"
            style="min-width: 480px"
          >
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item
            field="judgeConfig.stackLimit"
            label="堆栈限制"
            style="min-width: 480px"
          >
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item
            field="judgeConfig.memoryLimit"
            label="空间限制"
            style="min-width: 480px"
          >
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入空间限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :field="'测试用例  ${index}'"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 480px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例-${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入测试用例输入"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].value`"
              :label="`输出用例-${index}`"
              :key="index"
            >
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入测试用例输出"
              />
            </a-form-item>
            <a-button status="danger" @click="handleDelete(index)"
              >删除测试用例
            </a-button>
          </a-space>
        </a-form-item>
      </a-form-item>
      <a-form-item>
        <div>
          <a-button type="outline" status="success" @click="handleAdd"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="doSubmit()"
          >创建题目
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import { useRoute } from "vue-router";
import message from "@arco-design/web-vue/es/message";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";

const route = useRoute();
const updatePage = route.path.includes("update");

const onAnswerChange = (val: string) => {
  form.value.answer = val;
};

const onContentChange = (val: string) => {
  form.value.content = val;
};

const doSubmit = async () => {
  console.log(form.value);
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) message.success("更新成功");
    else message.error("更新失败");
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) message.success("添加成功");
    else message.error("添加失败，" + res.message);
  }
};

let form = ref({
  title: "A + B",
  tags: ["栈", "简单"],
  answer: "暴力破解",
  content: "题目内容",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "1 2",
      output: "3 4",
    },
  ],
});

const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "1 2",
          output: "3 4",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as string);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as string);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const handleAdd = () => {
  form.value.judgeCase?.push({
    input: "",
    output: "",
  });
};
const handleDelete = (index: number) => {
  form.value.judgeCase?.splice(index, 1);
};
</script>

<style scoped>
#addQuestionView {
}
</style>
