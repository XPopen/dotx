<template>
  <a-drawer
    :title="title"
    placement="right"
    :closable="false"
    :width="380"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
  >
    <div
      style="
        background-color: transparent;
        height: 100%;
        display: flex;
        flex-direction: column;
      "
    >
      <a-form :form="form">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="名称"
        >
          <a-input
            v-decorator="[
              'belong',
              { rules: [{ required: true, message: '请输入名称' }] },
            ]"
            placeholder="请输入名称"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="排序"
        >
          <a-input-number
            v-decorator="['sort']"
            :min="1"
            :max="99999999"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-space>
          <a-button type="primary" :size="'small'" icon="check" @click="submit">
            确定
          </a-button>
          <a-button type="dashed" :size="'small'" icon="close" @click="close">
            取消
          </a-button>
        </a-space>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { ipcApiRoute } from "@/api/main";
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const formTailLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18, offset: 6 },
};
export default {
  name: "BelongAdd",
  props: {
    visible: {
      type: Boolean,
      require: true,
      default: false,
    },
    title: {
      type: String,
      require: false,
      default: "新增分类",
    },
  },
  data() {
    return {
      form: this.$form.createForm(this, {
        belong: undefined,
        sort: 1,
      }),
      formItemLayout,
      formTailLayout,
    };
  },
  create() {},
  mounted() {},
  methods: {
    afterVisibleChange() {
      this.form = this.$form.createForm(this, {
        account: undefined,
        password: undefined,
        website: undefined,
        sort: 1,
        description: undefined,
      });
    },
    close() {
      this.$emit("close");
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let self = this;
          if (!values.sort) {
            values.sort = 1
          }
          const params = {
            action: "addBelong",
            info: { ...values, color: "#c0c0c0" },
          };
          this.$ipc.invoke(ipcApiRoute.passwordOperation, params).then(() => {
            self.$emit("success");
          });
        }
      });
    },
  },
};
</script>
