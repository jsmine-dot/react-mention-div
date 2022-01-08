import { useState } from "react";

let id = 0;
export default function model<Type extends {options:Array<MentionObject>, onChange:Function, OptionsUI:any, data:Input}>(props:Type){
    const [dataList, setDataList] = useState();
    
    return 'qwert'
}
function prepareDataList(data:Input):DataLink{
    const {raw_content, mentions} = data;
    const sortedMentions:Array<ExtendedMentionObject> = mentions.sort((first:ExtendedMentionObject, second:ExtendedMentionObject)=>first.start_index == second.start_index?0:first.start_index > second.start_index?-1:1);
    const raw_chunk = getChunk(raw_content, raw_content);
    const dataList:DataLink = {first_chunk:raw_chunk.id};
    dataList[raw_chunk.id] = raw_chunk;
    sortedMentions.forEach(mention => {
        let remaining_raw_content = dataList[dataList.first_chunk].raw_content;
        const mention_slice = remaining_raw_content.slice(mention.start_index, mention.end_index);
        const right_remaining_raw_content = remaining_raw_content.slice(mention.end_index,remaining_raw_content.length);
        const left_remaining_raw_content = remaining_raw_content.slice(0, mention.start_index);
        if(right_remaining_raw_content){
            dataList[dataList.first_chunk].content = right_remaining_raw_content;
            dataList[dataList.first_chunk].raw_content = right_remaining_raw_content;
        }
        const slice_chunk:Chunk = getChunk(mention_slice, mention);
        dataList[slice_chunk.id] = slice_chunk;
        let right_most_chunk = slice_chunk;
        let left_most_chunk = slice_chunk;
        if(left_remaining_raw_content){
            const left_chunk:Chunk = getChunk(left_remaining_raw_content);
            left_chunk.next_chunk = slice_chunk.id;
            dataList[left_chunk.id] = left_chunk;
            left_most_chunk = left_chunk
        }
        if(right_remaining_raw_content){
            const right_chunk:Chunk = getChunk(right_remaining_raw_content);
            right_chunk.last_chunk = slice_chunk.id;
            dataList[right_chunk.id] = right_chunk;
            right_most_chunk = right_chunk;
        }
        right_most_chunk.next_chunk = dataList[dataList.first_chunk].id;
        dataList[dataList.first_chunk] = null;
        dataList.first_chunk = left_most_chunk.id;
    })
    return dataList;
}

function getChunk(raw_content?,mention?): Chunk {
    return {id:(id++).toString(),content:mention?mention.display:raw_content, raw_content,mention:{} as MentionObject,last_chunk:'',next_chunk:''} as Chunk
}