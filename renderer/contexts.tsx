import React, { useCallback, useContext } from "react";
import ts from "typescript";
export type RendererComponent = React.ComponentType<{ node: ts.Node }>;
import { replaceNode } from "@visual-typescript/transformer";
import { VisualTree } from "./index";

const RendererContext = React.createContext<RendererComponent>(VisualTree);

// renderer
export function RendererProvider(props: {
  Renderer: RendererComponent;
  children: React.ReactNode;
}) {
  return (
    <RendererContext.Provider value={props.Renderer}>
      {props.children}
    </RendererContext.Provider>
  );
}

export function useRenderer() {
  return useContext(RendererContext);
}

// transformer
type TransformerContextType = {
  root: ts.SourceFile;
  replace: (prev: ts.Node, next: ts.Node) => void;
};
const TransformerContext = React.createContext<TransformerContextType>(
  null as any
);

type TransformEvent = {
  type: "replaced";
  newNode: ts.Node;
  oldNode?: ts.Node;
};

export function TransformerProvider(props: {
  source: ts.SourceFile;
  children: React.ReactNode;
  onTransform: (newSource: ts.SourceFile, event?: TransformEvent) => void;
}) {
  const update = useCallback(
    (prev: ts.Node, next: ts.Node) => {
      const newSource = replaceNode(props.source, prev, next);
      props.onTransform(newSource, {
        type: "replaced",
        newNode: next,
        oldNode: prev,
      });
    },
    [props.source, props.onTransform]
  );
  return (
    <TransformerContext.Provider
      value={{
        root: props.source,
        replace: update,
      }}
    >
      {props.children}
    </TransformerContext.Provider>
  );
}
