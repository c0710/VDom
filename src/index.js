import el from './element';
import diff from './diff'
import patch from './patch'

let tree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: blue'}, ['simple virtal dom']),
    el('p', null, ['Hello, virtual-dom']),
    el('ul', null, [el('li', {class: 'item'}, ['hahah'])])
])

// 3. 生成新的虚拟DOM
let newTree = el('div', {'id': 'container'}, [
    el('h1', {style: 'color: blue'}, ['simple virtal dom11111']),
    el('h4', null, ['Hello, virtual-dom2222']),
    el('ul', null, [el('li')])
])


const root = document.getElementById('app');

let treeDom = tree.render();

root.appendChild(treeDom);


let btn = document.getElementById('btn');

btn.addEventListener('click', () => {

    let patches = diff(tree, newTree);

    patch(treeDom, patches);
}, false);










