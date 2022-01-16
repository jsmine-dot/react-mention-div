import React,{useState, useEffect, useMemo, useCallback, useRef} from "react";
import Model from "./model";
// import View from "./view";
import controller from "./controller";


function output(){
    const nodes = {}
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
                    record.last_chunk = nodes[last_chunk].id;
                }
                if(next_chunk){
                    nodes[next_chunk].last_chunk = record.id;
                    record.next_chunk = nodes[next_chunk].id;
                }
            }
        });
        console.log(nodes)
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
             let ele:any = document.createTextNode(chunk.content);
             
             if(chunk.mention){
                 const eleWrapper = document.createElement('span');
                 eleWrapper.setAttribute('chunk_id',chunk.id);
                 eleWrapper.append(ele);
                 ele = eleWrapper;
             }
             ele.chunk_id = chunk.id;
             inputRef.current.append(ele)
         })
     },[inputRef.current])
     return <div ref={inputRef} key={dataLink.ui_version} id={dataLink.ui_version}  contentEditable={true} onKeyUp={(e)=>userInput(e)}/>;
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

