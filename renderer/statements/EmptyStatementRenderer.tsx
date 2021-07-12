import React from "react";
import ts from "typescript";
// import { useRenderer } from "../contexts";

export function EmptyStatementRenderer({ node }: { node: ts.EmptyStatement }) {
  // const Renderer = useRenderer();
  return <div>{"// (empty)"}</div>;
}
