import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import controller from "./controller";
import inputObserver from "./inputObserver"


export default (() => {
    const outputCallback = controller((data) => {
        outPutObject = data;
        attachSearchParam();
        outPut();
    });
    let editBox: Element = null;
    let outPutObject = {};
    let callBack;
    
    const outputObserver = new MutationObserver(mutationRecords => outputCallback(mutationRecords, editBox));

    function outPut() {
        attachSearchParam();
        callBack(outPutObject);
    }

    function attachSearchParam() {
        const focusedNode = window.getSelection().focusNode;
        if (focusedNode.mention_node) {
            outPutObject.search_key = focusedNode.data.split("@")[1];
        }
    }
    inputObserver.setCallback(outPut);
    return function MentionBox(props) {
        useEffect(() => {
            callBack = props.onChange;
        }, [props.onChange])
        useEffect(() => {inputObserver.setOptions(props.options); }, [props.options])
        return React.createElement("div", {
            contentEditable: true,
            style: { "border": "1px solid" },
            ref: (node) => {
                if (!node) return;
                editBox = node;
                inputObserver.setNode(node);
                outputObserver.observe(node, { childList: true, characterData: true, characterDataOldValue: true, subtree: true })
            }
        });
    }
})()
