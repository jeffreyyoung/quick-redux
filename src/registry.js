const registry = {};

export default {
  set(key, object) {
    registry[key] = object;
  },
  get(key) {
    return registry[key];
  }
}

