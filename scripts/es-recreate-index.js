const elasticSearch = require('elasticsearch');

require('dotenv').config();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const elasticSearchClient = new elasticSearch.Client({
  host: process.env.ES_ENDPOINT,
});

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

recreateIndex();
