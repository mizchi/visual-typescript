export const helloworld = `
if (Math.random() > 0.5) {
  alert("hello");
} else {
  1;
}

class X {
  constructor(public name: string) {
  }
  foo() {
    
  }
}
import x from "y";
import { x, y, z as alpha } from "z";
import * as c from "z";

export const str = "string";
export const num = 0;
export const bool = true;
const multilineText = \`
aaa
bbb
ccc
\`;
export default function main(a: string, num: number) {
  console.log("hello", a, num, multilineText);
}
main("xxx", 5);

if (Math.random() > 0.5) {
  alert("hello");
}

const x = <div>x</div>;
`;

// import ts from "typescript";

// export function replaceNode(source: ts.SourceFile) {
//   function rewriter(): ts.TransformerFactory<ts.Node> {
//     return (context) => {
//       const visit: ts.Visitor = (node) => {
//         // if (prev === node) return next;
//         console.log("visit", node);

//         return ts.visitEachChild(node, (child) => visit(child), context);
//       };
//       return (node) => ts.visitNode(node, visit);
//     };
//   }
//   const result = ts.transform(source, [rewriter()]);
//   const newAst = result.transformed[0] as ts.SourceFile;
//   return newAst;
// }

// const source = ts.createSourceFile(
//   "file:///helloworld.ts",
//   helloworld,
//   ts.ScriptTarget.ESNext
// );

// replaceNode(source);
