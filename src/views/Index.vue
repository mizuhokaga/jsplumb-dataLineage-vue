<template>
  <div class="app-container">
    <!--    右边的绘制区域-->
    <div id="flowWrap" ref="flowWrap" class="flow-wrapper">
      <div id="table-flow">
        <!--        对齐辅助线-->
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

<script lang="js">
import jsplumbModule from 'jsplumb'
import commConfig from './config/jsplumbConfig'
import comm from './methods/comm'

import TableNode from './components/TableNode.vue'
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
        nodes: [],
        edges: []
      },
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
      //nextTick 立即更新DOM
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
      if (this.json.nodes.length !== 0 && this.json.edges.length !== 0) {
        //1 绘制节点信息
        this.json.nodes.forEach(node => {
          //使节点可拖动
          this.draggableNode(node.name)
          node.fields.forEach(field => {
            //表字段添加端点
            this.addEndpoint(node.name.concat(this.minus, field.name), anchorArr)
            //表头添加端点
            this.addEndpoint(node.name.concat(this.minus,), anchorArr)
          })
        })
        //2 绘制节点间连线
        this.json.edges.forEach(edge => {
          let from = edge.from.name.concat(this.minus, edge.from.field, this.minus, "Right"),
              to = edge.to.name.concat(this.minus, edge.to.field, this.minus, "Left")
          this.connectEndpoint(from, to);
        })
      }
    },
    ...comm
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

  .flow-wrapper {
    height: 100%;
    position: relative;
    overflow: hidden;
    outline: none !important;
    flex-grow: 1;
    background: url('../assets/point.png') repeat;

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
