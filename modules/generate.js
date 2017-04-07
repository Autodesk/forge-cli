'use strict';

/**
 * Copies templte source file to target if it does not exist
 */
function generateTemplate(sourceFile, targetFile, dependencies) {
  // set up required modules
  dependencies = dependencies || {};

  const fs = dependencies.fs || require('fs');
  const path = dependencies.path || require('path');
  const appRootPath = dependencies.appRootPath || require('app-root-path');

  fs.writeFile(path.resolve(appRootPath.toString(), targetFile), '', { flag: 'wx' }, (err) => {
    if (err) {
      console.log('forge-resources yaml file already exists at root dir');
      return;
    }

    const sourceTemplate = fs.readFileSync(path.resolve(__dirname, '../templates', sourceFile), 'utf-8');
    fs.writeFileSync(path.resolve(appRootPath.toString(), targetFile), sourceTemplate);
    console.log("forge-resources yaml file saved in your root dir");
  });
}

module.exports = generateTemplate;
