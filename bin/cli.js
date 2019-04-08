#!/usr/bin/env node

const program = require('commander')
const packageJson = require('../package')
const handleConfig = require('../src/config')
const handleQuery = require('../src/query')
const handleCreate = require('../src/create')

program
  .version(packageJson.version)
  //.option('-l, --list [list]', 'list of customers in CSV file')

program
  .command('config [order]')
  .description('get/set the config file')
  .action(handleConfig)

program
  .command('show [queryString]')
  .description('show projects with queryString')
  .option('-t,--table [table]','display result with cli table')
  .option('-w,--web [web]','display result with web')
  .action(handleQuery)

program
  .command('new')
  .description('create new project')
  .action(handleCreate)

program.parse(process.argv)
