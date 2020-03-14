
import {
    setAttr
} from './utils';

class Element {
    constructor(tagName, props, children) {
        if (Array.isArray(props)) {
            children = props
            props = {}
        }
        this.tagName = tagName;
        this.props = props || {};
        this.children = children || [];
        this.$el = null;
        this.key = props ? props.key : void 0;

        // 记录当前节点所有子节点的个数
        let count = 0

        this.children.forEach(child => {
            if (child instanceof Element) {
                count += child.count;
            } else {
                child = String(child);
            }

            count++;
        })

        this.count = count;
    }

    render() {
        // 根据tagName 构建DOM标签
        let el = document.createElement(this.tagName);

        let props = this.props;
        for (let k in props) {
            let value = props[k];

            // el.setAttribute(k, value);
            setAttr(el, k, value)
        }


        // 如果有子节点 则递归处理子节点
        let children = this.children || [];
        children.forEach(child => {
            let childEl = (child instanceof Element) ?
                child.render() // 如果子节点也是VDOM，递归构建DOM节点
                :
                document.createTextNode(child);

            el.appendChild(childEl)
        })
        this.$el = el;

        return el
    }


}

export default (tagName, props, children) => new Element(tagName, props, children)