'use strict';

const expect = require('chai').expect;
const sandbox = require('sinon').sandbox.create();
const generateTemplate = require('./generate');

const dependencies = {
  fs: {
    writeFile: sandbox.spy(),
    readFileSync: sandbox.spy(),
    writeFileSync: sandbox.spy()
  },
  path: {
    resolve: sandbox.spy()
  },
  appRootPath: sandbox.spy()
};

let writeCallback;

describe('generateTemplate', () => {
  beforeEach(() => {
    generateTemplate('lalo', 'lelo', dependencies);
    writeCallback = dependencies.fs.writeFile.getCall(0).args[3];
  });
  afterEach(() => {
    sandbox.reset();
  });

  it('tries to creates file', () => {
    expect(dependencies.fs.writeFile.calledWith()).to.equal(true);
  });

  it('does not call create readFileSync if file write throws an error', () => {
    writeCallback('error');
    expect(dependencies.fs.readFileSync.calledWith()).to.equal(false);
  });

  it('creates read and write streams and pipes file if writeFile succeds', () => {
    writeCallback();
    expect(dependencies.fs.readFileSync.calledWith()).to.equal(true);
    expect(dependencies.fs.writeFileSync.calledWith()).to.equal(true);
  });
});
