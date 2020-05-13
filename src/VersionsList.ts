import { execAsync } from './childProcessHelper';

interface VersionInfo {
    versionName: string
    versionNumber: string
}

export default class VersionsList {
    constructor() {
        this.extractVersions = this.extractVersions.bind(this);
        this.getAvailableVersions = this.getAvailableVersions.bind(this);
        this.getInstalledVersions = this.getInstalledVersions.bind(this);
    }
    extractVersions(stdout: string, includeCurrent: boolean) {
        return stdout.split('\n').slice(3).filter(s => includeCurrent || s.indexOf('=>') === -1)
            .map(s => s.replace('=>', '').trim()).filter(s => s.length > 0);
    }
    async getInstalledVersions(includeSystem: boolean = true, includeCurrent: boolean = true): Promise<string[]> {
        const out = await execAsync('gvm list');
        let versions = this.extractVersions(out, includeCurrent);
        if (!includeSystem) {
            versions = versions.filter(s => s !== 'system');
        }

        return versions;
    }
    async getAvailableVersions(): Promise<string[]> {
        const out = await execAsync('gvm listall');
        return this.extractVersions(out, true);
    }

    async getCurrentSelectedVersion(): Promise<VersionInfo> {
        const out = await execAsync('gvm list');
        const version = out.split('\n')
            .map(s => s.trim())
            .filter(s => s.startsWith('=>'))
            .map(s => s.replace('=>', ''));

        if (version.length === 0) {
            throw new Error('Couldn\'t find current version.');
        }

        if (version.length > 1) {
            throw new Error(`More than one version were found: ${version}`);
        }

        return {
            versionName: version[0],
            versionNumber: (await execAsync('go version')).replace('\n', '').replace('go version go', '')
        };
    }
}