<template>
  <div id="app">
    <div class="sidebar">
      <div class="sidebar-header">
        {{header}}
      </div>
      <div class="section" v-for="section in sections">
        <div class="section-header">
          {{section.header}}
          <icon name="down" class="section-header-icon" @click.native="toggleSection(section)"
                :class="{'section-collapsed':section.collapsed}"></icon>
        </div>
        <router-link class="section-item" v-bind:to="item.link" v-for="item in section.items"
                     @click.native="clickItem(item)" :class="{'item-active':item.chosed,
          'item-collapse':section.collapsed,'item-stretch':!section.collapsed}">
          {{item.title}}
        </router-link>
      </div>
    </div>
    <div class="router-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      header:"",
      sections:[]
    }
  },
  created(){
    this.init();
  },
  methods:{
    init(){
      this.header="SKYWORTH";
      let section1={
        header:"设备管理",
        collapsed:true,
        items:[
          {title:"设备登记",link:"/devicelogin",chosed:false},
          {title:"设备监控",link:"/devicemonitor",chosed:false},
          ]
      }
      let section2={
        header:"应用管理",
        collapsed:false,
        items:[
          {title:"视频安装",link:"/vedioinstall",chosed:false},
          {title:"APK安装",link:"/apkinstall",chosed:false},
          {title:"已安装",link:"/installed",chosed:false}
        ]
      }
      let section3={
        header:"菜单管理",
        collapsed:false,
        items:[
          {title:"设置菜单和标签",link:"/setmenuandflag",chosed:false},
        ]
      }
      this.sections.push(section1);
      this.sections.push(section2);
      this.sections.push(section3);
      let currentPath=this.$router.currentRoute.fullPath;
      console.log(currentPath);
      this.chooseItemByLink(currentPath);
    },
    chooseItemByLink(itemLink){
      if(itemLink=="/"){
        this.sections[0].items[0].chosed=true;
      }else {
        for(let i=0;i<this.sections.length;i++){
          let section=this.sections[i];
          for(let j=0;j<section.items.length;j++){
            if(section.items[j].link==itemLink){
              section.items[j].chosed=true;
              return;
            }
          }
        }
      }
    },
    clickItem(chooseditem){
      for(let i=0;i<this.sections.length;i++){
        let section=this.sections[i];
        for(let j=0;j<section.items.length;j++){
          section.items[j].chosed=false;
        }
      }
      chooseditem.chosed=true;
    },
    toggleSection(section){
      if(section.collapsed){
        section.collapsed=false;
      }else {
        section.collapsed=true;
      }
    }
  }
}
</script>

<style>
  html,body,div{
    margin: 0;
    padding: 0;
  }
  html,body{
    width: 100%;
    height: 100%;
  }
  #app{
    width: 100%;
    height: 100%;
    display: flex;
  }
  .sidebar{
    width: 18%;
    height: 100%;
    background-color: lightgrey;
    flex-direction: column;
    display: flex;
    user-select: none;
  }
  .sidebar-header{
    font-size: 1.8rem;
    margin-left: 2rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  .section{
    width: 100%;
    height: fit-content;
    flex-direction: column;
    display: flex;
    margin-top: 0.3rem;
    margin-left: 3rem;
  }
  .section-header{
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    position: relative;
  }
  .section-header-icon{
    margin-left: 0.2rem;
    width: 0.8rem;
    height: 0.8rem;
    cursor: pointer;
    position: absolute;
    left: -1.2rem;
    transition: .2s ease-in-out all;
  }
  .section-item{
    font-size: 1rem;
    color: gray;
    cursor: pointer;
    text-decoration: none;
    padding: 0.3rem 0rem;
  }
  .section-item:hover{
    color: black;
  }
  .section-collapsed{
    transform: rotate(-90deg);
  }
  .item-active{
    color: black;
  }
  .item-collapse{
    height: 0;
    width: 0;
    overflow: hidden;
    padding: 0;
  }
  .item-stretch{
    height: fit-content;
  }
  .router-container{
    width: 82%;
    height: 100%;
  }
</style>
