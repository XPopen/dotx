<template>
  <span>
    <span :id="randId()" v-text="content"></span>
    <a-icon type="copy" @click="copy($event)" style="margin-left: 3px"/>
  </span>
</template>

<script>
  export default {
    name: 'DbCopy',
    props: {
      content: {
        type: String,
        require: true,
        default: ''
      }
    },
    data() {
      return {
        id: undefined
      }
    },
    create() {
      
    },
    methods: {
      copy(e) {
        var inputEle = document.createElement("input");
        inputEle.value = this.content
        document.body.appendChild(inputEle);
        inputEle.select()
        let b = document.execCommand("Copy")
        document.body.removeChild(inputEle);
        if (b) {
          this.$message.success("复制成功");
        } else {
          this.$message.warning("复制失败，请手动复制")
        }
      },
      randId() {
        return `id${new Date().getTime() + '' + (Math.floor(Math.random() * 1000000) + Math.floor(Math.random() * 3000000))}`
      },
    }
  }
</script>

<style scoped>

</style>