function Element(tagName, props, children) {

    //  如果没有传props,则默认props为{}
    if (Array.isArray(props)) {
        children = props;
        props = {}
    }

    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props ?
        props.key :
        void 666;

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

        // el.setAttribute(k, value);
        setProp(el, k, value)
    }

    let children = this.children;
    children.forEach(child => {
        let childEl = (child instanceof Element) ?
            child.render() // 如果子节点也是VDOM，递归构建DOM节点
            :
            document.createTextNode(child);

        el.appendChild(childEl)
    })

    return el

}

function isEventProp(name) {
    return /^on/.test(name);
}

function extractEventName(name) {
    return name.slice(2).toLowerCase();
}

function setProp($target, name, value) {
    if (name === 'className') { // 因为class是保留字，JSX使用className来表示节点的class
        return $target.setAttribute('class', value);
    } else if (isEventProp(name)) { // 针对 on 开头的属性，为事件
        return $target.addEventListener(extractEventName(name), value);
    } else if (typeof value === 'boolean') { // 兼容属性为布尔值的情况
        if (value) {
            $target.setAttribute(name, value);
        }
        return $target[name] = value;
    } else {
        return $target.setAttribute(name, value);
    }
}


export default (tagName, props, children) => new Element(tagName, props, children)