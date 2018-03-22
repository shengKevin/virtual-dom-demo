'use strict';

import util from './util';

// 节点的四种变动
const REPLACE = 0;
const REORDER = 1;
const PROPS = 2;
const TEXT = 3;

export default function patch(node, patches) {
    const walker = {
        index: 0
    };
    dfsWalk(node, walker, patches);
}

patch.REPLACE = REPLACE;
patch.REORDER = REORDER;
patch.PROPS = PROPS;
patch.TEXT = TEXT;

function dfsWalk(node, walker, patches) {
    const currentPatches = patches[walker.index];
    let len = node.childNodes ? node.childNodes.length : 0;
    for (let i = 0; i < len; i++) {
        let child = node.childNodes[i];
        walker.index++;
        dfsWalk(child, walker, patches);
    }

    if (currentPatches) {
        applyPatches(node, currentPatches);
    }
}

function applyPatches(node, currentPatches) {
    currentPatches.forEach(currentpatch=> {
        switch (currentpatch.type) {
            case REPLACE:
                let newNode = (typeof currentpatch.node === 'String') ?
                    document.createTextNode(currentpatch.node) :
                    currentpatch.node.render();
                node.parentNode.replaceChild(newNode, node);
                break;
            case REORDER:
                reoderChildren(node, currentpatch.moves);
                break;
            case PROPS:
                setProps(node, currentpatch.props);
                break;
            case TEXT:
                if (node.textContent) {
                    node.textContent = currentpatch.content;
                } else {
                    node.nodeValue = currentpatch.content;
                }
        }
    })
}

function reoderChildren(node, moves) {
    const staticNodeList = [...node.childNodes];
    const maps = {};
    staticNodeList.forEach(node=> {
        if (node.nodeType === 1) {
            let key = node.getAttribute('key');
            if (key) {
                maps[key] = node;
            }
        }
    });

    moves.forEach(move=> {
        let index = move.index;
        if (move.type === 0) { //删除节点 list-dff2
            node.removeChild(node.childNodes[index])
        } else {
            let insertNode = maps[move.item.key] ?
                maps[move.item.key] : (typeof move.item === 'object') ?
                    move.item.render() : document.createTextNode(move.item);
            staticNodeList.splice(index, 0, insertNode);
            node.insertBefore(insertNode, node.childNodes[index] || null);
        }
    })
}

function setProps(node, props) {
    for (let key in props) {
        if (!props[key]) {
            node.removeAttribute(key)
        } else {
            let value = props[key];
            util.setAttr(node, key, value)
        }
    }
}