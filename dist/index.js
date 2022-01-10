"use strict";function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=MentionBox;var _react=_interopRequireWildcard(require("react")),_model=_interopRequireDefault(require("./model"));function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _getRequireWildcardCache(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(_getRequireWildcardCache=function(a){return a?c:b})(a)}function _interopRequireWildcard(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!==_typeof(a)&&"function"!=typeof a)return{default:a};var c=_getRequireWildcardCache(b);if(c&&c.has(a))return c.get(a);var d={},e=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var f in a)if("default"!=f&&Object.prototype.hasOwnProperty.call(a,f)){var g=e?Object.getOwnPropertyDescriptor(a,f):null;g&&(g.get||g.set)?Object.defineProperty(d,f,g):d[f]=a[f]}return d.default=a,c&&c.set(a,d),d}function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _iterableToArrayLimit(a,b){var c=null==a?null:"undefined"!=typeof Symbol&&a[Symbol.iterator]||a["@@iterator"];if(null!=c){var d,e,f=[],g=!0,h=!1;try{for(c=c.call(a);!(g=(d=c.next()).done)&&(f.push(d.value),!(b&&f.length===b));g=!0);}catch(a){h=!0,e=a}finally{try{g||null==c["return"]||c["return"]()}finally{if(h)throw e}}return f}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function MentionBox(){function a(a){debugger;props_.callBack(a),g(a)}var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:props_,c=(0,_react.useMemo)(function(){return new _model.default(props_.data,a)},[props_]),d=(0,_react.useState)({}),e=_slicedToArray(d,2),f=e[0],g=e[1],h=(0,_react.useState)([]),i=_slicedToArray(h,2),j=i[0],k=i[1];return(0,_react.useEffect)(function(){debugger;f&&f.first_chunk&&k(prepareDataList(f))},[f.ui_version]),(0,_react.useEffect)(function(){debugger;a(c.dataLink)},[c]),/*#__PURE__*/_react.default.createElement("div",{key:f.ui_version,id:"sm",contentEditable:!0},j.map(function(a){return/*#__PURE__*/_react.default.createElement("span",null,a.content)}))}function prepareDataList(a){debugger;for(var b=[],c=a.first_chunk;null!=c&&a[c];)b.push(a[c]),c=a[c].next_chunk;return b}var props_={data:{raw_content:"@123 abc @567 bdfg ",mentions:[{start_index:0,end_index:3,id:"@123",display_content:"alpha"},{start_index:7,end_index:9,id:"@345",display_content:"beta"},{start_index:10,end_index:12,id:"@76",display_content:"gama 45"}]},callBack:function callBack(a){return console.log(a)},options:[]};
//# sourceMappingURL=index.js.map