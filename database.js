const AWS = require("aws-sdk");
const config = require("./../../../.aws/config.js");
const uuid = require("uuid");

const addPage = function (request, response) {
  AWS.config.update(config.aws_remote_config);
  const docClient = new AWS.DynamoDB.DocumentClient();
  const Item = { ...request.body };
  Item.id = uuid();
  var params = {
    TableName: config.aws_table_name,
    Item: Item,
  };

  docClient.put(params, function (err, data) {
    if (err) {
      response.send({
        success: false,
        message: err,
      });
    } else {
      response.send({
        success: true,
        message: "Page added successfully!",
        page: data,
      });
    }
  });
};

module.exports = {
  addPage,
};

addPage();
