<template>
  <div class="container">
    <div class="header">{{header}}</div>
    <div class="nav">
      <div v-for="item in navItems" class="navItem" @click="chooseItem(item)"
           :class="{'navItem-active':item.selected}">{{item.title}}</div>
    </div>
    <div class="vedio-list" v-if="navItems[0].selected">
      <div class="mTable">
        <div class="row-container">
          <div class="row1" style="background-color: #c1c1c1;color: white">{{tableThs[0]}}</div>
          <div class="row2" style="background-color: #c1c1c1;color: white">{{tableThs[1]}}</div>
          <div class="row3" style="background-color: #c1c1c1;color: white">{{tableThs[2]}}</div>
          <div class="row4" style="background-color: #c1c1c1;color: white">{{tableThs[3]}}</div>
          <div class="row5" style="background-color: #c1c1c1;color: white">{{tableThs[4]}}</div>
          <div class="row6" style="background-color: #c1c1c1;color: white">{{tableThs[5]}}</div>
          <div class="row7" style="background-color: #c1c1c1;color: white">{{tableThs[6]}}</div>
        </div>
        <div class="row-container" v-for="item in items">
          <div class="row1">{{item.Name.length<25?item.Name:item.Name.substring(0,25)+"..."}}</div>
          <div class="row2">{{item.Category.Name}}</div>
          <div class="row3">{{item.tagsName}}</div>
          <div class="row4">{{getSizeStrByByte(item.Size)}}</div>
          <div class="row5">{{item.FileType.Name}}</div>
          <div class="row6">{{item.CreatedTime}}</div>
          <div class="row7">
            <div @click="openDelDialog(item.Id)" style="cursor: pointer">删除</div>
          </div>
        </div>
      </div>
      <div class="pageTurn" v-if="pageTurn.visibility">
        <icon name="down" class="pageTurn-left" :class="{turnIconActive:pageTurn.curPage!=1}" @click.native="pageTurnLeft"></icon>
        <div style="margin-left: 10px;margin-right: 10px">{{pageTurn.curPage+'/'+pageTurn.totalPage}}</div>
        <icon name="down" class="pageTurn-right" :class="{turnIconActive:pageTurn.curPage!=pageTurn.totalPage}" @click.native="pageTurnRight"></icon>
      </div>
    </div>
    <div class="edit-model" v-if="delDialog.visibility">
      <div class="del-dialog">
        <icon name="delete" class="delete-icon" @click.native="delDialog.visibility=false"></icon>
        <div class="edit-dialog-header">{{delDialog.header}}</div>
        <div style="text-align: center;margin-top: 2rem">是否确定删除菜单和该菜单下的所有标签和文件？</div>
        <div style="width: 100%;display: flex;justify-content: space-evenly;margin-top: 7rem">
          <div style="padding: 1rem 2rem;background-color: white;cursor: pointer" @click="delDialog.visibility=false">取消</div>
          <div style="padding: 1rem 2rem;background-color: white;cursor: pointer" @click="delVideo(curVideoItemId)">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Icon from "vue-svg-icon/Icon";
    export default {
        name: "installed",
      components: {Icon},
      data(){
          return{
            header:"",
            navItems:[],
            items:[],
            tableThs:[],
            row:"",
            videoCount:"",
            pageTurn:{},
            delDialog:{},
            curVideoItemId:""
          }
      },
      created(){
        this.init();
      },
      methods:{
        init(){
          this.header="已安装";
          this.addButtonText="新增";
          this.navItems=[
            {title:"视频列表",selected:false},
            {title:"应用列表",selected:false},
          ]
          this.curItem=this.navItems[0];
          this.curItem.selected=true;

          this.delDialog={
            header:"编辑菜单",
            visibility:false,
            isDeleting:false
          }

          this.tableThs=["文件名字","所属菜单","所属标签","大小","格式","上传时间","操作"];
          this.axios.get(this.getFullPath('/ccweb/api/resources/count')).then((res)=>{
            this.videoCount=res.data;
            let totalPage=parseInt(this.videoCount/5);
            if(this.videoCount%5!=0){
              totalPage+=1;
            }
            this.pageTurn={
              curPage:1,
              totalPage:totalPage,
              visibility:false
            }
            let relativePath="";
            if(this.videoCount<5){
              relativePath='/ccweb/api/resources/list?page=1&numsperpage='+this.videoCount;
            }else {
              relativePath='/ccweb/api/resources/list?page=1&numsperpage=5';
            }
            this.axios.get(this.getFullPath(relativePath))
              .then((res)=>{
                for(let i=0;i<res.data.length;i++){
                  let tagsName="";
                  for(let j=0;j<res.data[i].Tags.length;j++){
                    tagsName+=res.data[i].Tags[j].Name+" ";
                  }
                  res.data[i].tagsName=tagsName;
                }
                this.items=res.data;
                console.log(res.data);
                this.pageTurn.visibility=true;
              });
          })
        },
        chooseItem(item){
          for(let i=0;i<this.navItems.length;i++){
            this.navItems[i].selected=false;
          }
          item.selected=true;
        },
        delVideo(Id){
          this.axios.post(this.getFullPath('/ccweb/api/resources/delete'),{
            Id:Id
          })
            .then((res)=>{
              this.axios.get(this.getFullPath('/ccweb/api/resources/count')).then((res)=>{
                this.videoCount=res.data;
                let totalPage=parseInt(this.videoCount/5);
                if(this.videoCount%5!=0){
                  totalPage+=1;
                }
                let relativePath="";
                this.pageTurn.totalPage=totalPage;
                if(this.pageTurn.curPage>this.pageTurn.totalPage){          //总页减1可能会影响到当前页
                  this.pageTurn.curPage-=1;
                }

                if(this.videoCount<5){
                  relativePath="/ccweb/api/resources/list?page="+this.pageTurn.curPage+"&numsperpage="+this.videoCount;
                }
                else if(this.pageTurn.curPage==this.pageTurn.totalPage){           //最后一页可能只剩下不到5个
                  let leftCount=this.videoCount%5;
                  relativePath="/ccweb/api/resources/list?page="+this.pageTurn.curPage+"&numsperpage="+leftCount;
                }else {
                  relativePath="/ccweb/api/resources/list?page="+this.pageTurn.curPage+"&numsperpage=5";
                }
                this.axios.get(this.getFullPath(relativePath))
                  .then((res)=>{
                    for(let i=0;i<res.data.length;i++){
                      let tagsName="";
                      for(let j=0;j<res.data[i].Tags.length;j++){
                        tagsName+=res.data[i].Tags[j].Name+" ";
                      }
                      res.data[i].tagsName=tagsName;
                    }
                    this.items=res.data;
                    this.delDialog.visibility=false;
                  });
              })
            });
        },
        pageTurnLeft(){
          if(this.pageTurn.curPage==1){
            return;
          }else {
            this.pageTurn.curPage-=1;
            let relativePath="/ccweb/api/resources/list?page="+this.pageTurn.curPage+"&numsperpage=5";
            this.axios.get(this.getFullPath(relativePath))
              .then((res)=>{
                for(let i=0;i<res.data.length;i++){
                  let tagsName="";
                  for(let j=0;j<res.data[i].Tags.length;j++){
                    tagsName+=res.data[i].Tags[j].Name+" ";
                  }
                  res.data[i].tagsName=tagsName;
                }
                this.items=res.data;
              });
          }
        },
        pageTurnRight(){
          if(this.pageTurn.curPage==this.pageTurn.totalPage){
            return;
          }else {
            this.pageTurn.curPage+=1;
            this.items=[];
            let relativePath="";
            if(this.pageTurn.curPage!=this.pageTurn.totalPage){
              console.log("case1");
              relativePath="/ccweb/api/resources/list?page="+this.pageTurn.curPage+"&numsperpage=5";
              console.log(relativePath);
            }else {
              console.log("case2");
              let leftCount=this.videoCount%5;
              relativePath="/ccweb/api/resources/list?page="+this.pageTurn.curPage+"&numsperpage="+leftCount;
            }
            this.axios.get(this.getFullPath(relativePath))
              .then((res)=>{
                console.log(res.data);
                for(let i=0;i<res.data.length;i++){
                  let tagsName="";
                  for(let j=0;j<res.data[i].Tags.length;j++){
                    tagsName+=res.data[i].Tags[j].Name+" ";
                  }
                  res.data[i].tagsName=tagsName;
                }
                this.items=res.data;
              });
          }
        },
        openDelDialog(Id){
          this.delDialog.visibility=true;
          this.curVideoItemId=Id;
        }
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

  .vedio-list{
    width: fit-content;
  }

  .mTable{
    display: flex;
    flex-direction: column;
    width: 70rem;
    height: fit-content;
    border: 1px solid black;
    border-bottom: 0px;
    user-select: none;
    margin-left: 2rem;
    margin-top: 2rem;
  }
  .row-container{
    width: 100%;
    height: 2rem;
    display: flex;
    flex-grow: 0;
    border-bottom: 1px solid black;
    font-size: 0.9rem;
  }
  .row1{
    flex: 1.7 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
    max-width: 15rem;
    white-space: nowrap;
  }
  .row2{
    flex: 1.2 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
  }
  .row3{
    flex: 1.2 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
  }
  .row3{
    flex: 1 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
  }
  .row4{
    flex: 1 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
  }
  .row5{
    flex: 1 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
  }
  .row6{
    flex: 1.2 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid black;
  }
  .row7{
    flex: 1 0 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .pageTurn{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }

  .pageTurn-left{
    width: 1rem;
    height: 1rem;
    transform: rotate(90deg);
    color: lightgrey;
    cursor: pointer;
  }

  .pageTurn-right{
    width: 1rem;
    height: 1rem;
    transform: rotate(-90deg);
    color: lightgrey;
    cursor: pointer;
  }

  .turnIconActive{
    color: black;
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
