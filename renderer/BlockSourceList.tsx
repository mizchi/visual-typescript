import { Box, Heading, List, ListItem } from "@chakra-ui/react";
import React from "react";
import ts from "typescript";
import {
  falseNode,
  trueNode,
  variableStatement,
} from "../workbench/data/partial";
import { useRenderer } from "./contexts";

type BlockProps = {};
type BlockDef = {
  id: string;
  renderer: React.ComponentType<BlockProps>;
  insertionNode: () => ts.Node;
};

// const trueBlock: BlockDef = {
//   id: "true-element",
//   renderer: () => {
//     return <Text draggable>true</Text>;
//   },
//   insertionNode: () => {
//     return ts.factory.createTrue();
//   },
// };

// const blockDefs: BlockDef[] = [trueBlock];

const ifStatement = ts.factory.createIfStatement(
  ts.factory.createTrue(),
  ts.factory.createBlock([
    ts.factory.createExpressionStatement(ts.factory.createTrue()),
  ])
);

export function BlockSourceList() {
  const Renderer = useRenderer();
  return (
    <Box>
      <Heading size="sm">BlockSourceList(TODO)</Heading>
      <List>
        <ListItem
          outline="1px solid white"
          p={4}
          cursor="grab"
          draggable
          onDragStart={() => {
            console.log("drag start");
          }}
        >
          {/* <Heading size="sm">If Block</Heading> */}
          <Box pointerEvents="none">
            <Renderer node={ifStatement} />
          </Box>
        </ListItem>
      </List>
      {/* <Renderer node={trueNode} />
      |
      <Renderer node={falseNode} />
      | */}
    </Box>
  );
}
