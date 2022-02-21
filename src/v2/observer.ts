export default (() => {
    let optionPopup: Node = null;
    let activeNode: Node = null;
    let timeout = null;
    let outputObject: Output = {};
    let oldRawContent: string;
    let state: { editArea?: Node, value?: Input, options?: MentionObject[], callback?: Function };
    const selectedMentionAreaColor = "#3e9bdf";
    const mentionAreaColor = "#a9a9a9";
    const observer = new MutationObserver(mutationRecords => { observeBox(mutationRecords) });
    const mentionAreaObservers: { string?: MutationObserver } = {};
    const trigger = "@";

    function keyUp(event: Event) {
        switch (event.key) {
            case "ArrowLeft":
            case "ArrowRight": {
                triggerCallback();
            }
            default: break
        }
    }

    function keyDown(event: Event) {
        const selection = window.getSelection();
        switch (event.key) {
            case trigger: {
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
        const { editArea } = state;
        const record = mutationRecords[0];
        if (record.removedNodes.length > 0) {
            let at = 0;
            let focusNode: Node = editArea;
            if (record.previousSibling) {
                focusNode = record.previousSibling.childNodes.length ? record.previousSibling.childNodes[0] : record.previousSibling;
                at = (focusNode.textContent || focusNode.innerText).length;
            }
            focusAt(focusNode, at)
        }
        timeout && clearTimeout(timeout);
        timeout = setTimeout(() => {
            const treeWalker = document.createTreeWalker(editArea, 4);
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
                search_key = focusedNode.data.split(trigger)[1];
            }
            outputObject = { raw_string, mentions, search_key };
            triggerCallback();
        }, 1);
    }
    function triggerCallback() {
        const { callback } = state;
        attachSearchParam();
        callback(outputObject)
    }
    function attachSearchParam() {
        const focusedNode = window.getSelection().focusNode;
        if (focusedNode.mentionNode) {
            outputObject.search_key = focusedNode.data.split(trigger)[1];
        }
    }
    function optionSelected(event: Event) {
        const targetNode = event.target;
        if (!activeNode) {
            return;
        }
        activeNode.textContent = trigger + targetNode.innerText;
        activeNode["mentionId"] = targetNode["mentionId"];
        activeNode.parentElement && applyColor(activeNode.parentElement, selectedMentionAreaColor);
        setMentionAreaObserver(activeNode);
        const textNode = createEmptyTextNode();
        insertAfter(activeNode.parentElement, textNode);
        focusAt(textNode, 1);
    }

    function setMentionAreaObserver(node: Node) {
        let mentionObserver: MutationObserver;
        mentionObserver = new MutationObserver((mutationRecords) => {
            mentionObserver.disconnect();
            delete mentionAreaObservers[node.mentionId];
            optionDeSelected(mutationRecords[0].target);
        });
        mentionObserver.observe(node, { characterData: true });
        mentionAreaObservers[node.mentionId] = mentionObserver
    }

    function clearMentionAreaObservers() {
        for (let observerKey in mentionAreaObservers) {
            const observer = mentionAreaObservers[observerKey];
            observer.disconnect();
            delete mentionAreaObservers[observerKey];
        }
    }

    function optionDeSelected(activeNode) {
        delete activeNode["mentionId"];
        activeNode.parentElement && applyColor(activeNode.parentElement, mentionAreaColor);
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
            const rect = activeNode.parentElement.getBoundingClientRect();
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
        const mention: Element = createSpan(createTextNode(trigger, true));
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
        const { editArea } = state;
        editArea.insertBefore(node, reference_node.nextSibling);
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
        mentionNode && (node.mentionNode = mentionNode);
        return node;
    }

    function createSpan(text_node: Node) {
        const element = document.createElement("span");
        element.append(text_node);
        applyColor(element, mentionAreaColor);
        return element;
    }

    function applyColor(element: Element, color: string) {
        element.style.color = color;
    }

    function clearEditArea() {
        const { editArea } = state;
        clearObserver();
        editArea && editArea.childNodes.length && (editArea.childNodes[0].parentElement.innerHTML = "");
    }

    function clearObserver() {
        const { editArea } = state;
        clearMentionAreaObservers();
        if (!editArea) {
            return;
        }
        editArea.removeEventListener("keyup", keyUp);
        editArea.removeEventListener("keydown", keyDown);
        observer.disconnect();
    }

    function setObserver() {
        const { editArea } = state;
        observer.observe(editArea, { childList: true, characterData: true, characterDataOldValue: true, subtree: true });
        editArea.addEventListener("keyup", keyUp);
        editArea.addEventListener("keydown", keyDown);
    }

    function setInitialValue() {
        const { editArea, value } = state;
        const { rawContent, mentions = [] } = value;
        if (!(editArea && value && rawContent && oldRawContent !== rawContent )) {
            return;
        }
        oldRawContent === rawContent;
        clearEditArea();
        const indexDict = {};
        mentions.length && mentions.forEach(mention => {
            indexDict[mention.startIndex] = { endIndex: mention.endIndex + 1, mention };
        });
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
                node = createTextNode(trigger + indexDictValue.mention.name, true);
                node.mentionId = indexDictValue.mention.id;
                setMentionAreaObserver(node);
                node = createSpan(node);
                applyColor(node, selectedMentionAreaColor);
            } else {
                node = createTextNode(rawContent.slice(key, indexDictValue.endIndex));
            }
            editArea.appendChild(node);
        });
        setObserver();
    }

    function ascending(a, b) {
        return a == b ? 0 : a > b ? 1 : 0;
    }

    function set(_state: { editArea?: Node, value?: Input, options?: MentionObject[], callback?: Function }) {
        const updatedValues = Object.keys(_state);
        console.log("set", updatedValues);
        if (updatedValues.includes("editArea") && !_state.editArea) {
            /*if editArea is being set to null, remove observers from the node first*/
            clearObserver();
        }
        state = { ...state, ..._state };
        if (updatedValues.includes("editArea")) {
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

    return { set }
})()