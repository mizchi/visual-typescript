import vscode from "vscode";
import path from "path";
import { openPreview } from "../features/openPreview";

export function registerOpenCommand(context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand("viscode-extension.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from viscode-extension!");
    const jsPath = vscode.Uri.file(
      path.join(context.extensionPath, "dist/vistree-ext.es.js")
    ).with({
      scheme: "vscode-resource",
    });
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor == null) {
      vscode.window.showErrorMessage("typescript active window required");
      return;
    }

    const initialText = activeEditor?.document.getText() ?? "plane";
    const initialUri = activeEditor?.document.uri.toString();

    return openPreview(jsPath, "hello", initialUri, initialText);
  });
}
