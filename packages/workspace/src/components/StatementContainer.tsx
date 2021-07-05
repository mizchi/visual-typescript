import React from "react";
import ts from "typescript";
import { Box, Flex } from "@chakra-ui/react";
import { useRendererContext } from "./renderer_contexts";

export function StatementContainer(props: {
  node: ts.Statement;
  index?: number;
}) {
  const { Renderer: Renderer } = useRendererContext();
  // <Renderer node={props.node} />;

  return (
    <Flex w="100%">
      <Box
        w="2rem"
        outline="1px solid white"
        draggable={true}
        onDragStart={(ev) => {
          ev.dataTransfer.setData("text/plain", `${props.index}`);
          const canvas = document.createElement("canvas");
          canvas.getContext("2d");
          ev.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(ev) => {
          ev.preventDefault();
        }}
        onDrop={(ev) => {}}
      >
        {props.index}
      </Box>
      <Box flex={1}>
        <Renderer node={props.node} />
      </Box>
    </Flex>
  );
}
