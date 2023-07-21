import {GenNonDuplicateID} from "@/common/until"
import html2canvas from "html2canvas"
import canvg from "canvg"

const buttonMethods = {
    click(e) {//根据点击类型的不同分流到指定函数
        this[e]();
    },

    downloadJSON() {
        if (this.json == null) {
            this.$message.error("JSON IS NULL!!!");
            return;
        }
        if (
            Object.keys(this.json.nodes).length !== 0 &&
            Object.keys(this.json.edges).length !== 0
        ) {
            let datastr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(this.json));
            let a = document.createElement("a");
            a.setAttribute("href", datastr);
            a.setAttribute(
                "download",
                new Date().getTime() + GenNonDuplicateID(8) + ".json"
            );
            a.click();
            a.remove();
        }
    },
    downloadIMG() {
        if (this.json == null) {
            this.$message.error("JSON IS NULL!!!");
            return;
        }
        //将边（svg）转化为canvas的形式
        const flow = this.$refs.flowWrap
        //svg转换canvas会导致svg无法拖动,使用临时元素
        const tmpFlow = flow.cloneNode(true)
        flow.appendChild(tmpFlow)
        this.svgToCanvas(tmpFlow)
        html2canvas(tmpFlow, {
            taintTest: false,
            scale: window.devicePixelRatio < 2 ? 2 : window.devicePixelRatio, //scala属性解决生成的canvas模糊问题
        }).then((canvas) => {
            let blob = this.base64ToFile(canvas.toDataURL('image/png'));
            let a = document.createElement('a');
            a.setAttribute('href', URL.createObjectURL(blob));
            a.setAttribute('download', new Date().getTime() + GenNonDuplicateID(8) + '.png');
            URL.revokeObjectURL(blob);
            a.click();
            a.remove();
            flow.removeChild(tmpFlow) // 移除临时tmpFlow
        }).catch((error) => {
            flow.removeChild(tmpFlow) // 移除临时tmpFlow
            this.$message.error('血缘图生成失败,请查看控制台错误')
            console.log(error);
        });
    },
    // 下载图片的辅助方法：将base64转换成file文件
    base64ToFile(dataurl) {
        let arr = dataurl.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    },
    //下载图片的辅助方法： canvg将svg转canvas
    svgToCanvas(element) {
        const svgElems = element.querySelectorAll('svg');
        svgElems.forEach(node => {
            let parentNode = node.parentNode;
            let svg = node.outerHTML.trim();
            let canvas = document.createElement("canvas");
            canvg(canvas, svg);
            canvas.style.zIndex = 9
            if (node.style.position) {
                canvas.style.position += node.style.position;
                canvas.style.left += node.style.left;
                canvas.style.top += node.style.top;
            }
            parentNode.removeChild(node);
            parentNode.appendChild(canvas);
        });
    },

    renderLocal() {
        if (this.json.nodes.length == 0) {
            this.renderDefaultLineage()
            this.$message.success("render success!");
        } else this.$message.warning("render duplication!");
    },
    clear() {
        if (Object.keys(this.json.nodes).length) {
            this.jsplumbInstance.deleteEveryConnection();
            this.jsplumbInstance.deleteEveryEndpoint();
            this.json.nodes.forEach((node) => {
                this.jsplumbInstance.remove(node.name);
            });
        }
        this.json = {
            nodes: [],
            edges: []
        }
    }
}
export default buttonMethods
