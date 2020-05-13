import VersionsList from "./VersionsList";
import { window, OutputChannel, StatusBarItem, } from 'vscode';
import { execAsyncWithOutput } from "./childProcessHelper";

type VersionGetterFunc = () => string[] | Thenable<string[]>;
interface VersionOperationInfo {
    command: string
    description: string
    errorMessage: string
    placeholder: string
}

export default class VersionManager {
    versionLister: VersionsList;
    output: OutputChannel;
    statusBarItem: StatusBarItem;

    constructor(output: OutputChannel, statusBarItem: StatusBarItem) {
        this.versionLister = new VersionsList();
        this.output = output;
        this.statusBarItem = statusBarItem;
        this.installGoVersion = this.installGoVersion.bind(this);
        this.removeGoVersion = this.removeGoVersion.bind(this);
        this.setCurrentGoVersion = this.setCurrentGoVersion.bind(this);
    }

    async activate() {
        this.statusBarItem.command = 'vscode-go-gvm.set-current-version';
        await this.setStatusBarVersion();
    }
    async runOnTerminal(command: string, description: string) {
        await execAsyncWithOutput(this.output, command, description);
    }

    async setStatusBarVersion() {
        try {
            let versionInfo = this.versionLister.getCurrentSelectedVersion();
            this.statusBarItem.text = `GVM version: ${(await versionInfo).versionNumber}`;
        } catch (e) {
            this.statusBarItem.text = `Error on GetGoVersion`;
            this.statusBarItem.tooltip = `Details: ${e}`;
        }
        this.statusBarItem.show();
    }

    async doVersionOperation(versionGetterFunc: VersionGetterFunc, opInfo: VersionOperationInfo) {
        var selected = await window.showQuickPick(versionGetterFunc(), {
            placeHolder: opInfo.placeholder
        });
        if (!selected) {
            return;
        }
        const replacer = (s: string, err?: string) => s.replace('#version', selected || '').replace('#error', err || '');

        try {
            await this.runOnTerminal(replacer(opInfo.command), replacer(opInfo.description));
        } catch (e) {
            window.showErrorMessage(replacer(opInfo.errorMessage, e));
        }
    }
    async installGoVersion() {
        await this.doVersionOperation(this.versionLister.getAvailableVersions, {
            command: 'gvm install #version',
            description: 'Installing Go #version ... ',
            errorMessage: 'Error installing Go version #version. Details: #error',
            placeholder: 'Select version to install...'
        });
    }

    async removeGoVersion() {
        await this.doVersionOperation(() => this.versionLister.getInstalledVersions(false), {
            command: 'gvm uninstall #version',
            description: 'Removing Go #version ... ',
            errorMessage: 'Error removing Go version #version. Details: #error',
            placeholder: 'Select version to uninstall...'
        });
    }

    async setCurrentGoVersion(setAsDefault?: boolean) {
        await this.doVersionOperation(() => this.versionLister.getInstalledVersions(true, false), {
            command: 'gvm use #version --default', //${setAsDefault ? ' --default' : ''}`,
            description: `Updating ${setAsDefault ? 'default' : 'current'} go version to #version`,
            errorMessage: `Error updating ${setAsDefault ? 'default' : 'current'} go version. Details: #error`,
            placeholder: 'Select version to use...'
        });
        await this.setStatusBarVersion();
    }
}