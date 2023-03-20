<template>
  <a-layout id="app-menu">
    <a-layout-sider theme="light" class="layout-sider">
      <a-menu
        theme="light"
        mode="inline"
        :default-selected-keys="[default_key]"
        :selected-keys="[current]"
        style="padding-bottom: 40px"
        @click="menuClick"
      >
        <a-menu-item v-for="item in belongs" :key="item.id">
          <span>{{ item.belong }}</span>
        </a-menu-item>
      </a-menu>
      <div class="belong-plus" @click="addPasswordBelong">
        <a-icon type="plus" />
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <a-row :gutter="16">
          <a-col :offset="4" :span="16" style="margin-top: 12px; margin-bottom: 16px">
            <a-input
              v-model="description"
              placeholder="请输入账号或者描述信息进行检索"
              style="text-align: center"
            />
          </a-col>
          <a-col :span="24" style="padding: 0 20px; margin-bottom: 75px">
            <a-list bordered :data-source="filterdPasswords">
              <a-list-item
                :key="index"
                slot="renderItem"
                slot-scope="item, index"
                style="padding-right: 0"
              >
                <a-row :gutter="12" style="width: 100%">
                  <a-col :span="20">
                    <div style="cursor: pointer">
                      <a-icon type="user" style="margin-right: 7px" />
                      <db-copy :content="item.account"></db-copy>
                    </div>
                    <div style="cursor: pointer">
                      <a-icon type="lock" style="margin-right: 7px" />
                      <db-copy :content="item.password"></db-copy>
                    </div>
                    <div v-if="item.website">
                      <a-icon type="global" style="margin-right: 7px" />
                      <db-copy :content="item.website"></db-copy>
                    </div>
                    <div>
                      <a-icon type="bulb" style="margin-right: 4px" />
                      {{ item.description }}
                    </div>
                    <div>
                      <a-icon type="calendar" style="margin-right: 4px" />
                      {{ item.time }}
                    </div>
                  </a-col>
                  <a-col :span="4">
                    <div style="text-align: right">
                      <a-button-group :size="'small'">
                        <a-button type="primary" title="编辑">
                          <a-icon type="edit" />
                        </a-button>
                        <a-button type="dashed" title="历史">
                          <a-icon type="cluster" />
                        </a-button>
                        <a-button type="danger" title="删除">
                          <a-icon type="rest" />
                        </a-button>
                      </a-button-group>
                    </div>
                  </a-col>
                </a-row>
              </a-list-item>
              <template #footer>
                <div>
                  <a-icon type="exclamation-circle" />
                  妥善管理自己的账号密码信息
                </div>
              </template>
            </a-list>
          </a-col>
        </a-row>
        <div
          style="height: 60px; position: fixed; bottom: 0; text-align: right; right: 25px"
        >
          <a-button
            type="dashed"
            shape="circle"
            :size="'large'"
            :icon="'plus'"
            style="background-color: transparent; border-color: #1890ff; color: #1890ff"
            @click="addPassword"
          >
            <template #icon>
              <a-icon type="plus-circle" />
            </template>
          </a-button>
        </div>
      </a-layout-content>
    </a-layout>
    <password-add
      :visible="passwordAddDrawer.open"
      @close="passwordAddDrawer.open = false"
      @success="passwordAddSuccess"
    ></password-add>
    <belong-add
      :visible="belongAddDrawer.open"
      @close="belongAddDrawer.open = false"
      @success="belongAddSuccess"
    ></belong-add>
  </a-layout>
</template>
<script>
import { ipcApiRoute } from "@/api/main";
import DbCopy from "@/components/DbCopy.vue";
import PasswordAdd from "./components/add.vue";
import BelongAdd from "./components/addBelong.vue";

