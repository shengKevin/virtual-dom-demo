'use strict';

const util = {};

util.type = obj=> {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g,'');
};

util.isArray = list=> {
    return util.type(list) === 'Array';
};

util.isString = list=> {
    return util.type(list) === 'String';
};

util.setAttr = (node, key, value)=> {
  switch (key) {
      case 'style':
          node.style.cssText = value;
          break;
      case 'value':
          let { tagName = '' } = node;
          tagName = tagName.toLowerCase();
          if (tagName === 'input' || tagName === 'textarea') {
              node.value = value;
          } else {
              node.setAttribute(key, value);
          }
          break;
      default:
          node.setAttribute(key, value);
          break;
  }
};

export default util;