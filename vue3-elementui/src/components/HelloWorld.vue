<template>
  <div class="menu-header">Menu组件</div>
  <div
    v-for="item of menuList"
    :key="item.id"
    @click="RouteTo(item.url)"
    class="menu-item"
  >
    <span>{{ item.title }}</span>
    <div class="arrow-group">
      <cigo-icon-font
        class="item-more show"
        name="cigoadmin-icon-expand"
      ></cigo-icon-font>
      <!-- <i class="top-arrow1"></i><i class="top-arrow2"></i> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import router from "@/router";

import CigoIconFont from "@/components/icon-font.vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    menuList: Array,
  },
  components: {
    CigoIconFont,
  },
  // ToDo
  // 1 新建一个menu接口
  // 2 v-for 渲染menu 朝下渲染
  // 3 绑定hover事件
  // 4 hover 时v-for朝右边渲染

  setup() {
    const RouteTo = (url: string) => {
      router.push(url);
    };

    return {
      RouteTo,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../index.scss";
.menu-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
}
.menu-item {
  height: 45px;
  line-height: 45px;
  cursor: pointer;
}
/*上箭头*/
.arrow-group {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;

  .top-arrow1,
  .top-arrow2 {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    border-top: 8px transparent dashed;
    border-left: 8px transparent dashed;
    border-right: 8px transparent dashed;
    border-radius: 4px;
  }

  .top-arrow1 {
    border-bottom: 8px #fff solid;
  }

  .top-arrow2 {
    top: 3px;
    border-bottom: 8px $menu solid;
  }
}
.item-more {
  width: 30px;
  height: 30px;
  visibility: hidden;
}

.item-more.show {
  visibility: visible;
}
.item-more.show {
  -moz-transition: all 0.8s ease-in-out;
  -webkit-transition: all 0.8s ease-in-out;
  -o-transition: all 0.8s ease-in-out;
  -ms-transition: all 0.8s ease-in-out;
  transition: all 0.8s ease-in-out;

  -moz-transform: rotate(630deg);
  -webkit-transform: rotate(630deg);
  -o-transform: rotate(630deg);
  -ms-transform: rotate(630deg);
  transform: rotate(630deg);
}
.menu-item:hover {
  .item-more.show {
    -moz-transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}
</style>
