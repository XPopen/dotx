<template>
  <div>
    <h1>welcome you!</h1>
  </div>
</template>
<script>
import { ipcApiRoute } from '@/api/main'

export default {
  data() {
    return {
      
    };
  },
  mounted () {
   
    this.getAllTestData();
  },
  created () {
    
  },
  methods: {
    getAllTestData () {
      const self = this;
      const params = {
        action: 'all',
      }
      this.$ipc.invoke(ipcApiRoute.dbOperation, params).then(res => {
        console.log('res:', res);
        if (res.all_list.length == 0) {
          return false;
        }
        self.all_list = res.all_list;
      }) 
    },
    dbOperation (ac) {
      const self = this;
      const params = {
        action: ac,
        info: {
          name: this.name,
          age: parseInt(this.age)
        },
        search_age: parseInt(this.search_age),
        update_name: this.update_name,
        update_age: parseInt(this.update_age),
        delete_name: this.delete_name,
      }
      if (ac == 'add' && this.name.length == 0) {
        self.$message.error(`请填写数据`);
      }
      this.$ipc.invoke(ipcApiRoute.dbOperation, params).then(res => {
        console.log('res:', res);
        if (ac == 'get') {
          if (res.result.length == 0) {
            self.$message.error(`没有数据`);
            return;
          }
          self.userList = res.result;
        }
        if (res.all_list.length == 0) {
          self.all_list = ['空'];
          return;
        }
        self.all_list = res.all_list;
        self.$message.success(`success`);
      }) 
    },
  }
};
</script>
<style lang="less" scoped>

</style>
