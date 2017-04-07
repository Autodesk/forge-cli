const schema = {
  "id": "/daSchema",
  "type": "object",
  "properties": {
    "Resources": {
      "type": "object",
      "properties": {
        "Activities": { "$ref": "/daActivitiesSchema" },
        "required": true
      }
    }
  }
};

const activitiesSchema = {
  "id": "/daActivitiesSchema",
  "type": "array",
  "items": {
    "type": "object",
    "patternProperties": {
      "[a-z]": {
        "type": "object",
        "properties": {
          "ActivityId": { "type": "string" },
          "RequiredEngineVersion": { "type": "string" },
          "Parameters": {
            "type": "object",
            "properties": {
              "InputParameters": { "type": "array" },
              "OutputParameters": {
                "type": "array",
                "required": true
              }
            }
          },
          "Instruction": {
            "type": "object",
            "properties": {
              "CommandLineParameters": { "type": "string" },
              "Script": {
                "type": "string",
                "required": true
              }
            }
          }
        },
        "additionalProperties": false
      }
    },
    "additionalProperties": false
  }
};

module.exports = {
  schema,
  activitiesSchema
};
