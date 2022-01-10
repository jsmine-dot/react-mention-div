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