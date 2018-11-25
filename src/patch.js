const REPLACE = 'REPLACE';  // 替换掉原来的节点
const REORDER = 'REORDER';  // 移动、删除、新增子节点
const PROPS = 'PROPS';      // 修改了节点的属性
const TEXT = 'TEXT';        // 文本节点内容改变

const patch = (node, patches) => {
    let walker = {index: 0};
    dfsWalk(node, walker, patches)
}

const dfsWalk = (node, walker, patches) => {

    let currentPatches = patches[walker.index];

    var len = node.childNodes
        ? node.childNodes.length
        : 0;

    for (let i = 0; i < len; i++) { // 深度遍历子节点
        let child = node.childNodes[i];
        walker.index++;
        dfsWalk(child, walker, patches)
    }
    if (currentPatches) {
        applyPatches(node, currentPatches) // 对当前节点进行DOM操作
    }

}

const applyPatches = (node, patch) => {
    console.log(node, patch)
    for (let i = 0; i < patch.length; i++) {
        let patchType = patch.type;
        switch (patchType) {
            case TEXT:
                console.log('text change! new text is ' + patch.content);
                break;
            case PROPS:
                console.log('props change!');
                break;
            case REPLACE:
                console.log('node has been replace!')
        }
    }
}




export {
    REPLACE,
    REORDER,
    PROPS,
    TEXT
}

export default patch