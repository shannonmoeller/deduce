export default function foo(val = 1) {
	return Number(val) || 0;
}

export function fooOffset(state, val) {
	return state + val;
}
