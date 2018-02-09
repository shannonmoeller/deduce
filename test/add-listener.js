import test from 'blue-tape';
import deduce from '../src/index.js';

test('should add listeners', async t => {
	const store = deduce(1, {
		increment: x => x + 1,
	});

	store.addListener(() => {
		t.equal(store.state, 2);
	});

	store.increment();
});

test('should remove listeners', async t => {
	const store = deduce(1, {
		increment: x => x + 1,
	});

	store.addListener(() => {
		t.equal(store.state, 2);
	});

	const removeListener = store.addListener(() => {
		t.fail('should not be called');
	});

	removeListener();

	store.increment();
});

test('should not readd listeners', async t => {
	const store = deduce(1, {
		increment: x => x + 1,
	});

	function listener() {
		t.equal(store.state, 2);
	}

	store.addListener(listener);
	store.addListener(listener);

	store.increment();
});

test('should not add non-function listeners', async t => {
	const store = deduce(1, {
		increment: x => x + 1,
	});

	t.throws(() => {
		store.addListener(1);
	});
});

test('should not allow redcuer execution in listeners', async t => {
	const store = deduce(1, {
		increment: x => x + 1,
	});

	store.addListener(() => {
		store.increment(1);
	});

	t.throws(() => {
		store.increment(1);
	});
});
