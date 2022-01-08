import { useState } from "react";

let id = 0;
export default function model<Type extends {options:Array<MentionObject>, onChange:Function, OptionsUI:any, data:Input}>(props:Type){
    const [dataList, setDataList] = useState();
    
    return 'qwert'
}

function getChunk(raw_content,mention?): Chunk {
    const chunk:Chunk = {id:(++id).toString(),content:mention?mention.display_content:raw_content, raw_content,last_chunk:'',next_chunk:''};
    if(mention){
        chunk.mention = {display_content:mention.display,id:mention.display+''};
    }
    return chunk;
}

function prepareDataList(data:Input):DataLink{
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
    const dataLink:DataLink = {first_chunk:(++id).toString()};
    dataLink[id] = {next_chunk:null};
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
