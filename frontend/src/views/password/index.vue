<template>
  <a-layout id="app-menu">
    <a-layout-sider theme="light" class="layout-sider">
      <div style="max-height: 100%; height: 100%">
        <div style="max-height: calc(100% - 40px); overflow: auto">
          <a-menu
            theme="light"
            mode="inline"
            :default-selected-keys="[default_key]"
            :selected-keys="[current]"
            @click="menuClick"
          >
            <a-menu-item v-for="item in belongs" :key="item.id">
              <span>{{ item.belong }}</span>
              <a-icon
                type="delete"
                title="删除"
                style="position: absolute; right: 0; top: 13px; color: #ff7875"
                @click="deleteBelong(item.id)"
              />
            </a-menu-item>
          </a-menu>
        </div>
        <div class="belong-plus" @click="addPasswordBelong">
          <a-icon type="plus" />
        </div>
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
                      {{ item.time && timestampConvert2Date(item.time) }}
                    </div>
                  </a-col>
                  <a-col :span="4">
                    <div style="text-align: right">
                      <a-button-group :size="'small'">
                        <a-button
                          type="primary"
                          title="编辑"
                          @click="updatePassword(item)"
                        >
                          <a-icon type="edit" />
                        </a-button>
                        <a-button type="dashed" title="历史">
                          <a-icon type="cluster" />
                        </a-button>
                        <a-button
                          type="danger"
                          title="删除"
                          @click="deletePassword(item.id)"
                        >
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
                  请妥善管理自己的账号密码信息
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
      :belong="passwordAddDrawer.belong"
      @close="passwordAddDrawer.open = false"
      @success="passwordAddSuccess"
    ></password-add>
    <belong-add
      :visible="belongAddDrawer.open"
      @close="belongAddDrawer.open = false"
      @success="belongAddSuccess"
    ></belong-add>
    <password-update
      :visible="passwordUpdateDrawer.open"
      :password="passwordUpdateDrawer.password"
      @close="passwordUpdateDrawer.open = false"
      @success="passwordUpdateSuccess"
    ></password-update>
  </a-layout>
</template>
<script>
import { ipcApiRoute } from "@/api/main";
import { timestampToDate } from "@/utils/util";
import DbCopy from "@/components/DbCopy.vue";
import PasswordAdd from "./components/add.vue";
import PasswordUpdate from "./components/update.vue";
import BelongAdd from "./components/addBelong.vue";

export default {
  components: { DbCopy, PasswordAdd, BelongAdd, PasswordUpdate },
  data() {
    return {
      belongs: [],
      passwords: [],
      description: "",
      default_key: 1,
      current: 1,
      passwordAddDrawer: {
        open: false,
        belong: undefined,
      },
      passwordUpdateDrawer: {
        open: false,
        password: undefined,
      },
      belongAddDrawer: {
        open: false,
      },
    };
  },
  computed: {
    filterdPasswords() {
      if (this.description && this.description.length) {
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
        self.belongs = res.result;
        if (res.result.length == 0) {
          self.belongs = [];
          self.passwords = [];
          self.default_key = null;
          self.current = null;
          return false;
        }
        if (!this.current) {
          self.current = res.result[0].id;
          self.default_key = res.result[0].id;
        }
        self.getPasswords(); // 设置默认选中和获取密码信息
      });
    },
    getPasswords() {
      const self = this;
      const params = {
        action: "all",
        search_belong: this.current + "",
      };
      this.$ipc.invoke(ipcApiRoute.passwordOperation, params).then((res) => {
        self.passwords = res.result;
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
      this.current = e.key;
      this.getPasswords();
    },
    addPassword() {
      // 加载添加密码弹窗页面
      // this.$ipc.invoke(ipcApiRoute.createWindow, {
      //   type: 'vue',
      //   content: '/#/password/add'
      // }).then(r => {
      //   console.log(r);
      // })
      if (!this.current) {
        this.$message.warn(`请先选择分类！`);
        return;
      }
      this.passwordAddDrawer.belong = this.current + "";
      this.passwordAddDrawer.open = true;
    },
    passwordAddSuccess() {
      this.passwordAddDrawer.open = false;
      this.$message.success(`添加成功`);
      // 添加查询密码逻辑
      this.getPasswords();
    },
    updatePassword(password) {
      this.passwordUpdateDrawer.password = password;
      this.passwordUpdateDrawer.open = true;
    },
    passwordUpdateSuccess() {
      this.passwordUpdateDrawer.open = false;
      this.$message.success(`修改成功`);
      // 添加查询密码逻辑
      this.getPasswords();
    },
    deletePassword(id) {
      const self = this;
      this.$ipc
        .invoke(ipcApiRoute.systemConfirm, {
          type: "warning",
          title: "提示",
          message: "是否确认删除这条密码信息？",
          detail: "",
        })
        .then((r) => {
          const params = {
            action: "del",
            delete_id: id + "",
          };
          self.$ipc.invoke(ipcApiRoute.passwordOperation, params).then(() => {
            self.$message.success(`删除成功`);
            // 添加查询密码逻辑
            self.getPasswords();
          });
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
      this.getBelongs();
    },
    deleteBelong(id) {
      const self = this;
      this.$ipc
        .invoke(ipcApiRoute.systemConfirm, {
          type: "warning",
          title: "提示",
          message: "是否确认删除这条分类信息？",
          detail: "删除会将关联密码一并删除",
        })
        .then((r) => {
          if (r) {
            const params = {
              action: "delBelong",
              delete_id: id + "",
            };
            self.$ipc.invoke(ipcApiRoute.passwordOperation, params).then(() => {
              self.$message.success(`删除成功`);
              // 添加查询密码逻辑
              self.getBelongs();
            });
          }
        });
    },
    timestampConvert2Date(timestamp) {
      return timestampToDate(timestamp);
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
    height: 40px;
    line-height: 40px;
    margin-top: auto;
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
