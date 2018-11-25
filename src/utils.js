
const type = obj => Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');

const isArray = list => type(list) === 'Array';

const slice = (arrayLike, index) =>  Array.prototype.slice.call(arrayLike, index);

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
                // if it is not a input or textarea, use `setAttribute` to set
                node.setAttribute(key, value)
            }
            break;
        default:
            node.setAttribute(key, value);
            break
    }
};

export {
    type,
    isArray,
    slice,
    isString,
    setAttr
}