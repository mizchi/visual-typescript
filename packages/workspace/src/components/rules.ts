// import {} from "./tree";
import ts from "typescript";

export type DndItem = SourceItem | SourceItem;

export type SourceItem = {
  id: string;
  type: "source";
  node: ts.Node;
};

export type DndNodeItem<T extends ts.Node = ts.Node> = {
  id: string;
  node: T;
};
