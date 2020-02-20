function Element(tagName, props, children) {

    //  如果没有传props,则默认props为{}
    if (Array.isArray(props)) {
        children = props;
        props = {}
    }

    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props
        ? props.key
        : void 666;

    let count = 0;
    // 计算children的数量
    this.children.forEach((child, index) => {
        if (child instanceof Element) {
            count += child.count
        } else {
            this.children[index] = '' + child
        }
        count++
    })

    this.count = count

}

Element.prototype.render = function () {

    // 根据tagName 构建DOM标签
    let el = document.createElement(this.tagName);

    let props = this.props;
    for (let k in props) {
        let value = props[k];

        el.setAttribute(k, value);
    }

    let children = this.children;
    children.forEach(child => {
        let childEl = (child instanceof Element)
            ? child.render()    // 如果子节点也是VDOM，递归构建DOM节点
            : document.createTextNode(child);

        el.appendChild(childEl)
    })

    return el

}


export default (tagName, props, children) => new Element(tagName, props, children)
