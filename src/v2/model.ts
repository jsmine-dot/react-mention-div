import React,{ useState } from "react";
import { eventType } from "./interfaces";

let id = 0;

const cursorAt = {elementId:null, at:null};
const igoneKeyList = [
    27,//"escape"
    16,//"shiftleft","shiftright"
    17,//"controlleft"
    18,//"altleft", "altright"
    91,//"metaleft"
    93,//"metaright"
    37,//"arrowleft"
    38,//"arrowup"
    40,//"arrowdown"
    39,//"arrowright"
    
];
function setCursor(elementId, at) {
    const node = document.getElementById(elementId);
    const range = document.createRange();
    range.setStart(node, at);
    range.setEnd(node, at);
    const selection = window.getSelection();
    selection.removeAllRanges();
    range.collapse(true)
    selection.addRange(range)
}
export default class Model{
    onChange;
    userAction;
    dataLink;
    removeChunk;
    igoneKeyList = [
        27,//"escape"
        16,//"shiftleft","shiftright"
        17,//"controlleft"
        18,//"altleft", "altright"
        91,//"metaleft"
        93,//"metaright"
        37,//"arrowleft"
        38,//"arrowup"
        40,//"arrowdown"
        39,//"arrowright"
        
    ];
    constructor(data, callBack){
        this.onChange = callBack;
        this.userAction = userAction.bind(this);
        this.dataLink = prepareDataList(data);
        this.removeChunk = removeChunk.bind(this);
    }
}

function getChunk(raw_content,mention?): Chunk {
    const chunk:Chunk = {id:(++id).toString(),content:mention?mention.display_content:raw_content, raw_content,last_chunk:'',next_chunk:''};
    if(mention){
        chunk.mention = {display_content:mention.display,id:mention.display+''};
    }
    return chunk;
}

function prepareDataList(data:Input):DataLink{
    const dataLink:DataLink = {first_chunk:id+'',ui_version:0};
    const {raw_content, mentions} = data;
    const indexDict = {};
    if(mentions.length > 0){
        mentions.forEach(mention => {
            indexDict[mention.start_index] = {end_index:mention.end_index + 1, mention};
        })
    }
    let sorted_indexDict_keys = Object.keys(indexDict).sort(ascending);
    if(!sorted_indexDict_keys.includes("0")){
        indexDict[0] = {end_index:sorted_indexDict_keys[0]};
    }
    for(let i = 0; i < sorted_indexDict_keys.length; i++){
        if(+sorted_indexDict_keys[i + 1] - +sorted_indexDict_keys[i] > 1){
            indexDict[+sorted_indexDict_keys[i] + 1 + ''] =  {end_index : +sorted_indexDict_keys[i + 1]}
        }
    }
    sorted_indexDict_keys = Object.keys(indexDict).sort(ascending);
    dataLink[id] = {next_chunk:null};
    dataLink.first_chunk = id+'';
    let last_chunk = dataLink.first_chunk;
    sorted_indexDict_keys.forEach(key=>{
        const chunk = getChunk(raw_content.slice(Number(key),Number(indexDict[key].end_index)),indexDict[key].mention);
        dataLink[last_chunk].next_chunk = chunk.id;
        chunk.last_chunk = last_chunk;
        dataLink[chunk.id] = chunk;
        last_chunk = chunk.id;
    })
    const dummy_first = dataLink.first_chunk;
    dataLink.first_chunk = dataLink[dataLink.first_chunk].next_chunk;
    dataLink[dataLink.first_chunk].last_chunk = null;
    delete dataLink[dummy_first];
    return dataLink;
}

function ascending(a,b){
    return a == b?0:a > b? 1:0;
}

function userAction(actionObject) {
    // console.log(actionObject)
    actionObject.forEach(element => {
        const {elementId, elementValue, type} = element;
        if(type == "delete"){
            this.removeChunk(elementId, elementValue);
        }else{
            this.dataLink[elementId].raw_content = elementValue;
            this.dataLink[elementId].content = elementValue;
        }
    });
    this.onChange.current(this.dataLink)
}

function splitChunk(elementId) {
    const selection = window.getSelection();
    const focusOffset = selection.focusOffset;
    const focusedNode = selection.focusNode;
    const textContent = focusedNode.textContent;
    const left_chunk = getChunk(textContent.slice(0, focusOffset -1)|| ' ');
    const middle_chunk = getChunk(textContent.slice(focusOffset, textContent.match(' ').index||textContent.length));
    const right_chunk = getChunk(textContent.slice(textContent.match(' ').index||textContent.length,textContent.length)||' ');
    left_chunk.next_chunk = middle_chunk.id;
    middle_chunk.last_chunk = left_chunk.id;
    middle_chunk.next_chunk = right_chunk.id
    const splitted_chunk = dataLink[elementId];
    const last_chunk = dataLink[splitted_chunk.last_chunk];
    const next_chunk = dataLink[splitted_chunk.next_chunk];
    if(last_chunk){
        last_chunk.next_chunk = left_chunk.id;
        left_chunk.last_chunk = last_chunk.id;
    }else{
        dataLink.first_chunk = left_chunk.id;
    }
    if(next_chunk){
        right_chunk.next_chunk = next_chunk.id;
        next_chunk.last_chunk = right_chunk.id;
    }
    dataLink[left_chunk.id] = left_chunk;
    dataLink[middle_chunk.id] = middle_chunk;
    dataLink[right_chunk.id] = right_chunk;
    delete dataLink[elementId];
    cursorAt.elementId = elementId;
    cursorAt.at = 1;
    return;
}

function removeChunk(elementId:string) {
    const chunk_to_remove = this.dataLink[elementId];
    const last_chunk = this.dataLink[chunk_to_remove.last_chunk];
    const next_chunk = this.dataLink[chunk_to_remove.next_chunk];
    cursorAt.elementId = chunk_to_remove.id;
    cursorAt.at = chunk_to_remove.content.length;
    const count = chunk_count(this.dataLink);
    if(last_chunk && next_chunk){
        last_chunk.next_chunk = next_chunk.id;
        next_chunk.last_chunk = last_chunk.id;
    }else if(last_chunk){
        last_chunk.next_chunk = null;
    }else if(next_chunk){
        next_chunk.last_chunk = null;
        cursorAt.elementId = next_chunk.id;
        cursorAt.at = 0;
    }
    delete this.dataLink[elementId];
    // this.dataLink.ui_version += 1;
    // if(count > 1){
    //     
    // }else{
    //     // this.dataLink[elementId].raw_content = elementValue;
    //     // this.dataLink[elementId].content = elementValue;
    //     this.dataLink.ui_version += 1;
    // }
}
function addChunk(){

}

function chunk_count(dataLink){
    let count = 0;
    let next_chunk = dataLink.first_chunk;
    while(next_chunk){
        count++;
        console.log(next_chunk)
        next_chunk = dataLink[next_chunk].next_chunk;
    }
    console.log("count",count,dataLink)
    return count;
}