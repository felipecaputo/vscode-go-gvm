import { window, OutputChannel } from 'vscode';
import VersionManager from "./VersionManager";

class ExtensionManager {
    versionManager: VersionManager;
    output: OutputChannel;

    constructor() {
        this.output = window.createOutputChannel("Go GVM");
        this.versionManager = new VersionManager(this.output);
    }
    getCommands(): Map<string, (...args: any[]) => any> {
        return new Map<string, (...args: any[]) => any>([
            ['vscode-go-gvm.install-go-version', this.versionManager.installGoVersion],
            ['vscode-go-gvm.remove-go-version', this.versionManager.removeGoVersion]
        ]);
    }
}

export default new ExtensionManager();