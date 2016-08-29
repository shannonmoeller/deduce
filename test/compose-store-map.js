import test from 'ava';
import { composeStoreMap } from '../src/deduce';
import * as foo from './fixtures/foo';
import * as bar from './fixtures/bar';

test('should invoke a mapped reducer', async t => {
	const store = composeStoreMap({ foo, bar });

	t.deepEqual(store.getState(), {
		foo: 1,
		bar: 1
	});

	store.fooOffset(2);

	t.deepEqual(store.getState(), {
		foo: 3,
		bar: 1
	});

	store.barOffset(2);

	t.deepEqual(store.getState(), {
		foo: 3,
		bar: -1
	});
});

test('should add a listener', async t => {
	t.plan(1);

	const store = composeStoreMap({ foo, bar }, { bar: 2 });

	store.addListener(() => {
		t.deepEqual(store.getState(), {
			foo: 3,
			bar: 2
		});
	});

	store.fooOffset(2);
});

test('should disallow name collisions', async t => {
	const a = { foo: () => {} };
	const b = { foo: () => {} };

	t.throws(() => composeStoreMap({ a, b }), /must be unique/);
});
