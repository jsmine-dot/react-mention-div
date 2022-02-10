export default (() => {
    let optionPopup: Node = null;
    let activeNode: Node = null;
    let timeout = null;
    let outputObject: Output = {};
    let oldRawContent: string;
    let state: { editBox?: Node, value?: Input, options?: MentionObject[], callback?: Function };
    const selectedMentionBoxColor = "#3e9bdf";
    const mentionBoxColor = "#a9a9a9";
    const observer = new MutationObserver(mutationRecords => { observeBox(mutationRecords) });
    const mentionBoxObservers: { string?: MutationObserver } = {};

    function keyUp(event: Event) {
        presentOptionList();
        switch (event.key) {
            case "ArrowLeft":
            case "ArrowRight": {
                triggerCallback();
                break;
            }
            default: break
        }
    }

    function keyDown(event: Event) {
        const selection = window.getSelection();
        switch (event.key) {
            case "@": {
                mentionTriggered(selection.focusNode, selection.focusOffset);
                event.preventDefault();
                break;
            }
            case " ": {
                selection.focusNode.mentionNode && (insertEmpty(selection.focusNode), event.preventDefault());
                break;
            }
            default: break;
        }
    }

    function observeBox(mutationRecords: MutationRecord[]) {
        const { editBox } = state;
        const record = mutationRecords[0];
        if (record.removedNodes.length > 0) {
            let at = 0;
            let focusNode: Node = editBox;
            if (record.previousSibling) {
                focusNode = record.previousSibling.childNodes.length ? record.previousSibling.childNodes[0] : record.previousSibling;
                at = (focusNode.textContent || focusNode.innerText).length;
            }
            focusAt(focusNode, at)
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            const treeWalker = document.createTreeWalker(editBox, 4);
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
                if (node.mentionId) {
                    mentions.push({ id: node.mentionId, display_value: node.data, startIndex: raw_string.length, endIndex: raw_string.length + node.mentionId.toString().length });
                    raw_string += node.mentionId;
                } else {
                    raw_string += node.data;
                }
            })
            const focusedNode = window.getSelection().focusNode;
            let search_key;
            if (focusedNode.mentionNode) {
                search_key = focusedNode.data.split("@")[1];
            }
            setOutputObject({ raw_string, mentions, search_key });
            triggerCallback();
        }, 1);
    }
    function triggerCallback() {
        const { callback } = state;
        attachSearchParam();
        callback(outputObject)
    }
    function setOutputObject(_outputObject) {
        outputObject = _outputObject
    }
    function attachSearchParam() {
        const focusedNode = window.getSelection().focusNode;
        if (focusedNode.mentionNode) {
            outputObject.search_key = focusedNode.data.split("@")[1];
        }
    }

    function optionSelected(event: Event) {
        const targetNode = event.target;
        if (!activeNode) {
            return;
        }
        activeNode.textContent = "@" + targetNode.innerText;
        activeNode["mentionId"] = targetNode["mentionId"];
        activeNode.parentElement && applyColor(activeNode.parentElement, selectedMentionBoxColor);
        setMentionBoxObserver(activeNode);
        const textNode = createEmptyTextNode();
        insertAfter(activeNode.parentElement, textNode);
        focusAt(textNode, 1);
    }

    function setMentionBoxObserver(node: Node) {
        let mentionObserver: MutationObserver;
        mentionObserver = new MutationObserver((mutationRecords) => {
            mentionObserver.disconnect();
            delete mentionBoxObservers[node.mentionId];
            optionDeSelected(mutationRecords[0].target);
        });
        mentionObserver.observe(node, { characterData: true });
        mentionBoxObservers[node.mentionId] = mentionObserver
    }

    function clearMentionBoxObservers() {
        for (let observerKey in mentionBoxObservers) {
            const observer = mentionBoxObservers[observerKey];
            observer.disconnect();
            delete mentionBoxObservers[observerKey];
        }
    }

    function optionDeSelected(activeNode) {
        console.log("deselected", activeNode);
        delete activeNode["mentionId"];
        activeNode.parentElement && applyColor(activeNode.parentElement, mentionBoxColor);
    }
    function presentOptionList() {
        const { options } = state;
        const selection = window.getSelection();
        activeNode = selection && selection.focusNode;
        if (optionPopup) {
            clearOptionsPopup();
        }
        if (activeNode && activeNode.mentionNode && options && options.length) {
            optionPopup = prepareOptionsNode();
            document.body.append(optionPopup);

            optionPopup.addEventListener("click", optionSelected);

            optionPopup.style.position = "absolute";
            const focusedNode = selection.focusNode;
            const rect = focusedNode.parentElement.getBoundingClientRect();
            optionPopup.style.left = rect.x + "px";
            optionPopup.style.top = rect.y + 10 + "px";
        }
    }
    function clearOptionsPopup() {
        if (!optionPopup) {
            return;
        }
        optionPopup.removeEventListener("click", optionSelected);
        optionPopup.childNodes.length && optionPopup.childNodes[0].parentElement.remove();
        /*document.body.removeChild(optionPopup);*/
    }

    function prepareOptionsNode(): Node {
        const { options } = state;
        const options_node = document.createElement("ul");
        options_node.style.borderRadius = "5px";
        options_node.style.backgroundColor = "#fff";
        options_node.style.padding = "3px";
        options_node.style.boxShadow = "0 0 2PX 2PX #c3c0c0";
        options_node.style["list-style-type"] = "none";
        for (let i = 0; i < options.length; i++) {
            const option_node = document.createElement("li");
            option_node.innerText = options[i].name;
            option_node.mentionId = options[i].id;
            options_node.append(option_node);
        }
        return options_node
    }

    function insertEmpty(at_node: Node) {
            const empty_node = createEmptyTextNode();
            insertAfter(at_node.parentElement, empty_node);
            focusAt(empty_node, 1);
    }

    function mentionTriggered(at_node: Node, at: number) {
        const mention: Element = createSpan(createTextNode("@", true));
        const after_node: Node = createTextNode(at_node.textContent.slice(at));
        at_node.textContent = at_node.textContent.slice(0, at);
        mention["mention_box"] = true;
        if (at_node.parentElement.nodeName == "SPAN") {

            insertAfter(at_node.parentNode, mention);
        } else {

            insertAfter(at_node, mention);
        }
        insertAfter(mention, after_node);
        focusAt(mention, 1);
    }

    function insertAfter(reference_node: Node, node: Node) {
        const { editBox } = state;
        editBox.insertBefore(node, reference_node.nextSibling);
    }

    function focusAt(node: Node, index: number) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index);
        const selection = window.getSelection();
        selection.removeAllRanges();
        range.collapse(true)
        selection.addRange(range)
    }

    function createEmptyTextNode() {
        return createTextNode('\u00A0');
    }

    function createTextNode(content: string | number, mentionNode?: boolean) {
        const node = document.createTextNode(content + '');
        if (mentionNode) {
            node.mentionNode = mentionNode;
        }
        return node;
    }

    function createSpan(text_node: Node) {
        const element = document.createElement("span");
        element.append(text_node);
        applyColor(element, mentionBoxColor);
        return element;
    }

    function applyColor(element: Element, color: string) {
        element.style.color = color;
    }
    function clearEditBox() {
        const { editBox } = state;
        clearObserver();
        editBox && editBox.childNodes.length && (editBox.childNodes[0].parentElement.innerHTML = "");
    }
    function clearObserver() {
        const { editBox } = state;
        clearMentionBoxObservers();
        if (!editBox) {
            return;
        }
        editBox.removeEventListener("keyup", keyUp);
        editBox.removeEventListener("keydown", keyDown);
        observer.disconnect();
    }
    function setObserver() {
        const { editBox } = state;
        observer.observe(editBox, { childList: true, characterData: true, characterDataOldValue: true, subtree: true });
        editBox.addEventListener("keyup", keyUp);
        editBox.addEventListener("keydown", keyDown);
    }
    function setInitialValue() {
        const { editBox, value } = state;
        const { rawContent, mentions = [] } = value;
        if (!(editBox && value && rawContent && oldRawContent !== rawContent )) {
            return;
        }
        oldRawContent === rawContent;
        clearObserver();
        const indexDict = {};
        if (mentions.length > 0) {
            mentions.forEach(mention => {
                indexDict[mention.startIndex] = { endIndex: mention.endIndex + 1, mention };
            })
        }
        let sortedIndexDictKeys = Object.keys(indexDict).sort(ascending);
        if (!sortedIndexDictKeys.includes("0")) {
            indexDict[0] = { endIndex: sortedIndexDictKeys[0] };
        }
        for (let i = 0; i < sortedIndexDictKeys.length; i++) {
            if (+sortedIndexDictKeys[i + 1] - +sortedIndexDictKeys[i] > 1) {
                indexDict[+sortedIndexDictKeys[i] + 1 + ''] = { endIndex: +sortedIndexDictKeys[i + 1] }
            }
        }
        Object.keys(indexDict).sort(ascending).forEach(key => {
            const indexDictValue = indexDict[key];
            let node: Element | Node;
            if (indexDictValue.mention) {
                node = createTextNode("@" + indexDictValue.mention.name, true);
                node.mentionId = indexDictValue.mention.id;
                setMentionBoxObserver(node);
                node = createSpan(node);
                applyColor(node, selectedMentionBoxColor);
            } else {
                node = createTextNode(rawContent.slice(key, indexDictValue.endIndex));
            }
            editBox.appendChild(node);
        })
        
        setObserver();
    }
    function ascending(a, b) {
        return a == b ? 0 : a > b ? 1 : 0;
    }
    function set(_state: { editBox?: Node, value?: Input, options?: MentionObject[], callback?: Function }) {
        const updatedValues = Object.keys(_state);
        if (updatedValues.includes("editBox") && !_state.editBox) {
            /*if editBox is being set to null, remove observers from the node first*/
            clearObserver();
        }
        state = { ...state, ..._state };
        if (updatedValues.includes("editBox")) {
            clearObserver();
            setObserver();
        }
        if (updatedValues.includes("value")) {
            setInitialValue();
        }
        if (updatedValues.includes("options")) {
            presentOptionList();
        }
    }
    function clear() {
        clearEditBox();
        clearOptionsPopup();
        activeNode = null;
        clearTimeout(timeout);
        outputObject = {};
        state = {};
    }
    return { set, clear}
})()