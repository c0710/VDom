var _ = require('./util');
var el = require('./element');
var patch = require('./patch');
var log = console.log;

function diff(oldTree, newTree) {
    var index = 0;
    var patches = {};
    dfsWalk(oldTree, newTree, index, patches);

    return patches
}

// 对两棵树进行深度优先遍历
function dfsWalk(oldNode, newNode, index, patches) {
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

// 遍历子节点
function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    var currentNodeIndex = index;
    var leftNode = null;

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

   function dfsWalk1 (oldNode, newNode, index, patches) {
    var currentPatch = [];

    // Node is removed.
    if (newNode === null) {
        // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
        // TextNode content replacing
    } else if (_.isString(oldNode) && _.isString(newNode)) {
        if (newNode !== oldNode) {
            currentPatch.push({ type: patch.TEXT, content: newNode })
        }
        // Nodes are the same, diff old node's props and children
    } else if (
        oldNode.tagName === newNode.tagName &&
        oldNode.key === newNode.key
    ) {
        // Diff props
        var propsPatches = diffProps(oldNode, newNode);
        if (propsPatches) {
            currentPatch.push({ type: patch.PROPS, props: propsPatches })
        }
        // Diff children. If the node has a `ignore` property, do not diff children
        if (!isIgnoreChildren(newNode)) {
            diffChildren(
                oldNode.children,
                newNode.children,
                index,
                patches,
                currentPatch
            )
        }
        // Nodes are not the same, replace the old node with new node
    } else {
        currentPatch.push({ type: patch.REPLACE, node: newNode })
    }


    if (currentPatch.length) {
        patches[index] = currentPatch
    }
}

var tree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: blue'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul', [el('li', {class: 'item'})])
])



// 3. 生成新的虚拟DOM
var newTree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: red'}, ['simple virtal dom']),
    el('p', ['Hello, virtual-dom']),
    el('ul', [el('li'), el('li')])
])

log(diff(tree, newTree))



