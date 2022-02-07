interface DataLink{
    [index:string]:Chunk|any
    first_chunk : string
    ui_version:number
}
interface Chunk{
    id : string,
    content : string,
    raw_content : string,
    mention? : MentionObject,
    last_chunk : string,
    next_chunk : string
}
interface MentionObject{
    id : string,
    display_content: string
}
interface Input{
    raw_content: string,
    mentions: Array<ExtendedMentionObject>
}
interface ExtendedMentionObject extends MentionObject{
    start_index : number,
    end_index : number
}
interface EventObject{
    elementId:string,
    elementValue:string,
    key:string,
    type: eventType
}
interface Output extends Input{
    search_key: string
}

export enum eventType {"keyup","paste","delete","cut"};
export enum changeType {"characterData", "childList"}