'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var actions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var listeners = new Set();
	var isDispatching = false;

	function dispatchAction(action, args) {
		if (isDispatching) {
			throw new Error('Infinite loop detected.');
		}

		isDispatching = true;

		try {
			state = action.apply(undefined, [state].concat(_toConsumableArray(args)));

			listeners.forEach(function (x) {
				return x();
			});
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
				[property]: action.apply(undefined, [state[property]].concat(args))
			});
		});
	}

	var store = {
		get state() {
			return state;
		},

		addActions(actions) {
			var _this = this;

			Object.keys(actions).forEach(function (name) {
				addAction(_this, name, actions[name]);
			});

			return this;
		},

		addActionsFor(property, actions) {
			var _this2 = this;

			Object.keys(actions).forEach(function (name) {
				addActionFor(property, _this2, name, actions[name]);
			});

			return this;
		},

		addListener(listener) {
			if (typeof listener !== 'function') {
				throw new TypeError(`Listener must be a function.`);
			}

			listeners.add(listener);

			return function () {
				listeners.delete(listener);
			};
		}
	};

	return store.addActions(actions);
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = exports['default'];