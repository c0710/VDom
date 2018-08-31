var _ = require('./util');
var el = require('./element');
var patch = require('./patch');


function diff(oldTree, newTree) {
    var index = 0;
    var patches = {};
    dfsWalk()
}

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
        // diff props
        var propsPatch = diffProps(oldNode, newNode);
        if (propsPatch) {
            currentPatch.push({type: patch.PROPS, props: propsPatch});
        }

        // Diff children

    }
    

}

function diffChildren() {
    
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

