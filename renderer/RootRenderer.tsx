import React, { useCallback } from "react";
import ts from "typescript";
import { RendererProvider, useRenderer } from "./contexts";
import {
  Arguments,
  Container,
  IndentBlock,
  Keyword,
  Modifiers,
  Parameters,
  TypeArguments,
  TypeParameters,
} from "./misc";
import { InnterfaceDeclarationRenderer } from "./statements/declaration";
import { ForOfStatementRenderer } from "./statements/for";
import { isJsxRendererNode, JsxRenderer } from "./expressions/jsx";
import { isStatement, StatementRenderer } from "./statements/StatementRenderer";
import {
  ExpressionRenderer,
  isExpression,
} from "./expressions/ExpressionRenderer";
import { BlockRenderer } from "./statements/BlockRenderer";
import {
  useSyncedSource,
  TransformerProvider,
} from "@visual-typescript/transformer";

export function EditableVisualTree(props: {
  source: ts.SourceFile;
  onUpdate: (source: ts.SourceFile) => void;
}) {
  const Renderer = VisualTree;
  return (
    <RendererProvider Renderer={VisualTree}>
      <TransformerProvider source={props.source} onTransform={props.onUpdate}>
        <Container>
          <Renderer node={props.source} />
        </Container>
      </TransformerProvider>
    </RendererProvider>
  );
}

// export function EditableVisualTree(props: {
//   source: ts.SourceFile;
//   onUpdateNode: (prev: ts.Node, next: ts.Node) => void;
// }) {
//   // TODO: Override
//   const Renderer = VisualTree;
//   return (
//     <RendererProvider Renderer={Renderer}>
//       <Container>
//         <Renderer node={props.source} />
//       </Container>
//     </RendererProvider>
//   );
// }

