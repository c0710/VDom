const type = obj => Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');

const isArray = list => type(list) === 'Array';

const slice = (arrayLike, index) => Array.prototype.slice.call(arrayLike, index);

const isString = obj => type(obj) === 'String';

const setAttr = (node, key, value) => {
    switch (key) {
        case 'style':
            node.style.cssText = value;
            break;
        case 'value':
            let tagName = node.tagName || '';
            tagName = tagName.toLowerCase();
            if (
                tagName === 'input' || tagName === 'textarea'
            ) {
                node.value = value
            } else {
                node.setAttribute(key, value)
            }
            break;
        case 'className':
            node.setAttribute('class', value);
            break;
        default:
            if (isEventProp(key)) {
                node.addEventListener(extractEventName(key), value);
            } else if (typeof key === 'boolean') { // 兼容属性为布尔值的情况
                if (value) {
                    node.setAttribute(key, value);
                }
                node[key] = value;
            } else {
                node.setAttribute(key, value);
            }
            break
    }
};

function isEventProp(name) {
    return /^on/.test(name);
}

function extractEventName(name) {
    return name.slice(2).toLowerCase();
}

export {
    type,
    isArray,
    slice,
    isString,
    setAttr
}