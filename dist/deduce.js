'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	let actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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

		obj[name] = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			dispatchAction(action, args);

			return obj;
		};
	}

	function addActionFor(property, obj, name, action) {
		if (typeof action !== 'function') {
			throw new TypeError(`Action must be a function: ${name}`);
		}

		addAction(obj, name, function (state) {
			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

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

	return store.addActions(actions);
};

module.exports = exports['default'];