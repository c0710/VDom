const _ = require('./util');
const el = require('./element');
const patch = require('./patch');
const listDiff = require('./list-diff').diff;
const log = console.log;

function diff(oldTree, newTree) {
    var index = 0;
    var patches = {};
    dfsWalk(oldTree, newTree, index, patches);

    return patches
}

// 对两棵树进行深度优先遍历
function dfsWalk(oldNode, newNode, index, patches) {
    // currentPatch存放当前一个新旧节点的所有差异
    // patches[0] = [{difference}, {difference}, ...]  用数组存储新旧节点的不同
    var currentPatch = [];

    if(newNode === null) {  // 删除了节点
        // Do nothing
        // ...
    } else if (typeof newNode === 'string' && typeof oldNode === 'string') {
        if (newNode !== oldNode) {
            currentPatch.push({type: patch.TEXT, content: newNode}) // 改变了文字节点
        }
    } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {    // 标签一样，比较props和children
        // Diff props
        var propsPatch = diffProps(oldNode, newNode);
        if (propsPatch) {
            currentPatch.push({type: patch.PROPS, props: propsPatch});
        }

        // Diff children
        diffChildren(
            oldNode.children,
            newNode.children,
            index,
            patches,
            currentPatch
        )
    } else {
        currentPatch.push({type: patch.REPLACE, node: newNode})
    }

    if (currentPatch.length) {
        patches[index] = currentPatch
    }

}

//
/**
 *  遍历子节点
 *  @oldChildren    当前比较的旧节点的子节点集合
 *  @newChildren    当前比较的新节点的子节点集合
 *  @index          当前比较的节点的index
 *  @patches        整个大的diff对象
 *  @currentPatch   当前比较的节点的差异(diff)对象(patches中的一项)
 *
 * */
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    var diffs = listDiff(oldChildren, newChildren, 'key')
    newChildren = diffs.children

    if (diffs.moves.length) {
        var reorderPatch = { type: patch.REORDER, moves: diffs.moves }
        currentPatch.push(reorderPatch)
    }


    var currentNodeIndex = index;   // 当前比较的节点的index

    var leftNode = null;            // 从左向右遍历，如果为null说明是最左边的child节点，每次比较完一个child节点，将起作为leftNode的值

    oldChildren.forEach(function (child, i) {
        var newChild = newChildren[i];
        currentNodeIndex = (leftNode && leftNode.count)
            ? currentNodeIndex + leftNode.count + 1
            : currentNodeIndex + 1;
        dfsWalk(child, newChild, currentNodeIndex, patches);
        leftNode = child;
    })

}

function diffProps(oldNode, newNode) {
    var count = 0;
    var oldProps = oldNode.props;
    var newProps = newNode.props;

    var key, value;
    var propsPatches = {};

    for (key in oldProps) {
        value = oldProps[key];
        if (value !== newProps[key]) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }
    
    for (key in newProps) {
        value = newProps[key];
        if (!oldProps.hasOwnProperty(key)) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    if (count === 0) {
        return null
    }

    return propsPatches
}

var tree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: blue'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul', [el('li', {class: 'item'}), 'the first2'])
])



// 3. 生成新的虚拟DOM
var newTree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: red'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul',
        [
            'the first',
            'the first2',
            el('li', {name: 'insert dom'}, ['insert1', el('h6', {style: 'color: yellow'}, ['insert virtal dom'])]),
            'hahaha',
            'end'
        ])
])

log(JSON.stringify(diff(tree, newTree)));

