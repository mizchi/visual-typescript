import { useCallback, useContext, useEffect, useState } from "react";
import ts from "typescript";
import { print, replaceNode, parse } from "./index";
import React from "react";

type SyncedStatus =
  | "synced"
  | "source-advanced"
  | "code-advanced"
  | "initializing";

export function useSyncedSource(initialValue: string): {
  code: string;
  setCode: (v: string) => void;
  source: ts.SourceFile | null;
  setSource: (source: ts.SourceFile) => void;
  status: SyncedStatus;
  error: string | null;
} {
  const [code, setCodeRaw] = useState<string>(initialValue);
  const [source, setSourceRaw] = useState<ts.SourceFile | null>(null);
  const [status, setStatus] = useState<SyncedStatus>("initializing");
  const [lastReceived, setLastReceived] = useState<string>(initialValue);
  const [error, setError] = useState<null | string>(null);

  const setSource = useCallback(
    (newSource: ts.SourceFile) => {
      setSourceRaw(newSource);
      try {
        const value = print(newSource);
        setCodeRaw(value);
        setStatus("synced");
        setError(null);
      } catch (err) {
        setStatus("source-advanced");
        setError("print-error");
      }
    },
    [setSourceRaw]
  );

  const setCode = useCallback(
    (value: string) => {
      setCodeRaw(value);
      try {
        const newSource = parse(value);
        setSourceRaw(newSource);
        setStatus("synced");
        setError(null);
      } catch (err) {
        setStatus("code-advanced");
        setError("parse-error");
      }
    },
    [setCodeRaw]
  );
  // detect initialCode changes
  useEffect(() => {
    if (initialValue !== lastReceived) {
      setCode(initialValue);
      setLastReceived(initialValue);
    }
  }, [lastReceived, initialValue, setCode]);

  useEffect(() => {
    if (source == null) {
      const newSource = parse(initialValue);
      setSource(newSource);
    }
  }, []);

  return { code, setCode, source, setSource, status, error };
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
  type: "changed";
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
        type: "changed",
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
export function useTransformer(): TransformerContextType {
  return useContext(TransformerContext);
}
