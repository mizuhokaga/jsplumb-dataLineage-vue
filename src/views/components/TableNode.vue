<template>
  <div class="table-node" :style="[setCoordinate,setColor(node.type,8620)]">
    <div class="table-node-name" :style="setColor(node.type,0)">
      {{ node.name }}
    </div>
    <div :id="`${node.name}-fields`" class="table-node-fields">
      <!-- 表名和字段名拼接后用于绑定id与key确定节点（绘制节点和连线时用到，参见） 请保证两者的组合唯一 -->
      <div
          v-for="field in node.fields"
          :id="`${node.name}-${field.name}`"
          :key="`${node.name}-${field.name}`"
          class="field"
      >
        <span>{{ field.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import colorFields from "../config/tableTypeMappingColor";

export default {
  name: "TableNode",//表节点组件
  props: {
    node: Object,
  },
  methods: {
    setColor(t, flag) {
      for (let type in colorFields) {
        // flag用于判断设置边框颜色或是表头颜色,8620这个数字和这种判断写法纯粹自己开心
        if (flag >> 1 && t === type) {
          if (t === type) {
            return {
              border: colorFields[type].color,
              borderStyle: 'solid',
              borderWidth: '1px'
            }
          }
        } else if (flag >> 1 === 0 && t === type) {
          return {
            backgroundColor: colorFields[type].color
          }
        }
      }
    }
  },
  computed: {
    setCoordinate: {
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
.table-node {
  position: absolute;
  cursor: move;
  border: 1px solid #000;
  align-items: center;
  z-index: 9995;
  border-radius: 3px 3px 0 0;
  .table-node-name {
    height: 22px;
    line-height: 22px;
    padding: 0 22px;
    background-color: #91c051;
    color: white;
    font-size: 12px;
  }
  .table-node-fields {
    background-color: #fff;
    .field {
      transform: scale(.916);
      font-family: verdana, sans serif;
      padding: 1px 5px;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis; /*行内文本太长后面的就省略*/
      word-break: break-all;
    }
  }
}
</style>
