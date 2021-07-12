import React from "react";
import ts from "typescript";
import { useRendererContext } from "../contexts";
import AutosizeInput from "react-input-autosize";

export function IdentifierRenderer({
  node,
  editable,
}: {
  node: ts.Identifier;
  editable?: boolean;
}) {
  const { onUpdateNode } = useRendererContext();
  return (
    <AutosizeInput
      inputStyle={{
        // fontSize: "18px",
        fontFamily: "menlo",
        background: "#222",
        color: "yellow",
        padding: 10,
        borderRadius: 3,
        border: "none",
        outline: "none",
      }}
      value={node.text}
      onChange={(e) => {
        onUpdateNode(node, ts.factory.createIdentifier(e.target.value));
      }}
    />
  );
  // // const { Renderer } = useRendererContext();
  // return <>{node.text}</input>;
}
