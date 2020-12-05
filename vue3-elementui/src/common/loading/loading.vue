<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="el-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]"
    >
      <div class="el-loading-spinner">
        <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" />
        </svg>
        <i v-else :class="spinner"></i>
        <p v-if="text" class="el-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { toRefs, reactive } from "vue";
export default {
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      default: null,
    },
    spinner: {
      type: String,
      default: null,
    },
    background: {
      type: String,
      default: null,
    },
    fullscreen: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: "",
    },
  },
  setup(props:any, { emit }:any) {
    const $data = reactive({ ...props });
    const handleAfterLeave = () => {
      emit("after-leave");
    };
    const show = () => {
      $data.visible = true;
    };
    const close = () => {
      $data.visible = false;
    };
    const setText = (text:string) => {
      $data.text = text;
    };
    return {
      ...toRefs($data),
      handleAfterLeave,
      show,
      close,
      setText
    };
  },
};
</script>