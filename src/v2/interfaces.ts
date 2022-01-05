interface Chunk{
    id : string,
    content : string,
    raw_content : string,
    mention : MentionObject,
    index : Number,
    last_chunk : Chunk,
    next_chunk : Chunk
}
interface MentionObject{
    id : string,
    display_content: string
}
interface Input{
    raw_content: string,
    mentions: [ExtendedMentionObject]
}
interface ExtendedMentionObject extends MentionObject{
    start_index : Number,
    end_index : Number
}