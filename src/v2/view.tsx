import React from "react";
export default function View({dataList}){
    return<div id="sm" contenteditable="true">
        {
            dataList.map(data=><span>{data.constent}</span>)
        }
    </div>
}