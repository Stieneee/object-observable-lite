# object-observable-lite

Observe object changes deeply without cloning in an efficient manner.

## Goals

The package must observe deeply.
The package must not clone the nested objects.
The package must handle all types.
The package should attempt to minimize overhead

## Caveats

Returned changes are not cloned.
Instances and therefore will mutate as the observed object mutates

## object-observable

This is a derivative of [object-observable](https://www.npmjs.com/package/object-observable-lite) with many of the features striped for improved performance.

## Package Comparison

Several similar packages were tested which resulted in this package being created.
The comparison of these packages can be seen here.

[Package Comparison](https://github.com/Stieneee/object-observable-test)

## Usage

``` javascript
const objectObservableLite = require('object-observable-lite');

const obj = testObj = {
  x: 1,
  foo: {
    y: 1,
  },
  bar: ['a', { b: 'b' }],
  today: new Date(),
};

const watchedObject = objectObservableLite(obj, (change) => {
  console.log(change)
});

watchedObject.x = 2;
```

## Opportunities for Improvements

The comparison of other packages suggests there is still room for improvement in the overall efficiency of this package.

Other packages will have to be more deeply analyzed to determine how this package could be improved.

## Contributing

Pull request are welcome.
