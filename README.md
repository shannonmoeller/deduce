# `deduce`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][amazon-img]][amazon-url]

Composable state containers. Similar in principal to Redux, but prefers named reducers over action objects.

## Install

    $ npm install --save deduce

## Usage

```js
// reducers.js

export default function init(initialState) {
    return Number(initialState) || 0;
}

export function increment(state, val = 1) {
    return state + val;
}

export function decrement(state, val = 1) {
    return increment(state, -val);
}

// store.js

import { composeStore } from 'deduce';
import * as reducers from './reducers';

const store = composeStore(reducers, '1');

store.addListener(() => {
    console.log(store.getState());
});

store.increment();
// log: 2

store.increment(2);
// log: 4

store.decrement(1);
// log: 3
```

```js
// foo.js

export default function foo(initialState) {
    return Number(initialState) || 0;
}

export function fooOffset(state, val = 0) {
    return state + val;
}

// bar.js

export default function bar(initialState) {
    return Number(initialState) || 0;
}

export function barOffset(state, val = 0) {
    return state - val;
}

// store.js

import { composeStoreMap } from 'deduce';
import * as foo from './foo';
import * as bar from './bar';

const store = composeStoreMap(
    {
        foo,
        bar
    },
    {
        foo: '1'
    }
);

store.addListener(() => {
    console.log(store.getState());
});

store.fooOffset(1);
// log: {
//   foo: 2,
//   bar: 0
// }

store.barOffset(1);
// log: {
//   foo: 2,
//   bar: -1
// }
```

## API

### createStore(reducer, initialState) : Store

- `reducer` `Function`
- `initialState` `*`

### composeStore(reducers, initialState) : Store

- `reducers` `Object<String,Function>`
- `initialState` `*`

### composeStoreMap(reducersMap, initialState) : Store

- `reducersMap` `<Object<String,Object<String,Function>>`
- `initialState` `Object<String,*>`

### Store

#### .getState() : *

Returns the current state of the store.

#### .addListener(callback) : Function

- `callback` `Function`
- Returns a function to remove the listener.

#### Dispatchers

TODO - Dispatchers are automatically created based on reducer names. Like Redux actions, reducer names should be globally unique.

## Why?

The typical Redux patterns (admittedly) entail a lot of boilerplate. The documented and accepted [patterns for reducing boilerplate](https://github.com/reactjs/redux/blob/7fe001c/docs/recipes/ReducingBoilerplate.md) really just swap one kind for another:

### Redux Example

The following Redux example creates a store with two values; `foo` which may be incremented and `bar` which may be decremented.

```js
import { createStore, combineReducers } from 'redux';

// foo

const FOO_INCREMENT = 'FOO_INCREMENT';

const fooInitial = 0;

const fooActions = {
    [FOO_INCREMENT]: (state = fooInitial, action) {
        return state + action.payload;
    }
};

function foo(state = {}, action) {
    if (action.type in foo) {
        return fooActions[action.type](state, action);
    }

    return state;
}

function createFooIncrementAction(payload) {
    return {
        type: FOO_INCREMENT,
        payload
    };
}

// bar

const BAR_DECREMENT = 'BAR_DECREMENT';

const barInitial = 0;

const barActions = {
    [BAR_DECREMENT]: (state = barInitial, action) {
        return state - action.payload;
    }
};

function bar(state, action) {
    if (action.type in bar) {
        return barActions[action.type](state, action);
    }

    return state;
}

function createBarDecrementAction(payload) {
    return {
        type: BAR_DECREMENT,
        payload
    };
}

// store

const reducer = combineReducers({ foo, bar });
const store = createStore(reducer, {});

// application

store.dispatch(createFooIncrementAction(1));
store.dispatch(createBarDecrementAction(1));

store.getState();
// {
//   foo: 1,
//   bar: -1
// }
```

Split that up into modules and you can see how new-comers could easily be overwhelmed when the underlying principles are beautifully clean and simple.

### Deduce Exmaple

Compare [the above](#redux-example) with this `deduce` example that does the same thing:

```js
import { createStoreMap } from 'deduce';

// foo

const fooInitial = 0;

const foo = {
    fooIncrement(state = fooInitial, val) {
        return state + val;
    }
};

// bar

const barInitial = 0;

const bar = {
    barDecrement(state = barInitial, val) {
        return state - val;
    }
};

// store

const store = createStoreMap({ foo, bar });

// application

store.fooIncrement(1);
store.barDecrement(1);

store.getState();
// {
//   foo: 1,
//   bar: -1
// }
```

## Tradeoffs

TODO

## Contribute

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

© Shannon Moeller <me@shannonmoeller.com> (http://shannonmoeller.com)

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/deduce/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/deduce
[downloads-img]: http://img.shields.io/npm/dm/deduce.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/deduce.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/deduce
[travis-img]:    http://img.shields.io/travis/shannonmoeller/deduce.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/deduce
