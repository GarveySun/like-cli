/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: index
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-04-02-14:03
 * Description:
 *
 *************************************************/
const getConfig = require('./lib/getConfig')
const log = require('./lib/log')
const fse = require('fs-extra')
const path = require('path')

const handleGet = function(options){
  log.out(getConfig(options))
}

const handleValue = function(value){
  if(value === 'true')return true
  if(value === 'false')return false
  if(/^\d+$/.test(value))return Number(value)
  return value
}

const handleSet = function(options){
  if(options.length !==2){
    log.error('格式不对，应该是config set [key] [value]')
    return
  }

  let config = getConfig()
  if(!config.hasOwnProperty(options[0])){
    log.error('未知的config.json键：' + options[0])
  }else{

    config[options[0]] = handleValue(options[1])

    fse.writeJson(
      path.join(__dirname,'../data/config.json'),
      config,
      {spaces:2},
      err=>{
        if(err) throw err
        log.out(getConfig([options[0]]))
      })
  }
}

module.exports = function([method,...options]){

  switch (method){
    case 'get':
      handleGet(options)
      break;
    case 'set':
      handleSet(options)
      break;
    default:
      log.error('无效的操作参数，lkf config [get|set]')
  }

}
