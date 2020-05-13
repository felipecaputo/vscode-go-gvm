import { window, OutputChannel, StatusBarAlignment, StatusBarItem } from 'vscode';
import VersionManager from "./VersionManager";

class ExtensionManager {
    versionManager: VersionManager;
    output: OutputChannel;
    statusItem: StatusBarItem;

    constructor() {
        this.statusItem = window.createStatusBarItem(StatusBarAlignment.Left);
        this.output = window.createOutputChannel("Go GVM");
        this.versionManager = new VersionManager(this.output, this.statusItem);
    }
    async activate() {
        await this.versionManager.activate();
    }
    getCommands(): Map<string, (...args: any[]) => any> {
        return new Map<string, (...args: any[]) => any>([
            ['vscode-go-gvm.install-go-version', this.versionManager.installGoVersion],
            ['vscode-go-gvm.remove-go-version', this.versionManager.removeGoVersion],
            ['vscode-go-gvm.set-current-version', this.versionManager.setCurrentGoVersion],
            ['vscode-go-gvm.set-default-version', () => this.versionManager.setCurrentGoVersion(true)],
        ]);
    }
}

export default new ExtensionManager();