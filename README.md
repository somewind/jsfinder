# Find JS Words

## Features

Search for the specified string outside the comment `//` or `/* */` in the js file

## Installation

```shell
npm i jsfinder -g
```

## Usage

```shell
Usage: jsfinder [options]

Options:
  -V, --version        output the version number
  -s, --source [src]   specify source dir relative path, defaults to ./src (default: "./src")
  -r, --rule [rule]    specify match rule, string or regex, defaults to [\u4e00-\u9fa5]+)
  -m, --print-matches  only print match words
  -h, --help           output usage information
```

```shell
$ jsfinder
测试字符串(/Users/maoshuchen/Documents/dev/data/test/src/app/index.js:4:4)
```

## License

[MIT](./LICENSE)
