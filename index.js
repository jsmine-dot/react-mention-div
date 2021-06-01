"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _default(_ref) {
  var resize = _ref.resize,
      className = _ref.className,
      options = _ref.options,
      trigger = _ref.trigger,
      onChange = _ref.onChange,
      ListingUi = _ref.ListingUi;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      showOptions = _useState2[0],
      setShowOptiona = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      optionListPosition = _useState4[0],
      setOptionListPosition = _useState4[1];

  var _useState5 = (0, _react.useState)({}),
      _useState6 = _slicedToArray(_useState5, 2),
      mentionDict = _useState6[0],
      setMentionDict = _useState6[1];

  var _useState7 = (0, _react.useState)(null),
      _useState8 = _slicedToArray(_useState7, 2),
      optionsAt = _useState8[0],
      setOptionsAt = _useState8[1];

  var inputBox = (0, _react.useRef)();

  function setCursor(node) {
    var position = node.innerText.length;
    var range = document.createRange();
    range.setStart(node, position);
    range.setEnd(node, position);
    var selection = window.getSelection();
    selection.removeAllRanges();
    range.collapse(true);
    selection.addRange(range);
  }

  function keyUp(event) {
    checkFocusedCell();
    out();

    if (event.key === trigger) {
      split(event);
    } else if (event.key === ' ') {
      var focusedNode = window.getSelection().focusNode;
      var textContent = focusedNode.textContent;

      if (!textContent.startsWith(trigger)) {
        return;
      } else {
        var _textContent = focusedNode.textContent;
        focusedNode.textContent = _textContent.slice(0, _textContent.length - 1);
        var span = document.createElement('span');
        span.innerHTML = "&nbsp;";
        focusedNode.parentNode.insertAdjacentElement('afterEnd', span);
        setCursor(span);
      }
    } else {
      return;
    }
  }

  function checkFocusedCell() {
    var focusedNode = window.getSelection().focusNode;
    var textContent = focusedNode.textContent;

    if (textContent.startsWith(trigger)) {
      setShowOptiona(true);
      var rect = focusedNode.parentNode.getBoundingClientRect();
      setOptionListPosition({
        top: rect.y + rect.height,
        left: rect.x
      });
      setOptionsAt(focusedNode);
    } else {
      setShowOptiona(false);
      setOptionsAt(null);
    }
  }

  function split() {
    var focusedNode = window.getSelection().focusNode;
    var textContent = focusedNode.textContent;

    var splitAt = _toConsumableArray(textContent.matchAll(trigger)).map(function (item) {
      return item.index;
    });

    if (splitAt.length === 0) {
      return;
    }

    var newContents = [];
    focusedNode.textContent = textContent.slice(0, splitAt[0]);

    for (var i = 0; i < splitAt.length; i++) {
      var textContentPart = textContent.slice(splitAt[i], splitAt[i + 1]);

      if (textContentPart.startsWith('@ ')) {
        newContents.push(textContentPart[0]);
        newContents.push(textContentPart.slice(1, textContentPart.length));
      } else {
        newContents.push(textContentPart);
      }
    }

    var atNode = focusedNode.parentNode;
    newContents.forEach(function (content) {
      var span = document.createElement('span');
      span.innerText = content;

      if (content.startsWith(trigger)) {
        span.classList.add('blue');
      }

      atNode.insertAdjacentElement('afterEnd', span);
      atNode = span;
    });
    setCursor(atNode);
  }

  function dictSetting(option) {
    optionsAt.textContent = trigger + option.name;
    mentionDict[trigger + option.name] = option;
  }

  function out() {
    var outObject = {};
    outObject.value = inputBox.current.innerText;
    var mentions = [];
    Object.keys(mentionDict).forEach(function (mentionKey) {
      if (outObject.value.includes(mentionKey)) {
        mentions.push(_objectSpread(_objectSpread({}, mentionDict[mentionKey]), {}, {
          start: outObject.value.indexOf(mentionKey),
          end: outObject.value.indexOf(mentionKey) + mentionKey.length
        }));
      }
    });
    outObject.mentions = mentions;

    if (optionsAt) {
      outObject.searchKey = optionsAt.innerText;
    }

    onChange(outObject);
  }

  function OptionsUi(_ref2) {
    var style = _ref2.style;
    return /*#__PURE__*/_react.default.createElement("div", {
      style: style,
      className: 'options-list-holder'
    }, options.map(function (option) {
      return /*#__PURE__*/_react.default.createElement("div", {
        onClick: function onClick() {
          return dictSetting(option);
        }
      }, /*#__PURE__*/_react.default.createElement(ListingUi, {
        option: option
      }));
    }));
  }

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    ref: inputBox,
    className: className,
    contentEditable: true,
    style: {
      resize: resize
    },
    onClick: function onClick() {
      return setTimeout(checkFocusedCell, 0);
    },
    onPaste: function onPaste(event) {
      return setTimeout(function () {
        return split(event);
      }, 0);
    },
    onKeyUp: function onKeyUp(event) {
      return setTimeout(function () {
        return keyUp(event);
      }, 0);
    }
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("br", null))), showOptions && optionListPosition ? /*#__PURE__*/_react.default.createElement(OptionsUi, {
    style: {
      position: 'fixed',
      top: optionListPosition.top,
      left: optionListPosition.left
    }
  }) : null);
}
