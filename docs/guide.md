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

We will use TypeScript in this guide

```ts
import { yaclil } from 'yaclil';
```

## First Command

Let's make our first command

```ts
import { yaclil } from 'yaclil';

yaclil({
    rootCommand: {
        name: 'ts-node example',
        handler: event => {
            console.log('Hello World');
        }
    }
});
```
