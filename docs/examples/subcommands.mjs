import { yaclil } from 'yaclil';

yaclil({
    rootCommand: {
        name: 'node example.mjs',
        handler: null,
        subcommands: [
            {
                name: 'say-hello',
                handler: event => {
                    console.log('Hello');
                }
            }
        ]
    }
});
