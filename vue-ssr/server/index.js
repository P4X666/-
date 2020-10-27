const express = require('express')
const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()

const app = express();

const page = new Vue({
    data() {
        return {
            title:"掘金"
        }
    },
    template:'<div>hello,vue ssr {{title}}</div>'
})

app.get("/", async (req, res) => {
    try {
        const html = await renderer.renderToString(page)
        res.send(html)
    } catch (e) {
        res.status(500).send("服务器内部错误")
    }
})

app.listen(3000, "127.0.0.1", (req, res) => {
    console.log("运行成功")
})