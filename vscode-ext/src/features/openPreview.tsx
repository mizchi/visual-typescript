import vscode from "vscode";

export function openPreview(
  jsPath: vscode.Uri,
  title: string,
  initialUri: string,
  initialContent: string
) {
  const panel = vscode.window.createWebviewPanel(
    "vistree:preview",
    title,
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
    }
  );
  panel.title = title;
  panel.webview.html = _getHtml(jsPath);
  let ready = false;
  return vscode.Disposable.from(
    // receive message from webview
    panel.webview.onDidReceiveMessage((message) => {
      if (message.type === "ready") {
        if (ready) return;
        ready = true;
        panel.webview.postMessage({
          type: "set-code",
          value: initialContent,
          uri: initialUri,
        });
      }
    }),
    // receive text changes
    vscode.workspace.onDidChangeTextDocument((event) => {
      const value = event.document.getText();
      const uri = event.document.uri.toString();
      panel.webview.postMessage({
        type: "set-code",
        value,
        uri,
      });
    })
  );
}

function _getHtml(js: vscode.Uri) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        box-sizing: border-box;
      }
      html,
      body,
      #root {
        margin: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <script type="module" src="${js.toString()}"></script>
    <div id="root"></div>
  </body>
</html>  `;
}
