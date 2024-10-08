# Changelog

## [Unreleased]

- Removed subcommand args count from help
- Fixed `argAsType` so it returns `undefined` when arg was not provided
- Added `countSubcommandsCommand` to `std`
- Added `expectFail` option to `CommandFromModule`

## v3.0.2 2024-08-15

- Added `CommandFromModule` util

## v3.0.1 2024-08-15

- Updated [README](./README.md)
- Fixed `treeGraphCommand` and `treeGraphOption`

## v3.0.0 2024-08-07

- Updated tree graph command error message to include the command of the
  subcommand
- Updated usage in [README](README.md)
- Added a function to count subcommands: `countSubcommands` in `arboj/util`
- Added tree path rendering to `treeGraph` function
- Tree graph is now dimming target command if it is not callable
- Updated doc strings
- Removed `helpOption` from `ParsedCommand` type
- Added standalone options
- Added global options, completely redesigned help logic
- Added `argv` and `initOptions` to the parsed object
- Removed deprecated objects
- Added `treeGraphOption` to `std`
- Added `VersionOption` to `std` to easily create `--version -v` flags
- Renamed `customArgv` to `argv`, which requires removing first two arguments on
  node
- Replaced `args` in options with `arg`, which passes by `--example=arg`
- Now if no `cliName` passed, it sets `unnamed-cli`
- Updated return value of args from string to object
- Added an async util `navigateSubcommands`
- Made `treeGraph` and `arboj` async
- Removed `Handler` type
- Added dynamic commands
- Renamed `utils` to `util`
- Added `argAsType` to `util` (with simple types)
- Renamed `pre` to `std`
- Switched to Deno and JSR
- Renamed the project from `yaclil` to `arboj`

## v2.1.0 2024-07-18

- Added colors to the `+` on commands with hidden subcommands in the tree graph
- `-` is not an option anymore (again)
- Changed types file extensions from `.ts` to `.d.ts`
- Added `pre` export with `treeGraphCommand`
- When the target command doesn't have subcommands, `treeGraph` shows the
  `(empty)` message

## v2.0.3 2024-07-14

- Fixed unexpected arguments when allowed

## v2.0.2 2024-07-13

- Updated error message from `Error: unexpected arg` to
  `Error: unexpected argument`
- Added v to versions in Changelog
- Fixed option argument rendering in usage error

## v2.0.1 2024-07-07

- Added `appName` (basically `treePath[0]`) to the event object
- Fixed "unexpected argument" error

## v2.0.0 2024-06-19

- Added feature to disable further options processing with `--`
- Updated YACLIL function options
- Now `subcommands` is an object, not array
- Added `yaclil/types` path
- Added padding for subcommands and options in help

## v1.4.7 2024-06-18

Removed legacy type declaration in tree graph

## v1.4.6 2024-06-08

- Added reexport for the `Arg` type
- Fixed usage message for objective args declarations

## v1.4.5 2024-06-04

- `-` are not options anymore
- Better performance

## v1.4.4 2024-06-03

- Updated Usage message in help
- Fixed subcommands in tree graph error

## v1.4.3 2024-06-03

Now hidden commands can be overridden in the tree graph generator

## v1.4.2 2024-06-03

Added new feature to hide some command's subcommands under `+` sign

## v1.4.1 2024-06-03

- Added new feature: ability to hide commands from help and tree graph
- Fixed some typos in the Changelog

## v1.4.0 2024-06-03

- Now YACLIL does not think that negative numbers are options
- Now args can be required

## v1.3.5 2024-06-02

Renamed `returnError` to `exitWithError`

## v1.3.4 2024-05-31

- Increased space between element and its description in help
- Updated package description

## v1.3.3 2024-05-31

Fixed the `treeGraph`

## v1.3.2 2024-05-31

`treeGraph` can now represent commands without handlers as dimmed

## v1.3.1 2024-05-31

There is now `rootCommand` in parsed commands

## v1.3.0 2024-05-31

Added the `treeGraph` function

## v1.2.1 2024-05-31

Added `never` type to `returnError` function

## v1.2.0 2024-05-24

- Description is now showing in the help

## v1.1.2 2024-05-24

- Added the args example link to the header in the [guide](./docs/guide.md)
- Added the [Changelog](./CHANGELOG.md)
- Added the bin string to the docs
- Added types reexport

## v1.1.1 2024-05-24

Updated the documentation:

- Added the [Arguments](./docs/guide.md#Arguments) section to the guide
- Added the [args](./docs/examples/args.mjs) example
- Added links to the examples to guide headers

## v1.1.0 2024-05-24

Fixed everything, updated docs

## v1.0.8 2024-05-24

Added subcommands and options labels to the help screen

## v1.0.7 2024-05-24

Fixed help error

## v1.0.6 2024-05-24

Some fixes

## v1.0.5 2024-05-24

Some fixes

## v1.0.4 2024-05-24

Some fixes

## v1.0.3 2024-05-24

Some fixes

## v1.0.2 2024-05-24

Added GitHub Action

## v1.0.1 2024-05-24

Added [README](./README.md)

## v1.0.0 2024-05-24

Release
