import { exec } from 'child_process';
import { execAsync } from './childProcessHelper';

export default class VersionsList {
    extractVersions(stdout: string) {
        return stdout.split('\n').slice(3).map(s => s.trim()).filter(s => s.length > 0);
    }
    async getInstalledVersions(): Promise<string[]> {
        const out = await execAsync('gvm list');
        return this.extractVersions(out);
    }
    async getAvailableVersions(): Promise<string[]> {
        const out = await execAsync('gvm listall');
        return this.extractVersions(out);
    }
}