import test from 'ava';
import { composeStore } from '../src/deduce';

test('should invoke a named reducer', async t => {
	const store = composeStore({
		default: () => 1,
		offset: (state, val) => state + val
	});

	store.offset(2);

	t.is(store.getState(), 3);
});

test('should add a listener', async t => {
	t.plan(1);

	const store = composeStore({
		offset: (state = 1, val) => state + val
	});

	store.addListener(() => {
		t.is(store.getState(), 3);
	});

	store.offset(2);
});
