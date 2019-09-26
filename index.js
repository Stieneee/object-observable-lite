const weakOnChange = new WeakMap();
const weakPath = new WeakMap();

function isObservable(object) {
  return typeof (object) === 'object' && object && weakOnChange.has(object);
}

function proxyGet(target, key) {
  // HACK: https://bugs.chromium.org/p/v8/issues/detail?id=4814
  // console.log('proxyGet', target, key, typeof key);
  if (target instanceof Date && typeof target[key] === 'function' && Date.prototype.hasOwnProperty(key)) {
    if (key.substr && key.substr(0, 3) === 'set') {
      return (...args) => {
        const s = key.substr(3, key.length).toLowerCase();
        if (!weakOnChange.has(target) || !weakPath.has(target)) throw new Error('no weakmap reference to date target');
        const old = new Date(target);
        target[key](...args);
        changed({
          type: 'set',
          target,
          key: s,
          value: target,
          old,
        }, undefined);
      };
    }
    // Return bound method
    return target[key].bind(target);
  }

  if (target instanceof Date && key.toString() === 'Symbol(Symbol.toPrimitive)') return Date.prototype[Symbol.toPrimitive].bind(target);
  if (target instanceof Date && key.toString() === 'Symbol(Symbol.toStringTag)') return Reflect.get(target, key) ? Reflect.get(target, key) : 'Date';

  return target[key];
}

function proxySet(target, key, value) {
  const old = target[key];

  if (typeof (value) === 'object' && value) {
    if (!isObservable(value)) target[key] = create(value, [...weakPath.get(target), key], weakOnChange.get(target));
  } else {
    target[key] = value;
  }

  changed({
    type: 'set',
    target,
    key,
    value,
    old,
  }, key);

  return true; // required by proxy
}

function proxyDeleteProperty(target, key) {
  let old = target[key];

  if (Array.isArray(target)) old = target.splice(key, 1);
  else old = delete (target[key]);

  changed({
    type: 'deleteProperty',
    target,
    key,
  }, key);
  // OK
  return old;
}

function changed(change, path) {
  // Add prefix - append
  if (!weakPath.has(change.target)) throw new Error('missing path reference in WeakMap');

  if (path) change.path = [...weakPath.get(change.target), path].join('.');
  else change.path = weakPath.get(change.target).join('.');

  if (!weakOnChange.has(change.target)) throw new Error('missing change callback reference in WeakMap');
  weakOnChange.get(change.target)(change);
}

function create(object, path, onChange) {
  if (!onChange) {
    onChange = path;
    path = [];
  }
  weakOnChange.set(object, onChange);
  weakPath.set(object, path);

  if (Array.isArray(object)) {
    for (let i = 0; i < object.length; i += 1) {
      if (typeof (object[i]) === 'object' && object[i]) {
        // Is it already observable?
        if (!isObservable(object[i])) {
          object[i] = create(object[i], [...path, i], onChange);
        }
      }
    }
  } else {
    const keys = Object.keys(object);
    for (let k = 0; k < keys.length; k += 1) {
      const key = keys[k];
      if (typeof (object[key]) === 'object' && object[key]) {
        if (!isObservable(object[key])) {
          object[key] = create(object[key], [...path, key], onChange);
        }
      }
    }
  }

  const proxy = new Proxy(object, {
    get: proxyGet,
    set: proxySet,
    deleteProperty: proxyDeleteProperty,
  });

  return proxy;
}

module.exports = create;
