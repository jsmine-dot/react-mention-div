import React,{useState, useEffect, useMemo, useCallback, useRef} from "react";
import Model from "./model";
// import View from "./view";
import controller from "./controller";

let id = 100;
let editBox:Element = null;
let optionPopUp: Node = null;
let activeNode: Node = null;
const observer = new MutationObserver(mutationRecords => { console.log(mutationRecords); observeBox(mutationRecords) })

function output(){
    const nodes:DataLink = {}
    return function (changeObject) {
        console.log("out", changeObject);
        return;
        changeObject.forEach(record => {
            if(!record.id){return};
            if(record.type == "update"){
                nodes[record.id] = record;
            }else if(record.type == "delete"){
                const last_chunk = nodes[record.last_chunk];
                const next_chunk = nodes[record.next_chunk];
                if(last_chunk){
                    nodes[last_chunk].next_chunk = record.id;
                }
                if(next_chunk){
                    nodes[next_chunk].last_chunk = record.id;
                }
            } else if(record.type == "add"){
                const last_chunk = nodes[record.last_chunk];
                const next_chunk = nodes[record.next_chunk];
                if(last_chunk){
                    nodes[last_chunk].next_chunk = record.id;
                }else{
                    nodes.first_chunk = record.id;
                }
                if(next_chunk){
                    nodes[next_chunk].last_chunk = record.id;
                }
            }
        });
        console.log(nodes)
        let out_value = '';
        let current_chunk = nodes.first_chunk;
        while(!current_chunk){
            out_value += nodes[current_chunk].content;
            current_chunk = nodes[current_chunk].next_chunk; 
        }
        console.log(out_value);
    }
}
const outPut_ = output();

export default function MentionBox(props) {
    return <div ref={(node) => { editBox = node; attachObserver(node, observer) }} key={"alpha"} style={{ "border": "1px solid" }} contentEditable={true} onClick={(e) => keyUp(e, props_.options)} onKeyDown={(e) => keyDown(e, props_.options)} onKeyUp={(e) => keyUp(e, props_.options)} />
 }

function keyUp(event: Event, options?: Array<MentionObject>) {
    focusInMention(options);
}

function keyDown(event: Event, options?: Array<MentionObject>) {
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
            printSelectedNode()
            break;
        }
        case "ArrowLeft":
        case "ArrowRight":
        default: {
            break
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
    } else if (record.addedNodes.length > 0) {
        record.addedNodes[0]["chunk_id"] = ++id;
    }
}
function printSelectedNode() {
    const selection = window.getSelection();
    console.log(selection.focusNode);
}
function optionSelected(event: Event) {
    const targetNode = event.target;
    console.log(event);
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

function attachObserver(node: Node, observer) {
    observer.observe(node, {childList: true})
}

function optionDeSelected(activeNode) {
    delete activeNode["mention_id"];
    console.log("--", activeNode);
    activeNode.parentElement && applyColor(activeNode.parentElement, "#a9a9a9");
}
function focusInMention(options:Array<MentionObjects>){
    const selection = window.getSelection();
    activeNode = selection && selection.focusNode;
    if (optionPopUp) {
        optionPopUp.removeEventListener("click", optionSelected);
        document.body.removeChild(optionPopUp);
        optionPopUp = null;
    }
    if (activeNode.parentElement["mention_box"]){
        optionPopUp = prepareOptionsNode(options);
        document.body.append(optionPopUp);

        optionPopUp.addEventListener("click", optionSelected);

        optionPopUp.style.position = "absolute";
        const focusedNode = selection.focusNode;
        const rect = focusedNode.parentElement.getBoundingClientRect();
        optionPopUp.style.left = rect.x + "px";
        optionPopUp.style.top = rect.y + 10 + "px";
    }
}
function prepareOptionsNode(options:Array<MentionObjects>):Node{
    const options_node = document.createElement("ul");
    options_node.style.borderRadius = "5px";
    options_node.style.backgroundColor = "#fff";
    options_node.style.padding = "3px";
    options_node.style.boxShadow = "0 0 2PX 2PX #c3c0c0";
    options_node.style["list-style-type"] = "none";
    for(let i = 0; i < options.length; i++){
        const option_node = document.createElement("li");
        option_node.innerText = options[i].display_content;
        option_node.mention_id = options[i].id;
        options_node.append(option_node);
    }
    options_node.addEventListener("click",()=>{})
    return options_node
}



function spaceTriggered(at_node:Node, at:number){
    if (at_node.parentElement.nodeName == "SPAN") {
        const empty_node = createEmptyTextNode();
        insertAfter(at_node.parentElement, empty_node);
        focusAt(empty_node,1);
    }
}

function mentionTriggered(at_node:Node, at:number){
    const mention:Element = createSpan(createTextNode("@",++id));
    const after_node:Node = createTextNode(at_node.textContent.slice(at), ++id);
    at_node.textContent = at_node.textContent.slice(0, at);
    mention["mention_box"] = true;
    if(at_node.parentElement.nodeName == "SPAN" ){
       
        insertAfter(at_node.parentNode, mention);
    }else{
       
        insertAfter(at_node, mention);
    }
    insertAfter(mention, after_node);
    focusAt(mention,1);
}

function insertAfter(reference_node:Node, node:Node){
    
    editBox.insertBefore(node, reference_node.nextSibling);
}

function appendBefore(at_node:Node, node: Node){
    editBox.insertBefore(node, at_node);
}

function focusAt(node: Node, index: number) {
    debugger
    const range = document.createRange();
    range.setStart(node,index);
    range.setEnd(node,index);
    const selection = window.getSelection();
    selection.removeAllRanges();
    range.collapse(true)
    selection.addRange(range)
}

function createEmptyTextNode(){
    return createTextNode('\u00A0', ++id);
}

function createTextNode(content, id){
    const node = document.createTextNode(content);
    node.chunk_id = id;
    return node;
}

function createSpan(text_node:Node){
    const element = document.createElement("span");
    element.append(text_node);
   /* element.chunk_id = text_node.chunk_id;*/
    /*element.style.color = "#3e9bdf";*/
    applyColor(element,"#a9a9a9");
    return element;
}

function applyColor(element: Element, color: string) {
    element.style.color = color;
}


 function prepareDataList(dataLink:DataLink){
    //  console.log("kkkk")
     const dataList = [];
     let next = dataLink.first_chunk;
     while( next != null && dataLink[next]){
         dataList.push(dataLink[next]);
         next = dataLink[next].next_chunk;
     }
     return dataList;
 }
 const props_:{data:Input, callBack:Function, options:Array<MentionObject>} = {
     data: {
         raw_content:'@123 abc @567 bdfg ', 
         mentions:[
             {start_index:0,end_index:3,id:'@123',display_content:"alpha"},
             {start_index:7,end_index:9,id:'@345',display_content:"beta"},
             {start_index:10,end_index:12,id:'@76',display_content:"gama 45"}
            ]
        },
     callBack: (data)=>console.log(data),
     options:[{id:677,display_content:"jumba"}, {id:358,display_content:"kalimba"}]
 }

