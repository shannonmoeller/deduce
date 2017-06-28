import test from 'ava';
import deduce from '../src/deduce';

test('should add actions for a property', t => {
	const store = deduce({
		foo: 0,
		bar: 0
	});

	store.addActionsFor('foo', {
		increment: x => x + 1
	});

	store.addActionsFor('bar', {
		decrement: x => x - 1
	});

	t.deepEqual(store.state, {
		foo: 0,
		bar: 0
	});

	store
		.increment()
		.decrement();

	t.deepEqual(store.state, {
		foo: 1,
		bar: -1
	});
});

test('should not reassign actions', t => {
	const store = deduce({foo: 1}, {
		increment: x => x + 1
	});

	t.throws(() => {
		store.addActionsFor('foo', {
			increment: x => x + 2
		});
	});
});

test('should not add non-function actions for a property', t => {
	const store = deduce({foo: 1});

	t.throws(() => {
		store.addActionsFor('foo', {
			increment: 1
		});
	});
});
