'use strict';

const Confidence = require('confidence');
const Dotenv = require('dotenv');
const path = require('path');

Dotenv.config({ silent: true });

/**
 * NOTE: Only secrets and values affected by the environment (not NODE_ENV) are stored in .env files. All other values
 * are defined here.
 */

// The criteria to filter config values by (NODE_ENV). Typically includes:
//  - local
//  - development
//  - production
//  - $default
const criteria = {
  env: process.env.NODE_ENV,
};

// These values stay the same regardless of the environment.
const constants = {
  USER_ROLES: {
    USER: 'User',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin',
  },
  PERMISSION_STATES: {
    INCLUDED: 'Included',
    EXCLUDED: 'Excluded',
    FORBIDDEN: 'Forbidden',
  },
  CHAT_TYPES: {
    DIRECT: 'direct',
    GROUP: 'group',
  },
  NOTIFICATION_TYPES: {
    SHARED_DOCUMENT: 'shared-document',
    FOLLOW: 'follow',
    CONTACT: 'contact',
  },
  AUTH_STRATEGIES: {
    TOKEN: 'standard-jwt',
    SESSION: 'jwt-with-session',
    REFRESH: 'jwt-with-session-and-refresh-token',
  },
  REQUIRED_PASSWORD_STRENGTH: {
    USER: 3,
    ADMIN: 4,
    SUPER_ADMIN: 4,
  },
  EXPIRATION_PERIOD: {
    SHORT: '10m',
    MEDIUM: '4h',
    LONG: '730h',
  },
  AUTH_ATTEMPTS: {
    FOR_IP: 50,
    FOR_IP_AND_USER: 5,
  },
  LOCKOUT_PERIOD: 30, // in units of minutes
  API_TITLE: 'twinm.guide API',
  WEB_TITLE: 'twim.guide',
};

const config = {
  $meta: 'This file configures the twim.guide API.',
  constants: constants,
  projectName: constants.API_TITLE,
  port: {
    $env: 'SERVER_PORT',
  },
  masterPassword: {
    $env: 'MASTER_PASSWORD',
  },
  S3BucketName: {
    $filter: 'env',
    production: 'twim.guide-cdn',
    $default: 'twim.guide-cdn',
  },
  jwtSecret: {
    $env: 'JWT_SECRET',
  },
  ipstackAccessKey: {
    $env: 'IPSTACK_ACCESS_KEY',
  },
  youtubeApiKey: {
    $env: 'YOUTUBE_API_KEY',
  },
  sentryDSN: {
    $env: 'SENTRY_DSN',
  },
  nodemailer: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'unknown@twimknowledge.org',
      pass: { $env: 'SMTP_PASSWORD' },
    },
  },
  /**
   * defaultEmail:
   * If set to null, outgoing emails are sent to their actual address,
   * otherwise outgoing emails are sent to the defaultEmail
   */
  defaultEmail: {
    $filter: 'env',
    production: null,
    $default: 'unknown@twimknowledge.org',
  },
  system: {
    fromAddress: {
      name: 'twim.guide',
      address: 'unknown@twimknowledge.org',
    },
    toAddress: {
      name: 'twim.guide',
      address: 'unknown@twimknowledge.org',
    },
  },
  clientURL: {
    $env: 'CLIENT_URI',
  },
  mongoSSL: false,
  mongoCertFile: '',
  // If true, the 'demoAuth' policy is used to restrict certain actions.
  enableDemoAuth: false,
  esAws: false,
  esEndpoint: {
    $filter: 'env',
    production: {
      node: { $env: 'ES_ENDPOINT' },
      auth: {
        username: { $env: 'ES_USER' },
        password: { $env: 'ES_PASSWORD' },
      },
    },
    $default: {
      node: 'http://elastic:9200',
    },
  },
  // This is the config object passed into the rest-hapi plugin during registration:
  // https://github.com/JKHeadley/rest-hapi#configuration
  restHapiConfig: {
    appTitle: constants.API_TITLE,
    mongo: {
      URI: {
        $env: 'MONGODB_URI',
      },
    },
    cors: {
      additionalHeaders: ['X-Access-Token', 'X-Refresh-Token'],
      additionalExposedHeaders: ['X-Access-Token', 'X-Refresh-Token'],
    },
    absoluteModelPath: true,
    modelPath: path.join(__dirname, '/../server/models'),
    absoluteApiPath: true,
    apiPath: path.join(__dirname, '/../server/api'),
    absolutePolicyPath: true,
    policyPath: path.join(__dirname, '/../server/policies'),
    swaggerHost: {
      $env: 'SERVER_HOST',
    },
    authStrategy: constants.AUTH_STRATEGIES.REFRESH,
    enableWhereQueries: false,
    enableQueryValidation: true,
    enablePayloadValidation: true,
    enableResponseValidation: true,
    enableResponseFail: false,
    enableTextSearch: true,
    enableSoftDelete: true,
    filterDeletedEmbeds: true,
    enablePolicies: true,
    enableDuplicateFields: true,
    trackDuplicatedFields: true,
    enableDocumentScopes: true,
    enableSwaggerHttps: {
      $filter: 'env',
      production: true,
      $default: false,
    },
    generateRouteScopes: true,
    logRoutes: true,
    logScopes: false,
    loglevel: {
      $filter: 'env',
      production: 'DEBUG',
      $default: 'DEBUG',
    },
    auditLogTTL: '30d',
  },
};

const store = new Confidence.Store(config);

const esEndpoint = store.get('/esEndpoint', criteria);
console.log(`Loaded configuration ${criteria.env}: ${JSON.stringify(esEndpoint)}`);

exports.get = function (key) {
  return store.get(key, criteria);
};

exports.meta = function (key) {
  return store.meta(key, criteria);
};
