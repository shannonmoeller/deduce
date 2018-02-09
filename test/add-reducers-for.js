import test from 'blue-tape';
import deduce from '../src/index.js';

test('should add reducers for a property', async t => {
	const store = deduce({
		foo: 0,
		bar: 0,
	});

	store.addReducersFor('foo', {
		increment: x => x + 1,
	});

	store.addReducersFor('bar', {
		decrement: x => x - 1,
	});

	t.deepEqual(store.state, {
		foo: 0,
		bar: 0,
	});

	store.increment().decrement();

	t.deepEqual(store.state, {
		foo: 1,
		bar: -1,
	});
});

test('should not reassign reducers', async t => {
	const store = deduce(
		{ foo: 1 },
		{
			increment: x => x + 1,
		}
	);

	t.throws(() => {
		store.addReducersFor('foo', {
			increment: x => x + 2,
		});
	});
});

test('should not add non-function reducers for a property', async t => {
	const store = deduce({ foo: 1 });

	t.throws(() => {
		store.addReducersFor('foo', {
			increment: 1,
		});
	});
});
