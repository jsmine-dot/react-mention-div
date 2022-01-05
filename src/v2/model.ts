import { useState } from "react";

export default function model<Type extends {options:Array<MentionObject>, onChange:Function, OptionsUI:any, data:Input}>(props:Type){
    const [dataList, setDataList] = useState();
    
    return 'qwert'
}
function prepareDataList(data:Input):Chunk{
    const {raw_content, mentions} = data;
    const sortedMentions:Array<ExtendedMentionObject> = mentions.sort((first:ExtendedMentionObject, second:ExtendedMentionObject)=>first.start_index == second.start_index?0:first.start_index > second.start_index?-1:1);
    const dataList = null;
    const firstChunk = dataList;
    sortedMentions.forEach(mention => {

    })
    return 
}