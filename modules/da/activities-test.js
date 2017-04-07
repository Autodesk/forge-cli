'use strict';

const expect = require('chai').expect;
const fetchMock = require('fetch-mock');
const daActivities = require('./activities');


// dependencies
const dependencies = {
  fetch: fetchMock.fetchMock
};

describe('da activities', function() {
  afterEach(() => {
    fetchMock.reset();
  });

  describe('list', () => {
    it('call activities end point with GET', () => {
      fetchMock.mock('https://developer.api.autodesk.com/autocad.io/us-east/v2/Activities', 200);
      daActivities.list({}, dependencies);

      expect(fetchMock.lastOptions().method === 'GET').to.equal(true);
    });
  });

  describe('create', () => {
    it('calls delete end point with POST', () => {
      fetchMock.mock('https://developer.api.autodesk.com/autocad.io/us-east/v2/Activities', 200);
      daActivities.create({}, {}, dependencies);

      expect(fetchMock.lastOptions().method === 'POST').to.equal(true);
    });
  });

  describe('update', () => {
    it('calls activities end point with DELETE and then POST', () => {
      fetchMock.mock('https://developer.api.autodesk.com/autocad.io/us-east/v2/Activities(\'lalo\')', 204);
      daActivities.update({ Id: 'lalo' }, {}, dependencies);

      expect(fetchMock.lastOptions().method === 'PATCH').to.equal(true);
    });
  });

  describe('destory', () => {
    it('calls activities end point with DELETE', () => {
      fetchMock.mock('https://developer.api.autodesk.com/autocad.io/us-east/v2/Activities(\'lalo\')', 200);
      daActivities.destroy('lalo', {}, dependencies);

      expect(fetchMock.lastOptions().method === 'DELETE').to.equal(true);
    });
  });
});
