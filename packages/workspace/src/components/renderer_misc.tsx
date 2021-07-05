import styled from "@emotion/styled";
import React from "react";

export const Keyword = styled.span`
  color: #569cd6;
`;

export const Literal = styled.span`
  color: rgb(181, 206, 168);
`;

export function IndentBlock(props: { children: any }) {
  return <div style={{ paddingLeft: "1rem" }}>{props.children}</div>;
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
