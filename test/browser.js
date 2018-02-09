import test from 'blue-tape';

import './deduce.js';
import './add-listener.js';
import './add-reducers.js';
import './add-reducers-for.js';

test.onFinish(window.__close__);
