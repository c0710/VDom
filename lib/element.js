const _ = require('./util');

function Element(tagName, props, children) {
    if (!(this instanceof Element)) {
        if (!_.isArray(children) && children != null) {
            children = _.slice(arguments, 2).filter(_.truthy)
        }

        return new Element(tagName, props, children)
    }

    // 如果只传了两个参数且第二个参数为数组，则默认把第二个参数当做children，将props置为空对象
    if (_.isArray(props)) {
        children = props;
        props = {};
    }

    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props ? props.key : void 0;

    var count = 0;

    _.each(children, function (child, i) {
        if (child instanceof Element) {
            count += child.count;
        } else {
            children[i] = '' + child
        }
        count++
    });

    this.count = count

}