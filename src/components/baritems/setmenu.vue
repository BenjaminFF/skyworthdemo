<template>
    <div class="setmenu-container">
      <div class="mTable">
        <div class="row-container">
          <div class="row1" style="background-color: #c1c1c1;color: white">{{tableThs[0]}}</div>
          <div class="row2" style="background-color: #c1c1c1;color: white">{{tableThs[1]}}</div>
          <div class="h-row3" style="background-color: #c1c1c1;color: white">{{tableThs[2]}}</div>
        </div>
        <div class="row-container" v-for="item in items">
          <div class="row1">{{item.menuName}}</div>
          <div class="row2">{{item.info}}</div>
          <div class="row3">
            <div class="row3-edit" @click="editDialog.visibility=true">编辑</div>
            <div class="row3-delete" @click="delDialog.visibility=true">删除</div>
          </div>
        </div>
      </div>
      <div class="edit-model" v-if="editDialog.visibility">
        <div class="edit-dialog">
          <icon name="delete" class="delete-icon" @click.native="editDialog.visibility=false"></icon>
          <div class="edit-dialog-header">{{editDialog.header}}</div>
          <div style="margin-left: 2rem;margin-top: 2rem">名字</div>
          <input style="margin-left: 2rem;padding: 0.2rem 0.2rem;width: 60%;"/>
          <div style="margin-left: 2rem;margin-top: 2rem">描述</div>
          <textarea style="margin-left: 2rem;width: 80%;height:5rem;resize: none;padding: 0.2rem 0.2rem"></textarea>
          <div style="width: 100%;display: flex;justify-content: space-evenly;margin-top: 7rem">
            <div style="padding: 1rem 2rem;background-color: white;cursor: pointer">取消</div>
            <div style="padding: 1rem 2rem;background-color: white;cursor: pointer">确定</div>
          </div>
        </div>
      </div>
      <div class="edit-model" v-if="delDialog.visibility">
        <div class="del-dialog">
          <icon name="delete" class="delete-icon" @click.native="delDialog.visibility=false"></icon>
          <div class="edit-dialog-header">{{delDialog.header}}</div>
          <div style="text-align: center;margin-top: 2rem">是否确定删除菜单和该菜单下的所有标签和文件？</div>
          <div style="width: 100%;display: flex;justify-content: space-evenly;margin-top: 7rem">
            <div style="padding: 1rem 2rem;background-color: white;cursor: pointer">取消</div>
            <div style="padding: 1rem 2rem;background-color: white;cursor: pointer">确定</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "setmenu",
      data(){
          return{
            tableThs:[],
            row:"",
            items:[],
            editDialog:{},
            delDialog:{}
          }
      },
      created(){
          this.init();
      },
      methods:{
        init(){
            this.tableThs=["菜单名","描述","操作"];
            this.editDialog={
              header:"编辑菜单",
              visibility:false
            };
            this.delDialog={
              header:"编辑菜单",
              visibility:false
            }
            this.fetchData();
        },
        fetchData(){
          //从服务器获取数据
          setTimeout(()=>{
            let items=[
              {menuName:"小学课程",info:"klsadjfsdlkjfsdk..."},
              {menuName:"小学课程",info:"klsadjfsdlkjfsdk..."},
              {menuName:"小学课程",info:"klsadjfsdlkjfsdk..."},
              {menuName:"小学课程",info:"klsadjfsdlkjfsdk..."},
              {menuName:"小学课程",info:"klsadjfsdlkjfsdk..."},
              {menuName:"小学课程",info:"klsadjfsdlkjfsdk..."},
            ]
            this.row=items.length;
            this.items=items;
          },50);
        }
      }
    }
</script>

<style scoped>
  .setmenu-container{
    width: 80%;
    height: 80%;
    position: relative;
  }
  .mTable{
    display: flex;
    flex-direction: column;
    width: 40rem;
    height: fit-content;
    border: 1px solid black;
    border-bottom: 0px;
    user-select: none;
  }
  .row-container{
    width: 100%;
    height: 2rem;
    display: flex;
    border-bottom: 1px solid black;
    font-size: 0.9rem;
  }
  .row1{
    flex: 1 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
  }
  .row2{
    flex: 1 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
  }
  .row3{
    flex: 1.2 0 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .h-row3{
    flex: 1.2 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .row3-edit{
    cursor: pointer;
  }
  .row3-edit:hover{
    color: dodgerblue;
  }
  .row3-delete{
    cursor: pointer;
  }

  .row3-delete:hover{
    cursor: pointer;
    color: dodgerblue;
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
  .del-dialog{
    width: 40rem;
    height: 20rem;
    background-color: #c3c3c3;
    display: flex;
    flex-direction: column;
    position: relative;
  }
</style>
