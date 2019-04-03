/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: query
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-04-02-15:01
 * Description:
 *
 *************************************************/
const getConfig = require('./lib/getConfig')
const log = require('./lib/log')
const getProjects = require('./lib/getProjects')
const showTable = require('./lib/showTable')

const checkPath = function(){
  let config = getConfig()

  if(!config.root){
    log.warn('config.json中的root值无效，请先用config set root [path]设置项目目录')
  }else if(!config.name || !config.email){
    log.warn('config.json中的name与email值无效，请先用config set [name|email] [value]完成设置')
  }else{
    return true
  }
}

const queryFilter = function(list,keyword){
  if(typeof keyword !== 'string')return list

  return list.filter(item=>{
    return item.name.indexOf(keyword)>-1 || item.group.indexOf(keyword)>-1
  })
}

module.exports = function(query,cmd){

  if(!checkPath()) return

  let projects = queryFilter(getProjects(),query)

  if(cmd.web){
    // web输出
    log.warn('开发中...')
  }else{
    // table输出（default）
    showTable(projects,query)
  }

}
