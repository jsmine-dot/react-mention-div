import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import observer from "./observer"


export default function MentionBox(props) {
    const ref = useRef(null);
    useEffect(() => { ref.current && observer.set({ editBox: ref.current }) }, [ref.current])
    useEffect(() => { observer.set({ callback: (data) => props.onChange({ ...data }) }) }, [props.onChange]);
    useEffect(() => { observer.set({ options: props.options }) }, [props.options]);
    useEffect(() => { observer.set({ value: { rawContent: "my name is something something", mentions: [{ id: 1, name: "adddd", start_index: 2, end_index: 5 }, { id: 2, name: "111111", start_index: 10, end_index: 15 }] }}) }, []);
        return <div
            contentEditable={true}
            ref={ref}
            style={props.style}
            className={props.className}
    />
}
