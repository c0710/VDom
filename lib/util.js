var _ = exports;

_.type = function (obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
};

_.isArray = function isArray (list) {
    return _.type(list) === 'Array'
};

_.slice = function slice (arrayLike, index) {
    return Array.prototype.slice.call(arrayLike, index)
};

_.isArray = function isArray (list) {
    return _.type(list) === 'Array'
};

_.truthy = function truthy (value) {
    return !!value
};

_.each = function (arr, cb) {
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        cb(item, i, arr)
    }
};

_.setAttr = function (node, key, value) {
    switch (key) {
        case 'style':
            node.style.cssText = value;
            break;
        case 'value':
            var tagName = node.tagName || '';
            tagName = tagName.toLowerCase();
            if(tagName === 'input' || tagName === 'textarea') {
                node.value = value;
            } else {
                node.setAttribute(key, value)
            }
            break;
        default:
            node.setAttribute(key, value);
            break;
    }
};