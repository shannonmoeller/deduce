'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (state = {}) {
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

	return {
		get state() {
			return state;
		},

		addActions(actions) {
			Object.keys(actions).forEach(name => {
				addAction(this, name, actions[name]);
			});

			return this;
		},

		addListener(listener) {
			listeners.add(listener);

			return () => {
				listeners.remove(listener);
			};
		}
	};
};

module.exports = exports['default'];