#! /usr/bin/env node

import { performTask } from '../src/index.js';

let task = process.argv[2] || 'default';
performTask( task );
