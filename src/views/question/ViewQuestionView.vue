<script setup lang="ts">
import { defineProps, onMounted, reactive, ref, withDefaults } from "vue";
import {
  type JudgeConfig,
  QuestionControllerService,
  QuestionSubmitControllerService,
  type UserVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdEditor.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), { id: "" });

interface QuestionVo {
  acceptNum?: number;
  content?: string;
  createTime?: string;
  favourNum?: number;
  id?: number;
  judgeConfig?: JudgeConfig;
  submitNum?: number;
  tags?: Array<string>;
  thumbNum?: number;
  title?: string;
  updateTime?: string;
  userId?: number;
  userVO?: UserVO;
}

const form = reactive({
  code: "",
  language: "Java",
  questionId: props.id,
});

const doSubmit = async () => {
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost(
    form as any
  );
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error(res.message as any);
  }
};
let questionVo = ref<QuestionVo>({});
const loadList = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    questionVo.value = res.data as any;
  } else {
    message.error(res.message as any);
  }
};

onMounted(() => {
  loadList();
});

const doChange = (code: string) => {
  form.code = code;
};
</script>

<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="questionVo">
          <a-tab-pane key="questionVo" title="题目">
            <a-card v-if="questionVo" :title="questionVo.title || ''">
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ questionVo?.judgeConfig?.timeLimit || "0" }}
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ questionVo?.judgeConfig?.memoryLimit || "0" }}
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ questionVo?.judgeConfig?.stackLimit || "0" }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="questionVo.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of questionVo.tags"
                    :key="index"
                    color="green"
                  >
                    {{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论">暂时无法查看评论</a-tab-pane>
          <a-tab-pane key="answer" title="答案">暂时无法查看答案</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item label="语言" style="min-width: 100px">
            <a-select v-model="form.language" style="min-width: 100px">
              <a-option>Java</a-option>
              <a-option>python</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>html</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handleChange="doChange"
        />
        <a-divider size="0" />
        <a-button
          type="primary"
          style="margin-top: 16px; min-width: 280px"
          @click="doSubmit"
          >提交
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<style>
#viewQuestionView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
