import React, { useEffect, useRef } from "react";
import observer from "@jsmine/mention-observer";

export default function MentionBox(props) {
    const ref = useRef(null);
    useEffect(() => { ref.current && observer.set({ editArea: ref.current }) }, [ref.current])
    useEffect(() => { observer.set({ callback: (data) => props.onChange({ ...data }) }) }, [props.onChange]);
    useEffect(() => { observer.set({ options: props.options }) }, [props.options]);
    useEffect(() => { observer.set({ value: props.value }) }, [props.value]);
    return <div
        className={props.className}
        contentEditable={true}
        ref={ref}
        style={props.style}
    />
}
