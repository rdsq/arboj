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
    // command
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
yaclil({
    // command
}, 'my-cli')
// ...
```

## TypeScript

Yes, it supports TypeScript
