import { exec } from 'child_process';

export function execAsync(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err || stderr) {
                reject([err || stderr]);
            }

            resolve(stdout);
        });
    });
}