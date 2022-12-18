//配置左侧按钮组 ,请确保 type的值 与 src/views/methods/buttonMetohds的函数名保持一致,否则调用失败
const buttonGroup=[{
    label:'下载JSON',
    icon:require('@/assets/svg/json.svg'),
    type:'downloadJSON'
},{
    label:'下载为图片',
    icon:require('@/assets/svg/link.svg'),
    type:'downloadIMG'
},{
    label:'渲染本地数据',
    icon:require('@/assets/svg/local.svg'),
    type:'renderLocal'
},{
    label:'清空画布',
    icon:require('@/assets/svg/clear.svg'),
    type:'clear'
}]

export default buttonGroup
