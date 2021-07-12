import React from "react";
import ts from "typescript";
import AutosizeInput from "react-input-autosize";
import { useTransformer } from "../../transformer";

export function IdentifierRenderer({
  node,
  editable,
}: {
  node: ts.Identifier;
  editable?: boolean;
}) {
  const { replace } = useTransformer();
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
        replace(node, ts.factory.createIdentifier(e.target.value));
      }}
    />
  );
  // // const { Renderer } = useRendererContext();
  // return <>{node.text}</input>;
}
