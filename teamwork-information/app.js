const ws = require("nodejs-websocket");

const groupInfo = require("./groupInfo");

const arr = {}; // 保留每个用户的 id，最好是以 工号+当前时间，因为每个用户在同一时间只会有一次操作
const server = ws
  .createServer(function (scoket) {
    scoket.on("text", function (str) {
      let data = JSON.parse(str);
      console.log(str);
      if (arr[data.uuid]) {
        for (const iterator of groupInfo) {
          if (iterator.uuid === data.uuid.split("-")[0]) {
            iterator.temp=data.temp
            break;
          }
        }
        for (let item in arr) {
          arr[item].sendText(
            JSON.stringify(groupInfo)
          );
        }
      } else {
        for (const iterator of groupInfo) {
          if (iterator.uuid === data.uuid.split("-")[0]) {
            scoket.sendText(JSON.stringify(groupInfo));
            arr[data.uuid] = scoket;
            return;
          }
        }
        console.log("用户不存在");
        scoket.sendText(
          JSON.stringify({
            error: "用户不存在",
          })
        );

      }
    });
    scoket.on("close", function (code, reason) {
      console.log("关闭连接", reason);
    });
    scoket.on("error", function (code, reason) {
      console.log("异常关闭", reason);
    });
  })
  .listen(3000, () => {
    console.log("running");
  });
