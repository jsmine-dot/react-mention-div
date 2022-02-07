export default (() => {
    let optionPopUp: Node = null;
    let activeNode: Node = null;
    let editBox: Node;
    let options: MentionObject[];
    let initialValue: string;
    let callback: Function;

    const inputObserver = new MutationObserver(mutationRecords => { observeBox(mutationRecords) });

    function keyUp(event: Event, options?: Array<MentionObject>) {
        presentOptionList(options);
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
            case "ArrowLeft":
            case "ArrowRight":
            default: {
               
                break;
            }
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
    }

    function optionSelected(event: Event) {
        const targetNode = event.target;
        if (!activeNode) {
            return;
        }
        activeNode.textContent = "@" + targetNode.innerText;
        activeNode["mention_id"] = targetNode["mention_id"];
        activeNode.parentElement && applyColor(activeNode.parentElement, "#3e9bdf");
        const mentionObserver = new MutationObserver((mutationRecords) => optionDeSelected(mutationRecords[0].target));
        mentionObserver.observe(activeNode, { characterData: true });
        const textNode = createEmptyTextNode();
        insertAfter(activeNode.parentElement, textNode);
        focusAt(textNode, 1);
    }

    function optionDeSelected(activeNode) {
        console.log("deselected", activeNode);
        delete activeNode["mention_id"];
        activeNode.parentElement && applyColor(activeNode.parentElement, "#a9a9a9");
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
        applyColor(element, "#a9a9a9");
        return element;
    }

    function applyColor(element: Element, color: string) {
        element.style.color = color;
    }
    function setNode(node: Node) {
        editBox = node;
        inputObserver.observe(node, { childList: true });
        node.addEventListener("keyup", (event: Event) => keyUp(event));
        node.addEventListener("keydown", (event: Event) => keyDown(event));
    }
    function setOptions(_options: MentionObjects[]) {
        options = _options;
        presentOptionList();
    }
    function setCallback(callback: Function) {
        callback = callback
    }
    function setInitialValue(initialValue: string) {

    }
    return { setNode, setOptions, setCallback, setInitialValue }
})()