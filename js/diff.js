'use strict';

import util from './util';
import patch from './patch';
import listDiff from 'list-diff2';

export default function diff(oldTree, newTree) {
    let index = 0;
    let patches = {};
    treeWalk(oldTree, newTree, index, patches);
    return patches;
}

function treeWalk(oldNode, newNode, index, patches) {
    const currentPatch = [];
    if (newNode === null) {

    } else if (util.isString(oldNode) && util.isString(newNode)) {
        // textNode
        if (oldNode !== newNode) {
            currentPatch.push({
                type: patch.TEXT,
                content: newNode,
            })
        }
    } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
        let propsPatches = diffProps(oldNode, newNode);
        if (propsPatches) {
            currentPatch.push({
                type: patch.PROPS,
                props: propsPatches,
            })
        }
        diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
    }　else {
        //节点类型不同直接替换
        currentPatch.push({ type: patch.REPLACE, node: newNode});
    }

    if (currentPatch.length) {
        patches[index] = currentPatch;
    }


}

function diffProps(oldNode, newNode) {
    let count = 0;
    let oldProps = oldNode.props;
    let newProps = newNode.props;
    let key, value;
    let propsPatches = {};

    // diff props
    for (key in oldProps) {
        value = oldProps[key];
        if (newProps[key] != value) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    //新增props
    for (key in newProps) {
        if (!oldProps.hasOwnProperty(key)) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    if (count === 0) {
        return null
    }

    return propsPatches;
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    let diffs = listDiff(oldChildren, newChildren, 'key');
    newChildren = diffs.children;
    if (diffs.moves.length) {
        const reorderPatch = {
            type: patch.REORDER,
            moves:diffs.moves
        };
        currentPatch.push(reorderPatch);
    }

    let leftNode;
    let currentNodeIndex = index;
    oldChildren.forEach((child, i)=> {
        let newChild = newChildren[i];
        currentNodeIndex = (leftNode && leftNode.count) ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
        treeWalk(child, newChild, currentNodeIndex, patches);
        leftNode = child;
    })

}