
var el = function (tagName, props, children) {
    return new Element(tagName, props, children)
};

// 用来生成Virtual Dom对象
function Element(tagName, props, children) {
    this.tagName = tagName;
    this.props = props;
    this.children = children;
}

// 生成真实Dom
Element.prototype.render = function () {
    // 根据tagName构建Dom节点
    var el = document.createElement(this.tagName);
    var props = this.props || {};
    // 为Dom节点添加属性
    for (var k in props) {
        var v = props[k];
        el.setAttribute(k, v)
    }

    var children = this.children || [];

    children.forEach(function (child) {
        var childEl = (child instanceof Element)
            ? child.render()
            : document.createTextNode(child);

        el.appendChild(childEl)
    });

    return el;
};

var REPLACE = 0,    // 替换掉原来的节点，例如把上面的div换成了span
    REORDER = 1,    // 移动、删除、新增子节点
    PROPS = 2,      // 修改了节点的属性
    TEXT = 3;       // 修改文本内容

// diff函数， 对比两棵树
function diff(oldTree, newTree) {
    var index = 0;
    var patches = {};

    dfsWalk(oldTree, newTree, index, patches);

    return patches
}

// 深度优先遍历
function dfsWalk(oldNode, newNode, index, patches) {
    var currentPatch = [];

    if (newNode === null) { // 节点被删除

    } else if (typeof oldNode === 'string' && typeof newNode === 'string') { // 文字节点改变
        if (newNode !== oldNode) {
            currentPatch.push({type: TEXT, content: newNode})
        }
    }
}

function diffProps(oldNode, newNode) {
    var count = 0;
    var oldProps = oldNode.props,
        newProps = newNode.props;

    var key, value;
    var propsPatches = {};

    for (key in oldProps) {
        value = oldProps[key];
        if (newProps[key] !== value) {
            count++;
            propsPatches.key = newProps[key];
        }
    }

    if (!count) {
        return null
    }

    return propsPatches
}












var tree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: blue'}, ['simple virtal dom']),
    el('p', null, ['Hello, virtual-dom']),
    el('ul', null, [el('li', {class: 'item'})])
])


document.body.appendChild(tree.render());

// 3. 生成新的虚拟DOM
var newTree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: red'}, ['simple virtal dom']),
    el('p', null, ['Hello, virtual-dom']),
    el('ul', null, [el('li'), el('li')])
])