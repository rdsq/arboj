# ARBOJ

This is a library for building command line apps, using object declarations,
making its components reusable and readable

## Usage

`arboj` method from this package is the entry point for your app

```js
import { arboj } from '@rdsq/arboj';

arboj({
    // the main command
    // the function that will be called
    handler: (event) => console.log('Hello World'),
    // optional subcommands
    subcommands: {
        subcommand: {
            handler: () => console.log('Hello from "command-name subcommand"'),
        },
    },
}, 'command-name');
// use the command that calls your app here, like `command-name`, `my-cli`, `deno run main.ts`, whatever
```

## Why?

Because I didn't like how other CLI libraries work, I'm not a fan of that functions-calling declaration pattern, so I made something different
