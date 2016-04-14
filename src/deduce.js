/**
 * # Deduce
 */

function applyReducer(state, fn, args) {
	return fn(state, ...args);
}

function applyReducerMap(state, prop, fn, args) {
	return { ...state, [prop]: fn(state[prop], ...args) };
}

/**
 * Creates a store from a reducer function.
 *
 * @method createStore
 * @param {Function} reducer
 * @param {*} state
 * @return {Object} The store.
 */
export function createStore(reducer, state) {
	if (typeof reducer !== 'function') {
		throw new Error('The reducer must be a function.');
	}

	const listeners = [];
	let isDispatching = false;

	function getState() {
		return state;
	}

	function addListener(listener) {
		if (typeof listener !== 'function') {
			throw new Error('The listener must be a function.');
		}

		if (listeners.indexOf(listener) === -1) {
			listeners.push(listener);
		}

		return function removeListener() {
			const index = listeners.indexOf(listener);

			if (index !== -1) {
				listeners.splice(index, 1);
			}
		};
	}

	function dispatch(...args) {
		if (isDispatching) {
			throw new Error('Dispatch in progress.');
		}

		isDispatching = true;
		state = reducer(state, ...args);
		listeners.slice().forEach(l => l());
		isDispatching = false;
	}

	return { getState, addListener, dispatch };
}

/**
 * Composes a store from a set of named reducer functions. Names must be unique.
 *
 * @method composeStore
 * @param {Object<String,Function>} reducers
 * @param {*} state
 * @return {Object} The store.
 */
export function composeStore(reducers, state) {
	const { getState, addListener, dispatch } = createStore(applyReducer, state);
	const store = { getState, addListener };

	if (typeof reducers.default === 'function') {
		dispatch(reducers.default, [state]);
	}

	Object.keys(reducers).forEach(reducerKey => {
		const fn = reducers[reducerKey];

		if (reducerKey === 'default' || typeof fn !== 'function') {
			return;
		}

		if (store.hasOwnProperty(reducerKey)) {
			throw new Error('Reducer names must be unique.');
		}

		store[reducerKey] = (...args) => dispatch(fn, args);
	});

	return store;
}

/**
 * Composes a store whose state properties are mapped to corresponding sets of
 * named reducer functions. Names must be unique.
 *
 * @method composeStoreMap
 * @param {Object<String,Object<String,Function>>} reducersMap
 * @param {*} state
 * @return {Object} The store.
 */
export function composeStoreMap(reducersMap, state = {}) {
	const { getState, addListener, dispatch } = createStore(applyReducerMap, state);
	const storeMap = { getState, addListener };

	Object.keys(reducersMap).forEach(mapKey => {
		const reducers = reducersMap[mapKey];

		if (typeof reducers.default === 'function') {
			dispatch(mapKey, reducers.default, [state[mapKey]]);
		}

		Object.keys(reducers).forEach(reducerKey => {
			const fn = reducers[reducerKey];

			if (reducerKey === 'default' || typeof fn !== 'function') {
				return;
			}

			if (storeMap.hasOwnProperty(reducerKey)) {
				throw new Error('Reducer names must be unique.');
			}

			storeMap[reducerKey] = (...args) => dispatch(mapKey, fn, args);
		});
	});

	return storeMap;
}
