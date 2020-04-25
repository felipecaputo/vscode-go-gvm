import { expect } from 'chai';
import { stub } from 'sinon';
import VersionsList from "../../VersionsList";
import * as helper from '../../childProcessHelper';

const goVersions = [
    "",
    "gos (available)",
    "",
    "go1.12",
    "go1.12.7",
    "go1.14"
];

const goInstalledVersions = [
    "",
    "gos (installed)",
    "",
    "go1.10.7",
    "go1.13.8"
];

suite('Given a version list', () => {
    test('it should return available versions', async () => {
        const versionLister = new VersionsList();
        let mocked = stub(helper, 'execAsync');
        try {
            mocked.returns(new Promise(resolve => resolve(goVersions.join("\n"))));

            let versions = await versionLister.getAvailableVersions();
            expect(versions).to.have.length(3);
            expect(versions).to.contain("go1.12");
            expect(versions).to.contain("go1.12.7");
            expect(versions).to.contain("go1.14");

            expect(mocked.alwaysCalledWith("gvm listall")).to.be.true;
        } finally {
            mocked.restore();
        }
    });

    test('it should return installed versions', async () => {
        const versionLister = new VersionsList();
        let mocked = stub(helper, 'execAsync');
        try {
            mocked.returns(new Promise(resolve => resolve(goInstalledVersions.join("\n"))));

            let versions = await versionLister.getInstalledVersions();
            expect(versions).to.have.length(2);
            expect(versions).to.contain("go1.10.7");
            expect(versions).to.contain("go1.13.8");

            expect(mocked.alwaysCalledWith("gvm list")).to.be.true;
        } finally {
            mocked.restore();
        }
    });
});