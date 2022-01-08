import model from "./model";
import View from "./view";
import React from "react";
import controller from "./controller";
 export default function MentionBox(props) {
     return model(props, View);
 }