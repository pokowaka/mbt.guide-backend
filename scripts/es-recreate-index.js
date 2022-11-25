const elasticSearch = require('@elastic/elasticsearch');
const Config = require('../config');
const esEndpoint = Config.get('/esEndpoint');
require('dotenv').config();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const elasticSearchClient = new elasticSearch.Client(esEndpoint);

async function recreateIndex() {
  let ready = false;

  while (!ready) {
    try {
      ready = await elasticSearchClient.ping();
    } catch (err) {
      console.log('WAITING FOR ELASTICSEARCH');
      await sleep(1000);
    }
  }

  console.log('ELASTICSEARCH READY');

  await deleteIndex();
  await createIndex();
}

async function createIfNotExists() {
  let ready = false;

  while (!ready) {
    try {
      ready = await elasticSearchClient.ping();
    } catch (err) {
      console.log('WAITING FOR ELASTICSEARCH');
      await sleep(1000);
    }
  }

  console.log('ELASTICSEARCH READY');
  if (!existsIndex('segment')) {
    createIndex();
  }
}

async function existsIndex(ind) {
  return await elasticSearchClient.indices.exists({ index: ind });
}

async function deleteIndex() {
  try {
    await elasticSearchClient.indices.delete({
      index: 'segment',
    });
    console.log('ELASTICSEARCH INDEX DELETED');
  } catch (error) {
    console.log(`ELASTICSEARCH DID NOT DELETE INDEX: ${error.message}`);
  }
}

async function createIndex() {
  await elasticSearchClient.indices.create({
    index: 'segment',
  });

  console.log('ELASTICSEARCH INDEX CREATED');
  await elasticSearchClient.indices.putMapping({
    index: 'segment',
    body: {
      properties: {
        title: { type: 'text' },
        description: { type: 'text' },
        start: { type: 'integer' },
        end: { type: 'integer' },
        low_tags: { type: 'text' },
        mid_tags: { type: 'text' },
        high_tags: { type: 'text' },
        videoYtId: { type: 'text' },
        captions: { type: 'text' },
      },
    },
  });
  console.log('ELASTICSEARCH INDEX MAPPED');
}

if (require.main === module) {
  recreateIndex();
}
module.exports.recreateIndex = recreateIndex;
module.exports.createIfNotExists = createIfNotExists;
