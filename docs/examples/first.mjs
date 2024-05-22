#!/usr/bin/env node
import { yaclil } from 'yaclil';

yaclil({
    rootCommand: {
        name: 'node example',
        handler: event => {
            console.log('Hello World');
        }
    }
});
