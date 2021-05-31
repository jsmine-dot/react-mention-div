import React,{useState, useRef} from 'react';

export default function ({resize, className, options,}) {

    const [showOptions, setShowOptiona] = useState(false);
    const [optionListPosition, setOptionListPosition] = useState(null);
    const [mentionDict, setMentionDict] = useState({});
    const [optionsAt, setOptionsAt] = useState(null);
    const inputBox = useRef();

    function setCursor(node) {
        const position = node.innerText.length;
        const range = document.createRange();
        range.setStart(node, position);
        range.setEnd(node, position);
        const selection = window.getSelection();
        selection.removeAllRanges();
        range.collapse(true)
        selection.addRange(range)
    }
    function keyUp(event) {
        checkFocusedCell();
        out();
        if(event.key === '@'){
            split(event);
        }else if(event.key === ' ' ){
            const focusedNode = window.getSelection().focusNode;
            const textContent = focusedNode.textContent;
            if(!textContent.startsWith('@')){
                return;
            }else {
                const textContent = focusedNode.textContent;
                focusedNode.textContent = textContent.slice(0, textContent.length - 1);
                const span = document.createElement('span');
                span.innerHTML = "&nbsp;";
                focusedNode.parentNode.insertAdjacentElement('afterEnd', span);
                setCursor(span)
            }
        }else {
            return
        }

    }
    function checkFocusedCell() {
        const focusedNode = window.getSelection().focusNode;
        const textContent = focusedNode.textContent;
        if(textContent.startsWith('@')){
            setShowOptiona(true);
            const rect = focusedNode.parentNode.getBoundingClientRect();
            setOptionListPosition({top:rect.y+rect.height,left:rect.x});
            setOptionsAt(focusedNode);
        }else {
            setShowOptiona(false);
            setOptionsAt(null);
        }
    }
    function split() {
        const focusedNode = window.getSelection().focusNode;
        const textContent = focusedNode.textContent;
        const splitAt = [...textContent.matchAll('@')].map(item =>item.index);
        if(splitAt.length === 0){
            return;
        }
        const newContents = [];
        focusedNode.textContent = textContent.slice(0,splitAt[0]);
        for(let i = 0; i < splitAt.length; i++){
            let textContentPart = textContent.slice(splitAt[i],splitAt[i+1]);
            if(textContentPart.startsWith('@ ')){
                newContents.push(textContentPart[0]);
                newContents.push(textContentPart.slice(1,textContentPart.length));
            }else {
                newContents.push(textContentPart);
            }
        }
        let atNode = focusedNode.parentNode;
        newContents.forEach(content=>{
            const span = document.createElement('span');
            span.innerText = content;
            if(content.startsWith('@')){
                span.classList.add('blue');
            }
            atNode.insertAdjacentElement('afterEnd', span);
            atNode = span;
        })
        setCursor(atNode);
    }
    function dictSetting(option) {
        optionsAt.textContent = '@'+option.name;
        mentionDict['@'+option.name] = option;
    }
    function out() {
        const outObject = {};
        outObject.value = inputBox.current.innerText;
        const mentions = [];
        Object.keys(mentionDict).forEach(mentionKey=>{
            if(outObject.value.includes(mentionKey)){
                mentions.push({...mentionDict[mentionKey],start:outObject.value.indexOf(mentionKey), end: outObject.value.indexOf(mentionKey) + mentionKey.length})
            }
        })
        outObject.mentions = mentions;
        if(optionsAt){
            outObject.searchKey = optionsAt.innerText;
        }
        console.log(outObject);
    }
    function OptionsUi({style}) {
        return(<div style={style} className={'options-list-holder'}>
            {options.map(option=><li onClick={()=>dictSetting(option)}>{option.name}</li>)}
        </div>)
    }
    return(<div>
        <div ref={inputBox} className={className} contentEditable={true} style={{resize:resize}} onClick={()=>setTimeout(checkFocusedCell,0)}  onPaste={(event)=>setTimeout(()=>split(event),0)} onKeyUp={(event)=>setTimeout(()=>keyUp(event),0)}><span><br/></span></div>
        {showOptions && optionListPosition?<OptionsUi style={{position:'fixed', top: optionListPosition.top, left:optionListPosition.left}}/>:null}
    </div>)
}

//add debounce