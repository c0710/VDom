import { setAttr } from './utils';

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

    const len = node.childNodes
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
    for (let i = 0; i < patch.length; i++) {
        let currentPatch = patch[i];
        let patchType = currentPatch.type;
    
        switch (patchType) {
            case TEXT:
                if (node.textContent) {
                    node.textContent = currentPatch.content
                  } else {
                    node.nodeValue = currentPatch.content
                  }
                // console.log('text change! new text is ' + currentPatch.content);
                break;
            case PROPS:
                for(let [key, val] of Object.entries(currentPatch.props)) {
                    if (val === undefined) {
                        node.removeAttribute(key)
                    } else {
                        setAttr(node, key, val);
                    }
                }
                break;
            case REPLACE:
                // 将虚拟dom对象转换为真实dom
                let newNode = (typeof currentPatch.node === 'string') ?  document.createTextNode(currentPatch.node) : currentPatch.node.render();
                node.parentNode.replaceChild(newNode, node);
                break;
            case REORDER:
                moveChild(node, currentPatch.moves);
                break
        }
    }
}

function moveChild(node, moves) {
    let staticNodeList = Array.from(node.childNodes);
    // console.log(staticNodeList);

    let keyNodeMap = {};

    staticNodeList.forEach(node => {
        // 如果是dom节点，则将key与对应的node节点映射
        if (node.nodeType === 1) {
            const key = node.getAttribute('key');
            if (key) {
                keyNodeMap[key] = node;
            }
        }
    })
    moves.forEach(move => {
        const index = move.index;
        // type为0时说明删除了index位置下的节点
        console.log(move);
        if (move.type === 0) {
            // 有可能在删除之前已经插入过 改变了原children索引
            if (staticNodeList[index] === node.childNodes[index]) {
                node.removeChild(node.childNodes[index]);
            }
            staticNodeList.splice(index, 1);
        } else {
            // type为1时将move.item插入到index位置
            let insertNode = keyNodeMap[move.item.key] 
            ? keyNodeMap[move.item.key] : (typeof move.item === 'object') 
            ? move.item.render() : document.createTextNode(move.item)
            staticNodeList.splice(index, 0, insertNode);
            node.insertBefore(insertNode, node.childNodes[index] || null)
        }
        
    })
}




export {
    REPLACE,
    REORDER,
    PROPS,
    TEXT
}

export default patch