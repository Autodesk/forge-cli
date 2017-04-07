'use strict';

const da = require('./');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('da (design automation)', function() {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('key is "DesignAutomationAPI"', () => {
    expect(da.key).to.equal('DesignAutomationAPI');
  });

  describe('validateStructure', () => {
    it('returns a validation error when missing a required field', () => {
      const resources = {
        "Resources": {
          "Activities": [
            {
              "steps-overkill": {
                "Parameters": {
                },
                "Instruction": {
                  "Script": "(command \"-OVERKILL\" \"All\" \"\" \"done\" \"SAVEAS\" \"\" \"steps-overkill.dwg\" \"quit\")"
                }
              }
            }
          ]
        }
      };
      expect(da.validateStructure(resources)).to.deep.equal({ error: true, message: 'Validation error' });
    });
    it('approves a valid input', () => {
      const resources = {
        "Resources": {
          "Activities": [
            {
              "steps-overkill": {
                "Parameters": {
                  "OutputParameters": []
                },
                "Instruction": {
                  "Script": "(command \"-OVERKILL\" \"All\" \"\" \"done\" \"SAVEAS\" \"\" \"steps-overkill.dwg\" \"quit\")"
                }
              }
            }
          ]
        }
      };
      expect(da.validateStructure(resources)).to.deep.equal({ error: false });
    });
  });

  describe('createDeployPlan', () => {
    it('properly calls create, update and destroy', () => {
      const existingActivity = "existing-activity";
      const newActivity = "new-activity";
      const activityToDelete = "activity-to-delete";
      const resources = {
        "Resources": {
          "Activities": [
            {
              "existing-activity": {
                "ActivityId": existingActivity,
                "Parameters": {
                  "OutputParameters": []
                }
              }
            },
            {
              "new-activity": {
                "ActivityId": newActivity,
                "Parameters": {
                  "OutputParameters": []
                }
              }
            }
          ]
        }
      };
      const fakeHeader = 'FAKE_HEADER';
      const fakeActivityInServer = {
        value: [{ "Id": activityToDelete }, { "Id": "existing-activity" }]
      };
      const fakeActivitiesDependecy = {
        list: sandbox.stub().returns(Promise.resolve(fakeActivityInServer)),
        create: sandbox.stub().returns(Promise.resolve({ "ok": true })),
        update: sandbox.stub().returns(Promise.resolve({ "ok": true })),
        destroy: sandbox.stub().returns(Promise.resolve({ "ok": true }))
      };
      const fakeDependencies = {
        activities: fakeActivitiesDependecy,
        console: {
          log: sandbox.stub()
        }
      };
      return da.createDeployPlan(resources, fakeHeader, fakeDependencies).then(plan => {
        return plan.execute().then(() => {
          expect(fakeDependencies.activities.create.calledOnce).to.equal(true);
          expect(fakeDependencies.activities.update.calledOnce).to.equal(true);
          expect(fakeDependencies.console.log.calledWithExactly('Execute plan')).to.equal(true);
          expect(fakeDependencies.console.log.calledWithExactly(`Activity ${newActivity} successfully created`)).to.equal(true);
          expect(fakeDependencies.console.log.calledWithExactly(`Activity ${existingActivity} successfully updated`)).to.equal(true);
          expect(fakeDependencies.console.log.calledWithExactly(`Activity ${activityToDelete} successfully deleted`)).to.equal(true);
        });
      });
    });
  });
});
