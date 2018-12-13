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
        <input type="file" ref="file" @change="chooseFileText=$event.target.file"/>
        <div class="upload-file" @click="updateFile">开始上传</div>
      </div>
      <div class="progress" v-if="progressbar.visibility">
        <div class="progressbar-bg"></div>
        <div class="progressbar" :style="{width:progressbar.width}"></div>
        <div style="position: absolute;left: 100%;margin-left: 1rem">{{progressbar.percentageText}}</div>
      </div>
      <div class="button" style="margin-top: 5rem;margin-right: 0rem" @click="startStep2">下一步</div>
    </div>
    <div class="step2" v-if="steps[1].active">
      <div class="video-form">
        <div style="margin-right: 2rem">视频格式: </div>
        <div v-for="(videoForm,index) in videoForms" style="margin-right: 2rem">
          <input type="radio" :id="index" :value="videoForm" v-model="videoFormPicked" style="margin: 0;padding: 0">
          <label style="margin: 0;padding: 0">{{videoForm}}</label>
        </div>
      </div>
      <div class="category-select">
        <div>所属菜单：</div>
        <select style="min-width: 5rem" @change="filterTagsByCategory" v-model="curCategoryName">
          <option v-for="category in categories">{{category.Name}}</option>
        </select>
      </div>
      <div class="tag-select">
        <div>所属标签：</div>
        <select style="min-width: 5rem" v-model="curTagName">
          <option v-for="tag in curtags">{{tag.Name}}</option>
        </select>
      </div>
      <div style="display: flex;align-items: center;margin-top: 5rem">
        <div class="button" @click="startStep1()">上一步</div>
        <div class="button" @click="startStep3()">下一步</div>
      </div>
    </div>
    <div class="step3" v-if="steps[2].active">
      <icon name="Tick" size="5" style="width: 5rem;height: 5rem;margin-top: 3rem"></icon>
      <div style="margin-top: 1rem">上传成功</div>
      <div class="button" style="margin-top: 5rem;margin-right: 0" @click="step3Button">确定</div>
    </div>
  </div>
</template>

<script>
    import Icon from "vue-svg-icon/Icon";
    export default {
        name: "vedioinstall",
      components: {Icon},
      data(){
          return{
            header:"",
            steps:[],
            isUploading:"",
            progressbar:{},
            uploadFileSucceed:"",
            chooseFileText:"",
            videoForms:[],
            videoFormPicked:"",
            categories:[],
            curtags:[],
            tags:[],
            curCategoryName:"",
            curTagName:"",
            readUpdateInfo:""          //上传文件后返回的信息，等第二步修改后上传
          }
      },
      created(){
          this.init();
      },
      methods:{
        init(){
          this.isUploading=false;
          this.uploadFileSucceed=false,
          this.chooseFileText="未上传任何文件";
          this.axios.get("http://192.168.1.178:8080/ccweb/api/categories/list").then((res)=>{
            this.categories=res.data;
            console.log(res.data);
            this.curCategoryName=this.categories[0].Name;
            this.axios.get("http://192.168.1.178:8080/ccweb/api/tags/list").then((res)=>{
              this.tags=res.data;
              console.log(res.data);
              this.filterTagsByCategory();
            }).catch((err)=>{
            });
          }).catch((err)=>{

          });
          this.header="视频安装";
          this.steps=[];
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
          this.progressbar={
            width: 0,
            visibility:true,
            percentageText:'0%'
          }
          this.videoForms=["360度视频","180度视频","平面2D","左右3D","上下3D"];

        },
        updateFile(){
          if(!this.isUploading){
            let file=this.$refs.file.files[0];
            if(file==undefined){
              alert("请选择文件！");
              return;
            }
            this.isUploading=true;
            this.progressbar.visibility=true;
            let formData=new FormData();
            formData.append('file',file);
            console.log(formData.get('file'));
            let config = {
              onUploadProgress: progressEvent => {
                var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
                this.progressbar.width=complete+'%';
                this.progressbar.percentageText=complete+'%';
              },
              headers:{'Content-Type':'multipart/form-data'}
            };

            this.axios.post("http://192.168.1.178:8080/ccweb/api/resources/fileupload", formData,config)
              .then((res)=>{
                this.isUploading=false;
                this.uploadFileSucceed=true;
                this.readUpdateInfo=res.data;
                console.log(res.data);
              }).catch((err)=>{

            });
          }

        },
        startStep1(){
          this.steps[0].active=true;
          this.steps[1].active=false;
        },
        startStep2(){
          if(!this.uploadFileSucceed){
            alert("文件还没有上传或上传成功！");
          }else if(this.uploadFileSucceed){
            this.steps[0].active=false;
            this.steps[1].active=true;
          }
        },
        filterTagsByCategory(){
          let curtags=[];
          for(let i=0;i<this.tags.length;i++){
            if(this.tags[i].Category.Name==this.curCategoryName){
              curtags.push(this.tags[i]);
            }
          }
          this.curtags=curtags;
          if(this.curtags.length!=0){
            this.curTagName=this.curtags[0].Name;
          }
        },
        startStep3(){
          if(this.videoFormPicked!=""){
            for(let i=0;i<this.categories.length;i++){
              if(this.categories[i].Name==this.curCategoryName){
                this.readUpdateInfo.Category=this.categories[i];
                break;
              }
            }
            for(let i=0;i<this.tags.length;i++){
              if(this.tags[i].Name==this.curTagName){
                this.readUpdateInfo.Tags=[this.tags[i]];
                console.log(this.tags[i]);
                break;
              }
            }
            console.log("videoFormPicked:"+this.videoFormPicked);
            for(let i=0;i<this.videoForms.length;i++){
              if(this.videoFormPicked==this.videoForms[i]){
                this.readUpdateInfo.FileType={Id:i+1};
                console.log(this.videoForms[i]);
                break;
              }
            }
            this.axios.post("http://192.168.1.178:8080/ccweb/api/resources/update",JSON.stringify(this.readUpdateInfo)).then((res)=>{
              this.steps[1].active=false;
              this.steps[2].active=true;
            }).catch((error)=>{

            });
          }else{
            alert("请选择视频格式");
          }
        },
        step3Button(){
          this.init();
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

  .progress{
    display: flex;
    margin-top: 2rem;
    width: 20rem;
    height: 10px;
    position: relative;
    align-items: center;
  }

  .progressbar-bg{
    position: absolute;
    width: 100%;
    height: 10px;
    left: 0;
    background-color: lightgrey;
  }
  .progressbar{
    position: absolute;
    left: 0;
    top: 0;
    width: 12rem;
    height: 10px;
    background-color: black;
    transition: .1s width linear;
  }

  .step2{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .video-form{
    margin-top: 2rem;
    display: flex;
    align-items: center;
  }

  .category-select{
    margin-top: 2rem;
    display: flex;
    align-items: center;
    width: 20rem;
  }

  .tag-select{
    margin-top: 2rem;
    display: flex;
    align-items: center;
    width: 20rem;
  }

  .button{
    color: black;
    border: 1px solid black;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    margin-right: 10rem;
    cursor: pointer;
  }
  .step3{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