export function VisualTree({ node }: { node: ts.Node }) {
  const Renderer = useRenderer();
  if (node == null) {
    return <>unknown</>;
  }

  // source or block
  if (ts.isSourceFile(node) || ts.isBlock(node)) {
    return <BlockRenderer node={node} />;
  }

  if (isStatement(node)) {
    return <StatementRenderer node={node} />;
  }

  if (isExpression(node)) {
    return <ExpressionRenderer node={node} />;
  }

  if (ts.isPropertyDeclaration(node)) {
    return (
      <>
        {node.modifiers && <Modifiers modifiers={node.modifiers} />}
        <Renderer node={node.name} />
        {node.type && (
          <>
            :&nbsp;
            <Renderer node={node.type} />
          </>
        )}
        {node.initializer && (
          <>
            &nbsp;=&nbsp;
            <Renderer node={node.initializer} />
          </>
        )}
        ;
      </>
    );
  }
  if (ts.isMethodDeclaration(node)) {
    return (
      <>
        {node.modifiers && <Modifiers modifiers={node.modifiers} />}
        <Renderer node={node.name} />
        {node.typeParameters && (
          <TypeParameters typeParameters={node.typeParameters} />
        )}
        (
        {node.parameters.map((p, i) => {
          return (
            <span key={i}>
              <Renderer node={p} key={i} />
              {i !== node.parameters.length - 1 && ", "}
            </span>
          );
        })}
        ) {"{"}
        {node.body && (
          <IndentBlock>
            <Renderer node={node.body} />
          </IndentBlock>
        )}
        {"}"}
      </>
    );
  }
  if (ts.isBindingElement(node)) {
    return (
      <span>
        <Renderer node={node.name} />
        {node.propertyName && (
          <>
            :&nbsp;
            <Renderer node={node.propertyName} />
          </>
        )}
      </span>
    );
  }
  if (ts.isArrayBindingPattern(node)) {
    return (
      <>
        {"[ "}
        {node.elements.map((el, idx) => {
          const last = idx === node.elements.length - 1;
          return (
            <span key={idx}>
              <Renderer node={el} />
              {!last && ", "}
            </span>
          );
        })}
        {" ]"}
      </>
    );
  }
  if (ts.isObjectBindingPattern(node)) {
    return (
      <>
        {"{ "}
        {node.elements.map((el, idx) => {
          const last = idx === node.elements.length - 1;
          return (
            <span key={idx}>
              <Renderer node={el} />
              {!last && ", "}
            </span>
          );
        })}
        {" }"}
      </>
    );
  }
  if (ts.isConditionalExpression(node)) {
    return (
      <>
        <Renderer node={node.condition} />
        {"?"}
        <Renderer node={node.whenTrue} />
        {":"}
        <Renderer node={node.whenFalse} />
      </>
    );
  }
  if (ts.isParenthesizedExpression(node)) {
    return (
      <span>
        (<Renderer node={node.expression} />)
      </span>
    );
  }
  if (ts.isNoSubstitutionTemplateLiteral(node)) {
    return (
      <span>
        {"`"}
        <span style={{ whiteSpace: "pre-wrap", margin: 0 }}>{node.text}</span>
        {"`"}
      </span>
    );
  }
  if (ts.isTemplateExpression(node)) {
    return (
      <span>
        {"`"}
        {node.head.text}
        {node.templateSpans.map((span, idx) => {
          return (
            <span key={idx}>
              {"${"}
              <Renderer node={span.expression} />
              {"$}"}
              {span.literal.text}
            </span>
          );
        })}
        {"`"}
      </span>
    );
  }
  if (ts.isTaggedTemplateExpression(node)) {
    return (
      <span>
        <Renderer node={node.tag} />
        <Renderer node={node.template} />
      </span>
    );
  }
  if (ts.isNewExpression(node)) {
    return (
      <span>
        <Keyword>new</Keyword>
        &nbsp;
        <Renderer node={node.expression} />(
        {node.arguments && <Arguments arguments={node.arguments} />})
      </span>
    );
  }
  if (ts.isElementAccessExpression(node)) {
    return (
      <span>
        <Renderer node={node.expression} />
        {node.questionDotToken && <>?.</>}
        [<Renderer node={node.argumentExpression} />]
      </span>
    );
  }
  if (ts.isNonNullExpression(node)) {
    return (
      <span>
        <Renderer node={node.expression} />!
      </span>
    );
  }
  if (ts.isPrefixUnaryExpression(node)) {
    let token = {};
    if (node.operator === ts.SyntaxKind.PlusPlusToken) {
      token = "++";
    } else if (ts.SyntaxKind.MinusMinusToken) {
      token = "--";
    } else if (ts.SyntaxKind.ExclamationToken) {
      token = "!";
    }

    return (
      <span>
        {token}
        <Renderer node={node.operand} />
      </span>
    );
  }
  if (ts.isPostfixUnaryExpression(node)) {
    let token;
    if (node.operator === ts.SyntaxKind.PlusPlusToken) {
      token = "++";
    } else {
      token = "--";
    }
    return (
      <span>
        <Renderer node={node.operand} />
        {token}
      </span>
    );
  }
  if (ts.isAsExpression(node)) {
    return (
      <span>
        <Renderer node={node.expression} />
        &nbsp;
        <Keyword>as</Keyword>
        &nbsp;
        <Renderer node={node.type} />
      </span>
    );
  }
  if (isJsxRendererNode(node)) {
    return <JsxRenderer node={node} />;
  }
  if (ts.isExpressionWithTypeArguments(node)) {
    return (
      <>
        <Renderer node={node.expression} />
        {node.typeArguments && (
          <TypeArguments typeArguments={node.typeArguments} />
        )}
      </>
    );
  }
  if (ts.isTypeParameterDeclaration(node)) {
    return (
      <>
        <Renderer node={node.name} />
      </>
    );
  }
  if (ts.isInterfaceDeclaration(node)) {
    return <InnterfaceDeclarationRenderer node={node} />;
  }
  if (ts.isExportAssignment(node)) {
    return (
      <div>
        <Keyword>export</Keyword>
        &nbsp;
        <Keyword>default</Keyword>
        &nbsp;
        <Renderer node={node.expression} />;
      </div>
    );
  }
  if (ts.isParameter(node)) {
    return (
      <>
        {node.name && <Renderer node={node.name} />}
        {node.type && (
          <>
            :&nbsp;
            <Renderer node={node.type} />
          </>
        )}
      </>
    );
  }
  if (ts.isFunctionTypeNode(node)) {
    return (
      <>
        {node.modifiers && <Modifiers modifiers={node.modifiers} />}(
        {node.parameters.map((p, idx) => {
          const last = idx === node.parameters.length - 1;
          return (
            <span key={idx}>
              <Renderer node={p} />
              {!last && ", "}
            </span>
          );
        })}
        ){" => "}
        <Renderer node={node.type} />
      </>
    );
  }
  if (ts.isTypeAliasDeclaration(node)) {
    return (
      <div>
        {node.modifiers && <Modifiers modifiers={node.modifiers} />}
        <Keyword>type</Keyword>
        &nbsp;
        <Renderer node={node.name} />
        &nbsp;=&nbsp;
        <Renderer node={node.type} />;
      </div>
    );
  }
  if (ts.isConstructorDeclaration(node)) {
    return (
      <>
        <Keyword>constructor</Keyword>
        {`(`}
        <IndentBlock>
          <Parameters parameters={node.parameters} />
        </IndentBlock>
        {`) {`}
        {node.body && (
          <IndentBlock>
            <BlockRenderer node={node.body} />
          </IndentBlock>
        )}
        {"}"}
      </>
    );
  }
  // TODO: for in
  // TODO: for (k = 0)
  if (ts.isForOfStatement(node)) {
    return <ForOfStatementRenderer node={node} />;
  }

  if (ts.isLiteralTypeNode(node)) {
    return <Renderer node={node.literal} />;
  }
  if (ts.isIntersectionTypeNode(node)) {
    // @ts-ignore
    const node = tree as ts.IntersectionType;
    return (
      <>
        {node.types.map((c, idx) => {
          const last = idx === node.types.length - 1;
          return (
            <span key={idx}>
              {/* @ts-ignore */}
              <Renderer node={c} />
              {!last && " & "}
            </span>
          );
        })}
      </>
    );
  }
  if (ts.isUnionTypeNode(node)) {
    // @ts-ignore
    const node = tree as ts.UnionType;
    return (
      <>
        {node.types.map((c, idx) => {
          const last = idx === node.types.length - 1;
          return (
            <span key={idx}>
              {/* @ts-ignore */}
              <Renderer node={c} />
              {!last && " | "}
            </span>
          );
        })}
      </>
    );
  }
  if (ts.isParenthesizedTypeNode(node)) {
    return (
      <>
        (<Renderer node={node.type} />)
      </>
    );
  }
  if (ts.isPropertySignature(node)) {
    return (
      <div>
        {node.modifiers && <Modifiers modifiers={node.modifiers} />}
        <Renderer node={node.name} />
        {node.type && (
          <>
            :&nbsp;
            <Renderer node={node.type} />
          </>
        )}
        {node.initializer && (
          <>
            =&nbsp;
            <Renderer node={node.initializer} />
          </>
        )}
        ;
      </div>
    );
  }
  if (ts.isMethodSignature(node)) {
    return (
      <>
        {node.modifiers && <Modifiers modifiers={node.modifiers} />}
        <Renderer node={node.name} />
        (
        <Parameters parameters={node.parameters} />)
        {node.type && (
          <>
            :&nbsp;
            <Renderer node={node.type} />
          </>
        )}
      </>
    );
  }

  if (ts.isArrayTypeNode(node)) {
    return (
      <>
        <Renderer node={node.elementType} />
        []
      </>
    );
  }

  if (ts.isTypeLiteralNode(node)) {
    return (
      <>
        {"{"}
        <IndentBlock>
          {node.members.map((member, idx) => {
            return (
              <span key={idx}>
                <Renderer node={member} />
              </span>
            );
          })}
        </IndentBlock>

        {"}"}
      </>
    );
  }
  if (ts.isTypeReferenceNode(node)) {
    return (
      <>
        <Renderer node={node.typeName} />
        {node.typeArguments && (
          <TypeArguments typeArguments={node.typeArguments} />
        )}
      </>
    );
  }
  if (ts.isToken(node)) {
    return <KeywordRenderer node={node} />;
  }

  return <>unknown</>;
  // default: {
  //   return (
  //     <span style={{ color: "red" }}>
  //       [unknown: {ts.SyntaxKind[tree.kind]}]
  //     </span>
  //   );
  // }
}

