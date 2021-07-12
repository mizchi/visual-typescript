import type { Message } from "../types";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { send, onMessage, start } from "./vscode_utils";
import ts from "typescript";
import { EditableVisualTree } from "../../../workspace/src/components/VisualTree/VisualTree";

const el = document.querySelector("#root") as HTMLElement;

const onUpdate = (prev: ts.Node, next: ts.Node) => {
  console.log("updated");
};

function App() {
  const [source, setSource] = useState<ts.SourceFile | null>(null);
  useEffect(() => {
    start();
    send({ type: "ready" });
    return onMessage((msg: Message) => {
      if (msg.type === "set-code") {
        const source = ts.createSourceFile(
          msg.uri,
          msg.value,
          ts.ScriptTarget.ESNext,
          undefined,
          ts.ScriptKind.TSX
        );
        setSource(source);
      }
    });
  }, []);

  if (source == null) {
    return <>...</>;
  }
  return (
    <>
      <EditableVisualTree source={source} onUpdateNode={onUpdate} />
    </>
  );
}

ReactDOM.render(<App />, el);
