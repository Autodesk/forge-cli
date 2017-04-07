'use strict';

/**
 * Post activity to forge API
 */
function publishActivity(activityDescription, authHeaders, exists, dependencies) {
  // set up required modules
  dependencies = dependencies || {};
  const console = dependencies.console || require('console');
  const activities = dependencies.activities || require('./activities');
  //end of dependencies check

  const id = Object.keys(activityDescription)[0];

  const requiredEngineVersion = activityDescription[id] ? activityDescription[id].RequiredEngineVersion : null;
  const inputParams = activityDescription[id].Parameters ? activityDescription[id].Parameters.InputParameters : null;
  const outputParams = activityDescription[id].Parameters.OutputParameters;
  const instruction = activityDescription[id].Instruction;
  const customActivityId = activityDescription[id].ActivityId;

  const activityObject = {
    "HostApplication": "",
    "RequiredEngineVersion": requiredEngineVersion || '21.0',
    "Parameters": {
      "InputParameters": inputParams || [{
        "Name": "HostDwg",
        "LocalFileName": "$(HostDwg)"
      }],
      "OutputParameters": outputParams
    },
    "Instruction": instruction,
    "Version": 2,
    "AppPackages": [],
    "Id": customActivityId || id
  };

  if (exists) {
    return activities.update(activityObject, authHeaders)
      .then(res => {
        if (res.ok) {
          console.log(`Activity ${id} successfully updated`);
        } else {
          console.log(`Error updating activity ${id}`);
        }
      })
      .catch((e) => {
        console.log('Network error creating activity \n --- ', e);
      });
  } else {
    return activities.create(activityObject, authHeaders)
      .then(res => {
        if (res.ok) {
          console.log(`Activity ${id} successfully created`);
        } else {
          console.log(`Error creating activity ${id}`);
        }
      })
      .catch((e) => {
        console.log('Network error creating activity \n --- ', e);
      });
  }
}

/**
 * Creates an activity
 */
function createActivity(activityDescription, authHeaders, dependencies) {
  return publishActivity(activityDescription, authHeaders, false, dependencies);
}

/**
 * Updates an activity
 */
function updateActivity(activityDescription, authHeaders, dependencies) {
  return publishActivity(activityDescription, authHeaders, true, dependencies);
}

/**
 *
 * Deletes an activity
 */
function destroyActivity(activityId, authHeaders, dependencies) {
  // set up required modules
  dependencies = dependencies || {};
  const console = dependencies.console || require('console');
  const activities = dependencies.activities || require('./activities');
  //end of dependencies check

  return activities.destroy(activityId, authHeaders, dependencies)
    .then(res => {
      if (res.ok) {
        console.log(`Activity ${activityId} successfully deleted`);
      } else {
        console.log(`Error deleting activity ${activityId}`);
      }
    });
}

const schema = require('./schema').schema;
const activitiesSchema = require('./schema').activitiesSchema;
const Validator = require('jsonschema').Validator;

/**
 * Returns Activity ID
 */
function getActivityId(activity) {
  const key = Object.keys(activity)[0];
  return activity[key].ActivityId || key;
}

module.exports = {
  key: 'DesignAutomationAPI',

  /**
   * Validates the resources and returns a validation
   */
  validateStructure(resources) {
    const v = new Validator();
    v.addSchema(activitiesSchema, '/daActivitiesSchema');

    const valid = v.validate(resources, schema).valid;

    if (valid) {
      return { error: false };
    } else {
      return { error: true, message: 'Validation error' };
    }
  },

  createDeployPlan(resources, header, dependencies) {
    // set up required modules
    dependencies = dependencies || {};
    const console = dependencies.console || require('console');
    const activities = dependencies.activities || require('./activities');
    //end of dependencies check

    const Resources = resources.Resources;
    const plan = {
      create: [],
      update: [],
      destroy: []
    };

    return activities.list(header, dependencies)
      .then(activities => {
        // build update and create plan
        Resources.Activities.forEach((activity) => {
          const exists = activities.value.some(activityInServer => activityInServer.Id === (activity[Object.keys(activity)[0]].ActivityId || Object.keys(activity)[0]));

          if (exists) {
            plan.update.push(activity);
          } else {
            plan.create.push(activity);
          }
        });

        // build destroy plan
        const clientIds = Resources.Activities.map(activity => {
          const key = Object.keys(activity)[0];
          return activity[key].ActivityId || key;
        });

        // list  non public activity ids that exist on the server
        const serverIds = activities.value.filter(activity => (!activity.IsPublic || activity.IsPublic === 'false')).map(activity => activity.Id);
        plan.destroy = serverIds.filter(id => clientIds.indexOf(id) === -1);

        return {

          /**
           * Executes the plan. Returns a void promise which resolves when plan is done
           */
          execute: () => {
            console.log(`Execute plan`);

            return Promise.all([
              plan.create.map(activity => createActivity(activity, header, dependencies)),
              plan.update.map(activity => updateActivity(activity, header, dependencies)),
              plan.destroy.map(activity => destroyActivity(activity, header, dependencies))
            ]);
          },
          toString: () => {
            const creates = plan.create.map(activity => '+ ' + getActivityId(activity));
            const updates = plan.update.map(activity => '~ ' + getActivityId(activity));
            const destroys = plan.destroy.map(activityId => '- ' + activityId);

            return 'DesignAutomationAPI:\n\n' + creates.concat(updates).concat(destroys).join('\n') + '\n';
          }
        };
      });
  }
};
