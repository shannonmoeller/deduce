export default function bar(val = 1) {
	return Number(val) || 1;
}

export function barOffset(state, val) {
	return state - val;
}
