import vscode from "vscode";
import { registerOpenCommand } from "./commands/registerOpenCommand";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.Disposable.from(registerOpenCommand(context))
  );
}

export function deactivate() {}
