import React from "react";
import ts from "typescript";
import { useRendererContext } from "../contexts";

export function EmptyStatementRenderer({ node }: { node: ts.EmptyStatement }) {
  const { Renderer } = useRendererContext();
  return <div>{"// (empty)"}</div>;
}
