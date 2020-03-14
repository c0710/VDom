import el from "./element";
import diff from "./diff";
import patch from "./patch";

let tree = el("div", {
    id: "container"
}, [
    el("h1", {
        style: "color: blue"
    }, ["simple virtal dom"]),
    el("p", ["Hello, virtual-dom"]),
    el("ul", [el("li", {
        class: "item"
    }, ["hahah"])])
]);

// 3. 生成新的虚拟DOM
let newTree = el("div", {
    id: "container"
}, [
    el("h1", {
        style: "color: blue"
    }, ["simple virtal dom11111"]),
    el("h4", null, ["Hello, virtual-dom2222"]),
    el("ul", null, [el("li", [123])])
]);

// 带有key的节点对比
let list = el('ul', {
    className: 'list'
}, [
    el('li', {
        key: 'key1'
    }, ['item1']),
    el('li', {
        key: 'key2'
    }, ['item2']),
    el('li', {
        key: 'key3'
    }, ['item3']),
    el('li', {
        key: 'key4'
    }, ['item4']),
    el('li', {
        key: 'key5'
    }, ['item5']),
])
let newList = el('ul', {
    className: 'list'
}, [
    el('li', {
        key: 'key1'
    }, [el('span', {
        className: 'newItem1Class'
    }, ['new item1 value']), el('span', ['other new item1 value '])]),
    // el('li', {
    //     key: 'key1'
    // }, ['item111']),
    el('li', {
        key: 'key3'
    }, ['item3']),
    el('li', {
        key: 'key2'
    }, ['item2']),
    el('li', {
        key: 'key4'
    }, ['item4444']),
    el('li', {
        key: 'key5'
    }, ['item5555']),
])

const root = document.getElementById("app");

// let treeDom = tree.render();
let listDom = list.render();
root.appendChild(listDom);


let btn = document.getElementById("btn");

btn.addEventListener(
    "click",
    () => {
        let patches = diff(list, newList);
        patch(listDom, patches);
        // patch(treeDom, patches);
    },
    false
);