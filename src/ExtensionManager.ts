import { window, OutputChannel, StatusBarAlignment, StatusBarItem, ViewColumn } from 'vscode';
import { open } from 'openurl';

import VersionManager from "./VersionManager";

class ExtensionManager {
    versionManager: VersionManager;
    output: OutputChannel;
    statusItem: StatusBarItem;

    constructor() {
        this.validateGVMBeforeCall = this.validateGVMBeforeCall.bind(this);

        this.statusItem = window.createStatusBarItem(StatusBarAlignment.Left);
        this.output = window.createOutputChannel("Go GVM");
        this.versionManager = new VersionManager(this.output, this.statusItem);
    }
    async activate() {
        if (!await this.gvmInstalled()) {
            this.notifyGVMNotInstalled();
        }

        await this.versionManager.activate();
    }

    async gvmInstalled(): Promise<Boolean> {
        try {
            if (!process.env.GVM_ROOT) {
                return false;
            }

            await this.versionManager.runOnTerminal('gvm version', '', false);
            return true;
        } catch {
            return false;
        }
    }

    async notifyGVMNotInstalled() {
        const goTo = 'Go to page';
        let option = await window.showErrorMessage("GVM is not installed, you can install it by visiting it's repo in Github.\n Extension will not work until installed.",
            goTo, 'Ignore');

        if (option === goTo) {
            open('https://github.com/moovweb/gvm#installing');
        }
    }

    async validateGVMBeforeCall(method: Promise<void>) {
        if (!await this.gvmInstalled()) {
            await this.notifyGVMNotInstalled();
            return;
        }

        await method;
    }

    getCommands(): Map<string, (...args: any[]) => any> {
        return new Map<string, (...args: any[]) => any>([
            ['vscode-go-gvm.install-go-version', () => this.validateGVMBeforeCall(this.versionManager.installGoVersion())],
            ['vscode-go-gvm.remove-go-version', () => this.validateGVMBeforeCall(this.versionManager.removeGoVersion())],
            ['vscode-go-gvm.set-current-version', () => this.validateGVMBeforeCall(this.versionManager.setCurrentGoVersion())],
            ['vscode-go-gvm.set-default-version', () => this.validateGVMBeforeCall(this.versionManager.setCurrentGoVersion(true))],
        ]);
    }
}

export default new ExtensionManager();