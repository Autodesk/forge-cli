'use strict';

const consts = require('./constants');

/**
 * get auth bearer.
 * return a promise to be resolved with the response
 * if called with authData, it uses it. Otherwise uses default credentials in creds object
 */
function getAuthBearer(authData, dependencies) {
  dependencies = dependencies || {};
  const fetch = dependencies.fetch || require('node-fetch');
  const querystring = dependencies.querystring || require('querystring');
  const appRootPath = dependencies.appRootPath || require('app-root-path');
  const path = dependencies.path || require('path');

  authData = authData || require(path.resolve(appRootPath.toString(), 'credentials')).default;

  const requestData = querystring.stringify({
    client_id: authData.forge_client_id,
    client_secret: authData.forge_secret,
    grant_type: 'client_credentials',
    scope: 'code:all'
  });

  return fetch(consts.endPoints.authenticate, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    body: requestData
  }).then((res) => {
    return res.text();
  }).then(text => text);
}

/**
 * Returns Auth Header
 */
function getAuthHeader(authData, dependencies) {
  return getAuthBearer(authData, dependencies)
    .then(r => {
      const parsedR = JSON.parse(r);
      const token_type = parsedR.token_type;
      const access_token = parsedR.access_token;

      const authHeader = {
        'Authorization': token_type + ' ' + access_token
      };

      return Promise.resolve(authHeader);
    });
}

/**
 * Verifies given credentials making a forge API auth call
 */
function verifyCredentials(forge_client_id, forge_secret, dependencies) {
  // pass through dependencies (for testing)
  dependencies = dependencies || {};

  return getAuthBearer({ forge_client_id, forge_secret }, dependencies);
}


module.exports = {
  verifyCredentials,
  getAuthBearer,
  getAuthHeader
};
