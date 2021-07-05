import React from "react";
import ts from "typescript";
import { IfStatementRenderer } from "./logics/IfStatementRenderer";
import { RendererContext, useRendererContext } from "./renderer_contexts";
import { Container, IndentBlock, Keyword } from "./renderer_misc";
import { LiteralRenderer } from "./LiteralRenderer";
import { StatementContainer } from "./StatementContainer";

export function BlockTree(props: {
  ast: ts.SourceFile;
  onChangeNode: (prev: ts.Node, next: ts.Node) => void;
  onUpdateSource: (statements: ts.Statement[]) => void;
}) {
  const Renderer = CodeRenderer;
  return (
    <RendererContext.Provider
      value={{
        Renderer,
        root: props.ast,
        context: {
          onChangeNode: props.onChangeNode,
          onUpdateSource: props.onUpdateSource,
        },
      }}
    >
      <Container>
        <Renderer node={props.ast} />
      </Container>
    </RendererContext.Provider>
  );
}

function SwitchStatementRenderer({ node }: { node: ts.SwitchStatement }) {
  const { Renderer: Renderer } = useRendererContext();
  return (
    <div>
      <Keyword>switch</Keyword> (
      <Renderer node={node.expression} />) {"{"}
      {node.caseBlock.clauses.map((clause, idx) => {
        if (clause.kind === ts.SyntaxKind.DefaultClause) {
          const c = clause as ts.DefaultClause;
          // console.log(c);
          return (
            <div key={idx}>
              <Keyword>default</Keyword>:
              <>
                {"{"}
                <IndentBlock>
                  {c.statements.map((stmt, idx) => {
                    return <Renderer node={stmt} key={idx} />;
                  })}
                </IndentBlock>
                {"}"}
              </>
            </div>
          );
        } else {
          const c = clause as ts.CaseClause;
          const isBlock = c.statements[0]?.kind === ts.SyntaxKind.Block;
          return (
            <IndentBlock key={idx}>
              <Keyword>case</Keyword>
              &nbsp;
              <Renderer node={c.expression} />
              {":"}
              {c.statements.length > 0 && (
                <>
                  {isBlock ? (
                    <>
                      &nbsp;{"{"}
                      <IndentBlock>
                        {c.statements.map((stmt, idx) => {
                          return <Renderer node={stmt} key={idx} />;
                        })}
                      </IndentBlock>
                      {"}"}
                    </>
                  ) : (
                    <>
                      <IndentBlock>
                        {c.statements.map((stmt, idx) => {
                          return <Renderer node={stmt} key={idx} />;
                        })}
                      </IndentBlock>
                    </>
                  )}
                </>
              )}
            </IndentBlock>
          );
        }
      })}
      {"}"}
    </div>
  );
}

// boilerplate
function EmptyStatementRenderer({ node }: { node: ts.EmptyStatement }) {
  const { Renderer } = useRendererContext();
  return <div>{"// (empty)"}</div>;
}

