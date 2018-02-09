export default function(state = {}, reducers = {}) {
	const listeners = new Set();
	let isDispatching = false;

	function dispatch(reducer, args) {
		if (isDispatching) {
			throw new Error('Infinite loop detected.');
		}

		isDispatching = true;

		try {
			state = reducer(state, ...args);

			listeners.forEach(x => x());
		} catch (err) {
			isDispatching = false;

			throw err;
		}

		isDispatching = false;
	}

	function addReducer(obj, name, reducer) {
		if (typeof reducer !== 'function') {
			throw new TypeError(`Reducer must be a function: ${name}`);
		}

		if (name in obj) {
			throw new Error(`Reducer exists: ${name}`);
		}

		obj[name] = (...args) => {
			dispatch(reducer, args);

			return obj;
		};
	}

	function addReducerFor(property, obj, name, reducer) {
		if (typeof reducer !== 'function') {
			throw new TypeError(`Reducer must be a function: ${name}`);
		}

		addReducer(obj, name, (state, ...args) =>
			Object.assign(state, {
				[property]: reducer(state[property], ...args),
			})
		);
	}

	const store = {
		get state() {
			return state;
		},

		addReducers(reducers) {
			Object.keys(reducers).forEach(name => {
				addReducer(this, name, reducers[name]);
			});

			return this;
		},

		addReducersFor(property, reducers) {
			Object.keys(reducers).forEach(name => {
				addReducerFor(property, this, name, reducers[name]);
			});

			return this;
		},

		addListener(listener) {
			if (typeof listener !== 'function') {
				throw new TypeError(`Listener must be a function.`);
			}

			listeners.add(listener);

			return () => {
				listeners.delete(listener);
			};
		},
	};

	return store.addReducers(reducers);
}
