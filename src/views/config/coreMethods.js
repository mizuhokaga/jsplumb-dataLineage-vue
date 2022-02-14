import panzoom from "panzoom";
import $ from 'jquery'
import {
  tbType
} from "./tbType";
const coreMethods = {
  init() {
    this.jsPlumb.ready(() => {
      // 导入默认配置
      this.jsPlumb.importDefaults(this.jsPlumbSetting);
      this.loadFlow();
      this.initPanZoom();
      // 会使整个jsPlumb立即重绘。
      this.jsPlumb.setSuspendDrawing(false, true);
    });
  },
  // 加载
  loadFlow() {
    // 初始化节点
    if (this.json.nodes && this.json.edges)
      this.json.nodes.forEach(node => {
        this.jsPlumb.draggable(node.id, {
          grid: this.commonGrid
        });
        node.columns.forEach(col => {
          const colID = node.name + this.minus + col.name
          // 节点类型不同,添加端点的方向也不同.对于Origin/RS表来说 它们都只有一侧有端点.其他表都视为中间表两侧都有端点
          if (node.type === tbType["Origin"].type) {
            this.addEndpoint(colID, ['Right'])
          } else if (node.type === tbType["RS"].type) {
            this.addEndpoint(colID, ['Left'])
          } else {
            this.addEndpoint(colID, ['Right', 'Left'])
          }
        })
      })

    // 初始化连线
    this.json.edges.forEach(edge => {
      let fromFull = edge.from.tbName + this.minus + edge.from.column + this.minus + "Right",
        toFull = edge.to.tbName + this.minus + edge.to.column + this.minus + "Left"
      this.connect(fromFull, toFull);


      //绑定事件 鼠标移到连线高亮关联列、线
      this.jsPlumb.unbind("mouseover");
      this.jsPlumb.bind("mouseover", conn => {
        const to = conn.targetId.split(this.minus)
        let activeNodes = this.findActiveNode(this.json.edges, to[0], to[1])
        activeNodes.forEach(an => {
          const full = an.tbName + this.minus + an.column

          this.jsPlumb.getConnections({
            source: full
          }).map(c => {
            c.setPaintStyle({
              stroke: tbType["RS"].color
            })
          })
          $("#" + an.tbName + "-cols")
            .find("#" + full)
            .css("background-color", tbType["HighLight"].color);
          //  const connections = this.jsPlumb.getAllConnections()//How stupid！
          // connections.map(c => {
          //   if (an.tbName === c.sourceId.split(this.minus)[0]) {
          //     // if (full === c.sourceId) {
          //     //   console.log(c);
          //     //   c.setPaintStyle({
          //     //     stroke: tbType["RS"].color
          //     //   })
          //     // }
          //   }
          // })
        })
      });
      //鼠标移走后恢复
      this.jsPlumb.unbind('mouseout');
      this.jsPlumb.bind("mouseout", conn => {
        const to = conn.targetId.split(this.minus)
        let activeNodes = this.findActiveNode(this.json.edges, to[0], to[1])
        //将所有相关字段恢复默认显示
        activeNodes.forEach(an => {
          const full = an.tbName + this.minus + an.column
          this.jsPlumb.getConnections({
            source: full
          }).map(c => {
            c.setPaintStyle({
              stroke: tbType["Union"].color
            })
          })
          $("#" + an.tbName + "-cols")
            .find("#" + full)
            .css("background-color", tbType["NormalLight"].color);
        })
      });
    })
  },

  findActiveNode(edges, tbName, column) {
    let up = this.findUpstreamNode(edges, tbName, column)
    //up数组首个元素重复 需要跳过
    return up.slice(1).reverse()
      .concat(this.findDownstreamNode(edges, tbName, column))
  },
  //找下游的子节点
  findDownstreamNode(edges, tbName, column) {
    let downstreamNodes = [{
      tbName,
      column
    }]
    edges.forEach(edge => {
      if (edge.from.tbName === tbName && edge.from.column === column) {
        downstreamNodes = downstreamNodes.concat(this.findDownstreamNode(this.json.edges, edge.to.tbName, edge.to.column))
      }
    })
    return downstreamNodes
  },
  //找上游的父节点
  findUpstreamNode(edges, tbName, column) {
    let upstreamNodes = [{
      tbName,
      column
    }]
    edges.forEach(edge => {
      if (edge.to.tbName === tbName && edge.to.column === column) {
        upstreamNodes = upstreamNodes.concat(this.findUpstreamNode(this.json.edges, edge.from.tbName, edge.from.column))
      }
    })
    return upstreamNodes
  },

  addEndpoint(elID, AnchorArr) {
    //AnchorArr 可能有多个锚点需要添加
    AnchorArr.forEach(anchor => {
      // console.log(  elID + this.minus + anchor);
      this.jsPlumb.addEndpoint(elID, {
        anchors: anchor,
        uuid: elID + this.minus + anchor
      }, this.jsPlumbSetting)
    })
  },
  connect(from, to) {
    this.jsPlumb.connect({
      uuids: [from, to]
    }, this.jsPlumbSetting);
  },

  initPanZoom() {
    const mainContainer = this.jsPlumb.getContainer();
    const mainContainerWrap = mainContainer.parentNode;
    const pan = panzoom(mainContainer, {
      smoothScroll: false,
      bounds: true,
      // autocenter: true,
      zoomDoubleClickSpeed: 1,
      minZoom: 0.5,
      maxZoom: 2,
      //设置滚动缩放的组合键，默认不需要组合键
      beforeWheel: (e) => {
        // console.log(e)
        // let shouldIgnore = !e.ctrlKey
        // return shouldIgnore
      },
      beforeMouseDown: function (e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        var shouldIgnore = e.ctrlKey;
        return shouldIgnore;
      }
    });
    this.jsPlumb.mainContainerWrap = mainContainerWrap;
    this.jsPlumb.pan = pan;
    // 缩放时设置jsPlumb的缩放比率
    pan.on("zoom", e => {
      const {
        x,
        y,
        scale
      } = e.getTransform();
      this.jsPlumb.setZoom(scale);
    });
    pan.on("panend", (e) => {
      const {
        x,
        y,
        scale
      } = e.getTransform();
    })

    // 平移时设置鼠标样式
    mainContainerWrap.style.cursor = "grab";
    mainContainerWrap.addEventListener("mousedown", function wrapMousedown() {
      this.style.cursor = "grabbing";
      mainContainerWrap.addEventListener("mouseout", function wrapMouseout() {
        this.style.cursor = "grab";
      });
    });
    mainContainerWrap.addEventListener("mouseup", function wrapMouseup() {
      this.style.cursor = "grab";
    });
  },
  //初始化节点位置  （以便对齐,居中）
  fixNodesPosition() {
    if (this.json.nodes && this.$refs.flowWrap) {
      const nodeWidth = 120
      const nodeHeight = 40
      let wrapInfo = this.$refs.flowWrap.getBoundingClientRect()
      let maxLeft = 0,
        minLeft = wrapInfo.width,
        maxTop = 0,
        minTop = wrapInfo.height;
      let nodePoint = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
      let fixTop = 0,
        fixLeft = 0;
      this.json.nodes.forEach(el => {
        // let top = Number(el.top.substring(0, el.top.length -2))
        // let left = Number(el.left.substring(0, el.left.length -2))
        let top = el.top
        let left = el.left
        maxLeft = left > maxLeft ? left : maxLeft
        minLeft = left < minLeft ? left : minLeft
        maxTop = top > maxTop ? top : maxTop
        minTop = top < minTop ? top : minTop
      })
      nodePoint.left = minLeft
      nodePoint.right = wrapInfo.width - maxLeft - nodeWidth
      nodePoint.top = minTop
      nodePoint.bottom = wrapInfo.height - maxTop - nodeHeight;

      fixTop = nodePoint.top !== nodePoint.bottom ? (nodePoint.bottom - nodePoint.top) / 2 : 0;
      fixLeft = nodePoint.left !== nodePoint.right ? (nodePoint.right - nodePoint.left) / 2 : 0;

      this.json.nodes.map(el => {
        let top = Number(el.top) + fixTop;
        let left = Number(el.left) + fixLeft;
        el.top = (Math.round(top / 20)) * 20
        el.left = (Math.round(left / 20)) * 20
      })
    }
  },
}

export default coreMethods;