<template>
  <div id="app-base-jobs">
    <div class="one-block-1">
      <span>
        1. 任务/并发任务
      </span>
    </div>  
    <div class="one-block-2">
      <a-space>
        <a-button @click="runJob(1)">执行任务1</a-button>
        进度：{{ progress1 }}
      </a-space>
      <p></p>
      <a-space>
        <a-button @click="runJob(2)">执行任务2</a-button>
        进度：{{ progress2 }}
      </a-space>            
    </div>        
  </div>
</template>
<script>
import { ipcApiRoute } from '@/api/main'
export default {
  data() {
    return {
      progress1: 0,
      progress2: 0,
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      // 避免重复监听，或者将 on 功能写到一个统一的地方，只加载一次
      this.$ipc.removeAllListeners(ipcApiRoute.timerJobProgress);

      // 监听任务进度
      this.$ipc.on(ipcApiRoute.timerJobProgress, (event, result) => {
        console.log('[ipcRenderer] [someJob] result:', result);

        switch (result.jobId) {
          case 1:
            this.progress1 = result.number;
            break;
          case 2:
            this.progress2 = result.number;
            break;
        }
      })
    },
    runJob(jobId) {
      let params = {
        id: jobId,
        type: 'timer'
      }
      this.$ipc.send(ipcApiRoute.someJob, params)
    },
  }
}
</script>
<style lang="less" scoped>
#app-base-jobs {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
  }
  .one-block-2 {
    padding-top: 10px;
  }
}
</style>
