<template>
  <div class="container">
    <div class="header">{{header}}</div>
    <div class="nav">
      <div v-for="item in navItems" class="navItem" @click="chooseItem(item)"
           :class="{'navItem-active':item.selected}">{{item.title}}</div>
    </div>
    <div class="addButton" @click="openAddDialog">{{addButtonText}}</div>
    <component v-bind:is="curItem.comp" class="comp-container" ref="curComp"></component>
    <div class="edit-model" v-if="addDialog.visibility">
      <div class="edit-dialog">
        <icon name="delete" class="delete-icon" @click.native="addDialog.visibility=false"></icon>
        <div class="edit-dialog-header">{{addDialog.header}}</div>
        <div style="margin-left: 2rem;margin-top: 2rem">名字</div>
        <input style="margin-left: 2rem;padding: 0.2rem 0.2rem;width: 60%;" v-model="addDialog.Name"/>
        <div style="margin-left: 2rem;margin-top: 2rem">描述</div>
        <textarea style="margin-left: 2rem;width: 80%;height:5rem;resize: none;padding: 0.2rem 0.2rem" v-model="addDialog.Description"></textarea>
        <div style="width: 100%;display: flex;justify-content: space-evenly;margin-top: 7rem">
          <div style="padding: 1rem 2rem;background-color: white;cursor: pointer" @click="addDialog.visibility=false">取消</div>
          <div style="padding: 1rem 2rem;background-color: white;cursor: pointer" @click="addItemToServer">确定</div>
        </div>
      </div>
    </div>
    <div class="add-flag-model" v-if="addFlagDialog.visibility">
      <div class="edit-dialog">
        <icon name="delete" class="delete-icon" @click.native="addFlagDialog.visibility=false"></icon>
        <div class="edit-dialog-header">{{addFlagDialog.header}}</div>
        <div style="margin-left: 2rem;margin-top: 2rem">标签名</div>
        <input style="margin-left: 2rem;padding: 0.2rem 0.2rem;width: 60%;" v-model="addFlagDialog.Name"/>
        <div style="margin-left: 2rem;margin-top: 2rem">菜单名</div>
        <select style="width: 80%;margin-left: 2rem" v-model="addFlagDialog.curCategoryName">
          <option v-for="category in categorys">{{category.Name}}</option>
        </select>
        <div style="width: 100%;display: flex;justify-content: space-evenly;margin-top: 7rem">
          <div style="padding: 1rem 2rem;background-color: white;cursor: pointer" @click="addFlagDialog.visibility=false">取消</div>
          <div style="padding: 1rem 2rem;background-color: white;cursor: pointer" @click="addFlagToServer">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Setflag from "./setflag";
    import Setmenu from "./setmenu";
    export default {
        name: "setmenuandflag",
      components: {Setmenu, Setflag},
      data(){
          return{
            header:"",
            navItems:[],
            addButtonText:"",
            curItem:[],
            addDialog:{},
            addFlagDialog:{},
            categorys:[]
          }
      },
      created(){
         this.init();
      },
      methods:{
          init(){
            this.header="设置菜单和标签";
            this.addButtonText="新增";
            this.navItems=[
              {title:"菜单管理",selected:false,comp:Setmenu},
              {title:"标签管理",selected:false,comp:Setflag}
            ]
            this.curItem=this.navItems[0];
            this.curItem.selected=true;
            this.addDialog={
              header:"添加菜单",
              visibility:false,
              Name:"",
              Description:"",
              isAdding:false
            }
            this.addFlagDialog={
              header:"添加标签",
              visibility:false,
              Name:"",
              isAdding:false,
              curCategoryName:"",
              isAdding:false
            }
          },
        openAddDialog(){
            if(this.curItem.title=="菜单管理"){
              this.addDialog.visibility=true;
            }else {
              this.axios.get("http://192.168.1.178:8080/ccweb/api/categories/list").then((res)=>{
                this.categorys=res.data;
                this.addFlagDialog.curCategoryName=this.categorys[0].Name;
                this.addFlagDialog.visibility=true;
              }).catch((err)=>{

              });

            }
        },
          chooseItem(item){
            for(let i=0;i<this.navItems.length;i++){
              this.navItems[i].selected=false;
            }
            item.selected=true;
            this.curItem=item;
          },
        addItemToServer(){
              if(!this.addDialog.isAdding){
                this.addDialog.isAdding=true;
                this.axios.post("http://192.168.1.178:8080/ccweb/api/categories/create",{
                  Id:0,
                  Description: this.addDialog.Description,
                  Name:this.addDialog.Name,
                  Tags:null,
                  Resources:null
                }).then((res)=>{
                  this.addDialog.Name="";
                  this.addDialog.Description="";
                  this.addDialog.isAdding=false;
                  this.addDialog.visibility=false;
                  this.$refs.curComp.fetchData();
                }).catch((error)=>{
                });
              }
        },
        addFlagToServer(){
            if(!this.addFlagDialog.isAdding){
              this.addFlagDialog.isAdding=true;
              let curCategory={};
              for(let i=0;i<this.categorys.length;i++){
                if(this.categorys[i].Name==this.addFlagDialog.curCategoryName){
                  curCategory=this.categorys[i];
                  break;
                }
              }
              console.log(curCategory);
              this.axios.post("http://192.168.1.178:8080/ccweb/api/tags/create",{
                Id:0,
                Description: "",
                Category:curCategory,
                Name:this.addFlagDialog.Name,
                Resources:null
              }).then((res)=>{
                this.addFlagDialog.Name="";
                this.addFlagDialog.isAdding=false;
                this.addFlagDialog.visibility=false;
                this.$refs.curComp.fetchData();
              }).catch((error)=>{
              });
            }
        },
      }
    }
</script>

<style scoped>
  .container{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header{
    font-size: 1.2rem;
    margin-left: 2rem;
    width: 90%;
    padding-bottom: 1rem;
    padding-top: 1rem;
    border-bottom: 1px solid black;
  }
  .nav{
    display: flex;
    margin-left: 2rem;
    margin-top: 2rem;
  }
  .navItem{
    width: fit-content;
    height: fit-content;
    background-color: lightgrey;
    padding: 0.5rem 0.8rem;
    font-size: 1rem;
    margin-right: 1rem;
    cursor: pointer;
  }
  .navItem:hover{
    background-color: gray;
  }

  .navItem-active{
    background-color: gray;
  }

  .addButton{
    margin-left: 2rem;
    margin-top: 2rem;
    border: 1px solid black;
    width: fit-content;
    height: fit-content;
    padding: 0.3rem 1.2rem;
    border-radius: 5px;
    cursor: pointer;
  }
  .comp-container{
    margin-top: 2rem;
    margin-left: 2rem;
    width: fit-content;
    height: fit-content;
  }
  .edit-model{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(183, 183, 183, 0.31);
  }
  .add-flag-model{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(183, 183, 183, 0.31);
  }
  .edit-dialog{
    width: 50rem;
    height: 30rem;
    background-color: #c3c3c3;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .edit-dialog-header{
    font-size: 1rem;
    margin-left: 2rem;
    width: 90%;
    padding-bottom: 1rem;
    padding-top: 1rem;
    border-bottom: 1px solid black;
  }
  .delete-icon{
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    color: white;
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
  }
</style>
