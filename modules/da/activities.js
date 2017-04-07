'use strict';

const consts = require('./constants');
/**
 * gets all activities associated with account
 * returns activities json
 */
function list(authHeaders, dependencies) {
  // check dependencies
  dependencies = dependencies || {};
  const fetch = dependencies.fetch || require('node-fetch');
  // end of dependencies check

  return fetch(consts.endPoints.activities, {
    headers: authHeaders,
    method: 'GET'
  })
  .then((res) => {
    if (!res.ok) {
      throw 'error getting definition';
    }
    return res.json();
  });
}

/**
 * creates an activity
 * returns promise
 */
function create(activityObject, authHeaders, dependencies) {
  // check dependencies
  dependencies = dependencies || {};
  const fetch = dependencies.fetch || require('node-fetch');
  // end of dependencies check

  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders);

  return fetch(consts.endPoints.activities, {
    method: 'POST',
    headers,
    body: JSON.stringify(activityObject)
  });
}

/**
 * updates and activity
 * returns new promise
 */
function update(activityObject, authHeaders, dependencies) {
  // check dependencies
  dependencies = dependencies || {};
  const fetch = dependencies.fetch || require('node-fetch');
  // end of dependencies check

  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders);

  return fetch(consts.endPoints.activities + '(\'' + activityObject.Id + '\')', {
    method: 'PATCH',
    headers,
    body: JSON.stringify(activityObject)
  });
}

/**
 * deletes an activity
 * returns promise
 */
function destroy(activityId, authHeaders, dependencies) {
  // check dependencies
  dependencies = dependencies || {};
  const fetch = dependencies.fetch || require('node-fetch');
  // end of dependencies check

  const headers = Object.assign({ 'Content-Type': 'application/json' }, authHeaders);

  return fetch(consts.endPoints.activities + '(\'' + activityId + '\')', {
    method: 'DELETE',
    headers
  });
}

module.exports = {
  list,
  update,
  create,
  destroy
};
