import React,{useState} from 'react';

export default function ({resize, className}) {
    const [options, setOptions] = useState([1,2,3,4,5]);
    const [showOptions, setShowOptiona] = useState(false);
    const [optionListPosition, setOptionListPosition] = useState({});
    function setCursor(foc) {
        const position = foc.innerText.length;
        const range = document.createRange();
        range.setStart(foc, position);
        range.setEnd(foc, position);
        const selection = window.getSelection();
        selection.removeAllRanges();
        range.collapse(true)
        selection.addRange(range)
    }
    function keyUp(event) {
        checkFocusedCell();
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
            setOptionListPosition(focusedNode.parentNode.getBoundingClientRect());
        }else {
            setShowOptiona(false);
        }
    }
    function split(event) {
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
    function OptionsUi({style}) {
        return(<div style={style} className={'options-list-holder'}>
            <ul className={'options-list'}>{options.map(option=><li>{option}</li>)}</ul>
        </div>)
    }
    return(<div>
        <div className={className} contentEditable={true} style={{resize:resize}} onPaste={(event)=>setTimeout(()=>split(event),0)} onKeyUp={(event)=>setTimeout(()=>keyUp(event),0)}><span><br/></span></div>
        {showOptions?<OptionsUi style={{position:'fixed',top:optionListPosition.y+5,left:optionListPosition.x}}/>:null}
    </div>)
}