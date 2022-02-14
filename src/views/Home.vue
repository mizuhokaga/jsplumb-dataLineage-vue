<template>
  <div class="flowRegion">
    <div class="btnWrap">
      <div v-for="btn in btnList" :key="btn.label" v-cloak>
        <div class="node" @click="click(btn.type)">
          <div class="icon">
            <img class="btnIcon" :src="btn.icon" />
          </div>
          {{ btn.label }}
        </div>
      </div>
    </div>
    <div id="flowWrap" ref="flowWrap" class="flowWrap">
      <div id="flow" v-if="json !== null">
        <NodeItem
          v-for="item in json.nodes"
          :key="item.id"
          :id="item.id"
          :node="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import jsPlumbSetting from "./config/config";

import btnList from "./config/btn";
import btnMethods from "./config/btnMethods";
import core from "./config/coreMethods";
import NodeItem from "./components/NodeItem";
export default {
  name: "Home",
  components: {
    NodeItem,
  },
  data() {
    return {
      jsPlumb: null,
      json: null,
      btnList: btnList,
      requestURL: "http://localhost:3000/columnsLineage",
      jsPlumbSetting: jsPlumbSetting,
      commonGrid: [5, 5], //节点移动最小距离
      minus: "-", //表名和列名的分割符号
    };
  },
  mounted() {
    //jsPlumb使用在mouted而不是created钩子里
    this.jsPlumb = jsPlumb.getInstance();
    //默认使用本地数据
    this.renderLocal();
    //使用接口数据
    // this.renderAPI();
  },
  methods: {
    ...core,
    ...btnMethods,
  },
};
</script>

<style lang="less" scoped>
.flowRegion {
  display: flex;
  width: 90%;
  height: 90%;
  margin: 20px auto;
  border: 1px solid #ccc;
  .btnWrap {
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
  .flowWrap {
    height: 100%;
    position: relative;
    overflow: hidden;
    outline: none !important;
    flex-grow: 1;
    background-image: url("../assets/point.png");
    #flow {
      position: relative;
      width: 100%;
      height: 100%;
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
