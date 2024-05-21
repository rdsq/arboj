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

This example app will have two commands: `hello` and `hi`, they will simply print text in the console.

```js
import { yaclil } from 'yaclil';

yaclil({
    rootCommand: { // the command that can be called by `node example.js`
        name: 'node example.js', // the command that will call this app
        subcommands: [ // the command's subcommands. Every command can have them
            { // call with `node example.js hello`
                name: 'hello',
                handler: event => {
                    console.log('hello');
                }
            },
            { // call with `node example.js hi`
                name: 'hi',
                handler: event => {
                    console.log('hi')
                }
            }
        ],
        handler: null // this command itself will do nothing
    }
});
```

Now call it

```shell
node example.js hello
node example.js hi
```

The output:

```
hello
hi
```

## Bin

You can also assign a package.json bin name to this app

```shell
my-cli hello
# output: hello
my-cli hi
# output: hi
```

## TypeScript

Yes, it supports TypeScript
