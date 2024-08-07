# ARBOJ

Yet Another (but different) CLI Library

This is a minimal library for building command line apps

## Usage

To use this library, you need to install it (obviously)

```shell
npm install arboj
```

It doesn't support yarn yet

Then use the `arboj` method from this package

```js
import { arboj } from 'arboj';
// or 'npm:arboj' in Deno

arboj({
    // the main command
    // the function that will be called
    handler: event => console.log('Hello World'),
    // optional subcommands
    subcommands: {
        subcommand: { handler: () => console.log('Hello from "command-name subcommand"') }
    }
}, 'command-name');
```

## Bin

You can also assign a package.json bin name to this app

```shell
my-cli say-hello
# output: hello
my-cli say-hi
# output: hi
```

Then don't forget to change the command's name

```js
// ...
arboj({
    // command
}, 'my-cli')
// ...
```
