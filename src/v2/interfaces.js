"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeType = exports.eventType = void 0;
var eventType;
(function (eventType) {
    eventType[eventType["keyup"] = 0] = "keyup";
    eventType[eventType["paste"] = 1] = "paste";
    eventType[eventType["delete"] = 2] = "delete";
    eventType[eventType["cut"] = 3] = "cut";
})(eventType = exports.eventType || (exports.eventType = {}));
;
var changeType;
(function (changeType) {
    changeType[changeType["characterData"] = 0] = "characterData";
    changeType[changeType["childList"] = 1] = "childList";
})(changeType = exports.changeType || (exports.changeType = {}));
//# sourceMappingURL=interfaces.js.map