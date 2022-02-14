<template>
  <div class="nodeItem" :style="nodeCoordinate">
    <div class="nodeHeader" :style="setHeaderColor(node.type)">
      {{ node.name }}
    </div>
    <ul :id="`${node.id}${minus}cols`" class="cols">
      <li
        class="col"
        v-for="col in node.columns"
        :key="`${node.name}${minus}${col.name}`"
        :id="`${node.name}${minus}${col.name}`"
      >
        {{ col.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { tbType } from "../config/tbType";
export default {
  name: "NodeItem",
  props: {
    node: Object,
  },
  data() {
    return {
      tbType: tbType,
      minus: "-", //表名和列名的分割符号
    };
  },
  methods: {
    setHeaderColor(type) {
      for (let key in tbType) {
        if (type === key) {
          return {
            backgroundColor: tbType[key].color,
          };
        }
      }
    },
  },
  computed: {
    nodeCoordinate: {
      get() {
        return {
          top: this.node.top + "px",
          left: this.node.left + "px",
        };
      },
    },
  },
};
</script>

<style lang="less" scoped>
.nodeItem {
  position: absolute;
  display: felx;
  cursor: move;
  border: 1px solid #b7b6b6;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  justify-items: center;
  align-items: center;
  z-index: 9995;
  .nodeHeader {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    padding: 0 12px;
    background-color: #91c051;
    color: white;
    font-size: 12px;
  }
  .col {
    list-style: none;
    background-color: #fff;
    padding: 1px 10px;
    font-size: smaller;
    width: auto;
    /*行内文本太长后面的就省略*/
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>