export function CodeRenderer({ node }: { node: ts.Node }) {
  const { Renderer } = useRendererContext();
  if (node == null) {
    return <>unknown</>;
  }

  if (ts.isEmptyStatement(node)) {
    return <EmptyStatementRenderer node={node} />;
  }

  if (ts.isIfStatement(node)) {
    return <IfStatementRenderer node={node} />;
  }
  if (ts.isSwitchStatement(node)) {
    return <SwitchStatementRenderer node={node} />;
  }

  if (ts.isLiteralExpression(node)) {
    return <LiteralRenderer node={node} />;
  }

  if (ts.isSourceFile(node)) {
    return (
      <>
        {node.statements.map((stmt, idx) => (
          <StatementContainer node={stmt} index={idx} key={idx} />
        ))}
      </>
    );
  }

  // ts.each
  if (ts.isBlock(node)) {
    return (
      <>
        {node.statements.map((stmt, idx) => (
          <StatementContainer node={stmt} index={idx} key={idx} />
        ))}
      </>
    );
  }
  // Expression
  if (ts.isIdentifier(node)) {
    return <>{node.text}</>;
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

  // if (ts.isPropertyAssignment(node)) {
  //   return <span>{node.text}</span>;
  // }

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
  // JSX
  if (ts.isJsxText(node)) {
    return <>{node.text}</>;
  }
  if (ts.isJsxFragment(node)) {
    return (
      <>
        {"<>"}
        <IndentBlock>
          {node.children.map((c, idx) => {
            return (
              <div key={idx}>
                <Renderer node={c} />
              </div>
            );
          })}
        </IndentBlock>
        {"</>"}
      </>
    );
  }
  if (ts.isJsxExpression(node)) {
    return (
      <>
        {"{"}
        {node.expression && <Renderer node={node.expression} />}
        {"} "}
      </>
    );
  }
  if (ts.isJsxSelfClosingElement(node)) {
    return (
      <span>
        {"<"}
        <Renderer node={node.tagName} />
        &nbsp;
        {node.attributes.properties.map((attr, idx) => {
          if (attr.kind === ts.SyntaxKind.JsxAttribute) {
            const tt = attr as ts.JsxAttribute;
            return (
              <span key={idx}>
                {tt.name && <Renderer node={tt.name} />}
                {tt.initializer && (
                  <>
                    =<Renderer node={tt.initializer} />
                  </>
                )}
              </span>
            );
          } else {
            const tt = attr as ts.JsxSpreadAttribute;
            return (
              <span key={idx}>
                {"{..."}
                <Renderer node={tt.expression} />
              </span>
            );
          }
        })}
        {" />"}
      </span>
    );
  }
  if (ts.isJsxOpeningElement(node)) {
    return (
      <>
        {"<"}
        <Renderer node={node.tagName} />
        {node.attributes.properties.map((attr, idx) => {
          if (attr.kind === ts.SyntaxKind.JsxAttribute) {
            const tt = attr as ts.JsxAttribute;
            return (
              <span key={idx}>
                &nbsp;
                {tt.name && <Renderer node={tt.name} />}
                {tt.initializer && (
                  <>
                    =<Renderer node={tt.initializer} />
                  </>
                )}
              </span>
            );
          } else {
            const tt = attr as ts.JsxSpreadAttribute;
            return (
              <span key={idx}>
                &nbsp;
                {"{..."}
                <Renderer node={tt.expression} />
              </span>
            );
          }
        })}
        {">"}
      </>
    );
  }
  if (ts.isJsxClosingElement(node)) {
    return (
      <>
        {"</"}
        <Renderer node={node.tagName} />
        {">"}
      </>
    );
  }
  if (ts.isJsxElement(node)) {
    return (
      <span>
        <IndentBlock>
          <Renderer node={node.openingElement} />
          <IndentBlock>
            {node.children.map((c, idx) => {
              return (
                <div key={idx}>
                  <Renderer node={c} />{" "}
                </div>
              );
            })}
          </IndentBlock>
          <Renderer node={node.closingElement} />
        </IndentBlock>
      </span>
    );
  }
  if (ts.isBinaryExpression(node)) {
    return (
      <span>
        <Renderer node={node.left} />
        &nbsp;
        <Renderer node={node.operatorToken} />
        &nbsp;
        <Renderer node={node.right} />
      </span>
    );
  }
  if (ts.isPropertyAccessExpression(node)) {
    return (
      <span>
        <Renderer node={node.expression} />
        {node.questionDotToken ? "?." : "."}
        <Renderer node={node.name} />
      </span>
    );
  }
  if (ts.isCallExpression(node)) {
    return (
      <span>
        <Renderer node={node.expression} />(
        {node.arguments.length > 0 && (
          <IndentBlock>
            <Arguments arguments={node.arguments} />
          </IndentBlock>
        )}
        )
        {node.typeArguments && (
          <>
            <TypeArguments typeArguments={node.typeArguments} />
          </>
        )}
      </span>
    );
  }
  if (ts.isExpressionStatement(node)) {
    return (
      <div>
        <Renderer node={node.expression} />;
      </div>
    );
  }
  if (ts.isImportSpecifier(node)) {
    return (
      <>
        {node.propertyName ? (
          <>
            <Renderer node={node.propertyName} />
            &nbsp;
            <Keyword>as</Keyword>
            &nbsp;
            <Renderer node={node.name} />
          </>
        ) : (
          <Renderer node={node.name} />
        )}
      </>
    );
  }
  if (ts.isImportClause(node)) {
    return (
      <>
        {node.isTypeOnly && (
          <>
            <Keyword>type</Keyword>&nbsp;
          </>
        )}
        {node.name && <Renderer node={node.name} />}
        {node.namedBindings?.kind === ts.SyntaxKind.NamespaceImport && (
          <>
            <Keyword>{"*"}</Keyword>
            {node.namedBindings.name && (
              <>
                &nbsp;
                <Keyword>as</Keyword>
                &nbsp;
                <Renderer node={node.namedBindings.name} />
              </>
            )}
          </>
        )}
        {node.namedBindings?.kind === ts.SyntaxKind.NamedImports && (
          <>
            {node.name && ", "}
            {"{ "}
            {(node.namedBindings as ts.NamedImports).elements.map(
              (bind, idx) => {
                const last =
                  idx ===
                  (node.namedBindings as ts.NamedImports).elements.length - 1;
                return (
                  <span key={idx}>
                    <Renderer node={bind} />
                    {!last && <>, </>}
                  </span>
                );
              }
            )}
            {" }"}
          </>
        )}
      </>
    );
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
  if (ts.isHeritageClause(node)) {
    return (
      <>
        &nbsp;
        {node.token === ts.SyntaxKind.ExtendsKeyword && (
          <Keyword>extends</Keyword>
        )}
        {node.token === ts.SyntaxKind.ImplementsKeyword && (
          <Keyword>implements</Keyword>
        )}
        &nbsp;
        {node.types.map((tt, idx) => {
          const last = idx === node.types!.length - 1;
          return (
            <span key={idx}>
              <Renderer node={tt} />
              {!last && <>, </>}
            </span>
          );
        })}
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
    // TODO: extends
    return (
      <div>
        {node.modifiers && <Modifiers modifiers={node.modifiers} />}
        <Keyword>interface</Keyword>
        &nbsp;
        <Renderer node={node.name} />
        {node.typeParameters && (
          <TypeParameters typeParameters={node.typeParameters} />
        )}
        {node.heritageClauses && (
          <>
            {node.heritageClauses.map((h, idx) => {
              const last: boolean = idx === node.heritageClauses!.length - 1;
              return (
                <div key={idx}>
                  <Renderer node={h} />
                  {!last && <>;</>}
                </div>
              );
            })}
          </>
        )}
        {" {"}
        <IndentBlock>
          {node.members.map((m, idx) => {
            return (
              <div key={idx}>
                <Renderer node={m} />;
              </div>
            );
          })}
        </IndentBlock>
        {"}"}
      </div>
    );
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
  if (ts.isImportDeclaration(node)) {
    return (
      <div>
        <Keyword>import</Keyword>
        {node.importClause && (
          <>
            &nbsp;
            <Renderer node={node.importClause} />
            &nbsp;
            <Keyword>from</Keyword>
          </>
        )}
        &nbsp;
        <Renderer node={node.moduleSpecifier} />
      </div>
    );
  }
  // https://github.com/microsoft/TypeScript/blob/master/src/compiler/types.ts#L433
  // case ts.SyntaxKind.VariableStatement:
  if (
    // ts.isFirstStatement(node) ||
    ts.isVariableStatement(node)
  ) {
    // TODO: const
    return (
      <div>
        {node.modifiers && <Modifiers modifiers={node.modifiers} />}
        <Renderer node={node.declarationList} />
        {node.decorators && (
          <div>
            {node.decorators.map((t, idx) => {
              return (
                <div key={idx}>
                  <Renderer node={t.expression} />
                </div>
              );
            })}
          </div>
        )}
        ;
      </div>
    );
  }
  if (ts.isVariableDeclarationList(node)) {
    let declType;
    // TODO: Why 10?
    if (node.flags === ts.NodeFlags.Const || (node as any).flags === 10)
      declType = "const";
    else if (node.flags === ts.NodeFlags.Let) declType = "let";
    else declType = "var";

    const children = node.declarations.map((decl, idx) => {
      let initializer;
      if (decl.initializer) {
        initializer = <Renderer node={decl.initializer} />;
      }
      return (
        <span key={idx}>
          <Renderer node={decl.name} />
          {decl.type && (
            <>
              :&nbsp;
              <Renderer node={decl.type} />
            </>
          )}
          {initializer && <>&nbsp;=&nbsp;{initializer}</>}
        </span>
      );
    });
    return (
      <span>
        <Keyword>{declType}</Keyword>
        &nbsp;
        {children}
      </span>
    );
  }
  if (ts.isReturnStatement(node)) {
    return (
      <div>
        <Keyword>return</Keyword>
        {node.expression && (
          <>
            &nbsp;
            {"("}
            <Renderer node={node.expression} />
            {")"}
          </>
        )}
        ;
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
  if (ts.isArrowFunction(node)) {
    return (
      <span>
        {node.modifiers &&
          node.modifiers.map((mod, idx) => {
            return (
              <span key={idx}>
                <Renderer node={mod} />
                &nbsp;
              </span>
            );
          })}
        (
        {node.parameters.map((p, i) => {
          return (
            <span key={i}>
              <Renderer node={p} key={i} />
              {i !== node.parameters.length - 1 && ", "}
            </span>
          );
        })}
        ) {"=> "}
        {node.body.kind === ts.SyntaxKind.Block ? (
          <>
            {"{"}
            <IndentBlock>
              <Renderer node={node.body} />
            </IndentBlock>
            {"}"}
          </>
        ) : (
          <IndentBlock>
            <Renderer node={node.body} />
          </IndentBlock>
        )}
      </span>
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
        <Keyword>constructor</Keyword>(
        <Parameters parameters={node.parameters} />){" {"}
        {node.body && (
          <IndentBlock>
            <Renderer node={node.body} />
          </IndentBlock>
        )}
        {"}"}
      </>
    );
  }
  if (ts.isClassDeclaration(node)) {
    return (
      <div>
        <Keyword>class</Keyword>
        {node.name && (
          <>
            &nbsp;
            <Renderer node={node.name} />
            {node.typeParameters && (
              <TypeParameters typeParameters={node.typeParameters} />
            )}
          </>
        )}
        {node.heritageClauses && (
          <>
            {node.heritageClauses.map((h, idx) => {
              return (
                <span key={idx}>
                  <Renderer node={h} />
                </span>
              );
            })}
            &nbsp;
          </>
        )}
        {"{"}
        <IndentBlock>
          {node.members &&
            node.members.map((member, idx) => {
              return (
                <div key={idx}>
                  <Renderer node={member} />
                </div>
              );
            })}
        </IndentBlock>
        {"}"}
      </div>
    );
    // return <span>{node.text}</span>;
  }
  if (ts.isFunctionDeclaration(node)) {
    return (
      <div>
        {node.modifiers &&
          node.modifiers.map((mod, idx) => {
            return (
              <span key={idx}>
                <Renderer node={mod} />
                &nbsp;
              </span>
            );
          })}
        <Keyword>function</Keyword>&nbsp;
        {node.name && <Renderer node={node.name} />}(
        <IndentBlock>
          <Parameters parameters={node.parameters} />
        </IndentBlock>
        ) {"{"}
        {node.body && (
          <IndentBlock>
            <Renderer node={node.body} />
          </IndentBlock>
        )}
        {"}"}
      </div>
    );
  }
  // TODO: for in
  // TODO: for (k = 0)
  if (ts.isForOfStatement(node)) {
    return (
      <div>
        <Keyword>for</Keyword>&nbsp;(
        <Renderer node={node.initializer} />
        &nbsp;of&nbsp;
        <Renderer node={node.expression} />
        )&nbsp;{"{"}
        <IndentBlock>
          <Renderer node={node.statement} />
        </IndentBlock>
        {"}"}
      </div>
    );
  }
  // types
  if (ts.isLiteralTypeNode(node)) {
    // const node = tree as ts.LiteralType;
    // @ts-ignore
    return <Renderer node={tree.literal} />;
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
    // @ts-ignore
    const node = tree as ts.ParenthesizedType;
    return (
      <>
        (<Renderer node={node.type} />)
      </>
    );
  }
  // Qualified
  // if (ts.isFirst(node)) {
  //   const node = tree as unknown as ts.QualifiedName;
  //   return (
  //     <>
  //       <Renderer node={node.left} />
  //       .
  //       <Renderer node={node.right} />
  //     </>
  //   );
  // }
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

  return <>unnown</>;
  // default: {
  //   return (
  //     <span style={{ color: "red" }}>
  //       [unknown: {ts.SyntaxKind[tree.kind]}]
  //     </span>
  //   );
  // }
}

function Modifiers(props: { modifiers: ts.ModifiersArray }) {
  const { Renderer } = useRendererContext();
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

function KeywordRenderer({ node }: { node: ts.Node }) {
  switch (node.kind) {
    case ts.SyntaxKind.ThisKeyword:
      <Keyword>this</Keyword>;

    case ts.SyntaxKind.ConstKeyword: {
      return <Keyword>const</Keyword>;
    }

    case ts.SyntaxKind.StaticKeyword: {
      return <Keyword>static</Keyword>;
    }
    case ts.SyntaxKind.GetKeyword: {
      return <Keyword>get</Keyword>;
    }
    case ts.SyntaxKind.SetKeyword:
      {
        return <Keyword>set</Keyword>;
      }

      if (ts.SyntaxKind.AsyncKeyword === node.kind) {
        return <Keyword>async</Keyword>;
      }
    case ts.SyntaxKind.DefaultKeyword: {
      return <Keyword>default</Keyword>;
    }

    case ts.SyntaxKind.TrueKeyword: {
      return <Keyword>true</Keyword>;
    }

    case ts.SyntaxKind.FalseKeyword: {
      return <Keyword>false</Keyword>;
    }
    case ts.SyntaxKind.NumberKeyword: {
      return <Keyword>number</Keyword>;
    }
    case ts.SyntaxKind.StringKeyword: {
      return <Keyword>string</Keyword>;
    }
    case ts.SyntaxKind.SuperKeyword: {
      return <Keyword>super</Keyword>;
    }
    case ts.SyntaxKind.UnknownKeyword: {
      return <Keyword>unknown</Keyword>;
    }
    case ts.SyntaxKind.BooleanKeyword: {
      return <Keyword>boolean</Keyword>;
    }
    case ts.SyntaxKind.NullKeyword: {
      return <Keyword>null</Keyword>;
    }
    case ts.SyntaxKind.VoidKeyword: {
      return <Keyword>void</Keyword>;
    }
    case ts.SyntaxKind.AnyKeyword: {
      return <Keyword>any</Keyword>;
    }
    case ts.SyntaxKind.ExportKeyword: {
      return <Keyword>export</Keyword>;
    }
    case ts.SyntaxKind.ImportKeyword: {
      return <Keyword>import</Keyword>;
    }
    case ts.SyntaxKind.ReadonlyKeyword: {
      return <Keyword>readonly</Keyword>;
    }
    case ts.SyntaxKind.EqualsToken: {
      return <span>=</span>;
    }
    case ts.SyntaxKind.GreaterThanToken: {
      return <span>{">"}</span>;
    }
    case ts.SyntaxKind.GreaterThanEqualsToken: {
      return <span>{">="}</span>;
    }
    case ts.SyntaxKind.LessThanToken:
    case ts.SyntaxKind.FirstBinaryOperator: {
      return <span>{"<"}</span>;
    }
    case ts.SyntaxKind.LessThanEqualsToken: {
      return <span>{"<="}</span>;
    }

    case ts.SyntaxKind.EqualsEqualsToken: {
      return <span>{"=="}</span>;
    }
    case ts.SyntaxKind.EqualsEqualsEqualsToken: {
      return <span>{"==="}</span>;
    }
    case ts.SyntaxKind.ExclamationEqualsEqualsToken: {
      return <span>{"!=="}</span>;
    }
    case ts.SyntaxKind.ExclamationEqualsToken: {
      return <span>{"!="}</span>;
    }
    case ts.SyntaxKind.AmpersandAmpersandToken: {
      return <span>{"&&"}</span>;
    }
    case ts.SyntaxKind.AmpersandToken: {
      return <span>{"&"}</span>;
    }
    case ts.SyntaxKind.BarBarToken: {
      return <span>{"||"}</span>;
    }
    case ts.SyntaxKind.BarToken: {
      return <span>{"|"}</span>;
    }
    case ts.SyntaxKind.PlusToken: {
      return <span>{"+"}</span>;
    }
    case ts.SyntaxKind.MinusToken: {
      return <span>{"-"}</span>;
    }
    case ts.SyntaxKind.AsteriskToken: {
      return <span>{"*"}</span>;
    }
    case ts.SyntaxKind.SlashToken: {
      return <span>{"/"}</span>;
    }
    case ts.SyntaxKind.CommaToken: {
      return <span>{","}</span>;
    }
    default: {
      throw new Error("Unknow Keyword: " + node.kind);
    }
  }
}

function UnknownDump(props: { tree: ts.Node }) {
  return (
    <pre>
      <code>
        {ts.SyntaxKind[props.tree.kind]}: {JSON.stringify(props.tree, null, 2)}
      </code>
    </pre>
  );
}

function TypeArguments(props: { typeArguments: ts.NodeArray<ts.TypeNode> }) {
  const { Renderer: Renderer } = useRendererContext();
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

function TypeParameters(props: {
  typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>;
}) {
  const { Renderer } = useRendererContext();

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

function Arguments(props: { arguments: ts.NodeArray<ts.Expression> }) {
  const { Renderer } = useRendererContext();

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

function Parameters(props: {
  parameters: ts.NodeArray<ts.ParameterDeclaration>;
}) {
  const { Renderer } = useRendererContext();
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
