#### General
- whenever possible, think of your code in modules as something that can be used via the cli like in this project or directly as a node module. We do not have yet a good sample for this pattern (suggestions are welcomed!)
- do not introduce a new module for very similar functionality unless you have a good reason and you can defend it in the pull request. By instance, use node-fetch instead of request. If you really need to
add a new module, refactor out all usages of the old module

#### To add commands
- forge-cli-XX files must be as small as possible and will not be tested. 
- forge-cli-configure file is legacy and will be refactored https://jira.autodesk.com/browse/ACWB-224. DO NOT USE AS SAMPLE
- the actual functionality of the command musty be implemented in the modules directory. Filename is same as command name, lower case. 
- keep the dependency injection paradigm, never require a dependency without checking if it was passed as an arg to the function

#### modules directory
- every forge API must be added in its own directory. For now we have the auth and the design automation API's
- all code not specific to a forge API will be in the first level of the modules dir

#### naming conventions

* directory names are dasherized: upload-url is good and uploadUrl is bad
* file names start lowercase, then camelCase thisFile is good ThisFile or thisfile or this-file bad
* cli files are dasherized (forge-cli, forge-cli-command)

#### tests
- test files next to sources, name <sourcefile>-test.js
- run tests using `npm run test`

#### Github

- All code contributions must be submitted via a pull request.
- Commit messages must follow the [AngularJS Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/)
