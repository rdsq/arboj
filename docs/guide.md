# Guide

This is a guide to YACLIL

## Installation

First of all, you will need to install it to your project

```shell
npm install yaclil
```

Yarn is not supported yet

## Import

Then import it

```js
import { yaclil } from 'yaclil';
```

## First Command

Let's make our [first](./examples/first.js) command

```js
import { yaclil } from 'yaclil';

yaclil({
    rootCommand: {
        name: 'node example.mjs',
        handler: event => {
            console.log('Hello World');
        }
    }
});
```

## Explanation

```js
yaclil({});
```

So, yaclil is the function that will initialize the app

```js
rootCommand: {}
```

`rootCommand` is the command that will represent the app itself

```js
name: 'node example.mjs'
```

`name` is the name of the command that it can be called with. For root commands it is not necessary, you can pass here anything, but it is recommended to put here the command that the app can be called, for example `node example.mjs` if this app is placed in the `example.mjs` file and has no PATH. If your app has it, you can pass it here, for example `name: 'my-cli'`.

```js
handler: event => {}
```

`handler` is the function that will be called when the command is called. Event object has some data like `args`, `options`, we will talk about them later

## Run

Now run it:

```shell
node example.mjs
```

Output:

```
Hello World
```

## Description

It is not required, but recommended to add description to your commands

```js
{
    name: 'example-command',
    description: 'This command does nothing',
    handler: event => {}
}
```

This is that simple

## Subcommands

Any command can have subcommands, they have tree-like structure. Let's make one

```js
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
```

Here we have the `say-hello` command that is a subcommand of the main one

It can be called by:

```shell
node example.mjs say-hello
```

You also could notice that the handler of the root command is `null`. This means that it can't be called. If we try to call it:

```shell
node example.mjs
```

It will return this error:

```
Error: this command is not callable
Use "node example.mjs --help" to get help on this command
```

But if you want you can set a handler here and it will work fine

## Help

You can get help on any command by adding `--help` or `-h`. For example:

```shell
node example.mjs -h
```

Will return:

```
(not callable)

Subcommands:
say-hello

(no options)
```

## Options

You can add options to your commands (like `--example` or `-e`)

```js
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
                    console.log(message);
                },
                description: 'Just say hello',
                options: [
                    {
                        name: 'esperanto',
                        shortName: 'e',
                        description: 'Say hello in Esperanto'
                    }
                ]
            }
        ]
    }
});
```

Here we added an option to say hello, but in Esperanto

If we call it:

```shell
node example.mjs say-hello
node example.mjs say-hello --esperanto
```

It would say:

```
Hello
Saluton
```