export default {
  components: { DbCopy, PasswordAdd, BelongAdd },
  data() {
    return {
      belongs: [
        {
          id: 1,
          belong: "ERP系统",
          color: "",
        },
      ],
      passwords: [
        {
          password: "asfa12@!qaQQW",
          account: "admin",
          description: "ERP系统管理员账号密码",
          time: "2023-03-18 12:33:12",
          belong: "",
          website: "http://www.baidu.com",
          labels: "",
          sort: 1,
        },
        {
          password: "fasfas",
          account: "superadmin",
          description: "MES系统管理员账号密码",
          time: "2023-03-15 12:33:12",
          belong: "",
          labels: "",
          sort: 2,
        },
        {
          password: "asfa12@!qaQQW",
          account: "admin",
          description: "ERP系统管理员账号密码",
          time: "2023-03-18 12:33:12",
          belong: "",
          labels: "",
          sort: 1,
        },
        {
          password: "asfa12@!qaQQW",
          account: "admin",
          description: "ERP系统管理员账号密码",
          time: "2023-03-18 12:33:12",
          belong: "",
          labels: "",
          sort: 1,
        },
        {
          password: "asfa12@!qaQQW",
          account: "admin",
          description: "ERP系统管理员账号密码",
          time: "2023-03-18 12:33:12",
          belong: "",
          labels: "",
          sort: 1,
        },
        {
          password: "asfa12@!qaQQW",
          account: "admin",
          description: "ERP系统管理员账号密码",
          time: "2023-03-18 12:33:12",
          belong: "",
          labels: "",
          sort: 1,
        },
        {
          password: "asfa12@!qaQQW",
          account: "admin",
          description: "ERP系统管理员账号密码",
          time: "2023-03-18 12:33:12",
          belong: "",
          labels: "",
          sort: 1,
        },
        {
          password: "asfa12@!qaQQW",
          account: "admin",
          description: "ERP系统管理员账号密码",
          time: "2023-03-18 12:33:12",
          belong: "",
          labels: "",
          sort: 1,
        },
      ],
      description: "",
      default_key: 1,
      current: 1,
      passwordAddDrawer: {
        open: false,
      },
      belongAddDrawer: {
        open: false,
      },
    };
  },
  computed: {
    filterdPasswords() {
      console.log("fp");
      if (this.description && this.description.length) {
        console.log("filter");
        return this.passwords.filter((t) => {
          if (t.account) {
            if (t.account.toLowerCase().indexOf(this.description.toLowerCase()) != -1) {
              return true;
            }
            if (t.description) {
              if (t.account.toLowerCase().indexOf(this.description.toLowerCase()) != -1) {
                return true;
              }
            }
            return false;
          } else {
            if (t.description) {
              if (t.description) {
                if (
                  t.description.toLowerCase().indexOf(this.description.toLowerCase()) !=
                  -1
                ) {
                  return true;
                }
              }
            }
            return false;
          }
        });
      }
      return this.passwords;
    },
  },
  mounted() {
    this.getBelongs();
  },
  created() {},
  methods: {
    getBelongs() {
      const self = this;
      const params = {
        action: "allBelong",
      };
      this.$ipc.invoke(ipcApiRoute.passwordOperation, params).then((res) => {
        console.log("res:", res);
        if (res.result.length == 0) {
          return false;
        }
        // self.belongs = res.result;
        // 设置默认选中和获取密码信息
      });
    },
    dbOperation(ac) {
      const self = this;
      const params = {
        action: ac,
        info: {
          name: this.name,
          age: parseInt(this.age),
        },
        search_age: parseInt(this.search_age),
        update_name: this.update_name,
        update_age: parseInt(this.update_age),
        delete_name: this.delete_name,
      };
      if (ac == "add" && this.name.length == 0) {
        self.$message.error(`请填写数据`);
      }
      this.$ipc.invoke(ipcApiRoute.dbOperation, params).then((res) => {
        console.log("res:", res);
        if (ac == "get") {
          if (res.result.length == 0) {
            self.$message.error(`没有数据`);
            return;
          }
          self.userList = res.result;
        }
        if (res.all_list.length == 0) {
          self.all_list = ["空"];
          return;
        }
        self.all_list = res.all_list;
        self.$message.success(`success`);
      });
    },
    menuClick(e) {
      console.log(e.key);
      this.current = e.key;
    },
    addPassword() {
      // 加载添加密码弹窗页面
      // this.$ipc.invoke(ipcApiRoute.createWindow, {
      //   type: 'vue',
      //   content: '/#/password/add'
      // }).then(r => {
      //   console.log(r);
      // })
      this.passwordAddDrawer.open = true;
    },
    passwordAddSuccess() {
      this.passwordAddDrawer.open = false;
      this.$message.success(`添加成功`);
      // 添加查询密码逻辑
    },
    updatePassword(id) {
      // 加载添加密码弹窗页面
      this.$ipc
        .invoke(ipcApiRoute.createWindow, {
          type: "vue",
          content: "/#/password/update/" + id,
        })
        .then((r) => {
          console.log(r);
        });
    },
    addPasswordBelong() {
      // 加载添加密码弹窗页面
      // this.$ipc.invoke(ipcApiRoute.createWindow, {
      //   type: 'vue',
      //   content: '/#/password/add'
      // }).then(r => {
      //   console.log(r);
      // })
      this.belongAddDrawer.open = true;
    },
    belongAddSuccess() {
      this.belongAddDrawer.open = false;
      this.$message.success(`添加成功`);
      // 添加查询密码逻辑
    },
  },
};
</script>
<style lang="less" scoped>
#app-menu {
  height: 100%;
  text-align: left;
  .layout-sider {
    border-top: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    background-color: #fafafa;
    overflow: auto;
  }

  .belong-plus {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    text-align: center;
    border-top: 1px dashed rgba(41, 207, 116, 1);
    color: rgba(41, 207, 116, 1);
    font-weight: bold;
  }

  .belong-plus:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
