import * as patch from './patch'
import * as _ from './utils'
import listDiff from 'list-diff2'


const diff = (oldTree, newTree) => {
    let index = 0; //  每个节点的标识
    let patches = Object.create(null); // 纪录所有差异的字典
    dfsWalk(oldTree, newTree, index, patches);

    return patches
};

const dfsWalk = (oldNode, newNode, index, patches) => {
    let currentPatch = [];

    if (!newNode) {
        // 节点被删除
        return;

    } else if (_.isString(oldNode) && _.isString(newNode)) {
        // 如果新旧节点都是字符串，且不相等时， 新节点内容代替旧节点
        if (oldNode !== newNode) {
            currentPatch.push({
                type: patch.TEXT,
                content: newNode
            })
        }
    } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {

        // 如果tagName相同， 并且拥有同样的key, 计算props的差异，如果有
        let propsPatches = diffProps(oldNode, newNode);

        if (propsPatches) {
            currentPatch.push({
                type: patch.PROPS,
                props: propsPatches
            });
        }

        dfsWalkChild(
            oldNode.children,
            newNode.children,
            index,
            patches,
            currentPatch
        )

    } else {

        // 如果tagName不同或者tagName相同但没有key，则新节点直接替换旧节点，不比较其下的子节点
        currentPatch.push({
            type: patch.REPLACE,
            node: newNode
        })
    }

    if (currentPatch.length) {
        patches[index] = currentPatch;
    }
};

// 深度遍历子节点计算
const dfsWalkChild = (oldChildren, newChildren, index, patches, currentPatch) => {
    let diffs = listDiff(oldChildren, newChildren, 'key');
    newChildren = diffs.children
    // 如果调整子节点，包括移动、删除等的话
    if (diffs.moves.length) {
        let reorderPatch = {
            type: patch.REORDER,
            moves: diffs.moves
        }
        currentPatch.push(reorderPatch)
    }

    /**
     * 重点！！！
     */
    let currentNodeIndex = index;
    let leftNode = null;

    oldChildren.forEach((child, i) => {
        let newChild = newChildren[i];
        currentNodeIndex = (leftNode && leftNode.count) ?
            currentNodeIndex + leftNode.count + 1 :
            currentNodeIndex + 1;
        dfsWalk(child, newChild, currentNodeIndex, patches);
        leftNode = child
    })


}

const diffProps = (oldNode, newNode) => {
    let count = 0;
    let oldProps = oldNode.props;
    let newProps = newNode.props;

    let key, value;
    let propsPatches = {};

    // 遍历旧节点所有属性， 对比新节点
    for (key in oldProps) {
        value = oldProps[key];
        // 新节点修改了属性或者删除了属性
        if (newProps[key] !== value) {
            count++;
            propsPatches[key] = newProps[key]
        }
    }

    // 新节点中的新增属性
    for (key in newProps) {
        value = newProps[key];
        if (!oldProps.hasOwnProperty(key)) {
            count++;
            propsPatches[key] = newProps[key]
        }
    }

    // 没有新增
    if (count === 0) {
        return null
    }

    return propsPatches
};




export default diff;