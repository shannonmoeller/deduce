import test from 'blue-tape';
import deduce from '../src/index.js';

test('should contain state', async t => {
	const storeA = deduce();
	const storeB = deduce({ foo: 'bar' });

	t.deepEqual(storeA.state, {});
	t.deepEqual(storeB.state, { foo: 'bar' });
});

test('should modify state', async t => {
	const store = deduce(1, {
		increment: x => x + 1,
	});

	t.equal(store.state, 1);

	store.increment();

	t.equal(store.state, 2);
});
