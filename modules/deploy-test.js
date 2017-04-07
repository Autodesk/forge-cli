'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const deploy = require('./deploy');

describe('deployResources', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('throws an error when no forge-resources.yml file is found', () => {
    try {
      return deploy.deployResources({});
    } catch (err) {
      expect(err.message).to.equal(`You don't have a forge-resources.yml file. Please run forge-cli create and configure before trying to deploy`);
      return null;
    }
  });

  it('warns about un-supported resources', () => {
    const fakeResources = `DesignAutomationAPI:\nUnSupportedResource:`;
    const fakeExecute = sandbox.stub();
    const fakeResource = {
      key: 'DesignAutomationAPI',
      validateStructure: sandbox.stub().returns({ error: false }),
      createDeployPlan: sandbox.stub().returns({ execute: fakeExecute })
    };
    const fakeDependencies = {
      fs: {
        readFileSync: sandbox.stub().returns(fakeResources)
      },
      auth: {
        getAuthHeader: sandbox.stub().returns(Promise.resolve('fake_auth_header'))
      },
      supportedResources: [fakeResource],
      console: {
        warn: sandbox.stub(),
        log: sandbox.stub()
      }
    };

    return deploy.deployResources(fakeDependencies).then(() => {
      expect(fakeDependencies.fs.readFileSync.called).to.equal(true);
      expect(fakeDependencies.auth.getAuthHeader.called).to.equal(true);
      expect(fakeResource.validateStructure.called).to.equal(true);
      expect(fakeResource.createDeployPlan.called).to.equal(true);
      expect(fakeExecute.called).to.equal(true);
      expect(fakeDependencies.console.warn.calledWithExactly('UnSupportedResource is not supported. It will be ignored.')).to.equal(true);
    });
  });

  it('logs an error when there are validation errors', () => {
    const fakeResources = `DesignAutomationAPI:\nUnSupportedResource:`;
    const fakeExecute = sandbox.stub();
    const fakeResource = {
      key: 'DesignAutomationAPI',
      validateStructure: sandbox.stub().returns({ error: true }),
      createDeployPlan: sandbox.stub().returns({ execute: fakeExecute })
    };
    const fakeDependencies = {
      fs: {
        readFileSync: sandbox.stub().returns(fakeResources)
      },
      auth: {
        getAuthHeader: sandbox.stub().returns(Promise.resolve('fake_auth_header'))
      },
      supportedResources: [fakeResource],
      console: {
        warn: sandbox.stub(),
        log: sandbox.stub()
      }
    };

    return deploy.deployResources(fakeDependencies).catch(() => {
      expect(fakeDependencies.fs.readFileSync.called).to.equal(true);
      expect(fakeDependencies.auth.getAuthHeader.called).to.equal(false);
      expect(fakeResource.validateStructure.called).to.equal(true);
      expect(fakeResource.createDeployPlan.called).to.equal(false);
      expect(fakeExecute.called).to.equal(false);
      expect(fakeDependencies.console.warn.calledWithExactly('UnSupportedResource is not supported. It will be ignored.')).to.equal(true);
      expect(fakeDependencies.console.log.calledWithExactly('Resources definition is not valid, please compare with forge-resources template file')).to.equal(true);
    });
  });
});
