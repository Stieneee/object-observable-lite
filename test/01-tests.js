const { expect } = require('chai');
const clone = require('clone');

const ObjectObservable = require('../index');

const today = new Date();

const testObj = {
  x: 1,
  foo: {
    y: 1,
  },
  bar: ['a', { b: 'b' }],
  today: clone(today),
};

const testObjJSON = JSON.stringify(testObj);

const testObjClone = clone(testObj);

let oo = null;
let changes = [];

beforeEach(() => {
  changes = [];
});

describe('Test basic object actions', () => {
  it('test the observable creation', () => {
    oo = ObjectObservable(testObj, (c) => {
      changes.push(c);
      // console.log(c);
      console.log(c.type, c.path, c.value);
    });

    // console.log('Returned Observable', oo);
    expect(changes.length).to.equal(0);
    expect(oo).to.deep.equal(testObjClone);

    // console.log('changes', changes);
  });

  it('test JSON equality', () => {
    expect(JSON.stringify(oo)).to.equal(testObjJSON);
  });

  it('test basic change', () => {
    oo.x = 2;
    // console.log('changes', changes);
    expect(changes.length).to.equal(1);
    expect(changes[0].type).to.equal('set');
    expect(changes[0].key).to.equal('x');
    expect(changes[0].path).to.equal('x');
    expect(changes[0].value).to.equal(2);
  });

  it('test nested change', () => {
    oo.foo.y = 2;
    // console.log('changes', changes);
    expect(changes.length).to.equal(1);
    expect(changes[0].type).to.equal('set');
    expect(changes[0].key).to.equal('y');
    expect(changes[0].path).to.equal('foo.y');
    expect(changes[0].value).to.equal(2);
  });

  it('test array push', () => {
    oo.bar[0] = 'z';
    // console.log('changes', changes);
    expect(changes.length).to.equal(1);
    expect(changes[0].type).to.equal('set');
    expect(changes[0].key).to.equal('0');
    expect(changes[0].path).to.equal('bar.0');
    expect(changes[0].value).to.equal('z');
  });

  it('test array change', () => {
    oo.bar.push('c');
    // console.log('changes', changes);
    expect(changes.length).to.equal(2);
    expect(changes[0].type).to.equal('set');
    expect(changes[0].key).to.equal('2');
    expect(changes[0].path).to.equal('bar.2');
    expect(changes[0].value).to.equal('c');
    expect(changes[1].type).to.equal('set');
    expect(changes[1].key).to.equal('length');
    expect(changes[1].path).to.equal('bar.length');
    expect(changes[1].value).to.equal(3);
  });

  it('test object in array', () => {
    oo.bar.push({ foo: 'bar' });
    // console.log('changes', changes);
    expect(changes.length).to.equal(2);
    expect(changes[1].value).to.equal(4);
  });

  it('test object change in array', () => {
    oo.bar[3].foo = 'barbar';
    // console.log('changes', changes);
    expect(changes.length).to.equal(1);
    expect(changes[0].path).to.equal('bar.3.foo');
  });

  it('test date', () => {
    // expect(oo.today).to.equal(today);
    expect(oo.today.toString()).to.equal(today.toString());
    expect(oo.today.getTime()).to.equal(today.getTime());
    const s = today.getSeconds();
    oo.today.setSeconds(s + 1);
    today.setSeconds(s + 1);
    expect(oo.today.getTime()).to.equal(today.getTime());
    expect(` ${oo.today}`).to.equal(` ${today}`);
  });

  it('test deeply setting', () => {
    oo.foo.deep = {};
    oo.foo.deep.deeper = {};
    oo.foo.deep.deeper.z = 2;
    expect(changes.length).to.equal(3);
  });

  it('test delete', () => {
    delete oo.foo.deep;
  });
});
