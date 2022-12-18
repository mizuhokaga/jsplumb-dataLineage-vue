<template>
  <div class="app-container">
    <div class="button-wrapper">
      <div v-for="button in buttonGroup" :key="button.label">
        <div class="node" @click="click(button.type)">
          <div class="icon"><img class="btnIcon" :src="button.icon"/></div>
          {{ button.label }}
        </div>
      </div>
    </div>
    <div id="flowWrap" ref="flowWrap" class="flow-wrapper">
      <div id="table-flow">
        <div v-show="auxiliaryLine.isShowXLine" class="auxiliary-line-x"
             :style="{width: auxiliaryLinePos.width, top:auxiliaryLinePos.y + 'px', left: auxiliaryLinePos.offsetX + 'px'}"></div>
        <div v-show="auxiliaryLine.isShowYLine" class="auxiliary-line-y"
             :style="{height: auxiliaryLinePos.height, left:auxiliaryLinePos.x + 'px', top: auxiliaryLinePos.offsetY + 'px'}"></div>
        <TableNode
            v-for="node in json.nodes"
            :id="node.name"
            :key="node.name"
            :node="node"
        />
      </div>
    </div>
  </div>
</template>

<script>
import jsplumbModule from 'jsplumb'
import {commConfig} from './config/jsplumbConfig'
import buttonGroup from './config/buttonGroup'
import buttonMethods from './methods/buttonMethods'
import tableTypeMappingColor from "./config/tableTypeMappingColor";
import comm from './methods/comm'
import $ from 'jquery'
import TableNode from './components/TableNode'
import sampleData from './config/sampleData.json'

const jsplumb = jsplumbModule.jsPlumb
export default {
  name: 'Index',
  components: {
    TableNode
  },
  data() {
    return {
      jsplumbInstance: null,
      json: {
        nodes: [], edges: []
      },
      buttonGroup: buttonGroup,
      commConfig: commConfig,
      auxiliaryLine: {isShowXLine: false, isShowYLine: false},  //对齐辅助线是否显示
      auxiliaryLinePos: {width: '100%', height: '100%', offsetX: 0, offsetY: 0, x: 20, y: 20},
      minus: '-', //表名和列名的分割符号
      anchorArr: ['Left', 'Right'],//specified anchor
      commGrid: [5, 5]//节点移动最小距离
    };
  },
  mounted() {
    this.renderDefaultLineage()
  },
  beforeDestroy() {
    this.jsplumbInstance.reset()
  },
  methods: {
    renderDefaultLineage() {
      this.json.nodes = sampleData.nodes
      this.json.edges = sampleData.edges
      this.init();
    },
    //初始化
    init() {
      this.fixNodesPosition()
      this.$nextTick(() => {
        this.initialize()
      })
    },
    //真正的初始化
    initialize() {
      jsplumb.ready(() => {
        //设置jsplumb实例、设置jsplumb默认配置、设置jsplumb容器
        this.jsplumbInstance = jsplumb.getInstance().importDefaults(commConfig)
        this.jsplumbInstance.setContainer('table-flow')
        // 先清除一下画布,防止缓存
        this.jsplumbInstance.reset();

        this.drawing(this.anchorArr)
        // 会使整个jsPlumb立即重绘。
        this.jsplumbInstance.setSuspendDrawing(false, true);
        this.initPanZoom()
      })
    },
    // 绘制
    drawing(anchorArr) {
      if (this.json.nodes && this.json.edges) {
        //1 绘制节点信息
        this.json.nodes.forEach(node => {
          //使节点可拖动
          this.draggableNode(node.name)
          node.fields.forEach(field => {
            // this.jsplumbInstance.makeSource(node.name+ "-" + field.name,this.jsplumbSourceOptions)
            this.addEndpoint(node.name + "-" + field.name, anchorArr)
          })
        })
        //2 绘制节点间连线
        this.json.edges.forEach(edge => {
          let from = edge.from.name + this.minus + edge.from.field + this.minus + "Right",
              to = edge.to.name + this.minus + edge.to.field + this.minus + "Left"
          this.connectEndpoint(from, to);
          //绑定事件 鼠标移到连线高亮关联列、线
          this.jsplumbInstance.unbind("mouseover");
          this.jsplumbInstance.bind("mouseover", conn => {
            const to = conn.targetId.split(this.minus)
            let activeNodes = this.findActiveNode(this.json.edges, to[0], to[1])
            activeNodes.forEach(an => {
              const full = an.tbName + this.minus + an.column

              this.jsplumbInstance.getConnections({
                source: full
              }).map(c => {
                c.setPaintStyle({
                  stroke: tableTypeMappingColor["RS"].color
                })
              })
              $("#" + an.tbName + "-cols")
                  .find("#" + full)
                  .css("background-color", tableTypeMappingColor["HighLight"].color);
              //  const connections = this.jsplumbInstance.getAllConnections()//How stupid！
              // connections.map(c => {
              //   if (an.tbName === c.sourceId.split(this.minus)[0]) {
              //     if (full === c.sourceId) {
              //       c.setPaintStyle({
              //         stroke: tableTypeMappingColor["RS"].color
              //       })
              //     }
              //   }
              // })
            })
          });
          //鼠标移走后恢复
          this.jsplumbInstance.unbind('mouseout');
          this.jsplumbInstance.bind("mouseout", conn => {
            const to = conn.targetId.split(this.minus)
            let activeNodes = this.findActiveNode(this.json.edges, to[0], to[1])
            //将所有相关字段恢复默认显示
            activeNodes.forEach(an => {
              const full = an.tbName + this.minus + an.column
              this.jsplumbInstance.getConnections({
                source: full
              }).map(c => {
                c.setPaintStyle({
                  stroke: tableTypeMappingColor["Union"].color
                })
              })
              $("#" + an.tbName + "-cols")
                  .find("#" + full)
                  .css("background-color", tableTypeMappingColor["NormalLight"].color);
            })
          });
        })
      }
    },
    ...comm,
    ...buttonMethods
  }

}
;
</script>

<style lang="less" scoped>

.app-container {
  display: flex;
  width: 90%;
  height: 750px;
  margin: 20px auto;
  border: 1px solid #ccc;

  .button-wrapper {
    width: 150px;
    height: 100%;
    border-right: 1px solid #ccc;

    .icon {
      width: 40px;
      height: 40px;
    }

    .node {
      display: flex;
      height: 40px;
      width: 80%;
      margin: 15px auto;
      border: 1px solid #ccc;
      border-radius: 5px;
      line-height: 40px;
      font-size: 11px;

      &:hover {
        cursor: pointer;
      }

      .log {
        width: 40px;
        height: 40px;
      }

      .name {
        width: 0;
        flex-grow: 1;
      }
    }

    .btnIcon {
      width: 40px;
      height: 40px;
    }
  }

  .flow-wrapper {
    height: 100%;
    position: relative;
    overflow: hidden;
    outline: none !important;
    flex-grow: 1;
    background-image: url("../assets/point.png");

    #table-flow {
      position: relative;
      width: 100%;
      height: 100%;

      .auxiliary-line-x {
        position: absolute;
        border: .5px dashed #2ab1e8;
        z-index: 9999;
      }

      .auxiliary-line-y {
        position: absolute;
        border: .5px dashed #2ab1e8;
        z-index: 9999;
      }
    }
  }
}
</style>

<style lang="less">
// 下面是鼠标移动到连线上时激活的样式
.jtk-connector.jtk-hover {
  z-index: 9999;

  path {
    cursor: pointer !important;
  }
}
</style>
