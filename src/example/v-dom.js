
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
    var props = this.props;
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

var ul = el('ul', {id: 'list'}, [
    el('li', {class: 'item'}, ['item1']),
    el('li', {class: 'item'}, ['item2']),
    el('li', {class: 'item'}, ['item3']),
]);

document.body.appendChild(ul.render())