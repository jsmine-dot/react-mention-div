import {changeType, eventType} from "./interfaces";
import {deBounce} from "../utils"
let focused_element_id = null;
export default function(callBack:Function){
    // console.log(callBack)
    let timer = 100;
    let timeOut = null;
    let changeObject = {};
    return function uiEvent(mutationRecord) {
        console.log(mutationRecord)
        for(let i = 0; i < mutationRecord.length; i++){
            const record = mutationRecord[i];
            console.log(record)
            if(record.type == "characterData"){
                const chunk = prepareChunk(record.target.parentNode);
                chunk.type = "update";
                changeObject[chunk.od] = chunk;
            }else if(record.type == "childList" && record.removedNodes.length ){
                const chunk = prepareChunk(record.removedNodes[0]);
                chunk.type = "delete";
                changeObject[chunk.id] = chunk;
            }else if(record.type == "childList" && record.addedNodes.length ){
                const chunk = prepareChunk(record.addedNodes[0]);
                chunk.type = "add";
                changeObject[chunk.id] = chunk;
            }   
            console.log(changeObject)
        }
        if(timeOut){
            clearTimeout(timeOut);
        }
        if(Object.values(changeObject).length){
            timeOut = setTimeout(()=>{
                console.log(changeObject)
                callBack(Object.values(changeObject));
                changeObject = {};
            },timer);
        }
    }
}

function prepareChunk(record):Chunk{
    // console.log(record)
    const chunk:Chunk = {
        id : record.chunk_id,
        content : record.innerText||record.textContent,
        raw_content : record.innerText||record.textContent,
        last_chunk : record.previousSibling?.['chunk_id'],
        next_chunk : record.nextSibling?.['chunk_id']
    }
    if(record['mention']){
        chunk.mention = {id:record['mention'],display_content:chunk.content};
        chunk.raw_content = '@'+record['mention'];

    }
    return chunk
}


function type(record){
    if(record.type == changeType[0]){
        return "update"
    }else{
        return "delete"
    }
}