'use strict';

import redis from 'redis';
import Promise from 'bluebird';
import pkg from '../../package.json';
Promise.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient(6379, '127.0.0.1');

client.on('error', err => console.log('redis error', error));

const PREFIX = pkg.name;

const prefixKey = key => `${PREFIX}/${key}`;

export function get (key) {
  return client.getAsync(prefixKey(key)).then(value => {
    if (!value) {
      throw new Error(`No value for key ${key}`);
    }
    return value;
  });
}

export function getJSON (key) {
  return get(key).then(data => JSON.parse(data));
}

export function set (key, value, cacheTtl) {
  if (cacheTtl) {
    return client.setexAsync(prefixKey(key), cacheTtl, value);
  }
  return client.setAsync(prefixKey(key), value);
}

export function setJSON (key, value, cacheTtl) {
  return set(key, JSON.stringify(value), cacheTtl);
}
