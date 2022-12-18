import panzoom from "panzoom";

const comm = {
    //添加端点
    addEndpoint(elID, anchorArr) {
        //AnchorArr 可能有多个锚点需要添加
        anchorArr.forEach(anchor => {
            this.jsplumbInstance.addEndpoint(elID, {
                anchors: anchor,
                uuid: elID + this.minus + anchor
            }, this.commConfig)
        })
    },
    //将端点连线
    connectEndpoint(from, to) {
        this.jsplumbInstance.connect({
            uuids: [from, to]
        }, this.commConfig);
    },
    //封装拖动，添加辅助对齐线功能
    draggableNode(nodeID) {
        this.jsplumbInstance.draggable(nodeID, {
            grid: this.commGrid,
            drag: (params) => {
                this.alignForLine(nodeID, params.pos)
            },
            start: () => {
            },
            stop: (params) => {
                this.auxiliaryLine.isShowXLine = false
                this.auxiliaryLine.isShowYLine = false
                this.changeNodePosition(nodeID, params.pos)
            }
        })
    },
    //移动节点时，动态显示对齐线
    alignForLine(nodeID, position) {
        let showXLine = false, showYLine = false
        this.json.nodes.some(el => {
            if (el.name !== nodeID && el.left == position[0]) {
                this.auxiliaryLinePos.x = position[0];
                showYLine = true
            }
            if (el.name !== nodeID && el.top == position[1]) {
                this.auxiliaryLinePos.y = position[1];
                showXLine = true
            }
        })
        this.auxiliaryLine.isShowYLine = showYLine
        this.auxiliaryLine.isShowXLine = showXLine
    },
    changeNodePosition(nodeID, pos) {
        this.json.nodes.some(v => {
            if (nodeID == v.name) {
                v.left = pos[0]
                v.top = pos[1]
                return true
            } else {
                return false
            }
        })
    },
    //初始化缩放功能
    initPanZoom() {
        const mainContainer = this.jsplumbInstance.getContainer();
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
                let shouldIgnore = e.ctrlKey;
                return shouldIgnore;
            }
        });
        this.jsplumbInstance.mainContainerWrap = mainContainerWrap;
        this.jsplumbInstance.pan = pan;
        // 缩放时设置jsPlumb的缩放比率
        pan.on("zoom", e => {
            const {x, y, scale} = e.getTransform();
            this.jsplumbInstance.setZoom(scale);
            //根据缩放比例，缩放对齐辅助线长度和位置
            this.auxiliaryLinePos.width = (1 / scale) * 100 + '%'
            this.auxiliaryLinePos.height = (1 / scale) * 100 + '%'
            this.auxiliaryLinePos.offsetX = -(x / scale)
            this.auxiliaryLinePos.offsetY = -(y / scale)
        });
        pan.on("panend", (e) => {
            const {x, y, scale} = e.getTransform();
            this.auxiliaryLinePos.width = (1 / scale) * 100 + '%'
            this.auxiliaryLinePos.height = (1 / scale) * 100 + '%'
            this.auxiliaryLinePos.offsetX = -(x / scale)
            this.auxiliaryLinePos.offsetY = -(y / scale)
        })
        // 平移时设置鼠标样式
        mainContainerWrap.style.cursor = "move";
        mainContainerWrap.addEventListener("mousedown", function wrapMousedown() {
            this.style.cursor = "grabbing";
            mainContainerWrap.addEventListener("mouseout", function wrapMouseout() {
                this.style.cursor = "move";
            });
        });
        mainContainerWrap.addEventListener("mouseup", function wrapMouseup() {
            this.style.cursor = "move";
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
    }

}

export default comm
