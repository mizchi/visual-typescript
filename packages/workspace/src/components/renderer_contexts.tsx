import React, { useContext } from "react";
import ts from "typescript";

type EditableContext = {
  onChangeNode: (prev: ts.Node, next: ts.Node) => void;
  onUpdateSource: (newStatements: ts.Statement[]) => void;
};

export type RendererContext = {
  root: ts.SourceFile;
  Renderer: React.ComponentType<{ node: ts.Node }>;
  // statement: React.ComponentType<{
  //   tree: ts.Statement;
  //   index: number;
  //   children: React.ReactNode;
  // }>;
  // expression: React.ComponentType<{
  //   tree: ts.Expression;
  //   children: React.ReactNode;
  // }>;
  context: EditableContext;
};

export const RendererContext = React.createContext<RendererContext>(
  null as any
);

export function useRendererContext(): RendererContext {
  return useContext(RendererContext);
}
