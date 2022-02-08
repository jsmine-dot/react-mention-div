import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import observer from "./observer"


export default function MentionBox(props) {
    const ref = useRef(null);
    useEffect(() => { ref.current && observer.setNode(ref.current)},[ref.current])
    useEffect(() => { observer.setCallback((data) => props.onChange({ ...data })) }, [props.onChange]);
    useEffect(() => { observer.setOptions(props.options) }, [props.options]);
    useEffect(() => { observer.setValue({ raw_content: "my name is something something", mentions: [{id:1, name: "adddd", start_index: 2, end_index: 5 }, { id:2,name: "111111", start_index: 10, end_index: 15 }] }) }, []);
        return <div
            contentEditable={true}
            ref={ref}
            style={props.style}
            className={props.className}
    />
}
