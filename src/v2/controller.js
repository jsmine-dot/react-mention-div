"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(callBack) {
    var timeOut = null;
    return function uiEvent(mutationRecord, node) {
        if (timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(function () {
            var treeWalker = document.createTreeWalker(node, 4);
            var nodeList = [];
            var currentNode = treeWalker.currentNode;
            currentNode = treeWalker.nextNode();
            while (currentNode) {
                nodeList.push(currentNode);
                currentNode = treeWalker.nextNode();
            }
            var raw_string = "";
            var mentions = [];
            nodeList.forEach(function (node) {
                if (node.mention_id) {
                    mentions.push({ id: node.mention_id, display_value: node.data, start_index: raw_string.length, end_index: raw_string.length + node.mention_id.toString().length });
                    raw_string += node.mention_id;
                }
                else {
                    raw_string += node.data;
                }
            });
            console.log("walker output");
            callBack({ raw_string: raw_string, mentions: mentions });
        }, 1);
        return;
    };
}
exports.default = default_1;
//# sourceMappingURL=controller.js.map