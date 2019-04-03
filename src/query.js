/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: query
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-04-02-15:01
 * Description:
 *
 *************************************************/
const log = require('./lib/log')
const getProjects = require('./lib/getProjects')
const showTable = require('./lib/showTable')

const queryFilter = function(list,keyword){
  if(typeof keyword !== 'string')return list

  return list.filter(item=>{
    return item.name.indexOf(keyword)>-1 || item.group.indexOf(keyword)>-1
  })
}

module.exports = function(query,cmd){

  let projects = queryFilter(getProjects(),query)

  if(cmd.web){
    // web输出
    log.warn('开发中...')
  }else{
    // table输出（default）
    showTable(projects,query)
  }

}
