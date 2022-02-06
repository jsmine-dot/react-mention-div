
export default function (callBack: Function) {
    let timeOut = null;
    return function uiEvent(mutationRecord, node: Element) {
        if (timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(() => {
            const treeWalker = document.createTreeWalker(node, 4);
            const nodeList = [];
            let currentNode = treeWalker.currentNode;
            currentNode = treeWalker.nextNode();
            while (currentNode) {
                nodeList.push(currentNode);
                currentNode = treeWalker.nextNode();
            }
            let raw_string = "";
            const mentions = [];
            nodeList.forEach(node => {
                if (node.mention_id) {
                    mentions.push({ id: node.mention_id, display_value: node.data, start_index: raw_string.length, end_index: raw_string.length + node.mention_id.toString().length });
                    raw_string += node.mention_id;
                } else {
                    raw_string += node.data;
                }
            })
            console.log("walker output", );
            callBack({ raw_string, mentions })
            }, 1);
        
        return;
    }
}