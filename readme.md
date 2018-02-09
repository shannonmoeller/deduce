# deduce

[![NPM version][npm-img]][npm-url]
[![Downloads][downloads-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage Status][coveralls-img]][coveralls-url]
[![Tip][amazon-img]][amazon-url]

Ridiculously easy JavaScript state containers with reducer methods. Like [Redux](https://github.com/reactjs/redux) without all of the boilerplate.

## Install

```
npm install --save deduce
```

## Usage

```js
// reducers.js

export function increment(state, val = 1) {
    return state + val;
}

export function decrement(state, val = 1) {
    return increment(state, -val);
}

// store.js

import deduce from 'deduce';
import * as reducers from './reducers';

const store = deduce(1, reducers);

store.addListener(() => {
    console.log(store.state);
});

store.increment();  // -> 2
store.increment(2); // -> 4
store.decrement();  // -> 3
store.decrement(2); // -> 1
```

## API

### deduce(initialState, reducers) : Store

- `initialState` `{*}`
- `reducers` `{Object<String,Function>}`

### Store

#### .state

Current state of the store.

```js
const store = deduce({ foo: 1 });

console.log(store.state); // -> { foo: 1 }
```

#### .addReducers(reducers): Store

- `reducers` `{Object<String,Function>}`

Registers reducers to modify the state. Chainable.

```js
store.addReducers({
    increment(state, val) {
        return {
            ...state,
            foo: state.foo + val,
        };
    },
});
```

#### .addReducersFor(property, reducers): Store

- `property` `{String}`
- `reducers` `{Object<String,Function>}`

Registers reducers to modify a specific state property. Chainable.

```js
store.addReducersFor('foo', {
    increment(state, val) {
        return state + val;
    },
});
```

#### .addListener(callback): Function

- `callback` `{Function}`

Adds a listener to be called any time the state is updated. Returns a function to remove the listener.

```js
const removeListener = store.addListener(() => {
    console.log(store.state);
});

store.increment();
```

## Why?

The typical Redux patterns entail a lot of boilerplate. The documented and accepted [patterns for reducing boilerplate](https://github.com/reactjs/redux/blob/7fe001c/docs/recipes/ReducingBoilerplate.md) really just swap one kind for another:

### Redux Example

Consider the following Redux example that creates a store with two numbers: `foo` which may be incremented and `bar` which may be decremented.

```js
// foo

const FOO_INCREMENT = 'FOO_INCREMENT';

const fooInitial = 0;

const fooReducers = {
    [FOO_INCREMENT]: (state = fooInitial, action) {
        return state + action.payload;
    }
};

function foo(state = {}, action) {
    if (action.type in fooReducers) {
        return fooReducers[action.type](state, action);
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

const barReducers = {
    [BAR_DECREMENT]: (state = barInitial, action) {
        return state - action.payload;
    }
};

function bar(state, action) {
    if (action.type in barReducers) {
        return barReducers[action.type](state, action);
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

import { createStore, combineReducers } from 'redux';

const reducer = combineReducers({ foo, bar });
const store = createStore(reducer, {});

// application

store.dispatch(createFooIncrementAction(1));
store.dispatch(createBarDecrementAction(1));

console.log(store.getState());
// {
//   foo: 1,
//   bar: -1
// }
```

Split that up into modules and you can see how new-comers could easily be overwhelmed when the underlying principles are beautifully clean and simple.

### Deduce Example

Compare [the above](#redux-example) with this `deduce` example that does the same thing:

```js
// foo

const fooInitial = 0;

const fooReducers = {
    incrementFoo(state = fooInitial, val) {
        return state + val;
    }
};

// bar

const barInitial = 0;

const barReducers = {
    decrementBar(state = barInitial, val) {
        return state - val;
    }
};

// store

import deduce from 'deduce';

const store = deduce()
    .addReducersFor('foo', fooReducers)
    .addReducersFor('bar', barReducers);

// application

store.incrementFoo(1);
store.decrementBar(1);

console.log(store.state);
// {
//   foo: 1,
//   bar: -1
// }
```

## Contribute

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

MIT © [Shannon Moeller](http://shannonmoeller.com)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/deduce/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/deduce
[downloads-img]: http://img.shields.io/npm/dm/deduce.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/deduce.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/deduce
[travis-img]:    http://img.shields.io/travis/shannonmoeller/deduce/master.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/deduce
