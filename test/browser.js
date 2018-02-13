import test from 'blue-tape';

import './node.js';

test.onFinish(window.__close__);
