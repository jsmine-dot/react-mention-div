import React, { useEffect, useRef } from "react";
import observer from "@jsmine/mention-observer";

export default function MentionBox({ onChange, options, value, ...props }) {
    const ref = useRef(null);
    useEffect(() => { ref.current && observer.set({ editArea: ref.current }) }, [ref.current]);
    useEffect(() => { onChange && observer.set({ callback: (data) => onChange({ ...data }) }) }, [onChange]);
    useEffect(() => { options && observer.set({ options: options }) }, [options]);
    useEffect(() => { value && observer.set({ value: value }) }, [value]);
    return <div
        {...props}
        contentEditable={true}
        ref={ref}
    />
}
