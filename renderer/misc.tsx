import styled from "@emotion/styled";
import React from "react";
import ts from "typescript";
import { useRenderer } from "./contexts";

export const Keyword = styled.span`
  color: #569cd6;
`;

export const Literal = styled.span`
  color: rgb(181, 206, 168);
`;

export function IndentBlock(props: { children: any }) {
  return <div style={{ paddingLeft: "1rem" }}>{props.children}</div>;
}

export function Modifiers(props: { modifiers: ts.ModifiersArray }) {
  const Renderer = useRenderer();
  return (
    <>
      {props.modifiers.map((mod, idx) => {
        return (
          <span key={idx}>
            <Renderer node={mod} />
            &nbsp;
          </span>
        );
      })}
    </>
  );
}

export const Container = styled.div`
  color: #eee;
  background: #222;
  flex: 1;
  height: 100%;
  font-size: 18px;
  line-height: 24px;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
    monospace;
`;

export function UnknownDump(props: { tree: ts.Node }) {
  return (
    <pre>
      <code>
        {ts.SyntaxKind[props.tree.kind]}: {JSON.stringify(props.tree, null, 2)}
      </code>
    </pre>
  );
}

export function TypeArguments(props: {
  typeArguments: ts.NodeArray<ts.TypeNode>;
}) {
  const Renderer = useRenderer();
  return (
    <>
      {"<"}
      {props.typeArguments.map((tt, idx) => {
        const last = idx === props.typeArguments!.length - 1;
        return (
          <span key={idx}>
            <Renderer node={tt} />
            {!last && <>, </>}
          </span>
        );
      })}
      {">"}
    </>
  );
}

export function TypeParameters(props: {
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>;
}) {
  const Renderer = useRenderer();

  return (
    <>
      {"<"}
      {props.typeParameters.map((tt, idx) => {
        const last = idx === props.typeParameters!.length - 1;
        return (
          <span key={idx}>
            <Renderer node={tt} />
            {!last && <>, </>}
          </span>
        );
      })}
      {">"}
    </>
  );
}

export function Arguments(props: { arguments: ts.NodeArray<ts.Expression> }) {
  const Renderer = useRenderer();

  return (
    <div>
      {props.arguments.map((arg, key) => {
        const isLastArg = key === props.arguments.length - 1;
        return (
          <div key={key}>
            <Renderer node={arg} />
            {!isLastArg && ", "}
          </div>
        );
      })}
    </div>
  );
}

export function Parameters(props: {
  parameters: ts.NodeArray<ts.ParameterDeclaration>;
}) {
  const Renderer = useRenderer();
  if (props.parameters.length === 0) {
    return <> </>;
  }
  return (
    <div>
      {props.parameters.map((p, i) => {
        const isLastArg = i === props.parameters.length - 1;
        return (
          <div key={i}>
            <Renderer node={p} key={i} />
            {!isLastArg && ", "}
          </div>
        );
      })}
    </div>
  );
}
