import React from "react";
export default function View({dataList}){
    return<div id="sm" contentEditable="true">
        {
            dataList.map(data=><span>{data.content}</span>)
        }
    </div>
}