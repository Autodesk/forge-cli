'use strict';

const expect = require('chai').expect;
const sandbox = require('sinon').sandbox.create();
const path = require('path');
const writeJSONDataToFile = require('./writeJSONDataToFile');

// dependencies
const fsStub = {
  access: sandbox.stub(),
  mkdir: sandbox.stub(),
  readFile: sandbox.stub(),
  writeFile: sandbox.stub()
};

const dependencies = {
  fs: fsStub
};

describe('writeJSONDataToFile', () => {
  afterEach(() => {
    sandbox.reset();
  });

  it('creates forge directory if it doesnt exist', () => {
    fsStub.access.yields("fake fs access error");
    fsStub.mkdir.yields();

    writeJSONDataToFile({}, 'directory/path/', 'fileName', '', dependencies);

    expect(fsStub.mkdir.firstCall.args[0]).to.equal('directory/path/');
    expect(fsStub.writeFile.firstCall.args[0]).to.equal(path.join('directory/path/', 'fileName'));
  });

  it('logs directory error on fs mkdir error', () => {
    fsStub.access.yields("fake fs access error");
    fsStub.mkdir.yields({ message: "fake error" });

    writeJSONDataToFile({}, '', '', '', dependencies);

    // Get error returned when fs.mkdir's callback is called with an error
    const callBackError = fsStub.mkdir.firstCall.args[1]({ message: "fake fs mkdir error" });

    expect(callBackError.message).to.equal('fake fs mkdir error');
    expect(fsStub.writeFile.calledWith()).to.equal(false);
  });

  it('writes to file if directory exists (but file doesnt)', () => {
    fsStub.access.yields();
    fsStub.readFile.yields({ code: "ENOENT" });

    writeJSONDataToFile({}, 'directory/path/', 'fileName2', '', dependencies);

    expect(fsStub.writeFile.firstCall.args[0]).to.equal(path.join('directory/path/', 'fileName2'));
  });

  it('logs readFile error on non-ENOENT error', () => {
    fsStub.access.yields();
    fsStub.readFile.yields({ message: "fake error" });

    writeJSONDataToFile({}, '', '', '', dependencies);

    // Get error returned when fs.readFile's callback is called with an error
    const callBackError = fsStub.readFile.firstCall.args[1]({ message: "fake readFile error" });

    expect(callBackError.message).to.equal('fake readFile error');
    expect(fsStub.writeFile.calledWith()).to.equal(false);
  });

  it('merges existing data with new data if file with data already exists', () => {
    fsStub.access.yields();
    fsStub.readFile.yields(false, JSON.stringify({ data1: { data: 'foo' }}));

    writeJSONDataToFile({ data2: { data: 'bar' }}, '', '', '', dependencies);

    const mergedString = JSON.stringify({
      data1: {
        data: 'foo'
      },
      data2: {
        data: 'bar'
      }
    });

    expect(fsStub.writeFile.firstCall.args[1]).to.equal(mergedString);
  });

  it('logs write error on writeFile error', () => {
    fsStub.access.yields();
    fsStub.readFile.yields(false, JSON.stringify({ data1: { data: 'foo' }}));
    fsStub.writeFile.yields({ message: 'fake error' });

    writeJSONDataToFile({ data2: { data: 'bar' }}, '', '', '', dependencies);

    // Get error returned when fs.writeFile's callback is called with an error
    const callBackError = fsStub.readFile.firstCall.args[1]({ message: "fake writeFile error" });

    expect(callBackError.message).to.equal('fake writeFile error');
  });

});
