import React,{useState, useEffect, useMemo, useCallback, useRef} from "react";
import Model from "./model";
// import View from "./view";
import controller from "./controller";

let id = 100;
let editBox:Element = null;

function output(){
    const nodes:DataLink = {}
    return function(changeObject){
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

export default function MentionBox(props=props_) {
    const callBackRef = useRef(callBack);
    const [dataLink, setDataLink] = useState({});
    const [dataList, setDataList] = useState([]);
    const model = useMemo(()=>new Model(props_.data,callBackRef),[props_]);
    const actionHandler = useCallback(controller(outPut_),[model]);
    const mutObserver = useMemo(()=>new MutationObserver(d=>g(d)),[props_]);
    const inputRef = useRef(null);
    const [showPopUp, setShowPopup] = useState("false");
    const [optionsPosition, setPosition] = useState({top:"0px",left:"0px"})
    
    useEffect(()=>{
        if(inputRef.current){
            mutObserver.observe(inputRef.current,{
                childList: true, // observe direct children
                subtree: true, // lower descendants too
                characterData:true,
                characterDataOldValue:true,
            
              })
        }
    },[mutObserver, inputRef.current]);

     useEffect(()=>{
        //  console.log("here",dataLink)
         if(dataLink && dataLink.first_chunk){
             const dataList_new = prepareDataList(dataLink);
            setDataList(dataList_new)
            // console.log("here_",dataList_new)   
         }
         
     },[dataLink]);

     useEffect(()=>{
        //  console.log("ff",{...model.dataLink});
         setDataLink(()=>({...model.dataLink}))
     },[model]);

     function callBack(data){
        //  console.log("data",data)
        // console.log('l', dataLink);
        setDataLink({...data});
     }
     
     useEffect(()=>{
         callBackRef.current = callBack;
     },[dataLink])

     function g(mutationRecord){
         actionHandler(mutationRecord);
         
     }
     function userInput(event){
        if([37,39].includes(event.keyCode)){
            const focusedNode =  window.getSelection().focusNode;
            setShowPopup(focusedNode.parentNode['chunk_id'])
            // console.log(window.getSelection())
            const rect = focusedNode.parentElement.getBoundingClientRect();
            setPosition(()=>({top:rect.y+rect.height,left:rect.x}));
        }
     }
     useEffect(()=>{
         if(!showPopUp){
             return
         }
        //  console.log(optionsPosition)
         const optionPopUp = document.createElement('div');
         optionPopUp.classList.add('xyz');
         optionPopUp.style.border = "5px solid";
         optionPopUp.style.background = "#fff";
         optionPopUp.style.position = "absolute";
         optionPopUp.style.left = optionsPosition.left+"px";
         optionPopUp.style.top = optionsPosition.top+"px";
         document.body.append(optionPopUp)
         return ()=>optionPopUp.remove()
     },[props_.options,showPopUp,optionsPosition])
     useEffect(()=>{
         if(!inputRef.current){
             return;
         }
         inputRef.current.innerHTML = "&nbsp;"
         dataList.forEach(chunk=>{
             let ele:any = createTextNode(chunk.content, ++id);
             if(chunk.mention){
                 const eleWrapper = createMentionElement(ele);
                 
                 ele = eleWrapper;
             }
             
             inputRef.current.append(ele)
         })
     },[inputRef.current])
     return <div ref={(node)=>{inputRef.current = node; editBox = node}} key={dataLink.ui_version} id={dataLink.ui_version}  contentEditable={true} onKeyUp={(e)=>userInput(e)} onKeyDown={(e)=>keyDown(e)}/>;
 }


function keyDown(event:Event){
    const selection = window.getSelection();
    console.log(event)
    switch(event.key){
        case "@":{
            mentionTriggered(selection.focusNode, selection.focusOffset);
            event.preventDefault();
            break;
        }
        case " ":{
            spaceTriggered(selection.focusNode, selection.focusNode.textContent.length);
            break;
        }
        default:break
    }
}

function spaceTriggered(at_node:Node, at:number){
    if(at_node.parentElement.nodeName == "SPAN"){
        const empty_node = createTextNode( '\u00A0',++id);
        insertAfter(at_node.parentElement, empty_node);
        focusAt(empty_node,1);
    }
}

function mentionTriggered(at_node:Node, at:number){
    const mention:Element = createMentionElement(createTextNode("@",++id));
    const after_node:Node = createTextNode(at_node.textContent.slice(at), ++id);
    at_node.textContent = at_node.textContent.slice(0,at);
    debugger
    if(at_node.parentElement.nodeName == "SPAN" ){
        debugger
        insertAfter(at_node.parentNode, mention);
    }else{
        debugger
        insertAfter(at_node, mention);
    }
    insertAfter(mention, after_node);
    focusAt(mention,1);
}

function insertAfter(reference_node:Node, node:Node){
    debugger
    editBox.insertBefore(node, reference_node.nextSibling);
}

function appendBefore(at_node:Node, node: Node){
    editBox.insertBefore(node, at_node);
}

function focusAt(node:Node,index:number){
    const range = document.createRange();
    range.setStart(node,index);
    range.setEnd(node,index);
    const selection = window.getSelection();
    selection.removeAllRanges();
    range.collapse(true)
    selection.addRange(range)
}

function createEmptyTextNode(){
    return document.createElement("emptyTextNode")
}

function createTextNode(content, id){
    const node = document.createTextNode(content);
    node.chunk_id = id;
    return node;
}

function createMentionElement(text_node:Node){
    const element = document.createElement("span");
    element.append(text_node);
    element.chunk_id = text_node.chunk_id;
    element.style.color = "#3e9bdf";
    return element;
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
 const props_:{data:Input, callBack:Function, options:[]} = {
     data: {
         raw_content:'@123 abc @567 bdfg ', 
         mentions:[
             {start_index:0,end_index:3,id:'@123',display_content:"alpha"},
             {start_index:7,end_index:9,id:'@345',display_content:"beta"},
             {start_index:10,end_index:12,id:'@76',display_content:"gama 45"}
            ]
        },
     callBack: (data)=>console.log(data),
     options:[]
 }

