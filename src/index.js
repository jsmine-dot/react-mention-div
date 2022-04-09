import React, { useEffect, useRef } from "react";
import observer from "@jsmine/mention-observer";

export default function MentionBox(props) {
    const ref = useRef(null);
    useEffect(() => { ref.current && observer.set({ editArea: ref.current }) }, [ref.current])
    useEffect(() => { props.onChange && observer.set({ callback: (data) => props.onChange({ ...data }) }) }, [props.onChange]);
    useEffect(() => { props.options && observer.set({ options: props.options }) }, [props.options]);
    useEffect(() => { props.value && observer.set({ value: props.value }) }, [props.value]);
    return <div
        className={props.className}
        contentEditable={true}
        ref={ref}
        style={props.style}
    />
}
