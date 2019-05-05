#!/usr/bin/env node
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author somewind https://github.com/somewind
*/
const program = require('commander')
const packageInfo = require('../package.json')
const search = require('./search')

process.title = 'jsfinder'

program
  .version(packageInfo.version)
  .option('-s, --source [src]', 'specify source dir relative path, defaults to ./src', './src')
  .option('-r, --rule [rule]', 'specify match rule, string or regex, defaults to [\u4e00-\u9fa5]+', '[\u4e00-\u9fa5]+')
  .option('-m, --print-matches', 'only print match words, defaults to false')

program.parse(process.argv)

function main () {
  if (!program.rule) {
    return program.help()
  }

  search(program.source, new RegExp(program.rule, 'g'), program.printMatches)
}
main()
