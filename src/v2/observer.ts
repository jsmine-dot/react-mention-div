export default (() => {
    let optionPopUp: Node = null;
    let activeNode: Node = null;
    let editBox: Node;
    let options: MentionObject[];
    let callback: Function;
    let timeOut = null;
    let outputObject: Output;
    let value: Input;
    let freshValue: boolean;
    const selectedMentionBoxColor = "#3e9bdf";
    const mentionBoxColor = "#a9a9a9";
    const observer = new MutationObserver(mutationRecords => { observeBox(mutationRecords) });

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
                spaceTriggered(selection.focusNode, selection.focusNode.textContent.length);
                break;
            }
            case "Backspace":
            case "Delete": {
                break;
            }
            default: break;
        }
    }

    function observeBox(mutationRecords: MutationRecord[]) {
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
        if (timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(() => {
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
                if (node.mention_id) {
                    mentions.push({ id: node.mention_id, display_value: node.data, start_index: raw_string.length, end_index: raw_string.length + node.mention_id.toString().length });
                    raw_string += node.mention_id;
                } else {
                    raw_string += node.data;
                }
            })
            const focusedNode = window.getSelection().focusNode;
            let search_key;
            if (focusedNode.mention_node) {
                search_key = focusedNode.data.split("@")[1];
            }
            setOutputObject({ raw_string, mentions, search_key });
            triggerCallback();
        }, 1);
    }
    function triggerCallback() {
        attachSearchParam();
        callback(outputObject)
    }
    function setOutputObject(_outputObject) {
        outputObject = _outputObject
    }
    function attachSearchParam() {
        const focusedNode = window.getSelection().focusNode;
        if (focusedNode.mention_node) {
            outputObject.search_key = focusedNode.data.split("@")[1];
        }
    }

    function optionSelected(event: Event) {
        const targetNode = event.target;
        if (!activeNode) {
            return;
        }
        activeNode.textContent = "@" + targetNode.innerText;
        activeNode["mention_id"] = targetNode["mention_id"];
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
            optionDeSelected(mutationRecords[0].target);
        });
        mentionObserver.observe(node, { characterData: true });
    }

    function optionDeSelected(activeNode) {
        console.log("deselected", activeNode);
        delete activeNode["mention_id"];
        activeNode.parentElement && applyColor(activeNode.parentElement, mentionBoxColor);
    }
    function presentOptionList() {
        const selection = window.getSelection();
        activeNode = selection && selection.focusNode;
        if (optionPopUp) {
            optionPopUp.removeEventListener("click", optionSelected);
            document.body.removeChild(optionPopUp);
            optionPopUp = null;
        }
        if (activeNode && activeNode.mention_node && options && options.length) {
            optionPopUp = prepareOptionsNode();
            document.body.append(optionPopUp);

            optionPopUp.addEventListener("click", optionSelected);

            optionPopUp.style.position = "absolute";
            const focusedNode = selection.focusNode;
            const rect = focusedNode.parentElement.getBoundingClientRect();
            optionPopUp.style.left = rect.x + "px";
            optionPopUp.style.top = rect.y + 10 + "px";
        }
    }
    function prepareOptionsNode(): Node {
        const options_node = document.createElement("ul");
        options_node.style.borderRadius = "5px";
        options_node.style.backgroundColor = "#fff";
        options_node.style.padding = "3px";
        options_node.style.boxShadow = "0 0 2PX 2PX #c3c0c0";
        options_node.style["list-style-type"] = "none";
        for (let i = 0; i < options.length; i++) {
            const option_node = document.createElement("li");
            option_node.innerText = options[i].name;
            option_node.mention_id = options[i].id;
            options_node.append(option_node);
        }
        options_node.addEventListener("click", () => { })
        return options_node
    }

    function spaceTriggered(at_node: Node, at: number) {
        if (at_node.parentElement.nodeName == "SPAN") {
            const empty_node = createEmptyTextNode();
            insertAfter(at_node.parentElement, empty_node);
            focusAt(empty_node, 1);
        }
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

    function createTextNode(content: string | number, mention_node?: boolean) {
        const node = document.createTextNode(content + '');
        if (mention_node) {
            node.mention_node = mention_node;
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
    function clearObserver() {
        editBox.removeEventListener("keyup", keyUp);
        editBox.removeEventListener("keydown", keyDown);
        observer.disconnect();
    }
    function setObserver() {
        observer.observe(editBox, { childList: true, characterData: true, characterDataOldValue: true, subtree: true });
        editBox.addEventListener("keyup", keyUp);
        editBox.addEventListener("keydown", keyDown);
    }
    function setNode(node: Node) {
        if (editBox) {
            clearObserver();
        }
        editBox = node;
        setInitialValue();
        setObserver();
    }
    function setOptions(_options: MentionObjects[]) {
        options = _options;
        presentOptionList();
    }
    function setCallback(_callback: Function) {
        callback = _callback
    }
    function setValue(_value: Input) {
        freshValue = value !== _value;
        value = _value;
        setInitialValue();
    }
    function setInitialValue() {
        if (!(editBox && value && freshValue)) {
            return;
        }
        freshValue = false;
        clearObserver();
        const mentions = value.mentions||[];
        const indexDict = {};
        if (mentions.length > 0) {
            mentions.forEach(mention => {
                indexDict[mention.start_index] = { end_index: mention.end_index + 1, mention };
            })
        }
        let sorted_indexDict_keys = Object.keys(indexDict).sort(ascending);
        if (!sorted_indexDict_keys.includes("0")) {
            indexDict[0] = { end_index: sorted_indexDict_keys[0] };
        }
        for (let i = 0; i < sorted_indexDict_keys.length; i++) {
            if (+sorted_indexDict_keys[i + 1] - +sorted_indexDict_keys[i] > 1) {
                indexDict[+sorted_indexDict_keys[i] + 1 + ''] = { end_index: +sorted_indexDict_keys[i + 1] }
            }
        }
        Object.keys(indexDict).sort(ascending).forEach(key => {
            const indexDictValue = indexDict[key];
            let node: Element | Node;
            if (indexDictValue.mention) {
                node = createTextNode("@" + indexDictValue.mention.name, true);
                node.mention_id = indexDictValue.mention.id;
                setMentionBoxObserver(node);
                node = createSpan(node);
                applyColor(node, selectedMentionBoxColor);
            } else {
                node = createTextNode(value.raw_content.slice(key, indexDictValue.end_index));
            }
            editBox.appendChild(node);
        })
        
        setObserver();
    }
    function ascending(a, b) {
        return a == b ? 0 : a > b ? 1 : 0;
    }
    return { setNode, setOptions, setCallback, setValue }
})()