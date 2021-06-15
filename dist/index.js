"use strict";var _react=_interopRequireWildcard(require("react"));function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=_default;function _getRequireWildcardCache(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(_getRequireWildcardCache=function(a){return a?c:b})(a)}function _interopRequireWildcard(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!==_typeof(a)&&"function"!=typeof a)return{default:a};var c=_getRequireWildcardCache(b);if(c&&c.has(a))return c.get(a);var d={},e=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var f in a)if("default"!=f&&Object.prototype.hasOwnProperty.call(a,f)){var g=e?Object.getOwnPropertyDescriptor(a,f):null;g&&(g.get||g.set)?Object.defineProperty(d,f,g):d[f]=a[f]}return d.default=a,c&&c.set(a,d),d}function ownKeys(a,b){var c=Object.keys(a);if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);b&&(d=d.filter(function(b){return Object.getOwnPropertyDescriptor(a,b).enumerable})),c.push.apply(c,d)}return c}function _objectSpread(a){for(var b,c=1;c<arguments.length;c++)b=null==arguments[c]?{}:arguments[c],c%2?ownKeys(Object(b),!0).forEach(function(c){_defineProperty(a,c,b[c])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(b)):ownKeys(Object(b)).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))});return a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(a,b){var c=a&&("undefined"!=typeof Symbol&&a[Symbol.iterator]||a["@@iterator"]);if(null!=c){var d,e,f=[],g=!0,h=!1;try{for(c=c.call(a);!(g=(d=c.next()).done)&&(f.push(d.value),!(b&&f.length===b));g=!0);}catch(a){h=!0,e=a}finally{try{g||null==c["return"]||c["return"]()}finally{if(h)throw e}}return f}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&null!=a[Symbol.iterator]||null!=a["@@iterator"])return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}var prntWrpr="prntWrpr",inrWrpr="inrWrpr",igoneKeyList=[27,16,17,18,91,93,37,38,40,39];function deBounce(a,b){var c=null;return function(){var d=arguments;c&&clearTimeout(c),c=setTimeout(function(){return a.apply(void 0,_toConsumableArray(d))},b)}}function _default(a){function b(a,b){var c=document.createRange();c.setStart(a,b),c.setEnd(a,b);var d=window.getSelection();d.removeAllRanges(),c.collapse(!0),d.addRange(c)}function c(){var a=window.getSelection().focusNode;if("#text"!=a.nodeName&&a.getAttribute("wrprTy")==prntWrpr){var b=j(),c=document.createElement("br");b.appendChild(c),a.innerHTML=null,a.appendChild(b)}}function d(){var a=window.getSelection().focusNode;if(a&&a.textContent.startsWith(p)){C(!0);var b=k(a,"wrprTy",inrWrpr),c=b.getBoundingClientRect();G(function(){return{top:c.y+c.height,left:c.x}}),O(function(){return k(a,"wrprTy",inrWrpr)})}else i()}function e(){var a=window.getSelection().focusNode,b=a.textContent,c=_toConsumableArray(b.matchAll(p)).map(function(a){return a.index});if(0!==c.length){var d=[];a.textContent=b.slice(0,c[0]);for(var f,g=0;g<c.length;g++)f=b.slice(c[g],c[g+1]),d.push(f);var e=k(a,"wrprTy",inrWrpr);d.forEach(function(a){var b={};a.startsWith(p)&&(b.color=u),h(e,a,b)})}}function f(a){h(N,"&nbsp;"),N.textContent=p+a[w],J[p+a[w]]=a,i(),g()}function g(){var a=window.getSelection().focusNode,b={};b.value=P.current.innerText;var c=[];Object.keys(J).forEach(function(a){b.value.includes(a)&&c.push(_objectSpread(_objectSpread({mentionKey:a},J[a]),{},{start:b.value.indexOf(a),end:b.value.indexOf(a)+a.length}))}),b.mentions=c,N&&(b.searchKey=N.textContent.slice(1)),r(b)}function h(a,c){var d=2<arguments.length&&arguments[2]!==void 0?arguments[2]:{},e=j();Object.keys(d).forEach(function(a){e.style[a]=d[a]}),e.innerHTML=c,a.insertAdjacentElement("afterEnd",e),b(e.childNodes[0],e.innerText.length)}function i(){C(function(){return!1}),O(null)}function j(){var a=document.createElement("span");return a.setAttribute("wrprTy",inrWrpr),a}function k(a,b,c){for(var d=0;;)if("BODY"==a.nodeName||5<=d){a=null;break}else if(a.getAttribute&&a.getAttribute(b)==c)break;else a=a.parentNode,d++;return a}var l=a.className,m=a.options,n=void 0===m?[]:m,o=a.trigger,p=void 0===o?"@":o,q=a.onChange,r=void 0===q?function(){}:q,s=a.optionsListClass,t=a.triggerColor,u=void 0===t?"#0E85E8":t,v=a.optionDisplayKey,w=void 0===v?"id":v,x=a.ListingUi,y=void 0===x?null:x,z=(0,_react.useState)(!1),A=_slicedToArray(z,2),B=A[0],C=A[1],D=(0,_react.useState)(null),E=_slicedToArray(D,2),F=E[0],G=E[1],H=(0,_react.useState)({}),I=_slicedToArray(H,2),J=I[0],K=I[1],L=(0,_react.useState)(null),M=_slicedToArray(L,2),N=M[0],O=M[1],P=(0,_react.useRef)(),Q=deBounce(function(a){if(!igoneKeyList.includes(a.keyCode)){var f=window.getSelection(),h=f.focusOffset,i=f.focusNode,l=i.textContent;if("backspace"===a.code.toLowerCase()&&c(),l.includes(p)&&!l.startsWith(p))e(a);else if("space"===a.code.toLowerCase()&&l.startsWith(p)){var m=i.textContent;i.textContent=m.slice(0,h-1);var n=j();n.innerHTML=m.slice(h-1,m.length);var o=k(i,"wrprTy",inrWrpr);o.insertAdjacentElement("afterEnd",n),b(n,1)}d(),g()}},100);return _react.default.createElement("div",null,_react.default.createElement("div",{wrprTy:prntWrpr,ref:P,className:l,contentEditable:!0,onClick:function onClick(){return setTimeout(d,0)},onCut:function onCut(){return setTimeout(function(){return c()},0)},onPaste:function onPaste(){return setTimeout(function(){return e()},0)},onKeyUp:function onKeyUp(a){return Q(a)}},_react.default.createElement("span",{wrprTy:inrWrpr},_react.default.createElement("br",null))),B&&F?_react.default.createElement(function(a){var b=a.style;return _react.default.createElement("div",{style:b,className:s},n.map(function(a){return _react.default.createElement("div",{onClick:function onClick(){return f(a)}},y?_react.default.createElement(y,{option:a}):_react.default.createElement("div",null,a[w]))}))},{style:{position:"fixed",top:F.top,left:F.left}}):null)}