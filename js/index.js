'use strict';

import util from './util';
import VElement from './VElement';
import diff from './diff'
import patch from './patch';
// import diff from 'list-diff2'

const vdom = VElement('div', { 'id': 'container' }, [
    VElement('h1', { style: 'color:red' }, ['simple virtual dom']),
    VElement('p', ['hello virtual-dom']),
    VElement('ul', [VElement('li', ['item #1']), VElement('li', ['item #2'])]),
]);
const rootContent = vdom.render();

const root = document.getElementById('root');

root.appendChild(rootContent);

const newVdom = VElement('div', { 'id': 'container' }, [
    VElement('h1', { style: 'color:red' }, ['simple virtual dom']),
    VElement('ul', [VElement('li', ['new-item #1']), VElement('li', ['new-item #2']), VElement('li', ['new-item #3'])]),
]);

const patches = diff(vdom, newVdom);
console.log(patches);
patch(rootContent,patches);
