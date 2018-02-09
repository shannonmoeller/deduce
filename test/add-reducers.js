import test from 'blue-tape';
import deduce from '../src/index.js';

test('should add reducers', async t => {
	const store = deduce(1);

	store.addReducers({
		increment: x => x + 1,
		decrement: x => x - 1,
	});

	t.equal(store.state, 1);

	store.increment();

	t.equal(store.state, 2);

	store.decrement().decrement();

	t.equal(store.state, 0);
});

test('should not reassign reducers', async t => {
	const store = deduce(1, {
		increment: x => x + 1,
	});

	t.throws(() => {
		store.addReducers({
			increment: x => x + 2,
		});
	});
});

test('should not add non-function reducers', async t => {
	const store = deduce(1);

	t.throws(() => {
		store.addReducers({
			increment: 1,
		});
	});
});
