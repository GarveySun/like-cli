/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: showWithTable
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-04-02-16:47
 * Description:
 *
 *************************************************/
const chalk = require('chalk');
const table = require('table');
const path = require('path')
const config = require('../../data/config.json')

const color = function(str, keyword) {
  return !!keyword ? str.replace(new RegExp(keyword,'gi'), function(match){
    return chalk.bgGreen(match)
  }) : str
}

module.exports = function(list,keyword){
  let total = list.length

  console.log(table.table([
    ['ID', 'NAME_ZH', 'GROUP', 'NAME','DIR', 'VER'],
    ...list.map( project =>
      [project.id, project.name_zh, color(project.group, keyword), color(project.name, keyword), project.src_path.replace(path.join(config.root,'/src/pages'),'...'), project.version]
    )
  ]))

  console.log('total:'+total);
}
