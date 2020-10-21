'use strict';

process.env.NODE_ENV = 'local';

const path = require('path');
const config = require('../config');

var url = 'mongodb://localhost:27017/';
var MongoClient = require('mongodb').MongoClient(url, { useUnifiedTopology: true });

function main() {
  MongoClient.connect(function (err, db) {
    if (err) throw err;
    const dbo = db.db('mbt');

    dbo
      .collection('tag')
      .find({ name: /entropy/ })
      .toArray(function (err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
          console.log(result[i]);
          let segmentId = result[i]._id;
          dbo
            .collection('segment_tag')
            .find({ segment: segmentId })
            .toArray(function (err, result) {
              if (err) throw err;
              console.log(result);
            });
        }
        db.close();
      });
  });
}

main();
