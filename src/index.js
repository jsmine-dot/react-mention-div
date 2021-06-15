import React,{useState, useRef} from 'react';
const prntWrpr = 'prntWrpr';
const inrWrpr = 'inrWrpr';
const igoneKeyList = [
    27,//"escape"
    16,//"shiftleft","shiftright"
    17,//"controlleft"
    18,//"altleft", "altright"
    91,//"metaleft"
    93,//"metaright"
    37,//"arrowleft"
    38,//"arrowup"
    40,//"arrowdown"
    39,//"arrowright"
    
];
function deBounce(func, time) {
    let timer = null;
    return function(){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(()=>func(...arguments),time);
    }
}
export default function ({className, options=[], trigger='@', onChange=()=>{}, optionsListClass, triggerColor='#0E85E8', optionDisplayKey = 'id', ListingUi=null}) {
    const [showOptions, setShowOption] = useState(false);
    const [optionListPosition, setOptionListPosition] = useState(null);
    const [mentionDict, setMentionDict] = useState({});
    const [optionsAt, setOptionsAt] = useState(null);
    const inputBox = useRef();
    const keyUp_deBounce = deBounce(keyUp,100);

    function setCursor(node, at) {
        const range = document.createRange();
        range.setStart(node, at);
        range.setEnd(node, at);
        const selection = window.getSelection();
        selection.removeAllRanges();
        range.collapse(true)
        selection.addRange(range)
    }
    function keyUp(event) {
        if(igoneKeyList.includes(event.keyCode)){
            return;
        }
        const selection = window.getSelection();
        const focusOffset = selection.focusOffset;
        const focusedNode = selection.focusNode;
        const textContent = focusedNode.textContent;
        if(event.code.toLowerCase() === "backspace"){
            spanIn();
        }
        if(textContent.includes(trigger) && !textContent.startsWith(trigger)){
            split(event);
        }else if(event.code.toLowerCase() === "space" && textContent.startsWith(trigger)){ 
                const textContent = focusedNode.textContent;
                focusedNode.textContent = textContent.slice(0,focusOffset - 1);
                const span = generateInnerWrapper();
                span.innerHTML = textContent.slice(focusOffset - 1, textContent.length);
                const parentNode = getParentNode(focusedNode,"wrprTy",inrWrpr);
                parentNode.insertAdjacentElement('afterEnd', span);
                setCursor(span, 1);
        }
        checkFocusedCell();
        out();
    }
    function spanIn(){
        const focusedNode = window.getSelection().focusNode;
        if(focusedNode.nodeName == "#text"){
            return;
        }
        if(focusedNode.getAttribute('wrprTy') == prntWrpr){
            const wrapper = generateInnerWrapper();
            const child = document.createElement('br');
            wrapper.appendChild(child);
            focusedNode.innerHTML = null;
            focusedNode.appendChild(wrapper);
        }
    }
    function checkFocusedCell() {
        const focusedNode = window.getSelection().focusNode;
        if(focusedNode && focusedNode.textContent.startsWith(trigger)){
            setShowOption(true);
            const parentNode = getParentNode(focusedNode,"wrprTy",inrWrpr);
            const rect = parentNode.getBoundingClientRect();
            setOptionListPosition(()=>({top:rect.y+rect.height,left:rect.x}));
            setOptionsAt(()=>getParentNode(focusedNode,"wrprTy",inrWrpr));
            
        }else {
            clearOptionsDisplay();
        }
    }
    function split() {
        const focusedNode = window.getSelection().focusNode;
        const textContent = focusedNode.textContent;
        const splitAt = [...textContent.matchAll(trigger)].map(item =>item.index);
        if(splitAt.length === 0){
            return;
        }
        const newContents = [];
        focusedNode.textContent = textContent.slice(0,splitAt[0]);
        for(let i = 0; i < splitAt.length; i++){
            let textContentPart = textContent.slice(splitAt[i],splitAt[i+1]);
            newContents.push(textContentPart);
        }
        let atNode = getParentNode(focusedNode,"wrprTy",inrWrpr);
        newContents.forEach(content=>{
            const style ={};
            if(content.startsWith(trigger)){
                style.color = triggerColor;
            }
            appendInnerWrapper(atNode,content, style);
        })
    }
    function dictSetting(option) {
        appendInnerWrapper(optionsAt, "&nbsp;");
        optionsAt.textContent = trigger+option[optionDisplayKey];
        mentionDict[trigger+option[optionDisplayKey]] = option;
        clearOptionsDisplay();
        out();
    }
    function out() {
        const focusedNode = window.getSelection().focusNode;
        const outObject = {};
        outObject.value = inputBox.current.innerText;
        const mentions = [];
        Object.keys(mentionDict).forEach(mentionKey=>{
            if(outObject.value.includes(mentionKey)){
                mentions.push({mentionKey,...mentionDict[mentionKey],start:outObject.value.indexOf(mentionKey), end: outObject.value.indexOf(mentionKey) + mentionKey.length});
            }
        })
        outObject.mentions = mentions;
        if(optionsAt){
            outObject.searchKey = optionsAt.textContent.slice(1);
        }
        onChange(outObject);
    }
    function appendInnerWrapper(atNode, content, style={}){
        const span = generateInnerWrapper();
        Object.keys(style).forEach(styleKey=>{
            span.style[styleKey] = style[styleKey];
        });
        span.innerHTML= content;
        atNode.insertAdjacentElement('afterEnd', span);
        setCursor(span.childNodes[0], span.innerText.length);
    }
    function clearOptionsDisplay(){
        setShowOption(()=>false);
        setOptionsAt(null);
    }
    function generateInnerWrapper(){
        const element = document.createElement('span');
        element.setAttribute('wrprTy',inrWrpr);
        return element;
    }
    function getParentNode(currentNode, attribute, attributeValue){
        let count = 0;
        while(true){
            if(currentNode.nodeName == "BODY" || count >= 5){
                currentNode = null;
                break;
            }else if(currentNode.getAttribute && currentNode.getAttribute(attribute) == attributeValue){
                break;
            }else{
                currentNode = currentNode.parentNode;
                count++;
            }
        }
        return currentNode;
    }
    function OptionsUi({style}) {
        return(<div style={style} className={optionsListClass}>
            {options.map(option=><div onClick={()=>dictSetting(option)}>{ListingUi?<ListingUi option={option}/>:<div>{option[optionDisplayKey]}</div>}</div>)}
        </div>)
    }
    return(<div>
        <div wrprTy={prntWrpr} ref={inputBox} className={className} contentEditable={true} onClick={()=>setTimeout(checkFocusedCell,0)} onCut={()=>setTimeout(()=>spanIn(),0)} onPaste={()=>setTimeout(()=>split(),0)} onKeyUp={(event)=>keyUp_deBounce(event)}><span wrprTy={inrWrpr}><br/></span></div>
        {showOptions && optionListPosition?<OptionsUi style={{position:'fixed', top: optionListPosition.top, left:optionListPosition.left}}/>:null}
    </div>)
}