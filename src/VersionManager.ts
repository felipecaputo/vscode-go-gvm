import VersionsList from "./VersionsList";
import { window, OutputChannel, } from 'vscode';
import { execAsyncWithOutput } from "./childProcessHelper";

export default class VersionManager {
    versionLister: VersionsList;
    output: OutputChannel;

    constructor(output: OutputChannel) {
        this.versionLister = new VersionsList();
        this.output = output;
        this.installGoVersion = this.installGoVersion.bind(this);
        this.removeGoVersion = this.removeGoVersion.bind(this);
    }
    async runOnTerminal(command: string, description: string) {
        await execAsyncWithOutput(this.output, command, description);
    }
    async installGoVersion() {
        var selected = await window.showQuickPick(this.versionLister.getAvailableVersions());
        if (!selected) {
            return;
        }

        try {
            await this.runOnTerminal(`gvm install ${selected}`, `Installing ${selected}`);
        } catch (e) {
            window.showErrorMessage(`Error installing Go version ${selected}.`);
        }
    }

    async removeGoVersion() {
        var selected = await window.showQuickPick(this.versionLister.getAvailableVersions());
        if (!selected) {
            return;
        }

        try {
            await this.runOnTerminal(`gvm uninstall ${selected}`, `Removing ${selected}`);
        } catch (e) {
            window.showErrorMessage(`Error removing Go version ${selected}.`);
        }
    }
}