function KeywordRenderer({ node }: { node: ts.Node }) {
  switch (node.kind) {
    case ts.SyntaxKind.ThisKeyword:
      return <Keyword>this</Keyword>;
    case ts.SyntaxKind.ConstKeyword:
      return <Keyword>const</Keyword>;
    case ts.SyntaxKind.StaticKeyword:
      return <Keyword>static</Keyword>;
    case ts.SyntaxKind.GetKeyword:
      return <Keyword>get</Keyword>;
    case ts.SyntaxKind.SetKeyword:
      return <Keyword>set</Keyword>;
    case ts.SyntaxKind.AsyncKeyword:
      return <Keyword>async</Keyword>;
    case ts.SyntaxKind.DefaultKeyword:
      return <Keyword>default</Keyword>;
    case ts.SyntaxKind.TrueKeyword:
      return <Keyword>true</Keyword>;
    case ts.SyntaxKind.FalseKeyword:
      return <Keyword>false</Keyword>;
    case ts.SyntaxKind.NumberKeyword:
      return <Keyword>number</Keyword>;
    case ts.SyntaxKind.StringKeyword:
      return <Keyword>string</Keyword>;
    case ts.SyntaxKind.SuperKeyword:
      return <Keyword>super</Keyword>;
    case ts.SyntaxKind.UnknownKeyword:
      return <Keyword>unknown</Keyword>;
    case ts.SyntaxKind.BooleanKeyword:
      return <Keyword>boolean</Keyword>;
    case ts.SyntaxKind.NullKeyword:
      return <Keyword>null</Keyword>;
    case ts.SyntaxKind.VoidKeyword:
      return <Keyword>void</Keyword>;
    case ts.SyntaxKind.AnyKeyword:
      return <Keyword>any</Keyword>;
    case ts.SyntaxKind.ExportKeyword:
      return <Keyword>export</Keyword>;
    case ts.SyntaxKind.ImportKeyword:
      return <Keyword>import</Keyword>;
    case ts.SyntaxKind.ReadonlyKeyword:
      return <Keyword>readonly</Keyword>;
    case ts.SyntaxKind.EqualsToken:
      return <span>=</span>;
    case ts.SyntaxKind.GreaterThanToken:
      return <span>{">"}</span>;
    case ts.SyntaxKind.GreaterThanEqualsToken:
      return <span>{">="}</span>;
    case ts.SyntaxKind.LessThanToken:
    case ts.SyntaxKind.FirstBinaryOperator:
      return <span>{"<"}</span>;
    case ts.SyntaxKind.LessThanEqualsToken:
      return <span>{"<="}</span>;
    case ts.SyntaxKind.EqualsEqualsToken:
      return <span>{"=="}</span>;
    case ts.SyntaxKind.EqualsEqualsEqualsToken:
      return <span>{"==="}</span>;
    case ts.SyntaxKind.ExclamationEqualsEqualsToken:
      return <span>{"!=="}</span>;
    case ts.SyntaxKind.ExclamationEqualsToken:
      return <span>{"!="}</span>;
    case ts.SyntaxKind.AmpersandAmpersandToken:
      return <span>{"&&"}</span>;
    case ts.SyntaxKind.AmpersandToken:
      return <span>{"&"}</span>;
    case ts.SyntaxKind.BarBarToken:
      return <span>{"||"}</span>;
    case ts.SyntaxKind.BarToken:
      return <span>{"|"}</span>;
    case ts.SyntaxKind.PlusToken:
      return <span>{"+"}</span>;
    case ts.SyntaxKind.MinusToken:
      return <span>{"-"}</span>;
    case ts.SyntaxKind.AsteriskToken:
      return <span>{"*"}</span>;
    case ts.SyntaxKind.SlashToken:
      return <span>{"/"}</span>;
    case ts.SyntaxKind.RegularExpressionLiteral:
      return <span>{"/"}</span>;
    case ts.SyntaxKind.CommaToken:
      return <span>{","}</span>;
    default: {
      return <>Unknow Keyword: {node.kind}</>;
    }
  }
}
