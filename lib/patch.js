
var REPLACE = 0;
var REORDER = 1;
var PROPS = 2;
var TEXT = 3;

function patch (node, patches) {
    var walker = {index: 0};
    dfsWalk(node, walker, patches);
}

function dfsWalk(node, walker, patches) {
    var currentPatches = patches[walker.index];

    var len = node.childNodes.length
        ? node.childNodes.length
        : 0;


}

patch.REPLACE = REPLACE;
patch.REORDER = REORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;

module.exports = patch;