import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import observer from "./observer"


export default function MentionBox(props) {
    const ref = useRef(null);
    /*useEffect(() => { observer.clear(); }, []);*/
    useEffect(() => { ref.current && observer.set({ editArea: ref.current }) }, [ref.current])
    useEffect(() => { observer.set({ callback: (data) => props.onChange({ ...data }) }) }, [props.onChange]);
    useEffect(() => { observer.set({ options: props.options }) }, [props.options]);
    useEffect(() => { observer.set({ value: { rawContent: "0my name is something something012", mentions: [{ id: 1, name: "adddd", startIndex: 2, endIndex: 5 }, { id: 2, name: "111111", startIndex: 10, endIndex: 15 }] }}) }, []);
        return <div
            contentEditable={true}
            ref={ref}
            style={props.style}
            className={props.className}
    />
}
