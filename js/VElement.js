'use strict';

import util from './util';

// virtual dom
const VElement = function(tagName, props = {}, children = []) {
    if (!(this instanceof VElement)) {
        return new VElement(tagName, props, children);
    }

    if (util.isArray(props)) {
        children = props;
        props = {};
    }

    let count = 0;
    // 设置虚拟dom的相关属性
    this.tagName = tagName;
    this.props = props;
    this.children = children;
    this.key = props.key;
    this.children.forEach((child, index)=> {
        if (child instanceof VElement) {
            count += child.count;
        } else {
            children[index] = '' + child;
        }
        count++;
    });
    this.count = count;
};

VElement.prototype.render = function () {
    // document.createDocumentFragment()
    const el = document.createElement(this.tagName);
    const props = this.props;
    for (let propsName in props) {
        let propsValue = props[propsName];
        util.setAttr(el, propsName, propsValue);
    }

    this.children.forEach(child=> {
        let childEl = (child instanceof VElement) ? child.render() : document.createTextNode(child);
        el.appendChild(childEl);
    });

    return el;
};

export default VElement;
