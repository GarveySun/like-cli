/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: getConfig
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-04-02-14:03
 * Description:
 *
 * @param {string} key
 *
 *************************************************/
const fse = require('fs-extra')
const path = require('path')
const log = require('../lib/log')

module.exports = function(keys){
  let config = fse.readJSONSync(path.join(__dirname,'../../data/config.json'))

  if(!keys || keys.length === 0) return config

  let data = {},unknow = []

  keys.forEach(key=>{
    if(config.hasOwnProperty(key)){
      data[key] = config[key]
    }else{
      unknow.push(key)
    }
  })

  unknow.length > 0 && log.warn('未知的config.json键：' + unknow.join(' '))

  return data
}