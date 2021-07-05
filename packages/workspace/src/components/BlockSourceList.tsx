import React from "react";
import ts from "typescript";
import { Text } from "@chakra-ui/react";

type BlockProps = {};
type BlockDef = {
  id: string;
  renderer: React.ComponentType<BlockProps>;
  insertionNode: () => ts.Node;
};

const trueBlock: BlockDef = {
  id: "true-element",
  renderer: () => {
    return <Text draggable>true</Text>;
  },
  insertionNode: () => {
    return ts.factory.createTrue();
  },
};

const blockDefs: BlockDef[] = [trueBlock];

export function BlockSourceList() {
  return (
    <>
      {blockDefs.map((b) => {
        const B = b.renderer;
        return <B key={b.id} />;
      })}
    </>
  );
}
