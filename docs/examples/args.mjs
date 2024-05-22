import { yaclil } from 'yaclil';

yaclil({
    rootCommand: {
        name: 'node example.mjs',
        handler: null,
        subcommands: [
            {
                name: 'say-hello',
                handler: event => {
                    let message = 'Hello';
                    if (event.options.esperanto) {
                        message = 'Saluton';
                    }
                    if (event.args.to) {
                        message += ` ${to}`;
                    }
                    console.log(message);
                },
                description: 'Just say hello',
                options: [
                    {
                        name: 'esperanto',
                        shortName: 'e',
                        description: 'Say hello in Esperanto'
                    }
                ],
                args: [
                    'to'
                ]
            }
        ]
    }
});
