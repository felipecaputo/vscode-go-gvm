import { workspace } from 'vscode';

class Config {
    defaultBashPath!: string;
    useVersionWithDefault!: boolean;
    showVersionOnStatusBar!: boolean;
    constructor() {
        this.loadConfiguration = this.loadConfiguration.bind(this);

        workspace.onDidChangeConfiguration(this.loadConfiguration);
        this.loadConfiguration();
    }

    loadConfiguration() {
        const config = workspace.getConfiguration("gvm");
        this.defaultBashPath = config.get("pathToDefaultTerminal") || process.env.SHELL || '/bin/bash';
        this.useVersionWithDefault = config.get("setVersionWithDefault") || true;
        this.showVersionOnStatusBar = config.get("showVersionOnStatusBar") || true;
    }
}

export default new Config();