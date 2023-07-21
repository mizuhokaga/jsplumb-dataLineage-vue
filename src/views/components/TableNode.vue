<template>
  <div class="table-node" :style="[setCoordinate,setColor(node.type,8620)]">
    <!--    表头：放置表名-->
    <div :id="`${node.name}${minus}`" class="table-node-name" :style="setColor(node.type,17)">
      {{ node.name }}
    </div>
    <!--表域：放置表字段-->
    <div :id="`${node.name}${minus}fields`" class="table-node-fields">
      <!-- 表名和字段名拼接后用于jsplumb绑定id与key确定节点（绘制端点和连线时用到,参考Index.vue的drawing方法） 请保证组合而成的id唯一，否则连线失败 -->
      <div
          v-for="field in node.fields"
          :id="`${node.name}${minus}${field.name}`"
          :key="`${node.name}${minus}${field.name}`"
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
  data() {
    return {
      minus: '-'
    }
  },
  methods: {
    // 设置TableNode颜色：
    // 如果是 table-node 仅设置边框，如果是table-node-name 设置背景颜色
    setColor(t, flag) {
      for (let item in colorFields) {
        if (t === colorFields[item].type) {
          // 如果flag是偶数（flag=8620 魔数纯粹自己开心）
          if ((flag & 1) === 0) {
            return {
              border: colorFields[item].color,
              borderStyle: 'solid',
              borderWidth: '1px'
            }
          } else {
            // 如果flag是奇数
            return {
              backgroundColor: colorFields[item].color
            }
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
