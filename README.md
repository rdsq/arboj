# YACLIL

Yet Another (but different) CLI Library

This is a minimal library for building command line apps

## Usage

To use this library, you need to install it (obviously)

```shell
npm install yaclil
```

It doesn't support yarn yet

Then use the `yaclil` method from this package

```js
import { yaclil } from 'yaclil';

yaclil({
    // options
});
```

## Example

This example app will have two commands: `say-hello` and `say-hi`, they will simply print text in the console.

```js
import { yaclil } from 'yaclil';

yaclil({
    rootCommand: { // the command that can be called by `node example.js`
        name: 'node example.js', // the command that will call this app
        subcommands: [ // the command's subcommands. Every command can have them
            { // call with `node example.js say-hello`
                name: 'say-hello',
                handler: event => {
                    console.log('hello');
                }
            },
            { // call with `node example.js say-hi`
                name: 'say-hi',
                handler: event => {
                    console.log('hi');
                }
            }
        ],
        handler: null // this command itself will do nothing
    }
});
```

Now call it:

```shell
node example.js say-hello
node example.js say-hi
```

The output:

```
hello
hi
```

## Bin

You can also assign a package.json bin name to this app

```shell
my-cli say-hello
# output: hello
my-cli say-hi
# output: hi
```

Then don't forget to change the `rootCommand` name

```js
// ...
    rootCommand: { // the command that can be called by `my-cli`
        name: 'my-cli', // the command that will call this app
// ...
```

## TypeScript

Yes, it supports TypeScript
