export default function (state = {}, actions = {}) {
	const listeners = new Set();
	let isDispatching = false;

	function dispatchAction(action, args) {
		if (isDispatching) {
			throw new Error('Infinite loop detected.');
		}

		isDispatching = true;

		try {
			state = action(state, ...args);

			listeners.forEach(x => x());
		} catch (err) {
			isDispatching = false;

			throw err;
		}

		isDispatching = false;
	}

	function addAction(obj, name, action) {
		if (typeof action !== 'function') {
			throw new TypeError(`Action must be a function: ${name}`);
		}

		if (name in obj) {
			throw new Error(`Action exists: ${name}`);
		}

		obj[name] = (...args) => {
			dispatchAction(action, args);

			return obj;
		};
	}

	function addActionFor(property, obj, name, action) {
		if (typeof action !== 'function') {
			throw new TypeError(`Action must be a function: ${name}`);
		}

		addAction(obj, name, (state, ...args) => {
			return Object.assign(state, {
				[property]: action(state[property], ...args)
			});
		});
	}

	const store = {
		get state() {
			return state;
		},

		addActions(actions) {
			Object.keys(actions).forEach(name => {
				addAction(this, name, actions[name]);
			});

			return this;
		},

		addActionsFor(property, actions) {
			Object.keys(actions).forEach(name => {
				addActionFor(property, this, name, actions[name]);
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
		}
	};

	return store
		.addActions(actions);
}
