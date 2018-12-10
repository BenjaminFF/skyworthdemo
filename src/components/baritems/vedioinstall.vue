<template>
  <div>
    <div class="header">{{header}}</div>
    <div class="nav-container">
      <div class="nav-item" v-for="step in steps">
        <div class="nav-item-id" :class="{'nav-item-active':step.active}">
          {{step.id}}
        </div>
        <div class="nav-item-title">
          {{step.title}}
        </div>
        <div class="nav-item-line" v-if="step.hasLine">
        </div>
      </div>
    </div>
    <div class="step1" v-if="steps[0].active">
      <div class="choose-file">选择视频文件:
        <input type="file"/>
        <div class="upload-file">开始上传</div>
      </div>
      <div class="upload-file" style="margin-top: 5rem">下一步</div>
    </div>
    <div class="step2" v-if="steps[1].active"></div>
    <div class="step3" v-if="steps[2].active"></div>
  </div>
</template>

<script>
    export default {
        name: "vedioinstall",
      data(){
          return{
            header:"",
            steps:[]
          }
      },
      created(){
          this.init();
      },
      methods:{
        init(){
          this.header="视频安装";
          let step1={
            id:1,
            title:"上传文件",
            hasLine:true,
            active:false
          }
          let step2={
            id:2,
            title:"补充信息",
            hasLine:true,
            active:false
          }
          let step3={
            id:3,
            title:"完成",
            hasLine:false,
            active:false
          }
          step1.active=true;
          this.steps.push(step1);
          this.steps.push(step2);
          this.steps.push(step3);
        }
      }
    }
</script>

<style scoped>
  .header{
    font-size: 1.2rem;
    margin-left: 2rem;
    width: 90%;
    padding-bottom: 1rem;
    padding-top: 1rem;
    border-bottom: 1px solid black;
  }
  .nav-container{
    display: flex;
    width: 100%;
    height: fit-content;
    justify-content: center;
    margin-top: 3rem;
  }
  .nav-item{
    display: flex;
    width: fit-content;
    height: fit-content;
    align-items: center;
  }
  .nav-item-id{
    width: 2rem;
    height: 2rem;
    border: 1px solid gray;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
  }
  .nav-item-line{
    width: 5rem;
    height: 1px;
    background-color: gray;
    margin-left: 5px;
    margin-right: 5px;
  }
  .nav-item-active{
    background-color: gray;
    color: white;
  }
  .step1{
    width: 100%;
    height: fit-content;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 5rem;
  }
  .step1 .choose-file{
    display: flex;
    align-items: center;
  }
  .step1 .upload-file{
    font-size: 0.8rem;
    border: 1px solid black;
    padding: 5px 10px;
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
  }
</style>
