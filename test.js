var AWS = require("aws-sdk");

AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  else {
    console.log("Access Key: ", AWS.config.credentials.accessKeyId);
  }
});
