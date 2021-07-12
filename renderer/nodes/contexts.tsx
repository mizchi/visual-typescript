import React, { useContext } from "react";
import ts from "typescript";

export type RendererContext = {
  root: ts.SourceFile;
  Renderer: React.ComponentType<{ node: ts.Node }>;
  onUpdateNode: (prev: ts.Node, next: ts.Node) => void;
};

export const RendererContext = React.createContext<RendererContext>(
  null as any
);

export function useRendererContext(): RendererContext {
  return useContext(RendererContext);
}
