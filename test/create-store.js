import test from 'ava';
import { createStore } from '../src/deduce';

test('should invoke a reducer', async t => {
	t.plan(2);

	function reducer(state = 1, val) {
		t.is(val, 2);

		return state + val;
	}

	const store = createStore(reducer);

	store.dispatch(2);

	t.is(store.getState(), 3);
});

test('should accept a default', async t => {
	t.plan(2);

	function reducer(state, val) {
		t.is(val, 2);

		return state + val;
	}

	const store = createStore(reducer, 2);

	store.dispatch(2);

	t.is(store.getState(), 4);
});

test('should add a listener', async t => {
	t.plan(5);

	function reducer(state, val) {
		t.pass();

		return state + val;
	}

	const store = createStore(reducer, 2);

	function listenerA() {
		t.is(store.getState(), 4);
	}

	function listenerB() {
		t.is(store.getState(), 4);
	}

	store.addListener(listenerA);

	store.dispatch(2);

	store.addListener(listenerB);
	store.addListener(listenerB);

	store.dispatch(0);
});

test('should remove a listener', async t => {
	t.plan(6);

	function reducer(state, val) {
		t.pass();

		return state + val;
	}

	const store = createStore(reducer, 2);

	function listenerA() {
		t.is(store.getState(), 4);
	}

	function listenerB() {
		t.is(store.getState(), 4);
	}

	const removeListenerA = store.addListener(listenerA);
	const removeListenerB = store.addListener(listenerB);

	store.dispatch(2);

	removeListenerA();

	store.dispatch(0);

	removeListenerB();
	removeListenerB();

	store.dispatch(2);
});

test('should require reducer to be a function', async t => {
	t.throws(() => createStore(), /reducer must be a function/);
});

test('should require listener to be a function', async t => {
	const store = createStore(() => {});

	t.throws(() => store.addListener(), /listener must be a function/);
});

test('should disallow dispatching from a reducer', async t => {
	t.plan(2);

	let store;

	function reducer() {
		store.dispatch();

		t.fail();
	}

	store = createStore(reducer, 1);

	t.throws(() => store.dispatch(1), /in progress/);
	t.is(store.getState(), 1);
});

test('should disallow dispatching from a listener', async t => {
	t.plan(3);

	let store;

	function reducer(state, val) {
		t.pass();

		return state + val;
	}

	function listener() {
		store.dispatch();

		t.fail();
	}

	store = createStore(reducer, 1);
	store.addListener(listener);

	t.throws(() => store.dispatch(1), /in progress/);
	t.is(store.getState(), 2);
});
