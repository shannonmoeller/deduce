import test from 'ava';
import deduce from '../src/deduce';

test('should contain state', t => {
	const storeA = deduce();
	const storeB = deduce({foo: 'bar'});

	t.deepEqual(storeA.state, {});
	t.deepEqual(storeB.state, {foo: 'bar'});
});

test('should modify state', t => {
	const store = deduce(1, {
		increment: x => x + 1
	});

	t.is(store.state, 1);

	store.increment();

	t.is(store.state, 2);
});
