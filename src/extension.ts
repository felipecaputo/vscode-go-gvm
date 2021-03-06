// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ExtensionManager from './ExtensionManager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-go-gvm" is now active!');

	ExtensionManager.getCommands().forEach((func, command) =>
		context.subscriptions.push(vscode.commands.registerCommand(command, func))
	);
	await ExtensionManager.activate();

}

// this method is called when your extension is deactivated
export function deactivate() { }
