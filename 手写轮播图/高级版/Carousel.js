/**
 * 
 */
(function (root) {
    const interval = 2000 //时间间隔
    const width = 500// 轮播图的宽度
    let intervalId = null //  定时器
    // 图片集合
    const lists = document.querySelector(".list")
    const listItem = Array.from(lists.children)
    // 圆点集合
    const dots = document.querySelector(".dots")
    const dot = Array.from(dots.children)
    // 前后按钮集合
    const button = document.querySelector(".button")
    let current = 0, max = listItem.length
    // 存储圆点的状态
    const dotSelect = {
        preDot: dot[0],
        currentDot: dot[0]
    }
    let timeOut = null
    // li 预处理
    const half = max / 2
    /**
    *   轮播图的状态初始化
    **/
    initLi()
    function initLi() {
        const li=listItem[0].cloneNode(true)
        lists.appendChild(li)
    }

    button.addEventListener("click", function (e) {

        const target = e.target
        if (target.className == "next") {
            // 到下一页
            goNext()
        }
        if (target.className == "pre") {
            // 到上一页
            goPre()
        }
    })

    function goNext(cur) {
        current++
        if(current>max){
            current=1
            lists.classList.remove("is-animating")
            lists.style.transform=`translateX(${0}px)`;
            // ------------------     css动画 实际上是宏任务            ------------------------------
            // Promise.resolve().then(()=>{
            //     lists.classList.add("is-animating")
            //     translate(current)
            //     handleDot(current)
            // })
            setTimeout(()=>{
                lists.classList.add("is-animating")
                translate(current)
                handleDot(current)
            },0)
            
            return
        }
        translate(current)
        handleDot(current)
    }

    function goPre(cur) {
        current--
        if(current<0){
            current=max-1
            lists.classList.remove("is-animating")
            lists.style.transform=`translateX(${-max*width}px)`;

            setTimeout(()=>{
                lists.classList.add("is-animating")
                translate(current)
                handleDot(current)
            },0)
            return
        }
        translate(current)
        handleDot(current)
    }
    function translate(current) {
        const left=-current*500
        lists.style.transform=`translateX(${left}px)`;
    }
    function handleDot(cur) {
        cur = cur % max
        dotSelect.preDot = dotSelect.currentDot
        dotSelect.currentDot = dot[cur]
        dotSelect.currentDot.className = "active"
        dotSelect.preDot.className = ""
    }

    // 监听白点的点击事件
    dots.addEventListener("click", function (e) {
        const dot = e.target
        if (dot.tagName === "LI") {
            let value = dot.attributes[0].value
            value = +value
            current=value
            translate(current)
            handleDot(value)
        }
    })

    function autoPlay() {
        if (intervalId) {
            removeAnima()
        }
        intervalId = setInterval(() => {
            goNext()
        }, interval);
    }
    autoPlay() 


    function removeAnima() {
        clearInterval(intervalId)
        intervalId = null
    }
    const container = document.querySelector("#container")
    //  // 当鼠标悬停在父盒子上时，停止动画
    container.addEventListener("mouseover",function(e){
        removeAnima()
    })
    // // 当鼠标悬停在父盒子上时，开始动画
    container.addEventListener("mouseout",function(e){
        autoPlay() 
    })
})(window)