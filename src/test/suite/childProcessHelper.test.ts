import { expect } from 'chai';
import { execAsync } from "../../childProcessHelper";

suite('given a child process helper', () => {
    test('it should return stdout on sucess', async () => {
        var result = await execAsync('echo Success');
        expect(result).to.be.equals('Success\n');
    });

    test('it should stderr on error', async () => {
        let result;
        let error;
        try {
            result = await execAsync('amazing-strange-command');
        } catch (e) {
            error = e;
        }

        expect(result).to.be.undefined;
        expect(error).to.not.be.undefined;
    });
});