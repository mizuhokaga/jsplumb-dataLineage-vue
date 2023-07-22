import colorFields from "./tableTypeMappingColor";

const commConfig = {
    grid: [10, 10],
    Container: "flow",
    //四种样式：Bezier/Straight/Flowchart/StateMachine
    Connector: ["Bezier", {curviness: 10}],
    // Connector: ["Straight", {stub: [20, 50], gap: 0}],
    // Connector: ["Flowchart", { stub: [20, 10], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
    // Connector: ["StateMachine"],
    // 连线的端点
    Endpoint: ["Dot", {radius: 1}],
    // 端点的样式
    EndpointStyle: {
        fill: "#fff",
        outlineWidth: 1
    },
    // 通常连线的样式
    PaintStyle: {
        stroke: colorFields[2].color,
        strokeWidth: 2
    },
    //hover激活连线的样式
    HoverPaintStyle: {
        stroke: colorFields[3].color,
        strokeWidth: 2
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

export default commConfig
