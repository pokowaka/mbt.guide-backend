'use strict';

process.env.NODE_ENV = 'local';
const path = require('path');
const Mongoose = require('mongoose');
const RestHapi = require('rest-hapi');
const Config = require('../config');
const restHapiConfig = Config.get('/restHapiConfig');

(async function processTags() {
  RestHapi.config.loglevel = 'DEBUG';
  const Log = RestHapi.getLogger('tag-segment-count.js');
  try {
    Mongoose.connect(restHapiConfig.mongo.URI);
    RestHapi.config = restHapiConfig;
    RestHapi.config.absoluteModelPath = true;
    RestHapi.config.modelPath = path.join(__dirname, '/../server/models');
    let models = await RestHapi.generateModels(Mongoose);

    //DO WORK

    const Tag = Mongoose.model('tag');
    const tags = await RestHapi.list(Tag, { isDeleted: false, $embed: ['segments'] }, Log);

    Log.log('Updating segment counts....');

    for (let i = 0; i < tags.docs.length; i++) {
      Log.log(tags.docs[i]._id, tags.docs[i].segments.length);
      let tag = await RestHapi.update({
        model: 'tag',
        _id: tags.docs[i]._id.toString(),
        payload: { segmentCount: tags.docs[i].segments.length },
        Log: Log,
      });
    }

    Log.log('SCRIPT DONE!');
    process.exit(0);
  } catch (err) {
    Log.error(err);
    process.exit(1);
  }
})();
