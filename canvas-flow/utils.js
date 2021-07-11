// 获取鼠标位置
function getEventPosition(ev) {
  let x;
  let y;
  if (ev.layerX || ev.layerX === 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX === 0) {
    // Opera
    x = ev.offsetX;
    y = ev.offsetY;
  }
  return { x, y };
}
// 异步操作函数
const nextTick = Promise.resolve();
const callbacks = [];
let pending = true;
function flushCallbacks() {
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
  callbacks.length = 0;
}
function $nextTick(fun) {
  callbacks.push(fun);
  pending = true;
  nextTick.then(() => {
    if (pending) {
      pending = false;
      flushCallbacks();
    }
  });
}
/**
 * @description 链表
 */

class FlowList {
  constructor() {
    this.head = null;
    this.length = 0;
  }
  // 往头部插入数据
  push(node) {
    node = new ListNode(node);
    if (this.head) {
      node.next = this.head;
    } else {
      node.next = null;
    }
    this.head = node;
    this.length++;
  }
  // 遍历链表
  forEach(callback = (node) => {}) {
    let node = this.head;
    while (node) {
      callback(node.node);
      node = node.next;
    }
  }
  find(callback = (node) => true) {
    let node = this.head;
    let condition = true;
    while (node && condition !== false) {
      condition = callback(node.node);
      node = node.next;
    }
  }
}
function ListNode(key) {
  this.next = null;
  this.node = key;
}
/**
 * @description 节流函数
 */
function throttle(fun, delay, obj) {
  let timer = null;
  return (args) => {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fun.call(obj, args);
      clearTimeout(timer);
      timer = null;
    }, delay);
  };
}
