'use strict';

const mongoose = require('mongoose');
const RestHapi = require('rest-hapi');

const Config = require('../../config');

const awsAccessKeyId = Config.get('/awsAccessKeyId');
const awsSecretAccessKey = Config.get('/awsSecretAccessKey');

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
});

module.exports = {
  plugin: {
    name: 'api',
    register,
  },
};

async function register(server, options) {
  try {
    const config = Config.get('/restHapiConfig');
    const mongoSSL = Config.get('/mongoSSL');
    console.log("mongoSSL:", mongoSSL)
    if (mongoSSL) {
      const certFileBuf = await getMongoCA();
      config.mongo.options =  { sslCA: certFileBuf.Body };
    }
    await server.register({
      plugin: RestHapi,
      options: {
        mongoose,
        config,
      },
    });
  } catch (err) {
    console.error('Failed to load plugin:', err);
  }
}

async function getMongoCA() {
  return new Promise((res, rej) => {
    const s3 = new AWS.S3();
    s3.getObject({ Bucket: 'mbt-guide-private-keys', Key: 'mbt-mongo.pem' }, function(
      error,
      certFileBuf
    ) {
      if (error != null) {
        console.error('Error loading mongo cert:', error);
        rej(error)
      } else {
        res(certFileBuf)
      }
    });
  })

}
