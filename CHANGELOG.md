# Changelog

## [Unreleased]

- Added feature to disable further options processing with `--`
- Updated YACLIL function options
- Now `subcommands` is an object, not array
- Added `yaclil/types` path
- Added padding for subcommands and options in help

## 1.4.7 2024-06-18

Removed legacy type declaration in tree graph

## 1.4.6 2024-06-08

- Added reexport for the `Arg` type
- Fixed usage message for objective args declarations

## 1.4.5 2024-06-04

- `-` are not options anymore
- Better performance

## 1.4.4 2024-06-03

- Updated Usage message in help
- Fixed subcommands in tree graph error

## 1.4.3 2024-06-03

Now hidden commands can be overridden in the tree graph generator

## 1.4.2 2024-06-03

Added new feature to hide some command's subcommands under ` +` sign

## 1.4.1 2024-06-03

- Added new feature: ability to hide commands from help and tree graph
- Fixed some typos in the Changelog

## 1.4.0 2024-06-03

- Now YACLIL does not think that negative numbers are options
- Now args can be required

## 1.3.5 2024-06-02

Renamed `returnError` to `exitWithError`

## 1.3.4 2024-05-31

- Increased space between element and its description in help
- Updated package description

## 1.3.3 2024-05-31

Fixed the `treeGraph`

## 1.3.2 2024-05-31

`treeGraph` can now represent commands without handlers as dimmed

## 1.3.1 2024-05-31

There is now `rootCommand` in parsed commands

## 1.3.0 2024-05-31

Added the `treeGraph` function

## 1.2.1 2024-05-31

Added `never` type to `returnError` function

## 1.2.0 2024-05-24

- Description is now showing in the help

## 1.1.2 2024-05-24

- Added the args example link to the header in the [guide](./docs/guide.md)
- Added the [Changelog](./CHANGELOG.md)
- Added the bin string to the docs
- Added types reexport

## 1.1.1 2024-05-24

Updated the documentation:
- Added the [Arguments](./docs/guide.md#Arguments) section to the guide
- Added the [args](./docs/examples/args.mjs) example
- Added links to the examples to guide headers

## 1.1.0 2024-05-24

Fixed everything, updated docs

## 1.0.8 2024-05-24

Added subcommands and options labels to the help screen

## 1.0.7 2024-05-24

Fixed help error

## 1.0.6 2024-05-24

Some fixes

## 1.0.5 2024-05-24

Some fixes

## 1.0.4 2024-05-24

Some fixes

## 1.0.3 2024-05-24

Some fixes

## 1.0.2 2024-05-24

Added GitHub Action

## 1.0.1 2024-05-24

Added [README](./README.md)

## 1.0.0 2024-05-24

Release
