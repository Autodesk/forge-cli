# Forge Command Line Interface (CLI)
The Forge Command Line Interface (CLI) is a unified tool to manage your Forge services.
Using Forge CLI you can create, update, query and delete resources in your Forge account from the command line.
Use Forge CLI to automate the build and deploy process of Forge depended services.

## Contributing guidelines
See [CONTRIBUTING](./CONTRIBUTING.md)

## Usage

| Step | Command                                                                  | Description                                                                                                                                |
| ---- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | `mkdir my-forge-da-app && cd my-forge-da-app` | Create the project directory                                                                                                                             |
| 2    | `npm init`                            | Initialize npn in your directory                                                                                                              |
| 3    | `npm install adsk-forge-cli`                                            | Install Forge CLI                                                                                                                          |
| 4    | [Create a Forge app](https://developer.autodesk.com/myapps/create)   | Get Forge app id and secret                                                                                                                |
| 5    | `node_modules/.bin/forge-cli configure -i [FORGE_ID] -s [FORGE_SECRET]`  | Connect Forge CLI with your Forge app                                                                                                      |
| 6    | `node_modules/.bin/forge-cli generate`                                   | Generate a [Forge resources sample yaml](./templates/forge-resources-template.yml) |
| 7    | `node_modules/.bin/forge-cli deploy`                                     | Deploy resources to Forge                                                                                                                  |

## Commands

```Usage: forge-cli [command] [options]```

### configure [options]
Set up User ID and Secret

  Options:

    -i, --id [value]       Optional Client ID
    -s, --secret [value]   Optional Client Secret
    -p, --profile [value]  Optional Profile Name (default is 'default')
    -h, --help             output usage information

### generate
Generates a Forge resource yaml file where to add your resources

### deploy
Apply the changes required to reach the desired state of the configuration as
specified by the forge-resources.yml. This may include creating, updating, or deleting resources.

  Options:

    -p, --plan  Display a deploy plan without deploying anything

Plan Example:
```
  DesignAutomationAPI:

  ~ steps-overkill
  + drawLine
  - steps-distil
  - oldDrawLine

 ```

 In the above example `steps-overkill` will be updated, `drawLine` will be created
 and `steps-distil` and `oldDrawLine` will be deleted.

### da [options]
Design Automation API commands

  Options:

    -h, --help         output usage information
    -l, --list <type>  List the DA resources available in the Forge app according the specified type [activities]

### help

    -h, --help  output usage information


### License

Copyright 2016 Autodesk Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.