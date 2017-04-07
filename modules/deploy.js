'use strict';

const consts = require('./constants');

/**
 * Returns the parsed forge-resources.yml as JSON object
 */
function getResources(yaml, path, appRootPath, fs) {
  const resourcesPath = path.resolve(appRootPath.toString(), consts.resourcesYml);
  try {
    const data = fs.readFileSync(resourcesPath, 'utf8');
    return yaml.parse(data);
  } catch (e) {
    throw new Error(`You don't have a forge-resources.yml file. Please run forge-cli create and configure before trying to deploy`);
  }
}

/**
 * Warns via console if any unsupported APIs are used
 */
function getUnsupportedResources(resources, supportedResources) {
  const usedResources = Object.keys(resources);
  const supportedResourceKeys = supportedResources.map(r => r.key);
  return usedResources.filter(used => supportedResourceKeys.indexOf(used) === -1);
}

/**
 * - Runs validateStructure on all supportedResources passing in the resource data
 * - Returns any validation which results in an error
 */
function getValidationErrors(resources, supportedResources) {
  return supportedResources
    .map(r => r.validateStructure(resources[r.key]))
    .filter(validation => validation.error);
}

/**
 * Generates a deploy plan without executing it
 */
function generateDeployPlan(dependencies) {
  // set up required modules
  dependencies = dependencies || {};
  const appRootPath = dependencies.appRootPath || require('app-root-path');
  const auth = dependencies.auth || require('./auth');
  const console = dependencies.console || require('console');
  const fs = dependencies.fs || require('fs');
  const path = dependencies.path || require('path');
  const supportedResources = dependencies.supportedResources || [require('./da')];
  const yaml = dependencies.yaml || require('yamljs');
  //end of dependencies check

  // get the resources from forge-resources.yml
  const resources = getResources(yaml, path, appRootPath, fs);

  // notify the user if there is anything extraneous resources
  const unsupported = getUnsupportedResources(resources, supportedResources);

  if (unsupported.length) {
    console.warn(`${unsupported.join(', ')} is not supported. It will be ignored.`);
  }

  // validate the structure of the supported resources
  const errors = getValidationErrors(resources, supportedResources);

  if (errors.length) {
    const err = `Resources definition is not valid, please compare with forge-resources template file`;
    console.log(err);
    return Promise.reject(err);
  }

  // Get an authorization header so we can communicate with the server
  return auth.getAuthHeader()
    .then(header => Promise.all(
      // create a deploy plan for each of the supported resources
      supportedResources.map(r => r.createDeployPlan(resources[r.key], header, dependencies))));
}

/**
 * interface Resource {
 *   key: string;
 *
 *   validateStructure(resources: any): Validation
 *   createDeployPlan(resources: any): Promise<Plan>
 * }
 *
 * interface Validation {
 *   error: boolean;
 *   message: string;
 * }
 *
 * interface Plan {
 *   execute(): Promise<void>;
 * }
 */
function deployResources(dependencies) {
  // set up required modules
  dependencies = dependencies || {};
  const console = dependencies.console || require('console');
  //end of dependencies check

  return generateDeployPlan(dependencies)
    .then(results => Promise.all(
      // execute the deploy plans
      results.map(result => result.execute())))
    .catch(e => {
      console.log('Error', e);
    });
}

/**
 * Console logs the deploy plan
 */
function printDeployPlan(dependencies) {
  // set up required modules
  dependencies = dependencies || {};
  const console = dependencies.console || require('console');
  //end of dependencies check

  return generateDeployPlan(dependencies).then(plans => plans.map(plan => console.log(plans.toString())));
}


module.exports = { deployResources, printDeployPlan };
