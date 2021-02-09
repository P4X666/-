
var ws = require("nodejs-websocket");

var arr = {};
var server = ws
  .createServer(function (scoket) {
    scoket.on("text", function (str) {
      var data = JSON.parse(str);
      console.log(str);
      if (arr[data.uuid]) {
        for (var item in arr) {
          arr[item].sendText(
            JSON.stringify({
              uuid: data.uuid,
              name: data.name,
              date: data.date,
              address: data.address,
            })
          );
        }
      } else {
        arr[data.uuid] = scoket;
      }
    });
    scoket.on("close", function (code, reason) {
      console.log("关闭连接");
    });
    scoket.on("error", function (code, reason) {
      console.log("异常关闭");
    });
  })
  .listen(3000, () => {
    console.log("running");
  });


