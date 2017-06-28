import test from 'ava';
import deduce from '../src/deduce';

test('should add actions', t => {
	const store = deduce(1);

	store.addActions({
		increment: x => x + 1,
		decrement: x => x - 1
	});

	t.is(store.state, 1);

	store.increment();

	t.is(store.state, 2);

	store
		.decrement()
		.decrement();

	t.is(store.state, 0);
});

test('should not reassign actions', t => {
	const store = deduce(1, {
		increment: x => x + 1
	});

	t.throws(() => {
		store.addActions({
			increment: x => x + 2
		});
	});
});

test('should not add non-function actions', t => {
	const store = deduce(1, {
		increment: x => x + 1
	});

	t.throws(() => {
		store.addActions({
			decrement: 1
		});
	});
});
