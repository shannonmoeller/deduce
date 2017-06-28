import test from 'ava';
import deduce from '../src/deduce';

test('should add listeners', t => {
	t.plan(1);

	const store = deduce(1, {
		increment: x => x + 1
	});

	store.addListener(() => {
		t.is(store.state, 2);
	});

	store.increment();
});

test('should remove listeners', t => {
	t.plan(1);

	const store = deduce(1, {
		increment: x => x + 1
	});

	store.addListener(() => {
		t.is(store.state, 2);
	});

	const removeListener = store.addListener(() => {
		t.fail('should not be called');
	});

	removeListener();

	store.increment();
});

test('should not readd listeners', t => {
	t.plan(1);

	const store = deduce(1, {
		increment: x => x + 1
	});

	function aListener() {
		t.is(store.state, 2);
	}

	store.addListener(aListener);
	store.addListener(aListener);

	store.increment();
});

test('should not add non-function listeners', t => {
	const store = deduce(1, {
		increment: x => x + 1
	});

	t.throws(() => {
		store.addListener(1);
	});
});

test('should not allow actions in listeners', t => {
	const store = deduce(1, {
		increment: x => x + 1
	});

	store.addListener(() => {
		store.increment(1);
	});

	t.throws(() => {
		store.increment(1);
	});
});
