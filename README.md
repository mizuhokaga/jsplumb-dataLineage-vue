# jsplumb-dataLineage-vue

基于Vue2和jsPlumb的、模仿sqlFlow前端的数据血缘前端展示页面
- vue2
- [jsplumb2.x https://github.com/jsplumb/jsplumb](https://github.com/jsplumb/jsplumb)
## 1.效果

![图片](https://github.com/mizuhokaga/jsplumb-dataLineage-vue/blob/main/src/assets/sample.png)

- 表级关联：data1 到 middle1
```
表级JSON：
 "edges": 
 [
    {
    "from": {
        "field": "",
        "name": "data1"
            },
    "to": {
        "field": "",
        "name": "middle1"
            }
    },
    ……
]
```
- 字段级关联：middle1的age字段 到 middle3的age字段
```
字段JSON：
"edges":
[
    {
    "from": {
        "field": "age",
        "name": "middle1"
            },
    "to": {
        "field": "age",
        "name": "middle3"
            }
    },
    ……
]
```
## 2.如何启动？
### 2.1安装依赖

```
npm install
```

### 2.2本地运行

```
npm run serve
```
浏览器访问 http://localhost:8620
## 3.功能：
- 根据json渲染血缘图，每个节点可自由拖动；~~移动到连线上==高亮==相关**列和线**~~
- 画布支持缩放 （鼠标中键滚轮缩放）
- 画布的整体无限平移
- 导出血缘为JSON 或 PNG图片

待实现功能：
* minimap


## 4.其他
- 功能详情参考文章: https://blog.csdn.net/qq_44831907/article/details/122923483
- js版本在这里: https://github.com/mizuhokaga/jsplumb-dataLineage
- 现在可以用G6的ER图编写更好
- Vue3版本请切换分支
