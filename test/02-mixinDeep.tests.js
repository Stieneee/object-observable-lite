const mixinDeep = require('mixin-deep');

const { o1, o2 } = require('./data');

const ObjectObservable = require('../index');

describe('Test support for mixin-deep', () => {
  it('should mix the objects', () => {
    const changes = [];
    const testObject = o1();
    const secondObject = o2();
    const oo = ObjectObservable(testObject, (c) => {
      changes.push(c);
      // console.log(c);
      // console.log(c.type, c.path, c.value);
      // console.log(c.type, c.path);
    });

    mixinDeep(oo, secondObject);
    // mixinDeep(oo, secondObject);
  });
});
