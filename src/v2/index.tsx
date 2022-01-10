import React,{useState, useEffect, useMemo} from "react";
import Model from "./model";
// import View from "./view";
import controller from "./controller";
 export default function MentionBox(props=props_) {
    const model = useMemo(()=>new Model(props_.data,callBack),[props_]); 
    const [dataLink, setDataLink] = useState({});
    const [dataList, setDataList] = useState([]);
     useEffect(()=>{
         debugger
         if(dataLink && dataLink.first_chunk){
            setDataList(prepareDataList(dataLink))   
         }

     },[dataLink.ui_version]);
     useEffect(()=>{
         debugger
         callBack(model.dataLink);
     },[model])
     function callBack(data){
         debugger
        props_.callBack(data);
        setDataLink(data)
     }
     return<div key={dataLink.ui_version} id="sm" contentEditable={true}>
         {
            dataList.map(data=><span>{data.content}</span>)
        }
        </div>;
 }


 function prepareDataList(dataLink:DataLink){
     debugger
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