import { ICache } from '../types/interfaces/interfaces';

const cache: ICache = {};

function set(key: string | number, data: {}) {
  cache[key] = {
    data,
    cachedAt: new Date().getTime(),
  };
}

function get(key: string | number) {
  return new Promise((resolve) => {
    resolve(cache[key] && cache[key].cachedAt + 15 * 60 * 1000 > new Date().getTime() ? cache[key].data : null);
  });
}

function invalidate(key: string | number) {
  delete cache[key];
}

export default {
  set,
  get,
  invalidate,
};
