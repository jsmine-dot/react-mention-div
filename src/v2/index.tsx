import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import observer from "./observer"


export default (() => {
    return function MentionBox(props) {
        useEffect(() => {
            observer.setCallback((data) => props.onChange({...data}));
        }, [props.onChange])
        useEffect(() => {observer.setOptions(props.options); }, [props.options])
        return <div
            contentEditable={true}
            ref={(node) => node && observer.setNode(node)}
            style={props.style}
            className={props.className}
        />
    }
})()
