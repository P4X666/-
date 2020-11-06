
const box = document.getElementById("box")
const list = document.getElementById("list")
const bottomBox = document.getElementById("bottom-box")

const io = new IntersectionObserver(entries => {
  const isIntersecting = entries.find((entry) => {
    console.log(entry.isIntersecting)
  })
})

io.observe(bottomBox)

// // 开始观察
// io.observe(document.getElementById('example'));

// // 停止观察
// io.unobserve(element);

// // 关闭观察器
// io.disconnect();


// function touchScroll() {
//   let offsetHeight = Math.max(box.scrollHeight,box.offsetHeight); // 内容高度
//   let clientHeight = window.innerHeight || document.documentElement.clientHeight || box.clientHeight || 0; //视窗高度
//   let scrollTop = window.pageYOffset || document.documentElement.scrollTop || box.scrollTop || 0; //滚动条滚动高度
//   return (offsetHeight - clientHeight - scrollTop)
// }

// window.onscroll=function(){
//   let touchScroll = this.touchScroll()
//   if(touchScroll < 0) {
//       // 发送请求加载
//       console.log('我到底啦')
//   }
// };


// box.addEventListener('scroll', function (e) {
//   let offsetHeight = Math.max(this.scrollHeight, this.offsetHeight); // 内容高度
//   if (offsetHeight - this.clientHeight - this.scrollTop < 10) {
//     console.log("我到底啦")
//   }
// });

