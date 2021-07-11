/**
 * @description 流程图中的节点
 *  */
function FlowNode({
  nodeName,
  status,
  describe,
  width,
  height,
  x,
  y,
  isShowtips,
  style = {},
}) {
  this.nodeName = nodeName; // 节点的名称
  this.status = status; // 节点的状态
  this.describe = describe; // 节点的描述
  this.width = width; // 节点的宽
  this.height = height; // 节点的高
  this.x = x; // 节点的起始x坐标
  this.y = y; // 节点的起始y坐标
  this.isShowtips = isShowtips; // 是否展示 tips
  this.style = style;
}

class DrawCanvas {
  defaultConfig = {
    startPosition: { x: 150, y: 100 }, // canvas绘制起始节点的坐标
    box: { width: 160, height: 60 }, // 盒子的宽高
    space: 250, // 每个盒子的左右间距，包括盒子的宽度
    spaceTop: 140, // 每个盒子的左右间距，包括盒子的高度
    lineColor: 'rgba(202, 170, 128, 1)', // 线段的颜色
    describeColor: 'rgba(51, 51, 51, 1)', // 盒子下方的描述的颜色
    fontColor: 'rgba(144, 147, 153, 1)', // 字体默认颜色
    // selectFontColor: 'rgba(255, 143, 45, 1)', // 字体被选中后的颜色
    selectFontColor: '#000',
    spaceListY: 130, // 每个流程之间的距离 包括盒子的高度
    lastNodeY: 50, // 记录每条流程的最后一个节点的y坐标，加上每条流程之间的间隔，即是下一条流程的起始y坐标
    defaultBgcolor: 'rgba(245, 247, 250, 0.1)', // 矩形默认填充的颜色
    selectedBgcolor: 'rgba(255, 143, 45, 0.1)', // 矩形被选中后填充的颜色
    fontSize: 16,
    fontFamily: 'Arial',
    textAlign: 'center',
    isMove: true, // 是否支持画布拖动
    nodeClick: (node) => {
      console.log(`${node}被点击辣！`);
    },
    nodeOver: (dom, node) => {
      console.log(node, '被滑过了');
    },
  };
  constructor(parentDom, config) {
    this.initCanvas(parentDom, config);
  }
  /**
   * @description 初始化DOM
   * @param {*} parentDom
   * @param {*} config
   */
  initCanvas = (parentDom, config) => {
    if (typeof parentDom === 'string' || parentDom instanceof HTMLElement) {
      if (typeof parentDom === 'string') {
        parentDom = document.querySelector(parentDom);
      }
      this.parentDom = parentDom;
      parentDom.style.position = 'relative';
      parentDom.style.cursor = 'default';
      // cursor: pointer;

      parentDom.innerHTML = `
        <canvas id="contentDom" style="position:absolute;top:0;left: 0;"></canvas>
        <canvas id="animationDom" style="position:absolute;top:0;left: 0;z-index: 2;"></canvas>
        <div id="processChart-tips"
        style="position: absolute; border-style: solid;
          white-space: nowrap;
          z-index: 9999999;
          box-shadow: rgb(0 0 0 / 20%) 1px 2px 10px;
          transition: opacity 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s,
            visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s,
            transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
          background-color: rgb(255, 255, 255);
          border-width: 1px;
          border-radius: 4px;
          color: rgb(102, 102, 102);
          padding: 10px;
          top: 0px;
          left: 0px;
          transform: translate3d(0px, 0px, 0px);
          border-color: rgba(245, 247, 250);
          min-width: 60px;
          min-height: 30px;
          opacity: 0;
        "
      ></div>`;
      // tips DOM节点
      this.tipsDOm = document.getElementById('processChart-tips');
      // canvas 宽高设置
      const contentDom = document.getElementById('contentDom');
      this.contentDom = contentDom;
      const width = parentDom.clientWidth;
      const height = parentDom.clientHeight;
      contentDom.width = width;
      contentDom.height = height;
      // 动画层
      const animationDom = document.getElementById('animationDom');
      animationDom.width = width;
      animationDom.height = height;
      this.animationDom = animationDom;
      this.width = width;
      this.height = height;

      // 获取canvas上下文
      this.ctx = contentDom.getContext('2d');

      if (config.sourceData.length === 0) {
        console.error('该数组为空数组，不渲染');
      } else {
        this.initData(config);
        this.initCanvasEvent(contentDom, animationDom, this.config.box);
      }
    } else {
      console.error('请传入类名或真实Dom节点');
    }
  };
  /**
   * @description 节点位置信息的计算
   * @param {*} config 流程图的配置
   */
  initData(config) {
    this.config = Object.assign(this.defaultConfig, config);
    this.initlastNodeY = this.config.lastNodeY;
    if (typeof config.nodeClick === 'function') {
      this.config.nodeClick.bind(config);
    }
    if (typeof config.nodeOver === 'function') {
      this.config.nodeOver.bind(config);
    }
    this.sourceData = config.sourceData;
    this.nodeCollection = new FlowList(); // 存储每个节点的信息
    this.linePosition = {}; // 存储盒子的前后位置，方便后续连线
    this.headNodeCollection = []; // 存储起始节点盒子的信息，以便后续连线
    this.mouseOverNode = null; // 存储被鼠标滑过的盒子
    // 防止绘制的范围超出盒子的高度
    this.compute();
    const lastNodeY = this.config.lastNodeY + 20;
    this.height = lastNodeY;
    this.parentDom.style.height = `${lastNodeY}px`;
    this.contentDom.height = lastNodeY;
    this.animationDom.height = lastNodeY;
    this.render();
    this.config.lastNodeY = this.initlastNodeY;
  }
  /**
   * @description 节点信息的计算
   */
  compute() {
    const {
      startPosition,
      space,
      spaceTop,
      box,
      spaceListY,
      selectedBgcolor,
      selectFontColor,
      defaultBgcolor,
      fontColor,
    } = this.config;
    const halfWidth = box.width / 2;
    const halfHeight = box.height / 2;
    const { width } = this;
    this.ctx.save();

    this.sourceData.forEach((item, index) => {
      let direction = 'right';
      let i = 0;
      let inflectionPoint = {
        x: 0,
        y: 0,
      };
      const length = item.length;
      this.linePosition[`${index}next`] = {};
      this.linePosition[`${index}next`] = new FlowList();
      let p = this.linePosition[`${index}next`];
      item.forEach((ele, len) => {
        const bgcolor = ele.status ? selectedBgcolor : defaultBgcolor;
        const ftColor = ele.status ? selectFontColor : fontColor;
        let nodePosition = {};
        let startNode = '';
        let endNode = '';
        let nodeDirection = '';
        if (direction === 'right') {
          const start = inflectionPoint.x ? inflectionPoint : startPosition;
          const x = i * space + start.x;
          const y = inflectionPoint.y
            ? inflectionPoint.y
            : this.config.lastNodeY; // y轴
          if (x + box.width + 100 < width) {
            nodePosition = { x, y };
            if (x + space + box.width + 100 < width) {
              // 向右边渲染
              startNode = { x: x + box.width, y: y + halfHeight };
              endNode = { x: x + space, y: y + halfHeight };
              nodeDirection = 'right';
            } else {
              // 右边最后一个
              (startNode = {
                x: x + halfWidth,
                y: y + box.height,
                describe: ele.describe,
              }),
                (endNode = { x: x + halfWidth, y: y + spaceTop });
              nodeDirection = 'bottom';
            }
          } else {
            const position = { x: x - space, y: y + spaceTop };
            nodePosition = position;
            direction = 'bottomLeft';
            i = 0;
            inflectionPoint = position;

            startNode = { x: position.x, y: position.y + halfHeight };
            endNode = {
              x: position.x - space + box.width,
              y: position.y + halfHeight,
            };
            nodeDirection = 'left';
          }
        } else if (direction === 'bottomLeft') {
          // 在右下角，且为第一个时，需要向左渲染
          const x = inflectionPoint.x - i * space;
          const y = inflectionPoint.y;
          if (x >= startPosition.x) {
            // 向左渲染
            nodePosition = { x, y };
            if (x - space >= startPosition.x) {
              startNode = { x, y: y + halfHeight };
              endNode = { x: x - space + box.width, y: y + halfHeight };
              nodeDirection = 'left';
            } else {
              // 左边最后一个
              startNode = {
                x: x + halfWidth,
                y: y + box.height,
                describe: ele.describe,
              };
              endNode = { x: x + halfWidth, y: y + spaceTop };
              nodeDirection = 'bottom';
            }
          } else {
            const position = { x: x + space, y: y + spaceTop };
            nodePosition = position;
            startNode = {
              x: position.x + box.width,
              y: position.y + halfHeight,
            };
            endNode = { x: position.x + space, y: position.y + halfHeight };
            nodeDirection = 'right';

            direction = 'right';
            i = -1;
            inflectionPoint = {
              x: position.x + space,
              y: position.y,
            };
          }
        }

        i++;
        if (len === 0) {
          // 收集起始节点
          this.headNodeCollection.push(nodePosition);
        }
        if (length === len + 1) {
          this.config.lastNodeY = nodePosition.y + spaceListY;
        } else {
          // 当画到最后一个节点的时候就不需要连线了
          p.push({
            start: startNode,
            end: endNode,
            direction: nodeDirection,
            hasArrow: true,
          });
        }
        // 收集所有节点
        const node = new FlowNode({
          nodeName: ele.nodeName,
          status: ele.status,
          describe: ele.describe,
          width: box.width,
          height: box.height,
          x: nodePosition.x,
          y: nodePosition.y,
          isShowtips: ele.describe && ele.describe.length > 10,
          style: {
            backgroundColor: bgcolor,
            fontColor: ftColor,
          },
        });
        this.nodeCollection.push(node);
      });
    });
  }
  /**
   * @description 开始绘制图形
   */
  render() {
    console.log('render=========');
    const { lineColor } = this.config;
    // 开始绘制连线
    for (const key in this.linePosition) {
      this.linePosition[key].forEach((item) => {
        this.renderLine(
          item.start,
          item.end,
          lineColor,
          item.hasArrow,
          item.direction
        );
      });
    }
    // 开始绘制头部节点相关
    this.headNodeLink();

    // 开始绘制节点
    this.nodeCollection.forEach((item) => {
      this.renderRect({ node: item, ...item });
    });
  }
  headNodeLink() {
    if (this.headNodeCollection.length < 2) return;
    // 连接头部节点
    const {
      lineColor,
      headNode,
      box,
      selectedBgcolor,
      defaultBgcolor,
      fontColor,
      selectFontColor,
    } = this.config;
    const halfHeight = box.height / 2;
    this.headNodeCollection.map((item) => {
      this.renderLine(
        { x: item.x - 50, y: item.y + halfHeight },
        { x: item.x, y: item.y + halfHeight },
        lineColor
      );
    });
    const start = this.headNodeCollection[0];
    const end = this.headNodeCollection[this.headNodeCollection.length - 1];
    this.renderLine(
      { x: start.x - 50, y: start.y + halfHeight },
      { x: end.x - 50, y: end.y + halfHeight },
      lineColor
    );
    // 如果有顶部节点，则添加在最左侧
    if (headNode && typeof headNode === 'object') {
      const nodePosition = {
        x: start.x - 100 - box.width,
        y: (start.y + end.y) / 2,
      };
      const bgcolor = headNode.status ? selectedBgcolor : defaultBgcolor;
      const ftColor = headNode.status ? selectFontColor : fontColor;
      const node = new FlowNode({
        nodeName: headNode.nodeName,
        status: headNode.status,
        describe: headNode.describe,
        width: box.width,
        height: box.height,
        ...nodePosition,
        isShowtips: headNode.describe && headNode.describe.length > 10,
        style: {
          backgroundColor: bgcolor,
          fontColor: ftColor,
        },
      });
      this.nodeCollection.push(node);

      this.renderLine(
        { x: start.x - 50, y: nodePosition.y + halfHeight },
        { x: nodePosition.x + box.width, y: nodePosition.y + halfHeight },
        lineColor
      );
    }
  }
  // 文本填充
  fillText(node, text, x, y, fontColor, textAlign, box, describe) {
    const { hasDetail } = this.config;
    const halfWidth = box.width / 2;
    const halfHeight = box.height / 2;
    const { fontSize, fontFamily } = this.config;
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    this.ctx.textAlign = textAlign;
    this.ctx.fillStyle = fontColor;
    if (text) {
      if (describe) {
        if (!hasDetail) return;
        this.ctx.fillStyle = this.config.describeColor;
        this.ctx.font = `${fontSize - 2}px ${fontFamily}`;
        const textArr = text.split('/n');
        let text0 = textArr[0];
        // 处理是否展示tips
        node.isShowtips = false;
        if (textArr[0].length > 10) {
          text0 = `${textArr[0].substring(0, 10)}...`;
          node.isShowtips = true;
        }

        const textWidth0 = this.ctx.measureText(text0);
        const textWidth1 = this.ctx.measureText(textArr[1]);
        if (text0) {
          this.ctx.fillText(
            text0,
            x + halfWidth - textWidth0.width / 2,
            y + fontSize
          );
        }
        if (textArr[1]) {
          this.ctx.fillText(
            textArr[1],
            x + halfWidth - textWidth1.width / 2,
            y + fontSize * 2
          );
        }
      } else {
        this.ctx.fillText(text, x + halfWidth, y + halfHeight + fontSize / 4);
      }
    }

    this.ctx.restore();
  }
  // 绘制矩形
  renderRect({
    node,
    nodeName,
    x,
    y,
    width = 200,
    height = 100,
    describe,
    style,
  }) {
    const { backgroundColor, fontColor } = style;
    this.ctx.fillStyle = backgroundColor;
    this.ctx.strokeStyle = '#000';
    this.ctx.beginPath();
    this.ctx.fillRect(x, y, width, height);
    this.ctx.stroke();
    this.ctx.restore();
    let textAlign = 'center';
    this.fillText(node, nodeName, x, y, fontColor, textAlign, {
      width,
      height,
    });
    if (describe) {
      textAlign = 'start';
      this.fillText(
        node,
        describe,
        x,
        y + height,
        fontColor,
        textAlign,
        { width, height },
        true
      );
    }
  }
  // 绘制连线
  renderLine(from = {}, to = {}, fillColor, hasArrow, direction) {
    const { hasDetail, fontSize } = this.config;
    this.ctx.strokeStyle = fillColor;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    let fromY = from.y;
    if (hasDetail && from.describe && direction === 'bottom') {
      fromY = from.y + fontSize * 2 + 4;
    }
    this.ctx.moveTo(from.x, fromY);
    this.ctx.lineTo(to.x, to.y);
    if (hasArrow) {
      if (direction === 'right') {
        this.ctx.moveTo(to.x, to.y);
        this.ctx.lineTo(to.x - 10, to.y + 6);
        this.ctx.moveTo(to.x, to.y);
        this.ctx.lineTo(to.x - 10, to.y - 6);
      } else if (direction === 'bottom') {
        this.ctx.moveTo(to.x, to.y);
        this.ctx.lineTo(to.x + 6, to.y - 10);
        this.ctx.moveTo(to.x, to.y);
        this.ctx.lineTo(to.x - 6, to.y - 10);
      } else if (direction === 'left') {
        this.ctx.moveTo(to.x, to.y);
        this.ctx.lineTo(to.x + 10, to.y + 6);
        this.ctx.moveTo(to.x, to.y);
        this.ctx.lineTo(to.x + 10, to.y - 6);
      }
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * @description 重新绘制图形
   */
  update(config) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.initData(config);
  }
  /**
   *  @description 初始化画布事件
   *  */

  initCanvasEvent(canvasDom, canvasAnimaDom, box) {
    // 支持画布拖动
    const { isMove } = this.config;
    if (isMove) {
      canvasAnimaDom.onmousedown = (args) => {
        const StartX = args.clientX;
        const StartY = args.clientY;
        document.onmousemove = (ev) => {
          const left = ev.clientX - StartX;
          const top = ev.clientY - StartY;
          canvasAnimaDom.style.left = `${left + 50}px`;
          canvasAnimaDom.style.top = `${top + 50}px`;
          canvasDom.style.left = `${left + 50}px`;
          canvasDom.style.top = `${top + 50}px`;
        };
        document.onmouseup = () => {
          document.onmousedown = null;
          document.onmousemove = null;
        };
        return false;
      };
    }

    // 盒子的监听事件
    this.eventListener();
  }
  findNode(e, callback) {
    const box = this.config.box;
    const p = getEventPosition(e);
    this.nodeCollection.find((iterator) => {
      if (
        p.x > iterator.x &&
        p.x < iterator.x + box.width &&
        p.y > iterator.y &&
        p.y < iterator.y + box.height
      ) {
        if (callback) {
          callback(iterator);
        }
        return false;
      }
    });
  }
  eventListener() {
    this.parentDom.addEventListener(
      'click',
      (e) => this.findNode(e, (iterator) => this.config.nodeClick(iterator)),
      false
    );
    this.domOver = throttle(this.handleMouseOver, 60, this);
    this.parentDom.addEventListener('mousemove', this.domOver, false);
  }
  handleMouseOver(e) {
    this.mouseOverNode = null;
    this.findNode(e, (iterator) => {
      this.mouseOverNode = iterator;
    });
    // 移入及移出节点的样式控制
    if (this.mouseOverNode && this.mouseOverStyle !== 'pointer') {
      console.log('移入节点');
      this.mouseOverStyle = 'pointer';
      this.parentDom.style.cursor = 'pointer';
      if (this.mouseOverNode.isShowtips) {
        this.showTips = true;
        this.tipsDOm.style.opacity = '1';
        this.tipsDOm.style.transform = `translate3d(${
          this.mouseOverNode.x + this.mouseOverNode.width
        }px, ${this.mouseOverNode.y + 16}px, 0px)`;
        const node = { ...this.mouseOverNode };
        if (node.describe.includes('/n')) {
          node.describe = node.describe.replace('/n', '</br>');
        }
        this.config.nodeOver(this.tipsDOm, node);
      }
    } else if (!this.mouseOverNode && this.mouseOverStyle !== 'default') {
      console.log('移出节点');
      this.parentDom.style.cursor = 'default';
      this.mouseOverStyle = 'default';
      if (this.showTips) {
        this.showTips = false;
        this.tipsDOm.style.opacity = '0';
        this.tipsDOm.style.transform = `translate3d(0px, 0px, 0px)`;
      }
    }
  }

  handleMouseOut() {
    console.log('移出');
  }
  /**
   * @description 移除事件监听
   */
  beforeDestory() {}
}
