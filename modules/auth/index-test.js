'use strict';

const expect = require('chai').expect;
const sandbox = require('sinon').sandbox.create();
const fetchMock = require('fetch-mock');
const auth = require('./');

// dependencies
const dependencies = {
  fetch: fetchMock.fetchMock
};

describe('auth (forge auth)', function() {
  afterEach(() => {
    sandbox.reset();
    fetchMock.restore();
  });

  describe('verifyCredentials', () => {
    it('calls forge auth endpoint with given credentials', () => {
      fetchMock.mock('https://developer.api.autodesk.com/authentication/v1/authenticate', { "developerMessage": "lelo" });
      auth.verifyCredentials('id', 'secret', dependencies);

      expect(fetchMock.called('https://developer.api.autodesk.com/authentication/v1/authenticate')).to.equal(true);
    });
  });
});
