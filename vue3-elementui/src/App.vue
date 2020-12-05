<template>
  <div id="menu">
    <HelloWorld :menuList="menuList" />
  </div>
  <div id="content">
    <div class="nav">这是 nav</div>
    <div class="content" ref="content">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent,onMounted } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import loading from "./common/loading/index"
interface MenuItem {
  // 默认属性
  id: string; // 确认唯一性
  title: string; // 标题
  url: string; // 路由
  icon?: string;
  children?: [object]; // 子菜单
}

export default defineComponent({
  components: {
    HelloWorld,
  },
  setup(props: any,ctx) {
    onMounted(()=>{
      setTimeout(() => {
        loading({
        target:".content"
      })
       console.log(ctx)
      }, 0);
     
      
    })
    
    const menuList: MenuItem[] = [
      {
        id: "001",
        title: "测试1",
        url: "/",
      },
      {
        id: "002",
        title: "测试2",
        url: "/about",
      },
      {
        id: "003",
        title: "测试3",
        url: "/",
      },
      {
        id: "004",
        title: "测试4",
        url: "/about",
      },
    ];
    return {
      menuList,
    };
  },
  
});
</script>

<style lang="scss">
@import './index.scss' ;
body {
  margin: 0;
}
#app {
  display: flex;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#menu {
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100vh;
  color: #fff;
  background-color: $menu;
  box-shadow: 4px 0 10px #ccc;
}
#content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.nav {
  height: 50px;
  line-height: 50px;
  background-color: #42b983;
}

</style>
