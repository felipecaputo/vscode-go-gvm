import { exec } from 'child_process';
import { OutputChannel } from 'vscode';

export function execAsync(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (stderr !== "" || err !== null) {
                reject([stderr || err]);
            }

            resolve(stdout);
        });
    });
}

export async function execAsyncWithOutput(output: OutputChannel, command: string, description: string) {
    output.show();
    output.append(description);
    try {
        await execAsync(command);
        output.appendLine(' ... DONE');
    } catch (e) {
        output.appendLine(` ... Failed: ${e}`);
        throw e;
    }
}