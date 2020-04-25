import { expect } from 'chai';
import { execAsync } from "../../childProcessHelper";

suite('given a child process helper', () => {
    test('it should returno stdout on sucess', async () => {
        var result = await execAsync('echo Success');
        expect(result).to.be.equals('Success\n');
    });
});