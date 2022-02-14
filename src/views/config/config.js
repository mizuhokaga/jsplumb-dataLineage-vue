import {
  tbType
} from "./tbType";
const jsPlumbSetting = {
  grid: [10, 10],
  Container: "flow",
  // 连线的样式四种类型：Bezier/Straight/Flowchart/StateMachine
  connector: ['StateMachine'],
  // 连线的端点
  Endpoint: ["Dot", {
    radius: 1,
  }],
  // 端点的样式
  EndpointStyle: {
    fill: "#c4c4c4",
    outlineWidth: 1
  },
  // connectorStyle: {
  //   stroke:tbType["Union"].color,
  //   strokeWidth: 2
  // },
  // connectorHoverStyle: {
  //   stroke: tbType["RS"].color,
  //   strokeWidth: 3
  // },
  // 绘制线
  PaintStyle: {
    stroke: tbType["Union"].color,
    strokeWidth: 3
  },
  HoverPaintStyle: {
    stroke: tbType["RS"].color,
    strokeWidth: 4
  },
  maxConnections: -1, // 设置连接点最多可以连接几条线 -1不限
  // 绘制箭头
  Overlays: [
    [
      "Arrow",
      {
        width: 8,
        length: 10,
        location: 1
      }
    ]
  ],
  LogEnabled: false, //是否打开jsPlumb的内部日志记录
}

export default jsPlumbSetting