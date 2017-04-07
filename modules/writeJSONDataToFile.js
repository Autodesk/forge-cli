#!/usr/bin/env node

'use strict';

/**
 * writes data to a file
 */
function writeDataToFile(filePath, credentialsObj, success, fs) {
  const str = JSON.stringify(credentialsObj);

  fs.writeFile(filePath, str, (err) => {
    if (err) {
      console.error(err.message);
      return err;
    }

    console.log(success);
    return true;
  });
}

/**
 * Writes JSON data to a file
 */
function writeJSONDataToFile(credentialsObj, dirPath, fileName, success, dependencies) {
  // set up required modules
  dependencies = dependencies || {};
  const fs = dependencies.fs || require('fs');
  const path = dependencies.path || require('path');

  const filePath = path.join(dirPath, fileName);

  fs.access(dirPath, (err) => {
    if (err) {
      fs.mkdir(dirPath, (err) => {
        if (err) {
          console.error(err.message);
          return err;
        }

        return writeDataToFile(filePath, credentialsObj, success, fs);
      });
    }

    else {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          // If error indicates file does not exist, just write to new file
          if (err.code === 'ENOENT') {
            return writeDataToFile(filePath, credentialsObj, success, fs);
          } else {
            console.error(err.message);
            return err;
          }
        } else {
          const dataObj = Object.assign(data.length ? JSON.parse(data) : {}, credentialsObj);
          return writeDataToFile(filePath, dataObj, success, fs);
        }
      });
    }
  });
}

module.exports = writeJSONDataToFile;
